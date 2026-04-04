import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { getServiceSupabase } from "@/lib/supabase";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { validate, resetPasswordSchema } from "@/lib/validation";
import { validateOrigin, isTrustedSource } from "@/lib/csrf";

export async function POST(req: NextRequest) {
  if (!isTrustedSource(req) && !validateOrigin(req)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const rl = checkRateLimit(ip, "auth");
  if (!rl.allowed) return rateLimitResponse(rl);

  try {
    const body = await req.json();
    const parsed = validate(resetPasswordSchema, body);
    if ('error' in parsed) return parsed.error;
    const { token, password } = parsed.data;

    const supabase = getServiceSupabase();

    // Look up token
    const { data: resetToken } = await supabase
      .from("password_reset_tokens")
      .select("id, user_id, expires_at")
      .eq("token", token)
      .single();

    if (!resetToken) {
      return NextResponse.json({ error: "Invalid or expired reset link" }, { status: 400 });
    }

    // Check expiry
    if (new Date(resetToken.expires_at) < new Date()) {
      // Clean up expired token
      await supabase.from("password_reset_tokens").delete().eq("id", resetToken.id);
      return NextResponse.json({ error: "This reset link has expired. Please request a new one." }, { status: 400 });
    }

    // Hash new password
    const passwordHash = await hash(password, 10);

    // Update user password
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ password_hash: passwordHash })
      .eq("id", resetToken.user_id);

    if (updateError) {
      return NextResponse.json({ error: "Failed to update password. Please try again." }, { status: 500 });
    }

    // Delete the used token
    await supabase.from("password_reset_tokens").delete().eq("id", resetToken.id);

    return NextResponse.json({ success: true, message: "Password has been reset successfully." });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

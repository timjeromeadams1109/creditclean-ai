import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { sendNotification } from "@/lib/email";
import { passwordResetEmail } from "@/lib/email-templates";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const rl = checkRateLimit(ip, "auth");
  if (!rl.allowed) return rateLimitResponse(rl);

  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const supabase = getServiceSupabase();

    // Look up user — but always return 200 regardless
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, full_name, email")
      .eq("email", normalizedEmail)
      .single();

    if (profile) {
      const token = crypto.randomUUID();
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

      // Upsert token (one active token per user)
      await supabase
        .from("password_reset_tokens")
        .upsert(
          {
            user_id: profile.id,
            token,
            expires_at: expiresAt,
          },
          { onConflict: "user_id" }
        );

      const appUrl = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      const resetUrl = `${appUrl}/auth/reset-password?token=${token}`;
      const firstName = profile.full_name?.split(" ")[0] || "there";

      const emailContent = passwordResetEmail(firstName, resetUrl);
      sendNotification([profile.email], emailContent.subject, emailContent.html).catch(() => {});
    }

    // Always return success to avoid leaking whether email exists
    return NextResponse.json({
      message: "If an account with that email exists, we've sent a password reset link.",
    });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

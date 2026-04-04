import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { getServiceSupabase } from "@/lib/supabase";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { isDisposableEmail } from "@/lib/disposable-emails";
import { sendNotification } from "@/lib/email";
import { welcomeEmail } from "@/lib/email-templates";
import { validate, signupSchema } from "@/lib/validation";
import { validateOrigin, isTrustedSource } from "@/lib/csrf";

export async function POST(req: NextRequest) {
  if (!isTrustedSource(req) && !validateOrigin(req)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Rate limit by IP to prevent brute-force signups
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const rl = checkRateLimit(ip, "auth");
  if (!rl.allowed) return rateLimitResponse(rl);

  try {
    const body = await req.json();
    const parsed = validate(signupSchema, body);
    if ('error' in parsed) return parsed.error;
    const { name, email, password } = parsed.data;

    const normalizedEmail = email.toLowerCase().trim();

    // Block disposable/temporary email addresses
    if (isDisposableEmail(normalizedEmail)) {
      return NextResponse.json(
        { error: "Please use a permanent email address. Temporary/disposable emails are not accepted." },
        { status: 400 }
      );
    }

    const supabase = getServiceSupabase();

    // Check if email already exists
    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", normalizedEmail)
      .single();

    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
    }

    const passwordHash = await hash(password, 10);

    const { error: insertError } = await supabase.from("profiles").insert({
      email: normalizedEmail,
      full_name: name.trim(),
      password_hash: passwordHash,
      role: "user",
      subscription_tier: "free",
    });

    if (insertError) {
      return NextResponse.json({ error: "Failed to create account. Please try again." }, { status: 500 });
    }

    // Send welcome email (async — don't block signup)
    const welcome = welcomeEmail(name.trim().split(" ")[0] || "there");
    sendNotification([normalizedEmail], welcome.subject, welcome.html).catch(() => {});

    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

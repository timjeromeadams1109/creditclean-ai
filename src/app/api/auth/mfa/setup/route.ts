/**
 * POST /api/auth/mfa/setup
 *
 * Generates a new TOTP secret and returns the otpauth:// URI so the
 * client can render a QR code. The secret is NOT persisted here — it
 * is stored only after the user confirms setup via /api/auth/mfa/verify-setup.
 *
 * The secret is returned encrypted so it can be round-tripped through
 * the client without being readable in plaintext.
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { generateTotpSecret, buildOtpAuthUri, encryptSecret } from "@/lib/mfa";
import { validateOrigin, isTrustedSource } from "@/lib/csrf";

export async function POST(req: NextRequest) {
  if (!isTrustedSource(req) && !validateOrigin(req)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const rl = checkRateLimit(ip, "auth");
  if (!rl.allowed) return rateLimitResponse(rl);

  const email = session.user.email ?? "user";
  const plainSecret = generateTotpSecret();
  const uri = buildOtpAuthUri(plainSecret, email);
  // Encrypt so it can be safely passed back in verify-setup without
  // ever exposing the plaintext secret to the client.
  const encryptedSecret = encryptSecret(plainSecret);

  return NextResponse.json({ uri, encryptedSecret });
}

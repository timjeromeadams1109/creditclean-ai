/**
 * POST /api/auth/mfa/verify-setup
 *
 * User submits their first TOTP code to confirm they've scanned the QR
 * code correctly. On success:
 *   - Stores the encrypted TOTP secret in profiles.mfa_secret
 *   - Sets profiles.mfa_enabled = true
 *   - Generates 8 backup codes, bcrypt-hashes them, stores in profiles.mfa_backup_codes
 *   - Returns the plaintext backup codes (shown once — never again)
 */

import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getServiceSupabase } from "@/lib/supabase";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { validateOrigin, isTrustedSource } from "@/lib/csrf";
import {
  decryptSecret,
  verifyTotpCode,
  generateBackupCodes,
  hashBackupCodes,
} from "@/lib/mfa";

const BodySchema = z.object({
  encryptedSecret: z.string().min(1),
  code: z.string().length(6).regex(/^\d{6}$/, "Code must be 6 digits"),
});

export async function POST(req: NextRequest) {
  if (!isTrustedSource(req) && !validateOrigin(req)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id?: string }).id;
  if (!userId) {
    return NextResponse.json({ error: "No user ID in session" }, { status: 400 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const rl = checkRateLimit(ip, "auth");
  if (!rl.allowed) return rateLimitResponse(rl);

  const body = await req.json();
  const result = BodySchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: "Validation failed", details: result.error.flatten() },
      { status: 400 }
    );
  }

  const { encryptedSecret, code } = result.data;

  let plainSecret: string;
  try {
    plainSecret = decryptSecret(encryptedSecret);
  } catch {
    return NextResponse.json({ error: "Invalid secret" }, { status: 400 });
  }

  if (!verifyTotpCode(plainSecret, code)) {
    return NextResponse.json({ error: "Invalid code" }, { status: 400 });
  }

  // Code is valid — persist MFA data
  const backupCodes = generateBackupCodes();
  const hashedCodes = await hashBackupCodes(backupCodes);

  const supabase = getServiceSupabase();
  const { error } = await supabase
    .from("profiles")
    .update({
      mfa_enabled: true,
      mfa_secret: encryptedSecret,
      mfa_backup_codes: hashedCodes,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (error) {
    console.error("[POST /api/auth/mfa/verify-setup]", error);
    return NextResponse.json({ error: "Failed to enable MFA" }, { status: 500 });
  }

  console.info(`[MFA] Enabled for user ${userId}`);

  // Return plaintext backup codes — shown once, never retrievable again
  return NextResponse.json({ backupCodes });
}

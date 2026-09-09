/**
 * Tests for POST /api/auth/mfa/verify (src/app/api/auth/mfa/verify/route.ts)
 *
 * Each test uses a unique x-forwarded-for IP to avoid rate-limit collisions.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("next-auth", () => ({ getServerSession: vi.fn() }));
vi.mock("@/lib/supabase", () => ({ getServiceSupabase: vi.fn() }));
vi.mock("@/lib/mfa", () => ({
  decryptSecret: vi.fn().mockReturnValue("JBSWY3DPEHPK3PXP"),
  verifyTotpCode: vi.fn(),
  verifyBackupCode: vi.fn(),
}));

import { getServerSession } from "next-auth";
import { getServiceSupabase } from "@/lib/supabase";
import { verifyTotpCode, verifyBackupCode } from "@/lib/mfa";
import { POST } from "@/app/api/auth/mfa/verify/route";

const mockGetServerSession = vi.mocked(getServerSession);
const mockGetServiceSupabase = vi.mocked(getServiceSupabase);
const mockVerifyTotpCode = vi.mocked(verifyTotpCode);
const mockVerifyBackupCode = vi.mocked(verifyBackupCode);

const USER_SESSION = { user: { id: "user-mfa-1", email: "mfa@test.com" } };

// Unique IP per test to avoid rate-limit collisions
let ipSeq = 1000;
function nextIp() {
  return `192.168.${Math.floor(ipSeq / 255)}.${ipSeq++ % 255}`;
}

function makeRequest(body: unknown, ip?: string) {
  return new Request("http://localhost:3000/api/auth/mfa/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": ip ?? nextIp(),
      origin: "http://localhost:3000",
    },
    body: JSON.stringify(body),
  });
}

function buildProfileMock(overrides: Record<string, unknown> = {}) {
  const profile = {
    mfa_enabled: true,
    mfa_secret: "encrypted-secret",
    mfa_backup_codes: ["hash1", "hash2"],
    ...overrides,
  };
  return {
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: profile, error: null }),
      update: vi.fn().mockReturnThis(),
    }),
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  (process.env as unknown as { NODE_ENV: string }).NODE_ENV = "development";
});

// ── Auth guard ────────────────────────────────────────────────────────

describe("POST /api/auth/mfa/verify — Auth", () => {
  it("returns 401 when no session", async () => {
    mockGetServerSession.mockResolvedValue(null);
    const res = await POST(makeRequest({ code: "123456" }) as never);
    expect(res.status).toBe(401);
  });

  it("returns 400 when session has no user id", async () => {
    mockGetServerSession.mockResolvedValue({ user: { email: "test@test.com" } });
    const res = await POST(makeRequest({ code: "123456" }) as never);
    expect(res.status).toBe(400);
  });
});

// ── Input validation ──────────────────────────────────────────────────

describe("POST /api/auth/mfa/verify — Validation", () => {
  beforeEach(() => {
    mockGetServerSession.mockResolvedValue(USER_SESSION);
    mockGetServiceSupabase.mockReturnValue(buildProfileMock() as never);
  });

  it("returns 400 for empty code", async () => {
    const res = await POST(makeRequest({ code: "" }) as never);
    expect(res.status).toBe(400);
  });

  it("returns 400 for code longer than 12 characters", async () => {
    const res = await POST(makeRequest({ code: "1234567890123" }) as never);
    expect(res.status).toBe(400);
  });
});

// ── MFA not enabled ───────────────────────────────────────────────────

describe("POST /api/auth/mfa/verify — MFA state", () => {
  it("returns 400 when MFA is not enabled for the user", async () => {
    mockGetServerSession.mockResolvedValue(USER_SESSION);
    mockGetServiceSupabase.mockReturnValue(
      buildProfileMock({ mfa_enabled: false, mfa_secret: null }) as never
    );
    const res = await POST(makeRequest({ code: "123456" }) as never);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("MFA is not enabled");
  });
});

// ── TOTP verification ─────────────────────────────────────────────────

describe("POST /api/auth/mfa/verify — TOTP", () => {
  beforeEach(() => {
    mockGetServerSession.mockResolvedValue(USER_SESSION);
    mockGetServiceSupabase.mockReturnValue(buildProfileMock() as never);
  });

  it("returns 200 verified=true for valid TOTP code", async () => {
    mockVerifyTotpCode.mockReturnValue(true);
    const res = await POST(makeRequest({ code: "123456" }) as never);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.verified).toBe(true);
  });

  it("returns 401 for invalid TOTP code", async () => {
    mockVerifyTotpCode.mockReturnValue(false);
    mockVerifyBackupCode.mockResolvedValue(-1);
    const res = await POST(makeRequest({ code: "000000" }) as never);
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toBe("Invalid code");
  });
});

// ── Backup code ───────────────────────────────────────────────────────

describe("POST /api/auth/mfa/verify — Backup code", () => {
  it("accepts a valid backup code and consumes it", async () => {
    mockGetServerSession.mockResolvedValue(USER_SESSION);
    mockVerifyTotpCode.mockReturnValue(false);
    mockVerifyBackupCode.mockResolvedValue(0); // index 0 matched

    const mockUpdate = vi.fn().mockReturnValue({
      eq: vi.fn().mockResolvedValue({ error: null }),
    });
    mockGetServiceSupabase.mockReturnValue({
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { mfa_enabled: true, mfa_secret: "enc-secret", mfa_backup_codes: ["hash1", "hash2"] },
          error: null,
        }),
        update: mockUpdate,
      }),
    } as never);

    const res = await POST(makeRequest({ code: "bkup01234567" }) as never);
    expect(res.status).toBe(200);
    expect(mockUpdate).toHaveBeenCalled();
  });

  it("rejects when backup code does not match", async () => {
    mockGetServerSession.mockResolvedValue(USER_SESSION);
    mockVerifyTotpCode.mockReturnValue(false);
    mockVerifyBackupCode.mockResolvedValue(-1);
    mockGetServiceSupabase.mockReturnValue(buildProfileMock() as never);
    const res = await POST(makeRequest({ code: "wrongbackup" }) as never);
    expect(res.status).toBe(401);
  });
});

/**
 * Tests for POST /api/auth/signup (src/app/api/auth/signup/route.ts)
 *
 * Each test uses a unique x-forwarded-for IP to avoid hitting the
 * in-memory rate limiter (5 req/min per IP) from previous test runs.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/supabase", () => ({ getServiceSupabase: vi.fn() }));
vi.mock("bcryptjs", () => ({ hash: vi.fn().mockResolvedValue("$2b$10$hashedpassword") }));
vi.mock("@/lib/email", () => ({ sendNotification: vi.fn().mockResolvedValue(undefined) }));
vi.mock("@/lib/email-templates", () => ({
  welcomeEmail: vi.fn().mockReturnValue({ subject: "Welcome", html: "<p>Welcome</p>" }),
}));
vi.mock("@/lib/disposable-emails", () => ({ isDisposableEmail: vi.fn().mockReturnValue(false) }));

import { getServiceSupabase } from "@/lib/supabase";
import { isDisposableEmail } from "@/lib/disposable-emails";
import { POST } from "@/app/api/auth/signup/route";

const mockGetServiceSupabase = vi.mocked(getServiceSupabase);
const mockIsDisposableEmail = vi.mocked(isDisposableEmail);

// Counter to generate a unique IP per test call, avoiding rate-limit collisions
let ipCounter = 0;
function uniqueIp() {
  return `10.0.${Math.floor(ipCounter / 255)}.${ipCounter++ % 255}`;
}

function buildSupabaseMock(existingUser: unknown = null, insertError: unknown = null) {
  return {
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: existingUser, error: null }),
        }),
      }),
      insert: vi.fn().mockReturnValue(
        insertError
          ? Promise.resolve({ error: insertError })
          : Promise.resolve({ error: null })
      ),
    }),
  };
}

function makeRequest(body: unknown, headers: Record<string, string> = {}) {
  return new Request("http://localhost:3000/api/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      origin: "http://localhost:3000",
      "x-forwarded-for": uniqueIp(),
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  process.env.NODE_ENV = "development";
});

// ── Auth: CSRF / Origin checks ────────────────────────────────────────

describe("POST /api/auth/signup — CSRF", () => {
  it("blocks requests with no origin in production", async () => {
    process.env.NODE_ENV = "production";
    const req = new Request("http://localhost:3000/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-for": uniqueIp(),
      },
      body: JSON.stringify({ name: "Test", email: "t@t.com", password: "password1" }),
    });
    const res = await POST(req as never);
    expect(res.status).toBe(403);
  });
});

// ── Input validation ──────────────────────────────────────────────────

describe("POST /api/auth/signup — Input validation", () => {
  it("returns 400 when name is missing", async () => {
    const req = makeRequest({ email: "alice@example.com", password: "password123" });
    const res = await POST(req as never);
    expect(res.status).toBe(400);
  });

  it("returns 400 when email is invalid", async () => {
    const req = makeRequest({ name: "Alice", email: "not-an-email", password: "password123" });
    const res = await POST(req as never);
    expect(res.status).toBe(400);
  });

  it("returns 400 when password is too short (< 8 chars)", async () => {
    const req = makeRequest({ name: "Alice", email: "alice@example.com", password: "short" });
    const res = await POST(req as never);
    expect(res.status).toBe(400);
  });

  it("returns 400 for disposable email", async () => {
    mockIsDisposableEmail.mockReturnValueOnce(true);
    mockGetServiceSupabase.mockReturnValue(buildSupabaseMock() as never);
    const req = makeRequest({ name: "Alice", email: "alice@mailinator.com", password: "password123" });
    const res = await POST(req as never);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain("disposable");
  });
});

// ── Business logic ────────────────────────────────────────────────────

describe("POST /api/auth/signup — Business logic", () => {
  it("returns 409 when email already exists", async () => {
    mockGetServiceSupabase.mockReturnValue(buildSupabaseMock({ id: "existing-user" }) as never);
    const req = makeRequest({ name: "Alice", email: "alice@example.com", password: "password123" });
    const res = await POST(req as never);
    expect(res.status).toBe(409);
    const body = await res.json();
    expect(body.error).toContain("already exists");
  });

  it("returns 500 when database insert fails", async () => {
    mockGetServiceSupabase.mockReturnValue(
      buildSupabaseMock(null, { message: "DB error" }) as never
    );
    const req = makeRequest({ name: "Alice", email: "alice@example.com", password: "password123" });
    const res = await POST(req as never);
    expect(res.status).toBe(500);
  });

  it("returns 201 on successful signup", async () => {
    mockGetServiceSupabase.mockReturnValue(buildSupabaseMock(null, null) as never);
    const req = makeRequest({ name: "Alice", email: "alice@example.com", password: "password123" });
    const res = await POST(req as never);
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.success).toBe(true);
  });

  it("normalizes email to lowercase", async () => {
    let capturedEmail: string | undefined;
    const mockSupabase = {
      from: vi.fn().mockImplementation(() => ({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockImplementation((_col: string, val: string) => {
            capturedEmail = val;
            return { single: vi.fn().mockResolvedValue({ data: null, error: null }) };
          }),
        }),
        insert: vi.fn().mockResolvedValue({ error: null }),
      })),
    };
    mockGetServiceSupabase.mockReturnValue(mockSupabase as never);
    const req = makeRequest({ name: "Alice", email: "ALICE@EXAMPLE.COM", password: "password123" });
    await POST(req as never);
    expect(capturedEmail).toBe("alice@example.com");
  });
});

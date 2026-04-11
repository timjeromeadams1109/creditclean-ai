/**
 * Tests for GET /api/admin/users (src/app/api/admin/users/route.ts)
 * Verifies role-based access control — only owner/admin role is allowed.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("next-auth", () => ({ getServerSession: vi.fn() }));
vi.mock("@/lib/supabase", () => ({ getServiceSupabase: vi.fn() }));

import { getServerSession } from "next-auth";
import { getServiceSupabase } from "@/lib/supabase";
import { GET } from "@/app/api/admin/users/route";

const mockGetServerSession = vi.mocked(getServerSession);
const mockGetServiceSupabase = vi.mocked(getServiceSupabase);

function makeGetReq(params: Record<string, string> = {}) {
  const url = new URL("http://localhost:3000/api/admin/users");
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  return new Request(url.toString());
}

function buildAdminSupabaseMock() {
  const usersData = [
    { id: "u1", email: "a@a.com", full_name: "A", subscription_tier: "free", role: "user", stripe_customer_id: null, created_at: "2024-01-01" },
  ];
  return {
    from: vi.fn().mockImplementation((table: string) => {
      if (table === "profiles") {
        return {
          select: vi.fn().mockReturnThis(),
          order: vi.fn().mockReturnThis(),
          range: vi.fn().mockReturnThis(),
          or: vi.fn().mockReturnThis(),
          eq: vi.fn().mockResolvedValue({ data: usersData, count: 1, error: null }),
        };
      }
      // credit_items and dispute_letters batch queries
      return {
        select: vi.fn().mockReturnThis(),
        in: vi.fn().mockResolvedValue({ data: [], error: null }),
      };
    }),
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

// ── Role-based access control ─────────────────────────────────────────

describe("GET /api/admin/users — RBAC", () => {
  it("returns 401 when unauthenticated", async () => {
    mockGetServerSession.mockResolvedValue(null);
    const res = await GET(makeGetReq() as never);
    expect(res.status).toBe(401);
  });

  it("returns 401 for regular user role", async () => {
    mockGetServerSession.mockResolvedValue({
      user: { id: "u1", email: "user@test.com", role: "user" },
    });
    const res = await GET(makeGetReq() as never);
    expect(res.status).toBe(401);
  });

  it("returns 401 for no role set", async () => {
    mockGetServerSession.mockResolvedValue({
      user: { id: "u1", email: "user@test.com" },
    });
    const res = await GET(makeGetReq() as never);
    expect(res.status).toBe(401);
  });

  it("returns 200 for owner role", async () => {
    mockGetServerSession.mockResolvedValue({
      user: { id: "owner", email: "owner@creditclean.ai", role: "owner" },
    });
    mockGetServiceSupabase.mockReturnValue(buildAdminSupabaseMock() as never);
    const res = await GET(makeGetReq() as never);
    expect(res.status).toBe(200);
  });

  it("returns 200 for admin role", async () => {
    mockGetServerSession.mockResolvedValue({
      user: { id: "u-admin", email: "admin@creditclean.ai", role: "admin" },
    });
    mockGetServiceSupabase.mockReturnValue(buildAdminSupabaseMock() as never);
    const res = await GET(makeGetReq() as never);
    expect(res.status).toBe(200);
  });
});

// ── Response shape ────────────────────────────────────────────────────

describe("GET /api/admin/users — Response", () => {
  beforeEach(() => {
    mockGetServerSession.mockResolvedValue({
      user: { id: "owner", email: "owner@creditclean.ai", role: "owner" },
    });
  });

  it("response includes users, total, page, limit, totalPages", async () => {
    mockGetServiceSupabase.mockReturnValue(buildAdminSupabaseMock() as never);
    const res = await GET(makeGetReq() as never);
    const body = await res.json();
    expect(body).toHaveProperty("users");
    expect(body).toHaveProperty("total");
    expect(body).toHaveProperty("page");
    expect(body).toHaveProperty("limit");
    expect(body).toHaveProperty("totalPages");
  });

  it("does not expose password_hash in user records", async () => {
    mockGetServiceSupabase.mockReturnValue(buildAdminSupabaseMock() as never);
    const res = await GET(makeGetReq() as never);
    const body = await res.json();
    for (const user of body.users) {
      expect(user).not.toHaveProperty("password_hash");
    }
  });
});

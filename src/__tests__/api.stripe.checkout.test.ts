/**
 * Tests for POST /api/stripe/checkout (src/app/api/stripe/checkout/route.ts)
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("next-auth", () => ({ getServerSession: vi.fn() }));
vi.mock("@/lib/supabase", () => ({ getServiceSupabase: vi.fn() }));
vi.mock("@/lib/stripe", () => ({
  stripe: {
    customers: {
      create: vi.fn().mockResolvedValue({ id: "cus_test123" }),
    },
    checkout: {
      sessions: {
        create: vi.fn().mockResolvedValue({ url: "https://checkout.stripe.com/session/test" }),
      },
    },
  },
}));

import { getServerSession } from "next-auth";
import { getServiceSupabase } from "@/lib/supabase";
import { stripe } from "@/lib/stripe";
import { POST } from "@/app/api/stripe/checkout/route";

const mockGetServerSession = vi.mocked(getServerSession);
const mockGetServiceSupabase = vi.mocked(getServiceSupabase);
const mockStripe = vi.mocked(stripe!);

const USER_SESSION = { user: { id: "user-stripe-1", email: "buyer@test.com", role: "user" } };

function makeRequest(body: unknown) {
  return new Request("http://localhost:3000/api/stripe/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json", origin: "http://localhost:3000" },
    body: JSON.stringify(body),
  });
}

function buildProfileMock(stripeCustomerId: string | null = null) {
  return {
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: { stripe_customer_id: stripeCustomerId },
        error: null,
      }),
      update: vi.fn().mockReturnThis(),
    }),
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  process.env.NODE_ENV = "development";
});

// ── Auth ─────────────────────────────────────────────────────────────

describe("POST /api/stripe/checkout — Auth", () => {
  it("returns 401 when unauthenticated", async () => {
    mockGetServerSession.mockResolvedValue(null);
    const res = await POST(makeRequest({ priceId: "price_abc", croaAccepted: true }) as never);
    expect(res.status).toBe(401);
  });
});

// ── Input validation ──────────────────────────────────────────────────

describe("POST /api/stripe/checkout — Validation", () => {
  beforeEach(() => {
    mockGetServerSession.mockResolvedValue(USER_SESSION);
    mockGetServiceSupabase.mockReturnValue(buildProfileMock() as never);
  });

  it("returns 400 when croaAccepted is false", async () => {
    const res = await POST(makeRequest({ priceId: "price_abc", croaAccepted: false }) as never);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("Invalid request");
  });

  it("returns 400 when priceId is empty string", async () => {
    const res = await POST(makeRequest({ priceId: "", croaAccepted: true }) as never);
    expect(res.status).toBe(400);
  });

  it("returns 400 when priceId is missing", async () => {
    const res = await POST(makeRequest({ croaAccepted: true }) as never);
    expect(res.status).toBe(400);
  });
});

// ── Business logic ────────────────────────────────────────────────────

describe("POST /api/stripe/checkout — Business logic", () => {
  beforeEach(() => {
    mockGetServerSession.mockResolvedValue(USER_SESSION);
  });

  it("returns checkout URL on success", async () => {
    mockGetServiceSupabase.mockReturnValue(buildProfileMock("cus_existing") as never);
    const res = await POST(makeRequest({ priceId: "price_pro", croaAccepted: true }) as never);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.url).toContain("checkout.stripe.com");
  });

  it("creates a new Stripe customer when none exists", async () => {
    mockGetServiceSupabase.mockReturnValue(buildProfileMock(null) as never);
    await POST(makeRequest({ priceId: "price_pro", croaAccepted: true }) as never);
    expect(mockStripe.customers.create).toHaveBeenCalledWith(
      expect.objectContaining({ email: "buyer@test.com" })
    );
  });

  it("reuses existing Stripe customer when one exists", async () => {
    mockGetServiceSupabase.mockReturnValue(buildProfileMock("cus_existing") as never);
    await POST(makeRequest({ priceId: "price_pro", croaAccepted: true }) as never);
    expect(mockStripe.customers.create).not.toHaveBeenCalled();
  });
});

/**
 * Tests for POST /api/stripe/webhook (src/app/api/stripe/webhook/route.ts)
 * Verifies Stripe signature validation and subscription lifecycle events.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import type Stripe from "stripe";

vi.mock("@/lib/supabase", () => ({ getServiceSupabase: vi.fn() }));
vi.mock("@/lib/email", () => ({ sendNotification: vi.fn().mockResolvedValue(undefined) }));
vi.mock("@/lib/email-templates", () => ({
  paymentConfirmationEmail: vi.fn().mockReturnValue({ subject: "Confirmed", html: "<p>Paid</p>" }),
  cancellationEmail: vi.fn().mockReturnValue({ subject: "Cancelled", html: "<p>Bye</p>" }),
  croaCancellationReminderEmail: vi.fn().mockReturnValue({ subject: "Reminder", html: "<p>Reminder</p>" }),
}));

// The constructEvent function is referenced inside the factory — no top-level var.
vi.mock("@/lib/stripe", () => ({
  stripe: {
    webhooks: { constructEvent: vi.fn() },
    subscriptions: { retrieve: vi.fn() },
  },
}));

import { getServiceSupabase } from "@/lib/supabase";
import { stripe } from "@/lib/stripe";
import { POST } from "@/app/api/stripe/webhook/route";

const mockGetServiceSupabase = vi.mocked(getServiceSupabase);
// Access constructEvent from the (already-mocked) stripe object
const getConstructEvent = () => vi.mocked(stripe!.webhooks.constructEvent);

function makeWebhookRequest(body: string, signature = "t=123,v1=valid") {
  return new Request("http://localhost:3000/api/stripe/webhook", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "stripe-signature": signature,
    },
    body,
  });
}

function buildSupabaseMock(profileData: unknown = { id: "u1", email: "u@t.com", full_name: "User" }) {
  return {
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: profileData, error: null }),
      update: vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ error: null }) }),
    }),
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  process.env.STRIPE_WEBHOOK_SECRET = "whsec_test";
});

// ── Signature validation ──────────────────────────────────────────────

describe("POST /api/stripe/webhook — Signature", () => {
  it("returns 400 when stripe-signature header is missing", async () => {
    const req = new Request("http://localhost:3000/api/stripe/webhook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}",
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 when signature verification fails", async () => {
    getConstructEvent().mockImplementation(() => { throw new Error("Signature mismatch"); });
    const req = makeWebhookRequest("{}", "t=bad");
    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("Verification failed");
  });
});

// ── checkout.session.completed ────────────────────────────────────────

describe("POST /api/stripe/webhook — checkout.session.completed", () => {
  it("processes completed checkout and returns 200 received=true", async () => {
    const event: Partial<Stripe.Event> = {
      type: "checkout.session.completed",
      data: {
        object: {
          metadata: { userId: "user-1" },
          customer: "cus_test",
          subscription: null,
        } as unknown as Stripe.Checkout.Session,
      },
    };
    getConstructEvent().mockReturnValue(event as Stripe.Event);
    mockGetServiceSupabase.mockReturnValue(buildSupabaseMock() as never);

    const res = await POST(makeWebhookRequest(JSON.stringify(event)));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.received).toBe(true);
  });

  it("skips gracefully when userId is missing from metadata", async () => {
    const event: Partial<Stripe.Event> = {
      type: "checkout.session.completed",
      data: {
        object: {
          metadata: {},
          customer: "cus_test",
          subscription: null,
        } as unknown as Stripe.Checkout.Session,
      },
    };
    getConstructEvent().mockReturnValue(event as Stripe.Event);
    mockGetServiceSupabase.mockReturnValue(buildSupabaseMock() as never);

    const res = await POST(makeWebhookRequest(JSON.stringify(event)));
    expect(res.status).toBe(200);
  });
});

// ── customer.subscription.deleted ────────────────────────────────────

describe("POST /api/stripe/webhook — customer.subscription.deleted", () => {
  it("downgrades user to free tier", async () => {
    const event: Partial<Stripe.Event> = {
      type: "customer.subscription.deleted",
      data: {
        object: {
          customer: "cus_test",
          status: "canceled",
        } as unknown as Stripe.Subscription,
      },
    };
    getConstructEvent().mockReturnValue(event as Stripe.Event);

    let updatedTier: string | undefined;
    mockGetServiceSupabase.mockReturnValue({
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: { id: "u1", email: "u@t.com", full_name: "User" }, error: null }),
        update: vi.fn().mockImplementation((data: Record<string, unknown>) => {
          if (data.subscription_tier) updatedTier = data.subscription_tier as string;
          return { eq: vi.fn().mockResolvedValue({ error: null }) };
        }),
      }),
    } as never);

    const res = await POST(makeWebhookRequest(JSON.stringify(event)));
    expect(res.status).toBe(200);
    expect(updatedTier).toBe("free");
  });
});

// ── Unknown event types ───────────────────────────────────────────────

describe("POST /api/stripe/webhook — Unknown event", () => {
  it("ignores unknown event types and returns 200", async () => {
    const event = { type: "unknown.event.type", data: { object: {} } };
    getConstructEvent().mockReturnValue(event as Stripe.Event);
    mockGetServiceSupabase.mockReturnValue(buildSupabaseMock() as never);

    const res = await POST(makeWebhookRequest(JSON.stringify(event)));
    expect(res.status).toBe(200);
  });
});

/**
 * Tests for src/lib/usage-limits.ts
 * All Supabase calls are mocked — no real network traffic.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { TIER_LIMITS } from "@/lib/usage-limits";

// Mock the Supabase module before importing usage-limits functions
vi.mock("@/lib/supabase", () => ({
  getServiceSupabase: vi.fn(),
}));

import { getServiceSupabase } from "@/lib/supabase";
import { getUserTier, getUsageCounts, checkUsageLimit } from "@/lib/usage-limits";

const mockGetServiceSupabase = vi.mocked(getServiceSupabase);

function buildSupabaseMock(profileData: unknown, counts: {
  letters: number;
  forensic: number;
  items: number;
}) {
  return {
    from: vi.fn().mockImplementation((table: string) => {
      if (table === "profiles") {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: profileData, error: null }),
            }),
          }),
          update: vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ error: null }) }),
        };
      }
      // dispute_letters
      if (table === "dispute_letters") {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              gte: vi.fn().mockResolvedValue({ count: counts.letters, error: null }),
            }),
          }),
        };
      }
      // forensic_reports
      if (table === "forensic_reports") {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              gte: vi.fn().mockResolvedValue({ count: counts.forensic, error: null }),
            }),
          }),
        };
      }
      // credit_items
      if (table === "credit_items") {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ count: counts.items, error: null }),
          }),
        };
      }
      return { select: vi.fn().mockReturnValue({ eq: vi.fn() }) };
    }),
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

// ── TIER_LIMITS sanity checks ─────────────────────────────────────────

describe("TIER_LIMITS", () => {
  it("free tier has the lowest limits", () => {
    expect(TIER_LIMITS.free.lettersPerMonth).toBeLessThan(TIER_LIMITS.pro.lettersPerMonth);
    expect(TIER_LIMITS.pro.lettersPerMonth).toBeLessThan(TIER_LIMITS.premium.lettersPerMonth);
  });

  it("all tiers have positive creditItems limit", () => {
    for (const tier of Object.values(TIER_LIMITS)) {
      expect(tier.creditItems).toBeGreaterThan(0);
    }
  });
});

// ── getUserTier ───────────────────────────────────────────────────────

describe("getUserTier", () => {
  it("returns 'pro' when profile has pro tier", async () => {
    mockGetServiceSupabase.mockReturnValue(
      buildSupabaseMock({ subscription_tier: "pro" }, { letters: 0, forensic: 0, items: 0 }) as never
    );
    const tier = await getUserTier("user-1");
    expect(tier).toBe("pro");
  });

  it("returns 'free' for unknown tier string", async () => {
    mockGetServiceSupabase.mockReturnValue(
      buildSupabaseMock({ subscription_tier: "enterprise" }, { letters: 0, forensic: 0, items: 0 }) as never
    );
    const tier = await getUserTier("user-1");
    expect(tier).toBe("free");
  });

  it("returns 'free' when profile is null", async () => {
    mockGetServiceSupabase.mockReturnValue(
      buildSupabaseMock(null, { letters: 0, forensic: 0, items: 0 }) as never
    );
    const tier = await getUserTier("user-1");
    expect(tier).toBe("free");
  });
});

// ── checkUsageLimit ───────────────────────────────────────────────────

describe("checkUsageLimit — generate_letter", () => {
  it("allows letter generation when under limit", async () => {
    mockGetServiceSupabase.mockReturnValue(
      buildSupabaseMock({ subscription_tier: "free" }, { letters: 0, forensic: 0, items: 0 }) as never
    );
    const result = await checkUsageLimit("user-1", "generate_letter");
    expect(result.allowed).toBe(true);
  });

  it("blocks letter generation when at free limit (1/month)", async () => {
    mockGetServiceSupabase.mockReturnValue(
      buildSupabaseMock({ subscription_tier: "free" }, { letters: 1, forensic: 0, items: 0 }) as never
    );
    const result = await checkUsageLimit("user-1", "generate_letter");
    expect(result.allowed).toBe(false);
    if (!result.allowed) {
      expect(result.limit).toBe(TIER_LIMITS.free.lettersPerMonth);
      expect(result.used).toBe(1);
      expect(result.tier).toBe("free");
    }
  });

  it("allows letter generation for pro tier with 5 letters used", async () => {
    mockGetServiceSupabase.mockReturnValue(
      buildSupabaseMock({ subscription_tier: "pro" }, { letters: 5, forensic: 0, items: 0 }) as never
    );
    const result = await checkUsageLimit("user-1", "generate_letter");
    expect(result.allowed).toBe(true);
  });
});

describe("checkUsageLimit — add_item", () => {
  it("allows adding item when under free tier limit (5)", async () => {
    mockGetServiceSupabase.mockReturnValue(
      buildSupabaseMock({ subscription_tier: "free" }, { letters: 0, forensic: 0, items: 4 }) as never
    );
    const result = await checkUsageLimit("user-1", "add_item");
    expect(result.allowed).toBe(true);
  });

  it("blocks adding item when at free tier limit (5)", async () => {
    mockGetServiceSupabase.mockReturnValue(
      buildSupabaseMock({ subscription_tier: "free" }, { letters: 0, forensic: 0, items: 5 }) as never
    );
    const result = await checkUsageLimit("user-1", "add_item");
    expect(result.allowed).toBe(false);
  });
});

describe("checkUsageLimit — forensic_report", () => {
  it("blocks forensic report at free limit (1/month)", async () => {
    mockGetServiceSupabase.mockReturnValue(
      buildSupabaseMock({ subscription_tier: "free" }, { letters: 0, forensic: 1, items: 0 }) as never
    );
    const result = await checkUsageLimit("user-1", "forensic_report");
    expect(result.allowed).toBe(false);
    if (!result.allowed) {
      expect(result.reason).toContain("forensic reports");
    }
  });
});

/**
 * Tests for src/lib/rate-limit.ts
 *
 * Uses unique identifier prefixes per describe block to avoid
 * cross-test state leakage from the module-level Map store.
 */

import { describe, it, expect, vi } from "vitest";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";

// ── checkRateLimit ────────────────────────────────────────────────────

describe("checkRateLimit — first request", () => {
  it("allows the first request and returns correct remaining count (auth tier)", () => {
    const result = checkRateLimit("rl-test-first-1", "auth");
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(4); // max=5, used=1
  });
});

describe("checkRateLimit — limit enforcement", () => {
  it("allows up to the limit and blocks the next request", () => {
    const id = "rl-limit-auth";
    for (let i = 0; i < 5; i++) {
      checkRateLimit(id, "auth");
    }
    const over = checkRateLimit(id, "auth");
    expect(over.allowed).toBe(false);
    expect(over.remaining).toBe(0);
  });

  it("generates tier allows 10 requests and blocks the 11th", () => {
    const id = "rl-gen-limit";
    for (let i = 0; i < 10; i++) checkRateLimit(id, "generate");
    expect(checkRateLimit(id, "generate").allowed).toBe(false);
  });

  it("read tier allows 30 requests and blocks the 31st", () => {
    const id = "rl-read-limit";
    for (let i = 0; i < 30; i++) checkRateLimit(id, "read");
    expect(checkRateLimit(id, "read").allowed).toBe(false);
  });

  it("pdf tier allows 10 requests and blocks the 11th", () => {
    const id = "rl-pdf-limit";
    for (let i = 0; i < 10; i++) checkRateLimit(id, "pdf");
    expect(checkRateLimit(id, "pdf").allowed).toBe(false);
  });
});

describe("checkRateLimit — isolation", () => {
  it("isolates different tiers under the same identifier", () => {
    const id = "rl-tier-isolation";
    for (let i = 0; i < 5; i++) checkRateLimit(id, "auth");
    const authBlocked = checkRateLimit(id, "auth");
    expect(authBlocked.allowed).toBe(false);

    // read tier for the same identifier should still be open
    const readAllowed = checkRateLimit(id, "read");
    expect(readAllowed.allowed).toBe(true);
  });

  it("isolates different identifiers under the same tier", () => {
    const idA = "rl-isolation-user-x";
    const idB = "rl-isolation-user-y";
    for (let i = 0; i < 5; i++) checkRateLimit(idA, "auth");
    expect(checkRateLimit(idA, "auth").allowed).toBe(false);
    expect(checkRateLimit(idB, "auth").allowed).toBe(true);
  });
});

describe("checkRateLimit — window reset", () => {
  it("resets the window after expiry", async () => {
    vi.useFakeTimers();
    const id = "rl-window-reset";
    for (let i = 0; i < 5; i++) checkRateLimit(id, "auth");
    expect(checkRateLimit(id, "auth").allowed).toBe(false);

    vi.advanceTimersByTime(61_000);

    const after = checkRateLimit(id, "auth");
    expect(after.allowed).toBe(true);
    expect(after.remaining).toBe(4);

    vi.useRealTimers();
  });
});

// ── rateLimitResponse ─────────────────────────────────────────────────

describe("rateLimitResponse", () => {
  it("returns a 429 Response with correct headers", () => {
    const futureReset = Date.now() + 30_000;
    const result = rateLimitResponse({ allowed: false, remaining: 0, resetAt: futureReset });

    expect(result.status).toBe(429);
    expect(result.headers.get("Content-Type")).toBe("application/json");
    expect(result.headers.get("X-RateLimit-Remaining")).toBe("0");
    expect(Number(result.headers.get("Retry-After"))).toBeGreaterThan(0);
    expect(result.headers.get("X-RateLimit-Reset")).toBe(String(futureReset));
  });

  it("body contains error and retryAfter fields", async () => {
    const futureReset = Date.now() + 10_000;
    const response = rateLimitResponse({ allowed: false, remaining: 0, resetAt: futureReset });
    const body = await response.json();
    expect(body.error).toContain("Too many requests");
    expect(typeof body.retryAfter).toBe("number");
    expect(body.retryAfter).toBeGreaterThan(0);
  });
});

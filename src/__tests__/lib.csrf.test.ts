/**
 * Tests for src/lib/csrf.ts
 * isTrustedSource and validateOrigin
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { isTrustedSource, validateOrigin } from "@/lib/csrf";

function makeRequest(options: {
  headers?: Record<string, string>;
}): Request {
  return new Request("https://creditclean.ai/api/test", {
    method: "POST",
    headers: options.headers ?? {},
  });
}

// ── isTrustedSource ───────────────────────────────────────────────────

describe("isTrustedSource", () => {
  it("returns true when stripe-signature header is present", () => {
    const req = makeRequest({ headers: { "stripe-signature": "t=123,v1=abc" } });
    expect(isTrustedSource(req)).toBe(true);
  });

  it("returns false when no trusted headers present", () => {
    const req = makeRequest({ headers: {} });
    expect(isTrustedSource(req)).toBe(false);
  });
});

// ── validateOrigin ────────────────────────────────────────────────────

describe("validateOrigin", () => {
  const originalEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

  it("returns true in development environment regardless of origin", () => {
    process.env.NODE_ENV = "development";
    const req = makeRequest({ headers: { origin: "http://malicious.com" } });
    expect(validateOrigin(req)).toBe(true);
  });

  it("returns true when origin matches allowed origin (production)", () => {
    process.env.NODE_ENV = "production";
    const req = makeRequest({ headers: { origin: "https://creditclean.ai" } });
    expect(validateOrigin(req)).toBe(true);
  });

  it("returns false when origin does not match allowed origin (production)", () => {
    process.env.NODE_ENV = "production";
    const req = makeRequest({ headers: { origin: "https://evil.com" } });
    expect(validateOrigin(req)).toBe(false);
  });

  it("falls back to referer when no origin header (production)", () => {
    process.env.NODE_ENV = "production";
    const req = makeRequest({ headers: { referer: "https://creditclean.ai/dashboard" } });
    expect(validateOrigin(req)).toBe(true);
  });

  it("rejects invalid referer URL (production)", () => {
    process.env.NODE_ENV = "production";
    const req = makeRequest({ headers: { referer: "not-a-url" } });
    expect(validateOrigin(req)).toBe(false);
  });

  it("blocks when no origin and no referer (production) — default deny", () => {
    process.env.NODE_ENV = "production";
    const req = makeRequest({ headers: {} });
    expect(validateOrigin(req)).toBe(false);
  });

  it("blocks referer from mismatched origin (production)", () => {
    process.env.NODE_ENV = "production";
    const req = makeRequest({ headers: { referer: "https://attacker.com/page" } });
    expect(validateOrigin(req)).toBe(false);
  });
});

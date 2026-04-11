/**
 * Tests for src/lib/validation.ts
 * Covers every Zod schema exported from the module.
 */

import { describe, it, expect } from "vitest";
import { NextResponse } from "next/server";
import {
  validate,
  signupSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changelogCreateSchema,
  changelogDeleteSchema,
  disputeGenerateSchema,
  disputeUpdateSchema,
  itemCreateSchema,
  scoreCreateSchema,
  forensicAnalyzeSchema,
  forensicGenerateAllSchema,
  stripeCheckoutSchema,
  letterStatusSchema,
} from "@/lib/validation";

// ── validate() helper ─────────────────────────────────────────────────

describe("validate()", () => {
  it("returns { data } on valid input", () => {
    const result = validate(signupSchema, { name: "Jane", email: "jane@example.com", password: "password1" });
    expect("data" in result).toBe(true);
  });

  it("returns { error: NextResponse } on invalid input", () => {
    const result = validate(signupSchema, { name: "", email: "bad", password: "x" });
    expect("error" in result).toBe(true);
    if ("error" in result) {
      expect(result.error).toBeInstanceOf(NextResponse);
      expect(result.error.status).toBe(400);
    }
  });
});

// ── signupSchema ──────────────────────────────────────────────────────

describe("signupSchema", () => {
  const valid = { name: "Alice", email: "alice@example.com", password: "password123" };

  it("accepts valid signup data", () => {
    expect(signupSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects empty name", () => {
    expect(signupSchema.safeParse({ ...valid, name: "" }).success).toBe(false);
  });

  it("rejects invalid email format", () => {
    expect(signupSchema.safeParse({ ...valid, email: "not-an-email" }).success).toBe(false);
  });

  it("rejects password shorter than 8 characters", () => {
    expect(signupSchema.safeParse({ ...valid, password: "short" }).success).toBe(false);
  });

  it("rejects missing fields", () => {
    expect(signupSchema.safeParse({}).success).toBe(false);
  });
});

// ── forgotPasswordSchema ──────────────────────────────────────────────

describe("forgotPasswordSchema", () => {
  it("accepts valid email", () => {
    expect(forgotPasswordSchema.safeParse({ email: "test@test.com" }).success).toBe(true);
  });

  it("rejects invalid email", () => {
    expect(forgotPasswordSchema.safeParse({ email: "notvalid" }).success).toBe(false);
  });
});

// ── resetPasswordSchema ───────────────────────────────────────────────

describe("resetPasswordSchema", () => {
  const valid = { token: "abc123", password: "newpassword" };

  it("accepts valid reset data", () => {
    expect(resetPasswordSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects empty token", () => {
    expect(resetPasswordSchema.safeParse({ ...valid, token: "" }).success).toBe(false);
  });

  it("rejects short password", () => {
    expect(resetPasswordSchema.safeParse({ ...valid, password: "short" }).success).toBe(false);
  });
});

// ── changelogCreateSchema ─────────────────────────────────────────────

describe("changelogCreateSchema", () => {
  it("accepts minimal valid changelog entry", () => {
    const r = changelogCreateSchema.safeParse({ version: "1.0.0", title: "Initial release" });
    expect(r.success).toBe(true);
  });

  it("accepts entry with optional fields", () => {
    const r = changelogCreateSchema.safeParse({ version: "1.0.0", title: "Release", description: "Details", type: "feature" });
    expect(r.success).toBe(true);
  });

  it("rejects missing version", () => {
    expect(changelogCreateSchema.safeParse({ title: "Release" }).success).toBe(false);
  });

  it("rejects missing title", () => {
    expect(changelogCreateSchema.safeParse({ version: "1.0.0" }).success).toBe(false);
  });
});

// ── changelogDeleteSchema ─────────────────────────────────────────────

describe("changelogDeleteSchema", () => {
  it("accepts valid UUID", () => {
    expect(changelogDeleteSchema.safeParse({ id: "550e8400-e29b-41d4-a716-446655440000" }).success).toBe(true);
  });

  it("rejects non-UUID string", () => {
    expect(changelogDeleteSchema.safeParse({ id: "not-a-uuid" }).success).toBe(false);
  });
});

// ── disputeGenerateSchema ─────────────────────────────────────────────

describe("disputeGenerateSchema", () => {
  const validId = "550e8400-e29b-41d4-a716-446655440000";

  it("accepts creditItemId only", () => {
    expect(disputeGenerateSchema.safeParse({ creditItemId: validId }).success).toBe(true);
  });

  it("accepts full optional userProfile", () => {
    const r = disputeGenerateSchema.safeParse({
      creditItemId: validId,
      userProfile: {
        firstName: "John", lastName: "Doe",
        address: { street: "123 Main", city: "Tampa", state: "FL", zip: "33601" },
        ssnLast4: "1234", dob: "1990-01-01", email: "john@test.com", phone: "555-1234",
      },
    });
    expect(r.success).toBe(true);
  });

  it("rejects non-UUID creditItemId", () => {
    expect(disputeGenerateSchema.safeParse({ creditItemId: "not-uuid" }).success).toBe(false);
  });

  it("accepts null userProfile", () => {
    expect(disputeGenerateSchema.safeParse({ creditItemId: validId, userProfile: null }).success).toBe(true);
  });
});

// ── itemCreateSchema ──────────────────────────────────────────────────

describe("itemCreateSchema", () => {
  const valid = {
    bureaus: "equifax",
    item_type: "collection",
    creditor_name: "Acme Collections",
  };

  it("accepts minimal valid item", () => {
    expect(itemCreateSchema.safeParse(valid).success).toBe(true);
  });

  it("accepts array of bureaus", () => {
    const r = itemCreateSchema.safeParse({ ...valid, bureaus: ["equifax", "experian"] });
    expect(r.success).toBe(true);
  });

  it("rejects missing item_type", () => {
    const { item_type: _, ...rest } = valid;
    expect(itemCreateSchema.safeParse(rest).success).toBe(false);
  });

  it("rejects missing creditor_name", () => {
    const { creditor_name: _, ...rest } = valid;
    expect(itemCreateSchema.safeParse(rest).success).toBe(false);
  });

  it("accepts optional balance as null", () => {
    const r = itemCreateSchema.safeParse({ ...valid, balance: null });
    expect(r.success).toBe(true);
  });
});

// ── scoreCreateSchema ─────────────────────────────────────────────────

describe("scoreCreateSchema", () => {
  const valid = { bureau: "equifax", score: 720 };

  it("accepts valid score", () => {
    expect(scoreCreateSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects score below 300", () => {
    expect(scoreCreateSchema.safeParse({ ...valid, score: 299 }).success).toBe(false);
  });

  it("rejects score above 850", () => {
    expect(scoreCreateSchema.safeParse({ ...valid, score: 851 }).success).toBe(false);
  });

  it("rejects score of exactly 300 as valid (boundary)", () => {
    expect(scoreCreateSchema.safeParse({ ...valid, score: 300 }).success).toBe(true);
  });

  it("rejects score of exactly 850 as valid (boundary)", () => {
    expect(scoreCreateSchema.safeParse({ ...valid, score: 850 }).success).toBe(true);
  });

  it("rejects missing bureau", () => {
    expect(scoreCreateSchema.safeParse({ score: 720 }).success).toBe(false);
  });
});

// ── forensicAnalyzeSchema ─────────────────────────────────────────────

describe("forensicAnalyzeSchema", () => {
  const valid = { items: [{ id: "1", type: "late_payment" }], bureau: "equifax" };

  it("accepts valid forensic analyze input", () => {
    expect(forensicAnalyzeSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects empty items array", () => {
    expect(forensicAnalyzeSchema.safeParse({ ...valid, items: [] }).success).toBe(false);
  });

  it("rejects missing bureau", () => {
    const { bureau: _, ...rest } = valid;
    expect(forensicAnalyzeSchema.safeParse(rest).success).toBe(false);
  });

  it("accepts optional state", () => {
    expect(forensicAnalyzeSchema.safeParse({ ...valid, state: "FL" }).success).toBe(true);
  });
});

// ── forensicGenerateAllSchema ─────────────────────────────────────────

describe("forensicGenerateAllSchema", () => {
  it("accepts valid UUID reportId", () => {
    expect(forensicGenerateAllSchema.safeParse({ reportId: "550e8400-e29b-41d4-a716-446655440000" }).success).toBe(true);
  });

  it("rejects non-UUID reportId", () => {
    expect(forensicGenerateAllSchema.safeParse({ reportId: "not-a-uuid" }).success).toBe(false);
  });
});

// ── stripeCheckoutSchema ──────────────────────────────────────────────

describe("stripeCheckoutSchema", () => {
  it("accepts valid priceId with CROA accepted", () => {
    expect(stripeCheckoutSchema.safeParse({ priceId: "price_abc123", croaAccepted: true }).success).toBe(true);
  });

  it("rejects when croaAccepted is false", () => {
    expect(stripeCheckoutSchema.safeParse({ priceId: "price_abc123", croaAccepted: false }).success).toBe(false);
  });

  it("rejects missing priceId", () => {
    expect(stripeCheckoutSchema.safeParse({ croaAccepted: true }).success).toBe(false);
  });

  it("rejects empty priceId", () => {
    expect(stripeCheckoutSchema.safeParse({ priceId: "", croaAccepted: true }).success).toBe(false);
  });
});

// ── letterStatusSchema ────────────────────────────────────────────────

describe("letterStatusSchema", () => {
  it.each(["draft", "final", "sent", "awaiting_response"])("accepts status '%s'", (status) => {
    expect(letterStatusSchema.safeParse({ status }).success).toBe(true);
  });

  it("rejects unknown status", () => {
    expect(letterStatusSchema.safeParse({ status: "archived" }).success).toBe(false);
  });

  it("rejects missing status", () => {
    expect(letterStatusSchema.safeParse({}).success).toBe(false);
  });
});

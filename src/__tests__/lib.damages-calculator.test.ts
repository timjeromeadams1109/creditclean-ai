/**
 * Tests for src/lib/legal/damages-calculator.ts
 * Covers: calculateDamages, generateDamagesNarrative
 */

import { describe, it, expect } from "vitest";
import {
  calculateDamages,
  generateDamagesNarrative,
  type DamagesEstimate,
} from "@/lib/legal/damages-calculator";
import type { Violation } from "@/lib/disputes/types";

// ── Fixtures ──────────────────────────────────────────────────────────

const makeFcraViolation = (severity: Violation["severity"] = "moderate"): Violation => ({
  code: "FCRA_611_LATE",
  statute: "FCRA §611 (15 U.S.C. §1681i)",
  description: "Bureau failed to respond in time",
  severity,
  evidenceDescription: "Dispute sent 2024-01-01, no response",
});

const makeFdcpaViolation = (): Violation => ({
  code: "FDCPA_809_NO_VALIDATION",
  statute: "FDCPA §809(b) (15 U.S.C. §1692g(b))",
  description: "No validation provided",
  severity: "severe",
  evidenceDescription: "Collector failed to validate",
});

// ── calculateDamages ──────────────────────────────────────────────────

describe("calculateDamages", () => {
  it("returns zero statutory damages when no violations", () => {
    const result = calculateDamages([], "FL");
    expect(result.fcraStatutoryTotal.min).toBe(0);
    expect(result.fcraStatutoryTotal.max).toBe(0);
    expect(result.fdcpaStatutoryTotal.min).toBe(0);
    expect(result.fdcpaStatutoryTotal.max).toBe(0);
  });

  it("calculates FCRA statutory range correctly for single violation", () => {
    const result = calculateDamages([makeFcraViolation()], "TX");
    expect(result.fcraStatutoryTotal.min).toBe(100);
    expect(result.fcraStatutoryTotal.max).toBe(1000);
  });

  it("scales FCRA statutory damages linearly with violation count", () => {
    const violations = [1, 2, 3].map(() => makeFcraViolation());
    const result = calculateDamages(violations, "NY");
    expect(result.fcraStatutoryTotal.min).toBe(300);
    expect(result.fcraStatutoryTotal.max).toBe(3000);
  });

  it("includes FDCPA statutory damages when FDCPA violations present", () => {
    const result = calculateDamages([makeFdcpaViolation()], "CA");
    expect(result.fdcpaStatutoryTotal.max).toBe(1000);
  });

  it("always includes emotional distress in actual damages", () => {
    const result = calculateDamages([], "FL");
    expect(result.actualDamages.emotionalDistress.amount).toBeGreaterThan(0);
  });

  it("totalEstimatedMin is always <= totalEstimatedMax", () => {
    const violations = [makeFcraViolation("severe"), makeFdcpaViolation(), makeFcraViolation("moderate")];
    const result = calculateDamages(violations, "CA");
    expect(result.totalEstimatedMin).toBeLessThanOrEqual(result.totalEstimatedMax);
  });

  it("applies state multiplier for TX (treble damages)", () => {
    const violations = [makeFcraViolation()];
    const result = calculateDamages(violations, "TX");
    expect(result.stateDamages.multiplier).toBe(3);
    expect(result.stateDamages.total.min).toBe(300); // 1 violation × 100 × 3
  });

  it("applies state multiplier for CA (no multiplier, higher per-violation range)", () => {
    const violations = [makeFcraViolation()];
    const result = calculateDamages(violations, "CA");
    expect(result.stateDamages.perViolation.max).toBe(5000);
  });

  it("handles unknown state gracefully with zero state damages", () => {
    const result = calculateDamages([makeFcraViolation()], "ZZ");
    expect(result.stateDamages.total.min).toBe(0);
    expect(result.stateDamages.total.max).toBe(0);
    expect(result.stateDamages.notes).toContain("not yet mapped");
  });

  it("case strength is 'weak' with no violations", () => {
    const result = calculateDamages([], "FL");
    expect(result.caseStrength).toBe("weak");
  });

  it("case strength is 'moderate' with 1 violation", () => {
    const result = calculateDamages([makeFcraViolation()], "FL");
    expect(result.caseStrength).toBe("moderate");
  });

  it("case strength is 'strong' with 3+ violations", () => {
    const violations = [1, 2, 3].map(() => makeFcraViolation());
    const result = calculateDamages(violations, "FL");
    expect(result.caseStrength).toBe("strong");
  });

  it("case strength is 'very_strong' with 5+ violations including 2+ severe", () => {
    const violations = [
      makeFcraViolation("severe"),
      makeFcraViolation("severe"),
      makeFcraViolation("moderate"),
      makeFcraViolation("moderate"),
      makeFcraViolation("moderate"),
    ];
    const result = calculateDamages(violations, "FL");
    expect(result.caseStrength).toBe("very_strong");
  });

  it("summary string contains key damage figures", () => {
    const violations = [makeFcraViolation()];
    const result = calculateDamages(violations, "FL");
    expect(result.summary).toContain("ESTIMATED DAMAGES SUMMARY");
    expect(result.summary).toContain("ESTIMATED TOTAL RANGE");
  });

  it("accepts partial actualDamages override", () => {
    const result = calculateDamages([], "FL", {
      outOfPocket: [{ amount: 500, description: "Certified mail fees" }],
    });
    expect(result.actualDamages.outOfPocket[0].amount).toBe(500);
    expect(result.actualDamages.total).toBeGreaterThanOrEqual(500);
  });
});

// ── generateDamagesNarrative ──────────────────────────────────────────

describe("generateDamagesNarrative", () => {
  it("generates a non-empty narrative string", () => {
    const estimate: DamagesEstimate = calculateDamages([makeFcraViolation()], "FL");
    const narrative = generateDamagesNarrative(estimate);
    expect(typeof narrative).toBe("string");
    expect(narrative.length).toBeGreaterThan(100);
  });

  it("includes FDCPA section when fdcpa damages > 0", () => {
    const estimate = calculateDamages([makeFdcpaViolation()], "FL");
    const narrative = generateDamagesNarrative(estimate);
    expect(narrative).toContain("FDCPA DAMAGES");
  });

  it("omits FDCPA section when no FDCPA violations", () => {
    const estimate = calculateDamages([makeFcraViolation()], "FL");
    const narrative = generateDamagesNarrative(estimate);
    // Only FCRA violation, no FDCPA — FDCPA section should not appear
    expect(narrative).not.toContain("FDCPA DAMAGES");
  });

  it("includes state law section when state damages > 0", () => {
    const estimate = calculateDamages([makeFcraViolation()], "CA");
    const narrative = generateDamagesNarrative(estimate);
    expect(narrative).toContain("STATE LAW DAMAGES");
  });

  it("includes attorney fees section always", () => {
    const estimate = calculateDamages([], "FL");
    const narrative = generateDamagesNarrative(estimate);
    expect(narrative).toContain("ATTORNEY FEES AND COSTS");
  });

  it("references the total estimated range in the narrative", () => {
    const estimate = calculateDamages([makeFcraViolation()], "TX");
    const narrative = generateDamagesNarrative(estimate);
    expect(narrative).toContain("total estimated damages");
  });
});

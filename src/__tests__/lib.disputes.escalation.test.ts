/**
 * Tests for src/lib/disputes/escalation-engine.ts
 * Covers: determineNextStrategy, calculateDeadline, checkForViolations, analyzeResponse
 */

import { describe, it, expect } from "vitest";
import {
  determineNextStrategy,
  calculateDeadline,
  checkForViolations,
  analyzeResponse,
} from "@/lib/disputes/escalation-engine";
import {
  DisputeStrategy,
  DisputeOutcome,
  ItemType,
  Bureau,
  type CreditItem,
  type DisputeRound,
  type DisputeResponse,
} from "@/lib/disputes/types";

// ── Fixtures ──────────────────────────────────────────────────────────

const makeItem = (overrides: Partial<CreditItem> = {}): CreditItem => ({
  id: "item-1",
  bureau: Bureau.EQUIFAX,
  itemType: ItemType.COLLECTION,
  creditorName: "Acme Collections",
  accountNumber: "1234",
  ...overrides,
});

const makeRound = (overrides: Partial<DisputeRound> = {}): DisputeRound => ({
  roundNumber: 1,
  strategy: DisputeStrategy.FCRA_611_BUREAU_DISPUTE,
  dateSent: "2024-01-01",
  deadlineDate: "2024-01-31",
  letterContent: "Letter content",
  recipientName: "Equifax",
  recipientAddress: "PO Box 740256, Atlanta GA 30374",
  ...overrides,
});

// ── determineNextStrategy ─────────────────────────────────────────────

describe("determineNextStrategy", () => {
  it("returns FCRA_611 for a fresh item with no previous rounds", () => {
    const rec = determineNextStrategy(makeItem(), []);
    expect(rec.strategy).toBe(DisputeStrategy.FCRA_611_BUREAU_DISPUTE);
    expect(rec.priority).toBe("standard");
  });

  it("returns FCRA_609 after round 1 comes back verified", () => {
    const rounds = [
      makeRound({ response: { dateReceived: "2024-01-15", outcome: DisputeOutcome.VERIFIED } }),
    ];
    const rec = determineNextStrategy(makeItem(), rounds);
    expect(rec.strategy).toBe(DisputeStrategy.FCRA_609_VERIFICATION);
  });

  it("returns FCRA_623 after round 2 verified for non-late-payment", () => {
    const rounds = [
      makeRound({ roundNumber: 1, response: { dateReceived: "2024-01-15", outcome: DisputeOutcome.VERIFIED } }),
      makeRound({ roundNumber: 2, response: { dateReceived: "2024-02-15", outcome: DisputeOutcome.VERIFIED } }),
    ];
    const rec = determineNextStrategy(makeItem({ itemType: ItemType.CHARGE_OFF }), rounds);
    expect(rec.strategy).toBe(DisputeStrategy.FCRA_623_FURNISHER_DISPUTE);
    expect(rec.priority).toBe("escalated");
  });

  it("returns GOODWILL after round 2 verified for isolated late payment", () => {
    const rounds = [
      makeRound({ roundNumber: 1, response: { dateReceived: "2024-01-15", outcome: DisputeOutcome.VERIFIED } }),
      makeRound({ roundNumber: 2, response: { dateReceived: "2024-02-15", outcome: DisputeOutcome.VERIFIED } }),
    ];
    const item = makeItem({ itemType: ItemType.LATE_PAYMENT, latePaymentDates: ["2023-05-01"] });
    const rec = determineNextStrategy(item, rounds);
    expect(rec.strategy).toBe(DisputeStrategy.GOODWILL_LETTER);
  });

  it("returns CFPB_COMPLAINT after round 3 verified", () => {
    const makeVerifiedRound = (num: number): DisputeRound =>
      makeRound({ roundNumber: num, response: { dateReceived: "2024-01-15", outcome: DisputeOutcome.VERIFIED } });
    const rounds = [makeVerifiedRound(1), makeVerifiedRound(2), makeVerifiedRound(3)];
    const rec = determineNextStrategy(makeItem(), rounds);
    expect(rec.strategy).toBe(DisputeStrategy.CFPB_COMPLAINT);
    expect(rec.priority).toBe("escalated");
  });

  it("returns INTENT_TO_LITIGATE after 4+ verified rounds", () => {
    const makeVerifiedRound = (num: number): DisputeRound =>
      makeRound({ roundNumber: num, response: { dateReceived: "2024-01-15", outcome: DisputeOutcome.VERIFIED } });
    const rounds = [1, 2, 3, 4].map(makeVerifiedRound);
    const rec = determineNextStrategy(makeItem(), rounds);
    expect(rec.strategy).toBe(DisputeStrategy.INTENT_TO_LITIGATE);
    expect(rec.priority).toBe("final");
  });

  it("auto-escalates to CFPB on NO_RESPONSE after round 1", () => {
    const rounds = [
      makeRound({ response: { dateReceived: "2024-02-15", outcome: DisputeOutcome.NO_RESPONSE } }),
    ];
    const rec = determineNextStrategy(makeItem(), rounds);
    expect(rec.strategy).toBe(DisputeStrategy.CFPB_COMPLAINT);
    expect(rec.priority).toBe("escalated");
  });

  it("escalates to INTENT_TO_LITIGATE on NO_RESPONSE after 3+ rounds", () => {
    const makeNoResponse = (num: number): DisputeRound =>
      makeRound({ roundNumber: num, response: { dateReceived: "2024-01-15", outcome: DisputeOutcome.NO_RESPONSE } });
    const rounds = [makeNoResponse(1), makeNoResponse(2), makeNoResponse(3)];
    const rec = determineNextStrategy(makeItem(), rounds);
    expect(rec.strategy).toBe(DisputeStrategy.INTENT_TO_LITIGATE);
  });

  it("inquiry with no rounds gets FCRA_611", () => {
    const rec = determineNextStrategy(makeItem({ itemType: ItemType.INQUIRY }), []);
    expect(rec.strategy).toBe(DisputeStrategy.FCRA_611_BUREAU_DISPUTE);
  });

  it("inquiry after verified round escalates to CFPB", () => {
    const rounds = [makeRound({ response: { dateReceived: "2024-01-15", outcome: DisputeOutcome.VERIFIED } })];
    const rec = determineNextStrategy(makeItem({ itemType: ItemType.INQUIRY }), rounds);
    expect(rec.strategy).toBe(DisputeStrategy.CFPB_COMPLAINT);
  });

  it("successful deletion resets to FCRA_611 follow-up", () => {
    const rounds = [makeRound({ response: { dateReceived: "2024-01-15", outcome: DisputeOutcome.DELETED } })];
    const rec = determineNextStrategy(makeItem(), rounds);
    expect(rec.strategy).toBe(DisputeStrategy.FCRA_611_BUREAU_DISPUTE);
  });
});

// ── calculateDeadline ─────────────────────────────────────────────────

describe("calculateDeadline", () => {
  const sentDate = "2024-01-01T00:00:00.000Z";

  it("FCRA_611 deadline is 30 days from sent date", () => {
    const result = calculateDeadline(sentDate, DisputeStrategy.FCRA_611_BUREAU_DISPUTE);
    expect(result.deadlineDays).toBe(30);
    expect(result.deadlineDate).toBeInstanceOf(Date);
    // Verify it's actually 30 days later
    const expected = new Date(sentDate);
    expected.setDate(expected.getDate() + 30);
    expect(result.deadlineDate.getTime()).toBe(expected.getTime());
  });

  it("INTENT_TO_LITIGATE deadline is 15 days", () => {
    const result = calculateDeadline(sentDate, DisputeStrategy.INTENT_TO_LITIGATE);
    expect(result.deadlineDays).toBe(15);
  });

  it("CFPB_COMPLAINT deadline is 60 days", () => {
    const result = calculateDeadline(sentDate, DisputeStrategy.CFPB_COMPLAINT);
    expect(result.deadlineDays).toBe(60);
  });

  it("returns a legalBasis string for every strategy", () => {
    for (const strategy of Object.values(DisputeStrategy)) {
      const result = calculateDeadline(sentDate, strategy);
      expect(typeof result.legalBasis).toBe("string");
      expect(result.legalBasis.length).toBeGreaterThan(0);
    }
  });

  it("accepts a Date object as sentDate", () => {
    const dateObj = new Date("2024-03-15");
    const result = calculateDeadline(dateObj, DisputeStrategy.FCRA_611_BUREAU_DISPUTE);
    expect(result.deadlineDays).toBe(30);
    expect(result.deadlineDate).toBeInstanceOf(Date);
  });
});

// ── checkForViolations ────────────────────────────────────────────────

describe("checkForViolations", () => {
  it("returns no violations when within deadline with no response", () => {
    const future = new Date();
    future.setDate(future.getDate() + 10);
    const round = makeRound({ deadlineDate: future.toISOString() });
    expect(checkForViolations(round)).toHaveLength(0);
  });

  it("returns FCRA_611_NO_RESPONSE violation when deadline passed with no response", () => {
    const past = new Date();
    past.setDate(past.getDate() - 5);
    const round = makeRound({ deadlineDate: past.toISOString() });
    const violations = checkForViolations(round);
    expect(violations.length).toBeGreaterThan(0);
    expect(violations[0].code).toBe("FCRA_611_NO_RESPONSE");
    expect(violations[0].severity).toBe("severe");
  });

  it("detects late response violation when response > 30 days after sent", () => {
    const round = makeRound({ dateSent: "2024-01-01", deadlineDate: "2024-01-31" });
    const response: DisputeResponse = { dateReceived: "2024-02-15", outcome: DisputeOutcome.VERIFIED };
    const violations = checkForViolations(round, response);
    const late = violations.find(v => v.code === "FCRA_611_LATE");
    expect(late).toBeDefined();
    expect(late?.severity).toBe("moderate");
  });

  it("detects severely late response (> 45 days)", () => {
    const round = makeRound({ dateSent: "2024-01-01", deadlineDate: "2024-01-31" });
    const response: DisputeResponse = { dateReceived: "2024-03-01", outcome: DisputeOutcome.VERIFIED };
    const violations = checkForViolations(round, response);
    const late = violations.find(v => v.code === "FCRA_611_LATE");
    expect(late?.severity).toBe("severe");
  });

  it("detects FCRA_609_NO_METHOD when verified without verificationMethod", () => {
    const round = makeRound();
    const response: DisputeResponse = { dateReceived: "2024-01-15", outcome: DisputeOutcome.VERIFIED };
    const violations = checkForViolations(round, response);
    expect(violations.some(v => v.code === "FCRA_609_NO_METHOD")).toBe(true);
  });

  it("no FCRA_609 violation when verificationMethod is provided", () => {
    const round = makeRound();
    const response: DisputeResponse = {
      dateReceived: "2024-01-15",
      outcome: DisputeOutcome.VERIFIED,
      verificationMethod: "Automated data match",
    };
    const violations = checkForViolations(round, response);
    expect(violations.some(v => v.code === "FCRA_609_NO_METHOD")).toBe(false);
  });

  it("detects FDCPA_809_NO_VALIDATION for FDCPA round verified without documents", () => {
    const round = makeRound({ strategy: DisputeStrategy.FDCPA_809_VALIDATION });
    const response: DisputeResponse = {
      dateReceived: "2024-01-15",
      outcome: DisputeOutcome.VERIFIED,
      documentsReceived: [],
    };
    const violations = checkForViolations(round, response);
    expect(violations.some(v => v.code === "FDCPA_809_NO_VALIDATION")).toBe(true);
  });

  it("no violation for timely DELETED response", () => {
    const round = makeRound({ dateSent: "2024-01-01", deadlineDate: "2024-01-31" });
    const response: DisputeResponse = { dateReceived: "2024-01-20", outcome: DisputeOutcome.DELETED };
    const violations = checkForViolations(round, response);
    expect(violations).toHaveLength(0);
  });
});

// ── analyzeResponse ───────────────────────────────────────────────────

describe("analyzeResponse", () => {
  const round = makeRound({ dateSent: "2024-01-01", deadlineDate: "2024-01-31" });

  it("marks DELETED as favorable with low urgency", () => {
    const result = analyzeResponse({ dateReceived: "2024-01-15", outcome: DisputeOutcome.DELETED }, round);
    expect(result.isFavorable).toBe(true);
    expect(result.urgencyLevel).toBe("low");
    expect(result.violations).toHaveLength(0);
  });

  it("marks UPDATED as favorable", () => {
    const result = analyzeResponse({ dateReceived: "2024-01-15", outcome: DisputeOutcome.UPDATED }, round);
    expect(result.isFavorable).toBe(true);
    expect(result.nextStrategy).toBe(DisputeStrategy.FCRA_611_BUREAU_DISPUTE);
  });

  it("marks VERIFIED as unfavorable", () => {
    const result = analyzeResponse({ dateReceived: "2024-01-15", outcome: DisputeOutcome.VERIFIED }, round);
    expect(result.isFavorable).toBe(false);
  });

  it("marks NO_RESPONSE as critical urgency", () => {
    const result = analyzeResponse({ dateReceived: "2024-02-15", outcome: DisputeOutcome.NO_RESPONSE }, round);
    expect(result.urgencyLevel).toBe("critical");
    expect(result.violations.some(v => v.code === "FCRA_611_LATE_RESPONSE")).toBe(true);
  });

  it("elevates urgency to high when response is late", () => {
    const result = analyzeResponse({ dateReceived: "2024-02-15", outcome: DisputeOutcome.VERIFIED }, round);
    expect(result.urgencyLevel).toBe("high");
  });
});

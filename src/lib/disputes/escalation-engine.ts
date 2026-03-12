// CreditClean AI — Escalation Engine
// Determines next dispute strategy, analyzes responses, identifies violations,
// and generates attorney handoff packages.

import {
  CreditItem,
  DisputeRound,
  DisputeResponse,
  DisputeStrategy,
  DisputeOutcome,
  DisputeLetter,
  ItemType,
  Violation,
  AttorneyPackage,
  UserProfile,
} from "./types";
import {
  generateFCRA611Letter,
  generateFCRA609Letter,
  generateFDCPA809Letter,
  generateFCRA623Letter,
  generateGoodwillLetter,
  generateCFPBComplaint,
  generateStateAGComplaint,
  generateIntentToLitigate,
} from "./letter-templates";

// ─────────────────────────────────────────────────────────
// Strategy Determination
// ─────────────────────────────────────────────────────────

interface StrategyRecommendation {
  strategy: DisputeStrategy;
  reasoning: string;
  priority: "standard" | "escalated" | "final";
  additionalStrategies?: DisputeStrategy[]; // parallel strategies to run
}

/**
 * Determines the next best legal strategy based on the item and its dispute history.
 *
 * Escalation ladder:
 * - No previous rounds → FCRA §611 bureau dispute
 * - Round 1 verified → FCRA §609 + FDCPA §809 (if collection)
 * - Round 2 verified → FCRA §623 direct furnisher (or goodwill for late payments)
 * - Round 3 verified → CFPB complaint
 * - Round 4+ still unresolved → Intent to litigate (attorney package)
 * - No response within deadline → auto-escalate (non-response is itself a violation)
 * - Inquiries: one-and-done with FCRA §604 challenge
 * - Medical debt: HIPAA angle at every stage
 */
export function determineNextStrategy(
  creditItem: CreditItem,
  previousRounds: DisputeRound[]
): StrategyRecommendation {
  const completedRounds = previousRounds.filter((r) => r.response !== undefined);
  const roundCount = completedRounds.length;
  const lastRound = completedRounds[completedRounds.length - 1];
  const lastOutcome = lastRound?.response?.outcome;

  // Special case: inquiries — one-and-done with permissible purpose challenge
  if (creditItem.itemType === ItemType.INQUIRY) {
    if (roundCount === 0) {
      return {
        strategy: DisputeStrategy.FCRA_611_BUREAU_DISPUTE,
        reasoning:
          "Challenging unauthorized inquiry under FCRA §604 (permissible purpose) via §611 bureau dispute. Inquiries typically require only one dispute round — if the creditor cannot demonstrate permissible purpose, the inquiry must be removed.",
        priority: "standard",
      };
    }
    if (lastOutcome === DisputeOutcome.VERIFIED) {
      return {
        strategy: DisputeStrategy.CFPB_COMPLAINT,
        reasoning:
          "Inquiry was verified despite no permissible purpose. Escalating to CFPB complaint — bureaus are more responsive to regulatory complaints for inquiry disputes.",
        priority: "escalated",
      };
    }
  }

  // Check for non-response violations — auto-escalate
  const hasNonResponse = previousRounds.some(
    (r) => r.response?.outcome === DisputeOutcome.NO_RESPONSE
  );
  if (hasNonResponse && roundCount >= 1) {
    const nonResponseRound = previousRounds.find(
      (r) => r.response?.outcome === DisputeOutcome.NO_RESPONSE
    );
    if (nonResponseRound && roundCount < 3) {
      return {
        strategy: DisputeStrategy.CFPB_COMPLAINT,
        reasoning: `Bureau failed to respond within the statutory 30-day period to Round ${nonResponseRound.roundNumber} dispute. Non-response is itself a violation of FCRA §611 (15 U.S.C. §1681i). Escalating directly to CFPB complaint because the bureau has already demonstrated unwillingness to comply with the law.`,
        priority: "escalated",
        additionalStrategies: [DisputeStrategy.STATE_AG_COMPLAINT],
      };
    }
    if (nonResponseRound && roundCount >= 3) {
      return {
        strategy: DisputeStrategy.INTENT_TO_LITIGATE,
        reasoning: `Bureau failed to respond to dispute(s) and has demonstrated a pattern of noncompliance across ${roundCount} rounds. Non-response violations provide strong basis for willful noncompliance under FCRA §616. Recommending intent-to-litigate letter and attorney consultation.`,
        priority: "final",
      };
    }
  }

  // Standard escalation ladder
  switch (roundCount) {
    case 0:
      // No previous rounds — start with standard bureau dispute
      return {
        strategy: DisputeStrategy.FCRA_611_BUREAU_DISPUTE,
        reasoning:
          "Initial dispute. Filing FCRA §611 bureau dispute to trigger the mandatory 30-day reinvestigation period. This establishes the paper trail and creates the foundation for escalation if needed.",
        priority: "standard",
        additionalStrategies:
          creditItem.itemType === ItemType.COLLECTION ||
          creditItem.itemType === ItemType.MEDICAL_DEBT
            ? [DisputeStrategy.FDCPA_809_VALIDATION]
            : undefined,
      };

    case 1:
      if (lastOutcome === DisputeOutcome.DELETED || lastOutcome === DisputeOutcome.UPDATED) {
        return {
          strategy: DisputeStrategy.FCRA_611_BUREAU_DISPUTE,
          reasoning:
            "Previous dispute was partially successful. If the update did not fully resolve the issue, file another §611 dispute with the bureau specifying what remains inaccurate.",
          priority: "standard",
        };
      }
      // Round 1 came back "verified"
      const additionalR1: DisputeStrategy[] = [];
      if (
        creditItem.itemType === ItemType.COLLECTION ||
        creditItem.itemType === ItemType.MEDICAL_DEBT
      ) {
        additionalR1.push(DisputeStrategy.FDCPA_809_VALIDATION);
      }
      return {
        strategy: DisputeStrategy.FCRA_609_VERIFICATION,
        reasoning:
          'Round 1 dispute came back "verified." Demanding the specific method of verification under FCRA §609. If the bureau cannot provide it, the item is by definition unverifiable and must be deleted. This shifts the burden back to the bureau.',
        priority: "standard",
        additionalStrategies: additionalR1.length > 0 ? additionalR1 : undefined,
      };

    case 2:
      if (lastOutcome === DisputeOutcome.DELETED || lastOutcome === DisputeOutcome.UPDATED) {
        return {
          strategy: DisputeStrategy.FCRA_611_BUREAU_DISPUTE,
          reasoning: "Previous round was partially successful. Continuing with targeted follow-up.",
          priority: "standard",
        };
      }
      // Round 2 verified — go directly to furnisher
      if (
        creditItem.itemType === ItemType.LATE_PAYMENT &&
        creditItem.latePaymentDates &&
        creditItem.latePaymentDates.length <= 2
      ) {
        return {
          strategy: DisputeStrategy.GOODWILL_LETTER,
          reasoning:
            "Two rounds of disputes have been verified. For isolated late payments, a goodwill letter to the original creditor is often more effective at this stage than further legal disputes. Simultaneously filing a §623 direct furnisher dispute as a backup.",
          priority: "standard",
          additionalStrategies: [DisputeStrategy.FCRA_623_FURNISHER_DISPUTE],
        };
      }
      return {
        strategy: DisputeStrategy.FCRA_623_FURNISHER_DISPUTE,
        reasoning:
          "Two rounds of bureau disputes have been unsuccessful. Bypassing the bureau and disputing directly with the furnisher under FCRA §623(a)(8). This forces the furnisher to conduct their own investigation independent of the bureau's cursory process.",
        priority: "escalated",
      };

    case 3:
      if (lastOutcome === DisputeOutcome.DELETED || lastOutcome === DisputeOutcome.UPDATED) {
        return {
          strategy: DisputeStrategy.FCRA_611_BUREAU_DISPUTE,
          reasoning: "Previous round was partially successful. Filing targeted follow-up.",
          priority: "standard",
        };
      }
      return {
        strategy: DisputeStrategy.CFPB_COMPLAINT,
        reasoning:
          "Three rounds of disputes have failed to resolve this inaccurate item. Escalating to a formal CFPB complaint. The CFPB requires the company to respond within 15 days and close the complaint within 60 days. Companies generally take CFPB complaints significantly more seriously than consumer disputes.",
        priority: "escalated",
        additionalStrategies: [DisputeStrategy.STATE_AG_COMPLAINT],
      };

    default:
      // Round 4+ — intent to litigate
      return {
        strategy: DisputeStrategy.INTENT_TO_LITIGATE,
        reasoning: `${roundCount} rounds of disputes, including regulatory complaints, have failed to resolve this inaccurate item. The pattern of noncompliance establishes strong grounds for willful violation under FCRA §616. Recommending pre-litigation notice with 15-day demand. This letter is designed to be provided to a consumer rights attorney if the demand is not met. Estimated statutory damages: $${(roundCount * 100).toLocaleString()} to $${(roundCount * 1000).toLocaleString()} (${roundCount} violations × $100-$1,000) plus potential punitive damages and attorney's fees.`,
        priority: "final",
      };
  }
}

// ─────────────────────────────────────────────────────────
// Response Analysis
// ─────────────────────────────────────────────────────────

interface ResponseAnalysis {
  isFavorable: boolean;
  outcome: DisputeOutcome;
  violations: Violation[];
  nextAction: string;
  nextStrategy?: DisputeStrategy;
  urgencyLevel: "low" | "medium" | "high" | "critical";
}

/**
 * Analyzes a response to a dispute and determines the outcome, violations, and next steps.
 */
export function analyzeResponse(
  response: DisputeResponse,
  disputeRound: DisputeRound
): ResponseAnalysis {
  const violations: Violation[] = [];
  let isFavorable = false;
  let nextAction = "";
  let nextStrategy: DisputeStrategy | undefined;
  let urgencyLevel: "low" | "medium" | "high" | "critical" = "medium";

  // Check outcome
  switch (response.outcome) {
    case DisputeOutcome.DELETED:
      isFavorable = true;
      nextAction =
        "Item has been deleted. Verify deletion on all three bureau reports within 30-45 days. Order updated credit reports to confirm. No further dispute action needed for this item.";
      urgencyLevel = "low";
      break;

    case DisputeOutcome.UPDATED:
      isFavorable = true;
      nextAction =
        "Item has been updated. Review the changes carefully to ensure they are accurate and complete. If any inaccuracies remain, file a follow-up dispute targeting the specific remaining errors.";
      nextStrategy = DisputeStrategy.FCRA_611_BUREAU_DISPUTE;
      urgencyLevel = "low";
      break;

    case DisputeOutcome.PARTIAL_UPDATE:
      isFavorable = false;
      nextAction =
        "Bureau made partial corrections but did not fully resolve the dispute. File a follow-up dispute specifically addressing the remaining inaccuracies, referencing the partial update as evidence that the bureau acknowledged problems with the original reporting.";
      nextStrategy = DisputeStrategy.FCRA_611_BUREAU_DISPUTE;
      urgencyLevel = "medium";
      break;

    case DisputeOutcome.VERIFIED:
      isFavorable = false;
      nextAction =
        'Bureau claims the information was "verified." This does not end the dispute process — demand the method of verification under §609 and escalate per the escalation ladder.';
      urgencyLevel = "medium";

      // Check if they provided method of verification
      if (!response.verificationMethod) {
        violations.push({
          code: "FCRA_609_NO_MOV",
          statute: "FCRA §609 (15 U.S.C. §1681g)",
          description:
            'Bureau verified the item but failed to provide the method of verification. A generic "verified" response without disclosing the specific procedure used does not satisfy the bureau\'s obligation under §609.',
          severity: "moderate",
          estimatedDamages: "$100-$1,000 statutory damages per violation",
          evidenceDescription: `Round ${disputeRound.roundNumber} response verified item without specifying method of verification.`,
        });
      }
      break;

    case DisputeOutcome.NO_RESPONSE:
      isFavorable = false;
      nextAction =
        "Bureau failed to respond within the statutory 30-day period. This is itself a violation of FCRA §611. The item should be deemed unverified and deleted. Escalate immediately with CFPB complaint and document the non-response violation.";
      urgencyLevel = "critical";

      violations.push({
        code: "FCRA_611_LATE_RESPONSE",
        statute: "FCRA §611 (15 U.S.C. §1681i)",
        description:
          "Bureau failed to complete reinvestigation within the mandatory 30-day period. Under §611(a)(1), the agency must complete its investigation before the end of the 30-day period. Failure to do so is a direct violation.",
        severity: "severe",
        estimatedDamages: "$100-$1,000 statutory damages + potential punitive damages",
        evidenceDescription: `Round ${disputeRound.roundNumber} dispute sent ${disputeRound.dateSent}, deadline ${disputeRound.deadlineDate}. No response received.`,
      });
      break;

    case DisputeOutcome.INVESTIGATION_IN_PROGRESS:
      isFavorable = false;
      nextAction =
        "Bureau claims investigation is still in progress. The FCRA allows a maximum of 45 days (30 + 15 day extension if consumer provides additional information). Monitor closely and escalate if no resolution by the extended deadline.";
      urgencyLevel = "medium";
      break;
  }

  // Check for timeline violations
  if (response.dateReceived && disputeRound.dateSent) {
    const sent = new Date(disputeRound.dateSent);
    const received = new Date(response.dateReceived);
    const daysDiff = Math.floor((received.getTime() - sent.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff > 30 && response.outcome !== DisputeOutcome.NO_RESPONSE) {
      violations.push({
        code: "FCRA_611_LATE_INVESTIGATION",
        statute: "FCRA §611(a)(1) (15 U.S.C. §1681i(a)(1))",
        description: `Bureau responded ${daysDiff} days after the dispute was sent, exceeding the 30-day statutory limit by ${daysDiff - 30} days. Even if the response was ultimately received, the lateness itself constitutes a violation.`,
        severity: "moderate",
        estimatedDamages: "$100-$1,000 statutory damages",
        evidenceDescription: `Dispute sent ${disputeRound.dateSent}, response received ${response.dateReceived} (${daysDiff} days later).`,
      });
      urgencyLevel = "high";
    }
  }

  return {
    isFavorable,
    outcome: response.outcome,
    violations,
    nextAction,
    nextStrategy,
    urgencyLevel,
  };
}

// ─────────────────────────────────────────────────────────
// Deadline Calculation
// ─────────────────────────────────────────────────────────

/**
 * Calculates the deadline date based on the strategy and applicable law.
 *
 * - FCRA §611 disputes: 30 days (extendable to 45 if consumer provides additional info)
 * - FDCPA §809 validation: 30 days from initial communication for consumer to dispute;
 *   collector must cease until validated (no fixed deadline for collector response)
 * - FCRA §623 furnisher disputes: 30 days
 * - CFPB complaints: 15 days for initial response, 60 days to close
 * - Intent to litigate: 15 days (our own demand)
 * - Goodwill: 30 days (courtesy, no legal requirement)
 */
export function calculateDeadline(
  sentDate: string | Date,
  strategy: DisputeStrategy
): { deadlineDate: Date; deadlineDays: number; legalBasis: string } {
  const sent = typeof sentDate === "string" ? new Date(sentDate) : sentDate;

  const deadlines: Record<
    DisputeStrategy,
    { days: number; basis: string }
  > = {
    [DisputeStrategy.FCRA_611_BUREAU_DISPUTE]: {
      days: 30,
      basis:
        "FCRA §611(a)(1) requires completion of reinvestigation within 30 days of receipt. May be extended to 45 days if consumer provides additional relevant information during the investigation.",
    },
    [DisputeStrategy.FCRA_609_VERIFICATION]: {
      days: 30,
      basis:
        "FCRA §609(a)(1) — bureau must provide disclosures upon request. While no specific deadline is enumerated for method-of-verification requests, the 30-day reinvestigation period under §611 applies to the underlying dispute.",
    },
    [DisputeStrategy.FDCPA_809_VALIDATION]: {
      days: 30,
      basis:
        "FDCPA §809(b) — collector must cease collection until validation is provided. While no specific deadline for the collector's response is enumerated, the collector may not resume collection activity until validation is mailed. 30 days is a reasonable expectation for response.",
    },
    [DisputeStrategy.FCRA_623_FURNISHER_DISPUTE]: {
      days: 30,
      basis:
        "FCRA §623(a)(8)(E) — furnisher must investigate and report results. The investigation must be completed within 30 days, consistent with the reinvestigation timeline under §611.",
    },
    [DisputeStrategy.GOODWILL_LETTER]: {
      days: 30,
      basis:
        "No legal deadline — goodwill requests are voluntary. 30 days is a reasonable expectation for a business response.",
    },
    [DisputeStrategy.CFPB_COMPLAINT]: {
      days: 60,
      basis:
        "CFPB requires companies to respond to complaints within 15 calendar days and close complaints within 60 days. The company's response is shared with the consumer.",
    },
    [DisputeStrategy.STATE_AG_COMPLAINT]: {
      days: 60,
      basis:
        "State attorney general investigations vary in timeline. 60 days is a typical initial response window, though complex investigations may take longer.",
    },
    [DisputeStrategy.INTENT_TO_LITIGATE]: {
      days: 15,
      basis:
        "Pre-litigation demand — 15 days is a standard demand period in consumer protection cases, providing sufficient time for the recipient to consult legal counsel and respond before litigation is filed.",
    },
  };

  const config = deadlines[strategy];
  const deadlineDate = new Date(sent);
  deadlineDate.setDate(deadlineDate.getDate() + config.days);

  return {
    deadlineDate,
    deadlineDays: config.days,
    legalBasis: config.basis,
  };
}

// ─────────────────────────────────────────────────────────
// Violation Detection
// ─────────────────────────────────────────────────────────

/**
 * Identifies all legal violations based on a dispute round and its response.
 */
export function checkForViolations(
  disputeRound: DisputeRound,
  response?: DisputeResponse
): Violation[] {
  const violations: Violation[] = [];

  if (!response) {
    // Check if deadline has passed with no response
    const deadline = new Date(disputeRound.deadlineDate);
    const now = new Date();
    if (now > deadline) {
      violations.push({
        code: "FCRA_611_NO_RESPONSE",
        statute: "FCRA §611 (15 U.S.C. §1681i)",
        description:
          "Bureau/furnisher failed to respond within the statutory deadline. Under FCRA §611(a)(1), the reinvestigation must be completed within 30 days. Failure to respond at all is a clear violation and may indicate willful noncompliance under §616.",
        severity: "severe",
        estimatedDamages:
          "$100-$1,000 statutory damages for willful noncompliance, plus potential punitive damages under FCRA §616 (15 U.S.C. §1681n)",
        evidenceDescription: `Dispute sent ${disputeRound.dateSent}. Deadline: ${disputeRound.deadlineDate}. No response received as of ${now.toISOString().split("T")[0]}.`,
      });
    }
    return violations;
  }

  // Late response
  const sentDate = new Date(disputeRound.dateSent);
  const receivedDate = new Date(response.dateReceived);
  const daysDiff = Math.floor(
    (receivedDate.getTime() - sentDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysDiff > 30) {
    violations.push({
      code: "FCRA_611_LATE",
      statute: "FCRA §611(a)(1) (15 U.S.C. §1681i(a)(1))",
      description: `Response received ${daysDiff} days after dispute was sent, exceeding the 30-day statutory limit by ${daysDiff - 30} days.`,
      severity: daysDiff > 45 ? "severe" : "moderate",
      estimatedDamages: "$100-$1,000 statutory damages",
      evidenceDescription: `Dispute sent ${disputeRound.dateSent}, response received ${response.dateReceived} (${daysDiff} days).`,
    });
  }

  // Verified without method of verification
  if (response.outcome === DisputeOutcome.VERIFIED && !response.verificationMethod) {
    violations.push({
      code: "FCRA_609_NO_METHOD",
      statute: "FCRA §609(a)(1) (15 U.S.C. §1681g)",
      description:
        'Item was reported as "verified" without disclosing the specific method of verification. Under §609, the bureau must disclose the method used to verify disputed information upon consumer request.',
      severity: "moderate",
      estimatedDamages: "$100-$1,000 statutory damages",
      evidenceDescription: `Round ${disputeRound.roundNumber}: Bureau verified item without providing method of verification.`,
    });
  }

  // Continued reporting during dispute (if detectable)
  if (
    response.outcome === DisputeOutcome.INVESTIGATION_IN_PROGRESS &&
    response.updatedStatus &&
    !response.updatedStatus.toLowerCase().includes("disputed")
  ) {
    violations.push({
      code: "FCRA_611_NO_DISPUTED_FLAG",
      statute: "FCRA §611(a)(3) (15 U.S.C. §1681i(a)(3))",
      description:
        'Bureau is reporting the account without a "disputed" notation during an active investigation. Under §611(a)(3), a CRA must note in the consumer\'s file that the item is disputed during the reinvestigation period.',
      severity: "moderate",
      estimatedDamages: "$100-$1,000 statutory damages",
      evidenceDescription: `Round ${disputeRound.roundNumber}: Account status "${response.updatedStatus}" does not reflect active dispute.`,
    });
  }

  // For FDCPA disputes — continued collection after validation request
  if (
    disputeRound.strategy === DisputeStrategy.FDCPA_809_VALIDATION &&
    response.outcome === DisputeOutcome.VERIFIED &&
    (!response.documentsReceived || response.documentsReceived.length === 0)
  ) {
    violations.push({
      code: "FDCPA_809_NO_VALIDATION",
      statute: "FDCPA §809(b) (15 U.S.C. §1692g(b))",
      description:
        "Collector claims debt is valid but failed to provide actual validation documentation (original agreement, payment history, chain of ownership). Under §809(b), the collector must obtain and mail verification of the debt. A mere assertion of validity without supporting documentation does not constitute proper validation.",
      severity: "severe",
      estimatedDamages:
        "Up to $1,000 statutory damages under 15 U.S.C. §1692k, plus actual damages",
      evidenceDescription: `Round ${disputeRound.roundNumber}: Collector responded without providing validation documents.`,
    });
  }

  return violations;
}

// ─────────────────────────────────────────────────────────
// Attorney Package Generation
// ─────────────────────────────────────────────────────────

/**
 * Compiles a complete litigation-ready package for attorney handoff.
 * Includes full timeline, all correspondence, identified violations,
 * and estimated statutory damages.
 */
export function generateAttorneyPackage(
  userProfile: UserProfile,
  creditItem: CreditItem,
  allRounds: DisputeRound[]
): AttorneyPackage {
  // Build timeline
  const timeline: { date: string; event: string; details: string }[] = [];

  for (const round of allRounds) {
    timeline.push({
      date: round.dateSent,
      event: `Dispute Round ${round.roundNumber} Sent`,
      details: `Strategy: ${round.strategy}. Sent to ${round.recipientName} via certified mail${round.trackingNumber ? ` (tracking: ${round.trackingNumber})` : ""}. Deadline: ${round.deadlineDate}.`,
    });

    if (round.response) {
      timeline.push({
        date: round.response.dateReceived,
        event: `Round ${round.roundNumber} Response Received`,
        details: `Outcome: ${round.response.outcome}. ${round.response.bureauExplanation ?? ""} ${round.response.verificationMethod ? `Method of verification: ${round.response.verificationMethod}` : "No method of verification provided."}`,
      });
    } else {
      timeline.push({
        date: round.deadlineDate,
        event: `Round ${round.roundNumber} Deadline Passed — NO RESPONSE`,
        details: `No response received by the statutory deadline of ${round.deadlineDate}. This constitutes a violation of FCRA §611 (15 U.S.C. §1681i).`,
      });
    }
  }

  // Sort timeline chronologically
  timeline.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Collect all violations
  const allViolations: Violation[] = [];
  for (const round of allRounds) {
    const roundViolations = checkForViolations(round, round.response);
    allViolations.push(...roundViolations);
  }

  // Calculate estimated damages
  const severeCount = allViolations.filter((v) => v.severity === "severe").length;
  const moderateCount = allViolations.filter((v) => v.severity === "moderate").length;
  const minorCount = allViolations.filter((v) => v.severity === "minor").length;
  const totalViolations = allViolations.length;

  const minStatutory = totalViolations * 100;
  const maxStatutory = totalViolations * 1000;

  const damagesSummary = `
ESTIMATED DAMAGES ANALYSIS:

Statutory Damages (FCRA §616, 15 U.S.C. §1681n):
- ${totalViolations} identified violation(s) × $100-$1,000 = $${minStatutory.toLocaleString()} to $${maxStatutory.toLocaleString()}
  - ${severeCount} severe violation(s) (likely at higher end of statutory range)
  - ${moderateCount} moderate violation(s)
  - ${minorCount} minor violation(s)

Punitive Damages:
- Available for willful noncompliance under §616. The pattern of ${totalViolations} violation(s) across ${allRounds.length} dispute rounds supports a finding of willful noncompliance. Punitive damages are at the court's discretion and are not capped by statute.

Actual Damages:
- To be calculated based on: credit denials, increased interest rates paid, insurance premium increases, emotional distress, lost opportunities, and time spent pursuing disputes.

Attorney's Fees and Costs:
- Recoverable under both §616 (willful) and §617 (negligent) noncompliance. FCRA is a fee-shifting statute — the prevailing consumer recovers attorney's fees.
`.trim();

  // Summary
  const summary = `
ATTORNEY PACKAGE — LITIGATION SUMMARY

Client: ${userProfile.firstName} ${userProfile.lastName}
Adverse Party: ${creditItem.bureau.charAt(0).toUpperCase() + creditItem.bureau.slice(1)} (${creditItem.creditorName})
Item Type: ${creditItem.itemType}
Account: ${creditItem.accountNumber}

Dispute History: ${allRounds.length} round(s) over ${allRounds.length > 0 ? `${Math.ceil((new Date().getTime() - new Date(allRounds[0].dateSent).getTime()) / (1000 * 60 * 60 * 24))} days` : "N/A"}
Outcome: Item remains on credit report despite exhaustive dispute efforts
Identified Violations: ${totalViolations} (${severeCount} severe, ${moderateCount} moderate, ${minorCount} minor)
Estimated Statutory Damages: $${minStatutory.toLocaleString()} to $${maxStatutory.toLocaleString()} (plus punitive damages and attorney's fees)

Legal Basis: FCRA §§611, 609, 623, 616, 617 (15 U.S.C. §§1681i, 1681g, 1681s-2, 1681n, 1681o)
${creditItem.itemType === ItemType.COLLECTION || creditItem.itemType === ItemType.MEDICAL_DEBT ? "FDCPA §§809, 807 (15 U.S.C. §§1692g, 1692e)" : ""}

Recommended Action: File complaint in U.S. District Court under FCRA. Fee-shifting statute makes this viable for consumer attorneys on contingency. Strong paper trail with certified mail documentation at every stage.

${damagesSummary}
`.trim();

  return {
    clientProfile: userProfile,
    creditItem,
    timeline,
    disputeRounds: allRounds,
    identifiedViolations: allViolations,
    estimatedStatutoryDamages: `$${minStatutory.toLocaleString()} to $${maxStatutory.toLocaleString()} (${totalViolations} violations)`,
    summary,
  };
}

// ─────────────────────────────────────────────────────────
// Letter Generation Dispatcher
// ─────────────────────────────────────────────────────────

/**
 * Generates a dispute letter for the given strategy.
 * Convenience function that dispatches to the appropriate template.
 */
export function generateLetter(
  strategy: DisputeStrategy,
  userProfile: UserProfile,
  creditItem: CreditItem,
  previousRounds?: DisputeRound[]
): DisputeLetter {
  const generators: Record<
    DisputeStrategy,
    (
      user: UserProfile,
      item: CreditItem,
      rounds?: DisputeRound[]
    ) => DisputeLetter
  > = {
    [DisputeStrategy.FCRA_611_BUREAU_DISPUTE]: generateFCRA611Letter,
    [DisputeStrategy.FCRA_609_VERIFICATION]: generateFCRA609Letter,
    [DisputeStrategy.FDCPA_809_VALIDATION]: generateFDCPA809Letter,
    [DisputeStrategy.FCRA_623_FURNISHER_DISPUTE]: generateFCRA623Letter,
    [DisputeStrategy.GOODWILL_LETTER]: generateGoodwillLetter,
    [DisputeStrategy.CFPB_COMPLAINT]: generateCFPBComplaint,
    [DisputeStrategy.STATE_AG_COMPLAINT]: generateStateAGComplaint,
    [DisputeStrategy.INTENT_TO_LITIGATE]: generateIntentToLitigate,
  };

  return generators[strategy](userProfile, creditItem, previousRounds);
}

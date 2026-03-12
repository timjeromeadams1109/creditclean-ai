// CreditClean AI — Damages Calculator
// Calculates maximum possible damages across all applicable laws.
// Designed to build the strongest possible case for litigation or settlement.

import type { Violation } from "../disputes/types";

export interface DamagesEstimate {
  // Federal statutory damages
  fcraStatutoryPerViolation: { min: number; max: number };
  fcraStatutoryTotal: { min: number; max: number };
  fdcpaStatutoryPerViolation: { min: number; max: number };
  fdcpaStatutoryTotal: { min: number; max: number };

  // Actual damages
  actualDamages: ActualDamagesBreakdown;

  // Punitive damages
  punitiveDamages: { estimated: string; basis: string };

  // State law additional damages
  stateDamages: StateDamagesBreakdown;

  // Attorney fees and costs
  attorneyFees: { basis: string; estimated: string };

  // Grand total
  totalEstimatedMin: number;
  totalEstimatedMax: number;

  // Summary for attorney
  summary: string;

  // Case strength assessment
  caseStrength: "weak" | "moderate" | "strong" | "very_strong";
  caseStrengthReasoning: string;
}

export interface ActualDamagesBreakdown {
  deniedCredit: { amount: number; description: string }[];
  higherInterestRates: { amount: number; description: string }[];
  lostOpportunities: { amount: number; description: string }[];
  emotionalDistress: { amount: number; description: string };
  outOfPocket: { amount: number; description: string }[];
  total: number;
}

export interface StateDamagesBreakdown {
  state: string;
  law: string;
  perViolation: { min: number; max: number };
  multiplier?: number;  // e.g. treble damages
  total: { min: number; max: number };
  notes: string;
}

// State-specific damage provisions
const STATE_DAMAGES: Record<string, {
  law: string;
  perViolation: { min: number; max: number };
  multiplier?: number;
  notes: string;
}> = {
  CA: {
    law: "California Consumer Credit Reporting Agencies Act (Civil Code §1785.31)",
    perViolation: { min: 100, max: 5000 },
    notes: "Statutory damages $100-$5,000 per violation. Punitive damages available for willful violations. Attorney fees mandatory for prevailing plaintiff. California Rosenthal Act (Civil Code §1788.30) adds up to $1,000 for collection abuse.",
  },
  TX: {
    law: "Texas Finance Code §392.403 + Deceptive Trade Practices Act",
    perViolation: { min: 100, max: 1000 },
    multiplier: 3,
    notes: "DTPA allows treble (3x) damages for knowing violations. Mental anguish damages available without physical injury. Attorney fees for prevailing consumer.",
  },
  NY: {
    law: "New York General Business Law §380-l",
    perViolation: { min: 100, max: 1000 },
    notes: "Actual damages plus costs and attorney fees. Punitive damages available for willful noncompliance. NYC Consumer Protection Law provides additional remedies.",
  },
  FL: {
    law: "Florida Consumer Collection Practices Act §559.77",
    perViolation: { min: 100, max: 1000 },
    notes: "Actual damages plus statutory damages. Attorney fees for prevailing consumer. Class action available.",
  },
  IL: {
    law: "Illinois Consumer Fraud and Deceptive Business Practices Act (815 ILCS 505)",
    perViolation: { min: 100, max: 1000 },
    notes: "Actual damages or $50,000 (whichever is greater) for violations by persons over 65. Attorney fees. Treble damages for intentional violations.",
  },
  GA: {
    law: "Georgia Fair Business Practices Act (OCGA §10-1-399)",
    perViolation: { min: 100, max: 1000 },
    notes: "Actual damages, plus treble damages for intentional violations, plus attorney fees and court costs.",
    multiplier: 3,
  },
  OH: {
    law: "Ohio Consumer Sales Practices Act (ORC §1345.09)",
    perViolation: { min: 200, max: 1000 },
    notes: "Treble damages available for knowing violations. $200 minimum statutory damage. Class action rights preserved.",
    multiplier: 3,
  },
  PA: {
    law: "Pennsylvania Unfair Trade Practices and Consumer Protection Law (73 P.S. §201-9.2)",
    perViolation: { min: 100, max: 1000 },
    multiplier: 3,
    notes: "Treble damages for violations. Attorney fees. Private right of action.",
  },
  WA: {
    law: "Washington Consumer Protection Act (RCW 19.86)",
    perViolation: { min: 100, max: 1000 },
    multiplier: 3,
    notes: "Treble damages up to $25,000. Attorney fees mandatory for prevailing consumer.",
  },
  NJ: {
    law: "New Jersey Consumer Fraud Act (NJSA 56:8-19)",
    perViolation: { min: 100, max: 1000 },
    multiplier: 3,
    notes: "Treble damages. Attorney fees. No need to prove intent — strict liability for violations.",
  },
};

/**
 * Calculate maximum possible damages for a set of violations.
 */
export function calculateDamages(
  violations: Violation[],
  state: string,
  actualDamages?: Partial<ActualDamagesBreakdown>
): DamagesEstimate {
  const fcraViolations = violations.filter(
    (v) => v.statute.includes("FCRA") || v.statute.includes("1681")
  );
  const fdcpaViolations = violations.filter(
    (v) => v.statute.includes("FDCPA") || v.statute.includes("1692")
  );

  // FCRA statutory damages: $100-$1,000 per violation (§616 willful)
  const fcraStatutory = {
    perViolation: { min: 100, max: 1000 },
    total: {
      min: fcraViolations.length * 100,
      max: fcraViolations.length * 1000,
    },
  };

  // FDCPA statutory damages: up to $1,000 per case (§813(a))
  const fdcpaStatutory = {
    perViolation: { min: 0, max: 1000 },
    total: {
      min: fdcpaViolations.length > 0 ? 500 : 0,
      max: fdcpaViolations.length > 0 ? 1000 : 0,
    },
  };

  // Actual damages
  const actualDmg: ActualDamagesBreakdown = {
    deniedCredit: actualDamages?.deniedCredit ?? [],
    higherInterestRates: actualDamages?.higherInterestRates ?? [],
    lostOpportunities: actualDamages?.lostOpportunities ?? [],
    emotionalDistress: actualDamages?.emotionalDistress ?? {
      amount: 5000,
      description:
        "Emotional distress from inaccurate credit reporting: anxiety, stress, embarrassment, loss of sleep, impact on daily life. Courts regularly award $5,000-$50,000 for emotional distress in FCRA cases without physical injury requirement.",
    },
    outOfPocket: actualDamages?.outOfPocket ?? [],
    total: 0,
  };

  actualDmg.total =
    actualDmg.deniedCredit.reduce((s, d) => s + d.amount, 0) +
    actualDmg.higherInterestRates.reduce((s, d) => s + d.amount, 0) +
    actualDmg.lostOpportunities.reduce((s, d) => s + d.amount, 0) +
    actualDmg.emotionalDistress.amount +
    actualDmg.outOfPocket.reduce((s, d) => s + d.amount, 0);

  // Punitive damages (FCRA §616 — willful noncompliance)
  const severeViolations = violations.filter((v) => v.severity === "severe").length;
  const punitiveMultiplier = severeViolations >= 3 ? "3-5x" : severeViolations >= 1 ? "2-3x" : "1-2x";
  const punitiveDamages = {
    estimated: `${punitiveMultiplier} actual damages (per Guimond v. Trans Union, punitive damages available without showing malice for willful FCRA violations)`,
    basis: "FCRA §616(a)(2) — punitive damages as the court may allow. Per Safeco v. Burr (551 U.S. 47), willful includes reckless disregard of statutory duties.",
  };

  // State damages
  const stateInfo = STATE_DAMAGES[state.toUpperCase()];
  const stateDamages: StateDamagesBreakdown = stateInfo
    ? {
        state: state.toUpperCase(),
        law: stateInfo.law,
        perViolation: stateInfo.perViolation,
        multiplier: stateInfo.multiplier,
        total: {
          min: violations.length * stateInfo.perViolation.min * (stateInfo.multiplier ?? 1),
          max: violations.length * stateInfo.perViolation.max * (stateInfo.multiplier ?? 1),
        },
        notes: stateInfo.notes,
      }
    : {
        state: state.toUpperCase(),
        law: "Check state consumer protection statute",
        perViolation: { min: 0, max: 0 },
        total: { min: 0, max: 0 },
        notes: "State-specific damages not yet mapped. Consult with attorney for state law remedies.",
      };

  // Attorney fees
  const attorneyFees = {
    basis:
      "FCRA §616(a)(3) and §617(b) — attorney fees and costs mandatory for prevailing plaintiff in both willful and negligent noncompliance claims. FDCPA §813(a)(3) — costs plus reasonable attorney fees.",
    estimated:
      "Typically $5,000-$50,000+ depending on case complexity and duration. Fee-shifting means defendant pays your attorney fees if you prevail.",
  };

  // Totals
  const totalMin =
    fcraStatutory.total.min +
    fdcpaStatutory.total.min +
    actualDmg.total +
    stateDamages.total.min;
  const totalMax =
    fcraStatutory.total.max +
    fdcpaStatutory.total.max +
    actualDmg.total * 3 + // punitive multiplier on actual
    stateDamages.total.max;

  // Case strength
  let caseStrength: DamagesEstimate["caseStrength"] = "weak";
  let caseStrengthReasoning = "";

  if (violations.length >= 5 && severeViolations >= 2) {
    caseStrength = "very_strong";
    caseStrengthReasoning = `${violations.length} total violations (${severeViolations} severe). Multiple statute violations with documented evidence. Strong litigation value with fee-shifting making it attractive to consumer rights attorneys.`;
  } else if (violations.length >= 3 || severeViolations >= 1) {
    caseStrength = "strong";
    caseStrengthReasoning = `${violations.length} violations identified with clear statutory basis. Fee-shifting provision makes this viable for attorney representation on contingency.`;
  } else if (violations.length >= 1) {
    caseStrength = "moderate";
    caseStrengthReasoning = `${violations.length} violation(s) identified. May be more effective to pursue through CFPB complaint and continued disputes before litigation.`;
  } else {
    caseStrength = "weak";
    caseStrengthReasoning = "No clear violations documented yet. Continue dispute process to build evidence of violations through bureau/creditor non-compliance.";
  }

  const summary = [
    `ESTIMATED DAMAGES SUMMARY`,
    `========================`,
    ``,
    `Federal FCRA Statutory: $${fcraStatutory.total.min.toLocaleString()} - $${fcraStatutory.total.max.toLocaleString()} (${fcraViolations.length} violations × $100-$1,000)`,
    `Federal FDCPA Statutory: $${fdcpaStatutory.total.min.toLocaleString()} - $${fdcpaStatutory.total.max.toLocaleString()}`,
    `Actual Damages: $${actualDmg.total.toLocaleString()} (including emotional distress)`,
    `Punitive Damages: ${punitiveMultiplier} actual damages`,
    stateInfo ? `State Law (${state.toUpperCase()}): $${stateDamages.total.min.toLocaleString()} - $${stateDamages.total.max.toLocaleString()}${stateInfo.multiplier ? ` (${stateInfo.multiplier}x multiplier)` : ""}` : "",
    `Attorney Fees: Defendant pays if plaintiff prevails (fee-shifting)`,
    ``,
    `ESTIMATED TOTAL RANGE: $${totalMin.toLocaleString()} - $${totalMax.toLocaleString()}`,
    `(Plus attorney fees, costs, and potential punitive damages)`,
    ``,
    `Case Strength: ${caseStrength.toUpperCase().replace("_", " ")}`,
    caseStrengthReasoning,
  ]
    .filter(Boolean)
    .join("\n");

  return {
    fcraStatutoryPerViolation: fcraStatutory.perViolation,
    fcraStatutoryTotal: fcraStatutory.total,
    fdcpaStatutoryPerViolation: fdcpaStatutory.perViolation,
    fdcpaStatutoryTotal: fdcpaStatutory.total,
    actualDamages: actualDmg,
    punitiveDamages,
    stateDamages,
    attorneyFees,
    totalEstimatedMin: totalMin,
    totalEstimatedMax: totalMax,
    summary,
    caseStrength,
    caseStrengthReasoning,
  };
}

/**
 * Generate a damages narrative for inclusion in intent-to-litigate letters.
 */
export function generateDamagesNarrative(estimate: DamagesEstimate): string {
  const lines = [
    `Please be advised that my client has documented the following damages resulting from your violations of federal and state consumer protection laws:`,
    ``,
    `1. STATUTORY DAMAGES: Under FCRA §616 (15 U.S.C. §1681n), my client is entitled to statutory damages of $100 to $1,000 per willful violation. With ${Math.round(estimate.fcraStatutoryTotal.max / 1000)} documented violations, statutory damages alone range from $${estimate.fcraStatutoryTotal.min.toLocaleString()} to $${estimate.fcraStatutoryTotal.max.toLocaleString()}.`,
  ];

  if (estimate.fdcpaStatutoryTotal.max > 0) {
    lines.push(
      ``,
      `2. FDCPA DAMAGES: Under FDCPA §813 (15 U.S.C. §1692k), additional statutory damages of up to $1,000 are available for debt collection violations.`
    );
  }

  lines.push(
    ``,
    `3. ACTUAL DAMAGES: Including but not limited to denial of credit, higher interest rates on approved credit, emotional distress (anxiety, stress, embarrassment, loss of sleep), and out-of-pocket costs incurred in attempting to correct your errors.`,
    ``,
    `4. PUNITIVE DAMAGES: Under FCRA §616(a)(2), punitive damages are available for willful noncompliance. Per Guimond v. Trans Union, 45 F.3d 1329 (9th Cir. 1995), punitive damages do not require a showing of malice. Per Safeco v. Burr, 551 U.S. 47 (2007), "willful" includes reckless disregard of statutory duties.`
  );

  if (estimate.stateDamages.total.max > 0) {
    lines.push(
      ``,
      `5. STATE LAW DAMAGES: Under ${estimate.stateDamages.law}, additional damages of $${estimate.stateDamages.total.min.toLocaleString()} to $${estimate.stateDamages.total.max.toLocaleString()} are available.${estimate.stateDamages.multiplier ? ` This includes ${estimate.stateDamages.multiplier}x treble damages for knowing violations.` : ""}`
    );
  }

  lines.push(
    ``,
    `6. ATTORNEY FEES AND COSTS: Both FCRA §616(a)(3) and §617(b) provide for mandatory attorney fees and costs for the prevailing plaintiff. The FDCPA similarly provides for fee-shifting under §813(a)(3).`,
    ``,
    `The total estimated damages exposure in this matter ranges from $${estimate.totalEstimatedMin.toLocaleString()} to $${estimate.totalEstimatedMax.toLocaleString()}, exclusive of attorney fees, costs, and punitive damages.`
  );

  return lines.join("\n");
}

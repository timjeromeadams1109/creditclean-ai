// CreditClean AI — Case Law Reference
// Landmark cases that establish consumer rights in credit reporting disputes.
// These citations strengthen every letter and are essential for litigation packages.

export interface CaseLawReference {
  name: string;              // e.g. "Cushman v. Trans Union Corp."
  citation: string;          // e.g. "115 F.3d 220 (3d Cir. 1997)"
  court: string;             // e.g. "Third Circuit Court of Appeals"
  year: number;
  holding: string;           // what the court decided
  relevance: string;         // how this helps the consumer
  applicableTo: string[];    // dispute strategies this supports
  keyQuote?: string;         // quotable language from the opinion
}

// ─────────────────────────────────────────────────────────
// FCRA — Credit Bureau Liability Cases
// ─────────────────────────────────────────────────────────

export const FCRA_CASE_LAW: CaseLawReference[] = [
  {
    name: "Cushman v. Trans Union Corp.",
    citation: "115 F.3d 220 (3d Cir. 1997)",
    court: "Third Circuit Court of Appeals",
    year: 1997,
    holding:
      "Credit reporting agencies have a duty to go beyond the original source of information when a consumer disputes accuracy. A cursory reinvestigation that merely parrots the creditor's response is insufficient under FCRA §611.",
    relevance:
      "If a bureau simply asks the furnisher to re-verify and reports back without independent investigation, that is a FCRA violation. Use this when a bureau responds with 'verified as accurate' without evidence.",
    applicableTo: ["fcra_611_bureau_dispute", "fcra_609_verification"],
    keyQuote:
      "A reinvestigation that merely shifts the burden back to the consumer, or parrots information from a furnisher, is no reinvestigation at all.",
  },
  {
    name: "Cortez v. Trans Union, LLC",
    citation: "617 F.3d 688 (3d Cir. 2010)",
    court: "Third Circuit Court of Appeals",
    year: 2010,
    holding:
      "A credit bureau's reinvestigation procedures must be reasonable, not merely perfunctory. The bureau cannot rely solely on automated systems (e-OSCAR) to verify disputed information.",
    relevance:
      "Strengthens the argument that e-OSCAR automated verifications are inadequate. If the bureau used e-OSCAR and nothing else, that supports a willful noncompliance claim under §616.",
    applicableTo: ["fcra_611_bureau_dispute", "fcra_609_verification", "intent_to_litigate"],
    keyQuote:
      "The reasonableness of a CRA's reinvestigation depends on whether the CRA received notice of the dispute and what procedures it employed to resolve the dispute.",
  },
  {
    name: "Safeco Insurance Co. of America v. Burr",
    citation: "551 U.S. 47 (2007)",
    court: "Supreme Court of the United States",
    year: 2007,
    holding:
      "Willful violations of the FCRA include reckless disregard of statutory duties, not just knowing violations. A company acts willfully if its reading of the statute is objectively unreasonable.",
    relevance:
      "SUPREME COURT PRECEDENT. Establishes that you don't need to prove a bureau intentionally violated the law — reckless disregard is enough for willful noncompliance under §616, which carries $100-$1,000 statutory damages plus punitive damages.",
    applicableTo: ["intent_to_litigate", "cfpb_complaint"],
    keyQuote:
      "A company subject to FCRA does not act in 'reckless disregard' of it unless the action is not only a violation under a reasonable reading of the statute's terms, but shows that the company ran a risk of violating the law substantially greater than the risk associated with a reading that was merely careless.",
  },
  {
    name: "Spokeo, Inc. v. Robins",
    citation: "578 U.S. 330 (2016)",
    court: "Supreme Court of the United States",
    year: 2016,
    holding:
      "A plaintiff suing under the FCRA must demonstrate concrete injury, not just a bare procedural violation. However, intangible injuries (like dissemination of inaccurate information) can be concrete.",
    relevance:
      "SUPREME COURT PRECEDENT. Important for standing — your forensic report documents concrete harm (denied credit, higher rates, emotional distress) to satisfy Spokeo's concreteness requirement.",
    applicableTo: ["intent_to_litigate"],
    keyQuote:
      "Intangible injuries can nevertheless be concrete. Congress has the power to define injuries and articulate chains of causation that give rise to a case or controversy.",
  },
  {
    name: "TransUnion LLC v. Ramirez",
    citation: "594 U.S. 413 (2021)",
    court: "Supreme Court of the United States",
    year: 2021,
    holding:
      "For FCRA claims, plaintiffs must show their inaccurate credit information was actually disseminated to third parties to have standing for damages. Merely maintaining inaccurate internal records may not suffice for some claims.",
    relevance:
      "SUPREME COURT PRECEDENT. Strengthens cases where inaccurate information was actually reported to creditors who then denied credit. Document every denial and adverse action notice.",
    applicableTo: ["intent_to_litigate"],
    keyQuote:
      "No concrete harm, no standing. But the dissemination of false and misleading information about an individual to a third party constitutes a concrete injury.",
  },
  {
    name: "Henson v. CSC Credit Services",
    citation: "29 F.3d 280 (7th Cir. 1994)",
    court: "Seventh Circuit Court of Appeals",
    year: 1994,
    holding:
      "A credit reporting agency may not merely parrot information from a creditor's records. When notified of a dispute, the agency must conduct a reasonable reinvestigation.",
    relevance:
      "Establishes that the bureau has an independent duty to investigate — they cannot just accept what the furnisher says. Useful when bureau says 'the creditor confirmed the information.'",
    applicableTo: ["fcra_611_bureau_dispute", "fcra_609_verification"],
  },
  {
    name: "Guimond v. Trans Union Credit Information Co.",
    citation: "45 F.3d 1329 (9th Cir. 1995)",
    court: "Ninth Circuit Court of Appeals",
    year: 1995,
    holding:
      "A consumer need not show malice or evil motive to recover punitive damages under FCRA §616. Punitive damages are available whenever a credit reporting agency willfully fails to comply with FCRA requirements.",
    relevance:
      "Opens the door to punitive damages without proving malice. If the bureau knew about the inaccuracy and failed to correct it, punitive damages are on the table.",
    applicableTo: ["intent_to_litigate"],
    keyQuote:
      "Punitive damages serve to deter willful violations, and the FCRA authorizes them precisely to ensure that credit bureaus take their obligations seriously.",
  },
  {
    name: "Philbin v. Trans Union Corp.",
    citation: "101 F.3d 957 (3d Cir. 1996)",
    court: "Third Circuit Court of Appeals",
    year: 1996,
    holding:
      "Once a consumer notifies a credit bureau that information is inaccurate, the bureau bears the burden of verifying the accuracy. Failure to conduct a meaningful reinvestigation violates §611.",
    relevance:
      "Shifts the burden of proof to the bureau after you dispute. They must prove the item is accurate — you don't have to prove it's inaccurate.",
    applicableTo: ["fcra_611_bureau_dispute"],
  },
  {
    name: "Johnson v. MBNA America Bank, NA",
    citation: "357 F.3d 426 (4th Cir. 2004)",
    court: "Fourth Circuit Court of Appeals",
    year: 2004,
    holding:
      "FCRA §623(b) creates a private right of action against furnishers who fail to conduct a reasonable investigation after receiving notice of a dispute from a credit bureau.",
    relevance:
      "Allows you to sue the creditor/furnisher directly (not just the bureau) if they fail to investigate after the bureau forwards your dispute. Key for Round 3 (§623 direct furnisher disputes).",
    applicableTo: ["fcra_623_furnisher_dispute", "intent_to_litigate"],
  },
  {
    name: "Nelson v. Chase Manhattan Mortgage Corp.",
    citation: "282 F.3d 1057 (9th Cir. 2002)",
    court: "Ninth Circuit Court of Appeals",
    year: 2002,
    holding:
      "Furnishers have a duty under §623(b) to conduct a reasonable investigation upon receiving notice from a CRA. The investigation must be more than merely rubber-stamping prior conclusions.",
    relevance:
      "Strengthens §623 furnisher disputes. If the creditor just re-confirms without actually checking their records, that's a violation.",
    applicableTo: ["fcra_623_furnisher_dispute", "intent_to_litigate"],
  },
];

// ─────────────────────────────────────────────────────────
// FDCPA — Debt Collection Cases
// ─────────────────────────────────────────────────────────

export const FDCPA_CASE_LAW: CaseLawReference[] = [
  {
    name: "Heintz v. Jenkins",
    citation: "514 U.S. 291 (1995)",
    court: "Supreme Court of the United States",
    year: 1995,
    holding:
      "The FDCPA applies to attorneys who regularly engage in debt collection activities, including litigation. Attorneys are 'debt collectors' under the Act.",
    relevance:
      "SUPREME COURT PRECEDENT. If a law firm is collecting a debt, they must comply with the FDCPA — including §809 validation requirements and §807 false representation prohibitions.",
    applicableTo: ["fdcpa_809_validation", "intent_to_litigate"],
  },
  {
    name: "Jerman v. Carlisle, McNellie, Rini, Kramer & Ulrich LPA",
    citation: "559 U.S. 573 (2010)",
    court: "Supreme Court of the United States",
    year: 2010,
    holding:
      "The FDCPA's bona fide error defense does not apply to mistakes of law. A debt collector cannot avoid liability by claiming it did not know its conduct violated the statute.",
    relevance:
      "SUPREME COURT PRECEDENT. Collectors cannot claim ignorance of the law as a defense. If they violated the FDCPA, they're liable regardless of whether they knew it was illegal.",
    applicableTo: ["fdcpa_809_validation", "intent_to_litigate"],
  },
  {
    name: "Clomon v. Jackson",
    citation: "988 F.2d 1314 (2d Cir. 1993)",
    court: "Second Circuit Court of Appeals",
    year: 1993,
    holding:
      "A debt collector's false, deceptive, or misleading representation violates §807 regardless of whether the consumer was actually deceived. The standard is whether the least sophisticated consumer would be misled.",
    relevance:
      "The 'least sophisticated consumer' standard is consumer-friendly — if the communication COULD mislead an unsophisticated person, it's a violation. Applies to collection letters with confusing language.",
    applicableTo: ["fdcpa_809_validation", "intent_to_litigate"],
    keyQuote:
      "The basic purpose of the least-sophisticated-consumer standard is to ensure that the FDCPA protects all consumers, the gullible as well as the shrewd.",
  },
  {
    name: "Donohue v. Quick Collect, Inc.",
    citation: "592 F.3d 1027 (9th Cir. 2010)",
    court: "Ninth Circuit Court of Appeals",
    year: 2010,
    holding:
      "A debt collector violates §807(2)(A) by overstating the amount of a debt, even if the overstatement results from the collector's failure to account for payments or adjustments.",
    relevance:
      "If a collector reports a balance that includes unauthorized fees, interest, or doesn't reflect payments made, that's a violation. Compare reported balance to actual debt records.",
    applicableTo: ["fdcpa_809_validation"],
  },
  {
    name: "Miljkovic v. Shafritz and Dinkin, P.A.",
    citation: "791 F.3d 1291 (11th Cir. 2015)",
    court: "Eleventh Circuit Court of Appeals",
    year: 2015,
    holding:
      "Filing a time-barred debt collection lawsuit violates the FDCPA as an unfair and unconscionable practice under §808 and a false representation under §807.",
    relevance:
      "If a collector sues on a debt past the statute of limitations, that itself is an FDCPA violation. Use the statute of limitations calculator to identify time-barred debts.",
    applicableTo: ["fdcpa_809_validation", "intent_to_litigate"],
  },
  {
    name: "Midland Funding, LLC v. Johnson",
    citation: "581 U.S. 224 (2017)",
    court: "Supreme Court of the United States",
    year: 2017,
    holding:
      "Filing a proof of claim in bankruptcy on a time-barred debt does not violate the FDCPA. However, this applies only to bankruptcy proceedings.",
    relevance:
      "SUPREME COURT PRECEDENT. Note: this ruling is limited to bankruptcy. Outside of bankruptcy, collecting on time-barred debts CAN still violate the FDCPA per circuit court rulings.",
    applicableTo: ["fdcpa_809_validation"],
  },
  {
    name: "Romea v. Heiberger & Associates",
    citation: "163 F.3d 111 (2d Cir. 1998)",
    court: "Second Circuit Court of Appeals",
    year: 1998,
    holding:
      "A debt collector's validation notice must be clear enough that the least sophisticated consumer can understand their rights. Contradictory or confusing language in the notice violates §809.",
    relevance:
      "If the validation notice was confusing, contradictory, or overshadowed the consumer's rights, that's a violation. Review any initial collection letters for clarity.",
    applicableTo: ["fdcpa_809_validation"],
  },
];

// ─────────────────────────────────────────────────────────
// Constitutional & Due Process Cases
// ─────────────────────────────────────────────────────────

export const CONSTITUTIONAL_CASE_LAW: CaseLawReference[] = [
  {
    name: "Mathews v. Eldridge",
    citation: "424 U.S. 319 (1976)",
    court: "Supreme Court of the United States",
    year: 1976,
    holding:
      "Due process requires consideration of: (1) the private interest affected, (2) the risk of erroneous deprivation through current procedures, and (3) the government's interest. Applied to credit reporting, inaccurate reports deprive consumers of property interests (access to credit) without adequate procedural safeguards.",
    relevance:
      "SUPREME COURT PRECEDENT. Framework for arguing that the current credit reporting dispute process provides inadequate procedural due process when bureaus conduct sham reinvestigations.",
    applicableTo: ["intent_to_litigate", "cfpb_complaint"],
  },
  {
    name: "Wisconsin v. Constantineau",
    citation: "400 U.S. 433 (1971)",
    court: "Supreme Court of the United States",
    year: 1971,
    holding:
      "Where a person's good name, reputation, honor, or integrity is at stake because of what the government is doing to them, due process protections apply.",
    relevance:
      "SUPREME COURT PRECEDENT. A credit report is effectively a government-sanctioned reputation system. Inaccurate reporting stigmatizes consumers and triggers due process protections.",
    applicableTo: ["intent_to_litigate"],
  },
  {
    name: "Goldberg v. Kelly",
    citation: "397 U.S. 254 (1970)",
    court: "Supreme Court of the United States",
    year: 1970,
    holding:
      "Due process requires that before the government deprives a person of a protected interest, they must be given notice and an opportunity to be heard.",
    relevance:
      "SUPREME COURT PRECEDENT. When a bureau refuses to correct inaccurate information, the consumer is deprived of economic opportunities without meaningful process. Supports argument that the dispute process must be substantive, not perfunctory.",
    applicableTo: ["intent_to_litigate"],
  },
];

// ─────────────────────────────────────────────────────────
// Helper Functions
// ─────────────────────────────────────────────────────────

export const ALL_CASE_LAW = [
  ...FCRA_CASE_LAW,
  ...FDCPA_CASE_LAW,
  ...CONSTITUTIONAL_CASE_LAW,
];

/**
 * Get relevant case law for a specific dispute strategy.
 */
export function getCaseLawForStrategy(strategy: string): CaseLawReference[] {
  return ALL_CASE_LAW.filter((c) => c.applicableTo.includes(strategy));
}

/**
 * Get all Supreme Court cases (highest authority).
 */
export function getSupremeCourtCases(): CaseLawReference[] {
  return ALL_CASE_LAW.filter((c) => c.court === "Supreme Court of the United States");
}

/**
 * Get case law citations formatted for inclusion in a legal letter.
 */
export function formatCaseCitations(cases: CaseLawReference[]): string {
  return cases
    .map((c) => `${c.name}, ${c.citation} (${c.holding.substring(0, 100)}...)`)
    .join("\n\n");
}

/**
 * Get the strongest cases for a litigation package (Supreme Court + Circuit precedent).
 */
export function getLitigationCases(): CaseLawReference[] {
  return ALL_CASE_LAW.filter(
    (c) =>
      c.court === "Supreme Court of the United States" ||
      c.applicableTo.includes("intent_to_litigate")
  ).sort((a, b) => {
    // Supreme Court first, then by year (newest first)
    if (a.court === "Supreme Court of the United States" && b.court !== "Supreme Court of the United States") return -1;
    if (b.court === "Supreme Court of the United States" && a.court !== "Supreme Court of the United States") return 1;
    return b.year - a.year;
  });
}

// CreditClean AI — Complete Fair Debt Collection Practices Act Reference
// 15 U.S.C. §1692 et seq.
// Every section relevant to consumer rights against debt collectors.

import { LegalProvision } from "./types";

export const FDCPA_PROVISIONS: LegalProvision[] = [
  // ─── PURPOSE & DEFINITIONS ──────────────────────────────
  {
    section: "§802",
    uscReference: "15 U.S.C. §1692",
    title: "Congressional Findings and Declaration of Purpose",
    summary:
      "Congress found that abusive debt collection practices contribute to personal bankruptcies, marital instability, job loss, and invasions of privacy. The purpose is to eliminate abusive practices by debt collectors without imposing unnecessary restrictions on ethical collectors.",
    consumerRight:
      "The FDCPA exists to protect you from abusive, deceptive, and unfair collection practices. It applies to third-party debt collectors and debt buyers — entities collecting debts they did not originate.",
    howToUse:
      "Cite in every debt validation letter and CFPB complaint to frame the collector's legal obligations.",
    applicableTo: ["collection"],
  },
  {
    section: "§803",
    uscReference: "15 U.S.C. §1692a",
    title: "Definitions",
    summary:
      "Key definitions: 'debt collector' means any person who regularly collects or attempts to collect debts owed to another (includes collection agencies, debt buyers, and attorneys who regularly collect debts per Heintz v. Jenkins, 514 U.S. 291). 'Consumer' means any natural person obligated to pay a debt. 'Debt' means any obligation to pay money arising from a consumer transaction.",
    consumerRight:
      "The FDCPA covers third-party collectors and debt buyers. Original creditors collecting their own debts are generally NOT covered unless they use a different name that suggests a third party. Attorneys who regularly collect debts ARE covered (Supreme Court: Heintz v. Jenkins).",
    howToUse:
      "First determine if the entity is a 'debt collector' under §803. If they purchased the debt, they're a debt collector. If they're collecting on behalf of another, they're a debt collector. If it's the original creditor, FDCPA doesn't apply (but FCRA still does).",
    applicableTo: ["collection"],
  },
  // ─── COMMUNICATION RESTRICTIONS ─────────────────────────
  {
    section: "§805(a)",
    uscReference: "15 U.S.C. §1692c(a)",
    title: "Communication with the Consumer — Time and Place Restrictions",
    summary:
      "A debt collector may not communicate with a consumer at any unusual time or place, or at a time or place known to be inconvenient. Without knowledge of circumstances, convenient times are 8:00 AM to 9:00 PM local time. A collector may not contact a consumer at their place of employment if they know the employer prohibits such communications.",
    consumerRight:
      "Collectors cannot call before 8 AM or after 9 PM your local time. They cannot call your workplace if you tell them your employer doesn't allow it. Any violation of these rules is actionable.",
    howToUse:
      "Document every call with date, time, and phone number. Calls outside 8AM-9PM are automatic violations. Tell the collector in writing that your employer prohibits collection calls — any subsequent work calls are violations.",
    penalties: "Up to $1,000 statutory + actual damages + attorney fees per §813.",
    applicableTo: ["collection"],
  },
  {
    section: "§805(b)",
    uscReference: "15 U.S.C. §1692c(b)",
    title: "Communication with Third Parties",
    summary:
      "A debt collector may not communicate with any person other than the consumer, the consumer's attorney, the creditor, the creditor's attorney, or a CRA regarding the debt. Exceptions for location information only (and even that is restricted under §804).",
    consumerRight:
      "Collectors CANNOT tell your family, friends, neighbors, or employer about your debt. They can only contact third parties to locate you — and even then, they cannot reveal that they're collecting a debt.",
    howToUse:
      "If a collector contacted anyone else about your debt (family members, employer, friends), that is a clear §805(b) violation. Document who was contacted, when, and what was said. Each contact is a separate violation.",
    penalties: "Up to $1,000 + actual damages + attorney fees.",
    applicableTo: ["collection"],
  },
  {
    section: "§805(c)",
    uscReference: "15 U.S.C. §1692c(c)",
    title: "Ceasing Communication",
    summary:
      "If a consumer notifies a debt collector in writing that they refuse to pay the debt or that they wish the collector to cease further communication, the collector must cease communication except to: (1) advise that collection efforts are being terminated, (2) notify that specific remedies may be invoked, or (3) notify that a particular remedy will be invoked.",
    consumerRight:
      "You can stop a collector from contacting you by sending a written cease-and-desist letter. After receiving it, they can only contact you to say they're stopping collection, to warn of legal action, or to notify you of a specific legal action being taken.",
    howToUse:
      "Send a cease-and-desist letter via certified mail. After receipt, ANY further collection communication (other than the three exceptions) is a violation. Note: this doesn't eliminate the debt — it only stops the calls. The collector can still sue.",
    applicableTo: ["collection"],
  },
  // ─── HARASSMENT ─────────────────────────────────────────
  {
    section: "§806",
    uscReference: "15 U.S.C. §1692d",
    title: "Harassment or Abuse",
    summary:
      "A debt collector may not engage in any conduct the natural consequence of which is to harass, oppress, or abuse. Specific prohibitions include: (1) use or threat of violence, (2) use of obscene or profane language, (3) publication of lists of consumers who allegedly refuse to pay (except to CRAs), (4) advertising a debt for sale to coerce payment, (5) causing a telephone to ring or engaging in telephone conversation repeatedly or continuously with intent to annoy, abuse, or harass, (6) placing telephone calls without meaningful disclosure of the caller's identity.",
    consumerRight:
      "Collectors cannot threaten you, use profanity, call you repeatedly to harass, or hide their identity on calls. Each harassing call is a separate violation.",
    howToUse:
      "Keep a phone log of every collector call. Excessive calls (multiple per day, calling after you've asked them to stop) constitute harassment. Record calls if you're in a one-party consent state. File complaints for each harassing contact.",
    penalties: "Up to $1,000 + actual damages (including emotional distress) + attorney fees.",
    applicableTo: ["collection"],
  },
  // ─── FALSE REPRESENTATIONS ──────────────────────────────
  {
    section: "§807",
    uscReference: "15 U.S.C. §1692e",
    title: "False or Misleading Representations",
    summary:
      "A debt collector may not use any false, deceptive, or misleading representation in connection with collection. 16 specific prohibitions include: (1) false representation of identity, (2) false representation of amount owed, (3) false representation that nonpayment will result in arrest or imprisonment, (4) threat of legal action not actually intended, (5) false representation that documents are legal process, (6) false representation of being an attorney, (7) implication that consumer committed a crime, (8) communicating false credit information, (9) use of deceptive forms that simulate government documents, (10) false representation that accounts have been turned over to innocent purchasers, (11) false representation of being affiliated with the government, (12) false representation that documents are not legal process when they are, (13) false representation of amount of compensation collector may receive, (14) using any business name other than the true name of the collector's business, (15) false representation that documents are not legal process, (16) false threat of action that cannot legally be taken.",
    consumerRight:
      "Virtually any deception by a collector is a violation. The standard is the 'least sophisticated consumer' — if the representation COULD mislead an unsophisticated person, it's a violation. You don't have to prove you were actually deceived (Clomon v. Jackson, 988 F.2d 1314).",
    howToUse:
      "Review every collection letter and recorded call for: inflated balances, threats they can't carry out (jail, wage garnishment without a judgment, suing on a time-barred debt), misrepresentation of their authority, false urgency. Each false statement is a separate violation.",
    penalties: "Up to $1,000 + actual damages + attorney fees. Per Jerman v. Carlisle (559 U.S. 573), ignorance of the law is no defense.",
    applicableTo: ["collection"],
  },
  // ─── UNFAIR PRACTICES ───────────────────────────────────
  {
    section: "§808",
    uscReference: "15 U.S.C. §1692f",
    title: "Unfair Practices",
    summary:
      "A debt collector may not use unfair or unconscionable means to collect. 8 specific prohibitions: (1) collecting any amount not expressly authorized by the agreement or permitted by law, (2) accepting a check postdated by more than 5 days without notice of intent to deposit, (3) soliciting any postdated check for the purpose of threatening criminal prosecution, (4) depositing a postdated check prior to the date on it, (5) causing charges for communications (collect calls, telegrams) by concealing the purpose, (6) taking or threatening to take any nonjudicial action to seize property with no present right or no present intention, (7) communicating by postcard, (8) using any language or symbol on an envelope that indicates the communication relates to debt collection.",
    consumerRight:
      "Collectors cannot add unauthorized fees, interest, or charges beyond what the original agreement allows. They cannot threaten to take property they have no legal right to take. They cannot use postcards or put collection notices on the outside of envelopes.",
    howToUse:
      "Compare the amount the collector claims you owe to the original debt amount. Any unauthorized fees, penalties, or interest not in the original agreement is a §808(1) violation. Per Donohue v. Quick Collect (592 F.3d 1027), overstating the amount owed is a violation even if it results from failure to account for payments.",
    penalties: "Up to $1,000 + actual damages + attorney fees.",
    applicableTo: ["collection"],
  },
  // ─── DEBT VALIDATION ────────────────────────────────────
  {
    section: "§809(a)",
    uscReference: "15 U.S.C. §1692g(a)",
    title: "Validation of Debts — Initial Communication Notice",
    summary:
      "Within 5 days after the initial communication with a consumer, a debt collector must send a written notice containing: (1) the amount of the debt, (2) the name of the creditor to whom the debt is owed, (3) a statement that unless the consumer disputes the validity of the debt within 30 days, the debt will be assumed to be valid, (4) a statement that if the consumer notifies the collector in writing within 30 days that the debt is disputed, the collector will obtain verification and mail it to the consumer, and (5) a statement that the collector will provide the name and address of the original creditor if different from the current creditor.",
    consumerRight:
      "The collector MUST send you a validation notice within 5 days of first contact. You then have 30 days to dispute in writing. If you dispute within 30 days, the collector must stop collecting and provide verification before resuming.",
    howToUse:
      "Send a debt validation letter within 30 days of first contact from any collector. Demand: (1) the original signed credit agreement, (2) complete payment history, (3) proof they own or are authorized to collect the debt, (4) their state collection license, (5) calculation of the amount claimed. Most collectors, especially debt buyers, cannot produce all of these.",
    deadlines: "You have 30 days from first contact to dispute. Collector must send validation notice within 5 days of first contact.",
    applicableTo: ["collection"],
  },
  {
    section: "§809(b)",
    uscReference: "15 U.S.C. §1692g(b)",
    title: "Validation of Debts — Disputed Debts",
    summary:
      "If the consumer notifies the debt collector in writing within the 30-day period that the debt is disputed, the debt collector shall cease collection until the collector obtains verification of the debt and mails a copy to the consumer. Collection of any debt or any disputed portion during this period is a violation.",
    consumerRight:
      "Once you dispute in writing within 30 days, the collector MUST STOP ALL COLLECTION ACTIVITY until they provide verification. Any continued calls, letters, or credit reporting during this period is a violation.",
    howToUse:
      "Dispute in writing via certified mail within 30 days. Document any collection activity after the dispute. Each contact after a timely dispute without providing verification is a separate violation. If they continue reporting to bureaus without verification, that's both an FDCPA and FCRA violation.",
    penalties: "Up to $1,000 + actual damages + attorney fees. Per Romea v. Heiberger (163 F.3d 111), the validation notice must be clear to the least sophisticated consumer.",
    applicableTo: ["collection"],
  },
  // ─── LEGAL ACTIONS BY COLLECTORS ────────────────────────
  {
    section: "§811",
    uscReference: "15 U.S.C. §1692i",
    title: "Legal Actions by Debt Collectors — Venue",
    summary:
      "A debt collector who brings legal action on a debt must bring it: (1) in the judicial district where the consumer signed the contract, or (2) in the judicial district where the consumer resides at the time of the action. For actions involving real property, the action must be brought where the property is located.",
    consumerRight:
      "Collectors cannot sue you in an inconvenient forum. If they file suit in a court far from where you live or signed the contract, the venue is improper and the suit itself is a violation.",
    howToUse:
      "If sued by a collector, verify the venue is proper. An improper venue is both grounds for dismissal and an FDCPA violation. Filing in the wrong venue can be evidence of an attempt to obtain a default judgment by making it difficult for you to appear.",
    applicableTo: ["collection"],
  },
  // ─── CIVIL LIABILITY ────────────────────────────────────
  {
    section: "§813(a)",
    uscReference: "15 U.S.C. §1692k(a)",
    title: "Civil Liability — Individual Actions",
    summary:
      "Any debt collector who violates the FDCPA is liable to the consumer for: (1) actual damages sustained, (2) additional statutory damages as the court may allow, not exceeding $1,000 for individual actions, and (3) costs of the action plus reasonable attorney fees as determined by the court.",
    consumerRight:
      "You can sue for: actual damages (any harm you suffered), up to $1,000 in statutory damages (per case, not per violation), plus the collector pays your attorney fees if you win. The attorney fee provision makes it economically viable to pursue even small claims.",
    howToUse:
      "Document all actual damages: emotional distress, time spent dealing with collection calls, impact on credit, denied credit applications. Even without large actual damages, the $1,000 statutory + attorney fees make litigation viable. Many consumer rights attorneys take FDCPA cases on contingency because of the fee-shifting provision.",
    penalties: "Actual damages + up to $1,000 statutory + attorney fees + costs.",
    applicableTo: ["collection"],
  },
  {
    section: "§813(b)",
    uscReference: "15 U.S.C. §1692k(b)",
    title: "Civil Liability — Class Actions",
    summary:
      "In a class action, additional damages may be awarded as the court allows, not to exceed the lesser of $500,000 or 1% of the net worth of the debt collector.",
    consumerRight:
      "If a collector's violations affect many consumers (which they often do — collectors tend to use the same violating practices across all accounts), a class action can be filed for up to $500,000 or 1% of the collector's net worth.",
    howToUse:
      "If you discover a collector using systematic illegal practices (form letters with false representations, automated calls violating time restrictions), mention potential class action liability in your intent-to-litigate letter. This dramatically increases the collector's exposure and incentivizes settlement.",
    applicableTo: ["collection"],
  },
  {
    section: "§813(d)",
    uscReference: "15 U.S.C. §1692k(d)",
    title: "Statute of Limitations",
    summary:
      "An action to enforce any liability under the FDCPA must be brought within one year from the date of the violation.",
    consumerRight:
      "You have ONE YEAR from the date of each violation to file suit. The clock starts from each individual violation, so ongoing violations extend the window.",
    howToUse:
      "Act quickly once violations are identified. Each new violation starts a fresh 1-year clock. Document every violation with dates. For ongoing violations (continued reporting, repeated calls), each instance is a new violation with its own 1-year window.",
    deadlines: "1 year from the date of each violation.",
    applicableTo: ["collection"],
  },
];

/**
 * Get FDCPA provisions relevant to a specific violation type.
 */
export function getFDCPAForViolationType(violationType: string): LegalProvision[] {
  const map: Record<string, string[]> = {
    harassment: ["§806"],
    false_representation: ["§807"],
    unfair_practice: ["§808"],
    validation_failure: ["§809(a)", "§809(b)"],
    communication_violation: ["§805(a)", "§805(b)", "§805(c)"],
    venue_violation: ["§811"],
  };
  const sections = map[violationType] ?? [];
  return FDCPA_PROVISIONS.filter((p) => sections.includes(p.section));
}

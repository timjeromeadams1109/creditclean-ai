// CreditClean AI — Additional Consumer Protection Laws
// Federal and state laws beyond FCRA/FDCPA that support credit disputes.

import { LegalProvision } from "./types";

export const ADDITIONAL_FEDERAL_LAWS: LegalProvision[] = [
  // ─── EQUAL CREDIT OPPORTUNITY ACT ───────────────────────
  {
    section: "ECOA",
    uscReference: "15 U.S.C. §1691 et seq.",
    title: "Equal Credit Opportunity Act",
    summary:
      "Prohibits credit discrimination based on race, color, religion, national origin, sex, marital status, age (if old enough to contract), receipt of public assistance, or good-faith exercise of Consumer Credit Protection Act rights.",
    consumerRight:
      "No creditor may discriminate against you in any aspect of a credit transaction. If you were denied credit or given worse terms and believe discrimination was a factor, you have rights under ECOA. Additionally, if you exercised your rights under the FCRA (filed a dispute) and then experienced adverse treatment, that is ECOA retaliation.",
    howToUse:
      "If adverse action correlates with a protected characteristic, cite ECOA. If a creditor retaliates after you file disputes (closes accounts, reduces limits, increases rates), cite ECOA's anti-retaliation provision. Damages include actual + punitive up to $10,000 for individual actions.",
    penalties: "Actual damages + punitive up to $10,000 (individual) or $500,000 (class action) + attorney fees.",
    applicableTo: ["all"],
  },
  // ─── TRUTH IN LENDING ACT ──────────────────────────────
  {
    section: "TILA",
    uscReference: "15 U.S.C. §1601 et seq.",
    title: "Truth in Lending Act",
    summary:
      "Requires clear disclosure of credit terms: APR, finance charges, amount financed, total payments, payment schedule. Provides rescission rights for certain mortgage transactions.",
    consumerRight:
      "If a creditor failed to properly disclose credit terms, you may have a TILA claim. For mortgages, you may have the right to rescind (cancel) the transaction for up to 3 years if required disclosures were not provided.",
    howToUse:
      "Review your original credit agreement for proper TILA disclosures. If the creditor failed to disclose the APR, finance charges, or other required terms, cite TILA. For mortgages where disclosures were inadequate, the right of rescission can cancel the entire transaction.",
    penalties: "Statutory damages of $200-$2,000 for individual actions + actual damages + attorney fees. Rescission rights for mortgages.",
    applicableTo: ["late_payment", "charge_off"],
  },
  // ─── FAIR CREDIT BILLING ACT ───────────────────────────
  {
    section: "FCBA §161",
    uscReference: "15 U.S.C. §1666",
    title: "Fair Credit Billing Act — Billing Error Resolution",
    summary:
      "Applies to revolving credit accounts (credit cards). Consumers can dispute billing errors by writing to the creditor within 60 days of the statement containing the error. The creditor must acknowledge within 30 days and resolve within 2 billing cycles (not more than 90 days). During investigation, the creditor cannot report the amount as delinquent.",
    consumerRight:
      "For credit card accounts, you can dispute billing errors directly with the card issuer. While investigating, they cannot report the disputed amount as delinquent, cannot close or restrict the account, and must resolve within 90 days.",
    howToUse:
      "If a credit card late payment or charge-off resulted from a billing error (unauthorized charges, charges for undelivered goods, calculation errors), send a written billing error notice within 60 days. The creditor must investigate and cannot report the disputed amount as delinquent during investigation. If they reported it anyway, cite §1666(a) violation.",
    deadlines: "Must dispute within 60 days of statement. Creditor must acknowledge within 30 days and resolve within 2 billing cycles (max 90 days).",
    penalties: "Creditor forfeits right to collect disputed amount (up to $50) if they fail to follow the resolution procedure. Plus actual damages + attorney fees.",
    applicableTo: ["late_payment", "charge_off"],
  },
  // ─── ELECTRONIC FUND TRANSFER ACT ──────────────────────
  {
    section: "EFTA",
    uscReference: "15 U.S.C. §1693 et seq.",
    title: "Electronic Fund Transfer Act",
    summary:
      "Protects consumers in electronic fund transfers (debit cards, ATM, ACH, direct deposits). Limits liability for unauthorized transfers. Provides error resolution procedures similar to FCBA.",
    consumerRight:
      "For unauthorized electronic transactions or errors in electronic fund transfers, you can dispute within 60 days. The institution must investigate within 10 business days (or provisionally credit your account and take up to 45 days).",
    howToUse:
      "If a negative item resulted from an electronic transaction error or unauthorized ACH debit, cite EFTA. The financial institution must investigate and provisionally credit your account while investigating.",
    deadlines: "Dispute within 60 days of statement. Institution must investigate within 10 business days (45 days if provisional credit issued).",
    penalties: "Actual damages + statutory up to $1,000 for individual actions + attorney fees.",
    applicableTo: ["late_payment"],
  },
  // ─── SERVICEMEMBERS CIVIL RELIEF ACT ───────────────────
  {
    section: "SCRA",
    uscReference: "50 U.S.C. §3901 et seq.",
    title: "Servicemembers Civil Relief Act",
    summary:
      "Provides financial protections for active-duty military members: interest rate cap at 6% on pre-service debts, protection from default judgments, stay of proceedings, prohibition on foreclosure/eviction without court order.",
    consumerRight:
      "If you were on active duty when a negative item occurred, you may have additional protections. Interest rates on pre-service debts must be capped at 6%. Default judgments entered while on active duty can be reopened. Creditors who violated SCRA protections must correct the reporting.",
    howToUse:
      "If applicable, cite SCRA in disputes for debts incurred before or during military service. Request retroactive application of the 6% interest rate cap. Challenge any default judgments entered during active duty.",
    penalties: "Violators subject to fines, damages, and potential criminal penalties. Private right of action for actual damages + attorney fees.",
    applicableTo: ["all"],
  },
  // ─── HIPAA / MEDICAL DEBT ──────────────────────────────
  {
    section: "HIPAA",
    uscReference: "42 U.S.C. §1320d et seq. / 45 CFR Parts 160, 164",
    title: "Health Insurance Portability and Accountability Act — Medical Debt Protections",
    summary:
      "HIPAA restricts disclosure of protected health information (PHI). Medical debt reported to credit bureaus often contains or implies PHI. Additionally, effective 2023, paid medical debts must be removed from credit reports, and medical debts under $500 cannot be reported. Unpaid medical debts cannot be reported until 365 days after the date of first delinquency.",
    consumerRight:
      "Medical debt has special protections: (1) 365-day waiting period before it can be reported (was 180 days, increased to 365 days). (2) Paid medical debts must be removed from credit reports. (3) Medical debts under $500 cannot be reported. (4) Medical debt collectors who disclose your medical information to unauthorized parties violate HIPAA privacy rules.",
    howToUse:
      "Check every medical collection: Was it reported before 365 days? Has it been paid? Is it under $500? If any of these apply, it must be removed. Additionally, if a collector revealed medical details to the bureaus beyond what is necessary (diagnosis, treatment type), cite HIPAA privacy violations.",
    deadlines: "365-day waiting period before medical debt can be reported. Paid medical debts must be removed.",
    applicableTo: ["medical_debt", "collection"],
  },
  // ─── DODD-FRANK / UDAAP ────────────────────────────────
  {
    section: "Dodd-Frank §1031",
    uscReference: "12 U.S.C. §5531",
    title: "Dodd-Frank Act — Unfair, Deceptive, or Abusive Acts or Practices (UDAAP)",
    summary:
      "Prohibits unfair, deceptive, or abusive acts or practices by any covered person in connection with consumer financial products. Gives the CFPB authority to take action against entities engaging in UDAAP.",
    consumerRight:
      "If a bureau or collector engages in unfair, deceptive, or abusive practices that don't fit neatly under FCRA/FDCPA, UDAAP catches them. This is the CFPB's broadest authority and covers: sham reinvestigations, deceptive dispute processes, misleading consumers about their rights.",
    howToUse:
      "Cite in CFPB complaints when the bureau or collector's conduct is unfair or deceptive even if it doesn't clearly violate a specific FCRA/FDCPA provision. UDAAP is the catch-all.",
    penalties: "CFPB can seek restitution, disgorgement, injunctive relief, and civil penalties up to $1,000,000 per day for knowing violations.",
    applicableTo: ["all"],
  },
  // ─── TELEPHONE CONSUMER PROTECTION ACT ─────────────────
  {
    section: "TCPA",
    uscReference: "47 U.S.C. §227",
    title: "Telephone Consumer Protection Act",
    summary:
      "Restricts telemarketing calls, auto-dialed calls, prerecorded calls, text messages, and unsolicited faxes. Requires prior express consent for autodialed or prerecorded calls to cell phones. Provides private right of action.",
    consumerRight:
      "Collectors cannot use auto-dialers or prerecorded messages to call your cell phone without your prior express consent. If you revoked consent and they keep calling, each call is a violation. Text messages from collectors without consent also violate the TCPA.",
    howToUse:
      "Revoke consent in writing for all auto-dialed and prerecorded calls. Document every call received after revocation. Each violation carries $500-$1,500 in statutory damages. TCPA claims can be stacked with FDCPA claims for maximum leverage.",
    penalties: "$500 per violation, $1,500 per willful violation. No cap on total damages. Class actions common.",
    applicableTo: ["collection"],
  },
];

// ─── STATE-SPECIFIC LAWS ──────────────────────────────────

export const STATE_SPECIFIC_LAWS: LegalProvision[] = [
  {
    section: "CA CCRAA",
    uscReference: "California Civil Code §1785.1 et seq.",
    title: "California Consumer Credit Reporting Agencies Act",
    summary:
      "California's state-level FCRA equivalent. Provides broader protections and higher damages than federal law. Statutory damages of $100-$5,000 per violation (vs. $100-$1,000 federal). Applies to all CRAs operating in California.",
    consumerRight:
      "California residents get stronger protections: higher statutory damages ($100-$5,000 per violation), broader definition of CRA responsibilities, and additional disclosure requirements.",
    howToUse:
      "Always plead CCRAA alongside federal FCRA for California residents. The higher damage cap provides significantly more leverage. Include CCRAA citations in dispute letters and CFPB complaints.",
    penalties: "$100-$5,000 per violation + actual damages + punitive damages + attorney fees.",
    applicableTo: ["all"],
  },
  {
    section: "CA Rosenthal Act",
    uscReference: "California Civil Code §1788 et seq.",
    title: "Rosenthal Fair Debt Collection Practices Act",
    summary:
      "California's state FDCPA equivalent. CRITICAL DIFFERENCE: The Rosenthal Act applies to ORIGINAL CREDITORS collecting their own debts, not just third-party collectors. This fills the major gap in federal FDCPA coverage.",
    consumerRight:
      "In California, original creditors (your bank, credit card company, hospital) are subject to the same restrictions as third-party collectors. They cannot harass, threaten, deceive, or use unfair practices when collecting their own debts.",
    howToUse:
      "For California residents, cite the Rosenthal Act when dealing with original creditors who are engaging in abusive collection practices. This is one of the most powerful state laws because it extends FDCPA protections to entities the federal law doesn't cover.",
    penalties: "Up to $1,000 per violation + actual damages + attorney fees.",
    applicableTo: ["collection", "charge_off", "late_payment"],
  },
  {
    section: "TX DTPA",
    uscReference: "Texas Bus. & Com. Code §17.41 et seq.",
    title: "Texas Deceptive Trade Practices — Consumer Protection Act",
    summary:
      "One of the strongest consumer protection statutes in the nation. Provides TREBLE (3x) DAMAGES for knowing violations. Mental anguish damages available without physical injury. Broad definition of 'deceptive trade practice.'",
    consumerRight:
      "Texas consumers can recover 3x their actual damages for knowing violations. Mental anguish damages are available without showing physical injury. The DTPA covers: false, misleading, or deceptive acts; unconscionable actions; breach of warranty.",
    howToUse:
      "For Texas residents, always include DTPA claims alongside federal claims. The treble damages provision makes DTPA claims extremely valuable. Inaccurate credit reporting that continues after notification can constitute a knowing DTPA violation.",
    penalties: "Actual damages (treble for knowing violations) + mental anguish + attorney fees. Up to $10,000 civil penalty per violation.",
    applicableTo: ["all"],
  },
  {
    section: "TX Finance Code §392",
    uscReference: "Texas Finance Code §392.001 et seq.",
    title: "Texas Debt Collection Act",
    summary:
      "Texas's state FDCPA equivalent. Prohibits threats, coercion, harassment, abuse, unfair practices, and fraudulent/deceptive/misleading representations by debt collectors. Like the Rosenthal Act, applies to some original creditors.",
    consumerRight:
      "Additional protections beyond federal FDCPA. Combined with DTPA, provides treble damages for knowing violations of debt collection rules.",
    howToUse:
      "Stack with DTPA and federal FDCPA claims. Each violation can trigger both state and federal remedies.",
    penalties: "Injunctive relief + actual damages + attorney fees. DTPA treble damages apply.",
    applicableTo: ["collection"],
  },
  {
    section: "FL FCCPA",
    uscReference: "Florida Statutes §559.55 et seq.",
    title: "Florida Consumer Collection Practices Act",
    summary:
      "Florida's state debt collection law. Notably, it applies to ORIGINAL CREDITORS as well as third-party collectors (similar to California's Rosenthal Act). Prohibits simulation of legal process, disclosure of debtor information to employer, and communication at unusual hours.",
    consumerRight:
      "Florida extends collection protections to original creditors. Additional prohibited practices include: using simulated legal process, disclosing debt information to employers, and willfully communicating with debtor at employer's premises.",
    howToUse:
      "For Florida residents, cite FCCPA for original creditor misconduct. Stack with federal FDCPA for third-party collectors.",
    penalties: "Actual damages + $1,000 statutory + attorney fees.",
    applicableTo: ["collection"],
  },
  {
    section: "NY GBL §380",
    uscReference: "New York General Business Law §380 et seq.",
    title: "New York Fair Credit Reporting Act",
    summary:
      "New York's state credit reporting law. Provides additional protections beyond federal FCRA, including requirements on CRA procedures, consumer disclosure rights, and notice requirements.",
    consumerRight:
      "New York residents have state-level credit reporting protections that supplement federal FCRA. New York courts are generally consumer-friendly in credit reporting disputes.",
    howToUse:
      "Cite alongside federal FCRA in all disputes involving New York residents. NYC residents can additionally use NYC Consumer Protection Law for broader remedies.",
    penalties: "Actual damages + costs + attorney fees. Punitive damages for willful violations.",
    applicableTo: ["all"],
  },
  {
    section: "IL Consumer Fraud Act",
    uscReference: "815 ILCS 505/1 et seq.",
    title: "Illinois Consumer Fraud and Deceptive Business Practices Act",
    summary:
      "Broad consumer protection statute covering unfair or deceptive business practices. Notable: $50,000 minimum recovery for violations against persons over 65. Treble damages for intentional violations.",
    consumerRight:
      "Illinois residents over 65 can recover a minimum of $50,000 for consumer fraud violations. All Illinois residents can recover treble damages for intentional violations.",
    howToUse:
      "For Illinois residents (especially over 65), cite this statute for maximum damage potential. The $50,000 minimum for elderly consumers is one of the highest in the nation.",
    penalties: "Actual damages (treble for intentional) or $50,000 minimum for age 65+ + attorney fees.",
    applicableTo: ["all"],
  },
];

/**
 * Get all applicable laws for a consumer's state.
 */
export function getStateLaws(state: string): LegalProvision[] {
  const stateMap: Record<string, string[]> = {
    CA: ["CA CCRAA", "CA Rosenthal Act"],
    TX: ["TX DTPA", "TX Finance Code §392"],
    NY: ["NY GBL §380"],
    FL: ["FL FCCPA"],
    IL: ["IL Consumer Fraud Act"],
  };
  const sections = stateMap[state.toUpperCase()] ?? [];
  return STATE_SPECIFIC_LAWS.filter((l) => sections.includes(l.section));
}

/**
 * Get all additional federal laws applicable to a specific item type.
 */
export function getAdditionalLawsForItem(itemType: string): LegalProvision[] {
  return ADDITIONAL_FEDERAL_LAWS.filter(
    (l) => l.applicableTo.includes(itemType) || l.applicableTo.includes("all")
  );
}

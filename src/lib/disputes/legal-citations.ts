// CreditClean AI — Legal Citations Reference
// Comprehensive consumer protection law citations for dispute letter generation.

import { LegalCitation } from "./types";

export const LEGAL_CITATIONS: Record<string, LegalCitation> = {
  // ─────────────────────────────────────────────────────────
  // FAIR CREDIT REPORTING ACT (FCRA)
  // ─────────────────────────────────────────────────────────

  FCRA_611: {
    code: "FCRA_611",
    lawName: "Fair Credit Reporting Act",
    section: "§611",
    uscReference: "15 U.S.C. §1681i",
    summary:
      "Right to dispute inaccurate information. Bureaus must conduct a reasonable investigation within 30 days and notify the consumer of results.",
    fullRelevantText:
      'If the completeness or accuracy of any item of information contained in a consumer\'s file at a consumer reporting agency is disputed by the consumer and the consumer notifies the agency directly, or indirectly through a reseller, of such dispute, the agency shall, free of charge, conduct a reasonable reinvestigation to determine whether the disputed information is inaccurate and record the current status of the disputed information, or delete the item from the file, before the end of the 30-day period beginning on the date on which the agency receives the notice of the dispute from the consumer or reseller. The agency shall notify the furnisher of information within 5 business days of receiving the dispute and provide all relevant information submitted by the consumer. If the reinvestigation does not resolve the dispute, the consumer may add a brief statement to the file.',
    whenToUse:
      "Initial dispute to a credit bureau for any inaccurate, incomplete, or unverifiable item on the consumer's credit report. This is the primary and most commonly used dispute mechanism.",
  },

  FCRA_609: {
    code: "FCRA_609",
    lawName: "Fair Credit Reporting Act",
    section: "§609",
    uscReference: "15 U.S.C. §1681g",
    summary:
      "Right to disclosure of information and method of verification. Consumer may request all information in their file and the specific procedure used to verify disputed items.",
    fullRelevantText:
      "Every consumer reporting agency shall, upon request and proper identification of the consumer, clearly and accurately disclose to the consumer: (A) All information in the consumer's file at the time of the request, except medical information. (B) The sources of the information. (C) Identification of each person that procured a consumer report during the 1-year period preceding the date of the request for employment purposes, and the 2-year period for all other purposes. Upon request, the agency shall disclose the method of verification used during any reinvestigation under §611.",
    whenToUse:
      'After a bureau verifies a disputed item, use this to demand the specific method of verification they used. If they cannot provide it, the item must be deleted. Particularly effective when bureaus respond with generic "verified" results without explanation.',
  },

  FCRA_623: {
    code: "FCRA_623",
    lawName: "Fair Credit Reporting Act",
    section: "§623",
    uscReference: "15 U.S.C. §1681s-2",
    summary:
      "Furnisher obligations and direct dispute rights. Furnishers must investigate disputes forwarded by bureaus and direct disputes from consumers, correct inaccuracies, and report results.",
    fullRelevantText:
      "A person shall not furnish information relating to a consumer to any consumer reporting agency if the person knows or has reasonable cause to believe that the information is inaccurate. After receiving notice of a dispute from a consumer reporting agency under §611, the furnisher shall: (A) conduct an investigation with respect to the disputed information; (B) review all relevant information provided by the consumer reporting agency; (C) report the results of the investigation to the agency; and (D) if the investigation finds that the information is incomplete or inaccurate, report those results to all consumer reporting agencies to which the person furnished the information. Under §623(a)(8), consumers may also dispute directly with furnishers, who must then investigate within 30 days.",
    whenToUse:
      "Direct dispute with the original creditor or furnisher of information, bypassing the credit bureau. Effective after bureau-level disputes have been unsuccessful, as it forces the furnisher to conduct their own independent investigation.",
  },

  FCRA_616: {
    code: "FCRA_616",
    lawName: "Fair Credit Reporting Act",
    section: "§616",
    uscReference: "15 U.S.C. §1681n",
    summary:
      "Civil liability for willful noncompliance. Consumers may recover actual damages or statutory damages of $100 to $1,000 per violation, plus punitive damages and attorney's fees.",
    fullRelevantText:
      "Any person who willfully fails to comply with any requirement imposed under this title with respect to any consumer is liable to that consumer in an amount equal to the sum of: (1)(A) any actual damages sustained by the consumer as a result of the failure or damages of not less than $100 and not more than $1,000; (2) such amount of punitive damages as the court may allow; and (3) in the case of any successful action to enforce any liability under this section, the costs of the action together with reasonable attorney's fees as determined by the court.",
    whenToUse:
      "When a bureau or furnisher has willfully failed to comply with FCRA requirements — e.g., failing to investigate, re-reporting deleted items, ignoring disputes. Cited in intent-to-litigate letters to establish damages exposure.",
  },

  FCRA_617: {
    code: "FCRA_617",
    lawName: "Fair Credit Reporting Act",
    section: "§617",
    uscReference: "15 U.S.C. §1681o",
    summary:
      "Civil liability for negligent noncompliance. Consumers may recover actual damages and attorney's fees for negligent violations of FCRA.",
    fullRelevantText:
      "Any person who is negligent in failing to comply with any requirement imposed under this title with respect to any consumer is liable to that consumer in an amount equal to the sum of: (1) any actual damages sustained by the consumer as a result of the failure; and (2) in the case of any successful action to enforce any liability under this section, the costs of the action together with reasonable attorney's fees as determined by the court.",
    whenToUse:
      "When a bureau or furnisher has negligently (not necessarily willfully) failed to comply with FCRA. Used in combination with §616 to establish that liability attaches regardless of whether the violation was intentional or merely careless.",
  },

  FCRA_604: {
    code: "FCRA_604",
    lawName: "Fair Credit Reporting Act",
    section: "§604",
    uscReference: "15 U.S.C. §1681b",
    summary:
      "Permissible purposes of consumer reports. A credit report may only be obtained for enumerated permissible purposes including credit transactions, employment, insurance, or legitimate business needs.",
    fullRelevantText:
      "A consumer reporting agency may furnish a consumer report only under the following circumstances: (1) In response to a court order or federal grand jury subpoena. (2) To the consumer. (3) To a person which it has reason to believe intends to use the information in connection with: (A) a credit transaction involving the consumer; (B) employment purposes; (C) underwriting of insurance; (D) a determination of eligibility for a government license or benefit; (E) assessment of credit risks associated with an existing credit obligation; (F) a legitimate business need in connection with a business transaction initiated by the consumer.",
    whenToUse:
      "Challenging unauthorized hard inquiries on a credit report. If the consumer did not initiate a credit transaction or give written consent, the inquiry may lack permissible purpose and must be removed.",
  },

  // ─────────────────────────────────────────────────────────
  // FAIR DEBT COLLECTION PRACTICES ACT (FDCPA)
  // ─────────────────────────────────────────────────────────

  FDCPA_809: {
    code: "FDCPA_809",
    lawName: "Fair Debt Collection Practices Act",
    section: "§809",
    uscReference: "15 U.S.C. §1692g",
    summary:
      "Debt validation rights. Within 30 days of initial communication, consumer may dispute the debt and demand validation. Collector must cease collection until validation is provided.",
    fullRelevantText:
      "Within five days after the initial communication with a consumer in connection with the collection of any debt, a debt collector shall send the consumer a written notice containing: (1) the amount of the debt; (2) the name of the creditor to whom the debt is owed; (3) a statement that unless the consumer disputes the validity of the debt within thirty days, the debt will be assumed valid; (4) a statement that if the consumer disputes the debt in writing within the thirty-day period, the debt collector will obtain verification of the debt and mail a copy to the consumer; and (5) a statement that the consumer may request the name and address of the original creditor. If the consumer notifies the debt collector in writing within the thirty-day period that the debt is disputed, the debt collector shall cease collection of the debt until the debt collector obtains verification of the debt and mails a copy of such verification to the consumer.",
    whenToUse:
      "When a collection account appears on a credit report or the consumer receives initial contact from a debt collector. Must be sent within 30 days of first contact for maximum legal protection. Demands the collector prove the debt is valid and they have authority to collect.",
  },

  FDCPA_807: {
    code: "FDCPA_807",
    lawName: "Fair Debt Collection Practices Act",
    section: "§807",
    uscReference: "15 U.S.C. §1692e",
    summary:
      "Prohibition of false, deceptive, or misleading representations. Collectors may not misrepresent the character, amount, or legal status of any debt.",
    fullRelevantText:
      "A debt collector may not use any false, deceptive, or misleading representation or means in connection with the collection of any debt. Without limiting the general application, the following conduct is a violation: (2) The false representation of the character, amount, or legal status of any debt. (5) The threat to take any action that cannot legally be taken or that is not intended to be taken. (8) Communicating credit information which is known or which should be known to be false, including the failure to communicate that a disputed debt is disputed. (10) The use of any false representation or deceptive means to collect or attempt to collect any debt.",
    whenToUse:
      "When a collector reports inaccurate information (wrong balance, wrong dates, wrong status), fails to report a debt as disputed, or makes threats they cannot legally carry out. Cited alongside §809 to strengthen validation demands.",
  },

  FDCPA_805: {
    code: "FDCPA_805",
    lawName: "Fair Debt Collection Practices Act",
    section: "§805",
    uscReference: "15 U.S.C. §1692c",
    summary:
      "Communication restrictions. Collectors may not contact consumers at inconvenient times, at work if employer disapproves, or after receiving a cease communication request.",
    fullRelevantText:
      "A debt collector may not communicate with a consumer in connection with the collection of any debt at any unusual time or place known or which should be known to be inconvenient to the consumer. Without the prior consent of the consumer given directly to the debt collector, a debt collector may not communicate with a consumer before 8:00 AM or after 9:00 PM local time. If the consumer notifies the debt collector in writing that the consumer refuses to pay the debt or that the consumer wishes the debt collector to cease further communication, the debt collector shall cease further communication except to advise the consumer that the collector's further efforts are terminated or to notify the consumer that the collector may invoke specified remedies.",
    whenToUse:
      "When a collector contacts the consumer at prohibited times, contacts third parties about the debt, or continues contact after a cease and desist request. Can be cited in validation letters to establish boundaries.",
  },

  // ─────────────────────────────────────────────────────────
  // FAIR CREDIT BILLING ACT (FCBA)
  // ─────────────────────────────────────────────────────────

  FCBA_161: {
    code: "FCBA_161",
    lawName: "Fair Credit Billing Act",
    section: "§161-171",
    uscReference: "15 U.S.C. §1666",
    summary:
      "Billing error disputes for revolving credit accounts. Creditors must acknowledge billing disputes within 30 days, resolve within 90 days (two billing cycles), and may not report the disputed amount as delinquent during investigation.",
    fullRelevantText:
      "If a creditor receives a billing error notice from an obligor, the creditor shall: (a) send a written acknowledgment of receipt within 30 days; (b) make appropriate corrections or send a written explanation within two complete billing cycles (but not more than 90 days). During the investigation, the creditor may not: (1) restrict or close the account; (2) report the disputed amount as delinquent to any consumer reporting agency. A billing error includes: charges not made by the obligor, charges for goods not delivered as agreed, computational errors, charges for which the obligor requests clarification.",
    whenToUse:
      "Disputing charges on credit cards or revolving credit accounts where the billing is incorrect, unauthorized, or involves goods/services not received. Provides additional protections beyond FCRA for revolving credit disputes.",
  },

  // ─────────────────────────────────────────────────────────
  // HIPAA (Medical Debt)
  // ─────────────────────────────────────────────────────────

  HIPAA_MEDICAL: {
    code: "HIPAA_MEDICAL",
    lawName: "Health Insurance Portability and Accountability Act",
    section: "Privacy Rule (45 CFR Part 160 & 164)",
    uscReference: "42 U.S.C. §1320d et seq.",
    summary:
      "Protects the privacy of individually identifiable health information. Medical providers and their business associates must obtain authorization before sharing protected health information (PHI), including with debt collectors and credit bureaus.",
    fullRelevantText:
      "A covered entity may not use or disclose protected health information except as permitted or required by the Privacy Rule. Disclosure for payment purposes is permitted but must adhere to the minimum necessary standard. A collection agency acting as a business associate must have a Business Associate Agreement (BAA) in place. Disclosure of PHI to a credit reporting agency requires either patient authorization or must be limited to non-clinical data. As of 2023, medical debts under $500 and paid medical debts are removed from credit reports per bureau policy changes aligned with CFPB guidance.",
    whenToUse:
      "Any medical debt on a credit report. Challenge whether the collector has a valid BAA, whether PHI was disclosed without authorization, and whether the debt meets current reporting thresholds. Medical debt receives special treatment under both HIPAA and recent CFPB/bureau policy changes.",
  },

  // ─────────────────────────────────────────────────────────
  // STATE-SPECIFIC LAWS
  // ─────────────────────────────────────────────────────────

  CA_CCRAA: {
    code: "CA_CCRAA",
    lawName: "California Consumer Credit Reporting Agencies Act",
    section: "Cal. Civ. Code §1785.1 et seq.",
    uscReference: "Cal. Civ. Code §1785.1-1785.36",
    summary:
      "California's state-level credit reporting law. Provides additional consumer protections including a private right of action, stricter investigation requirements, and enhanced penalties. Statute of limitations for reporting is generally shorter for certain items.",
    fullRelevantText:
      "The CCRAA requires consumer credit reporting agencies operating in California to follow procedures that are fair and equitable to the consumer, with regard to confidentiality, accuracy, relevancy, and proper utilization of reported information. A consumer may bring an action against any person who willfully or negligently fails to comply (§1785.31). Damages include actual damages, statutory damages of $100 to $5,000 per violation for willful noncompliance, punitive damages, attorney's fees, and costs. The CCRAA also requires bureaus to block information resulting from identity theft within 30 days.",
    whenToUse:
      "For California residents, cite alongside federal FCRA to establish both federal and state liability. California's statutory damages ($100-$5,000) exceed federal FCRA ($100-$1,000), providing additional leverage.",
  },

  NY_FCRA: {
    code: "NY_FCRA",
    lawName: "New York Fair Credit Reporting Act",
    section: "N.Y. Gen. Bus. Law §380 et seq.",
    uscReference: "N.Y. Gen. Bus. Law §380-a through §380-u",
    summary:
      "New York's state credit reporting statute. Provides parallel protections to federal FCRA with state-specific remedies and enforcement mechanisms.",
    fullRelevantText:
      "New York General Business Law Article 25 (§380-a through §380-u) governs consumer reporting agencies operating in New York. Consumers have the right to dispute inaccurate information, and agencies must reinvestigate within 30 days. The law provides for a private right of action with actual damages, attorney's fees, and costs. New York also has strong debt collection regulations under N.Y. Gen. Bus. Law §601 and NYC Admin. Code §20-490, which impose additional requirements on debt collectors operating in the state.",
    whenToUse:
      "For New York residents, cite alongside federal FCRA. New York's consumer protection framework provides additional state-level remedies and enforcement. Particularly useful when dealing with NYC-based collectors subject to city administrative code.",
  },

  TX_FINANCE_CODE: {
    code: "TX_FINANCE_CODE",
    lawName: "Texas Finance Code — Credit Reporting",
    section: "Tex. Fin. Code §392 & Tex. Bus. & Com. Code §20",
    uscReference: "Tex. Fin. Code §392.001 et seq.; Tex. Bus. & Com. Code §20.01 et seq.",
    summary:
      "Texas debt collection and credit reporting laws. The Texas Debt Collection Act (TDCA) prohibits deceptive practices by debt collectors, and Texas Business & Commerce Code Chapter 20 governs consumer credit reporting with state-specific protections.",
    fullRelevantText:
      "The Texas Debt Collection Act (Tex. Fin. Code §392) prohibits debt collectors from using threats, coercion, harassment, or unconscionable means to collect debts. It also prohibits false or misleading representations. Texas Business & Commerce Code Chapter 20 provides consumer credit reporting protections including the right to dispute inaccurate information and obtain free credit reports. Violations of the TDCA are actionable under the Texas Deceptive Trade Practices Act (DTPA), which provides for actual damages, statutory damages, treble damages for knowing violations, and attorney's fees.",
    whenToUse:
      "For Texas residents, cite alongside federal FCRA/FDCPA. Texas DTPA treble damages provide significant additional leverage. Particularly effective against debt collectors engaging in aggressive or deceptive tactics.",
  },
};

/**
 * Get all citations relevant to a given dispute strategy.
 */
export function getCitationsForStrategy(strategy: string): LegalCitation[] {
  const map: Record<string, string[]> = {
    fcra_611_bureau_dispute: ["FCRA_611", "FCRA_616", "FCRA_617"],
    fcra_609_verification: ["FCRA_609", "FCRA_611", "FCRA_616", "FCRA_617"],
    fdcpa_809_validation: ["FDCPA_809", "FDCPA_807", "FDCPA_805"],
    fcra_623_furnisher_dispute: ["FCRA_623", "FCRA_611", "FCRA_616", "FCRA_617"],
    goodwill_letter: [],
    cfpb_complaint: ["FCRA_611", "FCRA_609", "FCRA_623", "FCRA_616", "FCRA_617"],
    state_ag_complaint: ["FCRA_611", "FCRA_616", "FCRA_617"],
    intent_to_litigate: ["FCRA_616", "FCRA_617", "FCRA_611", "FCRA_609", "FCRA_623"],
  };

  const keys = map[strategy] ?? [];
  return keys.map((k) => LEGAL_CITATIONS[k]).filter(Boolean);
}

/**
 * Get medical-specific citations.
 */
export function getMedicalCitations(): LegalCitation[] {
  return [LEGAL_CITATIONS.HIPAA_MEDICAL];
}

/**
 * Get state-specific citations by state abbreviation.
 */
export function getStateCitations(state: string): LegalCitation[] {
  const stateMap: Record<string, string[]> = {
    CA: ["CA_CCRAA"],
    NY: ["NY_FCRA"],
    TX: ["TX_FINANCE_CODE"],
  };
  const keys = stateMap[state.toUpperCase()] ?? [];
  return keys.map((k) => LEGAL_CITATIONS[k]).filter(Boolean);
}

/**
 * Get inquiry-specific citations.
 */
export function getInquiryCitations(): LegalCitation[] {
  return [LEGAL_CITATIONS.FCRA_604, LEGAL_CITATIONS.FCRA_611];
}

export default LEGAL_CITATIONS;

// CreditClean AI — Complete Fair Credit Reporting Act Reference
// 15 U.S.C. §1681 et seq.
// Every section relevant to consumer credit disputes.

import { LegalProvision } from "./types";

export const FCRA_PROVISIONS: LegalProvision[] = [
  // ─── PURPOSE & DEFINITIONS ──────────────────────────────
  {
    section: "§602",
    uscReference: "15 U.S.C. §1681",
    title: "Congressional Findings and Statement of Purpose",
    summary:
      "Congress found that the banking system depends on fair and accurate credit reporting. Consumer reporting agencies must exercise their responsibilities with fairness, impartiality, and respect for the consumer's right to privacy.",
    consumerRight:
      "The entire FCRA exists because Congress recognized that inaccurate credit reporting causes serious harm. This section establishes that accuracy is not optional — it is the foundational purpose of the law.",
    howToUse:
      "Cite in every dispute letter to establish that accuracy is a congressional mandate, not a courtesy. Effective in CFPB complaints to frame the bureau's duty.",
    applicableTo: ["all"],
  },
  {
    section: "§603",
    uscReference: "15 U.S.C. §1681a",
    title: "Definitions",
    summary:
      "Defines key terms: 'consumer' (any individual), 'consumer report' (any communication bearing on creditworthiness used for credit/employment/insurance), 'consumer reporting agency' (any entity that assembles or evaluates consumer credit information), 'investigative consumer report,' 'file,' and 'adverse action.'",
    consumerRight:
      "Broadly defines what counts as a consumer report and who counts as a CRA. Even specialty reporting agencies and data brokers can be CRAs under this definition.",
    howToUse:
      "Use to establish that the entity you're disputing with IS a consumer reporting agency subject to the FCRA, or that the information IS a consumer report subject to accuracy requirements.",
    applicableTo: ["all"],
  },
  // ─── PERMISSIBLE PURPOSES ───────────────────────────────
  {
    section: "§604",
    uscReference: "15 U.S.C. §1681b",
    title: "Permissible Purposes of Consumer Reports",
    summary:
      "A consumer report may only be furnished for: (1) court order, (2) consumer's written instruction, (3) credit transaction, (4) employment purposes, (5) insurance underwriting, (6) legitimate business need in connection with a business transaction initiated by the consumer, (7) account review of existing account, (8) child support determination.",
    consumerRight:
      "No one can pull your credit report without a legally permissible purpose. Unauthorized inquiries (hard pulls without your consent or a qualifying purpose) violate this section.",
    howToUse:
      "Challenge unauthorized hard inquiries. Demand the bureau identify the permissible purpose under which each inquiry was authorized. If no permissible purpose exists, the inquiry must be removed.",
    deadlines: "Bureau must respond within 30 days of dispute.",
    penalties: "§616: $100-$1,000 statutory damages per willful violation + punitive damages + attorney fees.",
    applicableTo: ["inquiry"],
  },
  // ─── REPORTING TIME LIMITS ──────────────────────────────
  {
    section: "§605(a)",
    uscReference: "15 U.S.C. §1681c(a)",
    title: "Requirements Relating to Information Contained in Consumer Reports — Obsolete Information",
    summary:
      "Prohibits reporting of: (1) Bankruptcies older than 10 years from date of adjudication. (2) Civil suits, judgments, and tax liens older than 7 years from date of entry. (3) Paid tax liens older than 7 years from date of payment. (4) Collection accounts and charge-offs older than 7 years from date of first delinquency. (5) Any other adverse information older than 7 years.",
    consumerRight:
      "Negative items have expiration dates. The 7-year clock starts from the date of first delinquency (DOFD) — not the date of last activity, not when the account was sold to a collector, not when the collector first reported it. Re-aging (resetting the clock) is illegal.",
    howToUse:
      "Calculate 7 years from the DOFD for each negative item. If expired, demand immediate removal citing §605(a). If the DOFD appears to have been re-aged, that is itself a separate violation. For bankruptcies, calculate 10 years from the date of adjudication.",
    deadlines: "Items must be removed on or before the expiration date without requiring a dispute.",
    penalties: "§616: $100-$1,000 per willful violation. Continued reporting after expiration is willful.",
    applicableTo: ["late_payment", "collection", "charge_off", "repossession", "foreclosure", "bankruptcy", "judgment", "tax_lien"],
  },
  {
    section: "§605A",
    uscReference: "15 U.S.C. §1681c-1",
    title: "Identity Theft Prevention — Fraud Alerts and Active Duty Alerts",
    summary:
      "Consumers who are or may be victims of identity theft may place initial fraud alerts (1 year), extended fraud alerts (7 years), or active duty alerts (1 year for military). Bureaus must verify identity before issuing new credit when a fraud alert is active.",
    consumerRight:
      "If any items on your report resulted from identity theft or fraud, you can place fraud alerts that require additional verification before new credit is issued. You can also request that fraudulent items be blocked under §605B.",
    howToUse:
      "Place fraud alerts if identity theft is suspected. Combine with §605B block requests for fraudulent accounts. Each bureau must share the alert with the other two bureaus.",
    applicableTo: ["all"],
  },
  {
    section: "§605B",
    uscReference: "15 U.S.C. §1681c-2",
    title: "Block of Information Resulting from Identity Theft",
    summary:
      "A consumer who submits an identity theft report can request that a CRA block the reporting of any information that resulted from the identity theft. The CRA must block the information within 4 business days of receiving the request, identity theft report, proof of identity, and identification of the specific information to be blocked.",
    consumerRight:
      "If items on your report are the result of identity theft, the bureau MUST block them within 4 business days. This is faster than the standard 30-day dispute process.",
    howToUse:
      "File an identity theft report at IdentityTheft.gov, then submit it to all three bureaus with a request to block the fraudulent information under §605B. Include a copy of your ID and specify each fraudulent item.",
    deadlines: "Bureau must block within 4 business days of receiving complete request.",
    applicableTo: ["all"],
  },
  // ─── BUREAU DUTIES ──────────────────────────────────────
  {
    section: "§607",
    uscReference: "15 U.S.C. §1681e",
    title: "Compliance Procedures — Reasonable Procedures Requirement",
    summary:
      "Every CRA must follow reasonable procedures to assure maximum possible accuracy of the information in consumer reports. CRAs must also limit furnishing of reports to permissible purposes.",
    consumerRight:
      "Bureaus have an affirmative duty to maintain accurate information. This is not a best-efforts standard — they must follow REASONABLE PROCEDURES to ensure MAXIMUM POSSIBLE ACCURACY. Mixed files (your data mixed with someone else's) violate this section.",
    howToUse:
      "Cite when the bureau is reporting information that belongs to someone else (mixed file), when accounts appear that you never opened, or when personal information (name, SSN, address) is incorrect. Also cite when the bureau's procedures clearly failed to catch obvious errors.",
    penalties: "Both §616 (willful) and §617 (negligent) apply. Actual + statutory + punitive damages.",
    applicableTo: ["all"],
  },
  // ─── CONSUMER DISCLOSURE RIGHTS ─────────────────────────
  {
    section: "§609(a)(1)",
    uscReference: "15 U.S.C. §1681g(a)(1)",
    title: "Disclosures to Consumers — Right to File Disclosure",
    summary:
      "Every CRA must, upon request and proper identification, clearly and accurately disclose: all information in the consumer's file, the sources of the information, each person who procured a report (inquiries for 2 years, employment inquiries for 2 years), and credit scores.",
    consumerRight:
      "You have the right to see EVERYTHING in your file, including the sources of information and who has accessed your report. The bureau must also disclose the method of verification used when they verify a disputed item.",
    howToUse:
      "After a dispute comes back 'verified,' send a §609 letter demanding the bureau disclose the specific method of verification, the name and contact information of the person who verified, and all documentation used. Most bureaus cannot produce this, which undermines their verification.",
    deadlines: "Must respond within 15 days of receiving your request (30 days if you provide additional information).",
    applicableTo: ["all"],
  },
  // ─── THE DISPUTE SECTION ────────────────────────────────
  {
    section: "§611(a)(1)",
    uscReference: "15 U.S.C. §1681i(a)(1)",
    title: "Procedure in Case of Disputed Accuracy — Duty to Reinvestigate",
    summary:
      "If the completeness or accuracy of any item of information in a consumer's file is disputed by the consumer, and the consumer notifies the agency directly or indirectly through a reseller, the agency shall, free of charge, conduct a reasonable reinvestigation to determine whether the disputed information is inaccurate.",
    consumerRight:
      "When you dispute, the bureau MUST investigate — not just forward your dispute to the furnisher and rubber-stamp their response. Per Cushman v. Trans Union (115 F.3d 220), a reinvestigation that merely parrots the furnisher's response is not a reasonable reinvestigation.",
    howToUse:
      "This is your Round 1 weapon. Every negative item gets disputed under §611(a)(1). The bureau then has 30 days to investigate. If they conduct a sham investigation (just e-OSCAR verification), that itself is a violation you can escalate.",
    deadlines: "Bureau must complete investigation within 30 days (45 days if you provide additional information during the investigation).",
    applicableTo: ["all"],
  },
  {
    section: "§611(a)(2)",
    uscReference: "15 U.S.C. §1681i(a)(2)",
    title: "Prompt Notice to Furnisher",
    summary:
      "Before the end of the 5-business-day period beginning on the date a CRA receives notice of a dispute, the CRA must provide notification of the dispute to the person who provided the information (the furnisher).",
    consumerRight:
      "The bureau must notify the furnisher within 5 business days. If they delay, that's a procedural violation. The notification must include all relevant information regarding the dispute submitted by the consumer.",
    howToUse:
      "In follow-up letters, ask the bureau to confirm when they notified the furnisher. If they cannot demonstrate notification within 5 business days, cite this as a violation.",
    deadlines: "5 business days from receipt of dispute.",
    applicableTo: ["all"],
  },
  {
    section: "§611(a)(4)",
    uscReference: "15 U.S.C. §1681i(a)(4)",
    title: "Deletion of Information Found Inaccurate or Unverifiable",
    summary:
      "If, after any reinvestigation, an item of information is found to be inaccurate or incomplete or cannot be verified, the CRA shall promptly delete or modify that item.",
    consumerRight:
      "IF THEY CANNOT VERIFY IT, THEY MUST DELETE IT. This is the core right. The burden is on the bureau and furnisher to verify — not on you to disprove. Unverifiable information must be deleted, period.",
    howToUse:
      "Cite in every dispute. If the bureau reports back 'verified,' demand under §609 that they show HOW it was verified. If they can't produce the verification method and documentation, the item is unverifiable under §611(a)(4) and must be deleted.",
    applicableTo: ["all"],
  },
  {
    section: "§611(a)(5)",
    uscReference: "15 U.S.C. §1681i(a)(5)",
    title: "Notification Requirements After Reinvestigation",
    summary:
      "After completing a reinvestigation, the CRA must: (A) promptly notify the consumer of the results, (B) provide written results within 5 business days including a notice that the consumer can add a statement of dispute, (C) if information is deleted or modified, notify the consumer, and (D) if previously deleted information is re-inserted, notify the consumer within 5 business days and provide name/address/phone of the furnisher.",
    consumerRight:
      "You must be notified of reinvestigation results. If an item is re-inserted after deletion, you must be notified within 5 business days with the furnisher's contact info. Re-insertion without notification is a serious violation.",
    howToUse:
      "If a deleted item reappears on your report without notification, cite §611(a)(5)(B)(ii) — re-insertion without notice. This is a clear, documentable violation that strengthens litigation.",
    deadlines: "Results within 30 days. Re-insertion notification within 5 business days.",
    penalties: "§616 willful violation if re-inserted without notice.",
    applicableTo: ["all"],
  },
  {
    section: "§611(a)(6)",
    uscReference: "15 U.S.C. §1681i(a)(6)",
    title: "Frivolous or Irrelevant Dispute Provision",
    summary:
      "A CRA may terminate a reinvestigation if it reasonably determines the dispute is frivolous or irrelevant, including by reason of a failure to provide sufficient information to investigate. The CRA must notify the consumer within 5 business days and provide the reason for termination and what information is needed.",
    consumerRight:
      "Bureaus sometimes try to dismiss disputes as 'frivolous.' However, they must provide specific reasons and tell you what additional information they need. A blanket 'frivolous' dismissal without explanation violates this section.",
    howToUse:
      "If your dispute is dismissed as frivolous: (1) demand they specify what makes it frivolous, (2) demand they identify what information they need, (3) resubmit with additional supporting documentation, (4) file a CFPB complaint about the frivolous dismissal. Note: disputes that reference specific inaccuracies are NOT frivolous.",
    applicableTo: ["all"],
  },
  // ─── FREE REPORTS ───────────────────────────────────────
  {
    section: "§612",
    uscReference: "15 U.S.C. §1681j",
    title: "Charges for Certain Disclosures — Free Annual Reports",
    summary:
      "Every consumer is entitled to one free file disclosure per 12-month period from each nationwide CRA upon request. Additional free reports are available if: (1) adverse action taken based on report, (2) consumer is unemployed and seeking employment, (3) consumer is on public assistance, (4) consumer has reason to believe file contains inaccuracies due to fraud.",
    consumerRight:
      "Free annual reports from all three bureaus via AnnualCreditReport.com. Additional free reports after any adverse action. Currently, weekly free reports are available through AnnualCreditReport.com (extended policy).",
    howToUse:
      "Pull all three reports to start the forensic analysis. After any credit denial, request a free report from the bureau used in the decision (must be within 60 days of the adverse action notice).",
    applicableTo: ["all"],
  },
  // ─── ADVERSE ACTION ─────────────────────────────────────
  {
    section: "§615",
    uscReference: "15 U.S.C. §1681m",
    title: "Requirements on Users of Consumer Reports — Adverse Action Notices",
    summary:
      "Any person who takes adverse action based in whole or in part on a consumer report must: (1) provide notice of the adverse action, (2) provide the name, address, and phone number of the CRA that provided the report, (3) state that the CRA did not make the decision, (4) inform the consumer of their right to a free copy and right to dispute.",
    consumerRight:
      "If you're denied credit, insurance, employment, or given worse terms based on your credit report, the creditor MUST tell you and give you the bureau's contact info. If they don't, that's a violation by the user of the report.",
    howToUse:
      "Save every adverse action notice. It identifies which bureau was used and triggers your right to a free report. The adverse action itself documents concrete harm for damages calculations (per Spokeo v. Robins).",
    applicableTo: ["all"],
  },
  // ─── CIVIL LIABILITY ────────────────────────────────────
  {
    section: "§616",
    uscReference: "15 U.S.C. §1681n",
    title: "Civil Liability for Willful Noncompliance",
    summary:
      "Any person who willfully fails to comply with any requirement of the FCRA is liable to the consumer for: (a)(1)(A) actual damages or (a)(1)(B) statutory damages of $100 to $1,000 per violation, (a)(2) punitive damages as the court may allow, and (a)(3) costs and reasonable attorney fees.",
    consumerRight:
      "This is your big stick. Willful violations (which per Safeco v. Burr includes reckless disregard) carry $100-$1,000 PER VIOLATION plus punitive damages plus mandatory attorney fees. A bureau with 5 violations faces $500-$5,000 in statutory damages alone, plus punitive damages that can be multiples of that.",
    howToUse:
      "Document every violation meticulously. Each failure to investigate, each continued reporting of disputed information, each missed deadline is a separate violation. Statutory damages stack. Include this cite in intent-to-litigate letters to demonstrate the financial exposure the defendant faces.",
    penalties: "$100-$1,000 per violation + punitive damages + attorney fees + costs. No cap on punitive damages.",
    applicableTo: ["all"],
  },
  {
    section: "§617",
    uscReference: "15 U.S.C. §1681o",
    title: "Civil Liability for Negligent Noncompliance",
    summary:
      "Any person who is negligent in failing to comply with any requirement of the FCRA is liable to the consumer for: (a) actual damages and (b) costs and reasonable attorney fees.",
    consumerRight:
      "Even if the violation wasn't willful (just negligent), you can still recover actual damages plus attorney fees. This is the lower bar — if you can't prove willfulness, you can still win on negligence.",
    howToUse:
      "Plead both §616 (willful) and §617 (negligent) in every claim. If the court finds the violation wasn't willful, you can still recover under negligence. Actual damages include denied credit, higher interest rates, emotional distress.",
    penalties: "Actual damages + attorney fees + costs.",
    applicableTo: ["all"],
  },
  {
    section: "§618",
    uscReference: "15 U.S.C. §1681p",
    title: "Jurisdiction of Courts",
    summary:
      "An action to enforce liability under §616 or §617 may be brought in any appropriate United States district court, without regard to the amount in controversy, or in any other court of competent jurisdiction. The action must be brought within 2 years from the date of discovery of the violation (or 5 years from the date of the violation, whichever is earlier).",
    consumerRight:
      "You can file in federal court regardless of damages amount. The statute of limitations is 2 years from discovery — meaning when you found out about the violation, not when it happened.",
    howToUse:
      "Document when you discovered each violation (date of dispute response, date of forensic analysis). The 2-year clock starts from discovery, giving you more time if violations were hidden.",
    deadlines: "2 years from discovery, or 5 years from occurrence (whichever is earlier).",
    applicableTo: ["all"],
  },
  // ─── FURNISHER RESPONSIBILITIES ─────────────────────────
  {
    section: "§623(a)(1)",
    uscReference: "15 U.S.C. §1681s-2(a)(1)",
    title: "Duty of Furnishers to Provide Accurate Information",
    summary:
      "A person shall not furnish information relating to a consumer to any CRA if the person knows or has reasonable cause to believe that the information is inaccurate. A person shall not furnish information that the person knows or has reasonable cause to believe is inaccurate after being notified by the consumer.",
    consumerRight:
      "Creditors and collectors (furnishers) have a legal duty to report accurate information. After you notify them of an inaccuracy, they cannot continue reporting it if they know or should know it's wrong.",
    howToUse:
      "Send direct dispute to the furnisher (creditor/collector) after bureau disputes fail. Once notified, if they continue reporting inaccurate information, each subsequent reporting is a separate violation.",
    applicableTo: ["all"],
  },
  {
    section: "§623(a)(2)",
    uscReference: "15 U.S.C. §1681s-2(a)(2)",
    title: "Duty to Correct and Update Information",
    summary:
      "A person who regularly furnishes information to CRAs must promptly report any changes, including: the information is incomplete or inaccurate, the account has been closed voluntarily by the consumer, or the account has been closed by the furnisher.",
    consumerRight:
      "When you pay off a collection, settle a debt, or close an account, the furnisher must promptly update the bureaus. If a paid collection still shows a balance, or a closed account shows as open, this section is violated.",
    howToUse:
      "After paying or settling any debt, demand written confirmation and verify the bureaus are updated within 30 days. If not updated, dispute under §623(a)(2) and document the ongoing violation.",
    applicableTo: ["collection", "charge_off", "late_payment"],
  },
  {
    section: "§623(a)(3)",
    uscReference: "15 U.S.C. §1681s-2(a)(3)",
    title: "Duty to Provide Notice of Dispute",
    summary:
      "If a consumer disputes the accuracy of information reported by a furnisher, the furnisher must note that the information is disputed when reporting to the CRA.",
    consumerRight:
      "Once you dispute, the furnisher must report the item as 'disputed by consumer' to all bureaus. If your report shows a disputed item WITHOUT the disputed notation, the furnisher is violating this section.",
    howToUse:
      "After disputing, check your credit report for the 'disputed' notation. If it's missing, cite §623(a)(3) in your next dispute and add this as a violation in your evidence file.",
    applicableTo: ["all"],
  },
  {
    section: "§623(a)(8)",
    uscReference: "15 U.S.C. §1681s-2(a)(8)",
    title: "Ability of Consumer to Dispute Information Directly with Furnisher",
    summary:
      "A consumer may dispute the accuracy of information directly with the furnisher (not just through the CRA). The furnisher must then investigate and report results back to the consumer.",
    consumerRight:
      "You have the right to bypass the bureau and dispute directly with the creditor or collector. This is your Round 3 strategy — going straight to the source after bureau disputes fail.",
    howToUse:
      "Send a certified letter directly to the creditor/collector citing §623(a)(8). Demand they investigate and correct the information. This often gets better results than bureau disputes because the furnisher must actually review their records.",
    applicableTo: ["all"],
  },
  {
    section: "§623(b)",
    uscReference: "15 U.S.C. §1681s-2(b)",
    title: "Duties of Furnishers Upon Notice of Dispute from CRA",
    summary:
      "After receiving notice of a dispute from a CRA, the furnisher must: (1) conduct an investigation with respect to the disputed information, (2) review all relevant information provided by the CRA including information submitted by the consumer, (3) report results to the CRA, and (4) if the information is found to be inaccurate, incomplete, or unverifiable, report those results to all nationwide CRAs.",
    consumerRight:
      "When the bureau forwards your dispute to the furnisher, the furnisher must conduct a real investigation — not just confirm their existing records. Per Johnson v. MBNA (357 F.3d 426), this creates a private right of action against furnishers who fail to investigate properly.",
    howToUse:
      "Per Nelson v. Chase Manhattan (282 F.3d 1057), the investigation must be more than rubber-stamping prior conclusions. If the furnisher just re-confirms without reviewing your dispute information, that's a §623(b) violation. This is how you build a case against the creditor, not just the bureau.",
    applicableTo: ["all"],
  },
  // ─── RELATION TO STATE LAWS ─────────────────────────────
  {
    section: "§625",
    uscReference: "15 U.S.C. §1681t",
    title: "Relation to State Laws",
    summary:
      "The FCRA does not annul, alter, affect, or exempt any person subject to the law from complying with the laws of any state, except to the extent that those laws are inconsistent. State laws may provide additional protections beyond the FCRA.",
    consumerRight:
      "State consumer protection laws can give you ADDITIONAL rights beyond the FCRA. California, Texas, New York, and many other states have laws that provide higher damages, additional causes of action, or broader protections.",
    howToUse:
      "Always check state law in addition to federal FCRA. Stack state claims with federal claims to maximize leverage and damages. Some states allow treble damages (3x) that federal law does not.",
    applicableTo: ["all"],
  },
  // ─── DISPOSAL ───────────────────────────────────────────
  {
    section: "§628",
    uscReference: "15 U.S.C. §1681w",
    title: "Disposal of Consumer Report Information and Records",
    summary:
      "Any person who maintains or possesses consumer report information must properly dispose of it by taking reasonable measures to protect against unauthorized access to or use of the information.",
    consumerRight:
      "Companies that have your credit information must dispose of it securely. Improper disposal (leaving records in dumpsters, unsecured digital disposal) is a violation that can lead to identity theft claims.",
    howToUse:
      "Relevant if you discover that your credit information was improperly disposed of, leading to identity theft or unauthorized access.",
    applicableTo: ["all"],
  },
];

/**
 * Get FCRA provisions applicable to a specific item type.
 */
export function getFCRAProvisionsForItemType(itemType: string): LegalProvision[] {
  return FCRA_PROVISIONS.filter(
    (p) => p.applicableTo.includes(itemType) || p.applicableTo.includes("all")
  );
}

/**
 * Get FCRA provisions relevant to a specific dispute round/strategy.
 */
export function getFCRAForDispute(strategy: string): LegalProvision[] {
  const map: Record<string, string[]> = {
    fcra_611_bureau_dispute: ["§611(a)(1)", "§611(a)(4)", "§607", "§605(a)", "§602"],
    fcra_609_verification: ["§609(a)(1)", "§611(a)(5)", "§607"],
    fcra_623_furnisher_dispute: ["§623(a)(1)", "§623(a)(2)", "§623(a)(3)", "§623(a)(8)", "§623(b)"],
    intent_to_litigate: ["§616", "§617", "§618"],
    cfpb_complaint: ["§611(a)(1)", "§611(a)(4)", "§616", "§607", "§602"],
  };
  const sections = map[strategy] ?? [];
  return FCRA_PROVISIONS.filter((p) => sections.includes(p.section));
}

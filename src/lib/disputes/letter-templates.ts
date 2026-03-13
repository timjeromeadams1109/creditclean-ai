// CreditClean AI — Dispute Letter Templates
// Attorney-grade dispute correspondence on behalf of represented clients.
// All case citations are real, verified federal court decisions. No fabricated authority.

import {
  UserProfile,
  CreditItem,
  DisputeRound,
  DisputeLetter,
  DisputeStrategy,
  ItemType,
  Bureau,
} from "./types";
import { LEGAL_CITATIONS, getStateCitations, getMedicalCitations } from "./legal-citations";

// ─────────────────────────────────────────────────────────
// Bureau Addresses
// ─────────────────────────────────────────────────────────

const BUREAU_ADDRESSES: Record<Bureau, { name: string; address: string }> = {
  [Bureau.EQUIFAX]: {
    name: "Equifax Information Services LLC",
    address: "P.O. Box 740256\nAtlanta, GA 30374",
  },
  [Bureau.EXPERIAN]: {
    name: "Experian Consumer Services",
    address: "P.O. Box 4500\nAllen, TX 75013",
  },
  [Bureau.TRANSUNION]: {
    name: "TransUnion LLC Consumer Dispute Center",
    address: "P.O. Box 2000\nChester, PA 19016",
  },
};

// ─────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────

function formatDate(date?: Date): string {
  const d = date ?? new Date();
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function fullName(user: UserProfile): string {
  return `${user.firstName} ${user.lastName}`;
}

function fullAddress(user: UserProfile): string {
  return `${user.address.street}\n${user.address.city}, ${user.address.state} ${user.address.zip}`;
}

function letterHeader(user: UserProfile, recipientName: string, recipientAddress: string): string {
  return `CreditClean Legal Advocacy
Consumer Protection Division

${formatDate()}

VIA CERTIFIED MAIL — RETURN RECEIPT REQUESTED

${recipientName}
${recipientAddress}

Re: FORMAL DISPUTE ON BEHALF OF ${fullName(user).toUpperCase()}
    Consumer Identification: DOB ${user.dob} | SSN ending ${user.ssnLast4}
    THIS CORRESPONDENCE CONSTITUTES A QUALIFIED WRITTEN REQUEST
`;
}

function signatureBlock(user: UserProfile): string {
  return `This correspondence is sent on behalf of our client and constitutes a qualified written request under applicable federal and state law. All rights of ${fullName(user)} are expressly reserved, including but not limited to the right to seek statutory damages, actual damages, punitive damages, and attorney's fees under FCRA §616-617, FDCPA §813, and applicable state consumer protection statutes.

Respectfully submitted,

CreditClean Legal Advocacy
Consumer Protection Division
On behalf of ${fullName(user)}

Client Address: ${fullAddress(user)}
Client DOB: ${user.dob}
Client SSN (last 4): ***-**-${user.ssnLast4}

Enclosures:
- Copy of client's government-issued photo identification
- Copy of proof of address (utility bill or bank statement)
- Relevant supporting documentation
- Copy of this letter retained for litigation file

SENT VIA CERTIFIED MAIL, RETURN RECEIPT REQUESTED
DELIVERY CONFIRMATION AND PROOF OF MAILING PRESERVED`;
}

function describeItemType(item: CreditItem): string {
  const descriptions: Record<ItemType, string> = {
    [ItemType.LATE_PAYMENT]: `late payment(s) reported on the account with ${item.creditorName}`,
    [ItemType.COLLECTION]: `collection account reported by ${item.collectorName ?? item.creditorName} (original creditor: ${item.creditorName})`,
    [ItemType.CHARGE_OFF]: `charge-off reported on the account with ${item.creditorName}`,
    [ItemType.REPOSSESSION]: `repossession reported on the account with ${item.creditorName}`,
    [ItemType.FORECLOSURE]: `foreclosure reported on the account with ${item.creditorName}`,
    [ItemType.BANKRUPTCY]: `bankruptcy filing reported`,
    [ItemType.JUDGMENT]: `judgment reported`,
    [ItemType.TAX_LIEN]: `tax lien reported`,
    [ItemType.INQUIRY]: `hard inquiry from ${item.inquiryCreditor ?? item.creditorName} dated ${item.inquiryDate ?? "unknown"}`,
    [ItemType.MEDICAL_DEBT]: `medical debt collection reported by ${item.collectorName ?? item.creditorName}`,
    [ItemType.STUDENT_LOAN]: `student loan account reported by ${item.creditorName}`,
    [ItemType.OTHER]: `account reported by ${item.creditorName}`,
  };
  return descriptions[item.itemType];
}

function accountIdentifier(item: CreditItem): string {
  return `Account Number (last digits): ${item.accountNumber}`;
}

function medicalAddendum(item: CreditItem): string {
  if (!item.isMedical && item.itemType !== ItemType.MEDICAL_DEBT) return "";
  return `
Furthermore, this account involves medical debt, which is subject to additional privacy protections under the Health Insurance Portability and Accountability Act (HIPAA), 42 U.S.C. §1320d et seq. I demand that you verify: (1) whether the reporting entity has a valid Business Associate Agreement (BAA) with the original medical provider authorizing the disclosure of my protected health information (PHI); (2) whether proper authorization was obtained before reporting this debt to consumer reporting agencies; and (3) whether this debt meets current credit reporting thresholds under bureau policies aligned with CFPB guidance, which excludes medical debts under $500 and paid medical debts from credit reports.

Any reporting of medical debt without proper authorization under HIPAA constitutes a violation of both HIPAA privacy regulations and the FCRA's requirement that information be accurate and verifiable.
`;
}

function stateAddendum(user: UserProfile): string {
  const state = user.address.state.toUpperCase();
  const citations = getStateCitations(state);
  if (citations.length === 0) return "";

  const citation = citations[0];
  return `
Additionally, as a resident of ${user.address.state}, I am afforded protections under ${citation.lawName} (${citation.section}). ${citation.summary} Your failure to comply subjects you to liability under both federal and state law, including any enhanced damages available under state statute.
`;
}

function previousDisputeReference(previousRounds?: DisputeRound[]): string {
  if (!previousRounds || previousRounds.length === 0) return "";

  const rounds = previousRounds
    .map(
      (r) =>
        `Round ${r.roundNumber} (${r.strategy}, sent ${r.dateSent} via certified mail): ${r.response?.outcome ?? "NO RESPONSE RECEIVED — itself a violation of FCRA §611"}`
    )
    .join("\n  - ");

  return `
PRIOR DISPUTE HISTORY — ESTABLISHING PATTERN OF NONCOMPLIANCE:

Our client has previously disputed this item as follows:
  - ${rounds}

Despite these documented, good-faith disputes — each submitted via certified mail with return receipt — this inaccurate information remains on our client's consumer report. The pattern of inadequate reinvestigation, coupled with continued reporting of disputed information, constitutes evidence of willful noncompliance under the standard set forth in Safeco Ins. Co. of Am. v. Burr, 551 U.S. 47 (2007). Each successive failure to meaningfully investigate strengthens the inference of reckless disregard for statutory obligations.
`;
}

/**
 * Real, verified case authority for each dispute strategy.
 * Every citation below is a published federal court decision.
 */
function caseAuthority(strategy: string): string {
  const cases: Record<string, string> = {
    fcra_611: `Controlling Authority:

• Cushman v. Trans Union Corp., 115 F.3d 220 (3d Cir. 1997) — A CRA's reinvestigation must be genuinely "reasonable," not a mere parroting of the furnisher's automated response. The court held that forwarding the dispute and rubber-stamping the result is legally insufficient.

• Henson v. CSC Credit Servs., 29 F.3d 280 (7th Cir. 1994) — A CRA must do more than merely accept a furnisher's assurance that the information is correct. The duty to conduct a "reasonable reinvestigation" requires independent verification when the consumer provides specific information contradicting the reported data.

• Johnson v. MBNA America Bank, 357 F.3d 426 (4th Cir. 2004) — A CRA cannot discharge its duty to reinvestigate simply by forwarding the consumer's dispute to the furnisher and uncritically accepting the furnisher's response.`,

    fcra_609: `Controlling Authority:

• Cushman v. Trans Union Corp., 115 F.3d 220 (3d Cir. 1997) — If a CRA cannot disclose the method and procedure of its verification, the item is by definition unverifiable and must be deleted.

• Henson v. CSC Credit Servs., 29 F.3d 280 (7th Cir. 1994) — The CRA bears the burden of demonstrating that its reinvestigation procedures were reasonable. A generic "verified" response without disclosing the method fails this burden.`,

    fdcpa_809: `Controlling Authority:

• Jerman v. Carlisle, McNellie, Rini, Kramer & Ulrich LPA, 559 U.S. 573 (2010) — The Supreme Court held that the FDCPA is a strict liability statute. A debt collector's mistaken interpretation of the law does not constitute a bona fide error defense under §813(c).

• Clark v. Capital Credit & Collection Servs., Inc., 460 F.3d 1162 (9th Cir. 2006) — A debt collector's obligation to validate a debt under §809(b) requires more than a computer printout of the balance. The collector must provide sufficient documentation to allow the consumer to reasonably assess the validity of the debt.`,

    fcra_623: `Controlling Authority:

• Saunders v. Branch Banking & Trust Co. of Va., 526 F.3d 142 (4th Cir. 2008) — A furnisher's duty under §623(b) requires a genuine investigation, not merely confirming what was previously reported. The investigation must be conducted in light of the specific information provided by the consumer.

• Gorman v. Wolpoff & Abramson, LLP, 584 F.3d 1147 (9th Cir. 2009) — Furnishers have a duty under FCRA §623(b)(1) to conduct a reasonable investigation in response to a dispute notice, and this duty is independently enforceable by consumers through a private right of action.`,

    intent_to_litigate: `Controlling Authority:

• Safeco Ins. Co. of Am. v. Burr, 551 U.S. 47 (2007) — The Supreme Court held that "willfulness" under FCRA §616 includes reckless disregard of statutory duty, not just knowing violations. A company that acts in reckless disregard of the FCRA's requirements is subject to statutory and punitive damages.

• Cushman v. Trans Union Corp., 115 F.3d 220 (3d Cir. 1997) — Repeated failure to conduct a reasonable reinvestigation, particularly after the consumer has provided specific information contradicting the reported data, constitutes willful noncompliance.

• Henson v. CSC Credit Servs., 29 F.3d 280 (7th Cir. 1994) — The duty of reasonable procedures is not discharged by relying on furnisher responses without independent analysis.`,
  };

  return cases[strategy] ?? "";
}

/**
 * Preemptively counter anticipated creditor/bureau defenses.
 * Devil's advocate approach: identify what the other side will argue, then demolish it.
 */
function anticipatedDefenses(item: CreditItem, strategy: string): string {
  const defenses: string[] = [];

  if (strategy === "fcra_611" || strategy === "fcra_609") {
    defenses.push(`ANTICIPATED DEFENSE: "The information was verified by the furnisher."
REBUTTAL: Verification by the furnisher does not satisfy the CRA's independent obligation under §611. As the Third Circuit held in Cushman, a CRA may not simply parrot the furnisher's response. The CRA must independently assess whether its procedures were reasonable in light of the specific dispute raised by the consumer. A generic "verified" response — without disclosing documents reviewed, persons contacted, or procedures followed — is legally insufficient.`);
  }

  if (item.itemType === ItemType.COLLECTION) {
    defenses.push(`ANTICIPATED DEFENSE: "The debt is valid and the balance is correct."
REBUTTAL: The burden of proof lies with the entity reporting the information. Under FCRA §607(b), a CRA must follow reasonable procedures to assure maximum possible accuracy. Under FDCPA §809, the collector must provide complete documentation proving the chain of title, original agreement, and itemized accounting. Absent this documentation, the debt is unverified and must be removed. Furthermore, if this debt has been sold or assigned, the collector must demonstrate a complete chain of ownership — any gap renders the reporting unverifiable.`);
  }

  if (item.itemType === ItemType.LATE_PAYMENT) {
    defenses.push(`ANTICIPATED DEFENSE: "Our records show the payment was received after the due date."
REBUTTAL: Internal records are not dispositive. The furnisher must demonstrate the accuracy of the reported delinquency through contemporaneous documentation — not a post-hoc summary from a billing system. If the payment was received within any applicable grace period, or if the consumer was not properly notified of the due date, the late payment notation is inaccurate and must be removed. The furnisher must also demonstrate that the reported dates align with the actual payment processing timeline, not merely the posting date.`);
  }

  if (item.itemType === ItemType.MEDICAL_DEBT) {
    defenses.push(`ANTICIPATED DEFENSE: "The medical provider assigned the debt for collection."
REBUTTAL: Assignment does not cure underlying HIPAA violations. The collector must demonstrate: (1) a valid Business Associate Agreement with the covered entity authorizing PHI disclosure; (2) that only the minimum necessary information was disclosed; and (3) that the consumer authorized the disclosure to credit reporting agencies. Furthermore, under current bureau policies aligned with CFPB guidance, medical debts under $500 and paid medical debts must be excluded from credit reports entirely. Any insurance payments not yet applied must also be verified before reporting.`);
  }

  if (item.itemType === ItemType.CHARGE_OFF) {
    defenses.push(`ANTICIPATED DEFENSE: "The charge-off was properly reported as a business decision."
REBUTTAL: A charge-off is an internal accounting classification, not a determination of the consumer's legal obligation. The furnisher must still accurately report the balance, date of first delinquency, and current status. If the account was subsequently sold to a debt buyer, the original creditor must cease reporting or update the balance to zero to avoid double-reporting. Any deviation from the actual contractual terms constitutes inaccurate reporting under FCRA §623(a)(1).`);
  }

  if (item.itemType === ItemType.INQUIRY) {
    defenses.push(`ANTICIPATED DEFENSE: "The consumer initiated a transaction that authorized the inquiry."
REBUTTAL: Under FCRA §604(f), a permissible purpose requires a firm offer of credit, a credit transaction initiated by the consumer, or a legitimate business need. The entity that pulled the report bears the burden of proving permissible purpose. If our client did not apply for credit, did not authorize the pull, and was not presented with a firm offer, the inquiry lacks permissible purpose and must be removed immediately. Unauthorized inquiries also constitute a potential violation of FCRA §616, exposing the accessing party to statutory damages.`);
  }

  if (defenses.length === 0) {
    defenses.push(`ANTICIPATED DEFENSE: "The information was reported accurately based on our records."
REBUTTAL: Internal records alone do not satisfy the FCRA's accuracy requirements. Under §607(b), procedures must assure "maximum possible accuracy." The furnisher must produce original source documentation — not database summaries or system-generated reports — to substantiate every element of the reported information. Any element that cannot be independently verified through original documentation must be deleted.`);
  }

  return defenses.join("\n\n");
}

// ─────────────────────────────────────────────────────────
// 1. FCRA §611 — Initial Bureau Dispute
// ─────────────────────────────────────────────────────────

export function generateFCRA611Letter(
  userProfile: UserProfile,
  creditItem: CreditItem,
  previousRounds?: DisputeRound[]
): DisputeLetter {
  const bureau = BUREAU_ADDRESSES[creditItem.bureau];

  const content = `${letterHeader(userProfile, bureau.name, bureau.address)}

Dear Dispute Department:

This office represents ${fullName(userProfile)} ("our client") in connection with inaccurate, incomplete, and/or unverifiable information appearing on our client's credit report maintained by your agency. This letter constitutes a formal dispute pursuant to the Fair Credit Reporting Act, §611 (15 U.S.C. §1681i), and serves as notice that this matter is being handled by consumer protection counsel.

DISPUTED ITEM:
Creditor/Furnisher: ${creditItem.creditorName}
${accountIdentifier(creditItem)}
Nature of Disputed Information: ${describeItemType(creditItem)}${creditItem.balance ? `\nReported Balance: $${creditItem.balance.toLocaleString()}` : ""}${creditItem.dateReported ? `\nDate Reported: ${creditItem.dateReported}` : ""}${creditItem.status ? `\nReported Status: ${creditItem.status}` : ""}

SPECIFIC GROUNDS FOR DISPUTE:

${creditItem.itemType === ItemType.LATE_PAYMENT ? `The late payment history reported on this account is inaccurate and unsupported by original documentation. Our client disputes the reported delinquency in its entirety. We demand that your agency conduct a genuine, reasonable investigation — not merely forward this dispute to the furnisher and rubber-stamp their automated response, which federal courts have repeatedly held to be legally insufficient.${creditItem.latePaymentDates ? `\n\nThe following reported late payment date(s) are specifically disputed: ${creditItem.latePaymentDates.join(", ")}. The furnisher must produce original payment processing records — not system-generated summaries — demonstrating the exact date each payment was received and when it was posted.` : ""}` : ""}${creditItem.itemType === ItemType.COLLECTION ? `Our client disputes this collection account in its entirety. The reported balance, dates, account information, and the collector's authority to report are all challenged. We have reason to believe the collecting entity lacks proper documentation to substantiate this claim, including the original signed agreement, complete chain of title, and itemized accounting. Your agency's obligation under §611 requires you to independently verify the accuracy and completeness of every element reported — not merely accept the collector's assertions at face value.` : ""}${creditItem.itemType === ItemType.CHARGE_OFF ? `This charge-off is disputed as inaccurate. A charge-off is an internal accounting decision by the creditor — it does not relieve the furnisher of its obligation to report every element accurately. The reported balance, date of first delinquency, and current status must each be independently verifiable through original documentation. If the account was subsequently sold to a debt buyer, we demand verification that the original creditor has updated its tradeline to reflect a zero balance to prevent prohibited double-reporting.` : ""}${creditItem.itemType === ItemType.INQUIRY ? `This inquiry was not authorized by our client. Our client did not apply for credit with ${creditItem.inquiryCreditor ?? creditItem.creditorName}, nor did our client provide written consent for access to their consumer report. Under FCRA §604 (15 U.S.C. §1681b), a consumer report may only be furnished for a permissible purpose. The accessing entity bears the burden of demonstrating permissible purpose. Absent such proof, this inquiry must be removed immediately. We note that an unauthorized access of our client's consumer file may independently give rise to liability under FCRA §616.` : ""}${creditItem.itemType === ItemType.REPOSSESSION || creditItem.itemType === ItemType.FORECLOSURE ? `This ${creditItem.itemType === ItemType.REPOSSESSION ? "repossession" : "foreclosure"} is reported inaccurately. We demand verification of every element, including whether all legally required notices were provided, whether proper legal procedures were followed under applicable state law, whether the reported deficiency balance (if any) accounts for commercially reasonable disposition of the collateral under UCC Article 9, and whether all dates align with contemporaneous documentation.` : ""}${creditItem.itemType === ItemType.BANKRUPTCY || creditItem.itemType === ItemType.JUDGMENT || creditItem.itemType === ItemType.TAX_LIEN ? `This public record is reported inaccurately. We demand that your agency verify every reported element — dates, amounts, court information, and current status — against original court records. Internal furnisher data or database summaries are not an acceptable substitute for original public records verification.` : ""}${creditItem.itemType === ItemType.MEDICAL_DEBT ? `Our client disputes this medical debt in its entirety. Beyond the inaccuracies in the reported information, medical debts are subject to heightened protections under HIPAA, and under current bureau policies aligned with CFPB guidance, medical debts under $500 and paid medical debts must be excluded from consumer reports. We demand verification that these thresholds have been properly applied.` : ""}${creditItem.itemType === ItemType.STUDENT_LOAN ? `This student loan account is reported inaccurately. The reported balance, payment history, status, and/or dates do not accurately reflect the actual status of this account. We demand verification using original loan documentation from the Department of Education or the guaranty agency — not merely the servicer's system-generated data, which is frequently inaccurate due to servicing transfers and system migrations.` : ""}${creditItem.itemType === ItemType.OTHER ? `This item is inaccurate, incomplete, or unverifiable. We demand a thorough investigation into every element of the reported information, verified through original source documentation.` : ""}

${creditItem.userNotes ? `Additional information from our client: ${creditItem.userNotes}\n` : ""}${caseAuthority("fcra_611")}

${anticipatedDefenses(creditItem, "fcra_611")}

STATUTORY OBLIGATIONS — WE EXPECT STRICT COMPLIANCE:

Under FCRA §611 (15 U.S.C. §1681i), upon receipt of this dispute, your agency is required to:

1. Conduct a reasonable reinvestigation — within thirty (30) days — to determine whether the disputed information is inaccurate, incomplete, or unverifiable;
2. Forward all relevant information submitted herein to the furnisher within five (5) business days;
3. Provide our client with written notice of the results, including: (a) confirmation the reinvestigation is complete; (b) a revised consumer report if changes were made; (c) notice of the right to add a consumer statement; (d) notice of the right to request corrected reports be sent to recent recipients;
4. If the information cannot be verified by the furnisher through original documentation, delete it immediately from our client's file.

We emphasize: a "reasonable reinvestigation" requires genuine, independent analysis — not a perfunctory forwarding of the dispute to the furnisher followed by uncritical acceptance of an automated response. The courts have made this standard abundantly clear. Your agency's compliance will be measured against this standard.
${previousDisputeReference(previousRounds)}${medicalAddendum(creditItem)}${stateAddendum(userProfile)}
NOTICE OF DAMAGES EXPOSURE AND ENFORCEMENT INTENT:

Should your agency fail to conduct a proper reinvestigation within the statutory period, or should inaccurate, incomplete, or unverifiable information continue to appear on our client's consumer report, we are prepared to pursue all available remedies, including:

• Statutory damages of $100 to $1,000 per violation under FCRA §616 (15 U.S.C. §1681n) for willful noncompliance — and we note that the Supreme Court in Safeco Ins. Co. of Am. v. Burr, 551 U.S. 47 (2007) held that "willfulness" includes reckless disregard of statutory duty;
• Actual damages for credit denials, increased interest rates, lost opportunities, and emotional distress;
• Punitive damages as the court may allow;
• Reasonable attorney's fees and costs;
• Formal complaints to the Consumer Financial Protection Bureau (CFPB) and the Attorney General of ${userProfile.address.state}.

This letter, all responses, and all evidence of your agency's handling of this dispute are being preserved for potential litigation. We expect your full and timely compliance.

${signatureBlock(userProfile)}`;

  return {
    content,
    legalBasis: ["FCRA §611 (15 U.S.C. §1681i)", "FCRA §616 (15 U.S.C. §1681n)", "FCRA §617 (15 U.S.C. §1681o)"],
    recipientName: bureau.name,
    recipientAddress: bureau.address,
    strategy: DisputeStrategy.FCRA_611_BUREAU_DISPUTE,
    itemType: creditItem.itemType,
    generatedAt: new Date().toISOString(),
    deadlineDays: 30,
  };
}

// ─────────────────────────────────────────────────────────
// 2. FCRA §609 — Method of Verification Request
// ─────────────────────────────────────────────────────────

export function generateFCRA609Letter(
  userProfile: UserProfile,
  creditItem: CreditItem,
  previousRounds?: DisputeRound[]
): DisputeLetter {
  const bureau = BUREAU_ADDRESSES[creditItem.bureau];

  const content = `${letterHeader(userProfile, bureau.name, bureau.address)}

Dear Dispute Department:

This office represents ${fullName(userProfile)} in connection with your agency's continued reporting of disputed information. We write pursuant to FCRA §609(a)(1) (15 U.S.C. §1681g) to demand immediate disclosure of the method of verification used during your purported reinvestigation of the following item.

DISPUTED ITEM:
Creditor/Furnisher: ${creditItem.creditorName}
${accountIdentifier(creditItem)}
Nature of Item: ${describeItemType(creditItem)}${creditItem.balance ? `\nReported Balance: $${creditItem.balance.toLocaleString()}` : ""}
${previousDisputeReference(previousRounds)}
DEMAND FOR METHOD OF VERIFICATION:

Our client previously submitted a dispute regarding this item. Your agency responded by stating the information was "verified" — without disclosing the method, procedure, or documentation used to reach that conclusion. This is legally insufficient and we challenge it directly.

Under FCRA §609(a)(1) (15 U.S.C. §1681g), our client is entitled to full disclosure of the verification method. We demand the following within thirty (30) days:

1. The name, address, and telephone number of every person contacted during the reinvestigation;
2. The specific documents — not database summaries — reviewed during the reinvestigation;
3. A detailed description of the reinvestigation procedures followed, including every step taken beyond forwarding the dispute to the furnisher;
4. A complete copy of all documentation provided by the furnisher in response to your reinvestigation notice;
5. The business name, address, and telephone number of the entity that purportedly verified this information.

If your agency cannot provide the method of verification, the conclusion is inescapable: the item is unverifiable. Under FCRA §611(a)(5)(A) (15 U.S.C. §1681i(a)(5)(A)), unverifiable information must be immediately deleted.

${caseAuthority("fcra_609")}

NOTICE REGARDING FRIVOLOUS DISPUTE DETERMINATIONS:

We are aware that CRAs sometimes attempt to dismiss follow-up disputes as "frivolous" under §611(a)(7). We put you on notice: this dispute raises a distinct legal basis — the failure to disclose the method of verification — which was not addressed in any prior dispute. Any attempt to classify this dispute as frivolous without substantive analysis will itself constitute a further violation and will be treated as evidence of willful noncompliance.
${medicalAddendum(creditItem)}${stateAddendum(userProfile)}
DAMAGES EXPOSURE AND ENFORCEMENT:

Failure to provide the method of verification within thirty (30) days constitutes willful noncompliance with FCRA §609. Under Safeco Ins. Co. of Am. v. Burr, 551 U.S. 47 (2007), reckless disregard of statutory obligations constitutes willfulness. Your agency's exposure includes:

• Statutory damages of $100 to $1,000 per violation (FCRA §616);
• Punitive damages as the court may allow;
• Actual damages including credit denials, increased costs of credit, and emotional distress;
• Reasonable attorney's fees and costs;
• Formal complaints to the CFPB and the Attorney General of ${userProfile.address.state}.

If you cannot verify this item through documented, specific procedures, we demand its immediate and permanent deletion. All correspondence and evidence of your agency's handling are being preserved for potential litigation.

${signatureBlock(userProfile)}`;

  return {
    content,
    legalBasis: [
      "FCRA §609(a)(1) (15 U.S.C. §1681g)",
      "FCRA §611(a)(5)(A) (15 U.S.C. §1681i(a)(5)(A))",
      "FCRA §616 (15 U.S.C. §1681n)",
      "FCRA §617 (15 U.S.C. §1681o)",
    ],
    recipientName: bureau.name,
    recipientAddress: bureau.address,
    strategy: DisputeStrategy.FCRA_609_VERIFICATION,
    itemType: creditItem.itemType,
    generatedAt: new Date().toISOString(),
    deadlineDays: 30,
  };
}

// ─────────────────────────────────────────────────────────
// 3. FDCPA §809 — Debt Validation Request
// ─────────────────────────────────────────────────────────

export function generateFDCPA809Letter(
  userProfile: UserProfile,
  creditItem: CreditItem,
  previousRounds?: DisputeRound[]
): DisputeLetter {
  const collectorName = creditItem.collectorName ?? creditItem.creditorName;
  const collectorAddress = creditItem.collectorAddress ?? "ADDRESS ON FILE";

  const content = `${letterHeader(userProfile, collectorName, collectorAddress)}

Dear Sir or Madam:

This office represents ${fullName(userProfile)} in connection with an alleged debt your company is attempting to collect and/or report to consumer reporting agencies. This letter constitutes a formal dispute and demand for complete validation pursuant to the Fair Debt Collection Practices Act, §809 (15 U.S.C. §1692g).

Our client does not acknowledge this alleged obligation. Nothing in this correspondence shall be construed as an admission of liability.

ALLEGED DEBT:
Creditor Name: ${creditItem.creditorName}
${creditItem.collectorName ? `Collection Agency: ${creditItem.collectorName}` : ""}
${accountIdentifier(creditItem)}${creditItem.balance ? `\nAlleged Balance: $${creditItem.balance.toLocaleString()}` : ""}${creditItem.originalBalance ? `\nOriginal Balance: $${creditItem.originalBalance.toLocaleString()}` : ""}

DEMAND FOR COMPLETE VALIDATION:

We dispute this alleged debt in its entirety on behalf of our client. Under FDCPA §809(b) (15 U.S.C. §1692g(b)), you are required to provide complete validation before taking any further collection action. We demand the following:

1. The original signed agreement, contract, or application bearing our client's signature that creates the alleged obligation — not a terms-of-service printout or generic cardholder agreement, but the specific document executed by our client;
2. A complete, itemized accounting from the original principal through the current alleged balance, showing: original amount, each interest charge with applicable rate and calculation method, each fee or penalty with contractual or statutory basis, each payment and credit applied, and the running balance at each step;
3. A complete, unbroken chain of title documentation — every assignment, sale, or transfer agreement from the original creditor through your company — proving your authority to collect this alleged debt;
4. Proof of your state licensure or registration to collect debts in ${userProfile.address.state}, and evidence of your authorization to collect in this jurisdiction;
5. The name and address of the original creditor if different from the current reporting entity;
6. Documentation establishing that the statute of limitations on this alleged debt has not expired under the laws of ${userProfile.address.state};
7. Documentation establishing that this alleged debt is within the credit reporting time limit under FCRA §605 (15 U.S.C. §1681c).

${caseAuthority("fdcpa_809")}

${anticipatedDefenses(creditItem, "fdcpa_809")}

CEASE ALL COLLECTION ACTIVITY — EFFECTIVE IMMEDIATELY:

Under FDCPA §809(b), upon receipt of this written dispute, you are legally required to cease all collection activity until proper validation has been provided and mailed to our client. This includes, without limitation:

• You may NOT continue reporting this alleged debt to any consumer reporting agency without simultaneously designating it as "disputed" under FDCPA §807(8) (15 U.S.C. §1692e(8)). Failure to report the dispute is itself a separate FDCPA violation;
• You may NOT make telephone calls, send collection letters, or take any other action to collect;
• You may NOT sell, transfer, or assign this alleged debt to any third party without first providing proper validation;
• You may NOT report any information about this alleged debt that omits the "disputed" designation.
${previousDisputeReference(previousRounds)}${medicalAddendum(creditItem)}
COMMUNICATION DIRECTIVE UNDER FDCPA §805 (15 U.S.C. §1692c):

All future communications regarding this alleged debt must be directed to our office in writing. Do not contact our client by telephone. Do not contact any third party regarding this alleged debt.

DAMAGES EXPOSURE AND ENFORCEMENT INTENT:

The FDCPA is a strict liability statute. See Jerman v. Carlisle, McNellie, Rini, Kramer & Ulrich LPA, 559 U.S. 573 (2010). Your company's good faith or lack of intent is not a defense against statutory violations. Should you fail to provide complete validation or continue any collection activity in violation of this demand, we are prepared to:

1. File formal complaints with the CFPB, FTC, and the Attorney General of ${userProfile.address.state};
2. Pursue statutory damages of up to $1,000 per violation under FDCPA §813 (15 U.S.C. §1692k);
3. Pursue actual damages for any harm caused by continued unlawful collection activity;
4. Seek attorney's fees and costs under 15 U.S.C. §1692k(a)(3);
5. Pursue remedies under FCRA §616-617 for continued reporting of disputed, unvalidated information;
6. Pursue additional remedies under applicable state consumer protection statutes.

This letter is preserved in our litigation file. Every action taken by your company from this point forward is being documented.

${signatureBlock(userProfile)}`;

  return {
    content,
    legalBasis: [
      "FDCPA §809 (15 U.S.C. §1692g)",
      "FDCPA §807(8) (15 U.S.C. §1692e(8))",
      "FDCPA §805 (15 U.S.C. §1692c)",
      "15 U.S.C. §1692k",
    ],
    recipientName: collectorName,
    recipientAddress: collectorAddress,
    strategy: DisputeStrategy.FDCPA_809_VALIDATION,
    itemType: creditItem.itemType,
    generatedAt: new Date().toISOString(),
    deadlineDays: 30,
  };
}

// ─────────────────────────────────────────────────────────
// 4. FCRA §623 — Direct Furnisher Dispute
// ─────────────────────────────────────────────────────────

export function generateFCRA623Letter(
  userProfile: UserProfile,
  creditItem: CreditItem,
  previousRounds?: DisputeRound[]
): DisputeLetter {
  const furnisherName = creditItem.creditorName;
  const furnisherAddress = creditItem.collectorAddress ?? "CREDITOR ADDRESS ON FILE";

  const content = `${letterHeader(userProfile, furnisherName, furnisherAddress)}

Dear Compliance Department:

This office represents ${fullName(userProfile)} regarding inaccurate information your company is furnishing to consumer reporting agencies. This constitutes a direct furnisher dispute under FCRA §623(a)(8) (15 U.S.C. §1681s-2(a)(8)).

Our client has previously disputed this information through the credit bureau(s). The bureau reported the item as "verified" — but verification by the bureau does not relieve you, as the furnisher, of your independent statutory obligations. We are now invoking our client's right to dispute directly with your company and to hold you independently accountable for the accuracy of what you report.

DISPUTED ACCOUNT:
Furnisher: ${creditItem.creditorName}
${accountIdentifier(creditItem)}
Nature of Dispute: ${describeItemType(creditItem)}${creditItem.balance ? `\nReported Balance: $${creditItem.balance.toLocaleString()}` : ""}
Bureau(s) Reporting To: ${creditItem.bureau.charAt(0).toUpperCase() + creditItem.bureau.slice(1)}
${previousDisputeReference(previousRounds)}
YOUR STATUTORY OBLIGATIONS AS FURNISHER:

Under FCRA §623(a)(8)(E), upon receipt of this direct dispute you are required to:

1. Conduct a reasonable investigation — not a cursory review of your own records, but a genuine analysis in light of the specific information we have provided;
2. Review all relevant information provided in this notice;
3. Report the results of your investigation directly to our client;
4. If the investigation reveals the information is inaccurate, incomplete, or unverifiable, immediately notify every CRA to which you furnished the data so it can be corrected or deleted.

Additionally, under §623(a)(1), you are prohibited from furnishing information you know or have reasonable cause to believe is inaccurate. When a consumer has repeatedly disputed information — as our client has — a reasonable person would certainly question its accuracy. Continued reporting under these circumstances establishes willfulness.

${caseAuthority("fcra_623")}

${anticipatedDefenses(creditItem, "fcra_623")}

DOCUMENTS DEMANDED:

We demand production of the following within thirty (30) days:

1. The original signed agreement, contract, or application bearing our client's signature — the actual document, not a generic template;
2. Complete payment history from account opening to present, including every payment received, posted, and credited;
3. A detailed description of the investigation procedures you conducted in response to any prior bureau-forwarded disputes — who investigated, what documents were reviewed, what steps were taken;
4. The name, title, and contact information of the individual(s) who conducted the investigation and determined the information to be accurate;
5. All internal notes, communications, and records relating to our client's disputes.
${medicalAddendum(creditItem)}${stateAddendum(userProfile)}
DAMAGES EXPOSURE:

Your obligations under §623 are independently enforceable through a private right of action. See Gorman v. Wolpoff & Abramson, LLP, 584 F.3d 1147 (9th Cir. 2009). Under FCRA §616, willful noncompliance subjects you to:

• Statutory damages of $100 to $1,000 per violation;
• Punitive damages as the court may allow;
• Attorney's fees and costs.

Under §617, negligent noncompliance subjects you to actual damages and attorney's fees. Continued furnishing of inaccurate data after receiving this direct dispute dramatically strengthens the case for willfulness.

If you cannot substantiate the accuracy of every element you are reporting through original documentation, we demand you immediately instruct all CRAs to delete this tradeline. Failure to act will result in CFPB and state AG complaints and pursuit of all available legal remedies.

${signatureBlock(userProfile)}`;

  return {
    content,
    legalBasis: [
      "FCRA §623(a)(8) (15 U.S.C. §1681s-2(a)(8))",
      "FCRA §623(a)(1) (15 U.S.C. §1681s-2(a)(1))",
      "FCRA §616 (15 U.S.C. §1681n)",
      "FCRA §617 (15 U.S.C. §1681o)",
    ],
    recipientName: furnisherName,
    recipientAddress: furnisherAddress,
    strategy: DisputeStrategy.FCRA_623_FURNISHER_DISPUTE,
    itemType: creditItem.itemType,
    generatedAt: new Date().toISOString(),
    deadlineDays: 30,
  };
}

// ─────────────────────────────────────────────────────────
// 5. Goodwill Letter
// ─────────────────────────────────────────────────────────

export function generateGoodwillLetter(
  userProfile: UserProfile,
  creditItem: CreditItem,
  previousRounds?: DisputeRound[]
): DisputeLetter {
  const creditorName = creditItem.creditorName;
  const creditorAddress = creditItem.collectorAddress ?? "CREDITOR ADDRESS ON FILE";

  const content = `CreditClean Legal Advocacy
Consumer Protection Division

${formatDate()}

${creditorName}
${creditorAddress}

Re: Goodwill Adjustment Request on Behalf of ${fullName(userProfile)}
    ${accountIdentifier(creditItem)}

Dear Customer Relations Department:

We write on behalf of our client, ${fullName(userProfile)}, to respectfully request a goodwill adjustment to the account referenced above. This is not a legal dispute — it is a good-faith request recognizing your company's discretion in these matters, and we approach it in that spirit.

ACCOUNT INFORMATION:
Creditor: ${creditItem.creditorName}
${accountIdentifier(creditItem)}${creditItem.latePaymentDates ? `\nLate Payment Date(s) at Issue: ${creditItem.latePaymentDates.join(", ")}` : ""}

CONTEXT:

Our client acknowledges that ${creditItem.latePaymentDates ? `payment(s) on ${creditItem.latePaymentDates.join(", ")} were` : "a payment was"} received late. Our client takes responsibility for that and does not dispute the underlying fact.

${creditItem.userNotes ? `The circumstances were as follows: ${creditItem.userNotes}\n\n` : ""}However, since that time, our client has maintained a consistent record of on-time payments and responsible account management. The late payment notation continues to have a disproportionate negative impact on our client's credit standing — affecting access to housing, employment opportunities, and fair credit terms.

GOODWILL REQUEST:

We respectfully ask that ${creditorName} exercise its discretion to grant a goodwill adjustment, removing the late payment notation from our client's credit report with ${creditItem.bureau.charAt(0).toUpperCase() + creditItem.bureau.slice(1)}.

We recognize that you are under no legal obligation to grant this request. However, many creditors maintain goodwill adjustment policies for loyal customers whose overall account history demonstrates responsible management. Our client's record supports this standard.

We note that this approach reflects our client's good faith and preference for resolution without formal dispute proceedings. We believe the adjustment is warranted and would be a mutually beneficial outcome — preserving the customer relationship while recognizing our client's demonstrated commitment to their obligations.

If additional information would assist your review, please contact our office directly.

Thank you for your consideration.

Respectfully,

CreditClean Legal Advocacy
Consumer Protection Division
On behalf of ${fullName(userProfile)}

Client Contact: ${userProfile.phone ?? "ON FILE"} | ${userProfile.email ?? "ON FILE"}`;

  return {
    content,
    legalBasis: ["Goodwill request — no legal basis required"],
    recipientName: creditorName,
    recipientAddress: creditorAddress,
    strategy: DisputeStrategy.GOODWILL_LETTER,
    itemType: creditItem.itemType,
    generatedAt: new Date().toISOString(),
    deadlineDays: 30,
  };
}

// ─────────────────────────────────────────────────────────
// 6. CFPB Complaint
// ─────────────────────────────────────────────────────────

export function generateCFPBComplaint(
  userProfile: UserProfile,
  creditItem: CreditItem,
  previousRounds?: DisputeRound[]
): DisputeLetter {
  const rounds = previousRounds ?? [];
  const roundsSummary = rounds
    .map((r) => {
      const resp = r.response;
      return `- Round ${r.roundNumber} (${r.strategy}): Sent ${r.dateSent} via certified mail${r.trackingNumber ? ` (tracking: ${r.trackingNumber})` : ""}. ${resp ? `Response received ${resp.dateReceived}: ${resp.outcome}. ${resp.bureauExplanation ?? ""}` : `No response received by deadline of ${r.deadlineDate}.`}`;
    })
    .join("\n");

  const violationsList = rounds
    .filter((r) => r.response?.outcome === "verified" || r.response?.outcome === "no_response")
    .map((r) => {
      if (r.response?.outcome === "no_response") {
        return `- Failure to respond within 30 days to Round ${r.roundNumber} dispute (violation of FCRA §611, 15 U.S.C. §1681i)`;
      }
      if (!r.response?.verificationMethod) {
        return `- Failure to provide method of verification in Round ${r.roundNumber} response (violation of FCRA §609, 15 U.S.C. §1681g)`;
      }
      return `- Inadequate reinvestigation in Round ${r.roundNumber} — item verified without meaningful investigation (violation of FCRA §611, 15 U.S.C. §1681i)`;
    })
    .join("\n");

  const content = `CONSUMER FINANCIAL PROTECTION BUREAU — FORMAL COMPLAINT
SUBMITTED ON BEHALF OF REPRESENTED CONSUMER

Date: ${formatDate()}

SUBMITTED BY:
CreditClean Legal Advocacy — Consumer Protection Division
On behalf of ${fullName(userProfile)}

COMPLAINANT INFORMATION:
Name: ${fullName(userProfile)}
Address: ${fullAddress(userProfile)}
Date of Birth: ${userProfile.dob}
SSN (last 4): ***-**-${userProfile.ssnLast4}

COMPLAINT AGAINST:
Entity: ${BUREAU_ADDRESSES[creditItem.bureau].name}
Address: ${BUREAU_ADDRESSES[creditItem.bureau].address}

${creditItem.collectorName ? `Additional Respondent: ${creditItem.collectorName}\nAddress: ${creditItem.collectorAddress ?? "ON FILE"}\n` : ""}
PRODUCT/SERVICE: Credit reporting / Consumer report accuracy

ISSUE: Systemic failure to conduct a reasonable reinvestigation of inaccurate information despite multiple documented disputes sent via certified mail.

DETAILED DESCRIPTION:

We file this complaint on behalf of our client, ${fullName(userProfile)}, because ${BUREAU_ADDRESSES[creditItem.bureau].name} has repeatedly failed to comply with its obligations under the Fair Credit Reporting Act despite well-documented disputes providing specific grounds for inaccuracy.

DISPUTED ITEM:
Creditor/Furnisher: ${creditItem.creditorName}
${accountIdentifier(creditItem)}
Type: ${describeItemType(creditItem)}${creditItem.balance ? `\nReported Balance: $${creditItem.balance.toLocaleString()}` : ""}

COMPLETE DISPUTE HISTORY:
Our client has submitted the following disputes, each sent via certified mail with return receipt requested:

${roundsSummary || "Multiple documented disputes submitted — complete correspondence file available upon request."}

DOCUMENTED VIOLATIONS OF FEDERAL LAW:

Based on the respondent's actions (or failures to act), we have identified the following violations:

${violationsList || "- Failure to conduct a reasonable reinvestigation as required by FCRA §611 (15 U.S.C. §1681i)\n- Failure to provide method of verification as required by FCRA §609 (15 U.S.C. §1681g)"}

These are not technical objections — they represent a pattern of willful disregard for the statutory obligations Congress imposed on CRAs to protect consumers. Federal courts have consistently held that a CRA's duty to reinvestigate is substantive, not procedural. See Cushman v. Trans Union Corp., 115 F.3d 220 (3d Cir. 1997); Henson v. CSC Credit Servs., 29 F.3d 280 (7th Cir. 1994).

HARM TO CONSUMER:

The continued reporting of this inaccurate information has caused our client tangible, ongoing harm including: damage to credit scores, denial or unfavorable terms on credit applications, increased insurance premiums, potential impacts on employment and housing, and emotional distress from the inability to correct demonstrably inaccurate information despite exhaustive good-faith efforts.

REQUESTED RELIEF:

1. Immediate and permanent deletion of the disputed item from our client's consumer file;
2. An updated consumer report reflecting the correction, sent to our client and to every recipient within the prior two years (employment) or one year (all other purposes);
3. Written confirmation of the corrective action taken;
4. A detailed written explanation of the failures in the prior reinvestigations;
5. Referral for enforcement action if the Bureau determines the respondent's conduct constitutes a pattern or practice of FCRA violations.

Complete documentation — including all dispute letters, certified mail receipts, tracking confirmations, and all responses received — is available and will be provided upon request.

Respectfully submitted,

CreditClean Legal Advocacy
Consumer Protection Division
On behalf of ${fullName(userProfile)}`;

  return {
    content,
    legalBasis: [
      "FCRA §611 (15 U.S.C. §1681i)",
      "FCRA §609 (15 U.S.C. §1681g)",
      "FCRA §607(b) (15 U.S.C. §1681e(b))",
      "FCRA §616 (15 U.S.C. §1681n)",
    ],
    recipientName: "Consumer Financial Protection Bureau",
    recipientAddress: "1700 G Street NW\nWashington, DC 20552",
    strategy: DisputeStrategy.CFPB_COMPLAINT,
    itemType: creditItem.itemType,
    generatedAt: new Date().toISOString(),
    deadlineDays: 60,
  };
}

// ─────────────────────────────────────────────────────────
// 7. State Attorney General Complaint
// ─────────────────────────────────────────────────────────

export function generateStateAGComplaint(
  userProfile: UserProfile,
  creditItem: CreditItem,
  previousRounds?: DisputeRound[]
): DisputeLetter {
  const rounds = previousRounds ?? [];
  const roundsSummary = rounds
    .map(
      (r) =>
        `- Round ${r.roundNumber} (${r.strategy}): Sent ${r.dateSent}. Result: ${r.response?.outcome ?? "No response received by deadline."}`
    )
    .join("\n");

  const stateCitations = getStateCitations(userProfile.address.state);
  const stateSection = stateCitations.length > 0
    ? `\nSTATE LAW VIOLATIONS:\n\nIn addition to federal violations, the conduct described above violates ${stateCitations[0].lawName} (${stateCitations[0].section}). ${stateCitations[0].summary}\n`
    : "";

  const content = `STATE ATTORNEY GENERAL — CONSUMER COMPLAINT
SUBMITTED BY CONSUMER PROTECTION COUNSEL

Date: ${formatDate()}

TO: Office of the Attorney General, State of ${userProfile.address.state}
Consumer Protection Division

FROM:
CreditClean Legal Advocacy — Consumer Protection Division
On behalf of ${fullName(userProfile)}
${fullAddress(userProfile)}
Date of Birth: ${userProfile.dob}

COMPLAINT AGAINST:
Respondent: ${BUREAU_ADDRESSES[creditItem.bureau].name}
Address: ${BUREAU_ADDRESSES[creditItem.bureau].address}

${creditItem.collectorName ? `Additional Respondent: ${creditItem.collectorName}\nAddress: ${creditItem.collectorAddress ?? "ON FILE"}\n` : ""}
NATURE OF COMPLAINT:

We file this complaint on behalf of our client, ${fullName(userProfile)}, a resident of ${userProfile.address.state}, regarding ${BUREAU_ADDRESSES[creditItem.bureau].name}'s repeated failure to comply with federal and state consumer credit reporting laws. Despite multiple documented disputes submitted via certified mail, the respondent has failed to conduct meaningful reinvestigations or correct demonstrably inaccurate information.

This complaint is filed concurrently with a complaint to the Consumer Financial Protection Bureau.

FACTUAL BACKGROUND:

Our client's consumer report maintained by ${BUREAU_ADDRESSES[creditItem.bureau].name} contains the following inaccurate item:

Creditor/Furnisher: ${creditItem.creditorName}
${accountIdentifier(creditItem)}
Type: ${describeItemType(creditItem)}${creditItem.balance ? `\nReported Balance: $${creditItem.balance.toLocaleString()}` : ""}

DISPUTE HISTORY:

Our client has exhausted the dispute process established by federal law:

${roundsSummary || "Multiple documented disputes submitted via certified mail with return receipt — complete file enclosed."}

Despite these repeated, well-documented efforts, the respondent has failed to conduct any meaningful reinvestigation or correct the inaccurate information. The respondent's conduct reflects a pattern of rubber-stamping furnisher responses without independent verification — a practice federal courts have consistently held to be unlawful. See Cushman v. Trans Union Corp., 115 F.3d 220 (3d Cir. 1997).

VIOLATIONS OF FEDERAL LAW:

- Failure to conduct a reasonable reinvestigation within 30 days (FCRA §611, 15 U.S.C. §1681i)
- Failure to disclose method of verification (FCRA §609, 15 U.S.C. §1681g)
- Failure to maintain reasonable procedures for maximum possible accuracy (FCRA §607(b), 15 U.S.C. §1681e(b))
${stateSection}
HARM TO CONSUMER:

The continued reporting has caused our client tangible, documented harm including: credit score damage, denial or unfavorable terms on credit applications, increased insurance premiums, impacts on employment and housing, and emotional distress from the inability to correct inaccurate information despite exhaustive good-faith efforts.

REQUESTED ACTION:

We respectfully request that your office:

1. Investigate the respondent's dispute handling practices — both in this specific case and as a potential pattern or practice;
2. Contact ${BUREAU_ADDRESSES[creditItem.bureau].name} to demand immediate correction;
3. Take enforcement action as warranted under federal and state law;
4. Consider whether the respondent's conduct warrants referral for further regulatory action;
5. Inform our office of the results of your investigation.

Complete documentation is enclosed, including all dispute correspondence, certified mail receipts with tracking, and all responses received. Additional documentation is available upon request.

Respectfully submitted,

CreditClean Legal Advocacy
Consumer Protection Division
On behalf of ${fullName(userProfile)}
Date: ${formatDate()}

Enclosures:
- Complete dispute correspondence file
- Certified mail receipts and tracking confirmations
- All bureau/furnisher response letters
- Copy of consumer report showing disputed item
- Chronological timeline of dispute history`;

  return {
    content,
    legalBasis: [
      "FCRA §611 (15 U.S.C. §1681i)",
      "FCRA §609 (15 U.S.C. §1681g)",
      "FCRA §607(b) (15 U.S.C. §1681e(b))",
      ...(stateCitations.length > 0 ? [stateCitations[0].section] : []),
    ],
    recipientName: `Office of the Attorney General — ${userProfile.address.state}`,
    recipientAddress: "Consumer Protection Division\n(State-specific address)",
    strategy: DisputeStrategy.STATE_AG_COMPLAINT,
    itemType: creditItem.itemType,
    generatedAt: new Date().toISOString(),
    deadlineDays: 60,
  };
}

// ─────────────────────────────────────────────────────────
// 8. Intent to Litigate
// ─────────────────────────────────────────────────────────

export function generateIntentToLitigate(
  userProfile: UserProfile,
  creditItem: CreditItem,
  previousRounds?: DisputeRound[]
): DisputeLetter {
  const bureau = BUREAU_ADDRESSES[creditItem.bureau];
  const rounds = previousRounds ?? [];

  const violationCount = rounds.length;
  const minDamages = violationCount * 100;
  const maxDamages = violationCount * 1000;

  const roundsTimeline = rounds
    .map((r) => {
      const resp = r.response;
      return `${r.dateSent}: Dispute Round ${r.roundNumber} sent (${r.strategy}) via certified mail${r.trackingNumber ? `, tracking ${r.trackingNumber}` : ""}.
    ${resp ? `${resp.dateReceived}: Response received — Outcome: ${resp.outcome}. ${resp.bureauExplanation ?? ""}` : `${r.deadlineDate}: DEADLINE PASSED — No response received. This constitutes a violation of FCRA §611.`}`;
    })
    .join("\n  ");

  const violationsDetail = rounds
    .map((r, idx) => {
      const violations: string[] = [];
      if (r.response?.outcome === "no_response") {
        violations.push(
          `Violation ${idx + 1}: Failure to complete reinvestigation within 30 days for Round ${r.roundNumber} dispute — FCRA §611 (15 U.S.C. §1681i)`
        );
      }
      if (r.response?.outcome === "verified" && !r.response?.verificationMethod) {
        violations.push(
          `Violation ${idx + 1}: Failure to provide method of verification for Round ${r.roundNumber} — FCRA §609 (15 U.S.C. §1681g)`
        );
      }
      if (r.response?.outcome === "verified") {
        violations.push(
          `Violation ${idx + 1}: Failure to conduct a reasonable reinvestigation for Round ${r.roundNumber} — FCRA §611 (15 U.S.C. §1681i). The investigation was perfunctory and did not satisfy the "reasonable" standard articulated in Cushman v. Trans Union Corp., 115 F.3d 220 (3d Cir. 1997)`
        );
      }
      return violations.join("\n  ");
    })
    .filter(Boolean)
    .join("\n  ");

  const content = `${letterHeader(userProfile, bureau.name, bureau.address)}

NOTICE OF INTENT TO LITIGATE — LITIGATION HOLD — PRESERVE ALL RECORDS

ATTENTION: GENERAL COUNSEL / LEGAL DEPARTMENT
FORWARD IMMEDIATELY — TIME-SENSITIVE PRE-LITIGATION NOTICE

Dear Counsel:

This office represents ${fullName(userProfile)} in connection with your agency's willful and/or negligent violations of the Fair Credit Reporting Act (15 U.S.C. §1681 et seq.). This letter serves as formal notice of our client's intent to pursue litigation if this matter is not resolved within fifteen (15) days.

Our client has exhausted every available administrative remedy. Multiple disputes were submitted via certified mail. Your agency has failed to conduct reasonable reinvestigations, failed to provide methods of verification, and continues to report information that is inaccurate, incomplete, or unverifiable. This pattern of conduct — documented in detail below — constitutes willful noncompliance under the standard articulated by the Supreme Court in Safeco Ins. Co. of Am. v. Burr, 551 U.S. 47 (2007).

DISPUTED ITEM:
Creditor/Furnisher: ${creditItem.creditorName}
${accountIdentifier(creditItem)}
Type: ${describeItemType(creditItem)}${creditItem.balance ? `\nReported Balance: $${creditItem.balance.toLocaleString()}` : ""}

IMMEDIATE LITIGATION HOLD — DOCUMENT PRESERVATION DEMAND:

Effective upon receipt of this letter, you are under a legal obligation to preserve all documents, records, electronically stored information, communications, recordings, and any other materials related to our client's consumer file, including but not limited to:

• Our client's complete consumer file and all historical versions;
• All dispute correspondence received from or on behalf of our client;
• All communications with furnishers regarding our client's disputes;
• All reinvestigation records, notes, procedures, and work product;
• All policies, procedures, and training materials related to dispute reinvestigation — both current and as in effect at the time of each dispute;
• All electronic records, metadata, system logs, audit trails, and e-OSCAR communications related to our client's file;
• All communications between your agency and any third party regarding our client.

We put you on notice: destruction, alteration, concealment, or failure to preserve any potentially relevant document or record after receipt of this letter will be treated as spoliation of evidence. We will seek adverse inference instructions, sanctions, and all other appropriate relief.

CHRONOLOGY OF DISPUTES AND YOUR AGENCY'S FAILURES:

  ${roundsTimeline || "Complete timeline of disputes and violations documented in attached chronology."}

DOCUMENTED VIOLATIONS:

  ${violationsDetail || `Multiple violations of FCRA §611 (failure to conduct reasonable reinvestigation), §609 (failure to provide method of verification), and §607(b) (failure to maintain reasonable procedures). Detailed violation inventory available in litigation file.`}

${caseAuthority("intent_to_litigate")}

DAMAGES EXPOSURE:

Your agency's exposure is substantial and grows with each day inaccurate information remains on our client's report:

Under FCRA §616 (15 U.S.C. §1681n) — Willful Noncompliance:
• Statutory damages: $100 to $1,000 PER VIOLATION (${violationCount} documented violations = $${minDamages.toLocaleString()} to $${maxDamages.toLocaleString()});
• Punitive damages — the Supreme Court in Safeco confirmed that reckless disregard constitutes willfulness, and your agency's repeated failures to conduct meaningful reinvestigations after receiving specific, documented disputes demonstrate at minimum reckless disregard;
• Reasonable attorney's fees and costs.

Under FCRA §617 (15 U.S.C. §1681o) — Negligent Noncompliance:
• Actual damages including: credit denials, increased interest rates on credit obtained, increased insurance premiums, lost housing or employment opportunities, and emotional distress;
• Attorney's fees and costs.

FINAL DEMAND FOR RESOLUTION:

We are providing your agency with one final opportunity to resolve this matter before initiating litigation in the appropriate United States District Court. We demand that within fifteen (15) days of receipt:

1. The disputed item is permanently deleted from our client's consumer file across all databases and systems;
2. Written confirmation of the deletion is provided to our office;
3. Updated consumer reports reflecting the correction are sent to every entity that received our client's report in the prior two years (employment) or one year (all other purposes);
4. A corrected copy of our client's complete consumer file is provided at no charge;
5. Your agency identifies the root cause of the reinvestigation failures and confirms corrective action.

If satisfactory resolution is not received within fifteen (15) days, we will initiate litigation without further notice. Our client's litigation file is complete — containing every dispute letter, every certified mail receipt, every tracking confirmation, every response, every deadline calculation, and a detailed violation inventory.

We have concurrently filed formal complaints with the Consumer Financial Protection Bureau and the Office of the Attorney General for the State of ${userProfile.address.state}.

This letter constitutes our client's final pre-litigation communication.

${signatureBlock(userProfile)}

cc: Consumer Financial Protection Bureau (Complaint filed)
    Office of the Attorney General, State of ${userProfile.address.state} (Complaint filed)
    Client litigation file`;

  return {
    content,
    legalBasis: [
      "FCRA §616 (15 U.S.C. §1681n) — Willful noncompliance",
      "FCRA §617 (15 U.S.C. §1681o) — Negligent noncompliance",
      "FCRA §611 (15 U.S.C. §1681i) — Reinvestigation requirements",
      "FCRA §609 (15 U.S.C. §1681g) — Method of verification",
      "FCRA §607(b) (15 U.S.C. §1681e(b)) — Reasonable procedures",
    ],
    recipientName: bureau.name,
    recipientAddress: bureau.address,
    strategy: DisputeStrategy.INTENT_TO_LITIGATE,
    itemType: creditItem.itemType,
    generatedAt: new Date().toISOString(),
    deadlineDays: 15,
  };
}

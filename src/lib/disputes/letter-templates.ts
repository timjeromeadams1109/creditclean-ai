// CreditClean AI — Dispute Letter Templates
// Legally-grounded letter generation functions for each dispute strategy.

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
  return `${fullName(user)}
${fullAddress(user)}

${formatDate()}

${recipientName}
${recipientAddress}

Re: Dispute of Inaccurate Information — Account ending in ${user.ssnLast4 ? `(SSN last 4: ${user.ssnLast4})` : ""}
`;
}

function signatureBlock(user: UserProfile): string {
  return `Sincerely,


____________________________________
${fullName(user)}
Date of Birth: ${user.dob}
SSN (last 4): ***-**-${user.ssnLast4}

Enclosures:
- Copy of government-issued photo identification
- Copy of proof of address (utility bill or bank statement)
- Copy of Social Security card (optional)

SENT VIA CERTIFIED MAIL, RETURN RECEIPT REQUESTED`;
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
        `Round ${r.roundNumber} (${r.strategy}, sent ${r.dateSent}): ${r.response?.outcome ?? "No response received"}`
    )
    .join("\n  - ");

  return `
For your records, I have previously disputed this item as follows:
  - ${rounds}

Despite these prior disputes, this inaccurate information continues to appear on my credit report. Your continued reporting of unverifiable information constitutes a pattern of noncompliance with federal consumer protection law.
`;
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

I am writing to formally dispute the following item appearing on my credit report, which I believe to be inaccurate, incomplete, or unverifiable, in accordance with my rights under the Fair Credit Reporting Act, §611 (15 U.S.C. §1681i).

DISPUTED ITEM:
Creditor/Furnisher: ${creditItem.creditorName}
${accountIdentifier(creditItem)}
Type of Item: ${describeItemType(creditItem)}${creditItem.balance ? `\nReported Balance: $${creditItem.balance.toLocaleString()}` : ""}${creditItem.dateReported ? `\nDate Reported: ${creditItem.dateReported}` : ""}${creditItem.status ? `\nReported Status: ${creditItem.status}` : ""}

REASON FOR DISPUTE:

${creditItem.itemType === ItemType.LATE_PAYMENT ? `The late payment(s) reported on this account are inaccurate. I maintain that I was not late on the date(s) reported, or that the reported delinquency does not accurately reflect the payment history of this account. I demand that you conduct a reasonable investigation — not merely a cursory review of the furnisher's automated response — to verify the accuracy of the reported payment history.${creditItem.latePaymentDates ? `\n\nSpecifically, I dispute the following reported late payment date(s): ${creditItem.latePaymentDates.join(", ")}.` : ""}` : ""}${creditItem.itemType === ItemType.COLLECTION ? `This collection account is disputed. I do not acknowledge this debt as valid. The reported balance, dates, and account information may be inaccurate, and I have reason to believe that the collecting entity may not have proper documentation to substantiate this claim. I demand a thorough investigation — not a perfunctory automated verification — into the accuracy and completeness of all information being reported.` : ""}${creditItem.itemType === ItemType.CHARGE_OFF ? `This charge-off is disputed as inaccurate. The reported balance, dates, and/or status do not accurately reflect the history of this account. I demand a reasonable investigation into the accuracy of all information being reported regarding this account, including the reported balance, date of first delinquency, and current status.` : ""}${creditItem.itemType === ItemType.INQUIRY ? `This inquiry was not authorized by me. I did not apply for credit with ${creditItem.inquiryCreditor ?? creditItem.creditorName}, nor did I provide written consent for them to access my credit report. Under FCRA §604 (15 U.S.C. §1681b), a consumer report may only be obtained for a permissible purpose. An inquiry without permissible purpose must be removed. I demand that you investigate this inquiry and remove it from my credit report immediately.` : ""}${creditItem.itemType === ItemType.REPOSSESSION || creditItem.itemType === ItemType.FORECLOSURE ? `This ${creditItem.itemType === ItemType.REPOSSESSION ? "repossession" : "foreclosure"} is reported inaccurately. The reported dates, balances, and/or status do not accurately reflect the circumstances of this account. I demand a thorough investigation into every element of the reported information, including whether proper legal procedures were followed and whether the reported deficiency balance (if any) is accurate.` : ""}${creditItem.itemType === ItemType.BANKRUPTCY || creditItem.itemType === ItemType.JUDGMENT || creditItem.itemType === ItemType.TAX_LIEN ? `This public record is reported inaccurately. I demand that you verify the accuracy of all reported details, including dates, amounts, court information, and current status, using original public records — not merely the furnisher's internal records.` : ""}${creditItem.itemType === ItemType.MEDICAL_DEBT ? `This medical debt is disputed. I do not acknowledge this debt as valid. In addition to the inaccuracies in the reported information, medical debts are subject to special protections under HIPAA and recent CFPB/bureau policy changes.` : ""}${creditItem.itemType === ItemType.STUDENT_LOAN ? `This student loan account is reported inaccurately. The reported balance, payment history, status, and/or dates do not accurately reflect the actual status of this account. I demand a thorough investigation using original loan documentation, not merely a parroting of the servicer's automated data.` : ""}${creditItem.itemType === ItemType.OTHER ? `This item is inaccurate, incomplete, or unverifiable. I demand a thorough investigation into all elements of the reported information.` : ""}

${creditItem.userNotes ? `Additional information: ${creditItem.userNotes}\n` : ""}LEGAL BASIS AND REQUIREMENTS:

Under FCRA §611 (15 U.S.C. §1681i), upon receipt of this dispute, you are required to:

1. Conduct a reasonable reinvestigation to determine whether the disputed information is inaccurate, incomplete, or unverifiable — within thirty (30) days of receipt of this notice;
2. Forward all relevant information I have submitted to the furnisher of this information within five (5) business days;
3. Provide me with written notice of the results of your reinvestigation, including: (a) a statement that the reinvestigation is completed; (b) a revised credit report if changes were made; (c) notice of my right to add a consumer statement; and (d) notice of my right to request that you send corrected reports to anyone who received my report in the prior two years for employment purposes, or one year for all other purposes;
4. If the information cannot be verified by the furnisher, you must promptly delete it from my file.

I emphasize that a "reasonable reinvestigation" requires more than simply forwarding my dispute to the furnisher and accepting their automated response. The Fair Trade Commission and federal courts have consistently held that a CRA's investigation must be genuinely meaningful. See Cushman v. Trans Union Corp., 115 F.3d 220 (3d Cir. 1997); Johnson v. MBNA America Bank, 357 F.3d 426 (4th Cir. 2004).
${previousDisputeReference(previousRounds)}${medicalAddendum(creditItem)}${stateAddendum(userProfile)}
CONSEQUENCES OF NON-COMPLIANCE:

Should you fail to conduct a proper reinvestigation within the statutory thirty (30) day period, or should you continue to report information that is inaccurate, incomplete, or unverifiable, I reserve all rights under FCRA §616 (15 U.S.C. §1681n) and §617 (15 U.S.C. §1681o), including the right to seek statutory damages of $100 to $1,000 per violation for willful noncompliance, actual damages, punitive damages, and attorney's fees and costs. I will also file a formal complaint with the Consumer Financial Protection Bureau (CFPB) and my state attorney general.

Please investigate this matter promptly and provide me with your findings in writing.

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

I am writing pursuant to my rights under the Fair Credit Reporting Act, §609(a)(1) (15 U.S.C. §1681g), to demand disclosure of the method of verification used during your reinvestigation of the following disputed item on my credit report.

DISPUTED ITEM:
Creditor/Furnisher: ${creditItem.creditorName}
${accountIdentifier(creditItem)}
Type of Item: ${describeItemType(creditItem)}${creditItem.balance ? `\nReported Balance: $${creditItem.balance.toLocaleString()}` : ""}
${previousDisputeReference(previousRounds)}
REQUEST FOR METHOD OF VERIFICATION:

I previously submitted a dispute regarding this item, and your office responded by stating that the information was "verified" as accurate. However, you failed to disclose the specific method of verification used to reach this conclusion.

Under FCRA §609(a)(1) (15 U.S.C. §1681g), I am entitled to know the specific procedure and method used to determine that this information is accurate. A generic statement that the item was "verified" does not satisfy this requirement. I am specifically requesting:

1. The name, address, and telephone number of every person contacted in connection with the reinvestigation of this item;
2. The specific documents reviewed during the reinvestigation;
3. A description of the reinvestigation procedures followed, including what steps were taken beyond forwarding the dispute to the furnisher;
4. A copy of any documentation provided by the furnisher in response to your reinvestigation notice;
5. The business name, address, and telephone number of the furnisher that verified this information.

If you are unable to provide the method of verification, this item is by definition unverifiable and must be immediately deleted from my credit report pursuant to FCRA §611(a)(5)(A) (15 U.S.C. §1681i(a)(5)(A)), which requires deletion of information that cannot be verified.

I remind you that under FCRA §611(a)(7) (15 U.S.C. §1681i(a)(7)), a reinvestigation is deemed frivolous or irrelevant only if it is substantially the same as a dispute previously submitted by the consumer and has been previously investigated — and even then, you must notify me within 5 business days and provide the reasons for your determination and the information needed for the dispute to not be frivolous. You may not simply ignore or rubber-stamp repeated disputes when new information or a different legal basis is provided.
${medicalAddendum(creditItem)}${stateAddendum(userProfile)}
CONSEQUENCES OF NON-COMPLIANCE:

Failure to provide the method of verification within thirty (30) days constitutes willful noncompliance with FCRA §609 (15 U.S.C. §1681g). Under FCRA §616 (15 U.S.C. §1681n), I may recover statutory damages of $100 to $1,000 per violation, plus punitive damages and reasonable attorney's fees. Under §617 (15 U.S.C. §1681o), I may recover actual damages and attorney's fees for negligent noncompliance.

If you are unable to verify this item through documented, specific procedures, I demand its immediate deletion. Should you fail to comply, I will file formal complaints with the Consumer Financial Protection Bureau and my state attorney general, and I will pursue all available legal remedies.

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

I am writing in response to your communication regarding an alleged debt. This letter is a formal dispute and demand for validation of the alleged debt, made pursuant to my rights under the Fair Debt Collection Practices Act, §809 (15 U.S.C. §1692g).

ALLEGED DEBT:
Creditor Name: ${creditItem.creditorName}
${creditItem.collectorName ? `Collection Agency: ${creditItem.collectorName}` : ""}
${accountIdentifier(creditItem)}${creditItem.balance ? `\nAlleged Balance: $${creditItem.balance.toLocaleString()}` : ""}${creditItem.originalBalance ? `\nOriginal Balance: $${creditItem.originalBalance.toLocaleString()}` : ""}

FORMAL DISPUTE AND DEMAND FOR VALIDATION:

I dispute this alleged debt in its entirety. I do not acknowledge that I owe this debt, and I exercise my right under FDCPA §809(b) (15 U.S.C. §1692g(b)) to demand that you provide complete validation before taking any further collection action. Specifically, I demand that you provide the following:

1. A copy of the original signed agreement, contract, or application bearing my signature that creates the obligation to pay this alleged debt;
2. A complete and itemized accounting of the alleged debt, including: the original principal amount, all interest charged (with applicable rate and method of calculation), all fees and charges added, all payments and credits applied, and an explanation of how the current balance was calculated;
3. Proof that your company owns this debt or is authorized to collect it, including a complete chain of assignment/sale documentation from the original creditor to your company;
4. A copy of your state license or registration to collect debts in the state of ${userProfile.address.state}, and proof that you are authorized to collect in this jurisdiction;
5. The name and address of the original creditor, if different from the entity currently reporting;
6. Proof that the statute of limitations on this alleged debt has not expired under the laws of ${userProfile.address.state};
7. Proof that this debt is within the applicable credit reporting time limit under FCRA §605 (15 U.S.C. §1681c).

LEGAL NOTICE — CEASE COLLECTION PENDING VALIDATION:

Under FDCPA §809(b) (15 U.S.C. §1692g(b)), upon receipt of this written dispute, you must cease all collection activity on this alleged debt until you have provided proper validation and mailed it to me. This includes, but is not limited to:

- You may NOT continue to report this debt to any consumer reporting agency, or if you do, you must simultaneously report it as "disputed" pursuant to FDCPA §807(8) (15 U.S.C. §1692e(8));
- You may NOT make any further telephone calls, send letters, or take any other action to collect this alleged debt;
- You may NOT sell, transfer, or assign this alleged debt to any other entity without first providing the required validation to me.

Any attempt to collect on this alleged debt without first providing proper validation constitutes a violation of the FDCPA and will be treated as such.
${previousDisputeReference(previousRounds)}${medicalAddendum(creditItem)}
ADDITIONAL NOTICE UNDER FDCPA §805 (15 U.S.C. §1692c):

All future communications regarding this alleged debt must be directed to me in writing at the address above. Do not contact me by telephone. Do not contact any third party regarding this alleged debt.

CONSEQUENCES OF NON-COMPLIANCE:

Should you fail to provide complete validation and continue collection activity, I will:
1. File a complaint with the Consumer Financial Protection Bureau (CFPB);
2. File a complaint with the Federal Trade Commission (FTC);
3. File a complaint with the attorney general of ${userProfile.address.state};
4. Pursue all available remedies under the FDCPA, including statutory damages of up to $1,000 per violation (15 U.S.C. §1692k), actual damages, and attorney's fees and costs;
5. Pursue remedies under FCRA §616-617 (15 U.S.C. §1681n-o) for continued reporting of disputed, unvalidated information.

This letter is not an acknowledgment of the alleged debt, and nothing herein should be construed as a promise to pay. This letter is sent for the sole purpose of exercising my rights under federal law.

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

I am writing to formally dispute information that your company is furnishing to consumer reporting agencies regarding my account. This dispute is made directly to you as the furnisher of information, pursuant to my rights under the Fair Credit Reporting Act, §623(a)(8) (15 U.S.C. §1681s-2(a)(8)), which provides consumers with the right to dispute information directly with the furnisher.

DISPUTED ACCOUNT:
Furnisher: ${creditItem.creditorName}
${accountIdentifier(creditItem)}
Type of Dispute: ${describeItemType(creditItem)}${creditItem.balance ? `\nReported Balance: $${creditItem.balance.toLocaleString()}` : ""}
Bureau(s) Reporting To: ${creditItem.bureau.charAt(0).toUpperCase() + creditItem.bureau.slice(1)}
${previousDisputeReference(previousRounds)}
DISPUTE DETAILS:

I have previously disputed this item through the credit bureau(s), and the information was reported as "verified." However, I maintain that the information you are furnishing is inaccurate, incomplete, or unverifiable. I am now exercising my right to dispute directly with you as the furnisher.

Under FCRA §623(a)(8)(E) (15 U.S.C. §1681s-2(a)(8)(E)), upon receipt of this direct dispute, you are required to:

1. Conduct a reasonable investigation with respect to the disputed information;
2. Review all relevant information provided by me in this notice;
3. Report the results of your investigation to me;
4. If the investigation finds that the information is inaccurate, incomplete, or unverifiable, immediately notify each consumer reporting agency to which you furnished the inaccurate information so that the agency can promptly correct or delete the information.

I further remind you of your ongoing obligations under FCRA §623(a)(1) (15 U.S.C. §1681s-2(a)(1)), which prohibits furnishing information to consumer reporting agencies that you know or have reasonable cause to believe is inaccurate. A furnisher has "reasonable cause to believe" information is inaccurate when a reasonable person would question the accuracy of the information — which is clearly the case when the consumer has repeatedly disputed the information.

DOCUMENTS REQUESTED:

To facilitate your investigation, I request that you provide the following:

1. A complete copy of all records in your possession relating to this account, including the original signed agreement, complete payment history, and any internal notes regarding disputes;
2. A description of the investigation procedures you conducted in response to any prior bureau-forwarded disputes;
3. The name and contact information of the specific individual(s) who conducted any prior reinvestigation and determined this information to be accurate.
${medicalAddendum(creditItem)}${stateAddendum(userProfile)}
CONSEQUENCES OF NON-COMPLIANCE:

As a furnisher of information, your obligations under FCRA §623 are independently enforceable. Under FCRA §616 (15 U.S.C. §1681n), willful failure to comply subjects you to statutory damages of $100 to $1,000 per violation, punitive damages, and attorney's fees. Under §617 (15 U.S.C. §1681o), negligent noncompliance subjects you to actual damages and attorney's fees.

I require a response within thirty (30) days of your receipt of this letter. If you are unable to substantiate the accuracy and completeness of the information you are reporting, I demand that you immediately instruct all consumer reporting agencies to delete this item from my credit report.

Failure to conduct a proper investigation or to correct inaccurate information will result in formal complaints to the CFPB and state attorney general, and I will pursue all available legal remedies, including litigation if necessary.

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

  const content = `${fullName(userProfile)}
${fullAddress(userProfile)}

${formatDate()}

${creditorName}
${creditorAddress}

Re: Goodwill Request for Account Adjustment — ${accountIdentifier(creditItem)}

Dear Customer Relations Department:

I am writing to respectfully request a goodwill adjustment to my account referenced above. I have been a customer of ${creditorName}, and I value the relationship we have built over time.

ACCOUNT INFORMATION:
Creditor: ${creditItem.creditorName}
${accountIdentifier(creditItem)}${creditItem.latePaymentDates ? `\nLate Payment Date(s): ${creditItem.latePaymentDates.join(", ")}` : ""}

EXPLANATION:

I understand that my account reflects ${creditItem.latePaymentDates ? `late payment(s) on ${creditItem.latePaymentDates.join(", ")}` : "a late payment"}. I want to acknowledge that the payment was indeed late, and I take full responsibility for that. However, I respectfully ask that you consider the circumstances and my overall history as your customer.

${creditItem.userNotes ? `The circumstances surrounding this late payment were as follows: ${creditItem.userNotes}\n\n` : ""}Since that time, I have maintained a consistent record of on-time payments and have worked diligently to manage my financial obligations responsibly. The late payment notation on my credit report is having a significant negative impact on my credit standing, which affects my ability to secure favorable terms for housing, employment, and other financial needs.

GOODWILL REQUEST:

I am respectfully requesting that ${creditorName} grant a goodwill adjustment to remove the late payment notation from my credit report with ${creditItem.bureau.charAt(0).toUpperCase() + creditItem.bureau.slice(1)}. I understand that you are under no obligation to do so, and I appreciate your willingness to consider this request.

Many creditors have policies that allow for goodwill adjustments in recognition of loyal customers who have demonstrated an overall pattern of responsible account management. I hope that my history with ${creditorName} demonstrates that the late payment was an isolated incident and not reflective of my commitment to meeting my obligations.

If there is any additional information I can provide or any specific department I should contact to facilitate this request, please let me know.

Thank you for your time, your consideration, and your continued service as my financial provider.

Sincerely,


____________________________________
${fullName(userProfile)}
${accountIdentifier(creditItem)}
Phone: ${userProfile.phone ?? "ON FILE"}
Email: ${userProfile.email ?? "ON FILE"}`;

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

Date: ${formatDate()}

COMPLAINANT INFORMATION:
Name: ${fullName(userProfile)}
Address: ${fullAddress(userProfile)}
Date of Birth: ${userProfile.dob}
SSN (last 4): ***-**-${userProfile.ssnLast4}

COMPLAINT AGAINST:
Entity: ${BUREAU_ADDRESSES[creditItem.bureau].name}
Address: ${BUREAU_ADDRESSES[creditItem.bureau].address}

${creditItem.collectorName ? `Additional Entity: ${creditItem.collectorName}\nAddress: ${creditItem.collectorAddress ?? "ON FILE"}\n` : ""}
PRODUCT/SERVICE: Credit reporting

ISSUE: Incorrect information on my credit report that the credit reporting agency refuses to correct despite multiple disputes.

DETAILED DESCRIPTION OF COMPLAINT:

I am filing this complaint because ${BUREAU_ADDRESSES[creditItem.bureau].name} has failed to conduct a reasonable reinvestigation of inaccurate information on my credit report despite my repeated, well-documented disputes.

DISPUTED ITEM:
Creditor/Furnisher: ${creditItem.creditorName}
${accountIdentifier(creditItem)}
Type: ${describeItemType(creditItem)}${creditItem.balance ? `\nReported Balance: $${creditItem.balance.toLocaleString()}` : ""}

DISPUTE HISTORY:
I have submitted the following disputes regarding this item, all sent via certified mail with return receipt:

${roundsSummary || "Multiple disputes submitted — details available upon request."}

IDENTIFIED VIOLATIONS:

Based on the responses (or lack thereof) to my disputes, I have identified the following violations of federal consumer protection law:

${violationsList || "- Failure to conduct a reasonable reinvestigation as required by FCRA §611 (15 U.S.C. §1681i)\n- Failure to provide method of verification as required by FCRA §609 (15 U.S.C. §1681g)"}

APPLICABLE LAW:

The Fair Credit Reporting Act requires credit reporting agencies to:
- Conduct a reasonable reinvestigation within 30 days of receiving a consumer dispute (FCRA §611, 15 U.S.C. §1681i)
- Delete information that is inaccurate, incomplete, or cannot be verified (FCRA §611(a)(5)(A))
- Disclose the method of verification upon consumer request (FCRA §609, 15 U.S.C. §1681g)
- Maintain reasonable procedures to assure maximum possible accuracy (FCRA §607(b), 15 U.S.C. §1681e(b))

DESIRED RESOLUTION:

1. Immediate deletion of the disputed item from my credit report;
2. An updated credit report reflecting the correction, sent to me and to any entity that received my report in the past two years for employment purposes or one year for all other purposes;
3. Confirmation of the corrective action taken;
4. A written explanation of what went wrong in the prior reinvestigations.

I have attached copies of all dispute correspondence, certified mail receipts, and responses received. I am prepared to provide any additional documentation requested.

${fullName(userProfile)}`;

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

Date: ${formatDate()}

TO: Office of the Attorney General, State of ${userProfile.address.state}
Consumer Protection Division

FROM:
${fullName(userProfile)}
${fullAddress(userProfile)}
Date of Birth: ${userProfile.dob}
Phone: ${userProfile.phone ?? "ON FILE"}
Email: ${userProfile.email ?? "ON FILE"}

COMPLAINT AGAINST:
Entity: ${BUREAU_ADDRESSES[creditItem.bureau].name}
Address: ${BUREAU_ADDRESSES[creditItem.bureau].address}

${creditItem.collectorName ? `Additional Entity: ${creditItem.collectorName}\nAddress: ${creditItem.collectorAddress ?? "ON FILE"}\n` : ""}
NATURE OF COMPLAINT:

I am filing this complaint regarding the failure of ${BUREAU_ADDRESSES[creditItem.bureau].name} to comply with both federal and state consumer credit reporting laws in connection with inaccurate information on my credit report.

FACTUAL BACKGROUND:

My credit report maintained by ${BUREAU_ADDRESSES[creditItem.bureau].name} contains the following inaccurate item:

Creditor/Furnisher: ${creditItem.creditorName}
${accountIdentifier(creditItem)}
Type: ${describeItemType(creditItem)}${creditItem.balance ? `\nReported Balance: $${creditItem.balance.toLocaleString()}` : ""}

DISPUTE HISTORY:

I have attempted to resolve this matter through the dispute process established by federal law. My dispute history is as follows:

${roundsSummary || "Multiple written disputes submitted via certified mail — copies enclosed."}

Despite my repeated, good-faith efforts to resolve this matter through the established dispute process, ${BUREAU_ADDRESSES[creditItem.bureau].name} has failed to conduct a meaningful reinvestigation or correct the inaccurate information.

FEDERAL LAW VIOLATIONS:

The conduct described above constitutes violations of the Fair Credit Reporting Act, including:
- Failure to conduct a reasonable reinvestigation within 30 days (FCRA §611, 15 U.S.C. §1681i)
- Failure to disclose method of verification (FCRA §609, 15 U.S.C. §1681g)
- Failure to maintain reasonable procedures for maximum possible accuracy (FCRA §607(b), 15 U.S.C. §1681e(b))
${stateSection}
HARM TO CONSUMER:

The continued reporting of this inaccurate information has caused me tangible harm, including but not limited to: damage to my credit score, denial or unfavorable terms for credit applications, increased insurance premiums, potential impacts on employment and housing applications, and emotional distress resulting from the inability to correct demonstrably inaccurate information despite exhaustive efforts through proper channels.

REQUESTED ACTION:

I respectfully request that your office:

1. Investigate this matter;
2. Contact ${BUREAU_ADDRESSES[creditItem.bureau].name} to demand correction of the inaccurate information;
3. Take any enforcement action deemed appropriate under federal and state law;
4. Inform me of the results of your investigation.

I have enclosed copies of all relevant correspondence, including my dispute letters, certified mail receipts, and all responses received. I am prepared to provide any additional information or documentation your office may require.

I have also filed a complaint with the Consumer Financial Protection Bureau regarding this matter.

Respectfully submitted,


____________________________________
${fullName(userProfile)}
Date: ${formatDate()}

Enclosures:
- Copies of all dispute correspondence
- Certified mail receipts
- Bureau response letters
- Copy of credit report showing disputed item`;

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

NOTICE OF INTENT TO LITIGATE — PRESERVE ALL RECORDS

Dear General Counsel / Legal Department:

THIS IS A FORMAL PRE-LITIGATION NOTICE. PLEASE FORWARD IMMEDIATELY TO YOUR LEGAL DEPARTMENT.

I am writing to notify ${bureau.name} of my intent to pursue litigation for your willful and/or negligent violations of the Fair Credit Reporting Act (15 U.S.C. §1681 et seq.) in connection with your handling of my credit file and dispute correspondence.

DISPUTED ITEM:
Creditor/Furnisher: ${creditItem.creditorName}
${accountIdentifier(creditItem)}
Type: ${describeItemType(creditItem)}${creditItem.balance ? `\nReported Balance: $${creditItem.balance.toLocaleString()}` : ""}

LITIGATION HOLD — DOCUMENT PRESERVATION DEMAND:

Effective immediately, you are on notice to preserve all documents, records, electronic communications, recordings, and any other materials related to my credit file, including but not limited to:
- My complete consumer file and all versions thereof;
- All dispute correspondence received from me;
- All communications with furnishers regarding my disputes;
- All reinvestigation records, notes, and procedures;
- All training materials related to dispute reinvestigation procedures;
- All electronic records, metadata, system logs, and audit trails related to my file.

Destruction, alteration, or failure to preserve any relevant documents after receipt of this notice will be treated as spoliation of evidence and will be raised in any subsequent litigation.

CHRONOLOGY OF DISPUTES AND VIOLATIONS:

  ${roundsTimeline || "Complete timeline of disputes available in attached documentation."}

DOCUMENTED VIOLATIONS:

Based on the foregoing, I have identified the following violations of the Fair Credit Reporting Act:

  ${violationsDetail || `Multiple violations of FCRA §611 (failure to conduct reasonable reinvestigation), §609 (failure to provide method of verification), and §607(b) (failure to maintain reasonable procedures) — detailed documentation available.`}

DAMAGES EXPOSURE:

Under FCRA §616 (15 U.S.C. §1681n), you are liable for willful noncompliance in an amount equal to:
- Statutory damages of $100 to $1,000 PER VIOLATION (estimated ${violationCount} violations = $${minDamages.toLocaleString()} to $${maxDamages.toLocaleString()} in statutory damages);
- Punitive damages as the court may allow;
- Reasonable attorney's fees and costs.

Under FCRA §617 (15 U.S.C. §1681o), you are additionally liable for negligent noncompliance:
- Actual damages sustained, including but not limited to credit denials, increased interest rates, emotional distress, and lost opportunities;
- Attorney's fees and costs.

DEMAND FOR RESOLUTION:

Before retaining counsel, I am providing you with a final opportunity to resolve this matter. I demand that within fifteen (15) days of your receipt of this letter, you:

1. Permanently delete the disputed item from my credit report;
2. Provide written confirmation of the deletion;
3. Send updated credit reports reflecting the deletion to any entity that received my report in the prior two years (employment) or one year (all other purposes);
4. Provide a copy of my updated, corrected credit report to me at no charge.

If I do not receive satisfactory resolution within fifteen (15) days, I will retain counsel and initiate litigation in the appropriate United States District Court. I have maintained meticulous documentation of every dispute, every response, every deadline, and every violation, which will be provided to my attorney.

I have also filed formal complaints with the Consumer Financial Protection Bureau and the Office of the Attorney General for the State of ${userProfile.address.state}.

This letter is being sent via certified mail, return receipt requested, and constitutes my final pre-litigation communication.

${signatureBlock(userProfile)}

cc: Consumer Financial Protection Bureau
    Office of the Attorney General, State of ${userProfile.address.state}
    [ATTORNEY NAME — to be retained if unresolved]`;

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

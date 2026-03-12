-- 003_seed_legal_citations.sql
-- CreditClean AI — Seed legal_citations reference table
-- Source: src/lib/disputes/legal-citations.ts

INSERT INTO legal_citations (code, law_name, section, title, summary, full_text, applicable_to, dispute_strategy)
VALUES

-- ─────────────────────────────────────────────────────────
-- FAIR CREDIT REPORTING ACT (FCRA)
-- ─────────────────────────────────────────────────────────

(
  'FCRA_611',
  'Fair Credit Reporting Act',
  '§611 (15 U.S.C. §1681i)',
  'Right to Dispute Inaccurate Information',
  'Right to dispute inaccurate information. Bureaus must conduct a reasonable investigation within 30 days and notify the consumer of results.',
  'If the completeness or accuracy of any item of information contained in a consumer''s file at a consumer reporting agency is disputed by the consumer and the consumer notifies the agency directly, or indirectly through a reseller, of such dispute, the agency shall, free of charge, conduct a reasonable reinvestigation to determine whether the disputed information is inaccurate and record the current status of the disputed information, or delete the item from the file, before the end of the 30-day period beginning on the date on which the agency receives the notice of the dispute from the consumer or reseller. The agency shall notify the furnisher of information within 5 business days of receiving the dispute and provide all relevant information submitted by the consumer. If the reinvestigation does not resolve the dispute, the consumer may add a brief statement to the file.',
  ARRAY['late_payment','collection','charge_off','repossession','foreclosure','bankruptcy','judgment','tax_lien','inquiry','medical_debt','student_loan','other'],
  'fcra_611_bureau_dispute'
),

(
  'FCRA_609',
  'Fair Credit Reporting Act',
  '§609 (15 U.S.C. §1681g)',
  'Right to Disclosure and Method of Verification',
  'Right to disclosure of information and method of verification. Consumer may request all information in their file and the specific procedure used to verify disputed items.',
  'Every consumer reporting agency shall, upon request and proper identification of the consumer, clearly and accurately disclose to the consumer: (A) All information in the consumer''s file at the time of the request, except medical information. (B) The sources of the information. (C) Identification of each person that procured a consumer report during the 1-year period preceding the date of the request for employment purposes, and the 2-year period for all other purposes. Upon request, the agency shall disclose the method of verification used during any reinvestigation under §611.',
  ARRAY['late_payment','collection','charge_off','repossession','foreclosure','bankruptcy','judgment','tax_lien','inquiry','medical_debt','student_loan','other'],
  'fcra_609_verification'
),

(
  'FCRA_623',
  'Fair Credit Reporting Act',
  '§623 (15 U.S.C. §1681s-2)',
  'Furnisher Obligations and Direct Dispute Rights',
  'Furnisher obligations and direct dispute rights. Furnishers must investigate disputes forwarded by bureaus and direct disputes from consumers, correct inaccuracies, and report results.',
  'A person shall not furnish information relating to a consumer to any consumer reporting agency if the person knows or has reasonable cause to believe that the information is inaccurate. After receiving notice of a dispute from a consumer reporting agency under §611, the furnisher shall: (A) conduct an investigation with respect to the disputed information; (B) review all relevant information provided by the consumer reporting agency; (C) report the results of the investigation to the agency; and (D) if the investigation finds that the information is incomplete or inaccurate, report those results to all consumer reporting agencies to which the person furnished the information. Under §623(a)(8), consumers may also dispute directly with furnishers, who must then investigate within 30 days.',
  ARRAY['late_payment','collection','charge_off','repossession','foreclosure','student_loan','other'],
  'fcra_623_furnisher_dispute'
),

(
  'FCRA_616',
  'Fair Credit Reporting Act',
  '§616 (15 U.S.C. §1681n)',
  'Civil Liability for Willful Noncompliance',
  'Civil liability for willful noncompliance. Consumers may recover actual damages or statutory damages of $100 to $1,000 per violation, plus punitive damages and attorney''s fees.',
  'Any person who willfully fails to comply with any requirement imposed under this title with respect to any consumer is liable to that consumer in an amount equal to the sum of: (1)(A) any actual damages sustained by the consumer as a result of the failure or damages of not less than $100 and not more than $1,000; (2) such amount of punitive damages as the court may allow; and (3) in the case of any successful action to enforce any liability under this section, the costs of the action together with reasonable attorney''s fees as determined by the court.',
  ARRAY['late_payment','collection','charge_off','repossession','foreclosure','bankruptcy','judgment','tax_lien','inquiry','medical_debt','student_loan','other'],
  'intent_to_litigate'
),

(
  'FCRA_617',
  'Fair Credit Reporting Act',
  '§617 (15 U.S.C. §1681o)',
  'Civil Liability for Negligent Noncompliance',
  'Civil liability for negligent noncompliance. Consumers may recover actual damages and attorney''s fees for negligent violations of FCRA.',
  'Any person who is negligent in failing to comply with any requirement imposed under this title with respect to any consumer is liable to that consumer in an amount equal to the sum of: (1) any actual damages sustained by the consumer as a result of the failure; and (2) in the case of any successful action to enforce any liability under this section, the costs of the action together with reasonable attorney''s fees as determined by the court.',
  ARRAY['late_payment','collection','charge_off','repossession','foreclosure','bankruptcy','judgment','tax_lien','inquiry','medical_debt','student_loan','other'],
  'intent_to_litigate'
),

(
  'FCRA_604',
  'Fair Credit Reporting Act',
  '§604 (15 U.S.C. §1681b)',
  'Permissible Purposes of Consumer Reports',
  'Permissible purposes of consumer reports. A credit report may only be obtained for enumerated permissible purposes including credit transactions, employment, insurance, or legitimate business needs.',
  'A consumer reporting agency may furnish a consumer report only under the following circumstances: (1) In response to a court order or federal grand jury subpoena. (2) To the consumer. (3) To a person which it has reason to believe intends to use the information in connection with: (A) a credit transaction involving the consumer; (B) employment purposes; (C) underwriting of insurance; (D) a determination of eligibility for a government license or benefit; (E) assessment of credit risks associated with an existing credit obligation; (F) a legitimate business need in connection with a business transaction initiated by the consumer.',
  ARRAY['inquiry'],
  'fcra_611_bureau_dispute'
),

-- ─────────────────────────────────────────────────────────
-- FAIR DEBT COLLECTION PRACTICES ACT (FDCPA)
-- ─────────────────────────────────────────────────────────

(
  'FDCPA_809',
  'Fair Debt Collection Practices Act',
  '§809 (15 U.S.C. §1692g)',
  'Debt Validation Rights',
  'Debt validation rights. Within 30 days of initial communication, consumer may dispute the debt and demand validation. Collector must cease collection until validation is provided.',
  'Within five days after the initial communication with a consumer in connection with the collection of any debt, a debt collector shall send the consumer a written notice containing: (1) the amount of the debt; (2) the name of the creditor to whom the debt is owed; (3) a statement that unless the consumer disputes the validity of the debt within thirty days, the debt will be assumed valid; (4) a statement that if the consumer disputes the debt in writing within the thirty-day period, the debt collector will obtain verification of the debt and mail a copy to the consumer; and (5) a statement that the consumer may request the name and address of the original creditor. If the consumer notifies the debt collector in writing within the thirty-day period that the debt is disputed, the debt collector shall cease collection of the debt until the debt collector obtains verification of the debt and mails a copy of such verification to the consumer.',
  ARRAY['collection','medical_debt'],
  'fdcpa_809_validation'
),

(
  'FDCPA_807',
  'Fair Debt Collection Practices Act',
  '§807 (15 U.S.C. §1692e)',
  'Prohibition of False or Misleading Representations',
  'Prohibition of false, deceptive, or misleading representations. Collectors may not misrepresent the character, amount, or legal status of any debt.',
  'A debt collector may not use any false, deceptive, or misleading representation or means in connection with the collection of any debt. Without limiting the general application, the following conduct is a violation: (2) The false representation of the character, amount, or legal status of any debt. (5) The threat to take any action that cannot legally be taken or that is not intended to be taken. (8) Communicating credit information which is known or which should be known to be false, including the failure to communicate that a disputed debt is disputed. (10) The use of any false representation or deceptive means to collect or attempt to collect any debt.',
  ARRAY['collection','medical_debt'],
  'fdcpa_809_validation'
),

(
  'FDCPA_805',
  'Fair Debt Collection Practices Act',
  '§805 (15 U.S.C. §1692c)',
  'Communication Restrictions',
  'Communication restrictions. Collectors may not contact consumers at inconvenient times, at work if employer disapproves, or after receiving a cease communication request.',
  'A debt collector may not communicate with a consumer in connection with the collection of any debt at any unusual time or place known or which should be known to be inconvenient to the consumer. Without the prior consent of the consumer given directly to the debt collector, a debt collector may not communicate with a consumer before 8:00 AM or after 9:00 PM local time. If the consumer notifies the debt collector in writing that the consumer refuses to pay the debt or that the consumer wishes the debt collector to cease further communication, the debt collector shall cease further communication except to advise the consumer that the collector''s further efforts are terminated or to notify the consumer that the collector may invoke specified remedies.',
  ARRAY['collection','medical_debt'],
  'fdcpa_809_validation'
),

-- ─────────────────────────────────────────────────────────
-- FAIR CREDIT BILLING ACT (FCBA)
-- ─────────────────────────────────────────────────────────

(
  'FCBA_161',
  'Fair Credit Billing Act',
  '§161-171 (15 U.S.C. §1666)',
  'Billing Error Disputes for Revolving Credit',
  'Billing error disputes for revolving credit accounts. Creditors must acknowledge billing disputes within 30 days, resolve within 90 days (two billing cycles), and may not report the disputed amount as delinquent during investigation.',
  'If a creditor receives a billing error notice from an obligor, the creditor shall: (a) send a written acknowledgment of receipt within 30 days; (b) make appropriate corrections or send a written explanation within two complete billing cycles (but not more than 90 days). During the investigation, the creditor may not: (1) restrict or close the account; (2) report the disputed amount as delinquent to any consumer reporting agency. A billing error includes: charges not made by the obligor, charges for goods not delivered as agreed, computational errors, charges for which the obligor requests clarification.',
  ARRAY['late_payment','charge_off'],
  'fcra_611_bureau_dispute'
),

-- ─────────────────────────────────────────────────────────
-- HIPAA (Medical Debt)
-- ─────────────────────────────────────────────────────────

(
  'HIPAA_MEDICAL',
  'Health Insurance Portability and Accountability Act',
  'Privacy Rule (45 CFR Part 160 & 164) (42 U.S.C. §1320d et seq.)',
  'Medical Debt Privacy Protections',
  'Protects the privacy of individually identifiable health information. Medical providers and their business associates must obtain authorization before sharing protected health information (PHI), including with debt collectors and credit bureaus.',
  'A covered entity may not use or disclose protected health information except as permitted or required by the Privacy Rule. Disclosure for payment purposes is permitted but must adhere to the minimum necessary standard. A collection agency acting as a business associate must have a Business Associate Agreement (BAA) in place. Disclosure of PHI to a credit reporting agency requires either patient authorization or must be limited to non-clinical data. As of 2023, medical debts under $500 and paid medical debts are removed from credit reports per bureau policy changes aligned with CFPB guidance.',
  ARRAY['medical_debt'],
  'fdcpa_809_validation'
),

-- ─────────────────────────────────────────────────────────
-- STATE-SPECIFIC LAWS
-- ─────────────────────────────────────────────────────────

(
  'CA_CCRAA',
  'California Consumer Credit Reporting Agencies Act',
  'Cal. Civ. Code §1785.1 et seq.',
  'California State Credit Reporting Protections',
  'California''s state-level credit reporting law. Provides additional consumer protections including a private right of action, stricter investigation requirements, and enhanced penalties. Statute of limitations for reporting is generally shorter for certain items.',
  'The CCRAA requires consumer credit reporting agencies operating in California to follow procedures that are fair and equitable to the consumer, with regard to confidentiality, accuracy, relevancy, and proper utilization of reported information. A consumer may bring an action against any person who willfully or negligently fails to comply (§1785.31). Damages include actual damages, statutory damages of $100 to $5,000 per violation for willful noncompliance, punitive damages, attorney''s fees, and costs. The CCRAA also requires bureaus to block information resulting from identity theft within 30 days.',
  ARRAY['late_payment','collection','charge_off','repossession','foreclosure','bankruptcy','judgment','tax_lien','inquiry','medical_debt','student_loan','other'],
  'state_ag_complaint'
),

(
  'NY_FCRA',
  'New York Fair Credit Reporting Act',
  'N.Y. Gen. Bus. Law §380 et seq.',
  'New York State Credit Reporting Protections',
  'New York''s state credit reporting statute. Provides parallel protections to federal FCRA with state-specific remedies and enforcement mechanisms.',
  'New York General Business Law Article 25 (§380-a through §380-u) governs consumer reporting agencies operating in New York. Consumers have the right to dispute inaccurate information, and agencies must reinvestigate within 30 days. The law provides for a private right of action with actual damages, attorney''s fees, and costs. New York also has strong debt collection regulations under N.Y. Gen. Bus. Law §601 and NYC Admin. Code §20-490, which impose additional requirements on debt collectors operating in the state.',
  ARRAY['late_payment','collection','charge_off','repossession','foreclosure','bankruptcy','judgment','tax_lien','inquiry','medical_debt','student_loan','other'],
  'state_ag_complaint'
),

(
  'TX_FINANCE_CODE',
  'Texas Finance Code — Credit Reporting',
  'Tex. Fin. Code §392 & Tex. Bus. & Com. Code §20',
  'Texas Debt Collection and Credit Reporting Protections',
  'Texas debt collection and credit reporting laws. The Texas Debt Collection Act (TDCA) prohibits deceptive practices by debt collectors, and Texas Business & Commerce Code Chapter 20 governs consumer credit reporting with state-specific protections.',
  'The Texas Debt Collection Act (Tex. Fin. Code §392) prohibits debt collectors from using threats, coercion, harassment, or unconscionable means to collect debts. It also prohibits false or misleading representations. Texas Business & Commerce Code Chapter 20 provides consumer credit reporting protections including the right to dispute inaccurate information and obtain free credit reports. Violations of the TDCA are actionable under the Texas Deceptive Trade Practices Act (DTPA), which provides for actual damages, statutory damages, treble damages for knowing violations, and attorney''s fees.',
  ARRAY['late_payment','collection','charge_off','repossession','foreclosure','bankruptcy','judgment','tax_lien','inquiry','medical_debt','student_loan','other'],
  'state_ag_complaint'
)

ON CONFLICT (code) DO UPDATE SET
  law_name = EXCLUDED.law_name,
  section = EXCLUDED.section,
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  full_text = EXCLUDED.full_text,
  applicable_to = EXCLUDED.applicable_to,
  dispute_strategy = EXCLUDED.dispute_strategy;

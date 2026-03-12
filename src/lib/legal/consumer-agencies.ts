// CreditClean AI — Consumer Protection Agencies Directory
// Every federal agency, credit bureau, and key state AG offices
// with filing instructions and contact information.

import { ConsumerAgency } from "./types";

export const FEDERAL_AGENCIES: ConsumerAgency[] = [
  {
    name: "Consumer Financial Protection Bureau",
    acronym: "CFPB",
    type: "federal",
    jurisdiction: "Credit reporting, debt collection, consumer lending, mortgages, student loans, auto loans, credit cards. Primary federal regulator for consumer financial products.",
    website: "https://www.consumerfinance.gov",
    complaintUrl: "https://www.consumerfinance.gov/complaint/",
    phone: "1-855-411-2372",
    address: "Consumer Financial Protection Bureau, P.O. Box 4503, Iowa City, IA 52244",
    whenToUse:
      "File after Round 3 if bureau disputes have not resolved the issue. The CFPB is the most powerful consumer tool — companies must respond to CFPB complaints within 15 days and provide a final response within 60 days. CFPB complaints have a significantly higher resolution rate than direct disputes.",
    filingTips:
      "Be specific: include dates of all disputes sent, tracking numbers, responses received, and specific violations. Attach copies of all correspondence. State what resolution you want (deletion, correction, verification documentation). The CFPB forwards your complaint directly to the company with regulatory pressure behind it.",
    responseTime: "Company must acknowledge within 15 days. Final response within 60 days. CFPB reviews for regulatory compliance.",
    enforcementPower: "Can issue fines, consent orders, and refer cases for legal action. Has authority over credit bureaus, debt collectors, banks, and non-bank financial companies. Can order refunds, corrections, and policy changes.",
  },
  {
    name: "Federal Trade Commission",
    acronym: "FTC",
    type: "federal",
    jurisdiction: "Consumer protection, identity theft, deceptive business practices, unfair trade practices. Shares FCRA enforcement authority with CFPB.",
    website: "https://www.ftc.gov",
    complaintUrl: "https://reportfraud.ftc.gov/",
    phone: "1-877-382-4357",
    address: "Federal Trade Commission, 600 Pennsylvania Avenue, NW, Washington, DC 20580",
    whenToUse:
      "File for identity theft (IdentityTheft.gov), deceptive collection practices, and when the CFPB hasn't resolved the issue. FTC complaints contribute to pattern detection — if enough consumers complain about the same company, the FTC may take enforcement action.",
    filingTips:
      "Use ReportFraud.ftc.gov for general complaints and IdentityTheft.gov specifically for identity theft. The FTC doesn't resolve individual cases but uses complaints to build enforcement actions against companies with patterns of violations.",
    responseTime: "The FTC does not resolve individual complaints. Complaints are entered into the Consumer Sentinel database used by law enforcement. No individual response expected.",
    enforcementPower: "Can file federal lawsuits, seek injunctions, refunds, and civil penalties. Has brought major enforcement actions against all three credit bureaus. Partners with state AGs for multi-state enforcement.",
  },
  {
    name: "Office of the Comptroller of the Currency",
    acronym: "OCC",
    type: "federal",
    jurisdiction: "National banks and federal savings associations. If the creditor is a national bank (has 'National' or 'N.A.' in its name), the OCC has jurisdiction.",
    website: "https://www.occ.gov",
    complaintUrl: "https://www.helpwithmybank.gov/complaints/index-background.html",
    phone: "1-800-613-6743",
    address: "Office of the Comptroller of the Currency, Customer Assistance Group, 1301 McKinney Street, Suite 3450, Houston, TX 77010",
    whenToUse:
      "File when the creditor/furnisher is a national bank (e.g., Bank of America, N.A.; Chase, N.A.; Citibank, N.A.; Wells Fargo, N.A.). The OCC regulates these banks and can order them to correct inaccurate reporting.",
    filingTips:
      "Verify the bank's charter type at helpwithmybank.gov before filing. Include your account number, specific inaccuracy, and documentation of disputes already filed.",
    responseTime: "OCC forwards to the bank, which typically responds within 60 days.",
    enforcementPower: "Can issue cease-and-desist orders, civil money penalties, and enforcement actions against national banks. Can order corrections to credit reporting.",
  },
  {
    name: "Federal Deposit Insurance Corporation",
    acronym: "FDIC",
    type: "federal",
    jurisdiction: "State-chartered banks that are not members of the Federal Reserve System. Insures deposits and supervises state non-member banks.",
    website: "https://www.fdic.gov",
    complaintUrl: "https://www.fdic.gov/consumers/assistance/filecomplaint.html",
    phone: "1-877-275-3342",
    address: "FDIC Consumer Response Center, 1100 Walnut Street, Box #11, Kansas City, MO 64106",
    whenToUse:
      "File when the creditor is a state-chartered bank that is not a Federal Reserve member. Check the institution's regulator at ffiec.gov/consumercenter.",
    filingTips:
      "Verify the bank's regulator at ffiec.gov before filing. Include account details and documentation of all previous dispute attempts.",
    responseTime: "Typically 30-60 days for the bank to respond through the FDIC process.",
    enforcementPower: "Can issue enforcement actions, civil money penalties, and cease-and-desist orders against supervised banks.",
  },
  {
    name: "National Credit Union Administration",
    acronym: "NCUA",
    type: "federal",
    jurisdiction: "Federally insured credit unions. If the creditor is a credit union, the NCUA has jurisdiction.",
    website: "https://www.ncua.gov",
    complaintUrl: "https://www.mycreditunion.gov/consumer-assistance-center/complaint-process",
    phone: "1-800-755-1030",
    address: "NCUA, Office of Consumer Financial Protection, 1775 Duke Street, Alexandria, VA 22314",
    whenToUse:
      "File when the creditor is a credit union. The NCUA handles consumer complaints and can order credit unions to correct reporting.",
    filingTips:
      "Include credit union name, account number, nature of complaint, and documentation of prior disputes.",
    responseTime: "NCUA forwards to credit union. Typical response within 60 days.",
    enforcementPower: "Can examine credit unions, issue enforcement actions, and order corrective action.",
  },
  {
    name: "Department of Housing and Urban Development",
    acronym: "HUD",
    type: "federal",
    jurisdiction: "Fair housing, mortgage discrimination, ECOA violations related to housing credit.",
    website: "https://www.hud.gov",
    complaintUrl: "https://www.hud.gov/program_offices/fair_housing_equal_opp/online-complaint",
    phone: "1-800-669-9777",
    address: "U.S. Department of Housing and Urban Development, 451 7th Street S.W., Washington, DC 20410",
    whenToUse:
      "File when inaccurate credit reporting has affected your ability to obtain housing (mortgage denial, rental denial, higher rates). Especially relevant for ECOA/Fair Housing Act violations if there's a discriminatory pattern.",
    filingTips:
      "Focus on how the inaccurate credit reporting impacted your housing situation. Include adverse action notices from mortgage lenders showing the credit report was a factor.",
    responseTime: "HUD investigates within 100 days. Can refer to DOJ for prosecution.",
    enforcementPower: "Can investigate, conciliate, and refer cases to DOJ. Administers Fair Housing Act with civil penalties up to $16,000 for first offense.",
  },
  {
    name: "Department of Justice — Civil Rights Division",
    acronym: "DOJ",
    type: "federal",
    jurisdiction: "ECOA violations, pattern or practice of credit discrimination, Fair Housing Act enforcement.",
    website: "https://www.justice.gov/crt",
    complaintUrl: "https://civilrights.justice.gov/report/",
    phone: "1-202-514-4609",
    address: "U.S. Department of Justice, Civil Rights Division, 950 Pennsylvania Avenue, NW, Washington, DC 20530",
    whenToUse:
      "File when there is evidence of systemic credit discrimination based on race, color, religion, national origin, sex, marital status, age, or receipt of public assistance. The DOJ handles pattern-or-practice cases.",
    filingTips:
      "Document the discriminatory pattern — if similarly situated individuals of a different protected class received better treatment. Include all correspondence and adverse action notices.",
    responseTime: "DOJ investigations can take months to years for systemic cases.",
    enforcementPower: "Can file federal lawsuits seeking injunctive relief, compensatory damages, punitive damages, and civil penalties.",
  },
];

export const CREDIT_BUREAUS: ConsumerAgency[] = [
  {
    name: "Equifax Information Services LLC",
    acronym: "EFX",
    type: "bureau",
    jurisdiction: "One of three nationwide consumer reporting agencies.",
    website: "https://www.equifax.com",
    complaintUrl: "https://www.equifax.com/personal/disputes/",
    phone: "1-866-349-5191",
    address: "Equifax Information Services LLC, P.O. Box 740256, Atlanta, GA 30374-0256",
    whenToUse:
      "Dispute items appearing on your Equifax report. Send disputes via certified mail to the P.O. Box address for documented proof of receipt.",
    filingTips:
      "Always dispute via certified mail with return receipt requested — never online. Online disputes limit your rights and create a less documented paper trail. Include copies (not originals) of supporting documents. Reference specific account numbers and explain exactly what is inaccurate.",
    responseTime: "Must complete investigation within 30 days of receiving dispute (45 days if you provide additional information during investigation).",
    enforcementPower: "N/A — Equifax is the entity you dispute with, not an enforcement agency. Escalate to CFPB if Equifax fails to investigate properly.",
  },
  {
    name: "Experian Information Solutions Inc.",
    acronym: "EXP",
    type: "bureau",
    jurisdiction: "One of three nationwide consumer reporting agencies.",
    website: "https://www.experian.com",
    complaintUrl: "https://www.experian.com/disputes/main.html",
    phone: "1-888-397-3742",
    address: "Experian, P.O. Box 4500, Allen, TX 75013",
    whenToUse:
      "Dispute items appearing on your Experian report. Send disputes via certified mail.",
    filingTips:
      "Experian is known for being more resistant to disputes. Always use certified mail. Be extremely specific about what is inaccurate. If they respond with 'verified,' immediately follow up with a §609 verification request demanding the method of verification. Experian has paid significant settlements for improper reinvestigation procedures.",
    responseTime: "Must complete investigation within 30 days (45 days with additional info).",
    enforcementPower: "N/A — escalate to CFPB if Experian fails to investigate properly.",
  },
  {
    name: "TransUnion LLC",
    acronym: "TU",
    type: "bureau",
    jurisdiction: "One of three nationwide consumer reporting agencies.",
    website: "https://www.transunion.com",
    complaintUrl: "https://www.transunion.com/disputes",
    phone: "1-800-916-8800",
    address: "TransUnion LLC, Consumer Dispute Center, P.O. Box 2000, Chester, PA 19016",
    whenToUse:
      "Dispute items appearing on your TransUnion report. Send disputes via certified mail.",
    filingTips:
      "Always use certified mail. TransUnion was the defendant in TransUnion LLC v. Ramirez (594 U.S. 413), where the Supreme Court addressed standing for FCRA claims. Be sure to document actual dissemination of inaccurate information to third parties to strengthen your case.",
    responseTime: "Must complete investigation within 30 days (45 days with additional info).",
    enforcementPower: "N/A — escalate to CFPB if TransUnion fails to investigate properly.",
  },
];

export const KEY_STATE_ATTORNEYS_GENERAL: ConsumerAgency[] = [
  {
    name: "California Attorney General — Consumer Protection",
    acronym: "CA AG",
    type: "state",
    jurisdiction: "California Consumer Credit Reporting Agencies Act (CCRAA, Civil Code §1785), Rosenthal Fair Debt Collection Practices Act (Civil Code §1788), California Consumer Privacy Act (CCPA).",
    website: "https://oag.ca.gov/consumers",
    complaintUrl: "https://oag.ca.gov/contact/consumer-complaint-against-business-or-company",
    phone: "1-800-952-5225",
    address: "Office of the Attorney General, California Department of Justice, P.O. Box 944255, Sacramento, CA 94244-2550",
    whenToUse:
      "File after federal disputes and CFPB complaints if you are a California resident. California has some of the strongest consumer credit protections in the nation. CCRAA provides $100-$5,000 statutory damages per violation — significantly higher than federal FCRA.",
    filingTips:
      "Reference both federal FCRA and California CCRAA in your complaint. Include the Rosenthal Act if dealing with debt collectors (California's state FDCPA equivalent, which applies to original creditors too — broader than federal FDCPA). Document actual damages for potential CCPA claims.",
    responseTime: "AG forwards to business. Investigation timeline varies. AG may join multi-state enforcement actions.",
    enforcementPower: "Can bring civil actions, seek injunctions, civil penalties up to $5,000 per violation under Unfair Competition Law. CCRAA allows private right of action with $100-$5,000 per violation.",
  },
  {
    name: "New York Attorney General — Consumer Protection",
    acronym: "NY AG",
    type: "state",
    jurisdiction: "New York General Business Law §380 (credit reporting), Executive Law §63(12) (consumer fraud), New York City Consumer Protection Law.",
    website: "https://ag.ny.gov/consumer-frauds-bureau",
    complaintUrl: "https://ag.ny.gov/consumer-frauds-bureau/file-complaint",
    phone: "1-800-771-7755",
    address: "Office of the Attorney General, The Capitol, Albany, NY 12224",
    whenToUse:
      "File if you are a New York resident. NY has strong consumer protection laws and an active AG office that regularly brings actions against credit bureaus and debt collectors.",
    filingTips:
      "Reference GBL §380 for credit reporting violations and Executive Law §63(12) for deceptive practices. NYC residents can additionally file under the NYC Consumer Protection Law for additional remedies.",
    responseTime: "Varies. NY AG's office is active in multi-state enforcement actions.",
    enforcementPower: "Can bring actions for injunctive relief, restitution, disgorgement, and civil penalties. Executive Law §63(12) provides broad authority.",
  },
  {
    name: "Texas Attorney General — Consumer Protection",
    acronym: "TX AG",
    type: "state",
    jurisdiction: "Texas Finance Code §392 (debt collection), Texas Deceptive Trade Practices Act (DTPA, Bus. & Com. Code §17.41 et seq.).",
    website: "https://www.texasattorneygeneral.gov/consumer-protection",
    complaintUrl: "https://www.texasattorneygeneral.gov/consumer-protection/file-consumer-complaint",
    phone: "1-800-621-0508",
    address: "Office of the Attorney General, Consumer Protection Division, P.O. Box 12548, Austin, TX 78711-2548",
    whenToUse:
      "File if you are a Texas resident. Texas DTPA allows TREBLE (3x) DAMAGES for knowing violations — this is extremely powerful leverage. Texas Finance Code §392 provides additional protections against abusive collection.",
    filingTips:
      "Emphasize DTPA violations for treble damages potential. Include evidence of knowing or intentional violations (continued reporting after being notified of inaccuracy). Texas also allows mental anguish damages without physical injury.",
    responseTime: "AG forwards complaint to business. Mediation may be offered.",
    enforcementPower: "Can bring DTPA actions with treble damages, injunctive relief, and civil penalties up to $10,000 per violation ($250,000 for targeting elderly).",
  },
  {
    name: "Florida Attorney General — Consumer Protection",
    acronym: "FL AG",
    type: "state",
    jurisdiction: "Florida Consumer Collection Practices Act (FCCPA, §559.55 et seq.), Florida Deceptive and Unfair Trade Practices Act (FDUTPA, §501.201 et seq.).",
    website: "https://www.myfloridalegal.com/consumer-protection",
    complaintUrl: "https://www.myfloridalegal.com/consumer-protection/file-a-complaint",
    phone: "1-866-966-7226",
    address: "Office of the Attorney General, The Capitol PL-01, Tallahassee, FL 32399-1050",
    whenToUse:
      "File if you are a Florida resident. Florida FCCPA extends to original creditors (not just third-party collectors) and provides additional protections beyond federal FDCPA.",
    filingTips:
      "Reference both FCCPA and FDUTPA. FCCPA applies to original creditors collecting their own debts, filling the gap left by federal FDCPA.",
    responseTime: "AG mediates complaints. Timeline varies.",
    enforcementPower: "Can bring civil actions with actual damages plus $1,000 statutory under FCCPA. FDUTPA provides injunctive relief and attorney fees.",
  },
  {
    name: "Illinois Attorney General — Consumer Protection",
    acronym: "IL AG",
    type: "state",
    jurisdiction: "Illinois Consumer Fraud and Deceptive Business Practices Act (815 ILCS 505), Illinois Collection Agency Act (225 ILCS 425).",
    website: "https://www.illinoisattorneygeneral.gov/consumers/",
    complaintUrl: "https://www.illinoisattorneygeneral.gov/consumers/filecomplaint.html",
    phone: "1-800-386-5438",
    address: "Office of the Attorney General, 500 South Second Street, Springfield, IL 62706",
    whenToUse:
      "File if you are an Illinois resident. Illinois Consumer Fraud Act provides actual damages or $50,000 (whichever is greater) for violations against persons over 65.",
    filingTips:
      "Reference the Collection Agency Act if the collector is not properly licensed in Illinois — unlicensed collection is itself a violation. Include Consumer Fraud Act claims for deceptive practices.",
    responseTime: "AG mediates complaints. Active enforcement office.",
    enforcementPower: "Can bring actions for treble damages for intentional violations. $50,000 minimum for violations against elderly consumers.",
  },
  {
    name: "Georgia Attorney General — Consumer Protection",
    acronym: "GA AG",
    type: "state",
    jurisdiction: "Georgia Fair Business Practices Act (OCGA §10-1-390 et seq.), Georgia Fair Lending Act.",
    website: "https://law.georgia.gov/consumer-protection",
    complaintUrl: "https://law.georgia.gov/consumer-protection/file-consumer-complaint",
    phone: "1-404-651-8600",
    address: "Office of the Attorney General, 40 Capitol Square SW, Atlanta, GA 30334",
    whenToUse:
      "File if you are a Georgia resident. Georgia Fair Business Practices Act provides treble damages for intentional violations.",
    filingTips:
      "Reference OCGA §10-1-399 for private right of action. Treble damages available for knowing violations. Note: Equifax is headquartered in Atlanta — Georgia AG has particular leverage over Equifax.",
    responseTime: "AG forwards to business. Mediation offered.",
    enforcementPower: "Treble damages for intentional violations plus attorney fees and costs.",
  },
  {
    name: "Ohio Attorney General — Consumer Protection",
    acronym: "OH AG",
    type: "state",
    jurisdiction: "Ohio Consumer Sales Practices Act (ORC §1345), Ohio Collection practices regulations.",
    website: "https://www.ohioattorneygeneral.gov/About-AG/Consumer-Protection",
    complaintUrl: "https://www.ohioattorneygeneral.gov/About-AG/Service-Divisions/Consumer-Protection-Section/File-a-Complaint",
    phone: "1-800-282-0515",
    address: "Office of the Ohio Attorney General, 30 E. Broad Street, 14th Floor, Columbus, OH 43215",
    whenToUse:
      "File if you are an Ohio resident. Ohio CSPA provides $200 minimum statutory damage and treble damages for knowing violations.",
    filingTips:
      "Reference ORC §1345.09 for individual right of action. $200 minimum statutory damage (higher than federal). Treble damages for knowing violations.",
    responseTime: "AG investigates and mediates. Active consumer protection division.",
    enforcementPower: "$200 minimum statutory damages. Treble damages for knowing violations. Attorney fees.",
  },
  {
    name: "Pennsylvania Attorney General — Consumer Protection",
    acronym: "PA AG",
    type: "state",
    jurisdiction: "Pennsylvania Unfair Trade Practices and Consumer Protection Law (73 P.S. §201-1 et seq.), Pennsylvania Fair Credit Extension Uniformity Act.",
    website: "https://www.attorneygeneral.gov/protect-yourself/",
    complaintUrl: "https://www.attorneygeneral.gov/protect-yourself/file-a-complaint/",
    phone: "1-800-441-2555",
    address: "Office of Attorney General, Bureau of Consumer Protection, Strawberry Square, 15th Floor, Harrisburg, PA 17120",
    whenToUse:
      "File if you are a Pennsylvania resident. Note: TransUnion's Consumer Dispute Center is in Chester, PA — PA AG has particular leverage over TransUnion.",
    filingTips:
      "Reference 73 P.S. §201-9.2 for treble damages. Private right of action with attorney fees.",
    responseTime: "AG mediates and investigates.",
    enforcementPower: "Treble damages for violations. Attorney fees. Injunctive relief.",
  },
];

export const CONSUMER_RESOURCES: ConsumerAgency[] = [
  {
    name: "AnnualCreditReport.com",
    acronym: "ACR",
    type: "federal",
    jurisdiction: "Centralized source for free annual credit reports from all three bureaus, mandated by federal law (FCRA §612).",
    website: "https://www.annualcreditreport.com",
    complaintUrl: "https://www.annualcreditreport.com",
    phone: "1-877-322-8228",
    address: "Annual Credit Report Request Service, P.O. Box 105281, Atlanta, GA 30348-5281",
    whenToUse:
      "Use as your first step to pull all three credit reports for forensic analysis. Currently offering free weekly reports (not just annual). Pull all three before starting any dispute process.",
    filingTips:
      "Request reports from all three bureaus simultaneously. Save/print each report immediately. Review every line item. Note any discrepancies between bureaus (same account reporting differently is itself suspicious).",
    responseTime: "Instant online delivery. Mail delivery within 15 days.",
    enforcementPower: "N/A — this is a consumer service, not an enforcement agency.",
  },
  {
    name: "IdentityTheft.gov",
    acronym: "IDT",
    type: "federal",
    jurisdiction: "FTC's identity theft reporting and recovery resource. Creates official identity theft reports used for fraud alerts, blocks, and disputes.",
    website: "https://www.identitytheft.gov",
    complaintUrl: "https://www.identitytheft.gov/#/",
    phone: "1-877-438-4338",
    address: "Federal Trade Commission, 600 Pennsylvania Avenue, NW, Washington, DC 20580",
    whenToUse:
      "Use if any items on your credit report resulted from identity theft or fraud. The identity theft report generated here is an official document that triggers enhanced protections under FCRA §605A and §605B.",
    filingTips:
      "File an identity theft report even if you're not sure the accounts are fraudulent — if you don't recognize them, they may be. The report triggers: (1) extended fraud alerts (7 years), (2) right to block fraudulent information (4 business days), (3) free credit reports, (4) right to know where fraudulent accounts were opened.",
    responseTime: "Instant report generation. Recovery plan provided immediately.",
    enforcementPower: "The identity theft report is a legal document used to trigger FCRA protections. Bureaus must honor it.",
  },
];

// ─── COMBINED EXPORTS ─────────────────────────────────────

export const ALL_AGENCIES: ConsumerAgency[] = [
  ...FEDERAL_AGENCIES,
  ...CREDIT_BUREAUS,
  ...KEY_STATE_ATTORNEYS_GENERAL,
  ...CONSUMER_RESOURCES,
];

/**
 * Get the appropriate agencies to file with based on situation.
 */
export function getAgenciesForSituation(params: {
  isCollection: boolean;
  creditorType?: "national_bank" | "state_bank" | "credit_union" | "non_bank";
  state?: string;
  isIdentityTheft?: boolean;
  isHousingRelated?: boolean;
}): ConsumerAgency[] {
  const agencies: ConsumerAgency[] = [];

  // Always include CFPB for credit reporting issues
  agencies.push(FEDERAL_AGENCIES.find((a) => a.acronym === "CFPB")!);

  // Add FTC
  agencies.push(FEDERAL_AGENCIES.find((a) => a.acronym === "FTC")!);

  // Creditor-specific regulator
  if (params.creditorType === "national_bank") {
    agencies.push(FEDERAL_AGENCIES.find((a) => a.acronym === "OCC")!);
  } else if (params.creditorType === "state_bank") {
    agencies.push(FEDERAL_AGENCIES.find((a) => a.acronym === "FDIC")!);
  } else if (params.creditorType === "credit_union") {
    agencies.push(FEDERAL_AGENCIES.find((a) => a.acronym === "NCUA")!);
  }

  // Housing-related
  if (params.isHousingRelated) {
    agencies.push(FEDERAL_AGENCIES.find((a) => a.acronym === "HUD")!);
  }

  // Identity theft
  if (params.isIdentityTheft) {
    agencies.push(CONSUMER_RESOURCES.find((a) => a.acronym === "IDT")!);
  }

  // State AG
  if (params.state) {
    const stateAG = KEY_STATE_ATTORNEYS_GENERAL.find(
      (a) => a.acronym === `${params.state!.toUpperCase()} AG`
    );
    if (stateAG) agencies.push(stateAG);
  }

  return agencies.filter(Boolean);
}

/**
 * Get bureau contact info for disputes.
 */
export function getBureauContact(bureau: string): ConsumerAgency | undefined {
  return CREDIT_BUREAUS.find(
    (b) => b.name.toLowerCase().includes(bureau.toLowerCase())
  );
}

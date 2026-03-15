// ============================================================================
// CreditClean AI — Metro 2 Format Reference Data
//
// The Metro 2 format is the standardized data reporting format established by
// the Consumer Data Industry Association (CDIA) used by data furnishers to
// report consumer credit information to the three national credit bureaus.
//
// This module contains the codes, field rules, and validation logic needed to
// identify Metro 2 reporting violations in consumer credit reports.
// ============================================================================

// ---------------------------------------------------------------------------
// Account Status Codes (Base Segment Field 17)
// These define the current condition of the account.
// ---------------------------------------------------------------------------
export interface Metro2StatusCode {
  code: string;
  description: string;
  category: 'current' | 'delinquent' | 'closed' | 'derogatory';
  validTransitionsTo: string[];
  requiredFields: string[];
  prohibitedFields?: string[];
  notes?: string;
}

export const ACCOUNT_STATUS_CODES: Record<string, Metro2StatusCode> = {
  '11': {
    code: '11',
    description: 'Current account — paying as agreed',
    category: 'current',
    validTransitionsTo: ['13', '61', '62', '63', '64', '65', '71', '78', '80', '82', '83', '84', '93', '94', '95', '97', 'DA', 'DF'],
    requiredFields: ['currentBalance', 'dateReported', 'paymentHistory'],
  },
  '13': {
    code: '13',
    description: 'Paid or closed account — zero balance',
    category: 'closed',
    validTransitionsTo: ['DA', 'DF'],
    requiredFields: ['dateClosed', 'dateReported'],
    notes: 'Balance must be $0. If balance > $0, this is a Metro 2 violation.',
  },
  '61': {
    code: '61',
    description: '30 days past due',
    category: 'delinquent',
    validTransitionsTo: ['11', '62', '63', '64', '65', '71', '78', '80', '82', '83', '84', '93', '94', '95', '97', 'DA', 'DF'],
    requiredFields: ['amountPastDue', 'dateOfFirstDelinquency', 'paymentHistory'],
  },
  '62': {
    code: '62',
    description: '60 days past due',
    category: 'delinquent',
    validTransitionsTo: ['11', '61', '63', '64', '65', '71', '78', '80', '82', '83', '84', '93', '94', '95', '97', 'DA', 'DF'],
    requiredFields: ['amountPastDue', 'dateOfFirstDelinquency', 'paymentHistory'],
  },
  '63': {
    code: '63',
    description: '90 days past due',
    category: 'delinquent',
    validTransitionsTo: ['11', '61', '62', '64', '65', '71', '78', '80', '82', '83', '84', '93', '94', '95', '97', 'DA', 'DF'],
    requiredFields: ['amountPastDue', 'dateOfFirstDelinquency', 'paymentHistory'],
  },
  '64': {
    code: '64',
    description: '120 days past due',
    category: 'delinquent',
    validTransitionsTo: ['11', '61', '62', '63', '65', '71', '78', '80', '82', '83', '84', '93', '94', '95', '97', 'DA', 'DF'],
    requiredFields: ['amountPastDue', 'dateOfFirstDelinquency', 'paymentHistory'],
  },
  '65': {
    code: '65',
    description: '150 days past due',
    category: 'delinquent',
    validTransitionsTo: ['11', '61', '62', '63', '64', '71', '78', '80', '82', '83', '84', '93', '94', '95', '97', 'DA', 'DF'],
    requiredFields: ['amountPastDue', 'dateOfFirstDelinquency', 'paymentHistory'],
  },
  '71': {
    code: '71',
    description: '180+ days past due',
    category: 'delinquent',
    validTransitionsTo: ['11', '61', '62', '63', '64', '65', '78', '80', '82', '83', '84', '93', '94', '95', '97', 'DA', 'DF'],
    requiredFields: ['amountPastDue', 'dateOfFirstDelinquency', 'paymentHistory'],
  },
  '78': {
    code: '78',
    description: 'Foreclosure — proceedings completed',
    category: 'derogatory',
    validTransitionsTo: ['DA', 'DF'],
    requiredFields: ['dateOfFirstDelinquency', 'dateClosed'],
    notes: 'Must report DOFD. Reporting period: 7 years from DOFD.',
  },
  '80': {
    code: '80',
    description: 'Collection account',
    category: 'derogatory',
    validTransitionsTo: ['13', '82', '83', '84', '93', '94', '95', '97', 'DA', 'DF'],
    requiredFields: ['dateOfFirstDelinquency', 'originalCreditorName'],
    notes: 'Must include original creditor. DOFD must match the original tradeline DOFD, not the date assigned to collections.',
  },
  '82': {
    code: '82',
    description: 'Collection account — paid in full',
    category: 'derogatory',
    validTransitionsTo: ['DA', 'DF'],
    requiredFields: ['dateOfFirstDelinquency', 'originalCreditorName', 'datePaid'],
    notes: 'Balance must be $0. Was a collection, now paid.',
  },
  '83': {
    code: '83',
    description: 'Collection account — paid; was a charge-off',
    category: 'derogatory',
    validTransitionsTo: ['DA', 'DF'],
    requiredFields: ['dateOfFirstDelinquency', 'originalCreditorName'],
    notes: 'Balance must be $0.',
  },
  '84': {
    code: '84',
    description: 'Collection account — paid; was a repossession',
    category: 'derogatory',
    validTransitionsTo: ['DA', 'DF'],
    requiredFields: ['dateOfFirstDelinquency'],
    notes: 'Balance must be $0.',
  },
  '93': {
    code: '93',
    description: 'Account assigned to internal or external collections',
    category: 'derogatory',
    validTransitionsTo: ['11', '13', '80', '82', '83', '84', '94', '95', '97', 'DA', 'DF'],
    requiredFields: ['dateOfFirstDelinquency', 'amountPastDue'],
  },
  '94': {
    code: '94',
    description: 'Foreclosure — redeemed',
    category: 'derogatory',
    validTransitionsTo: ['11', '13', 'DA', 'DF'],
    requiredFields: ['dateOfFirstDelinquency'],
  },
  '95': {
    code: '95',
    description: 'Voluntary surrender',
    category: 'derogatory',
    validTransitionsTo: ['13', '82', '97', 'DA', 'DF'],
    requiredFields: ['dateOfFirstDelinquency'],
  },
  '97': {
    code: '97',
    description: 'Charge-off — unpaid balance reported as a loss',
    category: 'derogatory',
    validTransitionsTo: ['13', '82', '83', 'DA', 'DF'],
    requiredFields: ['dateOfFirstDelinquency', 'chargeOffAmount'],
    notes: 'Must report the charge-off amount. DOFD is mandatory.',
  },
  DA: {
    code: 'DA',
    description: 'Account closed — consumer deceased',
    category: 'closed',
    validTransitionsTo: [],
    requiredFields: ['dateClosed'],
  },
  DF: {
    code: 'DF',
    description: 'Account closed — consumer request or transfer',
    category: 'closed',
    validTransitionsTo: [],
    requiredFields: ['dateClosed'],
  },
};

// ---------------------------------------------------------------------------
// Payment Rating Codes (Base Segment Field 18)
// Must be consistent with Account Status Code.
// ---------------------------------------------------------------------------
export interface PaymentRatingCode {
  code: string;
  description: string;
  validWithStatus: string[];
}

export const PAYMENT_RATING_CODES: Record<string, PaymentRatingCode> = {
  '0': {
    code: '0',
    description: 'Current — paying as agreed, or too new to rate',
    validWithStatus: ['11', '13', 'DF'],
  },
  '1': {
    code: '1',
    description: '30-59 days past due',
    validWithStatus: ['61'],
  },
  '2': {
    code: '2',
    description: '60-89 days past due',
    validWithStatus: ['62'],
  },
  '3': {
    code: '3',
    description: '90-119 days past due',
    validWithStatus: ['63'],
  },
  '4': {
    code: '4',
    description: '120-149 days past due',
    validWithStatus: ['64'],
  },
  '5': {
    code: '5',
    description: '150-179 days past due',
    validWithStatus: ['65'],
  },
  '6': {
    code: '6',
    description: '180+ days past due',
    validWithStatus: ['71'],
  },
  G: {
    code: 'G',
    description: 'Collection',
    validWithStatus: ['80', '93'],
  },
  L: {
    code: 'L',
    description: 'Charge-off',
    validWithStatus: ['97'],
  },
};

// ---------------------------------------------------------------------------
// Compliance Condition Codes (Base Segment Field 24)
// Indicate special account conditions that affect reporting.
// ---------------------------------------------------------------------------
export interface ComplianceConditionCode {
  code: string;
  description: string;
  applicableSituations: string[];
}

export const COMPLIANCE_CONDITION_CODES: Record<string, ComplianceConditionCode> = {
  XA: {
    code: 'XA',
    description: 'Account closed at consumer request',
    applicableSituations: ['Consumer requested account closure'],
  },
  XB: {
    code: 'XB',
    description: 'Account closed at credit grantor request',
    applicableSituations: ['Creditor closed account'],
  },
  XC: {
    code: 'XC',
    description: 'Account closed — refinanced',
    applicableSituations: ['Account refinanced with same or different creditor'],
  },
  XD: {
    code: 'XD',
    description: 'Account closed — transferred',
    applicableSituations: ['Account transferred to another company'],
  },
  XF: {
    code: 'XF',
    description: 'Account paid — insurance claim',
    applicableSituations: ['Insurance paid the debt'],
  },
  XG: {
    code: 'XG',
    description: 'Account closed — government claim filed',
    applicableSituations: ['Government guarantee claim filed'],
  },
  XH: {
    code: 'XH',
    description: 'Foreclosure — completed',
    applicableSituations: ['Foreclosure proceedings completed'],
  },
  XJ: {
    code: 'XJ',
    description: 'Account closed — returned to dealer/merchant',
    applicableSituations: ['Merchandise returned'],
  },
  XR: {
    code: 'XR',
    description: 'Account in forbearance',
    applicableSituations: ['Account granted forbearance — should not show as delinquent during forbearance'],
  },
};

// ---------------------------------------------------------------------------
// Special Comment Codes (Base Segment Field 19)
// Provide additional context about account conditions.
// ---------------------------------------------------------------------------
export interface SpecialCommentCode {
  code: string;
  description: string;
  impact: 'positive' | 'neutral' | 'negative';
}

export const SPECIAL_COMMENT_CODES: Record<string, SpecialCommentCode> = {
  AC: { code: 'AC', description: 'Account closed at consumer request', impact: 'neutral' },
  AU: { code: 'AU', description: 'Authorized user account', impact: 'neutral' },
  AW: { code: 'AW', description: 'Affected by natural/declared disaster', impact: 'positive' },
  B: { code: 'B', description: 'Account payments managed by financial counseling program', impact: 'neutral' },
  BL: { code: 'BL', description: 'Balloon payment', impact: 'neutral' },
  BS: { code: 'BS', description: 'Account disputed — consumer disagrees', impact: 'neutral' },
  CH: { code: 'CH', description: 'Account being paid through Chapter 13 plan', impact: 'negative' },
  CO: { code: 'CO', description: 'Co-maker or guarantor', impact: 'neutral' },
  CP: { code: 'CP', description: 'Account closed — paid in full — was a charge-off', impact: 'neutral' },
  CW: { code: 'CW', description: 'Account closed — paid in full — was a collection', impact: 'neutral' },
  DE: { code: 'DE', description: 'Account paid — was a delinquency — now current', impact: 'positive' },
  IA: { code: 'IA', description: 'Account in forbearance', impact: 'neutral' },
  M: { code: 'M', description: 'Account closed at consumer request — zero balance', impact: 'neutral' },
  S: { code: 'S', description: 'Account settled — less than full balance', impact: 'negative' },
};

// ---------------------------------------------------------------------------
// ECOA Codes (Base Segment Field 5)
// Equal Credit Opportunity Act — defines the consumer's relationship to the account.
// ---------------------------------------------------------------------------
export interface ECOACode {
  code: string;
  description: string;
  maxAssociatedConsumers: number;
}

export const ECOA_CODES: Record<string, ECOACode> = {
  '1': { code: '1', description: 'Individual account — sole responsibility', maxAssociatedConsumers: 1 },
  '2': { code: '2', description: 'Joint contractual liability — both parties responsible', maxAssociatedConsumers: 2 },
  '3': { code: '3', description: 'Authorized user — no contractual liability', maxAssociatedConsumers: 1 },
  '5': { code: '5', description: 'Co-maker/co-signer — secondary liability', maxAssociatedConsumers: 2 },
  '7': { code: '7', description: 'Maker — on behalf of another person', maxAssociatedConsumers: 1 },
  T: { code: 'T', description: 'Terminated — permissible use only', maxAssociatedConsumers: 0 },
  W: { code: 'W', description: 'Business account — individual guarantee', maxAssociatedConsumers: 1 },
  X: { code: 'X', description: 'Deceased — joint account', maxAssociatedConsumers: 1 },
  Z: { code: 'Z', description: 'Deleted — previously reported consumer', maxAssociatedConsumers: 0 },
};

// ---------------------------------------------------------------------------
// Account Type Codes (Base Segment Field 11)
// ---------------------------------------------------------------------------
export const ACCOUNT_TYPE_CODES: Record<string, string> = {
  '00': 'Auto loan',
  '01': 'Unsecured loan',
  '02': 'Secured loan',
  '03': 'Credit card',
  '04': 'Line of credit',
  '05': 'Real estate mortgage — conventional',
  '06': 'Real estate mortgage — FHA',
  '07': 'Real estate mortgage — VA',
  '08': 'Real estate mortgage — USDA/FmHA',
  '09': 'Real estate — manufactured housing',
  '10': 'Home equity line of credit (HELOC)',
  '11': 'Home improvement loan',
  '12': 'Retail/department store revolving',
  '13': 'Check credit / line of credit',
  '15': 'Student loan',
  '17': 'Collection — debt buyer',
  '18': 'Timeshare loan',
  '19': 'Recreational vehicle loan',
  '20': 'Business credit card',
  '25': 'Home equity loan — closed-end',
  '26': 'Consolidated student loan',
  '29': 'Rental agreement',
  '37': 'Flexible spending credit card',
  '43': 'Government fee for service',
  '47': 'Credit card — private label',
  '48': 'Collection agency / attorney',
  '65': 'Government secured direct loan',
  '66': 'Government unsecured guaranteed loan',
  '67': 'Government unsecured direct loan',
  '68': 'Government secured guaranteed loan',
  '69': 'Government fine',
  '70': 'Government overinsured fee for service',
  '71': 'Government administrative wage garnishment',
  '72': 'Government miscellaneous debt',
  '73': 'Government Treasury cross-servicing',
  '77': 'Telecommunications / cellular',
  '85': 'Medical debt — provider',
  '86': 'Medical debt — assigned to collections',
  '89': 'Utility company',
  '90': 'Debt consolidation',
  '91': 'Child support',
  '92': 'Lease',
  '93': 'Note loan',
  '95': 'Family support',
  '9A': 'PACE assessment — clean energy',
  '9B': 'Construction loan',
};

// ---------------------------------------------------------------------------
// Metro 2 Reporting Rules — cross-field validation rules
// ---------------------------------------------------------------------------
export interface Metro2Rule {
  id: string;
  description: string;
  category: 'status_balance' | 'date_consistency' | 'required_field' | 'payment_history' | 'collection_rules' | 'closed_account';
  severity: 'critical' | 'severe' | 'moderate';
  cdiaParagraph?: string;
}

export const METRO2_RULES: Metro2Rule[] = [
  // Status-Balance consistency
  {
    id: 'M2-001',
    description: 'Paid/closed account (Status 13) must report $0 balance',
    category: 'status_balance',
    severity: 'critical',
    cdiaParagraph: 'Base Segment Field 17/21',
  },
  {
    id: 'M2-002',
    description: 'Paid collection (Status 82/83/84) must report $0 balance',
    category: 'status_balance',
    severity: 'critical',
    cdiaParagraph: 'Base Segment Field 17/21',
  },
  {
    id: 'M2-003',
    description: 'Charge-off (Status 97) must report the charge-off amount',
    category: 'status_balance',
    severity: 'severe',
    cdiaParagraph: 'Base Segment Fields 17/36',
  },
  {
    id: 'M2-004',
    description: 'Current account (Status 11) must not report amount past due',
    category: 'status_balance',
    severity: 'severe',
    cdiaParagraph: 'Base Segment Fields 17/22',
  },
  {
    id: 'M2-005',
    description: 'Delinquent account (Status 61-71) must report amount past due > $0',
    category: 'status_balance',
    severity: 'severe',
    cdiaParagraph: 'Base Segment Fields 17/22',
  },

  // Date consistency
  {
    id: 'M2-010',
    description: 'Date of First Delinquency (DOFD) is required for all derogatory accounts',
    category: 'date_consistency',
    severity: 'critical',
    cdiaParagraph: 'Base Segment Field 25',
  },
  {
    id: 'M2-011',
    description: 'DOFD must not change once reported — it is frozen at the original delinquency date',
    category: 'date_consistency',
    severity: 'critical',
    cdiaParagraph: 'CDIA Metro 2 Manual §6.3',
  },
  {
    id: 'M2-012',
    description: 'Date Reported must not be in the future',
    category: 'date_consistency',
    severity: 'severe',
    cdiaParagraph: 'Base Segment Field 7',
  },
  {
    id: 'M2-013',
    description: 'Date Opened must not be after Date Reported',
    category: 'date_consistency',
    severity: 'severe',
    cdiaParagraph: 'Base Segment Fields 8/7',
  },
  {
    id: 'M2-014',
    description: 'For collections, the DOFD must match the original tradeline DOFD — not the collection assignment date',
    category: 'date_consistency',
    severity: 'critical',
    cdiaParagraph: 'FCRA §623(a)(5) / CDIA Metro 2 Manual §6.3',
  },
  {
    id: 'M2-015',
    description: 'Date Closed must not be before Date Opened',
    category: 'date_consistency',
    severity: 'severe',
    cdiaParagraph: 'Base Segment Fields 8/12',
  },

  // Required fields
  {
    id: 'M2-020',
    description: 'Collection accounts (Status 80) must report the original creditor name',
    category: 'required_field',
    severity: 'critical',
    cdiaParagraph: 'Base Segment Field 43 / K1 Segment',
  },
  {
    id: 'M2-021',
    description: 'Charge-off accounts must report the charge-off amount in the designated field',
    category: 'required_field',
    severity: 'severe',
    cdiaParagraph: 'Base Segment Field 36',
  },
  {
    id: 'M2-022',
    description: 'Account Type code is required and must match the type of credit extended',
    category: 'required_field',
    severity: 'moderate',
    cdiaParagraph: 'Base Segment Field 11',
  },

  // Payment history
  {
    id: 'M2-030',
    description: 'Payment History Profile must contain exactly 24 months of history when the account is at least 24 months old',
    category: 'payment_history',
    severity: 'moderate',
    cdiaParagraph: 'Base Segment Field 25A-25X',
  },
  {
    id: 'M2-031',
    description: 'Payment History must be consistent with Account Status — a "current" month in payment history must not show delinquent status for that month',
    category: 'payment_history',
    severity: 'severe',
    cdiaParagraph: 'Base Segment Fields 17/25A-25X',
  },
  {
    id: 'M2-032',
    description: 'During forbearance, payment history must not report delinquency for the forbearance period',
    category: 'payment_history',
    severity: 'critical',
    cdiaParagraph: 'CARES Act §4021 / Base Segment Field 25A-25X',
  },

  // Collection-specific rules
  {
    id: 'M2-040',
    description: 'Collector must not report a balance higher than the original balance unless fees are authorized by the original agreement',
    category: 'collection_rules',
    severity: 'severe',
    cdiaParagraph: 'Base Segment Field 21 / FDCPA §808(1)',
  },
  {
    id: 'M2-041',
    description: 'Both original tradeline and collection must not simultaneously report a balance — only one may carry the balance',
    category: 'collection_rules',
    severity: 'critical',
    cdiaParagraph: 'CDIA Metro 2 Manual §7.1',
  },
  {
    id: 'M2-042',
    description: 'Medical debt must not be reported until 365 days after the date of first delinquency (effective 2023)',
    category: 'collection_rules',
    severity: 'critical',
    cdiaParagraph: 'CFPB Medical Debt Rule / NCAP',
  },

  // Closed account rules
  {
    id: 'M2-050',
    description: 'Closed accounts must report Date Closed field',
    category: 'closed_account',
    severity: 'severe',
    cdiaParagraph: 'Base Segment Field 12',
  },
  {
    id: 'M2-051',
    description: 'Account closed by consumer request should use Compliance Condition Code XA',
    category: 'closed_account',
    severity: 'moderate',
    cdiaParagraph: 'Base Segment Field 24',
  },
];

// ---------------------------------------------------------------------------
// Status-to-text mapping for plain-language matching from credit reports
// (used by the validator to map report text to Metro 2 status codes)
// ---------------------------------------------------------------------------
export const STATUS_TEXT_TO_CODE: [RegExp, string][] = [
  [/^current$|paying as agreed|pays as agreed|paid as agreed|current account/i, '11'],
  [/^paid$|paid.?in.?full|closed.?paid|paid.?closed|zero.?balance.*closed/i, '13'],
  [/30.?day|30.?past.?due|30.?dpd/i, '61'],
  [/60.?day|60.?past.?due|60.?dpd/i, '62'],
  [/90.?day|90.?past.?due|90.?dpd/i, '63'],
  [/120.?day|120.?past.?due|120.?dpd/i, '64'],
  [/150.?day|150.?past.?due|150.?dpd/i, '65'],
  [/180.?day|180.?past.?due|180.?dpd/i, '71'],
  [/foreclos/i, '78'],
  [/collection|placed.?for.?collection|assigned.?to.?collection/i, '80'],
  [/paid.?collection|collection.*paid/i, '82'],
  [/charge.?off.*paid|paid.*charge.?off/i, '83'],
  [/repossess.*paid|paid.*repossess/i, '84'],
  [/assigned.*internal|transferred.*collection/i, '93'],
  [/foreclosure.*redeemed|redeemed.*foreclosure/i, '94'],
  [/voluntary.?surrender/i, '95'],
  [/charge.?off|charged.?off|written.?off/i, '97'],
  [/deceased/i, 'DA'],
  [/settled|settlement/i, '13'], // Settled accounts should be Status 13 with Special Comment S
];

// ---------------------------------------------------------------------------
// Infer Metro 2 status code from plain-text report status
// ---------------------------------------------------------------------------
export function inferStatusCode(statusText: string): string | null {
  for (const [pattern, code] of STATUS_TEXT_TO_CODE) {
    if (pattern.test(statusText)) return code;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Get expected status code description for validation messages
// ---------------------------------------------------------------------------
export function getStatusDescription(code: string): string {
  return ACCOUNT_STATUS_CODES[code]?.description ?? `Unknown status code ${code}`;
}

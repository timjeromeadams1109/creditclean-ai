// ============================================================================
// CreditClean AI — Credit Report Parser & Utilities
// ============================================================================

export interface ParsedCreditItem {
  accountName: string;
  accountNumber: string;
  accountType: 'revolving' | 'installment' | 'mortgage' | 'collection' | 'other';
  currentStatus: string;
  paymentStatus: string;
  dateOpened: string;
  dateReported: string;
  dateOfFirstDelinquency?: string;
  lastPaymentDate?: string;
  balance: number;
  originalBalance?: number;
  highBalance?: number;
  creditLimit?: number;
  monthlyPayment?: number;
  pastDueAmount?: number;
  originalCreditor?: string;
  collectorName?: string;
  isCollection: boolean;
  isMedical: boolean;
  isStudentLoan: boolean;
  paymentHistory?: string;
  comments?: string;
  disputeHistory?: string;
  isAuthorizedUser?: boolean;
  isJointAccount?: boolean;
}

// ---------------------------------------------------------------------------
// Statute of Limitations by State & Debt Type (years)
// Keys: written_contract, oral, open_ended (revolving), promissory_note
// ---------------------------------------------------------------------------
export const STATE_SOL_MAP: Record<
  string,
  Record<string, number>
> = {
  AL: { written_contract: 6, oral: 6, open_ended: 3, promissory_note: 6 },
  AK: { written_contract: 3, oral: 3, open_ended: 3, promissory_note: 3 },
  AZ: { written_contract: 6, oral: 3, open_ended: 6, promissory_note: 6 },
  AR: { written_contract: 5, oral: 3, open_ended: 5, promissory_note: 5 },
  CA: { written_contract: 4, oral: 2, open_ended: 4, promissory_note: 4 },
  CO: { written_contract: 6, oral: 6, open_ended: 6, promissory_note: 6 },
  CT: { written_contract: 6, oral: 3, open_ended: 6, promissory_note: 6 },
  DE: { written_contract: 3, oral: 3, open_ended: 3, promissory_note: 3 },
  FL: { written_contract: 5, oral: 4, open_ended: 4, promissory_note: 5 },
  GA: { written_contract: 6, oral: 4, open_ended: 6, promissory_note: 6 },
  HI: { written_contract: 6, oral: 6, open_ended: 6, promissory_note: 6 },
  ID: { written_contract: 5, oral: 4, open_ended: 5, promissory_note: 5 },
  IL: { written_contract: 5, oral: 5, open_ended: 5, promissory_note: 5 },
  IN: { written_contract: 6, oral: 6, open_ended: 6, promissory_note: 6 },
  IA: { written_contract: 5, oral: 5, open_ended: 5, promissory_note: 5 },
  KS: { written_contract: 5, oral: 3, open_ended: 5, promissory_note: 5 },
  KY: { written_contract: 5, oral: 5, open_ended: 5, promissory_note: 5 },
  LA: { written_contract: 3, oral: 3, open_ended: 3, promissory_note: 3 },
  ME: { written_contract: 6, oral: 6, open_ended: 6, promissory_note: 6 },
  MD: { written_contract: 3, oral: 3, open_ended: 3, promissory_note: 3 },
  MA: { written_contract: 6, oral: 6, open_ended: 6, promissory_note: 6 },
  MI: { written_contract: 6, oral: 6, open_ended: 6, promissory_note: 6 },
  MN: { written_contract: 6, oral: 6, open_ended: 6, promissory_note: 6 },
  MS: { written_contract: 3, oral: 3, open_ended: 3, promissory_note: 3 },
  MO: { written_contract: 5, oral: 5, open_ended: 5, promissory_note: 5 },
  MT: { written_contract: 5, oral: 3, open_ended: 5, promissory_note: 5 },
  NE: { written_contract: 5, oral: 4, open_ended: 5, promissory_note: 5 },
  NV: { written_contract: 6, oral: 4, open_ended: 4, promissory_note: 6 },
  NH: { written_contract: 3, oral: 3, open_ended: 3, promissory_note: 3 },
  NJ: { written_contract: 6, oral: 6, open_ended: 6, promissory_note: 6 },
  NM: { written_contract: 6, oral: 4, open_ended: 4, promissory_note: 6 },
  NY: { written_contract: 6, oral: 6, open_ended: 6, promissory_note: 6 },
  NC: { written_contract: 3, oral: 3, open_ended: 3, promissory_note: 3 },
  ND: { written_contract: 6, oral: 6, open_ended: 6, promissory_note: 6 },
  OH: { written_contract: 6, oral: 6, open_ended: 6, promissory_note: 6 },
  OK: { written_contract: 5, oral: 3, open_ended: 5, promissory_note: 5 },
  OR: { written_contract: 6, oral: 6, open_ended: 6, promissory_note: 6 },
  PA: { written_contract: 4, oral: 4, open_ended: 4, promissory_note: 4 },
  RI: { written_contract: 5, oral: 5, open_ended: 5, promissory_note: 5 },
  SC: { written_contract: 3, oral: 3, open_ended: 3, promissory_note: 3 },
  SD: { written_contract: 6, oral: 6, open_ended: 6, promissory_note: 6 },
  TN: { written_contract: 6, oral: 6, open_ended: 6, promissory_note: 6 },
  TX: { written_contract: 4, oral: 4, open_ended: 4, promissory_note: 4 },
  UT: { written_contract: 6, oral: 4, open_ended: 4, promissory_note: 6 },
  VT: { written_contract: 6, oral: 6, open_ended: 6, promissory_note: 6 },
  VA: { written_contract: 5, oral: 3, open_ended: 3, promissory_note: 5 },
  WA: { written_contract: 6, oral: 3, open_ended: 6, promissory_note: 6 },
  WV: { written_contract: 6, oral: 5, open_ended: 5, promissory_note: 6 },
  WI: { written_contract: 6, oral: 6, open_ended: 6, promissory_note: 6 },
  WY: { written_contract: 8, oral: 8, open_ended: 8, promissory_note: 8 },
  DC: { written_contract: 3, oral: 3, open_ended: 3, promissory_note: 3 },
};

// ---------------------------------------------------------------------------
// Parse manual entry from form data into a ParsedCreditItem
// ---------------------------------------------------------------------------
export function parseManualEntry(data: Record<string, unknown>): ParsedCreditItem {
  const str = (key: string, fallback = ''): string =>
    typeof data[key] === 'string' ? (data[key] as string) : fallback;
  const num = (key: string, fallback = 0): number => {
    const v = data[key];
    if (typeof v === 'number') return v;
    if (typeof v === 'string') {
      const parsed = parseFloat(v.replace(/[$,]/g, ''));
      return isNaN(parsed) ? fallback : parsed;
    }
    return fallback;
  };
  const bool = (key: string): boolean => Boolean(data[key]);

  const accountType = str('accountType', 'other') as ParsedCreditItem['accountType'];
  const currentStatus = str('currentStatus').toLowerCase();

  return {
    accountName: str('accountName'),
    accountNumber: str('accountNumber'),
    accountType,
    currentStatus: str('currentStatus'),
    paymentStatus: str('paymentStatus', 'Unknown'),
    dateOpened: str('dateOpened'),
    dateReported: str('dateReported'),
    dateOfFirstDelinquency: str('dateOfFirstDelinquency') || undefined,
    lastPaymentDate: str('lastPaymentDate') || undefined,
    balance: num('balance'),
    originalBalance: data.originalBalance !== undefined ? num('originalBalance') : undefined,
    highBalance: data.highBalance !== undefined ? num('highBalance') : undefined,
    creditLimit: data.creditLimit !== undefined ? num('creditLimit') : undefined,
    monthlyPayment: data.monthlyPayment !== undefined ? num('monthlyPayment') : undefined,
    pastDueAmount: data.pastDueAmount !== undefined ? num('pastDueAmount') : undefined,
    originalCreditor: str('originalCreditor') || undefined,
    collectorName: str('collectorName') || undefined,
    isCollection:
      bool('isCollection') ||
      accountType === 'collection' ||
      currentStatus.includes('collection'),
    isMedical: bool('isMedical') || /medical|hospital|health|clinic|doctor/i.test(str('accountName')),
    isStudentLoan:
      bool('isStudentLoan') ||
      /student loan|dept of ed|navient|nelnet|mohela|fedloan|great lakes|sallie mae/i.test(
        str('accountName'),
      ),
    paymentHistory: str('paymentHistory') || undefined,
    comments: str('comments') || undefined,
    disputeHistory: str('disputeHistory') || undefined,
    isAuthorizedUser: data.isAuthorizedUser !== undefined ? bool('isAuthorizedUser') : undefined,
    isJointAccount: data.isJointAccount !== undefined ? bool('isJointAccount') : undefined,
  };
}

// ---------------------------------------------------------------------------
// Calculate how old a negative item is from its date of first delinquency
// ---------------------------------------------------------------------------
export function calculateItemAge(dateOfFirstDelinquency: string): {
  years: number;
  months: number;
  isExpired: boolean;
} {
  const dfd = new Date(dateOfFirstDelinquency);
  if (isNaN(dfd.getTime())) {
    return { years: 0, months: 0, isExpired: false };
  }

  const now = new Date();
  let years = now.getFullYear() - dfd.getFullYear();
  let months = now.getMonth() - dfd.getMonth();
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  // FCRA §605: 7-year reporting limit from date of first delinquency
  const isExpired = years > 7 || (years === 7 && months > 0);

  return { years, months, isExpired };
}

// ---------------------------------------------------------------------------
// Detect duplicate entries (same debt reported multiple times)
// ---------------------------------------------------------------------------
export function detectDuplicates(
  items: ParsedCreditItem[],
): { duplicateGroups: ParsedCreditItem[][]; reason: string }[] {
  const results: { duplicateGroups: ParsedCreditItem[][]; reason: string }[] = [];

  // Strategy 1: Same account number (last 4+ digits match) with different creditor names
  const byPartialAcct: Record<string, ParsedCreditItem[]> = {};
  for (const item of items) {
    const last4 = item.accountNumber.replace(/[^0-9]/g, '').slice(-4);
    if (last4.length >= 4) {
      const key = `${last4}-${item.balance}`;
      if (!byPartialAcct[key]) byPartialAcct[key] = [];
      byPartialAcct[key].push(item);
    }
  }
  for (const [, group] of Object.entries(byPartialAcct)) {
    if (group.length > 1) {
      results.push({
        duplicateGroups: [group],
        reason: 'Same account number suffix and balance — likely duplicate or transferred debt',
      });
    }
  }

  // Strategy 2: Collection + original tradeline for the same debt
  const collections = items.filter((i) => i.isCollection && i.originalCreditor);
  for (const coll of collections) {
    const originals = items.filter(
      (i) =>
        !i.isCollection &&
        i.accountName.toLowerCase().includes(coll.originalCreditor!.toLowerCase()),
    );
    if (originals.length > 0) {
      results.push({
        duplicateGroups: [[coll, ...originals]],
        reason:
          'Collection account has a matching original tradeline — both should not report a balance',
      });
    }
  }

  // Strategy 3: Same creditor name with very similar balances (within 5%)
  const byCreditor: Record<string, ParsedCreditItem[]> = {};
  for (const item of items) {
    const key = item.accountName.toLowerCase().replace(/[^a-z]/g, '');
    if (!byCreditor[key]) byCreditor[key] = [];
    byCreditor[key].push(item);
  }
  for (const [, group] of Object.entries(byCreditor)) {
    if (group.length > 1) {
      for (let i = 0; i < group.length; i++) {
        for (let j = i + 1; j < group.length; j++) {
          const a = group[i];
          const b = group[j];
          if (a.balance > 0 && b.balance > 0) {
            const diff = Math.abs(a.balance - b.balance);
            const avg = (a.balance + b.balance) / 2;
            if (diff / avg < 0.05) {
              results.push({
                duplicateGroups: [[a, b]],
                reason: `Same creditor "${a.accountName}" with nearly identical balances ($${a.balance} vs $${b.balance})`,
              });
            }
          }
        }
      }
    }
  }

  return results;
}

// ---------------------------------------------------------------------------
// Get statute of limitations for a given state and debt type
// ---------------------------------------------------------------------------
export function getStatuteOfLimitations(
  state: string,
  debtType: string,
  dateOfLastActivity?: string,
): { years: number; expired: boolean } {
  const stateUpper = state.toUpperCase();
  const stateData = STATE_SOL_MAP[stateUpper];

  if (!stateData) {
    // Default to 6 years if state not found
    return { years: 6, expired: false };
  }

  // Map account types to SOL debt categories
  const typeMap: Record<string, string> = {
    revolving: 'open_ended',
    credit_card: 'open_ended',
    open_ended: 'open_ended',
    installment: 'written_contract',
    mortgage: 'written_contract',
    written_contract: 'written_contract',
    auto: 'written_contract',
    personal_loan: 'written_contract',
    oral: 'oral',
    promissory_note: 'promissory_note',
    student_loan: 'promissory_note',
    medical: 'open_ended',
    collection: 'open_ended',
  };

  const solCategory = typeMap[debtType.toLowerCase()] || 'written_contract';
  const years = stateData[solCategory] || 6;

  let expired = false;
  if (dateOfLastActivity) {
    const lastActivity = new Date(dateOfLastActivity);
    if (!isNaN(lastActivity.getTime())) {
      const now = new Date();
      const diffMs = now.getTime() - lastActivity.getTime();
      const diffYears = diffMs / (1000 * 60 * 60 * 24 * 365.25);
      expired = diffYears >= years;
    }
  }

  return { years, expired };
}

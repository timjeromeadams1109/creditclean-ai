// ============================================================================
// CreditClean AI — Metro 2 Compliance Validator
//
// Validates parsed credit report items against CDIA Metro 2 Format rules.
// Produces structured violations that can be cited in dispute letters.
// ============================================================================

import type { ParsedCreditItem } from './report-parser';
import type { ForensicViolation } from './types';
import {
  ACCOUNT_STATUS_CODES,
  METRO2_RULES,
  inferStatusCode,
  getStatusDescription,
} from './metro2-reference';

// ---------------------------------------------------------------------------
// Metro2Violation — extends ForensicViolation with Metro 2-specific fields
// ---------------------------------------------------------------------------
export interface Metro2Violation extends ForensicViolation {
  metro2RuleId: string;
  metro2Field?: string;
  expectedValue?: string;
  actualValue?: string;
  cdiaParagraph?: string;
}

// ---------------------------------------------------------------------------
// validateMetro2Compliance — run all Metro 2 checks on a single credit item
// ---------------------------------------------------------------------------
export function validateMetro2Compliance(
  item: ParsedCreditItem,
  reportDate: string,
  allItems: ParsedCreditItem[] = [],
): Metro2Violation[] {
  const violations: Metro2Violation[] = [];
  const inferredStatus = inferStatusCode(item.currentStatus);
  const statusDef = inferredStatus ? ACCOUNT_STATUS_CODES[inferredStatus] : null;

  // =========================================================================
  // STATUS-BALANCE CONSISTENCY (M2-001 through M2-005)
  // =========================================================================

  // M2-001: Paid/closed (Status 13) must have $0 balance
  if (
    inferredStatus === '13' &&
    item.balance > 0
  ) {
    violations.push(buildViolation(
      'M2-001',
      item,
      'Status/balance inconsistency — paid/closed account reporting a balance',
      `This account reports a status of "${item.currentStatus}" which maps to Metro 2 Account Status Code 13 (Paid/Closed — zero balance). However, the account still reports a balance of $${item.balance.toLocaleString()}. Per CDIA Metro 2 Format guidelines, Status Code 13 requires the Current Balance (Field 21) to be $0.`,
      `Status: "${item.currentStatus}" (Metro 2 Code 13). Balance: $${item.balance}. Expected: $0.`,
      'critical',
      'Account Status Code 13',
      '$0',
      `$${item.balance}`,
    ));
  }

  // M2-002: Paid collection (Status 82/83/84) must have $0 balance
  if (
    inferredStatus && ['82', '83', '84'].includes(inferredStatus) &&
    item.balance > 0
  ) {
    violations.push(buildViolation(
      'M2-002',
      item,
      'Status/balance inconsistency — paid collection reporting a balance',
      `This account reports a status consistent with Metro 2 Status Code ${inferredStatus} (${getStatusDescription(inferredStatus)}), but still carries a balance of $${item.balance.toLocaleString()}. Per Metro 2 Format rules, paid collection accounts must report a $0 balance.`,
      `Inferred Status Code: ${inferredStatus}. Balance: $${item.balance}. Expected: $0.`,
      'critical',
      `Account Status Code ${inferredStatus}`,
      '$0',
      `$${item.balance}`,
    ));
  }

  // M2-003: Charge-off (Status 97) must report a charge-off amount
  if (
    inferredStatus === '97' &&
    (item.originalBalance === undefined || item.originalBalance === 0)
  ) {
    violations.push(buildViolation(
      'M2-003',
      item,
      'Missing charge-off amount on charge-off account',
      `This account is reported as a charge-off (Metro 2 Status Code 97) but does not include the required charge-off amount in the Original Amount/Charge-Off Amount field (Field 36). Per CDIA Metro 2 guidelines, furnishers must report the actual dollar amount charged off.`,
      `Status: charge-off (Code 97). Charge-off amount: not reported.`,
      'severe',
      'Charge-Off Amount (Field 36)',
    ));
  }

  // M2-004: Current (Status 11) should not report amount past due
  if (
    inferredStatus === '11' &&
    item.pastDueAmount !== undefined &&
    item.pastDueAmount > 0
  ) {
    violations.push(buildViolation(
      'M2-004',
      item,
      'Current account reporting amount past due',
      `This account is reported as current (Metro 2 Status Code 11 — paying as agreed) but reports an amount past due of $${item.pastDueAmount.toLocaleString()}. Per Metro 2 Format rules, Account Status Code 11 is incompatible with a past-due amount greater than $0. Either the status or the past-due amount is inaccurately reported.`,
      `Status: current (Code 11). Amount past due: $${item.pastDueAmount}. Expected: $0.`,
      'severe',
      'Amount Past Due (Field 22)',
      '$0',
      `$${item.pastDueAmount}`,
    ));
  }

  // M2-005: Delinquent (Status 61-71) must report amount past due
  if (
    inferredStatus && ['61', '62', '63', '64', '65', '71'].includes(inferredStatus) &&
    (item.pastDueAmount === undefined || item.pastDueAmount === 0) &&
    item.balance > 0
  ) {
    violations.push(buildViolation(
      'M2-005',
      item,
      'Delinquent account not reporting amount past due',
      `This account is reported as delinquent (Metro 2 Status Code ${inferredStatus} — ${getStatusDescription(inferredStatus)}) but does not report an amount past due. Per Metro 2 Format rules, delinquent accounts must report the Amount Past Due (Field 22) as greater than $0.`,
      `Status Code: ${inferredStatus}. Amount past due: $0 or missing. Balance: $${item.balance}.`,
      'severe',
      'Amount Past Due (Field 22)',
    ));
  }

  // =========================================================================
  // DATE CONSISTENCY (M2-010 through M2-015)
  // =========================================================================

  const isDerogatory = statusDef?.category === 'derogatory' ||
    statusDef?.category === 'delinquent' ||
    item.isCollection ||
    /charge.?off|collection|repossess|foreclos|delinquent|past.?due|written.?off/i.test(item.currentStatus);

  // M2-010: DOFD required for derogatory accounts
  if (isDerogatory && !item.dateOfFirstDelinquency) {
    violations.push(buildViolation(
      'M2-010',
      item,
      'Missing Date of First Delinquency on derogatory account',
      `This derogatory account does not report a Date of First Delinquency (DOFD). Per CDIA Metro 2 Format (Base Segment Field 25) and FCRA §623(a)(5), furnishers are required to report the DOFD for all derogatory accounts. The DOFD determines the 7-year reporting period — without it, the account is unverifiable and the reporting period cannot be properly calculated.`,
      `Account: "${item.accountName}". Status: "${item.currentStatus}". DOFD: not reported.`,
      'critical',
      'Date of First Delinquency (Field 25)',
    ));
  }

  // M2-012: Date Reported must not be in the future
  if (item.dateReported) {
    const reported = new Date(item.dateReported);
    const now = new Date();
    if (!isNaN(reported.getTime()) && reported > now) {
      violations.push(buildViolation(
        'M2-012',
        item,
        'Date Reported is in the future',
        `The Date Reported (Metro 2 Field 7) is ${item.dateReported}, which is a future date. Per Metro 2 Format rules, the Date Reported must reflect the actual date the information was furnished, not a future date.`,
        `Date Reported: ${item.dateReported}. Current date: ${reportDate}.`,
        'severe',
        'Date Reported (Field 7)',
        `On or before ${reportDate}`,
        item.dateReported,
      ));
    }
  }

  // M2-013: Date Opened must not be after Date Reported
  if (item.dateOpened && item.dateReported) {
    const opened = new Date(item.dateOpened);
    const reported = new Date(item.dateReported);
    if (!isNaN(opened.getTime()) && !isNaN(reported.getTime()) && opened > reported) {
      violations.push(buildViolation(
        'M2-013',
        item,
        'Date Opened is after Date Reported — chronological inconsistency',
        `The Date Opened (${item.dateOpened}) is more recent than the Date Reported (${item.dateReported}). Per Metro 2 Format rules, the Date Opened (Field 8) must precede or equal the Date Reported (Field 7). This chronological inconsistency indicates inaccurate data.`,
        `Date Opened: ${item.dateOpened}. Date Reported: ${item.dateReported}.`,
        'severe',
        'Date Opened (Field 8)',
      ));
    }
  }

  // M2-014: Collection DOFD must match original tradeline DOFD
  if (item.isCollection && item.dateOfFirstDelinquency && item.dateOpened) {
    const dofd = new Date(item.dateOfFirstDelinquency);
    const opened = new Date(item.dateOpened);
    if (!isNaN(dofd.getTime()) && !isNaN(opened.getTime())) {
      // If DOFD equals or is near the open date, the collector likely set DOFD to
      // their own assignment date instead of the original tradeline DOFD
      const diffDays = Math.abs(opened.getTime() - dofd.getTime()) / (1000 * 60 * 60 * 24);
      if (diffDays < 30) {
        violations.push(buildViolation(
          'M2-014',
          item,
          'Collection DOFD appears to match assignment date — not original tradeline DOFD',
          `This collection account's Date of First Delinquency (${item.dateOfFirstDelinquency}) is within 30 days of the account open date (${item.dateOpened}), suggesting the collector set the DOFD to their own assignment date rather than the original tradeline's DOFD. Per CDIA Metro 2 Manual §6.3 and FCRA §623(a)(5), the DOFD on a collection must match the DOFD from the original creditor's account. Using the assignment date as the DOFD is a re-aging violation that artificially extends the 7-year reporting period.`,
          `DOFD: ${item.dateOfFirstDelinquency}. Collection opened: ${item.dateOpened}. Difference: ${Math.round(diffDays)} days.`,
          'critical',
          'Date of First Delinquency (Field 25)',
          'Original tradeline DOFD',
          item.dateOfFirstDelinquency,
        ));
      }
    }
  }

  // =========================================================================
  // REQUIRED FIELDS (M2-020 through M2-022)
  // =========================================================================

  // M2-020: Collections must report original creditor
  if (
    item.isCollection &&
    inferredStatus === '80' &&
    !item.originalCreditor
  ) {
    violations.push(buildViolation(
      'M2-020',
      item,
      'Collection account missing original creditor name',
      `This collection account (Metro 2 Status Code 80) does not report the original creditor name. Per CDIA Metro 2 Format, collections must include the Original Creditor Name in Field 43 or the K1 Segment. Without the original creditor, the consumer cannot verify the legitimacy of the debt, and the account fails Metro 2 data completeness requirements.`,
      `Collection account "${item.accountName}". Original creditor: not reported.`,
      'critical',
      'Original Creditor Name (Field 43 / K1 Segment)',
    ));
  }

  // =========================================================================
  // PAYMENT HISTORY (M2-030 through M2-032)
  // =========================================================================

  // M2-031: Payment history inconsistent with current status
  if (item.paymentHistory && inferredStatus) {
    const lastChar = item.paymentHistory.charAt(0); // Most recent month
    if (inferredStatus === '11' && /[1-6LG]/i.test(lastChar)) {
      violations.push(buildViolation(
        'M2-031',
        item,
        'Payment History inconsistent with Account Status — current status but delinquent history',
        `The account reports Metro 2 Status Code 11 (Current — paying as agreed), but the most recent Payment History Profile entry shows a delinquent or adverse code ("${lastChar}"). Per Metro 2 Format rules, the Payment History Profile must be consistent with the Account Status Code. If the account is current, the most recent payment history entry must reflect current status.`,
        `Status: 11 (Current). Most recent payment history: "${lastChar}".`,
        'severe',
        'Payment History Profile (Fields 25A-25X)',
      ));
    }
  }

  // =========================================================================
  // COLLECTION-SPECIFIC RULES (M2-040 through M2-042)
  // =========================================================================

  // M2-041: Both original tradeline and collection reporting a balance
  if (item.isCollection && item.balance > 0 && allItems.length > 1) {
    const originalName = item.originalCreditor?.toLowerCase();
    if (originalName) {
      const matchingOriginals = allItems.filter(
        (other) =>
          !other.isCollection &&
          other.accountName.toLowerCase().includes(originalName) &&
          other.balance > 0,
      );
      if (matchingOriginals.length > 0) {
        const orig = matchingOriginals[0];
        violations.push(buildViolation(
          'M2-041',
          item,
          'Dual balance reporting — both original tradeline and collection carry a balance',
          `Both the collection account ("${item.accountName}", balance $${item.balance}) and the original tradeline ("${orig.accountName}", balance $${orig.balance}) are reporting balances simultaneously. Per CDIA Metro 2 Manual §7.1, when a debt is placed in collection, only one entity — either the original creditor OR the collection agency — may report a balance. Dual balance reporting inflates the consumer's total reported debt and artificially depresses credit scores.`,
          `Collection: "${item.accountName}" ($${item.balance}). Original: "${orig.accountName}" ($${orig.balance}). Both active.`,
          'critical',
          'Current Balance (Field 21)',
        ));
      }
    }
  }

  // M2-042: Medical debt reported before 365-day waiting period (2023+ rule)
  if (item.isMedical && item.isCollection && item.dateOfFirstDelinquency && item.dateReported) {
    const dofd = new Date(item.dateOfFirstDelinquency);
    const reported = new Date(item.dateReported);
    if (!isNaN(dofd.getTime()) && !isNaN(reported.getTime())) {
      const diffDays = (reported.getTime() - dofd.getTime()) / (1000 * 60 * 60 * 24);
      if (diffDays < 365) {
        violations.push(buildViolation(
          'M2-042',
          item,
          'Medical debt reported before mandatory 365-day waiting period',
          `This medical collection was reported to credit bureaus ${Math.round(diffDays)} days after the date of first delinquency. Per the CFPB Medical Debt Rule (effective 2023) and CDIA Metro 2 reporting guidelines, medical debts must not appear on credit reports until at least 365 days after the DOFD to allow adequate time for insurance processing and billing resolution.`,
          `DOFD: ${item.dateOfFirstDelinquency}. Date reported: ${item.dateReported}. Days elapsed: ${Math.round(diffDays)}. Required: 365.`,
          'critical',
          'Date Reported (Field 7)',
          `On or after ${new Date(dofd.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}`,
          item.dateReported,
        ));
      }
    }
  }

  // =========================================================================
  // SETTLED ACCOUNT RULES
  // =========================================================================

  // Settled accounts should be Status 13 with zero balance
  if (/settled|settlement/i.test(item.currentStatus) && item.balance > 0) {
    violations.push(buildViolation(
      'M2-001',
      item,
      'Settled account reporting a balance',
      `This account reports a status of "${item.currentStatus}" (settled), which should map to Metro 2 Account Status Code 13 with Special Comment Code S (settled for less than full balance). Per Metro 2 Format rules, a settled account must report a $0 balance. The balance of $${item.balance.toLocaleString()} is inaccurate.`,
      `Status: "${item.currentStatus}" (should be Code 13 + Special Comment S). Balance: $${item.balance}. Expected: $0.`,
      'critical',
      'Account Status Code 13 / Special Comment S',
      '$0',
      `$${item.balance}`,
    ));
  }

  return violations;
}

// ---------------------------------------------------------------------------
// Helper — build a Metro2Violation from rule data
// ---------------------------------------------------------------------------
function buildViolation(
  ruleId: string,
  item: ParsedCreditItem,
  violationType: string,
  description: string,
  evidence: string,
  severity: 'critical' | 'severe' | 'moderate',
  metro2Field?: string,
  expectedValue?: string,
  actualValue?: string,
): Metro2Violation {
  const rule = METRO2_RULES.find((r) => r.id === ruleId);

  return {
    law: 'CDIA Metro 2 Format / FCRA §623(a)(1)',
    uscReference: '15 U.S.C. §1681s-2(a)(1)',
    violationType: `Metro 2 Violation [${ruleId}]: ${violationType}`,
    description,
    evidence,
    severity,
    actionableSteps: buildActionableSteps(ruleId, item),
    estimatedDamages: severity === 'critical'
      ? '$100-$1,000 statutory damages per violation under FCRA §616'
      : '$100-$500 statutory damages',
    metro2RuleId: ruleId,
    metro2Field,
    expectedValue,
    actualValue,
    cdiaParagraph: rule?.cdiaParagraph,
  };
}

// ---------------------------------------------------------------------------
// Generate actionable steps based on the specific Metro 2 rule violated
// ---------------------------------------------------------------------------
function buildActionableSteps(ruleId: string, item: ParsedCreditItem): string[] {
  const base = [
    `Send dispute letter to the credit bureau citing CDIA Metro 2 Format violation [${ruleId}] and FCRA §623(a)(1) — duty to report accurate information`,
  ];

  switch (ruleId) {
    case 'M2-001':
    case 'M2-002':
      return [
        ...base,
        'Demand the furnisher update the balance to $0 to match the reported account status per Metro 2 Format rules',
        'If not corrected within 30 days, file CFPB complaint citing specific Metro 2 field inconsistency',
      ];
    case 'M2-003':
      return [
        ...base,
        'Demand the furnisher report the charge-off amount per Metro 2 Base Segment Field 36',
        'Without the charge-off amount, the account data is incomplete and unverifiable',
      ];
    case 'M2-004':
    case 'M2-005':
      return [
        ...base,
        'The account status and amount past due are contradictory per Metro 2 Format — demand correction of whichever field is inaccurate',
        'If the furnisher cannot reconcile the discrepancy, the item should be deleted as unverifiable',
      ];
    case 'M2-010':
      return [
        ...base,
        'Without a Date of First Delinquency, the 7-year reporting period cannot be calculated — the item is unverifiable per FCRA §623(a)(5)',
        'Demand immediate deletion or correction to include the DOFD',
        'File CFPB complaint if not resolved within 30 days — missing DOFD is a well-established Metro 2 violation',
      ];
    case 'M2-014':
      return [
        ...base,
        'The DOFD on a collection must match the original creditor\'s DOFD — using the assignment date is re-aging, a serious Metro 2 and FCRA violation',
        'Demand the collector obtain and report the correct DOFD from the original creditor',
        'File CFPB complaint — re-aging is a willful violation that may warrant punitive damages under FCRA §616',
      ];
    case 'M2-020':
      return [
        ...base,
        'Per Metro 2 Format, Field 43 / K1 Segment must contain the original creditor name for all collection accounts',
        'Send debt validation letter under FDCPA §809(b) — if collector cannot identify the original creditor, the debt is unverifiable',
      ];
    case 'M2-031':
      return [
        ...base,
        'The Payment History Profile contradicts the Account Status Code — demand the furnisher reconcile this Metro 2 data inconsistency',
        'This type of inconsistency indicates the furnisher is not maintaining accurate Metro 2 records',
      ];
    case 'M2-041':
      return [
        ...base,
        'Per CDIA Metro 2 Manual §7.1, only one entity may report a balance on a given debt — dual balance reporting must be corrected',
        'Demand the original creditor update their balance to $0, or demand the collection balance be removed',
        'Dual balance reporting inflates total debt and is grounds for a CFPB complaint',
      ];
    case 'M2-042':
      return [
        ...base,
        'Medical debt was reported before the mandatory 365-day waiting period per CFPB Medical Debt Rule',
        'Demand immediate removal — the reporting itself is premature and violates current Metro 2 medical debt guidelines',
      ];
    default:
      return [
        ...base,
        'Demand correction of the Metro 2 Format violation within 30 days',
        'If not corrected, escalate to CFPB complaint citing specific Metro 2 field and rule',
      ];
  }
}

// ---------------------------------------------------------------------------
// Generate a Metro 2 compliance summary for a set of items
// ---------------------------------------------------------------------------
export interface Metro2ComplianceSummary {
  totalChecked: number;
  totalViolations: number;
  criticalCount: number;
  severeCount: number;
  moderateCount: number;
  violationsByRule: Record<string, number>;
  violationsByCategory: Record<string, number>;
  overallCompliance: 'compliant' | 'minor_issues' | 'non_compliant' | 'severely_non_compliant';
}

export function getMetro2ComplianceSummary(
  items: ParsedCreditItem[],
  reportDate: string,
): Metro2ComplianceSummary {
  let totalViolations = 0;
  let criticalCount = 0;
  let severeCount = 0;
  let moderateCount = 0;
  const violationsByRule: Record<string, number> = {};
  const violationsByCategory: Record<string, number> = {};

  for (const item of items) {
    const violations = validateMetro2Compliance(item, reportDate, items);
    totalViolations += violations.length;

    for (const v of violations) {
      if (v.severity === 'critical') criticalCount++;
      else if (v.severity === 'severe') severeCount++;
      else moderateCount++;

      violationsByRule[v.metro2RuleId] = (violationsByRule[v.metro2RuleId] || 0) + 1;

      const rule = METRO2_RULES.find((r) => r.id === v.metro2RuleId);
      if (rule) {
        violationsByCategory[rule.category] = (violationsByCategory[rule.category] || 0) + 1;
      }
    }
  }

  let overallCompliance: Metro2ComplianceSummary['overallCompliance'];
  if (totalViolations === 0) overallCompliance = 'compliant';
  else if (criticalCount === 0 && severeCount === 0) overallCompliance = 'minor_issues';
  else if (criticalCount <= 1) overallCompliance = 'non_compliant';
  else overallCompliance = 'severely_non_compliant';

  return {
    totalChecked: items.length,
    totalViolations,
    criticalCount,
    severeCount,
    moderateCount,
    violationsByRule,
    violationsByCategory,
    overallCompliance,
  };
}

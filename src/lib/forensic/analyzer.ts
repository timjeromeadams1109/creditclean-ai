// ============================================================================
// CreditClean AI — Forensic Analysis Engine
//
// Analyzes every credit report item against FCRA, FDCPA, HIPAA credit
// reporting rules, ECOA, and FCBA. Produces violations, recommendations,
// removal probabilities, and a prioritized action plan.
// ============================================================================

import { v4 as uuidv4 } from 'uuid';
import type {
  ForensicFinding,
  ForensicReport,
  ForensicViolation,
  Recommendation,
} from './types';
import {
  calculateItemAge,
  detectDuplicates,
  getStatuteOfLimitations,
  type ParsedCreditItem,
} from './report-parser';
import { validateMetro2Compliance } from './metro2-validator';

// ---------------------------------------------------------------------------
// analyzeItem — run all forensic checks on a single credit report line item
// ---------------------------------------------------------------------------
export function analyzeItem(
  item: ParsedCreditItem,
  reportDate: string,
  consumerState = 'CA',
  allItems: ParsedCreditItem[] = [],
): ForensicFinding {
  const violations: ForensicViolation[] = [];
  const recommendations: Recommendation[] = [];
  const legalBasis: string[] = [];

  const statusLower = item.currentStatus.toLowerCase();
  const isNegative =
    item.isCollection ||
    /charge.?off|delinquent|late|past.?due|collection|repossession|foreclosure|settled|written.?off/i.test(
      statusLower,
    );

  // =========================================================================
  // FCRA VIOLATION CHECKS
  // =========================================================================

  // 1. Item older than 7 years from DOFD — FCRA §605(a)
  if (item.dateOfFirstDelinquency) {
    const age = calculateItemAge(item.dateOfFirstDelinquency);
    if (age.isExpired) {
      violations.push({
        law: 'FCRA §605(a)',
        uscReference: '15 U.S.C. §1681c(a)',
        violationType: 'Obsolete information — exceeds 7-year reporting period',
        description: `This item has a date of first delinquency of ${item.dateOfFirstDelinquency}, which is ${age.years} years and ${age.months} months ago. FCRA §605(a) prohibits reporting negative information older than 7 years from the DOFD.`,
        evidence: `Date of first delinquency: ${item.dateOfFirstDelinquency}. Current report date: ${reportDate}. Age: ${age.years}y ${age.months}m.`,
        severity: 'critical',
        actionableSteps: [
          'Send dispute letter to the credit bureau citing FCRA §605(a)',
          'Demand immediate removal of the obsolete item',
          'If not removed within 30 days, file a CFPB complaint',
          'Consider FCRA litigation — statutory damages of $100-$1,000 per violation',
        ],
        estimatedDamages: '$100-$1,000 statutory damages per violation under FCRA §616',
      });
      legalBasis.push('FCRA §605(a)');
    }
  }

  // 2. Bankruptcy older than 10 years — FCRA §605(a)(1)
  if (/bankruptcy/i.test(statusLower) || /bankruptcy/i.test(item.accountName)) {
    if (item.dateOfFirstDelinquency) {
      const age = calculateItemAge(item.dateOfFirstDelinquency);
      if (age.years >= 10) {
        violations.push({
          law: 'FCRA §605(a)(1)',
          uscReference: '15 U.S.C. §1681c(a)(1)',
          violationType: 'Obsolete bankruptcy — exceeds 10-year reporting period',
          description: `This bankruptcy entry is ${age.years} years old and exceeds the 10-year reporting limit under FCRA §605(a)(1).`,
          evidence: `Bankruptcy date: ${item.dateOfFirstDelinquency}. Age: ${age.years}y ${age.months}m.`,
          severity: 'critical',
          actionableSteps: [
            'Send dispute letter citing FCRA §605(a)(1) — 10-year limit for bankruptcies',
            'Demand immediate deletion',
            'File CFPB complaint if not removed within 30 days',
          ],
          estimatedDamages: '$100-$1,000 statutory damages',
        });
        legalBasis.push('FCRA §605(a)(1)');
      }
    }
  }

  // 3. Furnisher accuracy — balance accuracy — FCRA §623(a)(1)
  if (item.isCollection && item.originalBalance !== undefined && item.balance > 0) {
    if (item.balance > item.originalBalance * 1.5) {
      violations.push({
        law: 'FCRA §623(a)(1)',
        uscReference: '15 U.S.C. §1681s-2(a)(1)',
        violationType: 'Inaccurate balance reported — inflated beyond original amount',
        description: `The reported balance of $${item.balance} is significantly higher than the original balance of $${item.originalBalance}. This may include unauthorized fees, interest, or inflated amounts in violation of the furnisher's duty to report accurate information.`,
        evidence: `Reported balance: $${item.balance}. Original balance: $${item.originalBalance}. Difference: $${item.balance - item.originalBalance} (${(((item.balance - item.originalBalance) / item.originalBalance) * 100).toFixed(0)}% increase).`,
        severity: 'severe',
        actionableSteps: [
          'Send debt validation letter demanding itemized accounting of balance',
          'Dispute the inflated balance with the credit bureau',
          'If collector cannot validate, demand deletion under FDCPA §809(b)',
        ],
        estimatedDamages: '$1,000 per violation under FDCPA §813(a)(2)(A)',
      });
      legalBasis.push('FCRA §623(a)(1)');
    }
  }

  // 4. Account status accuracy check
  if (
    statusLower.includes('open') &&
    item.lastPaymentDate &&
    daysBetween(item.lastPaymentDate, reportDate) > 365 * 2
  ) {
    violations.push({
      law: 'FCRA §623(a)(1)',
      uscReference: '15 U.S.C. §1681s-2(a)(1)',
      violationType: 'Potentially inaccurate account status',
      description: `Account is reported as "Open" but the last payment was over 2 years ago (${item.lastPaymentDate}). This may be an inaccurate status.`,
      evidence: `Status: ${item.currentStatus}. Last payment: ${item.lastPaymentDate}.`,
      severity: 'moderate',
      actionableSteps: [
        'Dispute the account status with the credit bureau',
        'Request the furnisher verify the current status of the account',
      ],
    });
    legalBasis.push('FCRA §623(a)(1)');
  }

  // 5. Missing date of first delinquency for negative items
  if (isNegative && !item.dateOfFirstDelinquency) {
    violations.push({
      law: 'FCRA §623(a)(5)',
      uscReference: '15 U.S.C. §1681s-2(a)(5)',
      violationType: 'Missing date of first delinquency',
      description:
        'This negative item does not report a date of first delinquency. Furnishers are required to report the DOFD for all delinquent accounts. Without it, the 7-year clock cannot be properly calculated.',
      evidence: `Account "${item.accountName}" is ${item.currentStatus} but has no DOFD.`,
      severity: 'severe',
      actionableSteps: [
        'Dispute with the credit bureau — missing DOFD makes the item unverifiable',
        'Request the furnisher provide the DOFD under FCRA §623(a)(5)',
        'If DOFD cannot be provided, demand removal as unverifiable',
      ],
    });
    legalBasis.push('FCRA §623(a)(5)');
  }

  // 6. High balance / credit limit accuracy
  if (
    item.creditLimit !== undefined &&
    item.highBalance !== undefined &&
    item.highBalance > item.creditLimit * 1.5 &&
    item.accountType === 'revolving'
  ) {
    violations.push({
      law: 'FCRA §623(a)(1)',
      uscReference: '15 U.S.C. §1681s-2(a)(1)',
      violationType: 'High balance significantly exceeds credit limit',
      description: `The reported high balance of $${item.highBalance} exceeds the credit limit of $${item.creditLimit} by more than 50%. This inaccuracy can artificially inflate utilization ratios.`,
      evidence: `Credit limit: $${item.creditLimit}. High balance: $${item.highBalance}.`,
      severity: 'moderate',
      actionableSteps: [
        'Dispute the high balance or credit limit with the bureau',
        'Request the furnisher correct the reported figures',
      ],
    });
    legalBasis.push('FCRA §623(a)(1)');
  }

  // 7. Payment history accuracy — late payment codes
  if (item.paymentHistory) {
    const latePayments = (item.paymentHistory.match(/[0-9]{2,3}/g) || []).length;
    const totalMonths = item.paymentHistory.length;
    // Flag if history is mostly good but has isolated late marks — goodwill candidates
    if (latePayments > 0 && latePayments <= 2 && totalMonths >= 24) {
      // Not a violation per se, but a recommendation candidate (handled below)
    }
  }

  // 8. Duplicate entries (checked across all items)
  if (allItems.length > 1) {
    const dupes = detectDuplicates(allItems);
    for (const dupe of dupes) {
      const isInGroup = dupe.duplicateGroups.some((group) =>
        group.some(
          (g) =>
            g.accountName === item.accountName &&
            g.accountNumber === item.accountNumber,
        ),
      );
      if (isInGroup) {
        violations.push({
          law: 'FCRA §611',
          uscReference: '15 U.S.C. §1681i',
          violationType: 'Duplicate entry detected',
          description: `${dupe.reason}. Duplicate reporting of the same debt inflates the negative impact on the consumer's credit score and violates reasonable accuracy standards.`,
          evidence: `Account: ${item.accountName} #${item.accountNumber}. ${dupe.reason}.`,
          severity: 'severe',
          actionableSteps: [
            'Dispute the duplicate entries with all three bureaus',
            'Demand removal of duplicate entries under FCRA §611',
            'If the same debt is reported by both the original creditor and collector, only one may show a balance',
          ],
          estimatedDamages: '$100-$1,000 per willful violation',
        });
        legalBasis.push('FCRA §611');
        break; // Only flag once per item
      }
    }
  }

  // 9. Paid collection still showing a balance — FCRA §623(a)(2)
  if (
    item.isCollection &&
    (/paid|settled|satisfied/i.test(statusLower)) &&
    item.balance > 0
  ) {
    violations.push({
      law: 'FCRA §623(a)(2)',
      uscReference: '15 U.S.C. §1681s-2(a)(2)',
      violationType: 'Paid collection still reporting a balance',
      description: `This collection account shows a status of "${item.currentStatus}" but still reports a balance of $${item.balance}. Furnishers have a duty to update reported information to reflect the current status.`,
      evidence: `Status: ${item.currentStatus}. Balance: $${item.balance}. Should be $0.`,
      severity: 'severe',
      actionableSteps: [
        'Send dispute letter demanding the balance be updated to $0',
        'Cite FCRA §623(a)(2) — duty to update information',
        'If not corrected within 30 days, file CFPB complaint',
      ],
      estimatedDamages: '$100-$1,000 statutory damages',
    });
    legalBasis.push('FCRA §623(a)(2)');
  }

  // 10. Mixed file / account may not belong to consumer — FCRA §607
  if (item.isAuthorizedUser === undefined && item.isJointAccount === undefined) {
    // Flag a generic recommendation to verify ownership (not a violation yet)
  }

  // 11. Disputed account missing "disputed" notation — FCRA §623(a)(3)
  if (
    item.disputeHistory &&
    /disputed/i.test(item.disputeHistory) &&
    !(item.comments && /dispute|disputed/i.test(item.comments))
  ) {
    violations.push({
      law: 'FCRA §623(a)(3)',
      uscReference: '15 U.S.C. §1681s-2(a)(3)',
      violationType: 'Previously disputed item missing "disputed" notation',
      description:
        'This account has been previously disputed by the consumer but the report does not include the required "consumer disputes" notation. Furnishers must report that an item is disputed when notified.',
      evidence: `Dispute history: "${item.disputeHistory}". Comments: "${item.comments || 'none'}".`,
      severity: 'moderate',
      actionableSteps: [
        'Dispute with the bureau and demand the "consumer disputes" notation be added',
        'Send direct dispute to the furnisher under FCRA §623(a)(3)',
      ],
    });
    legalBasis.push('FCRA §623(a)(3)');
  }

  // 12. Re-insertion without notification — FCRA §611(a)(5)(B)
  if (
    item.disputeHistory &&
    /removed|deleted/i.test(item.disputeHistory) &&
    item.dateReported
  ) {
    violations.push({
      law: 'FCRA §611(a)(5)(B)',
      uscReference: '15 U.S.C. §1681i(a)(5)(B)',
      violationType: 'Potential re-insertion of previously deleted item',
      description:
        'This item appears to have been previously removed/deleted but has been re-inserted on the report. Under FCRA §611(a)(5)(B), a CRA must notify the consumer within 5 business days of re-inserting a disputed item.',
      evidence: `Dispute history indicates prior removal: "${item.disputeHistory}". Currently reporting as of ${item.dateReported}.`,
      severity: 'critical',
      actionableSteps: [
        'Demand proof that the 5-day re-insertion notice was sent under FCRA §611(a)(5)(B)',
        'If no notice was sent, the re-insertion is illegal — demand immediate removal',
        'File CFPB complaint and consider FCRA litigation',
      ],
      estimatedDamages: '$100-$1,000 statutory; potential punitive damages for willful violation',
    });
    legalBasis.push('FCRA §611(a)(5)(B)');
  }

  // 13. Unauthorized inquiries — FCRA §604 (permissible purpose)
  if (/inquiry/i.test(item.accountType) || /inquiry/i.test(item.currentStatus)) {
    violations.push({
      law: 'FCRA §604',
      uscReference: '15 U.S.C. §1681b',
      violationType: 'Potentially unauthorized hard inquiry',
      description: `The inquiry from "${item.accountName}" may lack permissible purpose under FCRA §604. Hard inquiries without consumer authorization or legitimate permissible purpose violate the FCRA.`,
      evidence: `Inquiry by: ${item.accountName}. Date: ${item.dateOpened || item.dateReported}.`,
      severity: 'moderate',
      actionableSteps: [
        'Send inquiry removal letter to the credit bureau',
        'Request proof of permissible purpose from the inquiring party',
        'If unauthorized, demand removal under FCRA §604',
      ],
    });
    legalBasis.push('FCRA §604');
  }

  // =========================================================================
  // FDCPA VIOLATION CHECKS (collection accounts only)
  // =========================================================================

  if (item.isCollection) {
    // 1. Missing original creditor — FDCPA §809(a)
    if (!item.originalCreditor) {
      violations.push({
        law: 'FDCPA §809(a)',
        uscReference: '15 U.S.C. §1692g(a)',
        violationType: 'Original creditor not identified',
        description:
          'This collection account does not identify the original creditor. Under FDCPA §809(a), the debt collector must provide the name of the creditor to whom the debt is owed within 5 days of initial communication.',
        evidence: `Collection account "${item.accountName}" — original creditor field is empty.`,
        severity: 'severe',
        actionableSteps: [
          'Send a debt validation letter under FDCPA §809(b) within 30 days',
          'Demand the collector identify the original creditor',
          'If they cannot validate, the debt is unverifiable — demand deletion',
        ],
        estimatedDamages: '$1,000 per violation under FDCPA §813(a)(2)(A)',
      });
      legalBasis.push('FDCPA §809(a)');
    }

    // 2. Chain of ownership / documentation
    if (item.collectorName && item.originalCreditor && item.collectorName !== item.originalCreditor) {
      recommendations.push({
        priority: 0, // Will be reordered later
        action: `Request complete chain of title documentation from ${item.collectorName} proving they have legal authority to collect on the debt originally owed to ${item.originalCreditor}`,
        method: 'debt_validation',
        targetRecipient: item.collectorName,
        legalBasis: ['FDCPA §809(b)', '15 U.S.C. §1692g(b)'],
        expectedOutcome:
          'If the collector cannot produce a complete chain of title, the debt is unverifiable and must be deleted from the credit report',
        template: 'debt_validation_chain_of_title',
      });
    }

    // 3. Unauthorized fees — FDCPA §808(1)
    if (
      item.originalBalance !== undefined &&
      item.balance > 0 &&
      item.balance > item.originalBalance
    ) {
      const excess = item.balance - item.originalBalance;
      violations.push({
        law: 'FDCPA §808(1)',
        uscReference: '15 U.S.C. §1692f(1)',
        violationType: 'Collection of unauthorized fees or amounts',
        description: `The collection balance of $${item.balance} exceeds the original debt of $${item.originalBalance} by $${excess}. Any amount beyond what is authorized by the original agreement or by law is prohibited under FDCPA §808(1).`,
        evidence: `Original balance: $${item.originalBalance}. Current collection balance: $${item.balance}. Excess: $${excess}.`,
        severity: 'severe',
        actionableSteps: [
          'Send debt validation letter demanding itemized accounting',
          'Demand the collector explain the additional $' + excess,
          'If fees are not authorized by the original agreement, cite FDCPA §808(1)',
        ],
        estimatedDamages: '$1,000 per violation under FDCPA',
      });
      legalBasis.push('FDCPA §808(1)');
    }

    // 4. Proper notification — FDCPA §809(a) 5-day notice
    // (Cannot verify from report alone, but recommend requesting proof)
    recommendations.push({
      priority: 0,
      action: `Request proof of initial validation notice from ${item.collectorName || item.accountName}. Under FDCPA §809(a), the collector must have sent a written notice within 5 days of initial communication.`,
      method: 'debt_validation',
      targetRecipient: item.collectorName || item.accountName,
      legalBasis: ['FDCPA §809(a)', '15 U.S.C. §1692g(a)'],
      expectedOutcome:
        'If collector cannot prove proper notification, this strengthens the dispute and may warrant deletion',
      template: 'debt_validation_notice_proof',
    });

    // 6. Statute of limitations check
    const solDate = item.lastPaymentDate || item.dateOfFirstDelinquency;
    if (solDate) {
      const debtType = item.accountType === 'revolving' ? 'open_ended' : 'written_contract';
      const sol = getStatuteOfLimitations(consumerState, debtType, solDate);
      if (sol.expired) {
        violations.push({
          law: 'State Statute of Limitations',
          uscReference: `${consumerState} SOL — ${sol.years} years for ${debtType}`,
          violationType: 'Time-barred debt — statute of limitations expired',
          description: `The statute of limitations for this debt has expired in ${consumerState} (${sol.years} years for ${debtType}). While the debt may still appear on the credit report (up to 7 years from DOFD), the collector cannot sue to collect. Any attempt to collect on a time-barred debt may violate the FDCPA.`,
          evidence: `Last activity: ${solDate}. State: ${consumerState}. SOL: ${sol.years} years. Status: EXPIRED.`,
          severity: 'moderate',
          actionableSteps: [
            'Do NOT make any payment — it may reset the SOL clock',
            'If contacted by collector, assert that the debt is time-barred',
            'Send cease and desist letter if collector persists',
            'If collector threatens suit on time-barred debt, report to state AG and CFPB',
          ],
        });
        legalBasis.push(`State SOL (${consumerState})`);
      }
    }

    // 7. Re-aged date on time-barred debt
    if (solDate && item.dateOfFirstDelinquency) {
      const dofd = new Date(item.dateOfFirstDelinquency);
      const lastActivity = new Date(solDate);
      if (
        !isNaN(dofd.getTime()) &&
        !isNaN(lastActivity.getTime()) &&
        lastActivity > dofd
      ) {
        const openDate = new Date(item.dateOpened);
        if (
          !isNaN(openDate.getTime()) &&
          openDate > dofd
        ) {
          violations.push({
            law: 'FCRA §623(a)(1) / FDCPA §807',
            uscReference: '15 U.S.C. §1681s-2(a)(1) / 15 U.S.C. §1692e',
            violationType: 'Potential re-aging of account — date manipulation',
            description:
              'The account open date is more recent than the date of first delinquency, which may indicate the collection agency has re-aged the debt to extend the reporting period. Re-aging is a serious violation.',
            evidence: `DOFD: ${item.dateOfFirstDelinquency}. Account opened: ${item.dateOpened}. This is chronologically inconsistent.`,
            severity: 'critical',
            actionableSteps: [
              'Dispute with the credit bureau citing date manipulation / re-aging',
              'File CFPB complaint — re-aging is a willful violation',
              'Report to state AG — re-aging may violate state consumer protection laws',
              'Consult with a consumer attorney — this is a strong litigation candidate',
            ],
            estimatedDamages: '$1,000+ under FDCPA; potential punitive damages',
          });
          legalBasis.push('FDCPA §807');
        }
      }
    }
  }

  // =========================================================================
  // ADDITIONAL LAW CHECKS
  // =========================================================================

  // Medical debt — 180-day waiting period (credit reporting rules)
  if (item.isMedical) {
    if (item.dateOfFirstDelinquency && item.dateReported) {
      const dofd = new Date(item.dateOfFirstDelinquency);
      const reported = new Date(item.dateReported);
      if (!isNaN(dofd.getTime()) && !isNaN(reported.getTime())) {
        const diffDays = (reported.getTime() - dofd.getTime()) / (1000 * 60 * 60 * 24);
        if (diffDays < 180) {
          violations.push({
            law: 'FCRA / HIPAA Credit Reporting Rules',
            uscReference: 'Credit reporting agreement — 180-day waiting period for medical debt',
            violationType: 'Medical debt reported before mandatory waiting period',
            description: `This medical debt was reported to the credit bureau within ${Math.round(diffDays)} days of the date of first delinquency. Under the National Consumer Assistance Plan (NCAP) and subsequent rules, medical debts must not be reported until 180 days after the DOFD to allow for insurance processing.`,
            evidence: `DOFD: ${item.dateOfFirstDelinquency}. Date reported: ${item.dateReported}. Days elapsed: ${Math.round(diffDays)} (minimum required: 180).`,
            severity: 'severe',
            actionableSteps: [
              'Dispute with the credit bureau — medical debt reported too early',
              'Demand removal until the 180-day waiting period has elapsed',
              'Contact the medical provider billing department to resolve insurance issues',
            ],
          });
          legalBasis.push('NCAP / Medical Debt Reporting Rules');
        }
      }
    }

    // Medical debt paid by insurance but still reporting
    if (/paid|insurance|covered/i.test(item.comments || '') && item.balance > 0) {
      violations.push({
        law: 'FCRA §623(a)(2) / Medical Debt Rules',
        uscReference: '15 U.S.C. §1681s-2(a)(2)',
        violationType: 'Medical debt paid by insurance still reporting',
        description:
          'This medical debt appears to have been paid or covered by insurance but is still reporting with a balance. Under current credit reporting rules, medical debts paid by insurance must be removed.',
        evidence: `Comments indicate insurance coverage: "${item.comments}". Balance: $${item.balance}.`,
        severity: 'critical',
        actionableSteps: [
          'Dispute with the credit bureau — medical debt paid by insurance must be removed',
          'Provide proof of insurance payment/EOB to the bureau',
          'File CFPB complaint if not resolved within 30 days',
        ],
      });
      legalBasis.push('Medical Debt Reporting Rules');
    }
  }

  // Student loan — IDR plan accuracy
  if (item.isStudentLoan) {
    if (
      /income.?driven|ibr|icr|paye|repaye|idr/i.test(item.comments || '') &&
      item.paymentStatus &&
      /late|delinquent|past.?due/i.test(item.paymentStatus)
    ) {
      violations.push({
        law: 'FCRA §623(a)(1)',
        uscReference: '15 U.S.C. §1681s-2(a)(1)',
        violationType: 'Student loan IDR plan not reflected correctly',
        description:
          'This student loan appears to be on an income-driven repayment plan, but the payment status shows delinquency. If the borrower is making payments according to the IDR plan, the account should not be reported as delinquent.',
        evidence: `Comments: "${item.comments}". Payment status: "${item.paymentStatus}".`,
        severity: 'severe',
        actionableSteps: [
          'Dispute with the bureau — account should reflect current IDR plan status',
          'Provide proof of IDR enrollment and payment history to the servicer',
          'Contact the Department of Education if the servicer does not correct',
        ],
      });
      legalBasis.push('FCRA §623(a)(1)');
    }
  }

  // ECOA — disparate treatment indicators (limited from report data)
  // This is flagged as a recommendation for further investigation, not a violation
  if (item.isJointAccount && /divorced|separated/i.test(item.comments || '')) {
    recommendations.push({
      priority: 0,
      action:
        'Investigate potential ECOA violation — joint account may be unfairly impacting one party after divorce/separation. Under ECOA, creditors cannot discriminate on the basis of marital status.',
      method: 'dispute_letter',
      targetRecipient: item.accountName,
      legalBasis: ['ECOA — 15 U.S.C. §1691'],
      expectedOutcome:
        'Account may need to be reassigned to the responsible party per the divorce decree',
      template: 'ecoa_joint_account_dispute',
    });
    legalBasis.push('ECOA — 15 U.S.C. §1691');
  }

  // FCBA — billing error potential for credit card accounts
  if (item.accountType === 'revolving' && !item.isCollection) {
    if (
      item.balance > 0 &&
      item.comments &&
      /error|unauthorized|fraud|not.?mine|billing/i.test(item.comments)
    ) {
      violations.push({
        law: 'FCBA §161',
        uscReference: '15 U.S.C. §1666',
        violationType: 'Potential billing error on credit card account',
        description:
          'The account comments suggest a billing error or unauthorized charge. Under the Fair Credit Billing Act, the creditor must investigate billing errors within specific timeframes.',
        evidence: `Comments: "${item.comments}". Balance: $${item.balance}.`,
        severity: 'moderate',
        actionableSteps: [
          'Send billing error notice to the creditor within 60 days of the statement',
          'Creditor must acknowledge within 30 days and resolve within 2 billing cycles',
          'During investigation, the creditor cannot report the disputed amount as delinquent',
        ],
      });
      legalBasis.push('FCBA §161');
    }
  }

  // =========================================================================
  // METRO 2 FORMAT COMPLIANCE CHECKS
  // =========================================================================

  const metro2Violations = validateMetro2Compliance(item, reportDate, allItems);
  for (const m2v of metro2Violations) {
    violations.push(m2v);
    legalBasis.push(`Metro 2 [${m2v.metro2RuleId}]`);
  }

  // =========================================================================
  // Generate recommendations based on findings
  // =========================================================================

  if (violations.length > 0) {
    // Primary: Dispute letter to the bureau
    recommendations.push({
      priority: 1,
      action: `Send dispute letter to ${item.accountName} credit bureau citing ${violations.length} violation(s): ${violations.map((v) => v.law).join(', ')}`,
      method: 'dispute_letter',
      targetRecipient: 'Credit Bureau',
      legalBasis: [...new Set(violations.map((v) => v.law))],
      expectedOutcome:
        'Bureau must investigate within 30 days. If unverifiable, item must be removed.',
      deadline: '30 days from receipt for bureau response',
      template: 'bureau_dispute_multiple_violations',
    });

    // If collection, add debt validation
    if (item.isCollection) {
      recommendations.push({
        priority: 2,
        action: `Send debt validation request to ${item.collectorName || item.accountName} under FDCPA §809(b)`,
        method: 'debt_validation',
        targetRecipient: item.collectorName || item.accountName,
        legalBasis: ['FDCPA §809(b)'],
        expectedOutcome:
          'Collector must cease collection until validation is provided. If they cannot validate, demand deletion.',
        deadline: 'Send within 30 days of first contact for maximum protection',
        template: 'debt_validation_full',
      });
    }

    // If critical violations, add CFPB complaint recommendation
    const hasCritical = violations.some((v) => v.severity === 'critical');
    if (hasCritical) {
      recommendations.push({
        priority: 3,
        action: `File CFPB complaint against ${item.accountName} for critical FCRA/FDCPA violations`,
        method: 'cfpb_complaint',
        targetRecipient: 'Consumer Financial Protection Bureau',
        legalBasis: [...new Set(violations.map((v) => v.law))],
        expectedOutcome:
          'CFPB will forward complaint to the furnisher who must respond within 15 days. High resolution rate for legitimate violations.',
        template: 'cfpb_complaint_template',
      });
    }
  }

  // Goodwill letter for isolated late payments on otherwise good accounts
  if (
    !item.isCollection &&
    item.paymentHistory &&
    isNegative
  ) {
    const lateCount = (item.paymentHistory.match(/[0-9]{2,3}/g) || []).length;
    const totalMonths = item.paymentHistory.replace(/[^a-zA-Z0-9]/g, '').length;
    if (lateCount > 0 && lateCount <= 2 && totalMonths >= 24) {
      recommendations.push({
        priority: 4,
        action: `Send goodwill letter to ${item.accountName} requesting removal of ${lateCount} isolated late payment(s) given an otherwise positive payment history`,
        method: 'goodwill',
        targetRecipient: item.accountName,
        legalBasis: [],
        expectedOutcome:
          'Creditor may voluntarily remove late payment notations as a courtesy. Success rate improves with long positive history.',
        template: 'goodwill_late_payment',
      });
    }
  }

  // =========================================================================
  // Calculate removal probability
  // =========================================================================
  const removalProbability = calculateRemovalProbability(item, violations);

  // =========================================================================
  // Calculate priority score (1-100)
  // =========================================================================
  const priorityScore = calculatePriorityScore(item, violations, removalProbability);

  // =========================================================================
  // Determine risk level
  // =========================================================================
  const riskLevel = determineRiskLevel(violations);

  // Renumber recommendation priorities
  const sortedRecs = recommendations
    .sort((a, b) => a.priority - b.priority)
    .map((r, i) => ({ ...r, priority: i + 1 }));

  return {
    id: uuidv4(),
    itemDescription: buildItemDescription(item),
    accountName: item.accountName,
    accountNumber: item.accountNumber,
    bureau: '',
    itemType: item.accountType,
    reportedBalance: item.balance,
    dateOpened: item.dateOpened,
    dateReported: item.dateReported,
    currentStatus: item.currentStatus,
    violations,
    recommendations: sortedRecs,
    riskLevel,
    removalProbability,
    legalBasis: [...new Set(legalBasis)],
    priorityScore,
  };
}

// ---------------------------------------------------------------------------
// analyzeFullReport — analyze all items and produce a complete ForensicReport
// ---------------------------------------------------------------------------
export function analyzeFullReport(
  items: ParsedCreditItem[],
  reportDate: string,
  bureau: string,
  consumerState = 'CA',
): ForensicReport {
  const findings: ForensicFinding[] = items.map((item) => {
    const finding = analyzeItem(item, reportDate, consumerState, items);
    finding.bureau = bureau;
    return finding;
  });

  // Sort findings by priority score (highest first)
  findings.sort((a, b) => b.priorityScore - a.priorityScore);

  const negativeFindings = findings.filter(
    (f) => f.violations.length > 0 || f.riskLevel !== 'low',
  );
  const disputeableFindings = findings.filter((f) => f.violations.length > 0);
  const removableFindings = findings.filter(
    (f) =>
      f.removalProbability === 'very_high' || f.removalProbability === 'high',
  );

  // Aggregate all violations by law
  const violationsByLaw: Record<string, number> = {};
  let totalViolations = 0;
  for (const finding of findings) {
    for (const v of finding.violations) {
      violationsByLaw[v.law] = (violationsByLaw[v.law] || 0) + 1;
      totalViolations++;
    }
  }

  // Prioritize actions across all findings
  const prioritizedActions = prioritizeActions(findings);

  // Estimate timeline based on number of items
  const estimatedTimeline = estimateTimeline(disputeableFindings.length);

  // Estimate score impact
  const estimatedScoreImpact = estimateScoreImpact(removableFindings);

  // Estimate total damages
  const estimatedTotalDamages = estimateDamages(findings);

  return {
    id: uuidv4(),
    userId: '',
    bureau,
    analyzedAt: new Date().toISOString(),
    totalItems: items.length,
    negativeItems: negativeFindings.length,
    disputeableItems: disputeableFindings.length,
    estimatedRemovable: removableFindings.length,
    findings,
    prioritizedActions,
    estimatedTimeline,
    estimatedScoreImpact,
    totalViolations,
    violationsByLaw,
    estimatedTotalDamages,
  };
}

// ---------------------------------------------------------------------------
// prioritizeActions — merge and order all recommendations across findings
// ---------------------------------------------------------------------------
export function prioritizeActions(findings: ForensicFinding[]): Recommendation[] {
  const allRecs: (Recommendation & { findingScore: number })[] = [];

  for (const finding of findings) {
    for (const rec of finding.recommendations) {
      allRecs.push({ ...rec, findingScore: finding.priorityScore });
    }
  }

  // Sort by: finding priority score (desc) then recommendation priority (asc)
  allRecs.sort((a, b) => {
    if (b.findingScore !== a.findingScore) return b.findingScore - a.findingScore;
    return a.priority - b.priority;
  });

  // Deduplicate by method + target (keep highest priority version)
  const seen = new Set<string>();
  const deduped: Recommendation[] = [];
  for (const rec of allRecs) {
    const key = `${rec.method}:${rec.targetRecipient}`;
    if (!seen.has(key)) {
      seen.add(key);
      deduped.push(rec);
    }
  }

  // Renumber
  return deduped.map((r, i) => ({ ...r, priority: i + 1 }));
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function calculateRemovalProbability(
  item: ParsedCreditItem,
  violations: ForensicViolation[],
): ForensicFinding['removalProbability'] {
  // Very high: expired items, paid collections with balance, duplicates
  if (violations.some((v) => v.violationType.includes('Obsolete information'))) return 'very_high';
  if (violations.some((v) => v.violationType.includes('Obsolete bankruptcy'))) return 'very_high';
  if (violations.some((v) => v.violationType.includes('Paid collection still reporting')))
    return 'very_high';
  if (violations.some((v) => v.violationType.includes('Duplicate entry'))) return 'very_high';
  if (violations.some((v) => v.violationType.includes('re-aging'))) return 'very_high';
  if (violations.some((v) => v.violationType.includes('re-insertion'))) return 'very_high';

  // High: missing validation, medical HIPAA, inaccurate balance, unauthorized inquiries
  if (violations.some((v) => v.violationType.includes('Original creditor not identified')))
    return 'high';
  if (violations.some((v) => v.violationType.includes('Medical debt'))) return 'high';
  if (violations.some((v) => v.violationType.includes('Inaccurate balance'))) return 'high';
  if (violations.some((v) => v.violationType.includes('unauthorized'))) return 'high';
  if (violations.some((v) => v.violationType.includes('Missing date of first delinquency')))
    return 'high';

  // Moderate: late payments with otherwise good history
  if (
    !item.isCollection &&
    item.paymentHistory &&
    (item.paymentHistory.match(/[0-9]{2,3}/g) || []).length <= 2
  ) {
    return 'moderate';
  }

  // If there are any violations at all, at least moderate
  if (violations.length > 0) return 'moderate';

  return 'low';
}

function calculatePriorityScore(
  item: ParsedCreditItem,
  violations: ForensicViolation[],
  removalProbability: ForensicFinding['removalProbability'],
): number {
  let score = 0;

  // Impact on credit score (0-30 pts)
  if (item.isCollection) score += 25;
  else if (/charge.?off/i.test(item.currentStatus)) score += 28;
  else if (/repossession|foreclosure/i.test(item.currentStatus)) score += 30;
  else if (/late|delinquent/i.test(item.paymentStatus)) score += 15;

  // Removal probability (0-25 pts)
  const probScores: Record<string, number> = {
    very_high: 25,
    high: 20,
    moderate: 12,
    low: 3,
  };
  score += probScores[removalProbability] || 0;

  // Violation severity (0-25 pts)
  const sevScores: Record<string, number> = {
    critical: 25,
    severe: 18,
    moderate: 10,
    minor: 4,
  };
  const maxSeverity = violations.reduce((max, v) => {
    const s = sevScores[v.severity] || 0;
    return s > max ? s : max;
  }, 0);
  score += maxSeverity;

  // Recency — more recent items score higher (0-10 pts)
  if (item.dateReported) {
    const reported = new Date(item.dateReported);
    if (!isNaN(reported.getTime())) {
      const monthsAgo =
        (Date.now() - reported.getTime()) / (1000 * 60 * 60 * 24 * 30);
      if (monthsAgo < 6) score += 10;
      else if (monthsAgo < 12) score += 8;
      else if (monthsAgo < 24) score += 5;
      else if (monthsAgo < 48) score += 3;
      else score += 1;
    }
  }

  // Balance amount (0-10 pts)
  if (item.balance >= 10000) score += 10;
  else if (item.balance >= 5000) score += 8;
  else if (item.balance >= 1000) score += 5;
  else if (item.balance >= 500) score += 3;
  else if (item.balance > 0) score += 1;

  return Math.min(100, Math.max(1, score));
}

function determineRiskLevel(
  violations: ForensicViolation[],
): ForensicFinding['riskLevel'] {
  if (violations.some((v) => v.severity === 'critical')) return 'critical';
  if (violations.some((v) => v.severity === 'severe')) return 'high';
  if (violations.some((v) => v.severity === 'moderate')) return 'medium';
  if (violations.length > 0) return 'low';
  return 'low';
}

function buildItemDescription(item: ParsedCreditItem): string {
  const parts: string[] = [];
  if (item.isCollection) parts.push('Collection');
  if (item.isMedical) parts.push('Medical');
  if (item.isStudentLoan) parts.push('Student Loan');
  parts.push(`${item.accountType} account`);
  parts.push(`— ${item.currentStatus}`);
  if (item.balance > 0) parts.push(`($${item.balance.toLocaleString()})`);
  return parts.join(' ');
}

function daysBetween(date1: string, date2: string): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return 0;
  return Math.abs(d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24);
}

function estimateTimeline(disputeableCount: number): string {
  if (disputeableCount <= 3) return '2-3 months';
  if (disputeableCount <= 6) return '3-4 months';
  if (disputeableCount <= 10) return '4-6 months';
  if (disputeableCount <= 15) return '5-7 months';
  return '6-9 months';
}

function estimateScoreImpact(
  removableFindings: ForensicFinding[],
): string {
  if (removableFindings.length === 0) return '+0-10 points';

  const collectionCount = removableFindings.filter(
    (f) => f.itemType === 'collection',
  ).length;
  const chargeOffCount = removableFindings.filter((f) =>
    /charge.?off/i.test(f.currentStatus),
  ).length;
  const lateCount = removableFindings.length - collectionCount - chargeOffCount;

  // Rough estimates: collections ~20-40pts each, charge-offs ~15-30, lates ~5-15
  const low = collectionCount * 20 + chargeOffCount * 15 + lateCount * 5;
  const high = collectionCount * 40 + chargeOffCount * 30 + lateCount * 15;

  const cappedLow = Math.min(low, 150);
  const cappedHigh = Math.min(high, 200);

  return `+${cappedLow}-${cappedHigh} points`;
}

function estimateDamages(findings: ForensicFinding[]): string {
  let minDamages = 0;
  let maxDamages = 0;

  for (const finding of findings) {
    for (const v of finding.violations) {
      if (v.severity === 'critical') {
        minDamages += 500;
        maxDamages += 1000;
      } else if (v.severity === 'severe') {
        minDamages += 100;
        maxDamages += 1000;
      } else if (v.severity === 'moderate') {
        minDamages += 100;
        maxDamages += 500;
      }
    }
  }

  if (maxDamages === 0) return '$0';
  return `$${minDamages.toLocaleString()}-$${maxDamages.toLocaleString()} estimated statutory damages`;
}

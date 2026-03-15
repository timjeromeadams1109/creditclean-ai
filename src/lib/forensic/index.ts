// ============================================================================
// CreditClean AI — Forensic Credit Report Analysis System
// Barrel export
// ============================================================================

// Types
export type {
  CreditReportUpload,
  ForensicFinding,
  ForensicReport,
  ForensicViolation,
  Recommendation,
} from './types';

// Report parser & utilities
export type { ParsedCreditItem } from './report-parser';
export {
  parseManualEntry,
  calculateItemAge,
  detectDuplicates,
  getStatuteOfLimitations,
  STATE_SOL_MAP,
} from './report-parser';

// Forensic analyzer
export {
  analyzeItem,
  analyzeFullReport,
  prioritizeActions,
} from './analyzer';

// Metro 2 compliance
export type { Metro2Violation, Metro2ComplianceSummary } from './metro2-validator';
export {
  validateMetro2Compliance,
  getMetro2ComplianceSummary,
} from './metro2-validator';
export {
  ACCOUNT_STATUS_CODES,
  PAYMENT_RATING_CODES,
  COMPLIANCE_CONDITION_CODES,
  SPECIAL_COMMENT_CODES,
  ECOA_CODES,
  ACCOUNT_TYPE_CODES,
  METRO2_RULES,
  inferStatusCode,
  getStatusDescription,
} from './metro2-reference';

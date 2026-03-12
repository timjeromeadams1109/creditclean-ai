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

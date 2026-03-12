// CreditClean AI — Complete Legal Reference
// Barrel export for all legal modules.

// Types
export type { LegalProvision, ConsumerAgency } from "./types";

// Fair Credit Reporting Act (15 U.S.C. §1681 et seq.)
export { FCRA_PROVISIONS, getFCRAProvisionsForItemType, getFCRAForDispute } from "./fcra";

// Fair Debt Collection Practices Act (15 U.S.C. §1692 et seq.)
export { FDCPA_PROVISIONS, getFDCPAForViolationType } from "./fdcpa";

// Consumer Protection Agencies
export {
  FEDERAL_AGENCIES,
  CREDIT_BUREAUS,
  KEY_STATE_ATTORNEYS_GENERAL,
  CONSUMER_RESOURCES,
  ALL_AGENCIES,
  getAgenciesForSituation,
  getBureauContact,
} from "./consumer-agencies";

// Additional Laws (ECOA, TILA, FCBA, EFTA, SCRA, HIPAA, TCPA, Dodd-Frank)
export {
  ADDITIONAL_FEDERAL_LAWS,
  STATE_SPECIFIC_LAWS,
  getStateLaws,
  getAdditionalLawsForItem,
} from "./additional-laws";

// Case Law (Supreme Court + Circuit Court precedents)
export {
  FCRA_CASE_LAW,
  FDCPA_CASE_LAW,
  CONSTITUTIONAL_CASE_LAW,
  ALL_CASE_LAW,
  getCaseLawForStrategy,
  getSupremeCourtCases,
  getLitigationCases,
  formatCaseCitations,
} from "./case-law";

// Damages Calculator
export {
  calculateDamages,
  generateDamagesNarrative,
  type DamagesEstimate,
  type ActualDamagesBreakdown,
  type StateDamagesBreakdown,
} from "./damages-calculator";

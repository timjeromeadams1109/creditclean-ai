// CreditClean AI — Dispute Engine
// Barrel export for all dispute letter generation modules.

// Types
export {
  DisputeStrategy,
  ItemType,
  Bureau,
  DisputeOutcome,
  type UserProfile,
  type CreditItem,
  type DisputeRound,
  type DisputeResponse,
  type DisputeLetter,
  type Violation,
  type AttorneyPackage,
  type LegalCitation,
} from "./types";

// Legal Citations
export {
  LEGAL_CITATIONS,
  getCitationsForStrategy,
  getMedicalCitations,
  getStateCitations,
  getInquiryCitations,
} from "./legal-citations";

// Letter Templates
export {
  generateFCRA611Letter,
  generateFCRA609Letter,
  generateFDCPA809Letter,
  generateFCRA623Letter,
  generateGoodwillLetter,
  generateCFPBComplaint,
  generateStateAGComplaint,
  generateIntentToLitigate,
} from "./letter-templates";

// Escalation Engine
export {
  determineNextStrategy,
  analyzeResponse,
  calculateDeadline,
  checkForViolations,
  generateAttorneyPackage,
  generateLetter,
} from "./escalation-engine";

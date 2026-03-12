// CreditClean AI — Data Access Layer
// Barrel export for all data access functions.

export {
  getCreditItems,
  getCreditItem,
  createCreditItem,
  createCreditItemsForBureaus,
  updateCreditItem,
  deleteCreditItem,
  getCreditItemStats,
} from "./credit-items";

export {
  getDisputeRounds,
  getDisputeRound,
  createDisputeRound,
  updateDisputeRound,
  getActiveDisputes,
  getOverdueDisputes,
} from "./dispute-rounds";

export {
  getLetters,
  getLetter,
  createLetter,
  updateLetterStatus,
} from "./letters";

export {
  getResponses,
  createResponse,
  updateResponseAnalysis,
} from "./responses";

export {
  getScores,
  addScore,
  getLatestScores,
} from "./scores";

// CreditClean AI — Dispute Engine Types
// All types for the credit dispute letter generation system.

export enum DisputeStrategy {
  FCRA_611_BUREAU_DISPUTE = "fcra_611_bureau_dispute",
  FCRA_609_VERIFICATION = "fcra_609_verification",
  FDCPA_809_VALIDATION = "fdcpa_809_validation",
  FCRA_623_FURNISHER_DISPUTE = "fcra_623_furnisher_dispute",
  GOODWILL_LETTER = "goodwill_letter",
  CFPB_COMPLAINT = "cfpb_complaint",
  STATE_AG_COMPLAINT = "state_ag_complaint",
  INTENT_TO_LITIGATE = "intent_to_litigate",
}

export enum ItemType {
  LATE_PAYMENT = "late_payment",
  COLLECTION = "collection",
  CHARGE_OFF = "charge_off",
  REPOSSESSION = "repossession",
  FORECLOSURE = "foreclosure",
  BANKRUPTCY = "bankruptcy",
  JUDGMENT = "judgment",
  TAX_LIEN = "tax_lien",
  INQUIRY = "inquiry",
  MEDICAL_DEBT = "medical_debt",
  STUDENT_LOAN = "student_loan",
  OTHER = "other",
}

export enum Bureau {
  EQUIFAX = "equifax",
  EXPERIAN = "experian",
  TRANSUNION = "transunion",
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  ssnLast4: string;
  dob: string; // ISO date string YYYY-MM-DD
  email?: string;
  phone?: string;
}

export interface CreditItem {
  id: string;
  bureau: Bureau;
  itemType: ItemType;
  creditorName: string;
  accountNumber: string; // last 4-6 digits only
  balance?: number;
  originalBalance?: number;
  dateOpened?: string;
  dateReported?: string;
  status?: string; // e.g. "Open", "Closed", "Collection"
  collectorName?: string; // if different from creditor (e.g. collection agency)
  collectorAddress?: string;
  remarks?: string;
  isMedical?: boolean;
  latePaymentDates?: string[]; // for late payment items
  inquiryDate?: string; // for inquiry items
  inquiryCreditor?: string; // for inquiry items
  userNotes?: string; // client's own explanation
}

export interface DisputeRound {
  roundNumber: number;
  strategy: DisputeStrategy;
  dateSent: string; // ISO date
  deadlineDate: string; // ISO date
  letterContent: string;
  recipientName: string;
  recipientAddress: string;
  trackingNumber?: string;
  response?: DisputeResponse;
}

export interface DisputeResponse {
  dateReceived: string; // ISO date
  outcome: DisputeOutcome;
  responseText?: string; // OCR or manual entry of response
  bureauExplanation?: string;
  verificationMethod?: string; // what method they claim to have used
  updatedStatus?: string; // new status on report if changed
  documentsReceived?: string[]; // list of documents they sent
}

export enum DisputeOutcome {
  DELETED = "deleted",
  UPDATED = "updated",
  VERIFIED = "verified",
  NO_RESPONSE = "no_response",
  PARTIAL_UPDATE = "partial_update",
  INVESTIGATION_IN_PROGRESS = "investigation_in_progress",
}

export interface DisputeLetter {
  content: string;
  legalBasis: string[];
  recipientName: string;
  recipientAddress: string;
  strategy: DisputeStrategy;
  itemType: ItemType;
  generatedAt: string; // ISO date
  deadlineDays: number;
}

export interface Violation {
  code: string;
  statute: string;
  description: string;
  severity: "minor" | "moderate" | "severe";
  estimatedDamages?: string;
  evidenceDescription: string;
}

export interface AttorneyPackage {
  clientProfile: UserProfile;
  creditItem: CreditItem;
  timeline: {
    date: string;
    event: string;
    details: string;
  }[];
  disputeRounds: DisputeRound[];
  identifiedViolations: Violation[];
  estimatedStatutoryDamages: string;
  summary: string;
}

export interface LegalCitation {
  code: string;
  lawName: string;
  section: string;
  uscReference: string;
  summary: string;
  fullRelevantText: string;
  whenToUse: string;
}

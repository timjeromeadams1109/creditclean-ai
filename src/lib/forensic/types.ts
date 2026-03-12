// ============================================================================
// CreditClean AI — Forensic Credit Report Analysis Types
// ============================================================================

export interface CreditReportUpload {
  id: string;
  userId: string;
  bureau: 'equifax' | 'experian' | 'transunion';
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
  analyzedAt?: string;
  status: 'uploaded' | 'analyzing' | 'analyzed' | 'error';
}

export interface ForensicFinding {
  id: string;
  itemDescription: string;
  accountName: string;
  accountNumber: string;
  bureau: string;
  itemType: string;
  reportedBalance?: number;
  dateOpened?: string;
  dateReported?: string;
  currentStatus: string;

  // Forensic analysis results
  violations: ForensicViolation[];
  recommendations: Recommendation[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  removalProbability: 'low' | 'moderate' | 'high' | 'very_high';
  legalBasis: string[];
  priorityScore: number;
}

export interface ForensicViolation {
  law: string;
  uscReference: string;
  violationType: string;
  description: string;
  evidence: string;
  severity: 'minor' | 'moderate' | 'severe' | 'critical';
  actionableSteps: string[];
  estimatedDamages?: string;
}

export interface Recommendation {
  priority: number;
  action: string;
  method:
    | 'dispute_letter'
    | 'debt_validation'
    | 'verification_request'
    | 'goodwill'
    | 'cfpb_complaint'
    | 'state_ag'
    | 'cease_desist'
    | 'intent_to_litigate';
  targetRecipient: string;
  legalBasis: string[];
  expectedOutcome: string;
  deadline?: string;
  template: string;
}

export interface ForensicReport {
  id: string;
  userId: string;
  bureau: string;
  analyzedAt: string;

  // Summary
  totalItems: number;
  negativeItems: number;
  disputeableItems: number;
  estimatedRemovable: number;

  // Findings
  findings: ForensicFinding[];

  // Overall strategy
  prioritizedActions: Recommendation[];
  estimatedTimeline: string;
  estimatedScoreImpact: string;

  // Violation summary
  totalViolations: number;
  violationsByLaw: Record<string, number>;
  estimatedTotalDamages: string;
}

// CreditClean AI — Legal Reference Types

export interface LegalProvision {
  section: string;
  uscReference: string;
  title: string;
  summary: string;
  consumerRight: string;
  howToUse: string;
  deadlines?: string;
  penalties?: string;
  applicableTo: string[];
}

export interface ConsumerAgency {
  name: string;
  acronym: string;
  type: "federal" | "state" | "bureau";
  jurisdiction: string;
  website: string;
  complaintUrl: string;
  phone: string;
  address: string;
  whenToUse: string;
  filingTips: string;
  responseTime: string;
  enforcementPower: string;
}

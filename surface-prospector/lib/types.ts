export interface Company {
  id: string;
  name: string;
  url: string;
  description: string;
  industry: string;
  employeeCount: number;
  fundingStage: "Seed" | "Series A" | "Series B" | "Series C" | "Series D+";
  fundingAmount?: string;
  arrEstimate?: string;
  headquarters: string;
  region: "NAM" | "EMEA" | "APAC";
  products: string[];
  demoPageUrl?: string;
  techStack?: string[];
  buyerPersonas?: string[];
  hiringSignals?: string[];
  painSignals?: string[];
  isExistingCustomer?: boolean;
}

export interface DriveScore {
  demo: number;
  realAdSpend: number;
  intricateRouting: number;
  velocity: number;
  evidence: number;
  total: number;
  reasoning: {
    demo: string;
    realAdSpend: string;
    intricateRouting: string;
    velocity: string;
    evidence: string;
  };
  topPainSignal: string;
  summary: string;
}

export interface OutboundEmail {
  subject: string;
  body: string;
  angle: string;
  personalizationNotes: string;
}

export interface AccountStatus {
  companyId: string;
  status: "queued" | "contacted" | "replied" | "meeting_booked" | "skipped";
  lastAction?: string;
  notes?: string;
  updatedAt: string;
}

export interface ApolloSettings {
  apolloEndpoint?: string;
  apolloApiKey?: string;
}

export interface DataProvider {
  getCompanies: () => Company[];
  getCompanyById: (id: string) => Company | undefined;
}

export interface StorageProvider {
  getAccountStatus: (companyId: string) => AccountStatus | null;
  setAccountStatus: (status: AccountStatus) => void;
  getDriveScore: (companyId: string) => DriveScore | null;
  setDriveScore: (companyId: string, score: DriveScore) => void;
  getEmailDraft: (companyId: string) => OutboundEmail | null;
  setEmailDraft: (companyId: string, draft: OutboundEmail) => void;
  getNotes: (companyId: string) => string | null;
  setNotes: (companyId: string, notes: string) => void;
  getAllStatuses: () => AccountStatus[];
  getRecentActivity: () => AccountStatus[];
  clearAll: () => void;
}

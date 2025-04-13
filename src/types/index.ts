
export type LoanStatus = 
  | "draft" 
  | "submitted" 
  | "reviewing" 
  | "information_needed" 
  | "underwriting" 
  | "approved" 
  | "conditionally_approved" 
  | "rejected" 
  | "funding" 
  | "funded" 
  | "closed";

export type AssetClass = 
  | "residential_mortgage" 
  | "commercial_real_estate" 
  | "auto_loan" 
  | "personal_loan" 
  | "sme_loan" 
  | "equipment_finance"
  | "other";

export type Borrower = {
  id: string;
  firstName: string;
  lastName: string;
  companyName?: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  ssn?: string;
  taxId?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  creditScore?: number;
  creditRating?: string;
  income?: number;
  annualRevenue?: number;
  employmentStatus?: string;
  industry?: string;
  yearsInBusiness?: number;
  employmentInfo?: {
    employer: string;
    position: string;
    startDate: string;
    endDate?: string;
  };
  relationshipManager?: string;
  dateCreated: string;
  dateUpdated: string;
};

export type LoanApplicationDTO = {
  id: string;
  borrowerId: string;
  coBorrowers?: string[];
  assetClass: AssetClass;
  amount: number;
  term: number; // in months
  interestRate?: number;
  purpose: string;
  completeness: number;
  displayStatus: string;
  risk?: "Low" | "Medium" | "High";
  collateral?: {
    type: string;
    value: number;
    description: string;
  };
  status: LoanStatus;
  documents: Document[];
  notes: Note[];
  dateCreated: string;
  dateUpdated: string;
  dateSubmitted?: string;
  dateReviewed?: string;
  dateUnderwritten?: string;
  dateApproved?: string;
  dateFunded?: string;
  dateClosed?: string;
  agentAssignments: {
    intakeAgentId?: string;
    processingAgentId?: string;
    underwritingAgentId?: string;
    decisionAgentId?: string;
  };
};

export type LoanApplication = LoanApplicationDTO & {
  borrower: Borrower;
};

export type Document = {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedBy: string;
  uploadedAt: string;
  status: "pending" | "verified" | "rejected";
  aiAnalysisComplete: boolean;
  aiAnalysisSummary?: string;
};

export type Note = {
  id: string;
  content: string;
  createdBy: string;
  createdAt: string;
  isAgentNote: boolean;
};

export type AgentType = 
  | "intake" 
  | "processing" 
  | "underwriting" 
  | "decision";

export type Agent = {
  id: string;
  name: string;
  type: AgentType;
  status: "active" | "inactive";
  description: string;
  lastActivity?: string;
  performanceMetrics?: {
    tasksCompleted: number;
    averageCompletionTime: number;
    errorRate: number;
  };
};

export type DashboardSummary = {
  totalApplications: number;
  applicationsToday: number;
  pendingReview: number;
  approvedToday: number;
  fundedToday: number;
  rejectedToday: number;
  applicationsByStatus: Record<LoanStatus, number>;
  applicationsByAssetClass: Record<AssetClass, number>;
  recentActivity: {
    timestamp: string;
    action: string;
    details: string;
    agentId?: string;
  }[];
  totalPortfolioValue?: number;
  approvalRate?: number;
};

export type Loan = {
  id: string;
  applicationId: string;
  borrowerId: string;
  borrower: Borrower;
  amount: number;
  interestRate: number;
  term: number;
  monthlyPayment: number;
  originationDate: string;
  maturityDate: string;
  status: "active" | "paid_off" | "defaulted" | "modified";
  paymentStatus: "current" | "late_30" | "late_60" | "late_90" | "default";
  assetClass: AssetClass;
  collateral?: {
    type: string;
    value: number;
    description: string;
  };
  lastPaymentDate?: string;
  nextPaymentDate?: string;
  paymentHistory?: {
    date: string;
    amount: number;
    status: "on_time" | "late" | "missed";
  }[];
};

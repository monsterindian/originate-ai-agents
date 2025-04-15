
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
  | "closed"
  | "pre_qualification_complete";

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

export type PreQualificationFactor = {
  factor: string;
  score: number;
  weight: number;
  explanation: string;
  impact: "positive" | "negative" | "neutral";
};

export type PreQualification = {
  score: number;
  scoreLabel: string;
  recommendation: string;
  factors: PreQualificationFactor[];
  dateGenerated: string;
  algorithmVersion: string;
  thresholdForApproval: number;
  generatedBy: string;
  overrideReason?: string;
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
  datePreQualified?: string;
  preQualification?: PreQualification;
  agentAssignments: {
    intakeAgentId?: string;
    processingAgentId?: string;
    underwritingAgentId?: string;
    decisionAgentId?: string;
    fundingAgentId?: string;
    cashFlowAnalysisAgentId?: string;
    preQualificationAgentId?: string;
  };
  recommendedFundingSourceId?: string;
};

export type LoanApplication = LoanApplicationDTO & {
  borrower: Borrower;
  // Add fraud risk indicators for fraud risk agent
  fraudRiskScore?: number;
  suspiciousActivity?: boolean;
  documentVerification?: 'Verified' | 'Pending' | 'Failed';
  riskFactors?: string[];
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
  | "decision"
  | "funding"
  | "cashflow_analysis";

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
  fundingSourceId?: string;
};

export type FundingSourceType = 
  | "institutional_investor" 
  | "bank" 
  | "credit_union" 
  | "private_equity" 
  | "government_program"
  | "securitization_pool" 
  | "internal_funds"
  | "peer_to_peer";

export type FundingSource = {
  id: string;
  name: string;
  type: FundingSourceType;
  description: string;
  minAmount: number;
  maxAmount: number;
  interestRateRange: {
    min: number;
    max: number;
  };
  eligibilityCriteria: {
    minCreditScore?: number;
    maxLTV?: number; // Loan-to-Value ratio
    preferredAssetClasses?: AssetClass[];
    maxDTI?: number; // Debt-to-Income ratio
    businessRequirements?: string;
    locationRestrictions?: string[];
  };
  processingTime: {
    min: number; // in days
    max: number; // in days
  };
  availableFunds: number;
  allocatedFunds: number;
  status: "active" | "inactive" | "limited";
  riskTolerance: "conservative" | "moderate" | "aggressive";
  specialPrograms?: string[];
  contactInfo?: {
    name: string;
    email: string;
    phone: string;
  };
  dateAdded: string;
  lastUpdated: string;
};

export type FundingRecommendation = {
  applicationId: string;
  fundingSourceId: string;
  matchScore: number; // 0-100
  reasons: string[];
  alternatives: {
    fundingSourceId: string;
    matchScore: number;
    reasons: string[];
  }[];
  dateGenerated: string;
  generatedBy: string;
};

// Cash Flow Analysis Types
export type CashFlowHealth = "Strong" | "Moderate" | "Weak";
export type RepaymentCapacity = "Strong" | "Moderate" | "Limited";

export type CashFlowHistoricalData = {
  revenue: number;
  revenueTrend: number;
  cogs: number;
  cogsTrend: number;
  operatingExpenses: number;
  operatingExpensesTrend: number;
  operatingCashFlow: number;
  operatingCashFlowTrend: number;
  cashConversionCycle: number;
  cashConversionCycleTrend: number;
  capitalExpenditures: number;
  capitalExpendituresTrend: number;
  existingDebtService: number;
  existingDebtServiceTrend: number;
  debtServiceCoverageRatio: number;
  debtServiceCoverageTrend: number;
};

export type CashFlowVolatilityMetrics = {
  revenueStandardDeviation: number;
  revenueVolatilityInterpretation: string;
  cashBufferMonths: number;
  cashBufferInterpretation: string;
  peakToTroughRatio: number;
  peakToTroughInterpretation: string;
};

export type CashFlowProjections = {
  annualRevenue: number;
  annualGrowthRate: number;
  operatingCashFlow: number;
  freeCashFlow: number;
  debtServiceCoverageRatio: number;
  loanPaymentCapacity: number;
};

export type CashFlowImprovementRecommendation = {
  title: string;
  description: string;
  tags: string[];
};

export type CashFlowAnalysis = {
  cashFlowHealth: CashFlowHealth;
  repaymentCapacity: RepaymentCapacity;
  recommendation: string;
  historicalData: CashFlowHistoricalData;
  volatilityMetrics: CashFlowVolatilityMetrics;
  strengths: string[];
  concerns: string[];
  seasonalityInsights: string[];
  projectionsWhenGenerated: CashFlowProjections;
  projections: CashFlowProjections;
  projectionPeriod: number;
  stressTestingSummary: string;
  recommendedFundingSource: string;
  recommendedLoanStructure: string;
  recommendedInterestRate: number;
  fundingRationale: string;
  riskFactors: string[];
  mitigationStrategies: string[];
  improvementRecommendations: CashFlowImprovementRecommendation[];
};

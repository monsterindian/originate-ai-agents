
import { 
  Borrower, 
  LoanApplication, 
  LoanStatus, 
  AssetClass, 
  Agent, 
  AgentType,
  DashboardSummary
} from "@/types";

// Helper to generate random date strings within a range
const randomDate = (start: Date, end: Date): string => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
};

// Helper to generate random IDs
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 10);
};

// Create mock borrowers
export const generateMockBorrowers = (count: number): Borrower[] => {
  const firstNames = ["John", "Jane", "Michael", "Emily", "David", "Sarah", "Robert", "Lisa", "Thomas", "Jessica"];
  const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Miller", "Davis", "Garcia", "Rodriguez", "Wilson"];
  
  return Array.from({ length: count }).map((_, index) => {
    const id = generateId();
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    return {
      id,
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 100)}@example.com`,
      phone: `(${Math.floor(Math.random() * 900) + 100})-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      dateOfBirth: randomDate(new Date(1960, 0, 1), new Date(2000, 0, 1)),
      ssn: `${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 90) + 10}-${Math.floor(Math.random() * 9000) + 1000}`,
      address: {
        street: `${Math.floor(Math.random() * 9000) + 1000} Main St`,
        city: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"][Math.floor(Math.random() * 5)],
        state: ["NY", "CA", "IL", "TX", "AZ"][Math.floor(Math.random() * 5)],
        zipCode: `${Math.floor(Math.random() * 90000) + 10000}`,
        country: "USA"
      },
      creditScore: Math.floor(Math.random() * 300) + 550,
      income: Math.floor(Math.random() * 100000) + 40000,
      employmentStatus: ["Employed", "Self-Employed", "Unemployed", "Retired"][Math.floor(Math.random() * 3)],
      employmentInfo: {
        employer: ["ABC Corp", "XYZ Inc", "Tech Solutions", "Global Finance", "Retail Giant"][Math.floor(Math.random() * 5)],
        position: ["Manager", "Analyst", "Director", "Associate", "Specialist"][Math.floor(Math.random() * 5)],
        startDate: randomDate(new Date(2010, 0, 1), new Date(2020, 0, 1)),
      },
      dateCreated: randomDate(new Date(2023, 0, 1), new Date()),
      dateUpdated: randomDate(new Date(2023, 6, 1), new Date())
    };
  });
};

// Create mock loan applications
export const generateMockLoanApplications = (count: number, borrowers: Borrower[]): LoanApplication[] => {
  const statuses: LoanStatus[] = [
    "draft", "submitted", "reviewing", "information_needed", "underwriting", 
    "approved", "conditionally_approved", "rejected", "funding", "funded", "closed"
  ];
  
  const assetClasses: AssetClass[] = [
    "residential_mortgage", "commercial_real_estate", "auto_loan", 
    "personal_loan", "sme_loan", "equipment_finance", "other"
  ];

  const documentTypes = [
    "ID Verification", "Income Proof", "Bank Statement", 
    "Credit Report", "Property Assessment", "Tax Return"
  ];

  return Array.from({ length: count }).map((_, index) => {
    const id = generateId();
    const borrower = borrowers[Math.floor(Math.random() * borrowers.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const assetClass = assetClasses[Math.floor(Math.random() * assetClasses.length)];
    
    const dateCreated = randomDate(new Date(2023, 0, 1), new Date());
    const dateUpdated = randomDate(new Date(dateCreated), new Date());
    const dateSubmitted = status !== "draft" ? randomDate(new Date(dateCreated), new Date()) : undefined;
    const dateApproved = ["approved", "conditionally_approved", "funding", "funded", "closed"].includes(status) 
      ? randomDate(new Date(dateSubmitted || dateCreated), new Date()) 
      : undefined;
    const dateFunded = ["funded", "closed"].includes(status)
      ? randomDate(new Date(dateApproved || dateCreated), new Date())
      : undefined;
    const dateClosed = status === "closed"
      ? randomDate(new Date(dateFunded || dateCreated), new Date())
      : undefined;

    // Generate random documents
    const documentCount = Math.floor(Math.random() * 5) + 1;
    const documents = Array.from({ length: documentCount }).map(() => {
      const docType = documentTypes[Math.floor(Math.random() * documentTypes.length)];
      return {
        id: generateId(),
        name: `${docType}_${borrower.lastName}_${generateId()}.pdf`,
        type: docType,
        url: `https://example.com/documents/${generateId()}`,
        uploadedBy: Math.random() > 0.5 ? "system" : borrower.id,
        uploadedAt: randomDate(new Date(dateCreated), new Date()),
        status: ["pending", "verified", "rejected"][Math.floor(Math.random() * 3)] as "pending" | "verified" | "rejected",
        aiAnalysisComplete: Math.random() > 0.3,
        aiAnalysisSummary: Math.random() > 0.3 ? `Document appears to be authentic and ${Math.random() > 0.7 ? "matches" : "doesn't match"} the provided information.` : undefined
      };
    });

    // Generate random notes
    const noteCount = Math.floor(Math.random() * 4);
    const notes = Array.from({ length: noteCount }).map(() => {
      const isAgentNote = Math.random() > 0.5;
      return {
        id: generateId(),
        content: isAgentNote 
          ? `AI analysis shows ${Math.random() > 0.6 ? "positive" : "potential concerns"} regarding borrower's credit history.`
          : `Called borrower to request additional documentation regarding ${Math.random() > 0.5 ? "income" : "property"}.`,
        createdBy: isAgentNote ? `agent-${generateId()}` : "user-admin",
        createdAt: randomDate(new Date(dateCreated), new Date()),
        isAgentNote
      };
    });

    // Generate loan amount based on asset class
    let amount = 0;
    switch (assetClass) {
      case "residential_mortgage":
        amount = Math.floor(Math.random() * 800000) + 200000;
        break;
      case "commercial_real_estate":
        amount = Math.floor(Math.random() * 5000000) + 1000000;
        break;
      case "auto_loan":
        amount = Math.floor(Math.random() * 50000) + 10000;
        break;
      case "personal_loan":
        amount = Math.floor(Math.random() * 30000) + 5000;
        break;
      case "sme_loan":
        amount = Math.floor(Math.random() * 500000) + 50000;
        break;
      case "equipment_finance":
        amount = Math.floor(Math.random() * 300000) + 20000;
        break;
      default:
        amount = Math.floor(Math.random() * 100000) + 10000;
    }

    return {
      id,
      borrowerId: borrower.id,
      borrower,
      assetClass,
      amount,
      term: [12, 24, 36, 60, 120, 180, 240, 360][Math.floor(Math.random() * 8)],
      interestRate: Math.random() * 10 + 2,
      purpose: [
        "Purchase", "Refinance", "Home Improvement", "Debt Consolidation", 
        "Business Expansion", "Working Capital", "Equipment Purchase", "Other"
      ][Math.floor(Math.random() * 8)],
      collateral: assetClass !== "personal_loan" ? {
        type: assetClass === "auto_loan" ? "Vehicle" : assetClass === "residential_mortgage" ? "Property" : "Business Assets",
        value: amount * (1 + Math.random() * 0.5),
        description: `${assetClass === "auto_loan" ? "2023 Toyota Camry" : assetClass === "residential_mortgage" ? "3BR/2BA Single Family Home" : "Business Equipment and Inventory"}`
      } : undefined,
      status,
      documents,
      notes,
      dateCreated,
      dateUpdated,
      dateSubmitted,
      dateApproved,
      dateFunded,
      dateClosed,
      agentAssignments: {
        intakeAgentId: Math.random() > 0.2 ? `intake-${generateId()}` : undefined,
        processingAgentId: ["reviewing", "information_needed", "underwriting", "approved", "conditionally_approved", "rejected", "funding", "funded", "closed"].includes(status)
          ? `processing-${generateId()}` : undefined,
        underwritingAgentId: ["underwriting", "approved", "conditionally_approved", "rejected", "funding", "funded", "closed"].includes(status)
          ? `underwriting-${generateId()}` : undefined,
        decisionAgentId: ["approved", "conditionally_approved", "rejected", "funding", "funded", "closed"].includes(status)
          ? `decision-${generateId()}` : undefined,
      }
    };
  });
};

// Create mock agents
export const generateMockAgents = (): Agent[] => {
  const agentTypes: AgentType[] = ["intake", "processing", "underwriting", "decision"];
  
  return agentTypes.map(type => {
    const id = `${type}-${generateId()}`;
    
    let name = "";
    let description = "";
    
    switch (type) {
      case "intake":
        name = "Intake Assistant";
        description = "Handles initial application review and document collection";
        break;
      case "processing":
        name = "Loan Processor";
        description = "Processes applications and verifies documentation";
        break;
      case "underwriting":
        name = "Underwriting Analyst";
        description = "Analyzes borrower creditworthiness and risk assessment";
        break;
      case "decision":
        name = "Decision Engine";
        description = "Makes final loan approval recommendations based on all data";
        break;
    }
    
    return {
      id,
      name,
      type,
      status: "active",
      description,
      lastActivity: randomDate(new Date(Date.now() - 24 * 60 * 60 * 1000), new Date()),
      performanceMetrics: {
        tasksCompleted: Math.floor(Math.random() * 500) + 50,
        averageCompletionTime: Math.floor(Math.random() * 60) + 10,
        errorRate: Math.random() * 0.05
      }
    };
  });
};

// Generate dashboard summary data
export const generateDashboardSummary = (applications: LoanApplication[]): DashboardSummary => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayApplications = applications.filter(app => 
    new Date(app.dateCreated) >= today
  );

  const approvedToday = applications.filter(app => 
    app.dateApproved && new Date(app.dateApproved) >= today
  );

  const fundedToday = applications.filter(app => 
    app.dateFunded && new Date(app.dateFunded) >= today
  );

  const rejectedToday = applications.filter(app => 
    app.status === "rejected" && app.dateUpdated && new Date(app.dateUpdated) >= today
  );

  const pendingReview = applications.filter(app => 
    ["submitted", "reviewing", "information_needed", "underwriting"].includes(app.status)
  );

  // Count applications by status
  const applicationsByStatus = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {} as Record<LoanStatus, number>);

  // Count applications by asset class
  const applicationsByAssetClass = applications.reduce((acc, app) => {
    acc[app.assetClass] = (acc[app.assetClass] || 0) + 1;
    return acc;
  }, {} as Record<AssetClass, number>);

  // Generate recent activity
  const recentActivity = Array.from({ length: 10 }).map(() => {
    const randomApp = applications[Math.floor(Math.random() * applications.length)];
    const actions = [
      "Application submitted",
      "Documents uploaded",
      "Application updated",
      "Credit check completed",
      "Underwriting completed",
      "Decision rendered",
      "Documents verified",
      "Loan funded",
      "Additional information requested"
    ];
    
    return {
      timestamp: randomDate(new Date(Date.now() - 24 * 60 * 60 * 1000), new Date()),
      action: actions[Math.floor(Math.random() * actions.length)],
      details: `Loan application ${randomApp.id} for ${randomApp.borrower.firstName} ${randomApp.borrower.lastName}`,
      agentId: Math.random() > 0.5 ? Object.values(randomApp.agentAssignments).find(Boolean) : undefined
    };
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return {
    totalApplications: applications.length,
    applicationsToday: todayApplications.length,
    pendingReview: pendingReview.length,
    approvedToday: approvedToday.length,
    fundedToday: fundedToday.length,
    rejectedToday: rejectedToday.length,
    applicationsByStatus,
    applicationsByAssetClass,
    recentActivity
  };
};

// Initialize the mock data store
let borrowers: Borrower[] = [];
let applications: LoanApplication[] = [];
let agents: Agent[] = [];
let dashboardSummary: DashboardSummary;

// Function to initialize mock data
export const initMockData = () => {
  borrowers = generateMockBorrowers(20);
  applications = generateMockLoanApplications(50, borrowers);
  agents = generateMockAgents();
  dashboardSummary = generateDashboardSummary(applications);
};

// Data access functions
export const getMockBorrowers = (): Borrower[] => {
  if (borrowers.length === 0) {
    initMockData();
  }
  return borrowers;
};

export const getMockBorrowerById = (id: string): Borrower | undefined => {
  if (borrowers.length === 0) {
    initMockData();
  }
  return borrowers.find(borrower => borrower.id === id);
};

export const getMockLoanApplications = (): LoanApplication[] => {
  if (applications.length === 0) {
    initMockData();
  }
  return applications;
};

export const getMockLoanApplicationById = (id: string): LoanApplication | undefined => {
  if (applications.length === 0) {
    initMockData();
  }
  return applications.find(app => app.id === id);
};

export const getMockAgents = (): Agent[] => {
  if (agents.length === 0) {
    initMockData();
  }
  return agents;
};

export const getMockAgentById = (id: string): Agent | undefined => {
  if (agents.length === 0) {
    initMockData();
  }
  return agents.find(agent => agent.id === id);
};

export const getMockDashboardSummary = (): DashboardSummary => {
  if (!dashboardSummary) {
    initMockData();
  }
  return dashboardSummary;
};

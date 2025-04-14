import { 
  Borrower, 
  LoanApplication, 
  LoanStatus, 
  AssetClass, 
  Agent, 
  AgentType,
  DashboardSummary,
  Document,
  Note,
  FundingSource,
  FundingSourceType,
  FundingRecommendation
} from "@/types";

// Helper to generate random date strings within a range
const randomDate = (start: Date, end: Date): string => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString().split('T')[0];
};

// Helper to generate random IDs with prefixes
const generateId = (prefix: string): string => {
  return `${prefix}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
};

// Generate random names
const firstNames = [
  "John", "Jane", "Michael", "Emily", "David", "Sarah", "Robert", "Lisa", "Thomas", "Jessica",
  "William", "Jennifer", "James", "Elizabeth", "Christopher", "Ashley", "Daniel", "Samantha", 
  "Matthew", "Amanda", "Andrew", "Stephanie", "Joseph", "Nicole", "Ryan", "Katherine", "Nicholas",
  "Melissa", "Anthony", "Heather", "Kevin", "Christina", "Brian", "Rachel", "Steven", "Laura"
];

const lastNames = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Miller", "Davis", "Garcia", "Rodriguez", "Wilson",
  "Martinez", "Anderson", "Taylor", "Thomas", "Hernandez", "Moore", "Martin", "Jackson", "Thompson", "White",
  "Lopez", "Lee", "Gonzalez", "Harris", "Clark", "Lewis", "Robinson", "Walker", "Perez", "Hall",
  "Young", "Allen", "Sanchez", "Wright", "King", "Scott", "Green", "Baker", "Adams", "Nelson"
];

const companyNames = [
  "Acme Industries", "Global Enterprises", "Summit Solutions", "Horizon Tech", "Elite Services",
  "Pioneer Innovations", "Prestige Properties", "Frontier Systems", "Universal Logistics", "Pinnacle Group",
  "Dynamic Solutions", "Advance Technologies", "Premier Services", "Heritage Construction", "Momentum Partners",
  "Synergy Ventures", "Precision Engineering", "Cascade Development", "Apex Corporation", "Vantage Holdings",
  "Allegiance Investments", "Strategic Ventures", "Evergreen Properties", "Clearwater Consulting", "Cornerstone Builders",
  "Skyline Developers", "Integrity Financial", "Beacon Advisors", "Sunbelt Enterprises", "Victory Partners",
  "Revolution Tech", "Spectrum Software", "Atlas Logistics", "Harbor Freight", "Liberty Capital",
  "Maritime Shipping", "Blue Ridge Developments", "Eagle Construction", "Golden Gate Industries", "Silver Lining Tech"
];

const streetNames = [
  "Main Street", "Oak Avenue", "Maple Drive", "Cedar Lane", "Pine Street", "Elm Road", "Washington Avenue",
  "Park Boulevard", "Highland Drive", "Sunset Lane", "Riverside Drive", "Mountain View", "Lake Shore Drive",
  "Meadow Lane", "Forest Avenue", "Valley Road", "Spring Street", "Willow Lane", "Ocean Drive", "Broadway"
];

const cities = [
  "New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego",
  "Dallas", "San Jose", "Austin", "Jacksonville", "Fort Worth", "Columbus", "San Francisco", "Charlotte",
  "Indianapolis", "Seattle", "Denver", "Washington", "Boston", "Nashville", "Baltimore", "Oklahoma City",
  "Portland", "Las Vegas", "Milwaukee", "Albuquerque", "Tucson", "Fresno", "Sacramento", "Kansas City",
  "Atlanta", "Miami", "Tampa", "Orlando", "Pittsburgh", "Cincinnati", "Minneapolis", "Cleveland"
];

const states = [
  "NY", "CA", "IL", "TX", "AZ", "PA", "FL", "GA", "NC", "OH", "MI", "WA", "CO", "DC", "MA", "TN",
  "MD", "OK", "OR", "NV", "WI", "NM", "AZ", "CA", "MO", "GA", "FL", "FL", "FL", "PA", "OH", "MN"
];

const industries = [
  "Manufacturing", "Technology", "Healthcare", "Retail", "Finance", "Education", "Real Estate", 
  "Construction", "Energy", "Transportation", "Hospitality", "Agriculture", "Media", "Telecommunications",
  "Automotive", "Pharmaceuticals", "Insurance", "Legal Services", "Entertainment", "Food & Beverage"
];

const loanPurposes = [
  "Property Acquisition", "Equipment Purchase", "Business Expansion", "Working Capital", "Debt Consolidation",
  "Renovation", "Inventory", "Marketing", "Research & Development", "Staffing", "Software Implementation",
  "Franchise Fee", "Startup Costs", "Refinancing", "Acquisition", "New Location", "Equipment Upgrades",
  "Facility Improvement", "Technology Infrastructure", "Seasonal Cash Flow"
];

// Create mock borrowers
export const generateMockBorrowers = (count: number): Borrower[] => {
  return Array.from({ length: count }).map((_, index) => {
    const id = generateId("B");
    const isCompany = Math.random() > 0.4;
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = isCompany 
      ? companyNames[Math.floor(Math.random() * companyNames.length)]
      : `${firstName} ${lastName}`;
    const email = isCompany
      ? `info@${name.toLowerCase().replace(/[^\w]/g, '')}.com`
      : `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 100)}@example.com`;
    const creditScore = Math.floor(Math.random() * 300) + 550;
    
    return {
      id,
      firstName: isCompany ? "" : firstName,
      lastName: isCompany ? "" : lastName,
      companyName: isCompany ? name : undefined,
      email,
      phone: `(${Math.floor(Math.random() * 900) + 100})-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      dateOfBirth: isCompany ? undefined : randomDate(new Date(1960, 0, 1), new Date(2000, 0, 1)),
      ssn: isCompany ? undefined : `${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 90) + 10}-${Math.floor(Math.random() * 9000) + 1000}`,
      taxId: isCompany ? `${Math.floor(Math.random() * 90) + 10}-${Math.floor(Math.random() * 9000000) + 1000000}` : undefined,
      address: {
        street: `${Math.floor(Math.random() * 9000) + 1000} ${streetNames[Math.floor(Math.random() * streetNames.length)]}`,
        city: cities[Math.floor(Math.random() * cities.length)],
        state: states[Math.floor(Math.random() * states.length)],
        zipCode: `${Math.floor(Math.random() * 90000) + 10000}`,
        country: "USA"
      },
      creditScore,
      creditRating: creditScore > 750 ? "Excellent" : creditScore > 700 ? "Good" : creditScore > 650 ? "Fair" : "Poor",
      income: isCompany ? undefined : Math.floor(Math.random() * 100000) + 40000,
      annualRevenue: isCompany ? Math.floor(Math.random() * 9000000) + 1000000 : undefined,
      employmentStatus: isCompany ? undefined : ["Employed", "Self-Employed", "Unemployed", "Retired"][Math.floor(Math.random() * 3)],
      industry: isCompany ? industries[Math.floor(Math.random() * industries.length)] : undefined,
      yearsInBusiness: isCompany ? Math.floor(Math.random() * 20) + 1 : undefined,
      employmentInfo: isCompany ? undefined : {
        employer: ["ABC Corp", "XYZ Inc", "Tech Solutions", "Global Finance", "Retail Giant"][Math.floor(Math.random() * 5)],
        position: ["Manager", "Analyst", "Director", "Associate", "Specialist"][Math.floor(Math.random() * 5)],
        startDate: randomDate(new Date(2010, 0, 1), new Date(2020, 0, 1)),
      },
      relationshipManager: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
      dateCreated: randomDate(new Date(2023, 0, 1), new Date()),
      dateUpdated: randomDate(new Date(2023, 6, 1), new Date())
    };
  });
};

// Helper to generate documents for applications
const generateDocuments = (applicationId: string, borrowerId: string, status: LoanStatus, dateCreated: string): Document[] => {
  const documentTypes = [
    "ID Verification", "Income Proof", "Bank Statement", 
    "Credit Report", "Property Assessment", "Tax Return",
    "Business Plan", "Financial Statements", "Collateral Documentation",
    "Insurance Policy", "Articles of Incorporation", "Operating Agreement"
  ];

  // Determine how many documents should be generated based on application status
  const progressMap: Record<LoanStatus, number> = {
    "draft": 1,
    "submitted": 2,
    "reviewing": 3,
    "information_needed": 3,
    "underwriting": 4,
    "approved": 5,
    "conditionally_approved": 5,
    "rejected": 5,
    "funding": 6,
    "funded": 6,
    "closed": 6
  };
  
  const targetDocCount = progressMap[status] || 3;
  const documentCount = Math.min(Math.floor(Math.random() * 3) + targetDocCount, documentTypes.length);
  
  // Shuffle document types and pick a subset
  const shuffledDocTypes = [...documentTypes].sort(() => 0.5 - Math.random()).slice(0, documentCount);
  
  return shuffledDocTypes.map(docType => {
    // Document status should align with application status
    let docStatus: "pending" | "verified" | "rejected";
    if (["draft", "submitted", "information_needed"].includes(status)) {
      docStatus = Math.random() > 0.7 ? "pending" : "verified";
    } else if (status === "rejected") {
      docStatus = Math.random() > 0.5 ? "rejected" : "verified";
    } else {
      docStatus = Math.random() > 0.2 ? "verified" : "pending";
    }
    
    const uploadDate = randomDate(new Date(dateCreated), new Date());
    
    return {
      id: generateId("DOC"),
      name: `${docType.replace(/\s+/g, '_')}_${applicationId}.pdf`,
      type: docType,
      url: `https://example.com/documents/${generateId("")}`,
      uploadedBy: Math.random() > 0.5 ? "system" : borrowerId,
      uploadedAt: uploadDate,
      status: docStatus,
      aiAnalysisComplete: status !== "draft" && Math.random() > 0.3,
      aiAnalysisSummary: status !== "draft" && Math.random() > 0.3 
        ? `Document appears to be ${Math.random() > 0.8 ? "potentially problematic" : "authentic"} and ${Math.random() > 0.7 ? "matches" : "doesn't fully match"} the provided information.`
        : undefined
    };
  });
};

// Helper to generate notes for applications
const generateNotes = (applicationId: string, status: LoanStatus, dateCreated: string): Note[] => {
  if (status === "draft") return [];
  
  const noteCount = Math.floor(Math.random() * 5) + (["reviewing", "underwriting", "approved", "conditionally_approved", "rejected", "funding", "funded", "closed"].includes(status) ? 3 : 1);
  
  const agentNotes = [
    "Initial review complete. Application meets basic criteria for further processing.",
    "Credit check reveals strong payment history with minor concerns in debt-to-income ratio.",
    "Property valuation results indicate appropriate loan-to-value ratio for requested amount.",
    "Borrower financial statements verified and show adequate cash flow for servicing the debt.",
    "Documentation appears complete and accurate. No significant discrepancies found.",
    "Risk assessment indicates moderate risk profile. Recommend additional collateral.",
    "Analysis shows strong repayment capacity. Recommend approval at requested terms.",
    "Income verification completed. Borrower meets minimum income requirements.",
    "Potential compliance concerns identified. Recommend additional documentation.",
    "Background check completed with no significant findings.",
    "Financial analysis suggests debt-to-income ratio exceeds guidelines. Consider conditional approval.",
    "Market analysis of proposed property/investment shows favorable conditions.",
    "Borrower business plan demonstrates viability but projected revenues may be optimistic.",
    "Suggests restructuring terms to better align with borrower's cash flow patterns.",
    "Automation risk assessment completed with low-risk findings."
  ];
  
  const userNotes = [
    "Called borrower to request additional documentation regarding income verification.",
    "Discussed payment terms and explained interest rate calculation to borrower.",
    "Provided guidance on completing missing sections of the application.",
    "Met with borrower to review property assessment and discuss valuation concerns.",
    "Scheduled site visit for property inspection next week.",
    "Reached out to co-signer to verify willingness to participate.",
    "Consulted with underwriting team regarding exception request.",
    "Reviewed application with senior management due to loan size.",
    "Requested clarification on discrepancy in financial statements.",
    "Conducted follow-up call to discuss conditional approval terms."
  ];
  
  return Array.from({ length: noteCount }).map((_, index) => {
    const isAgentNote = Math.random() > 0.4;
    const noteDate = randomDate(new Date(dateCreated), new Date());
    
    return {
      id: generateId("NOTE"),
      content: isAgentNote 
        ? agentNotes[Math.floor(Math.random() * agentNotes.length)]
        : userNotes[Math.floor(Math.random() * userNotes.length)],
      createdBy: isAgentNote ? `agent-${generateId("")}` : "user-admin",
      createdAt: noteDate,
      isAgentNote
    };
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
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

  // Create a distribution pattern for statuses to make the data more realistic
  const statusDistribution: Record<LoanStatus, number> = {
    "draft": 0.1,            // 10% of apps
    "submitted": 0.1,         // 10% of apps
    "reviewing": 0.15,        // 15% of apps
    "information_needed": 0.1, // 10% of apps
    "underwriting": 0.15,     // 15% of apps
    "approved": 0.05,         // 5% of apps
    "conditionally_approved": 0.1, // 10% of apps
    "rejected": 0.05,         // 5% of apps
    "funding": 0.05,          // 5% of apps
    "funded": 0.1,            // 10% of apps
    "closed": 0.05            // 5% of apps
  };

  return Array.from({ length: count }).map((_, index) => {
    const id = generateId("APP");
    const borrower = borrowers[Math.floor(Math.random() * borrowers.length)];
    
    // Determine status based on distribution
    let statusRoll = Math.random();
    let cumulativeProbability = 0;
    let status: LoanStatus = "draft";
    
    for (const [stat, probability] of Object.entries(statusDistribution)) {
      cumulativeProbability += probability;
      if (statusRoll <= cumulativeProbability) {
        status = stat as LoanStatus;
        break;
      }
    }
    
    // Pick an asset class with some correlation to borrower type
    let assetClass: AssetClass;
    if (borrower.companyName) {
      assetClass = ["commercial_real_estate", "equipment_finance", "sme_loan"][Math.floor(Math.random() * 3)] as AssetClass;
    } else {
      assetClass = ["residential_mortgage", "auto_loan", "personal_loan"][Math.floor(Math.random() * 3)] as AssetClass;
    }
    
    const dateCreated = randomDate(new Date(2023, 0, 1), new Date());
    const dateUpdated = randomDate(new Date(dateCreated), new Date());
    const dateSubmitted = status !== "draft" ? randomDate(new Date(dateCreated), new Date(dateUpdated)) : undefined;
    const dateReviewed = ["reviewing", "information_needed", "underwriting", "approved", "conditionally_approved", "rejected", "funding", "funded", "closed"].includes(status)
      ? randomDate(new Date(dateSubmitted || dateCreated), new Date(dateUpdated))
      : undefined;
    const dateUnderwritten = ["underwriting", "approved", "conditionally_approved", "rejected", "funding", "funded", "closed"].includes(status)
      ? randomDate(new Date(dateReviewed || dateCreated), new Date(dateUpdated))
      : undefined;
    const dateApproved = ["approved", "conditionally_approved", "funding", "funded", "closed"].includes(status) 
      ? randomDate(new Date(dateUnderwritten || dateCreated), new Date(dateUpdated)) 
      : undefined;
    const dateFunded = ["funded", "closed"].includes(status)
      ? randomDate(new Date(dateApproved || dateCreated), new Date(dateUpdated))
      : undefined;
    const dateClosed = status === "closed"
      ? randomDate(new Date(dateFunded || dateCreated), new Date(dateUpdated))
      : undefined;

    // Generate documents based on application status
    const documents = generateDocuments(id, borrower.id, status, dateCreated);
    
    // Generate notes based on application status
    const notes = generateNotes(id, status, dateCreated);

    // Generate loan amount based on asset class with some randomness
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

    // Calculate interest rate based on borrower credit and market conditions
    const baseRate = 5.0; // Base interest rate
    const creditAdjustment = (borrower.creditScore ? (800 - borrower.creditScore) / 100 : 2); // Higher score = lower rate
    const randomVariation = (Math.random() - 0.5) * 0.5; // Add slight randomness
    const interestRate = baseRate + creditAdjustment + randomVariation;

    // Determine completeness percentage based on status
    const completenessMap: Record<LoanStatus, number> = {
      "draft": Math.floor(Math.random() * 30) + 10,
      "submitted": Math.floor(Math.random() * 20) + 40,
      "reviewing": Math.floor(Math.random() * 15) + 60,
      "information_needed": Math.floor(Math.random() * 10) + 50,
      "underwriting": Math.floor(Math.random() * 15) + 75,
      "approved": Math.floor(Math.random() * 5) + 95,
      "conditionally_approved": Math.floor(Math.random() * 5) + 90,
      "rejected": Math.floor(Math.random() * 20) + 70,
      "funding": 100,
      "funded": 100,
      "closed": 100
    };
    
    const completeness = completenessMap[status];

    // Assign agents based on application status
    const agentAssignments = {
      intakeAgentId: ["submitted", "reviewing", "information_needed", "underwriting", "approved", "conditionally_approved", "rejected", "funding", "funded", "closed"].includes(status)
        ? `intake-${generateId("")}` : undefined,
      processingAgentId: ["reviewing", "information_needed", "underwriting", "approved", "conditionally_approved", "rejected", "funding", "funded", "closed"].includes(status)
        ? `processing-${generateId("")}` : undefined,
      underwritingAgentId: ["underwriting", "approved", "conditionally_approved", "rejected", "funding", "funded", "closed"].includes(status)
        ? `underwriting-${generateId("")}` : undefined,
      decisionAgentId: ["approved", "conditionally_approved", "rejected", "funding", "funded", "closed"].includes(status)
        ? `decision-${generateId("")}` : undefined,
      fundingAgentId: ["funding", "funded", "closed"].includes(status)
        ? `funding-${generateId("")}` : undefined,
    };

    // Add funding source recommendation for some applications
    const recommendedFundingSourceId = ["approved", "conditionally_approved", "funding", "funded", "closed"].includes(status) && Math.random() > 0.3
      ? `FS-${generateId("")}` : undefined;

    // Create a "display status" for UI presentation that's more user-friendly
    const statusDisplayMap: Record<LoanStatus, string> = {
      "draft": "Draft",
      "submitted": "Submitted",
      "reviewing": "In Review",
      "information_needed": "Information Needed",
      "underwriting": "In Underwriting",
      "approved": "Approved",
      "conditionally_approved": "Conditionally Approved",
      "rejected": "Rejected",
      "funding": "Funding In Progress",
      "funded": "Funded",
      "closed": "Closed"
    };

    const displayStatus = statusDisplayMap[status];

    // Define purpose based on asset class
    const purpose = loanPurposes[Math.floor(Math.random() * loanPurposes.length)];

    return {
      id,
      borrowerId: borrower.id,
      borrower,
      assetClass,
      amount,
      term: [12, 24, 36, 60, 120, 180, 240, 360][Math.floor(Math.random() * 8)],
      interestRate: parseFloat(interestRate.toFixed(2)),
      purpose,
      completeness,
      displayStatus,
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
      dateReviewed,
      dateUnderwritten,
      dateApproved,
      dateFunded,
      dateClosed,
      agentAssignments,
      recommendedFundingSourceId,
      risk: borrower.creditScore 
        ? (borrower.creditScore > 750 ? "Low" : borrower.creditScore > 680 ? "Medium" : "High")
        : (Math.random() > 0.6 ? "Medium" : Math.random() > 0.5 ? "Low" : "High")
    };
  });
};

// Create mock agents
export const generateMockAgents = (): Agent[] => {
  const agentTypes: AgentType[] = ["intake", "processing", "underwriting", "decision"];
  
  return agentTypes.map(type => {
    const id = `${type}-${generateId("")}`;
    
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

// Generate mock funding sources
export const generateMockFundingSources = (): FundingSource[] => {
  const fundingSourceTypes: FundingSourceType[] = [
    "institutional_investor", "bank", "credit_union", "private_equity", 
    "government_program", "securitization_pool", "internal_funds", "peer_to_peer"
  ];
  
  const names = {
    "bank": ["First National Bank", "Midwest Regional Bank", "Pacific Trust Bank", "Enterprise Banking Group", "Atlantic Financial"],
    "credit_union": ["Community Credit Union", "Members First CU", "Federal Employees CU", "Teachers Credit Union", "Healthcare Workers CU"],
    "private_equity": ["Horizon Capital", "Summit Partners", "Blackstone Funding", "Highland Investments", "Vanguard Equity"],
    "institutional_investor": ["Global Investment Partners", "Prudential Asset Management", "Fidelity Investment Group", "State Retirement System", "University Endowment Fund"],
    "government_program": ["Federal Housing Authority", "Small Business Administration", "Export-Import Bank", "Rural Development Program", "Urban Development Fund"],
    "securitization_pool": ["Pacific Securitization Trust", "Residential Mortgage Securities", "Commercial Property Trust", "Auto Loan Backed Securities", "Structured Finance Trust"],
    "internal_funds": ["Credion Internal Fund", "Strategic Finance Pool", "Retained Earnings Fund", "Special Projects Fund", "Innovation Capital Fund"],
    "peer_to_peer": ["LendConnect Platform", "P2P Funding Marketplace", "Crowdsource Lending", "Retail Investor Network", "Direct Lending Exchange"]
  };
  
  return fundingSourceTypes.flatMap(type => {
    return Array.from({ length: Math.floor(Math.random() * 2) + 1 }).map((_, index) => {
      const id = `FS-${type.substring(0, 3).toUpperCase()}${(index + 1).toString().padStart(3, '0')}`;
      const nameList = names[type] || [`${type.replace(/_/g, ' ')} Fund ${index + 1}`];
      const name = nameList[Math.min(index, nameList.length - 1)];
      
      // Generate min/max loan amounts based on funding source type
      let minAmount = 10000;
      let maxAmount = 500000;
      switch (type) {
        case "bank":
          minAmount = 50000;
          maxAmount = 5000000;
          break;
        case "credit_union":
          minAmount = 5000;
          maxAmount = 500000;
          break;
        case "private_equity":
          minAmount = 500000;
          maxAmount = 20000000;
          break;
        case "institutional_investor":
          minAmount = 1000000;
          maxAmount = 50000000;
          break;
        case "government_program":
          minAmount = 10000;
          maxAmount = 750000;
          break;
        case "securitization_pool":
          minAmount = 100000;
          maxAmount = 1000000;
          break;
        case "internal_funds":
          minAmount = 10000;
          maxAmount = 1000000;
          break;
        case "peer_to_peer":
          minAmount = 1000;
          maxAmount = 100000;
          break;
      }
      
      // Generate interest rate ranges based on funding source type
      let minRate = 3.0;
      let maxRate = 7.0;
      switch (type) {
        case "bank":
          minRate = 4.25;
          maxRate = 7.5;
          break;
        case "credit_union":
          minRate = 3.75;
          maxRate = 6.5;
          break;
        case "private_equity":
          minRate = 6.75;
          maxRate = 12.0;
          break;
        case "institutional_investor":
          minRate = 5.0;
          maxRate = 9.0;
          break;
        case "government_program":
          minRate = 3.25;
          maxRate = 5.5;
          break;
        case "securitization_pool":
          minRate = 4.0;
          maxRate = 6.0;
          break;
        case "internal_funds":
          minRate = 3.5;
          maxRate = 9.0;
          break;
        case "peer_to_peer":
          minRate = 5.0;
          maxRate = 15.0;
          break;
      }
      
      // Generate eligibility criteria based on funding source type
      const eligibilityCriteria: any = {};
      
      // Add credit score requirement for some funding sources
      if (["bank", "credit_union", "government_program", "securitization_pool", "peer_to_peer"].includes(type)) {
        eligibilityCriteria.minCreditScore = type === "government_program" ? 580 : 
                                          type === "peer_to_peer" ? 620 : 
                                          type === "credit_union" ? 640 : 
                                          type === "bank" ? 680 : 700;
      }
      
      // Add loan-to-value ratio for secured loans
      if (["bank", "credit_union", "private_equity", "government_program", "securitization_pool"].includes(type)) {
        eligibilityCriteria.maxLTV = type === "government_program" ? 96.5 : 
                                  type === "credit_union" ? 90 : 
                                  type === "private_equity" ? 85 : 80;
      }
      
      // Add debt-to-income ratio for consumer loans
      if (["bank", "credit_union", "government_program", "peer_to_peer"].includes(type)) {
        eligibilityCriteria.maxDTI = type === "government_program" ? 50 : 
                                  type === "peer_to_peer" ? 50 : 
                                  type === "credit_union" ? 45 : 43;
      }
      
      // Add preferred asset classes
      switch (type) {
        case "bank":
          eligibilityCriteria.preferredAssetClasses = ["residential_mortgage", "commercial_real_estate", "auto_loan"];
          break;
        case "credit_union":
          eligibilityCriteria.preferredAssetClasses = ["residential_mortgage", "auto_loan", "personal_loan"];
          break;
        case "private_equity":
          eligibilityCriteria.preferredAssetClasses = ["commercial_real_estate", "sme_loan"];
          eligibilityCriteria.businessRequirements = "Minimum 2 years in operation with demonstrated growth";
          break;
        case "institutional_investor":
          eligibilityCriteria.preferredAssetClasses = ["commercial_real_estate", "residential_mortgage"];
          break;
        case "government_program":
          eligibilityCriteria.preferredAssetClasses = ["residential_mortgage"];
          break;
        case "securitization_pool":
          eligibilityCriteria.preferredAssetClasses = ["residential_mortgage"];
          break;
        case "internal_funds":
          eligibilityCriteria.preferredAssetClasses = ["residential_mortgage", "commercial_real_estate", "sme_loan", "equipment_finance"];
          break;
        case "peer_to_peer":
          eligibilityCriteria.preferredAssetClasses = ["personal_loan", "sme_loan"];
          break;
      }
      
      // Add location restrictions for some funding sources
      if (type === "credit_union") {
        eligibilityCriteria.locationRestrictions = ["CA", "OR", "WA"];
      }
      
      // Generate special programs for some funding sources
      let specialPrograms: string[] | undefined;
      if (Math.random() > 0.3) {
        switch (type) {
          case "bank":
            specialPrograms = ["First-time homebuyer", "Small business startup"];
            break;
          case "credit_union":
            specialPrograms = ["Community business grants", "First-time homebuyer assistance"];
            break;
          case "private_equity":
            specialPrograms = ["Growth accelerator", "Acquisition financing"];
            break;
          case "government_program":
            specialPrograms = ["Down payment assistance", "Housing counseling programs"];
            break;
          case "peer_to_peer":
            specialPrograms = ["Fast funding", "Flexible credit requirements"];
            break;
          case "internal_funds":
            specialPrograms = ["Employee program", "Strategic partnerships"];
            break;
        }
      }
      
      // Generate contact info for some funding sources
      let contactInfo: { name: string; email: string; phone: string } | undefined;
      if (Math.random() > 0.2) {
        const contactFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const contactLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const contactName = `${contactFirstName} ${contactLastName}`;
        const emailDomain = name.toLowerCase().replace(/\s+/g, '').substring(0, 12) + ".example.com";
        
        contactInfo = {
          name: contactName,
          email: `${contactFirstName.toLowerCase().charAt(0)}${contactLastName.toLowerCase()}@${emailDomain}`,
          phone: `(555) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`
        };
      }
      
      // Generate risk tolerance based on funding source type
      let riskTolerance: "conservative" | "moderate" | "aggressive";
      if (["bank", "securitization_pool", "institutional_investor"].includes(type)) {
        riskTolerance = "conservative";
      } else if (["credit_union", "government_program", "internal_funds"].includes(type)) {
        riskTolerance = "moderate";
      } else {
        riskTolerance = "aggressive";
      }
      
      // Generate process time ranges
      const minProcessingDays = type === "peer_to_peer" ? 1 : 
                            type === "internal_funds" ? 2 : 
                            type === "credit_union" ? 3 : 
                            type === "bank" ? 5 : 
                            type === "private_equity" ? 10 : 15;
                            
      const maxProcessingDays = minProcessingDays * (1 + Math.floor(Math.random() * 3));
      
      // Generate funding amounts
      const availableFunds = type === "institutional_investor" ? 50000000 + Math.random() * 950000000 :
                          type === "securitization_pool" ? 100000000 + Math.random() * 400000000 :
                          type === "private_equity" ? 20000000 + Math.random() * 80000000 :
                          type === "bank" ? 5000000 + Math.random() * 45000000 :
                          type === "government_program" ? 10000000 + Math.random() * 190000000 :
                          type === "credit_union" ? 1000000 + Math.random() * 14000000 :
                          type === "internal_funds" ? 1000000 + Math.random() * 9000000 :
                          500000 + Math.random() * 4500000;
                          
      const allocatedPercent = Math.random() * 0.7;
      const allocatedFunds = Math.round(availableFunds * allocatedPercent);
      
      return {
        id,
        name,
        type,
        description: `${type === "bank" ? "Traditional bank" : 
                    type === "credit_union" ? "Member-owned financial cooperative" : 
                    type === "private_equity" ? "Private equity firm" : 
                    type === "institutional_investor" ? "Large institutional investment fund" : 
                    type === "government_program" ? "Government-backed loan program" : 
                    type === "securitization_pool" ? "Mortgage-backed security pool" : 
                    type === "internal_funds" ? "Internal capital allocation" : 
                    "P2P lending marketplace"} ${type === "bank" ? "offering competitive rates for prime borrowers" : 
                                              type === "credit_union" ? "offering favorable rates for personal and small business loans" : 
                                              type === "private_equity" ? "specializing in commercial real estate and high-growth business financing" : 
                                              type === "institutional_investor" ? "focused on large-scale real estate and business investments" : 
                                              type === "government_program" ? "designed to help first-time and low-to-moderate income borrowers" : 
                                              type === "securitization_pool" ? "designed for conforming residential loans" : 
                                              type === "internal_funds" ? "for strategic partnerships and high-priority loan programs" : 
                                              "connecting individual investors with borrowers seeking personal and small business loans"}.`,
        minAmount,
        maxAmount,
        interestRateRange: {
          min: minRate,
          max: maxRate
        },
        eligibilityCriteria,
        processingTime: {
          min: minProcessingDays,
          max: maxProcessingDays
        },
        availableFunds: Math.round(availableFunds),
        allocatedFunds: Math.round(allocatedFunds),
        status: Math.random() > 0.8 ? "limited" : "active",
        riskTolerance,
        specialPrograms,
        contactInfo,
        dateAdded: randomDate(new Date(2023, 0, 1), new Date(2023, 11, 31)),
        lastUpdated: randomDate(new Date(2024, 0, 1), new Date())
      };
    });
  });
};

// Generate funding recommendations
export const generateFundingRecommendations = (applications: LoanApplication[], fundingSources: FundingSource[]): FundingRecommendation[] => {
  // Only generate recommendations for approved or conditionally approved applications
  const eligibleApps = applications.filter(app => 
    ["approved", "conditionally_approved", "funding", "funded", "closed"].includes(app.status)
  );
  
  return eligibleApps
    .filter(() => Math.random() > 0.3) // Only generate recommendations for some applications
    .map(app => {
      // Match funding sources based on asset class and amount
      const eligibleSources = fundingSources.filter(source => 
        source.minAmount <= app.amount &&
        source.maxAmount >= app.amount &&
        source.status === "active" &&
        (!source.eligibilityCriteria.preferredAssetClasses || 
         source.eligibilityCriteria.preferredAssetClasses.includes(app.assetClass))
      );
      
      if (eligibleSources.length === 0) return null;
      
      // Sort eligible sources by match score (based on various factors)
      const scoredSources = eligibleSources.map(source => {
        let score = 70; // Base score
        
        // Adjust score based on credit requirements
        if (source.eligibilityCriteria.minCreditScore && app.borrower.creditScore) {
          if (app.borrower.creditScore >= source.eligibilityCriteria.minCreditScore + 50) {
            score += 10; // Well above minimum
          } else if (app.borrower.creditScore >= source.eligibilityCriteria.minCreditScore) {
            score += 5; // Meets minimum
          } else {
            score -= 20; // Below minimum
          }
        }
        
        // Adjust score based on LTV if collateral exists
        if (source.eligibilityCriteria.maxLTV && app.collateral) {
          const ltv = (app.amount / app.collateral.value) * 100;
          if (ltv <= source.eligibilityCriteria.maxLTV - 10) {
            score += 8; // Well below maximum
          } else if (ltv <= source.eligibilityCriteria.maxLTV) {
            score += 4; // Meets maximum
          } else {
            score -= 15; // Exceeds maximum
          }
        }
        
        // Adjust score based on asset class preference
        if (source.eligibilityCriteria.preferredAssetClasses?.includes(app.assetClass)) {
          score += 10; // Preferred asset class
        }
        
        // Adjust score based on risk alignment
        if (app.risk === "Low" && source.riskTolerance === "conservative") {
          score += 8;
        } else if (app.risk === "Medium" && source.riskTolerance === "moderate") {
          score += 8;
        } else if (app.risk === "High" && source.riskTolerance === "aggressive") {
          score += 8;
        } else if (app.risk === "High" && source.riskTolerance === "conservative") {
          score -= 15;
        }
        
        // Add some randomness
        score += (Math.random() * 10) - 5;
        
        // Ensure score is within bounds
        score = Math.max(10, Math.min(99, score));
        
        return {
          source,
          score: Math.round(score)
        };
      });
      
      // Sort by score descending
      scoredSources.sort((a, b) => b.score - a.score);
      
      if (scoredSources.length === 0) return null;
      
      const topSource = scoredSources[0];
      const alternatives = scoredSources.slice(1, 3).map(alt => ({
        fundingSourceId: alt.source.id,
        matchScore: alt.score,
        reasons: generateMatchReasons(app, alt.source, alt.score, false)
      }));
      
      return {
        applicationId: app.id,
        fundingSourceId: topSource.source.id,
        matchScore: topSource.score,
        reasons: generateMatchReasons(app, topSource.source, topSource.score, true),
        alternatives,
        dateGenerated: randomDate(new Date(app.dateApproved || app.dateCreated), new Date()),
        generatedBy: `funding-agent-${generateId("")}`
      };
    })
    .filter((rec): rec is FundingRecommendation => rec !== null);
};

// Helper function to generate match reasons
const generateMatchReasons = (
  app: LoanApplication, 
  source: FundingSource, 
  score: number,
  isDetailedReason: boolean
): string[] => {
  const reasons: string[] = [];
  
  // Credit score reason
  if (source.eligibilityCriteria.minCreditScore && app.borrower.creditScore) {
    if (app.borrower.creditScore >= source.eligibilityCriteria.minCreditScore + 50) {
      reasons.push(`Credit score (${app.borrower.creditScore}) well exceeds minimum requirement (${source.eligibilityCriteria.minCreditScore})`);
    } else if (app.borrower.creditScore >= source.eligibilityCriteria.minCreditScore) {
      reasons.push(`Credit score (${app.borrower.creditScore}) meets minimum requirement (${source.eligibilityCriteria.minCreditScore})`);
    }
  }
  
  // Loan amount reason
  reasons.push(`Loan amount (${formatCurrency(app.amount)}) falls within ${source.type.replace(/_/g, ' ')}'s range (${formatCurrency(source.minAmount)} - ${formatCurrency(source.maxAmount)})`);
  
  // LTV reason
  if (source.eligibilityCriteria.maxLTV && app.collateral) {
    const ltv = (app.amount / app.collateral.value) * 100;
    const ltvFormatted = ltv.toFixed(1);
    if (ltv <= source.eligibilityCriteria.maxLTV - 10) {
      reasons.push(`LTV ratio (${ltvFormatted}%) is well below maximum (${source.eligibilityCriteria.maxLTV}%)`);
    } else if (ltv <= source.eligibilityCriteria.maxLTV) {
      reasons.push(`LTV ratio (${ltvFormatted}%) meets maximum requirement (${source.eligibilityCriteria.maxLTV}%)`);
    } else {
      reasons.push(`LTV ratio (${ltvFormatted}%) is slightly above preferred maximum (${source.eligibilityCriteria.maxLTV}%)`);
    }
  }
  
  // Asset class reason
  if (source.eligibilityCriteria.preferredAssetClasses?.includes(app.assetClass)) {
    reasons.push(`${app.assetClass.replace(/_/g, ' ')} is a preferred asset class for this funding source`);
  }
  
  // Risk profile reason
  if (app.risk && source.riskTolerance) {
    reasons.push(`${app.risk} risk profile matches ${source.type.replace(/_/g, ' ')}'s ${source.riskTolerance} risk tolerance`);
  }
  
  // Special program match
  if (source.specialPrograms && source.specialPrograms.length > 0) {
    if (app.purpose.toLowerCase().includes("first") && source.specialPrograms.some(p => p.toLowerCase().includes("first"))) {
      reasons.push(`First-time homebuyer purpose matches specialized program`);
    }
    
    if (app.assetClass === "sme_loan" && source.specialPrograms.some(p => p.toLowerCase().includes("business") || p.toLowerCase().includes("startup"))) {
      reasons.push(`Small business loan matches specialized business funding program`);
    }
  }
  
  // If it's an alternative option with less detailed reasons
  if (!isDetailedReason) {
    if (source.processingTime.max < 10) {
      reasons.push(`Faster processing time (${source.processingTime.min}-${source.processingTime.max} days)`);
    }
    
    if (source.interestRateRange.min < 5) {
      reasons.push(`Lower interest rates (from ${source.interestRateRange.min}%)`);
    }
    
    if (source.type === "government_program") {
      reasons.push(`Government backing with special assistance programs`);
    }
    
    if (source.type === "internal_funds") {
      reasons.push(`Internal strategic priority with streamlined approval`);
    }
    
    return reasons.slice(0, 2); // Only return top 2 reasons for alternatives
  }
  
  // Processing time reason (only for detailed view)
  if (app.purpose.toLowerCase().includes("urgent") || app.purpose.toLowerCase().includes("quick")) {
    if (source.processingTime.max <= 7) {
      reasons.push(`Quick processing time (${source.processingTime.min}-${source.processingTime.max} days) matches urgent funding need`);
    }
  }
  
  // Location reason (only for detailed view)
  if (source.eligibilityCriteria.locationRestrictions && 
      source.eligibilityCriteria.locationRestrictions.includes(app.borrower.address.state)) {
    reasons.push(`Borrower location (${app.borrower.address.state}) is within eligible service area`);
  }
  
  // Shuffle and limit reasons
  return reasons
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.min(reasons.length, 5));
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
      details: `Loan application ${randomApp.id} for ${randomApp.borrower.companyName || `${randomApp.borrower.firstName} ${randomApp.borrower.lastName}`}`,
      agentId: Math.random() > 0.5 ? Object.values(randomApp.agentAssignments).find(Boolean) : undefined
    };
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  // Calculate total portfolio value
  const totalPortfolioValue = applications
    .filter(app => ["approved", "conditionally_approved", "funding", "funded", "closed"].includes(app.status))
    .reduce((total, app) => total + app.amount, 0);

  // Calculate approval rate
  const decidedApplications = applications.filter(app => 
    ["approved", "conditionally_approved", "rejected"].includes(app.status)
  );
  
  const approvalRate = decidedApplications.length > 0 
    ? (decidedApplications.filter(app => ["approved", "conditionally_approved"].includes(app.status)).length / decidedApplications.length) * 100
    : 0;

  return {
    totalApplications: applications.length,
    applicationsToday: todayApplications.length,
    pendingReview: pendingReview.length,
    approvedToday: approvedToday.length,
    fundedToday: fundedToday.length,
    rejectedToday: rejectedToday.length,
    applicationsByStatus,
    applicationsByAssetClass,
    recentActivity,
    totalPortfolioValue,
    approvalRate: parseFloat(approvalRate.toFixed(1))
  };
};

// Initialize the mock data store
let borrowers: Borrower[] = [];
let applications: LoanApplication[] = [];
let agents: Agent[] = [];
let dashboardSummary: DashboardSummary;
let fundingSources: FundingSource[] = [];
let fundingRecommendations: FundingRecommendation[] = [];

// Function to initialize mock data
export const initMockData = () => {
  borrowers = generateMockBorrowers(50);
  applications = generateMockLoanApplications(500, borrowers);
  agents = generateMockAgents();
  dashboardSummary = generateDashboardSummary(applications);
  fundingSources = generateMockFundingSources();
  fundingRecommendations = generateFundingRecommendations(applications, fundingSources);
  
  console.log(`Generated ${borrowers.length} borrowers`);
  console.log(`Generated ${applications.length} applications`);
  console.log(`Generated ${agents.length} agent types`);
  console.log(`Generated ${fundingSources.length} funding sources`);
  console.log(`Generated ${fundingRecommendations.length} funding recommendations`);
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

// Get all applications with filtering options
export const getMockLoanApplications = (filters?: {
  status?: LoanStatus | LoanStatus[],
  assetClass?: AssetClass | AssetClass[],
  agentType?: AgentType,
  search?: string,
  limit?: number
}): LoanApplication[] => {
  if (applications.length === 0) {
    initMockData();
  }
  
  let filteredApps = [...applications];
  
  if (filters) {
    // Filter by status
    if (filters.status) {
      const statuses = Array.isArray(filters.status) ? filters.status : [filters.status];
      filteredApps = filteredApps.filter(app => statuses.includes(app.status));
    }
    
    // Filter by asset class
    if (filters.assetClass) {
      const assetClasses = Array.isArray(filters.assetClass) ? filters.assetClass : [filters.assetClass];
      filteredApps = filteredApps.filter(app => assetClasses.includes(app.assetClass));
    }
    
    // Filter by agent type
    if (filters.agentType) {
      filteredApps = filteredApps.filter(app => {
        switch (filters.agentType) {
          case "intake":
            return app.agentAssignments.intakeAgentId !== undefined;
          case "processing":
            return app.agentAssignments.processingAgentId !== undefined;
          case "underwriting":
            return app.agentAssignments.underwritingAgentId !== undefined;
          case "decision":
            return app.agentAssignments.decisionAgentId !== undefined;
          default:
            return true;
        }
      });
    }
    
    // Search in borrower name or application ID
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredApps = filteredApps.filter(app => {
        const borrowerName = app.borrower.companyName || `${app.borrower.firstName} ${app.borrower.lastName}`;
        return app.id.toLowerCase().includes(searchLower) || 
               borrowerName.toLowerCase().includes(searchLower) ||
               app.purpose.toLowerCase().includes(searchLower);
      });
    }
    
    // Apply limit if specified
    if (filters.limit && filters.limit > 0) {
      filteredApps = filteredApps.slice(0, filters.limit);
    }
  }
  
  return filteredApps;
};

export const getMockLoanApplicationById = (id: string): LoanApplication | undefined => {
  if (applications.length === 0) {
    initMockData();
  }
  return applications.find(app => app.id === id);
};

// Get applications for specific agent types
export const getApplicationsForAgentType = (agentType: AgentType): LoanApplication[] => {
  if (applications.length === 0) {
    initMockData();
  }
  
  // Filter applications based on agent type and appropriate statuses
  switch (agentType) {
    case "intake":
      return applications.filter(app => 
        ["draft", "submitted"].includes(app.status)
      );
    case "processing":
      return applications.filter(app => 
        ["reviewing", "information_needed"].includes(app.status)
      );
    case "underwriting":
      return applications.filter(app => 
        app.status === "underwriting"
      );
    case "decision":
      // Decision gets applications that have completed underwriting but not yet decided
      return applications.filter(app => 
        app.status === "underwriting" && 
        app.completeness >= 90
      );
    default:
      return [];
  }
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

// Get all funding sources
export const getMockFundingSources = (): FundingSource[] => {
  if (fundingSources.length === 0) {
    initMockData();
  }
  return fundingSources;
};

// Get funding source by ID
export const getMockFundingSourceById = (id: string): FundingSource | undefined => {
  if (fundingSources.length === 0) {
    initMockData();
  }
  return fundingSources.find(source => source.id === id);
};

// Get all funding recommendations
export const getMockFundingRecommendations = (): FundingRecommendation[] => {
  if (fundingRecommendations.length === 0) {
    initMockData();
  }
  return fundingRecommendations;
};

// Get funding recommendation by application ID
export const getMockFundingRecommendationByApplicationId = (appId: string): FundingRecommendation | undefined => {
  if (fundingRecommendations.length === 0) {
    initMockData();
  }
  return fundingRecommendations.find(rec => rec.applicationId === appId);
};

// Function to format currency amounts
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Function to get a count of applications by status
export const getApplicationCountByStatus = (status: LoanStatus | LoanStatus[]): number => {
  if (applications.length === 0) {
    initMockData();
  }
  
  const statuses = Array.isArray(status) ? status : [status];
  return applications.filter(app => statuses.includes(app.status)).length;
};

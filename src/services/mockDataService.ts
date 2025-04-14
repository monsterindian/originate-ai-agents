import { faker } from "@faker-js/faker";
import { LoanApplication, LoanStatus, AssetClass, Borrower, LoanApplicationDTO, CashFlowAnalysis, CashFlowHealth, RepaymentCapacity, CashFlowHistoricalData, CashFlowVolatilityMetrics, CashFlowProjections, CashFlowImprovementRecommendation, DashboardSummary } from "@/types";

// Function to generate a random LoanStatus
const getRandomLoanStatus = (): LoanStatus => {
  const statuses: LoanStatus[] = [
    "draft", "submitted", "reviewing", "information_needed",
    "underwriting", "approved", "conditionally_approved", "rejected",
    "funding", "funded", "closed"
  ];
  return faker.helpers.arrayElement(statuses);
};

// Function to generate a random AssetClass
const getRandomAssetClass = (): AssetClass => {
  const assetClasses: AssetClass[] = [
    "residential_mortgage", "commercial_real_estate", "auto_loan",
    "personal_loan", "sme_loan", "equipment_finance", "other"
  ];
  return faker.helpers.arrayElement(assetClasses);
};

// Function to generate a random Borrower
const createRandomBorrower = (): Borrower => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const isCompany = faker.datatype.boolean();

  return {
    id: 'B-' + faker.string.alphanumeric(8).toUpperCase(),
    firstName: firstName,
    lastName: lastName,
    companyName: isCompany ? faker.company.name() : undefined,
    email: faker.internet.email({ firstName, lastName }),
    phone: faker.phone.number(),
    dateOfBirth: faker.date.birthdate().toISOString().split('T')[0],
    ssn: faker.string.numeric(9),
    taxId: faker.string.numeric(9),
    address: {
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      zipCode: faker.location.zipCode(),
      country: faker.location.country(),
    },
    creditScore: faker.number.int({ min: 300, max: 850 }),
    creditRating: faker.helpers.arrayElement(['Excellent', 'Good', 'Fair', 'Poor']),
    income: faker.number.int({ min: 30000, max: 200000 }),
    annualRevenue: isCompany ? faker.number.int({ min: 100000, max: 10000000 }) : undefined,
    employmentStatus: faker.helpers.arrayElement(['Employed', 'Self-Employed', 'Unemployed']),
    industry: isCompany ? faker.commerce.department() : undefined,
    yearsInBusiness: isCompany ? faker.number.int({ min: 1, max: 50 }) : undefined,
    employmentInfo: {
      employer: faker.company.name(),
      position: faker.person.jobTitle(),
      startDate: faker.date.past().toISOString().split('T')[0],
      endDate: faker.date.future().toISOString().split('T')[0],
    },
    relationshipManager: faker.person.fullName(),
    dateCreated: faker.date.past().toISOString(),
    dateUpdated: faker.date.recent().toISOString(),
  };
};

// Function to generate a random LoanApplication
const createRandomLoanApplication = (): LoanApplicationDTO => {
  const amount = faker.number.int({ min: 10000, max: 1000000 });
  const status = getRandomLoanStatus();
  const assetClass = getRandomAssetClass();
  const borrower = createRandomBorrower();

  return {
    id: 'APP-' + faker.string.alphanumeric(8).toUpperCase(),
    borrowerId: borrower.id,
    assetClass: assetClass,
    amount: amount,
    term: faker.number.int({ min: 12, max: 60 }),
    interestRate: faker.number.float({ min: 3, max: 15, fractionDigits: 1 }),
    purpose: faker.lorem.sentence(),
    completeness: faker.number.int({ min: 20, max: 100 }),
    displayStatus: faker.helpers.arrayElement(['Draft', 'Submitted', 'In Review', 'Information Needed', 'In Underwriting', 'Approved', 'Conditionally Approved', 'Rejected', 'Funding In Progress', 'Funded', 'Closed']),
    risk: faker.helpers.arrayElement(['Low', 'Medium', 'High']),
    collateral: {
      type: faker.lorem.word(),
      value: faker.number.int({ min: 5000, max: 500000 }),
      description: faker.lorem.sentence(),
    },
    status: status,
    documents: [],
    notes: [],
    dateCreated: faker.date.past().toISOString(),
    dateUpdated: faker.date.recent().toISOString(),
    dateSubmitted: faker.date.past().toISOString(),
    dateReviewed: faker.date.past().toISOString(),
    dateUnderwritten: faker.date.past().toISOString(),
    dateApproved: faker.date.past().toISOString(),
    dateFunded: faker.date.past().toISOString(),
    dateClosed: faker.date.past().toISOString(),
    agentAssignments: {
      intakeAgentId: faker.string.uuid(),
      processingAgentId: faker.string.uuid(),
      underwritingAgentId: faker.string.uuid(),
      decisionAgentId: faker.string.uuid(),
      fundingAgentId: faker.string.uuid(),
      cashFlowAnalysisAgentId: faker.string.uuid(),
    },
    recommendedFundingSourceId: faker.string.uuid(),
  };
};

// Function to generate mock LoanApplications
export const getMockLoanApplications = (count: number = 150): LoanApplication[] => {
  const applications: LoanApplication[] = [];
  for (let i = 0; i < count; i++) {
    const applicationDTO = createRandomLoanApplication();
    const borrower = createRandomBorrower();
    const application: LoanApplication = {
      ...applicationDTO,
      borrower: borrower,
    };
    applications.push(application);
  }
  return applications;
};

// Function to get a specific loan application by ID
export const getMockLoanApplicationById = (id: string): LoanApplication | undefined => {
  const applications = getMockLoanApplications(150);
  return applications.find(app => app.id === id) || applications[0]; // Fallback to the first app if not found
};

// Function to get applications for a specific agent type - MODIFIED to ensure at least 100 applications
export const getApplicationsForAgentType = (agentType: string, count: number = 150): LoanApplication[] => {
  // Get a larger pool of applications to filter from
  const applications = getMockLoanApplications(250);
  
  // Initial filtered applications based on agent type
  let filteredApps: LoanApplication[];
  
  switch (agentType) {
    case "intake":
      filteredApps = applications.filter(app => 
        ["draft", "submitted", "reviewing"].includes(app.status)
      );
      break;
    case "processing":
      filteredApps = applications.filter(app => 
        ["reviewing", "information_needed"].includes(app.status)
      );
      break;
    case "underwriting":
      filteredApps = applications.filter(app => 
        ["underwriting"].includes(app.status)
      );
      break;
    case "decision":
      filteredApps = applications.filter(app => 
        ["underwriting", "approved", "conditionally_approved", "rejected"].includes(app.status)
      );
      break;
    case "fraud-risk":
      filteredApps = applications.map(app => ({
        ...app,
        risk: faker.helpers.arrayElement(['Low', 'Medium', 'High']) as "Low" | "Medium" | "High",
        fraudRiskScore: faker.number.int({ min: 20, max: 100 }),
        suspiciousActivity: faker.datatype.boolean(0.3),
        documentVerification: faker.helpers.arrayElement(['Verified', 'Pending', 'Failed']),
        riskFactors: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => 
          faker.helpers.arrayElement([
            'Multiple applications',
            'Address mismatch',
            'Credit bureau alerts',
            'Unusual transaction pattern',
            'Device risk',
            'Geolocation inconsistency',
            'Document manipulation detected',
            'Velocity checks failed'
          ])
        )
      }));
      break;
    case "cash-flow-analysis":
      filteredApps = applications.filter(app => 
        ["reviewing", "underwriting"].includes(app.status)
      );
      break;
    case "funding":
      filteredApps = applications.filter(app => 
        ["approved", "funding"].includes(app.status)
      );
      break;
    default:
      filteredApps = applications;
  }
  
  // Ensure we have at least 100 applications for any agent type
  if (filteredApps.length < 100) {
    console.log(`Not enough applications for ${agentType}, adding more.`);
    
    // Create additional applications specific to this agent type
    const additionalNeeded = 100 - filteredApps.length;
    const additionalApps: LoanApplication[] = [];
    
    for (let i = 0; i < additionalNeeded; i++) {
      // Create a base application
      const appDTO = createRandomLoanApplication();
      const borrower = createRandomBorrower();
      
      // Adjust the status to match the agent type
      let newStatus: LoanStatus;
      switch (agentType) {
        case "intake":
          newStatus = faker.helpers.arrayElement(["draft", "submitted", "reviewing"]);
          break;
        case "processing":
          newStatus = faker.helpers.arrayElement(["reviewing", "information_needed"]);
          break;
        case "underwriting":
          newStatus = "underwriting";
          break;
        case "decision":
          newStatus = faker.helpers.arrayElement(["underwriting", "approved", "conditionally_approved", "rejected"]);
          break;
        case "cash-flow-analysis":
          newStatus = faker.helpers.arrayElement(["reviewing", "underwriting"]);
          break;
        case "funding":
          newStatus = faker.helpers.arrayElement(["approved", "funding"]);
          break;
        default:
          newStatus = "reviewing";
      }
      
      // Create application with adjusted status
      const newApp: LoanApplication = {
        ...appDTO,
        borrower: borrower,
        status: newStatus,
      };
      
      // Add special fields for fraud-risk agent
      if (agentType === "fraud-risk") {
        Object.assign(newApp, {
          risk: faker.helpers.arrayElement(['Low', 'Medium', 'High']) as "Low" | "Medium" | "High",
          fraudRiskScore: faker.number.int({ min: 20, max: 100 }),
          suspiciousActivity: faker.datatype.boolean(0.3),
          documentVerification: faker.helpers.arrayElement(['Verified', 'Pending', 'Failed']),
          riskFactors: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => 
            faker.helpers.arrayElement([
              'Multiple applications',
              'Address mismatch',
              'Credit bureau alerts',
              'Unusual transaction pattern',
              'Device risk',
              'Geolocation inconsistency',
              'Document manipulation detected',
              'Velocity checks failed'
            ])
          )
        });
      }
      
      additionalApps.push(newApp);
    }
    
    filteredApps = [...filteredApps, ...additionalApps];
    console.log(`Added ${additionalApps.length} applications for ${agentType}, total: ${filteredApps.length}`);
  }
  
  // Make sure all fraud-risk applications have the required fields
  if (agentType === "fraud-risk") {
    filteredApps = filteredApps.map(app => ({
      ...app,
      risk: app.risk || faker.helpers.arrayElement(['Low', 'Medium', 'High']) as "Low" | "Medium" | "High",
      fraudRiskScore: app.fraudRiskScore || faker.number.int({ min: 20, max: 100 }),
      suspiciousActivity: app.suspiciousActivity !== undefined ? app.suspiciousActivity : faker.datatype.boolean(0.3),
      documentVerification: app.documentVerification || faker.helpers.arrayElement(['Verified', 'Pending', 'Failed']),
      riskFactors: app.riskFactors || Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => 
        faker.helpers.arrayElement([
          'Multiple applications',
          'Address mismatch',
          'Credit bureau alerts',
          'Unusual transaction pattern',
          'Device risk',
          'Geolocation inconsistency',
          'Document manipulation detected',
          'Velocity checks failed'
        ])
      )
    }));
  }
  
  return filteredApps.slice(0, count);
};

// Function to format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// Function to get application count by status
export const getApplicationCountByStatus = (statuses: string[]): number => {
  const applications = getMockLoanApplications();
  return applications.filter(app => statuses.includes(app.status)).length;
};

// Generate mock cash flow analysis data for a loan application
export const generateMockCashFlowAnalysis = (application: LoanApplication): CashFlowAnalysis => {
  const { amount, assetClass, borrower, risk } = application;
  const isCompany = !!borrower.companyName;
  
  // Set base values according to risk level
  const riskFactor = risk === "Low" ? 0.8 : risk === "Medium" ? 0.5 : 0.2;
  const baseRevenue = isCompany ? 
    (borrower.annualRevenue || amount * 4) : 
    (borrower.income || amount * 2);
  
  // Generate cash flow health and repayment capacity based on risk
  const cashFlowHealth: CashFlowHealth = riskFactor > 0.7 ? "Strong" : riskFactor > 0.4 ? "Moderate" : "Weak";
  const repaymentCapacity: RepaymentCapacity = riskFactor > 0.7 ? "Strong" : riskFactor > 0.4 ? "Moderate" : "Limited";
  
  // Generate historical financial data
  const historicalData: CashFlowHistoricalData = {
    revenue: Math.round(baseRevenue),
    revenueTrend: Math.round((riskFactor * 15) - 5),
    cogs: Math.round(baseRevenue * (0.55 - (riskFactor * 0.15))),
    cogsTrend: Math.round((riskFactor * 5) - 10),
    operatingExpenses: Math.round(baseRevenue * (0.25 - (riskFactor * 0.05))),
    operatingExpensesTrend: Math.round((riskFactor * 5) - 10),
    operatingCashFlow: 0, // Calculate below
    operatingCashFlowTrend: Math.round((riskFactor * 20) - 5),
    cashConversionCycle: Math.round(90 - (riskFactor * 60)),
    cashConversionCycleTrend: Math.round((riskFactor * 15) - 10),
    capitalExpenditures: Math.round(baseRevenue * 0.08),
    capitalExpendituresTrend: Math.round((riskFactor * 15) - 5),
    existingDebtService: Math.round(baseRevenue * 0.08),
    existingDebtServiceTrend: Math.round((riskFactor * 5) - 15),
    debtServiceCoverageRatio: 0, // Calculate below
    debtServiceCoverageTrend: Math.round((riskFactor * 15) - 5),
  };
  
  // Calculate operating cash flow and DSCR based on other metrics
  historicalData.operatingCashFlow = Math.round(
    historicalData.revenue - historicalData.cogs - historicalData.operatingExpenses
  );
  historicalData.debtServiceCoverageRatio = parseFloat(
    (historicalData.operatingCashFlow / historicalData.existingDebtService).toFixed(2)
  );
  
  // Generate volatility metrics
  const volatilityMetrics: CashFlowVolatilityMetrics = {
    revenueStandardDeviation: Math.round(historicalData.revenue * (0.2 - (riskFactor * 0.15))),
    revenueVolatilityInterpretation: riskFactor > 0.7 ? "Low volatility" : riskFactor > 0.4 ? "Moderate volatility" : "High volatility",
    cashBufferMonths: parseFloat((2 + (riskFactor * 8)).toFixed(1)),
    cashBufferInterpretation: riskFactor > 0.7 ? "Strong buffer" : riskFactor > 0.4 ? "Adequate buffer" : "Insufficient buffer",
    peakToTroughRatio: parseFloat((1.5 - (riskFactor * 0.5) + 0.5).toFixed(2)),
    peakToTroughInterpretation: riskFactor > 0.7 ? "Stable revenue" : riskFactor > 0.4 ? "Moderate fluctuations" : "Significant fluctuations",
  };
  
  // Generate projections
  const projectionPeriod = 36;
  const projections: CashFlowProjections = {
    annualRevenue: Math.round(historicalData.revenue * (1 + (historicalData.revenueTrend / 100))),
    annualGrowthRate: Math.max(0, Math.round(historicalData.revenueTrend)),
    operatingCashFlow: Math.round(historicalData.operatingCashFlow * (1 + (historicalData.operatingCashFlowTrend / 100))),
    freeCashFlow: 0, // Calculate below
    debtServiceCoverageRatio: 0, // Calculate below
    loanPaymentCapacity: 0, // Calculate below
  };
  
  // Calculate loan payment capacity
  const monthlyPayment = calculateMonthlyPayment(amount, 5.5, application.term);
  const newTotalDebtService = monthlyPayment + (historicalData.existingDebtService / 12);
  
  projections.freeCashFlow = Math.round(projections.operatingCashFlow - historicalData.capitalExpenditures);
  projections.debtServiceCoverageRatio = parseFloat(
    ((projections.operatingCashFlow / 12) / newTotalDebtService).toFixed(2)
  );
  projections.loanPaymentCapacity = Math.round((projections.operatingCashFlow / 12) * 0.5);
  
  // Determine funding recommendation based on application and analysis
  const isRabo = riskFactor > 0.6;
  const recommendedFundingSource = isRabo ? "Rabo Bank" : "ABN AMRO Bank";
  const recommendedInterestRate = isRabo ? 5.25 : 6.5;
  const recommendedLoanStructure = 
    amount > 1000000 
      ? `${application.term}-month term loan with quarterly financial reporting`
      : `${application.term}-month term loan with standard repayment terms`;
  
  return {
    cashFlowHealth,
    repaymentCapacity,
    recommendation: cashFlowHealth === "Strong" 
      ? "Recommended for approval" 
      : cashFlowHealth === "Moderate" 
      ? "Recommended with conditions" 
      : "Not recommended based on cash flow analysis",
    historicalData,
    volatilityMetrics,
    strengths: generateStrengths(cashFlowHealth, historicalData, volatilityMetrics),
    concerns: generateConcerns(cashFlowHealth, historicalData, volatilityMetrics),
    seasonalityInsights: generateSeasonalityInsights(assetClass),
    projectionsWhenGenerated: { ...projections },
    projections,
    projectionPeriod,
    stressTestingSummary: generateStressTestingSummary(projections, riskFactor),
    recommendedFundingSource,
    recommendedLoanStructure,
    recommendedInterestRate,
    fundingRationale: generateFundingRationale(recommendedFundingSource, cashFlowHealth, projections),
    riskFactors: generateRiskFactors(cashFlowHealth, historicalData, volatilityMetrics),
    mitigationStrategies: generateMitigationStrategies(cashFlowHealth),
    improvementRecommendations: generateImprovementRecommendations(historicalData, volatilityMetrics),
  };
};

// Helper functions for generating cash flow analysis components
const calculateMonthlyPayment = (principal: number, annualRate: number, termMonths: number): number => {
  const monthlyRate = annualRate / 100 / 12;
  return Math.round(
    (principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / 
    (Math.pow(1 + monthlyRate, termMonths) - 1)
  );
};

const generateStrengths = (
  cashFlowHealth: CashFlowHealth, 
  historicalData: CashFlowHistoricalData, 
  volatilityMetrics: CashFlowVolatilityMetrics
): string[] => {
  const strengths: string[] = [];
  
  if (historicalData.debtServiceCoverageRatio > 1.5) {
    strengths.push("Strong debt service coverage ratio indicates solid repayment capacity");
  }
  
  if (historicalData.revenueTrend > 5) {
    strengths.push(`Consistent revenue growth (${historicalData.revenueTrend}% year-over-year)`);
  }
  
  if (volatilityMetrics.cashBufferMonths > 3) {
    strengths.push(`Healthy cash buffer of ${volatilityMetrics.cashBufferMonths.toFixed(1)} months provides stability`);
  }
  
  if (historicalData.operatingCashFlowTrend > 0) {
    strengths.push("Positive trend in operating cash flow demonstrates improving operational efficiency");
  }
  
  if (historicalData.cashConversionCycle < 60) {
    strengths.push("Efficient cash conversion cycle of less than 60 days");
  }
  
  if (strengths.length < 3) {
    if (cashFlowHealth === "Strong") {
      strengths.push("Diversified revenue streams reduce cash flow volatility");
      strengths.push("Prudent financial management demonstrated through historical performance");
    } else if (cashFlowHealth === "Moderate" && strengths.length < 2) {
      strengths.push("Adequate margins provide some cushion against market fluctuations");
    }
  }
  
  return strengths.slice(0, 4);
};

const generateConcerns = (
  cashFlowHealth: CashFlowHealth, 
  historicalData: CashFlowHistoricalData, 
  volatilityMetrics: CashFlowVolatilityMetrics
): string[] => {
  const concerns: string[] = [];
  
  if (historicalData.debtServiceCoverageRatio < 1.25) {
    concerns.push("Below target debt service coverage ratio indicates potential repayment risk");
  }
  
  if (historicalData.revenueTrend < 0) {
    concerns.push(`Declining revenue trend (${historicalData.revenueTrend}% year-over-year)`);
  }
  
  if (volatilityMetrics.cashBufferMonths < 3) {
    concerns.push(`Limited cash buffer of only ${volatilityMetrics.cashBufferMonths.toFixed(1)} months increases vulnerability to disruptions`);
  }
  
  if (historicalData.operatingCashFlowTrend < 0) {
    concerns.push("Negative trend in operating cash flow may indicate deteriorating operational efficiency");
  }
  
  if (volatilityMetrics.peakToTroughRatio > 1.5) {
    concerns.push(`High revenue volatility (${volatilityMetrics.peakToTroughRatio.toFixed(2)}x peak-to-trough ratio)`);
  }
  
  if (historicalData.capitalExpendituresTrend > 15) {
    concerns.push(`Rapidly increasing capital expenditures (${historicalData.capitalExpendituresTrend}% year-over-year)`);
  }
  
  if (concerns.length < 3 && cashFlowHealth !== "Strong") {
    if (cashFlowHealth === "Weak") {
      concerns.push("Inadequate cash reserves relative to operational requirements");
      concerns.push("Potential challenges meeting additional debt obligations");
    } else if (cashFlowHealth === "Moderate" && concerns.length < 2) {
      concerns.push("Moderate seasonality may impact consistent debt service throughout the year");
    }
  }
  
  if (cashFlowHealth === "Strong" && concerns.length > 1) {
    // For strong applications, limit concerns
    return concerns.slice(0, 1);
  }
  
  return concerns.slice(0, 3);
};

const generateSeasonalityInsights = (assetClass: AssetClass): string[] => {
  const baseInsights = [
    "Revenue exhibits predictable seasonality with peaks in Q2 and Q4",
    "Cash conversion cycle fluctuates within 15% of average throughout the year"
  ];
  
  switch (assetClass) {
    case "residential_mortgage":
      return [
        ...baseInsights,
        "Strongest origination activity occurs in spring and summer months",
        "Year-end typically shows 15-20% lower application volume"
      ];
    
    case "commercial_real_estate":
      return [
        ...baseInsights,
        "Cash flows show quarterly patterns corresponding to tenant payment cycles",
        "Q4 typically includes annual reconciliations and adjustments"
      ];
    
    case "auto_loan":
      return [
        ...baseInsights,
        "Significant revenue increase (35-40%) during holiday season (Nov-Dec)",
        "January-February shows post-holiday slowdown with 25% below average volume"
      ];
    
    case "equipment_finance":
      return [
        ...baseInsights,
        "Strong correlation with fiscal year-end budgeting cycles",
        "Q1 typically sees 20-25% higher equipment financing activity"
      ];
    
    default:
      return [
        ...baseInsights,
        "Moderate seasonality observed with approximately 15% variation throughout the year",
        "Cash reserves adequately buffer seasonal fluctuations in most cases"
      ];
  }
};

const generateStressTestingSummary = (projections: CashFlowProjections, riskFactor: number): string => {
  if (riskFactor > 0.7) {
    return `Stress testing indicates robust cash flow resilience. The borrower can withstand significant revenue decreases (up to 20%) while maintaining adequate debt service coverage. Cash reserves provide ${(riskFactor * 10).toFixed(1)} months of operational coverage in adverse scenarios.`;
  } else if (riskFactor > 0.4) {
    return `Stress testing shows moderate cash flow resilience. The borrower can maintain adequate debt service coverage under moderate revenue decreases (up to 10%), but would face challenges with more significant disruptions. Cash reserves provide ${(riskFactor * 6).toFixed(1)} months of operational coverage in adverse scenarios.`;
  } else {
    return `Stress testing reveals cash flow vulnerability. Even minor revenue decreases (5-10%) would significantly impact debt service coverage. Limited cash reserves provide only ${(riskFactor * 4).toFixed(1)} months of operational coverage in adverse scenarios, suggesting high sensitivity to market disruptions.`;
  }
};

const generateFundingRationale = (
  fundingSource: string, 
  cashFlowHealth: CashFlowHealth, 
  projections: CashFlowProjections
): string => {
  if (fundingSource === "Rabo Bank") {
    if (cashFlowHealth === "Strong") {
      return `Rabo Bank is recommended due to the borrower's strong cash flow position (DSCR of ${projections.debtServiceCoverageRatio.toFixed(2)}x), established operational history, and favorable projected growth rate of ${projections.annualGrowthRate}%. The borrower meets Rabo Bank's preferred risk profile for this asset class, qualifying for their premium loan terms.`;
    } else {
      return `Rabo Bank is recommended as the borrower meets their core eligibility criteria despite some moderate cash flow considerations. The projected DSCR of ${projections.debtServiceCoverageRatio.toFixed(2)}x is acceptable, and Rabo's relationship-focused approach aligns well with the borrower's financing needs and growth trajectory.`;
    }
  } else {
    if (cashFlowHealth === "Weak") {
      return `ABN AMRO Bank is recommended as they offer specialized financing options for borrowers with more complex cash flow situations. Their custom underwriting approach can accommodate the borrower's DSCR of ${projections.debtServiceCoverageRatio.toFixed(2)}x with appropriate risk mitigations, whereas traditional lenders would typically decline this application.`;
    } else {
      return `ABN AMRO Bank is recommended due to their competitive rates for this risk profile and their experience with this asset class. The borrower's cash flow metrics (DSCR of ${projections.debtServiceCoverageRatio.toFixed(2)}x) align with ABN AMRO's standard requirements, and their flexible terms can accommodate the borrower's operational cycles.`;
    }
  }
};

const generateRiskFactors = (
  cashFlowHealth: CashFlowHealth, 
  historicalData: CashFlowHistoricalData, 
  volatilityMetrics: CashFlowVolatilityMetrics
): string[] => {
  const factors: string[] = [];
  
  // Add DSCR factor
  if (historicalData.debtServiceCoverageRatio > 1.5) {
    factors.push(`Strong debt service coverage ratio of ${historicalData.debtServiceCoverageRatio.toFixed(2)}x`);
  } else if (historicalData.debtServiceCoverageRatio > 1.1) {
    factors.push(`Moderate debt service coverage ratio of ${historicalData.debtServiceCoverageRatio.toFixed(2)}x`);
  } else {
    factors.push(`Weak debt service coverage ratio of ${historicalData.debtServiceCoverageRatio.toFixed(2)}x`);
  }
  
  // Add revenue trend factor
  if (historicalData.revenueTrend > 5) {
    factors.push(`Positive revenue growth trend of ${historicalData.revenueTrend}%`);
  } else if (historicalData.revenueTrend > -2) {
    factors.push(`Flat revenue trend of ${historicalData.revenueTrend}%`);
  } else {
    factors.push(`Negative revenue trend of ${historicalData.revenueTrend}%`);
  }
  
  // Add cash buffer factor
  if (volatilityMetrics.cashBufferMonths > 4) {
    factors.push(`Strong cash buffer of ${volatilityMetrics.cashBufferMonths.toFixed(1)} months`);
  } else if (volatilityMetrics.cashBufferMonths > 2) {
    factors.push(`Moderate cash buffer of ${volatilityMetrics.cashBufferMonths.toFixed(1)} months`);
  } else {
    factors.push(`Limited cash buffer of ${volatilityMetrics.cashBufferMonths.toFixed(1)} months`);
  }
  
  // Add volatility factor
  if (volatilityMetrics.peakToTroughRatio < 1.3) {
    factors.push(`Low revenue volatility with ${volatilityMetrics.peakToTroughRatio.toFixed(2)}x peak-to-trough ratio`);
  } else if (volatilityMetrics.peakToTroughRatio < 1.7) {
    factors.push(`Moderate revenue volatility with ${volatilityMetrics.peakToTroughRatio.toFixed(2)}x peak-to-trough ratio`);
  } else {
    factors.push(`High revenue volatility with ${volatilityMetrics.peakToTroughRatio.toFixed(2)}x peak-to-trough ratio`);
  }
  
  return factors;
};

const generateMitigationStrategies = (cashFlowHealth: CashFlowHealth): string[] => {
  const baseStrategies = [
    "Implement quarterly covenant testing focused on debt service coverage ratio",
    "Establish cash reserve requirements tied to upcoming debt service obligations"
  ];
  
  if (cashFlowHealth === "Strong") {
    return [
      ...baseStrategies,
      "Standard financial reporting on a quarterly basis",
      "Annual review of cash flow performance against projections"
    ];
  } else if (cashFlowHealth === "Moderate") {
    return [
      ...baseStrategies,
      "Implement enhanced financial reporting on a monthly basis",
      "Set performance-based interest rate adjustments to incentivize cash flow improvements",
      "Require management review meetings to address any negative trending metrics"
    ];
  } else {
    return [
      ...baseStrategies,
      "Require additional collateral or guarantees to offset cash flow risk",
      "Structure loan with initial interest-only period to allow cash flow stabilization",
      "Implement mandatory cash flow management consulting",
      "Establish cash sweep mechanism for excess cash flow periods to build reserves"
    ];
  }
};

const generateImprovementRecommendations = (
  historicalData: CashFlowHistoricalData, 
  volatilityMetrics: CashFlowVolatilityMetrics
): CashFlowImprovementRecommendation[] => {
  const recommendations: CashFlowImprovementRecommendation[] = [];
  
  if (historicalData.cashConversionCycle > 60) {
    recommendations.push({
      title: "Optimize Cash Conversion Cycle",
      description: "Reduce the cash conversion cycle by implementing more efficient inventory management and accounts receivable processes.",
      tags: ["Accounts Receivable", "Working Capital", "Cash Flow"]
    });
  }
  
  if (historicalData.operatingExpensesTrend > 0) {
    recommendations.push({
      title: "Cost Structure Optimization",
      description: "Review and optimize operating expenses to improve cash flow, focusing on areas with the highest growth rates.",
      tags: ["Cost Reduction", "Operational Efficiency", "Expense Management"]
    });
  }
  
  if (volatilityMetrics.cashBufferMonths < 4) {
    recommendations.push({
      title: "Strengthen Cash Reserves",
      description: "Build additional cash reserves to provide a stronger buffer against seasonal fluctuations and unexpected disruptions.",
      tags: ["Liquidity Management", "Risk Mitigation", "Cash Planning"]
    });
  }
  
  if (recommendations.length < 3) {
    recommendations.push({
      title: "Implement Cash Flow Forecasting System",
      description: "Establish a robust rolling 13-week cash flow forecasting process to better anticipate and manage cash needs.",
      tags: ["Forecasting", "Cash Management", "Planning"]
    });
  }
  
  // Always include this recommendation if not already addressed
  if (!recommendations.some(r => r.title.includes("Diversify Revenue"))) {
    recommendations.push({
      title: "Diversify Revenue Streams",
      description: "Explore opportunities to diversify revenue sources to reduce cash flow volatility and strengthen overall financial stability.",
      tags: ["Strategic Planning", "Growth", "Risk Management"]
    });
  }
  
  return recommendations.slice(0, 4);
};

// Generate mock dashboard summary data
export const getMockDashboardSummary = (): DashboardSummary => {
  // Create a count of applications by status
  const applicationsByStatus: Record<LoanStatus, number> = {
    draft: faker.number.int({ min: 20, max: 50 }),
    submitted: faker.number.int({ min: 30, max: 60 }),
    reviewing: faker.number.int({ min: 15, max: 40 }),
    information_needed: faker.number.int({ min: 10, max: 30 }),
    underwriting: faker.number.int({ min: 5, max: 25 }),
    approved: faker.number.int({ min: 10, max: 30 }),
    conditionally_approved: faker.number.int({ min: 5, max: 15 }),
    rejected: faker.number.int({ min: 5, max: 20 }),
    funding: faker.number.int({ min: 5, max: 15 }),
    funded: faker.number.int({ min: 10, max: 40 }),
    closed: faker.number.int({ min: 5, max: 20 }),
  };

  // Create a count of applications by asset class
  const applicationsByAssetClass: Record<AssetClass, number> = {
    residential_mortgage: faker.number.int({ min: 40, max: 100 }),
    commercial_real_estate: faker.number.int({ min: 20, max: 60 }),
    auto_loan: faker.number.int({ min: 10, max: 50 }),
    personal_loan: faker.number.int({ min: 30, max: 80 }),
    sme_loan: faker.number.int({ min: 15, max: 40 }),
    equipment_finance: faker.number.int({ min: 10, max: 30 }),
    other: faker.number.int({ min: 5, max: 20 }),
  };

  // Generate recent activity
  const recentActivityCount = faker.number.int({ min: 5, max: 10 });
  const recentActivity = [];
  
  for (let i = 0; i < recentActivityCount; i++) {
    const action = faker.helpers.arrayElement([
      'Application Submitted',
      'Application Approved',
      'Application Rejected',
      'Documents Uploaded',
      'Credit Check Completed',
      'Loan Funded',
      'Application Updated',
      'Notes Added',
      'Status Changed',
      'Agent Assigned',
    ]);
    
    recentActivity.push({
      timestamp: faker.date.recent().toISOString(),
      action,
      details: `${action} for Application ${faker.string.alphanumeric(8).toUpperCase()}`,
      agentId: faker.datatype.boolean() ? faker.string.uuid() : undefined,
    });
  }

  // Sort activities by timestamp (most recent first)
  recentActivity.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  // Calculate total applications
  const totalApplications = Object.values(applicationsByStatus).reduce((sum, count) => sum + count, 0);

  const approvalRate = faker.number.float({ min: 0.6, max: 0.85, fractionDigits: 2 });

  return {
    totalApplications,
    applicationsToday: faker.number.int({ min: 3, max: 15 }),
    pendingReview: applicationsByStatus.reviewing + applicationsByStatus.information_needed,
    approvedToday: faker.number.int({ min: 1, max: 8 }),
    fundedToday: faker.number.int({ min: 0, max: 5 }),
    rejectedToday: faker.number.int({ min: 0, max: 3 }),
    applicationsByStatus,
    applicationsByAssetClass,
    recentActivity,
    totalPortfolioValue: faker.number.int({ min: 5000000, max: 20000000 }),
    approvalRate,
  };
};

// Fix the handleGenerateReport function in Underwriting.tsx
export const handleGenerateReport = (appId: string) => {
  // Function moved from Underwriting.tsx
  console.log(`Generating report for ${appId}`);
};

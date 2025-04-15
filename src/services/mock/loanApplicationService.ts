import { faker } from "@faker-js/faker";
import { 
  LoanApplication, 
  LoanStatus, 
  AssetClass, 
  LoanApplicationDTO,
  Document,
  PreQualification,
  PreQualificationFactor
} from "@/types";
import { createRandomBorrower } from "./borrowerService";
import { 
  LOAN_STATUSES, 
  ASSET_CLASSES, 
  FRAUD_RISK_FACTORS, 
  DOCUMENT_VERIFICATION_STATUSES, 
  RISK_LEVELS,
  PRE_QUALIFICATION_SCORES,
  PRE_QUALIFICATION_FACTORS 
} from "./loanConstants";
import { getRandomElement } from "./utils";

// Function to generate a random LoanStatus
export const getRandomLoanStatus = (): LoanStatus => {
  return getRandomElement(LOAN_STATUSES);
};

// Function to generate a random AssetClass
export const getRandomAssetClass = (): AssetClass => {
  return getRandomElement(ASSET_CLASSES);
};

// Function to generate random documents for an application
export const createRandomDocuments = (applicationId: string, count: number = 3): Document[] => {
  const documentTypes = [
    "Income Verification", "Bank Statements", "Tax Returns", "Credit Report",
    "Business Financial Statements", "Collateral Assessment", "Identification",
    "Property Appraisal", "Business Plan", "Insurance Documentation",
    "Title Documentation", "Employment Verification"
  ];
  
  const aiSummaries = [
    "Document appears valid with all required information present.",
    "Information matches application data with 95% confidence.",
    "Some discrepancies detected in reported income figures.",
    "Document verified successfully with no issues detected.",
    "All verification checks passed with high confidence score.",
    "Information consistent with other provided documentation.",
    "Minor inconsistencies found but within acceptable margins.",
    "Document formatting confirms to expected standards for this type."
  ];
  
  return Array.from({ length: faker.number.int({ min: count, max: count + 3 }) }, (_, i) => {
    const uploadDate = faker.date.past();
    const status = faker.helpers.arrayElement(["pending", "verified", "rejected"]);
    const aiAnalysisComplete = status !== "pending" || faker.datatype.boolean(0.7);
    
    return {
      id: `DOC-${applicationId}-${i}`,
      name: `${faker.helpers.arrayElement(documentTypes)}_${faker.string.alphanumeric(6)}.pdf`,
      type: faker.helpers.arrayElement(documentTypes),
      url: `https://example.com/documents/${applicationId}/${i}`,
      uploadedBy: faker.internet.email(),
      uploadedAt: uploadDate.toISOString(),
      status: status,
      aiAnalysisComplete: aiAnalysisComplete,
      aiAnalysisSummary: aiAnalysisComplete ? faker.helpers.arrayElement(aiSummaries) : undefined
    };
  });
};

// Generate a random pre-qualification factor
export const createRandomPreQualificationFactor = (): PreQualificationFactor => {
  const factor = faker.helpers.arrayElement(PRE_QUALIFICATION_FACTORS);
  const impact = faker.helpers.arrayElement(["positive", "negative", "neutral"] as const);
  const score = impact === "positive" 
    ? faker.number.int({ min: 65, max: 100 }) 
    : impact === "negative" 
      ? faker.number.int({ min: 10, max: 45 }) 
      : faker.number.int({ min: 46, max: 64 });
  
  const explanations = {
    'Credit Score': [
      "Credit score falls within approved range for this loan type.",
      "Credit score below minimum threshold for automatic approval.",
      "Recent credit score improvement shows positive trend.",
      "Multiple recent credit inquiries raise potential concerns."
    ],
    'Income Verification': [
      "Income stability demonstrated over required time period.",
      "Income sources diversified and well-documented.",
      "Income verification documents incomplete or inconsistent.",
      "Income level insufficient for requested loan amount."
    ],
    'Employment History': [
      "Stable employment history exceeding minimum requirements.",
      "Recent job changes may indicate employment instability.",
      "Length of employment meets minimum criteria.",
      "Employment in unstable or high-risk industry sector."
    ],
    'Debt-to-Income Ratio': [
      "DTI ratio well within acceptable parameters.",
      "DTI ratio slightly exceeds guidelines but compensating factors present.",
      "High debt obligations relative to income level.",
      "Recent increase in debt obligations noted."
    ],
    'Business Performance': [
      "Strong consistent growth in business revenue.",
      "Business shows stable cash flow and profitability.",
      "Recent decline in business performance metrics.",
      "Business revenue fluctuations indicate potential instability."
    ],
    'Industry Risk Assessment': [
      "Business operates in stable, low-risk industry.",
      "Industry facing moderate regulatory or market challenges.",
      "High-risk industry classification requires additional review.",
      "Industry experiencing significant disruption or contraction."
    ],
    'Market Conditions': [
      "Local market conditions favorable for this asset class.",
      "Market indicators show stable valuation trends.",
      "Market volatility in this sector raises risk profile.",
      "Economic indicators suggest potential market contraction."
    ],
    'Collateral Value': [
      "Collateral value exceeds loan amount with healthy margin.",
      "Collateral valuation verified by recent appraisal.",
      "Collateral value marginally covers loan obligation.",
      "Collateral type or condition raises valuation concerns."
    ],
    'Previous Loan History': [
      "Excellent repayment history on previous loans.",
      "No negative repayment history indicators present.",
      "Previous late payments require additional explanation.",
      "No established loan repayment history available."
    ],
    'Documentation Completeness': [
      "All required documentation provided and verified.",
      "Key documentation complete and consistent.",
      "Missing or incomplete supporting documentation.",
      "Documentation inconsistencies require verification."
    ]
  };
  
  const factorKey = factor as keyof typeof explanations;
  const explanation = faker.helpers.arrayElement(explanations[factorKey]);
  
  return {
    factor,
    score,
    weight: faker.number.int({ min: 1, max: 5 }),
    explanation,
    impact
  };
};

// Generate random pre-qualification data
export const createRandomPreQualification = (): PreQualification => {
  // Generate 3-6 random factors
  const factorCount = faker.number.int({ min: 3, max: 6 });
  const factors: PreQualificationFactor[] = Array.from(
    { length: factorCount },
    () => createRandomPreQualificationFactor()
  );
  
  // Calculate weighted average score
  const totalWeight = factors.reduce((sum, factor) => sum + factor.weight, 0);
  const weightedScore = factors.reduce(
    (sum, factor) => sum + (factor.score * factor.weight), 
    0
  ) / totalWeight;
  
  // Round to nearest whole number
  const finalScore = Math.round(weightedScore);
  
  // Find the appropriate score label
  const scoreInfo = PRE_QUALIFICATION_SCORES.find(
    s => finalScore >= s.score
  ) || PRE_QUALIFICATION_SCORES[PRE_QUALIFICATION_SCORES.length - 1];
  
  const recommendations = [
    `Application meets pre-qualification criteria with a score of ${finalScore}. Recommended for processing.`,
    `Pre-qualification score of ${finalScore} indicates potential viability. Proceed with standard processing.`,
    `Score of ${finalScore} falls within acceptable range. Review noted concerns before processing.`,
    `Pre-qualification score of ${finalScore} indicates caution. Additional verification recommended.`,
    `Low pre-qualification score of ${finalScore}. Consider requesting additional documentation.`
  ];
  
  return {
    score: finalScore,
    scoreLabel: scoreInfo.label,
    recommendation: finalScore > 60 
      ? recommendations[0] 
      : finalScore > 45 
        ? recommendations[1] 
        : finalScore > 30 
          ? recommendations[2] 
          : finalScore > 15 
            ? recommendations[3] 
            : recommendations[4],
    factors: factors,
    dateGenerated: faker.date.recent().toISOString(),
    algorithmVersion: `v${faker.number.int({ min: 1, max: 3 })}.${faker.number.int({ min: 0, max: 9 })}.${faker.number.int({ min: 0, max: 9 })}`,
    thresholdForApproval: 60,
    generatedBy: "Pre-Qualification Agent",
    overrideReason: faker.datatype.boolean(0.1) 
      ? "Manual override based on exceptional circumstances or additional documentation provided." 
      : undefined
  };
};

// Function to generate a random LoanApplication
export const createRandomLoanApplication = (): LoanApplicationDTO => {
  const amount = faker.number.int({ min: 10000, max: 1000000 });
  const status = getRandomLoanStatus();
  const assetClass = getRandomAssetClass();
  const borrower = createRandomBorrower();
  const appId = 'APP-' + faker.string.alphanumeric(8).toUpperCase();
  
  // Generate random documents
  const documents = createRandomDocuments(appId);

  // Generate notes
  const notes = Array.from({ length: faker.number.int({ min: 0, max: 5 }) }, () => ({
    id: faker.string.uuid(),
    content: faker.lorem.paragraph(),
    createdBy: faker.helpers.arrayElement(["System", "Processing Agent", "Intake Agent", "Underwriter", "Pre-Qualification Agent"]),
    createdAt: faker.date.past().toISOString(),
    isAgentNote: faker.datatype.boolean(0.7)
  }));
  
  const preQualified = faker.datatype.boolean(0.8);
  const preQualification = preQualified ? createRandomPreQualification() : undefined;

  return {
    id: appId,
    borrowerId: borrower.id,
    assetClass: assetClass,
    amount: amount,
    term: faker.number.int({ min: 12, max: 60 }),
    interestRate: faker.number.float({ min: 3, max: 15, fractionDigits: 1 }),
    purpose: faker.lorem.sentence(),
    completeness: faker.number.int({ min: 20, max: 100 }),
    displayStatus: faker.helpers.arrayElement([
      'Draft', 'Submitted', 'In Review', 'Information Needed', 'Pre-Qualification Complete',
      'In Underwriting', 'Approved', 'Conditionally Approved', 'Rejected', 
      'Funding In Progress', 'Funded', 'Closed'
    ]),
    risk: getRandomElement(RISK_LEVELS),
    collateral: {
      type: faker.helpers.arrayElement(['Real Estate', 'Vehicle', 'Equipment', 'Inventory', 'Accounts Receivable', 'Securities']),
      value: faker.number.int({ min: 5000, max: 500000 }),
      description: faker.lorem.sentence(),
    },
    status: status,
    documents: documents,
    notes: notes,
    dateCreated: faker.date.past().toISOString(),
    dateUpdated: faker.date.recent().toISOString(),
    dateSubmitted: faker.date.past().toISOString(),
    dateReviewed: faker.date.past().toISOString(),
    dateUnderwritten: faker.date.past().toISOString(),
    dateApproved: faker.date.past().toISOString(),
    dateFunded: faker.date.past().toISOString(),
    dateClosed: faker.date.past().toISOString(),
    datePreQualified: preQualified ? faker.date.recent().toISOString() : undefined,
    preQualification: preQualification,
    agentAssignments: {
      intakeAgentId: faker.string.uuid(),
      processingAgentId: faker.string.uuid(),
      underwritingAgentId: faker.string.uuid(),
      decisionAgentId: faker.string.uuid(),
      fundingAgentId: faker.string.uuid(),
      cashFlowAnalysisAgentId: faker.string.uuid(),
      preQualificationAgentId: preQualified ? faker.string.uuid() : undefined,
    },
    recommendedFundingSourceId: faker.string.uuid(),
  };
};

// Generate a complete loan application with fraud risk data
export const createFraudRiskApplication = (baseApp: LoanApplication): LoanApplication => {
  return {
    ...baseApp,
    risk: getRandomElement(RISK_LEVELS),
    fraudRiskScore: faker.number.int({ min: 20, max: 100 }),
    suspiciousActivity: faker.datatype.boolean(0.3),
    documentVerification: getRandomElement(DOCUMENT_VERIFICATION_STATUSES.filter(
      status => ["Verified", "Pending", "Failed"].includes(status)
    ) as ("Verified" | "Pending" | "Failed")[]),
    riskFactors: Array.from(
      { length: faker.number.int({ min: 1, max: 5 }) }, 
      () => getRandomElement(FRAUD_RISK_FACTORS)
    )
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

// Helper function to ensure minimum number of applications for a status
const ensureMinimumApplicationsForStatus = (
  applications: LoanApplication[], 
  statuses: LoanStatus[], 
  minCount: number
): LoanApplication[] => {
  let filteredApps = applications.filter(app => statuses.includes(app.status));
  
  if (filteredApps.length < minCount) {
    const additionalNeeded = minCount - filteredApps.length;
    const additionalApps: LoanApplication[] = [];
    
    for (let i = 0; i < additionalNeeded; i++) {
      const appDTO = createRandomLoanApplication();
      const borrower = createRandomBorrower();
      
      appDTO.status = getRandomElement(statuses);
      
      const newApp: LoanApplication = {
        ...appDTO,
        borrower: borrower,
      };
      
      additionalApps.push(newApp);
    }
    
    return [...filteredApps, ...additionalApps];
  }
  
  return filteredApps;
};

// Function to get applications for a specific agent type
export const getApplicationsForAgentType = (agentType: string, count: number = 50): LoanApplication[] => {
  // Get a larger pool of applications to filter from
  const applications = getMockLoanApplications(300);
  const minAppCount = 50; // Ensure at least 50 applications for each agent
  
  // Initial filtered applications based on agent type
  let filteredApps: LoanApplication[];
  
  switch (agentType) {
    case "intake":
      filteredApps = ensureMinimumApplicationsForStatus(
        applications, 
        ["draft", "submitted"], 
        minAppCount
      );
      break;
    case "pre-qualification":
      filteredApps = ensureMinimumApplicationsForStatus(
        applications, 
        ["submitted"], 
        minAppCount
      );
      
      // Update all pre-qualification apps to have the correct display status
      filteredApps = filteredApps.map(app => ({
        ...app,
        displayStatus: "Intake Complete",
        documents: app.documents.length < 2 ? createRandomDocuments(app.id, 3) : app.documents
      }));
      break;
    case "processing":
      // For processing, ensure all applications have "pre_qualification_complete" status
      filteredApps = applications.map(app => ({
        ...app,
        status: "pre_qualification_complete",
        displayStatus: "Pre-Qualification Complete",
        preQualification: app.preQualification || createRandomPreQualification(),
        datePreQualified: app.datePreQualified || faker.date.recent().toISOString()
      }));
      
      // Take only what we need
      filteredApps = filteredApps.slice(0, minAppCount);
      
      // Make sure processing applications have documents
      filteredApps = filteredApps.map(app => {
        if (app.documents.length < 2) {
          return {
            ...app,
            documents: createRandomDocuments(app.id, 3)
          };
        }
        return app;
      });
      break;
    case "underwriting":
      filteredApps = ensureMinimumApplicationsForStatus(
        applications, 
        ["underwriting"], 
        minAppCount
      );
      break;
    case "decision":
      filteredApps = ensureMinimumApplicationsForStatus(
        applications, 
        ["underwriting", "approved", "conditionally_approved", "rejected"], 
        minAppCount
      );
      break;
    case "fraud-risk":
      // Create fraud risk applications with specific properties
      filteredApps = applications.slice(0, minAppCount).map(app => createFraudRiskApplication(app));
      break;
    case "cash-flow-analysis":
      filteredApps = ensureMinimumApplicationsForStatus(
        applications, 
        ["reviewing", "underwriting"], 
        minAppCount
      );
      break;
    case "funding":
      filteredApps = ensureMinimumApplicationsForStatus(
        applications, 
        ["approved", "funding"], 
        minAppCount
      );
      break;
    default:
      filteredApps = applications.slice(0, count);
  }
  
  console.log(`Generated ${filteredApps.length} applications for ${agentType}`);
  return filteredApps.slice(0, count);
};

// Function to get application count by status
export const getApplicationCountByStatus = (statuses: string[]): number => {
  const applications = getMockLoanApplications();
  return applications.filter(app => statuses.includes(app.status)).length;
};

// Moved from Underwriting.tsx
export const handleGenerateReport = (appId: string) => {
  console.log(`Generating report for ${appId}`);
};

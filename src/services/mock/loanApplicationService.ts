
import { faker } from "@faker-js/faker";
import { 
  LoanApplication, 
  LoanStatus, 
  AssetClass, 
  LoanApplicationDTO 
} from "@/types";
import { createRandomBorrower } from "./borrowerService";
import { LOAN_STATUSES, ASSET_CLASSES, FRAUD_RISK_FACTORS, DOCUMENT_VERIFICATION_STATUSES, RISK_LEVELS } from "./loanConstants";
import { getRandomElement } from "./utils";

// Function to generate a random LoanStatus
export const getRandomLoanStatus = (): LoanStatus => {
  return getRandomElement(LOAN_STATUSES);
};

// Function to generate a random AssetClass
export const getRandomAssetClass = (): AssetClass => {
  return getRandomElement(ASSET_CLASSES);
};

// Function to generate a random LoanApplication
export const createRandomLoanApplication = (): LoanApplicationDTO => {
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
    risk: getRandomElement(RISK_LEVELS),
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
export const getApplicationsForAgentType = (agentType: string, count: number = 150): LoanApplication[] => {
  // Get a larger pool of applications to filter from
  const applications = getMockLoanApplications(300);
  const minAppCount = 100; // Ensure at least 100 applications for each agent
  
  // Initial filtered applications based on agent type
  let filteredApps: LoanApplication[];
  
  switch (agentType) {
    case "intake":
      filteredApps = ensureMinimumApplicationsForStatus(
        applications, 
        ["draft", "submitted", "reviewing"], 
        minAppCount
      );
      break;
    case "processing":
      filteredApps = ensureMinimumApplicationsForStatus(
        applications, 
        ["reviewing", "information_needed"], 
        minAppCount
      );
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


import { faker } from "@faker-js/faker";
import { 
  DashboardSummary,
  LoanStatus,
  AssetClass
} from "@/types";
import { getMockLoanApplications } from "./loanApplicationService";
import { LOAN_STATUSES, ASSET_CLASSES } from "./loanConstants";

// Generate mock dashboard summary data
export const getMockDashboardSummary = (): DashboardSummary => {
  // Create a count of applications by status
  const applicationsByStatus: Record<LoanStatus, number> = {} as Record<LoanStatus, number>;
  
  LOAN_STATUSES.forEach(status => {
    applicationsByStatus[status] = faker.number.int({ min: 5, max: 60 });
  });

  // Create a count of applications by asset class
  const applicationsByAssetClass: Record<AssetClass, number> = {} as Record<AssetClass, number>;
  
  ASSET_CLASSES.forEach(assetClass => {
    applicationsByAssetClass[assetClass] = faker.number.int({ min: 5, max: 100 });
  });

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


// Re-export all mock services for ease of import
export * from './cashFlowService';
export * from './loanApplicationService';
export * from './borrowerService';
export * from './cashFlowChartData';
export * from './utils';
export * from './formatters';
export * from './loanConstants';
export * from './dashboardService';

// Add helper function to get application by ID
import { getMockLoanApplicationById } from './loanApplicationService';
export { getMockLoanApplicationById };

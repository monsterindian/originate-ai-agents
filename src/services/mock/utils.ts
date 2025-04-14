
import { formatCurrency } from './formatters';

// Re-export formatters
export { formatCurrency };

// Function to generate a random number within a range
export const getRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Function to get a random element from an array
export const getRandomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// Function to get random elements from an array
export const getRandomElements = <T>(array: T[], count: number): T[] => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Generate agent-specific URLs for navigation
export const generateAgentUrl = (agentType: string, applicationId: string): string => {
  switch (agentType) {
    case "intake":
      return `/agents/intake?applicationId=${applicationId}`;
    case "processing":
      return `/agents/processing?applicationId=${applicationId}`;
    case "underwriting":
      return `/agents/underwriting?applicationId=${applicationId}`;
    case "decision":
      return `/agents/decision?applicationId=${applicationId}`;
    case "fraud-risk":
      return `/agents/fraud-risk?applicationId=${applicationId}`;
    case "cash-flow-analysis":
      return `/agents/cash-flow-analysis?applicationId=${applicationId}`;
    case "funding":
      return `/agents/funding?applicationId=${applicationId}`;
    default:
      return `/applications?id=${applicationId}`;
  }
};

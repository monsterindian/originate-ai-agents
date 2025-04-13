
// This service would handle all interactions with the OpenAI API
// For now, we'll implement mock functions that simulate API responses

// Configuration
const API_DELAY = 800; // Simulated API delay in ms

// Mock prompt engineering templates
const PROMPT_TEMPLATES = {
  documentAnalysis: `Analyze the following document for a loan application:
  Document Type: {{documentType}}
  Borrower: {{borrowerName}}
  Application ID: {{applicationId}}
  
  Extract the following information:
  1. Verification of identity
  2. Income verification
  3. Asset information
  4. Potential discrepancies or red flags
  5. Overall assessment of document authenticity
  `,
  
  creditAssessment: `Perform a credit assessment on the following loan application:
  Borrower: {{borrowerName}}
  Credit Score: {{creditScore}}
  Income: {{income}}
  Loan Amount: {{loanAmount}}
  Loan Purpose: {{loanPurpose}}
  
  Provide:
  1. Risk assessment (Low, Medium, High)
  2. Recommended interest rate range
  3. Key risk factors
  4. Suggested conditions if applicable
  `,
  
  decisionRationale: `Generate a decision rationale for the following loan application:
  Application ID: {{applicationId}}
  Borrower: {{borrowerName}}
  Loan Amount: {{loanAmount}}
  Credit Score: {{creditScore}}
  Debt-to-Income Ratio: {{dtiRatio}}
  Loan-to-Value Ratio: {{ltvRatio}}
  
  Decision: {{decision}}
  
  Provide a comprehensive explanation for this decision including:
  1. Primary factors supporting the decision
  2. Any mitigating factors considered
  3. Policy guidelines applied
  4. Conditions (if applicable)
  `
};

// Simulated AI responses
const AI_RESPONSES = {
  documentAnalysis: [
    "Document appears genuine. Identity confirmed with government-issued ID. Income matches stated amount on application. No discrepancies detected.",
    "Document verified. Signature matches other documents. Income verification complete - $85,000 annual salary confirmed. No apparent alterations.",
    "Potential discrepancy detected. Income reported on application ($120,000) differs from documentation ($95,000). Recommend secondary verification.",
    "Document analysis complete. Identity confirmed. Employment status verified as 'Employed' at stated company. Income verification successful.",
    "Possible document modification detected. Creation date metadata appears altered. Recommend additional verification steps."
  ],
  
  creditAssessment: [
    "Risk Assessment: LOW. Excellent credit history with score of 780. Income adequately supports requested loan amount. Recommended interest rate: 4.5-5.2%. No significant risk factors identified.",
    "Risk Assessment: MEDIUM. Average credit score (680) with recent inquiries. Income sufficient but debt-to-income ratio at upper limit of acceptable range. Recommended interest rate: 6.1-7.3%. Suggest income verification and possible loan amount reduction.",
    "Risk Assessment: HIGH. Below average credit score (590) with multiple recent late payments. Income barely supports requested loan amount. Recommended interest rate: 8.5-10.2% or consider declining. Major risk factors: payment history, high utilization ratio.",
    "Risk Assessment: MEDIUM-LOW. Good credit score (720) with stable history. Income comfortably supports loan amount. Recommended interest rate: 5.3-6.0%. Minor risk factor: recent job change within same industry.",
    "Risk Assessment: HIGH. Credit score (560) below threshold. Multiple collections accounts and high revolving debt. Recommend declining or requiring significant collateral. Major risk factors: payment history, current delinquencies."
  ],
  
  decisionRationale: [
    "APPROVED: This application meets all key lending criteria. Borrower demonstrates strong repayment ability with debt-to-income ratio of 28% (below 36% threshold). Credit score of 760 indicates excellent credit management history. Employment stability (8+ years at current employer) provides additional confidence. Loan-to-value ratio of 75% provides adequate equity buffer.",
    "CONDITIONALLY APPROVED: Application meets core requirements but requires conditions prior to funding. Borrower's credit score (690) is acceptable but debt-to-income ratio of 42% exceeds preferred maximum. Conditions: 1) Additional down payment to reduce LTV from 85% to 80% or below, 2) Evidence of closing/paying down revolving credit account with highest balance.",
    "REJECTED: Application does not meet minimum lending standards. Primary factors: 1) Credit score of 560 below minimum threshold of 620, 2) Debt-to-income ratio of 52% exceeds maximum allowable 45%, 3) Multiple recent credit delinquencies (30+ days late) in past 12 months. Borrower may reapply after improving credit profile and reducing existing debt obligations.",
    "APPROVED: Application demonstrates strong fundamentals despite mixed factors. While credit score (650) is moderate, borrower shows exceptional income stability and significant assets. Debt-to-income ratio of 30% is well within guidelines. Low loan-to-value ratio of 65% provides substantial equity position. Employment history shows consistent industry experience and increasing income.",
    "CONDITIONALLY APPROVED: Application meets minimum standards but requires risk mitigation. Credit score (630) is at lower acceptable range. Income verification confirms ability to repay, but debt-to-income ratio of 40% approaches maximum threshold. Conditions: 1) Increase down payment to achieve LTV of 75% or less, 2) Provide 3 months reserves in verified liquid assets."
  ]
};

// Helper to simulate an API delay
const simulateApiDelay = async () => {
  return new Promise(resolve => setTimeout(resolve, API_DELAY));
};

// Mock document analysis
export const analyzeDocument = async (documentData: {
  documentType: string;
  borrowerName: string;
  applicationId: string;
}) => {
  await simulateApiDelay();
  
  // In a real implementation, this would call the OpenAI API with the formatted prompt
  const randomIndex = Math.floor(Math.random() * AI_RESPONSES.documentAnalysis.length);
  return {
    analysis: AI_RESPONSES.documentAnalysis[randomIndex],
    confidenceScore: Math.random() * 0.3 + 0.7, // Random score between 0.7 and 1.0
    processingTime: Math.floor(Math.random() * 3000 + 1000), // Random time between 1-4 seconds
  };
};

// Mock credit assessment
export const performCreditAssessment = async (applicationData: {
  borrowerName: string;
  creditScore: number;
  income: number;
  loanAmount: number;
  loanPurpose: string;
}) => {
  await simulateApiDelay();
  
  // In a real implementation, this would call the OpenAI API with the formatted prompt
  const randomIndex = Math.floor(Math.random() * AI_RESPONSES.creditAssessment.length);
  return {
    assessment: AI_RESPONSES.creditAssessment[randomIndex],
    confidenceScore: Math.random() * 0.3 + 0.7, // Random score between 0.7 and 1.0
    processingTime: Math.floor(Math.random() * 2000 + 1500), // Random time between 1.5-3.5 seconds
  };
};

// Mock decision rationale
export const generateDecisionRationale = async (decisionData: {
  applicationId: string;
  borrowerName: string;
  loanAmount: number;
  creditScore: number;
  dtiRatio: number;
  ltvRatio: number;
  decision: "approved" | "conditionally_approved" | "rejected";
}) => {
  await simulateApiDelay();
  
  // In a real implementation, this would call the OpenAI API with the formatted prompt
  const responseIndex = Math.floor(Math.random() * AI_RESPONSES.decisionRationale.length);
  
  // Ensure the decision in the response matches the requested decision
  // This would be handled by proper prompt engineering in a real implementation
  const responseDecision = decisionData.decision === "approved" ? 0 : 
                          decisionData.decision === "conditionally_approved" ? 1 : 2;
  
  return {
    rationale: AI_RESPONSES.decisionRationale[responseDecision],
    confidenceScore: Math.random() * 0.2 + 0.8, // Random score between 0.8 and 1.0
    processingTime: Math.floor(Math.random() * 3000 + 2000), // Random time between 2-5 seconds
  };
};

// Check OpenAI connection status
export const checkOpenAIConnection = async (): Promise<boolean> => {
  await simulateApiDelay();
  
  // In a real implementation, this would make a simple API call to verify the connection
  return true; // Mock always returns connected for now
};

// Function to initialize OpenAI with an API key
export const initializeOpenAI = async (apiKey: string): Promise<boolean> => {
  await simulateApiDelay();
  
  // In a real implementation, this would store the API key securely and test the connection
  if (apiKey && apiKey.length > 10) {
    console.log("OpenAI API key set successfully");
    return true;
  } else {
    console.error("Invalid OpenAI API key");
    return false;
  }
};

export default {
  analyzeDocument,
  performCreditAssessment,
  generateDecisionRationale,
  checkOpenAIConnection,
  initializeOpenAI
};

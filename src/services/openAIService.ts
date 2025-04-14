
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

// Improved AI responses for more accurate risk assessments
const AI_RESPONSES = {
  documentAnalysis: [
    "Document appears genuine with all required elements present. Identity has been confirmed through government-issued ID verification. Income documentation matches stated amounts on application ($85,000 annual salary). Bank statements show consistent income deposits over the past 12 months with no irregular transactions. No discrepancies detected.",
    "Document verified with high confidence. Signature patterns consistent across all provided documents. Income verification complete - $85,000 annual salary confirmed through pay stubs and employer verification. Tax returns aligned with stated income. No signs of alteration in any submitted documents.",
    "Potential discrepancy detected. Income reported on application ($120,000) differs from documentation ($95,000). This represents a 20.8% variance. Bank statements show deposits consistent with the lower amount. Recommend secondary verification through employer contact. Identity verification successful, but income requires additional documentation.",
    "Document analysis complete with medium confidence. Identity confirmed through multiple verification points. Employment status verified as 'Employed' at stated company for 3+ years. Income verification shows annual salary of $78,500 which is within 5% of application statement. Credit report information aligns with provided documentation.",
    "Possible document modification detected. PDF creation date metadata appears altered. Text layering analysis shows potential manipulation in the income section. The letterhead appears genuine, but the content may have been modified. Strong recommendation for additional verification including direct employer contact and original document request."
  ],
  
  creditAssessment: [
    "Risk Assessment: LOW (Score: 85/100). Excellent credit history with score of 780, which places borrower in the top 15% of consumers. Clean payment history with no late payments in 7+ years. Low credit utilization ratio of 12%. Current debt-to-income ratio of 28% is well below the 36% threshold. Income of $120,000 annually provides 4.2x coverage of the requested monthly payment. Recommended interest rate: 4.5-5.2%. No significant risk factors identified. Suggest standard documentation and verification procedures.",
    "Risk Assessment: MEDIUM (Score: 65/100). Average credit score (680) placing borrower in mid-tier risk category. Credit report shows 2 recent inquiries within past 6 months suggesting potential new debt acquisition. One 30-day late payment reported 14 months ago. Income sufficient but debt-to-income ratio at 42%, approaching upper limit of acceptable range (45%). Credit utilization at 38%. Recommended interest rate: 6.1-7.3%. Suggest additional income verification and consideration of loan amount reduction to improve DTI ratio.",
    "Risk Assessment: HIGH (Score: 35/100). Below average credit score (590) with multiple recent derogatory items. Credit report shows three 30+ day late payments in past 12 months and one 90+ day late payment. High credit utilization ratio of 72%. Debt-to-income ratio of 49% exceeds standard guideline maximum of 45%. Income barely supports requested loan amount with only 1.1x payment coverage. Recommended interest rate: 8.5-10.2% if approved, but strong consideration should be given to declining. Major risk factors: inconsistent payment history, high utilization ratio, excessive debt burden relative to income.",
    "Risk Assessment: MEDIUM-LOW (Score: 72/100). Good credit score (720) with stable history and no derogatory items. Income of $95,000 comfortably supports loan amount with 3.1x payment coverage. Debt-to-income ratio of 32% within acceptable parameters. Loan-to-value ratio of 75% provides adequate equity position. Minor risk factor: recent job change within same industry (8 months ago). Recommended interest rate: 5.3-6.0%. Suggest standard documentation with additional verification of employment stability.",
    "Risk Assessment: HIGH (Score: 25/100). Credit score (560) significantly below approval threshold. Multiple collections accounts (3) and high revolving debt utilization (85%). Two accounts currently 60+ days delinquent. Debt-to-income ratio of 53% exceeds maximum guideline of 45%. Employment history shows gaps and frequent changes. Loan purpose categorized as high-risk for cash-out refinance with limited equity. Recommend declining or requiring substantial compensating factors such as significant down payment, collateral, and co-signer with strong credit profile. Major risk factors: payment history, current delinquencies, employment instability."
  ],
  
  decisionRationale: [
    "APPROVED: This application meets all key lending criteria with strong positive indicators. Borrower demonstrates excellent repayment ability with debt-to-income ratio of 28% (well below 36% threshold). Credit score of 760 places borrower in top tier and indicates consistent, responsible credit management. Employment stability (8+ years at current employer) provides strong confidence in income continuity. Loan-to-value ratio of 75% creates adequate equity buffer protecting both borrower and lender interests. Property is located in a stable market with positive appreciation trends. The loan purpose (home improvement) will likely enhance property value, further improving the collateral position. All policy guidelines have been satisfied without exception.",
    "CONDITIONALLY APPROVED: Application meets core requirements but requires specific conditions prior to funding. Borrower's credit score (690) is acceptable though not exceptional. Debt-to-income ratio of 42% exceeds preferred maximum of 36% but remains under absolute maximum of 45%. Income verification confirms sufficient resources for repayment, but limited reserves (2 months) create elevated risk if income interruption occurs. Conditions: 1) Additional down payment to reduce LTV from 85% to 80% or below, 2) Evidence of closing/paying down revolving credit account with highest balance to improve DTI ratio, 3) Verification of 3 months reserves in liquid assets. Property appraisal supports value with no conditions. All other policy requirements have been satisfied.",
    "REJECTED: Application does not meet minimum lending standards with multiple significant deficiencies. Primary factors: 1) Credit score of 560 falls below minimum threshold of 620, with recent derogatory items including two 60+ day late payments within past 6 months, 2) Debt-to-income ratio of 52% substantially exceeds maximum allowable 45%, indicating potential repayment stress, 3) Loan-to-value ratio of 92% provides minimal equity cushion and increases collateral risk, 4) Income verification revealed 25% lower actual income than stated on application, creating misrepresentation concern. Borrower may reapply after improving credit profile, reducing existing debt obligations, and saving for larger down payment to improve equity position.",
    "APPROVED: Application demonstrates strong fundamentals despite some mixed factors. While credit score (650) is moderate, borrower shows exceptional income stability with 12+ years at same employer and significant documented assets ($150,000 in liquid reserves). Debt-to-income ratio of 30% is well within guidelines. Low loan-to-value ratio of 65% provides substantial equity position and reduces collateral risk. Employment history shows consistent industry experience and increasing income trajectory. Property is in desirable location with strong appreciation history. Loan purpose (home purchase) represents standard risk profile. All policy requirements have been met or exceeded, particularly in the areas of reserves and collateral coverage.",
    "CONDITIONALLY APPROVED: Application meets minimum standards but requires significant risk mitigation measures. Credit score (630) is at lower acceptable range with recent improvement trend noted (up 45 points in past 6 months). Income verification confirms ability to repay, but debt-to-income ratio of 40% approaches maximum threshold. Property appraisal identified minor condition issues requiring resolution. Loan-to-value ratio of 88% provides limited equity buffer. Conditions: 1) Increase down payment to achieve LTV of 85% or less, 2) Provide 3 months reserves in verified liquid assets, 3) Complete property repairs identified in appraisal, 4) Document all late payments were due to one-time medical event (as claimed) and not part of a pattern. Borrower's strong employment history (5+ years) and purpose of loan (primary residence) are positive factors supporting this conditional approval."
  ]
};

// Helper to simulate an API delay
const simulateApiDelay = async () => {
  return new Promise(resolve => setTimeout(resolve, API_DELAY));
};

// Helper to generate a comprehensive document analysis based on document type
const generateDocumentAnalysis = (documentType: string) => {
  const randomIndex = Math.floor(Math.random() * AI_RESPONSES.documentAnalysis.length);
  let baseAnalysis = AI_RESPONSES.documentAnalysis[randomIndex];
  
  // Add document-specific details
  if (documentType.toLowerCase().includes('bank')) {
    baseAnalysis += " Bank statements show consistent income deposits and reasonable spending patterns. Account balance history demonstrates financial stability.";
  } else if (documentType.toLowerCase().includes('tax')) {
    baseAnalysis += " Tax returns show consistent income reporting across multiple years. Schedule C business income aligns with stated business performance.";
  } else if (documentType.toLowerCase().includes('identity') || documentType.toLowerCase().includes('id')) {
    baseAnalysis += " Identity documents contain all security features expected. Photo matches other submitted documentation. No signs of tampering detected.";
  } else if (documentType.toLowerCase().includes('pay') || documentType.toLowerCase().includes('income')) {
    baseAnalysis += " Pay stubs show consistent income with expected deductions. YTD calculations match across all provided documents.";
  } else if (documentType.toLowerCase().includes('title') || documentType.toLowerCase().includes('deed')) {
    baseAnalysis += " Property ownership documentation appears complete and authentic. Chain of title is clear with no unexpected liens or encumbrances.";
  }
  
  return baseAnalysis;
};

// Mock document analysis with enhanced functionality
export const analyzeDocument = async (documentData: {
  documentType: string;
  borrowerName: string;
  applicationId: string;
}) => {
  await simulateApiDelay();
  
  // Generate a more detailed and specific analysis based on document type
  return {
    analysis: generateDocumentAnalysis(documentData.documentType),
    confidenceScore: Math.random() * 0.3 + 0.7, // Random score between 0.7 and 1.0
    processingTime: Math.floor(Math.random() * 3000 + 1000), // Random time between 1-4 seconds
    structuredData: {
      documentType: documentData.documentType,
      verificationStatus: Math.random() > 0.2 ? "verified" : "needs_review",
      keyDataPoints: {
        identityConfirmed: Math.random() > 0.1,
        incomeVerified: Math.random() > 0.2,
        discrepanciesFound: Math.random() < 0.15
      }
    }
  };
};

// Helper to calculate a proper risk score based on application data
const calculateRiskScore = (applicationData: {
  borrowerName: string;
  creditScore: number;
  income: number;
  loanAmount: number;
  loanPurpose: string;
}) => {
  // Base score calculation
  let score = 50; // Start with a neutral score
  
  // Credit score impact (significant factor)
  if (applicationData.creditScore >= 750) score += 25;
  else if (applicationData.creditScore >= 700) score += 20;
  else if (applicationData.creditScore >= 650) score += 10;
  else if (applicationData.creditScore >= 600) score -= 10;
  else if (applicationData.creditScore >= 550) score -= 20;
  else score -= 30;
  
  // Loan-to-income ratio impact
  const loanToIncomeRatio = applicationData.loanAmount / applicationData.income;
  if (loanToIncomeRatio <= 2) score += 15;
  else if (loanToIncomeRatio <= 3) score += 10;
  else if (loanToIncomeRatio <= 4) score += 0;
  else if (loanToIncomeRatio <= 5) score -= 10;
  else score -= 20;
  
  // Loan purpose impact
  if (applicationData.loanPurpose.toLowerCase().includes('refinance')) score += 5;
  if (applicationData.loanPurpose.toLowerCase().includes('debt')) score -= 5;
  if (applicationData.loanPurpose.toLowerCase().includes('investment')) score -= 3;
  if (applicationData.loanPurpose.toLowerCase().includes('education')) score += 3;
  if (applicationData.loanPurpose.toLowerCase().includes('medical')) score += 2;
  
  // Ensure score stays within 0-100 range
  return Math.max(0, Math.min(100, score));
};

// Helper to determine risk level based on score
const getRiskLevelFromScore = (score: number) => {
  if (score >= 70) return "Low";
  else if (score >= 45) return "Medium";
  else return "High";
};

// Mock credit assessment with enhanced functionality
export const performCreditAssessment = async (applicationData: {
  borrowerName: string;
  creditScore: number;
  income: number;
  loanAmount: number;
  loanPurpose: string;
}) => {
  await simulateApiDelay();
  
  // Calculate a meaningful risk score based on application data
  const riskScore = calculateRiskScore(applicationData);
  const riskLevel = getRiskLevelFromScore(riskScore);
  
  // Select appropriate response based on calculated risk level
  let responseIndex = 0;
  if (riskLevel === "Low") responseIndex = 0;
  else if (riskLevel === "Medium") responseIndex = Math.random() > 0.5 ? 1 : 3;
  else responseIndex = Math.random() > 0.5 ? 2 : 4;
  
  return {
    assessment: AI_RESPONSES.creditAssessment[responseIndex],
    riskLevel: riskLevel,
    riskScore: riskScore,
    confidenceScore: Math.random() * 0.3 + 0.7, // Random score between 0.7 and 1.0
    processingTime: Math.floor(Math.random() * 2000 + 1500), // Random time between 1.5-3.5 seconds
    recommendedInterestRate: riskLevel === "Low" ? 
      (Math.random() * 0.7 + 4.5).toFixed(2) + "%" : 
      riskLevel === "Medium" ? 
      (Math.random() * 1.2 + 6.1).toFixed(2) + "%" : 
      (Math.random() * 1.7 + 8.5).toFixed(2) + "%"
  };
};

// Mock decision rationale with enhanced functionality
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
  
  // Ensure the decision in the response matches the requested decision
  let responseIndex;
  if (decisionData.decision === "approved") responseIndex = 0;
  else if (decisionData.decision === "conditionally_approved") responseIndex = 1;
  else responseIndex = 2;
  
  // For more variation in positive cases
  if (decisionData.decision === "approved" && decisionData.creditScore < 700) {
    responseIndex = 3; // Use the "despite mixed factors" approval rationale
  }
  
  if (decisionData.decision === "conditionally_approved" && decisionData.creditScore < 650) {
    responseIndex = 4; // Use the more stringent conditional approval
  }
  
  return {
    rationale: AI_RESPONSES.decisionRationale[responseIndex],
    confidenceScore: Math.random() * 0.2 + 0.8, // Random score between 0.8 and 1.0
    processingTime: Math.floor(Math.random() * 3000 + 2000), // Random time between 2-5 seconds
    keyFactors: {
      creditScore: {
        value: decisionData.creditScore,
        impact: decisionData.creditScore >= 700 ? "positive" : 
                decisionData.creditScore >= 640 ? "neutral" : "negative"
      },
      dtiRatio: {
        value: decisionData.dtiRatio,
        impact: decisionData.dtiRatio <= 36 ? "positive" : 
                decisionData.dtiRatio <= 43 ? "neutral" : "negative"
      },
      ltvRatio: {
        value: decisionData.ltvRatio,
        impact: decisionData.ltvRatio <= 75 ? "positive" : 
                decisionData.ltvRatio <= 90 ? "neutral" : "negative"
      }
    }
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

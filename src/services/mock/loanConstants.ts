
import { LoanStatus, AssetClass } from "@/types";

// Loan statuses
export const LOAN_STATUSES: LoanStatus[] = [
  "draft", "submitted", "reviewing", "information_needed",
  "underwriting", "approved", "conditionally_approved", "rejected",
  "funding", "funded", "closed", "pre_qualification_complete"
];

// Asset classes
export const ASSET_CLASSES: AssetClass[] = [
  "residential_mortgage", "commercial_real_estate", "auto_loan",
  "personal_loan", "sme_loan", "equipment_finance", "other"
];

// Risk factors for fraud detection
export const FRAUD_RISK_FACTORS = [
  'Multiple applications',
  'Address mismatch',
  'Credit bureau alerts',
  'Unusual transaction pattern',
  'Device risk',
  'Geolocation inconsistency',
  'Document manipulation detected',
  'Velocity checks failed'
];

// Document verification statuses
export const DOCUMENT_VERIFICATION_STATUSES = ['Verified', 'Pending', 'Failed'];

// Risk levels - change from const assertion to regular array type
export const RISK_LEVELS: Array<"Low" | "Medium" | "High"> = ['Low', 'Medium', 'High'];

// Pre-qualification scores
export const PRE_QUALIFICATION_SCORES = [
  { score: 90, label: 'Excellent', description: 'Highly likely to be approved' },
  { score: 75, label: 'Good', description: 'Strong candidate for approval' },
  { score: 60, label: 'Moderate', description: 'May require additional verification' },
  { score: 45, label: 'Fair', description: 'Potential concerns that need review' },
  { score: 30, label: 'Poor', description: 'High risk, thorough review needed' },
  { score: 15, label: 'Very Poor', description: 'Significant risk factors present' }
];

// Pre-qualification factors
export const PRE_QUALIFICATION_FACTORS = [
  'Credit Score',
  'Income Verification',
  'Employment History',
  'Debt-to-Income Ratio',
  'Business Performance',
  'Industry Risk Assessment',
  'Market Conditions',
  'Collateral Value',
  'Previous Loan History',
  'Documentation Completeness'
];

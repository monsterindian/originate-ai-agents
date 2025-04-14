
import { LoanStatus, AssetClass } from "@/types";

// Loan statuses
export const LOAN_STATUSES: LoanStatus[] = [
  "draft", "submitted", "reviewing", "information_needed",
  "underwriting", "approved", "conditionally_approved", "rejected",
  "funding", "funded", "closed"
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

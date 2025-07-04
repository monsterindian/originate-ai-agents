import React from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { FileText, Download, Printer } from 'lucide-react';
import { formatCurrency } from '@/services/mockDataService';

interface DocumentGeneratorProps {
  documentType: 'application' | 'risk-assessment' | 'approval' | 'rejection' | 'funding';
  applicationData: any;
  onClose?: () => void;
}

const DocumentGenerator: React.FC<DocumentGeneratorProps> = ({ 
  documentType, 
  applicationData,
  onClose
}) => {
  const generateDocument = () => {
    toast.info(`Generating ${documentType} document...`);
    
    setTimeout(() => {
      const win = window.open("", "_blank");
      if (!win) {
        toast.error("Unable to open a new window to display the document.");
        return;
      }
      
      const documentContent = renderDocumentContent();
      
      win.document.write(`
        <html>
          <head>
            <title>${getDocumentTitle()}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #333; }
              .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; border-bottom: 2px solid #eee; padding-bottom: 20px; }
              .logo { max-width: 180px; }
              .document-title { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
              .document-subtitle { font-size: 14px; color: #666; }
              h1 { color: #333; margin-top: 30px; }
              h2 { color: #444; margin-top: 25px; font-size: 18px; }
              .section { margin-bottom: 25px; }
              table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
              th { background-color: #f5f5f5; font-weight: bold; }
              .risk-high { color: #e11d48; }
              .risk-medium { color: #f59e0b; }
              .risk-low { color: #10b981; }
              .success { color: #10b981; }
              .warning { color: #f59e0b; }
              .error { color: #e11d48; }
              .signature { margin-top: 50px; border-top: 1px solid #ddd; padding-top: 20px; }
              .footer { margin-top: 50px; font-size: 12px; color: #666; text-align: center; }
              .watermark { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 100px; color: rgba(0,0,0,0.03); pointer-events: none; z-index: -1; }
              .badge { display: inline-block; padding: 3px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; }
              .badge-success { background: #d1fae5; color: #065f46; }
              .badge-warning { background: #fef3c7; color: #92400e; }
              .badge-error { background: #fee2e2; color: #b91c1c; }
              ul { padding-left: 20px; }
              li { margin-bottom: 5px; }
              .highlight-box { background: #f9fafb; border: 1px solid #e5e7eb; padding: 15px; border-radius: 5px; margin: 15px 0; }
              .metric { color: #2563eb; font-weight: 600; }
              .positive { color: #10b981; font-weight: 600; }
              .negative { color: #e11d48; font-weight: 600; }
              .neutral { color: #f59e0b; font-weight: 600; }
              @media print {
                .no-print { display: none; }
                body { padding: 0; }
                .watermark { display: none; }
              }
            </style>
          </head>
          <body>
            <div class="watermark">Credion</div>
            <div class="header">
              <div>
                <div class="document-title">${getDocumentTitle()}</div>
                <div class="document-subtitle">Generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
              </div>
              <img src="/lovable-uploads/e4b25188-2fa1-497d-ae5d-db4b07d5cd39.png" class="logo" alt="Credion Logo">
            </div>
            
            <div class="no-print" style="text-align: right; margin-bottom: 20px;">
              <button onclick="window.print()" style="background: #f3f4f6; border: 1px solid #d1d5db; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-right: 10px;">
                Print Document
              </button>
              <button onclick="window.close()" style="background: #f3f4f6; border: 1px solid #d1d5db; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
                Close
              </button>
            </div>
            
            ${documentContent}
            
            <div class="footer">
              <p>This document was automatically generated by Credion Financial System.</p>
              <p>© ${new Date().getFullYear()} Credion. All rights reserved.</p>
            </div>
            
            <script>
              document.addEventListener('DOMContentLoaded', function() {
                console.log('Document fully loaded and displayed');
              });
            </script>
          </body>
        </html>
      `);
      
      win.document.close();
      toast.success(`${getDocumentTitle()} generated successfully!`);
    }, 1500);
  };
  
  const getDocumentTitle = () => {
    switch (documentType) {
      case 'application':
        return 'Loan Application Summary';
      case 'risk-assessment':
        return 'Risk Assessment Report';
      case 'approval':
        return 'Loan Approval Letter';
      case 'rejection':
        return 'Application Decision Notice';
      case 'funding':
        return 'Funding Authorization Document';
      default:
        return 'Document';
    }
  };
  
  const renderDocumentContent = () => {
    switch (documentType) {
      case 'application':
        return renderApplicationSummary();
      case 'risk-assessment':
        return renderRiskAssessment();
      case 'approval':
        return renderApprovalLetter();
      case 'rejection':
        return renderRejectionLetter();
      case 'funding':
        return renderFundingDocument();
      default:
        return '<p>Document content not available.</p>';
    }
  };
  
  const renderApplicationSummary = () => {
    const { id, borrower, amount, purpose, dateSubmitted, status, assetClass, term, interestRate, collateral } = applicationData;
    
    const borrowerName = borrower.companyName || `${borrower.firstName} ${borrower.lastName}`;
    
    return `
      <div class="section">
        <h1>Loan Application Summary</h1>
        <p>Application ID: <strong>${id}</strong></p>
        
        <h2>Borrower Information</h2>
        <table>
          <tr>
            <th width="30%">Borrower Name</th>
            <td>${borrowerName}</td>
          </tr>
          <tr>
            <th>Contact Email</th>
            <td>${borrower.email || 'N/A'}</td>
          </tr>
          <tr>
            <th>Contact Phone</th>
            <td>${borrower.phone || 'N/A'}</td>
          </tr>
          <tr>
            <th>Address</th>
            <td>
              ${borrower.address ? 
                `${borrower.address.street}<br/>
                ${borrower.address.city}, ${borrower.address.state} ${borrower.address.zipCode}<br/>
                ${borrower.address.country}` : 'N/A'}
            </td>
          </tr>
          ${borrower.creditScore ? `
          <tr>
            <th>Credit Score</th>
            <td>${borrower.creditScore}</td>
          </tr>` : ''}
        </table>
        
        <h2>Loan Details</h2>
        <table>
          <tr>
            <th width="30%">Loan Amount</th>
            <td>${typeof amount === 'number' ? formatCurrency(amount) : amount}</td>
          </tr>
          <tr>
            <th>Purpose</th>
            <td>${purpose}</td>
          </tr>
          <tr>
            <th>Asset Class</th>
            <td>${assetClass.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</td>
          </tr>
          <tr>
            <th>Term</th>
            <td>${term} months</td>
          </tr>
          ${interestRate ? `
          <tr>
            <th>Interest Rate</th>
            <td>${interestRate}%</td>
          </tr>` : ''}
          ${collateral ? `
          <tr>
            <th>Collateral</th>
            <td>
              <div>Type: ${collateral.type}</div>
              <div>Value: ${typeof collateral.value === 'number' ? formatCurrency(collateral.value) : collateral.value}</div>
              <div>Description: ${collateral.description}</div>
            </td>
          </tr>` : ''}
        </table>
        
        <h2>Application Status</h2>
        <div class="highlight-box">
          <p>Status: <span class="badge ${status === 'approved' || status === 'funded' ? 'badge-success' : 
                                        status === 'rejected' ? 'badge-error' : 'badge-warning'}">${
                                        status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span></p>
          <p>Date Submitted: ${dateSubmitted || 'Not yet submitted'}</p>
          <p>Application Completion: ${applicationData.completeness}%</p>
        </div>
        
        ${applicationData.notes && applicationData.notes.length > 0 ? `
        <h2>Application Notes</h2>
        <table>
          ${applicationData.notes.map(note => `
            <tr>
              <td width="25%">${new Date(note.createdAt).toLocaleDateString()}</td>
              <td>${note.content}</td>
              <td width="20%">By: ${note.createdBy}</td>
            </tr>
          `).join('')}
        </table>
        ` : ''}
      </div>
      
      <div class="signature">
        <p>Document generated by Credion Financial System</p>
        <p>Date: ${new Date().toLocaleDateString()}</p>
      </div>
    `;
  };
  
  const renderApprovalLetter = () => {
    const { id, borrower, amount, purpose, term, interestRate } = applicationData;
    
    const borrowerName = borrower.companyName || `${borrower.firstName} ${borrower.lastName}`;
    
    return `
      <div class="section">
        <h1>Loan Approval Letter</h1>
        <p style="margin-bottom: 30px;">Date: ${new Date().toLocaleDateString()}</p>
        
        <p>Dear ${borrowerName},</p>
        
        <p>We are pleased to inform you that your loan application (ID: <strong>${id}</strong>) has been <span class="success">APPROVED</span>.</p>
        
        <h2>Approved Loan Terms</h2>
        <table>
          <tr>
            <th width="30%">Loan Amount</th>
            <td>${typeof amount === 'number' ? formatCurrency(amount) : amount}</td>
          </tr>
          <tr>
            <th>Purpose</th>
            <td>${purpose}</td>
          </tr>
          <tr>
            <th>Loan Term</th>
            <td>${term} months</td>
          </tr>
          <tr>
            <th>Interest Rate</th>
            <td>${interestRate}%</td>
          </tr>
          <tr>
            <th>Estimated Monthly Payment</th>
            <td>${formatCurrency((amount * (interestRate/1200)) / (1 - Math.pow(1 + (interestRate/1200), -term)))}</td>
          </tr>
        </table>
        
        <h2>Next Steps</h2>
        <ol>
          <li>Review and sign the attached loan agreement documents</li>
          <li>Provide any additional documentation required for closing</li>
          <li>Schedule an appointment with your loan officer to complete the process</li>
        </ol>
        
        <div class="highlight-box">
          <p>Important: This approval is valid for 30 days from the date of this letter. If the loan is not closed within this period, we reserve the right to review and potentially adjust the terms based on current market conditions.</p>
        </div>
        
        <p style="margin-top: 30px;">Congratulations on your loan approval. We look forward to helping you achieve your financial goals. Should you have any questions or require further assistance, please do not hesitate to contact your relationship manager.</p>
        
        <p style="margin-top: 30px;">Sincerely,</p>
        <p style="margin-top: 50px;">Credion Financial Team</p>
      </div>
    `;
  };
  
  const renderRejectionLetter = () => {
    const { id, borrower, amount, purpose } = applicationData;
    
    const borrowerName = borrower.companyName || `${borrower.firstName} ${borrower.lastName}`;
    
    return `
      <div class="section">
        <h1>Application Decision Notice</h1>
        <p style="margin-bottom: 30px;">Date: ${new Date().toLocaleDateString()}</p>
        
        <p>Dear ${borrowerName},</p>
        
        <p>Thank you for your recent loan application (ID: <strong>${id}</strong>) for ${typeof amount === 'number' ? formatCurrency(amount) : amount} for the purpose of ${purpose}.</p>
        
        <p>After careful consideration and a thorough review of your application, we regret to inform you that we are unable to approve your loan request at this time.</p>
        
        <h2>Factors Considered in Our Decision</h2>
        <ul>
          <li>Credit history and current credit obligations</li>
          <li>Income verification and debt-to-income ratio analysis</li>
          <li>Collateral valuation and loan-to-value assessment</li>
          <li>Industry and market risk factors</li>
        </ul>
        
        <div class="highlight-box">
          <p>You have the right to request specific reasons for our decision within 60 days. You may also request a copy of the credit report we used in our evaluation.</p>
        </div>
        
        <h2>Alternative Options</h2>
        <p>We encourage you to consider the following alternatives:</p>
        <ul>
          <li>Apply for a different loan product that may better suit your current financial situation</li>
          <li>Work with our financial advisors to strengthen your application for future consideration</li>
          <li>Explore partnership opportunities with our small business development team</li>
        </ul>
        
        <p style="margin-top: 30px;">We value your interest in Credion Financial and would be happy to discuss alternative financing options or ways to improve your future applications. Please contact our customer service team to schedule a consultation.</p>
        
        <p style="margin-top: 30px;">Sincerely,</p>
        <p style="margin-top: 50px;">Credion Financial Team</p>
      </div>
    `;
  };
  
  const renderFundingDocument = () => {
    const { id, borrower, amount, purpose, dateApproved = new Date().toLocaleDateString(), term, interestRate } = applicationData;
    
    const borrowerName = borrower.companyName || `${borrower.firstName} ${borrower.lastName}`;
    
    return `
      <div class="section">
        <h1>Funding Authorization Document</h1>
        <p>Application ID: <strong>${id}</strong></p>
        
        <div class="highlight-box">
          <h2 style="margin-top: 0;">Funding Authorization</h2>
          <p>This document authorizes the disbursement of funds for the approved loan application referenced above.</p>
          <p>Authorization Date: ${new Date().toLocaleDateString()}</p>
          <p>Funding Status: <span class="badge badge-success">Approved for Disbursement</span></p>
        </div>
        
        <h2>Loan Details</h2>
        <table>
          <tr>
            <th width="30%">Borrower</th>
            <td>${borrowerName}</td>
          </tr>
          <tr>
            <th>Approved Amount</th>
            <td>${typeof amount === 'number' ? formatCurrency(amount) : amount}</td>
          </tr>
          <tr>
            <th>Purpose</th>
            <td>${purpose}</td>
          </tr>
          <tr>
            <th>Approval Date</th>
            <td>${dateApproved}</td>
          </tr>
          <tr>
            <th>Loan Term</th>
            <td>${term} months</td>
          </tr>
          <tr>
            <th>Interest Rate</th>
            <td>${interestRate}%</td>
          </tr>
        </table>
        
        <h2>Disbursement Information</h2>
        <table>
          <tr>
            <th width="30%">Method of Disbursement</th>
            <td>Electronic Fund Transfer</td>
          </tr>
          <tr>
            <th>Scheduled Disbursement Date</th>
            <td>${new Date(new Date().setDate(new Date().getDate() + 2)).toLocaleDateString()}</td>
          </tr>
          <tr>
            <th>Disbursement Amount</th>
            <td>${typeof amount === 'number' ? formatCurrency(amount) : amount}</td>
          </tr>
        </table>
        
        <h2>Terms and Conditions</h2>
        <ul>
          <li>Funds will be disbursed to the account specified in the loan agreement</li>
          <li>First payment due 30 days after disbursement</li>
          <li>All conditions precedent have been satisfied</li>
          <li>Loan documents have been properly executed and recorded where applicable</li>
        </ul>
        
        <div class="highlight-box">
          <p><strong>Important Notice:</strong> This funding authorization is valid for 5 business days from the authorization date. If disbursement cannot be completed within this timeframe, a new authorization will be required.</p>
        </div>
      </div>
      
      <div style="margin-top: 50px;">
        <p style="border-top: 1px solid #ddd; padding-top: 20px;">Authorized by: Credion Financial Funding Department</p>
        <p>Authorization ID: FND-${Math.random().toString(36).substring(2, 10).toUpperCase()}</p>
        <p>Date: ${new Date().toLocaleDateString()}</p>
      </div>
    `;
  };
  
  const renderRiskAssessment = () => {
    const { id, borrower, risk, amount, purpose, assetClass, collateral, term, interestRate } = applicationData;
    
    const borrowerName = borrower.companyName || `${borrower.firstName} ${borrower.lastName}`;
    
    let riskLevel = 'Medium';
    let riskScore = 50;
    let riskFactors = [];
    let riskStrengths = [];
    let riskRatios = {};
    
    if (risk) {
      if (typeof risk === 'string') {
        riskLevel = risk;
      } else {
        riskLevel = risk.level || risk.rating || riskLevel;
        riskScore = risk.score || riskScore;
        riskFactors = risk.factors || [];
        riskStrengths = risk.strengths || [];
        riskRatios = risk.ratios || {};
      }
    }
    
    // Ensure risk score aligns with risk level
    if (riskLevel === 'Low' && riskScore < 70) {
      riskScore = Math.floor(Math.random() * 21) + 80; // 80-100
    } else if (riskLevel === 'Medium' && (riskScore < 45 || riskScore > 69)) {
      riskScore = Math.floor(Math.random() * 25) + 45; // 45-69
    } else if (riskLevel === 'High' && riskScore > 44) {
      riskScore = Math.floor(Math.random() * 35) + 10; // 10-44
    }
    
    if (riskFactors.length === 0) {
      if (riskLevel === 'High') {
        riskFactors = [
          "Credit score of " + borrower.creditScore + " falls below preferred threshold",
          "Debt-to-income ratio of " + (borrower.dtiRatio || "48%") + " exceeds policy guidelines",
          "Limited cash reserves relative to loan amount (" + (Math.floor(Math.random() * 2) + 1) + " months)",
          "Inconsistent payment history with " + (Math.floor(Math.random() * 3) + 2) + " late payments in past 12 months",
          "Industry sector experiencing significant volatility with uncertain outlook",
          "Loan purpose carries elevated risk profile"
        ];
      } else if (riskLevel === 'Medium') {
        riskFactors = [
          "Moderate credit history with credit score of " + borrower.creditScore,
          "Debt-to-income ratio of " + (borrower.dtiRatio || "42%") + " approaching policy limits",
          "Sufficient but not robust cash reserves (" + (Math.floor(Math.random() * 2) + 3) + " months)",
          "Limited time in business or at current employment position",
          "Market conditions in subject property area show mixed signals"
        ];
      } else {
        riskFactors = [
          "Excellent credit score of " + borrower.creditScore,
          "Strong debt-to-income ratio of " + (borrower.dtiRatio || "32%") + " well within guidelines",
          "Substantial cash reserves (" + (Math.floor(Math.random() * 6) + 6) + " months)",
          "Consistent, clean payment history across all accounts",
          "Strong industry position with favorable outlook"
        ];
      }
    }
    
    if (riskStrengths.length === 0) {
      if (riskLevel === 'Low') {
        riskStrengths = [
          "Excellent credit profile with score in top " + (Math.floor(Math.random() * 15) + 5) + "% of consumers",
          "Strong debt service coverage ratio of " + ((Math.random() * 0.5 + 1.4).toFixed(1)) + "x",
          "Substantial equity position with " + (borrower.downPayment || "30%") + " down payment",
          "Significant liquid assets totaling " + (formatCurrency(Math.random() * 200000 + 100000)),
          "Long-term stable employment with consistent income growth",
          borrower.companyName ? "Established business with " + (borrower.yearsInBusiness || "12") + " years operating history" : "Professional career with advancement pattern"
        ];
      } else if (riskLevel === 'Medium') {
        riskStrengths = [
          "Acceptable credit history with limited adverse items",
          "Income sufficient to service debt obligations",
          "Adequate collateral coverage with loan-to-value of " + (borrower.ltvRatio || "78%"),
          "Stable industry sector without significant volatility",
          borrower.companyName ? "Business demonstrates consistent, if modest, growth" : "Employment history shows stability in current position"
        ];
      } else {
        riskStrengths = [
          "Borrower's willingness to provide additional collateral",
          "Recent improvement in credit score trend (+" + (Math.floor(Math.random() * 30) + 15) + " points in 6 months)",
          "Strong family or business ties to community",
          "Essential nature of business in local economy",
          "Potential for improved financial position based on pending developments"
        ];
      }
    }
    
    if (Object.keys(riskRatios).length === 0) {
      const loanToValueRatio = collateral && collateral.value ? 
        Math.round((amount / collateral.value) * 100) + '%' : 
        riskLevel === 'Low' ? '65%' : riskLevel === 'Medium' ? '78%' : '92%';
      
      const dtiRatio = borrower.dtiRatio || 
                      (riskLevel === 'Low' ? '32%' : riskLevel === 'Medium' ? '42%' : '48%');
      
      riskRatios = {
        "Loan-to-Value Ratio": loanToValueRatio,
        "Debt-to-Income Ratio": dtiRatio,
        "Debt Service Coverage Ratio": riskLevel === 'Low' ? '1.8' : riskLevel === 'Medium' ? '1.2' : '0.9',
        "Current Ratio": riskLevel === 'Low' ? '2.5' : riskLevel === 'Medium' ? '1.5' : '0.8',
        "Credit Utilization": riskLevel === 'Low' ? '15%' : riskLevel === 'Medium' ? '38%' : '72%',
        "Return on Assets": riskLevel === 'Low' ? '12%' : riskLevel === 'Medium' ? '8%' : '3%'
      };
    }
    
    const industryAnalysis = borrower.industry ? 
      `<h2>Industry Sector Analysis</h2>
      <div class="highlight-box">
        <p>The <span class="metric">${borrower.industry}</span> industry currently shows ${
          riskLevel === 'Low' ? 
            '<span class="positive">strong growth potential</span> with stable market conditions. Historical performance indicates resilience during economic downturns, and forward-looking indicators suggest continued stability.' : 
          riskLevel === 'Medium' ? 
            '<span class="neutral">moderate growth</span> with some market fluctuations. The sector has shown adequate resilience historically, though it may experience some volatility in response to broader economic trends.' : 
            '<span class="negative">significant volatility</span> and sensitivity to market conditions. Recent sector performance has been inconsistent, with heightened sensitivity to economic downturns and regulatory changes.'
        }</p>
        <p><strong>Key Industry Factors:</strong></p>
        <ul>
          ${riskLevel === 'Low' ? `
            <li><span class="positive">Strong projected growth rate of 5-7% annually</span></li>
            <li><span class="positive">Limited regulatory concerns affecting operations</span></li>
            <li><span class="positive">Low competition intensity with strong market positioning</span></li>
            <li><span class="positive">Minimal exposure to international trade tensions</span></li>` : 
          riskLevel === 'Medium' ? `
            <li><span class="neutral">Moderate projected growth rate of 3-4% annually</span></li>
            <li><span class="neutral">Some regulatory changes on the horizon requiring monitoring</span></li>
            <li><span class="neutral">Moderate competition with adequate market position</span></li>
            <li><span class="neutral">Some exposure to supply chain or market disruptions</span></li>` : `
            <li><span class="negative">Uncertain growth prospects with potential for contraction</span></li>
            <li><span class="negative">Significant regulatory challenges affecting operations</span></li>
            <li><span class="negative">Intense competition threatening market position</span></li>
            <li><span class="negative">High vulnerability to external economic factors</span></li>`
          }
        </ul>
      </div>` : 
      '<p>No industry-specific analysis available for this application.</p>';
    
    const economicOutlook = `
      <h2>Economic Outlook Assessment</h2>
      <div class="highlight-box">
        <p>Current economic indicators suggest ${
          riskLevel === 'Low' ? 
            'a <span class="positive">positive outlook</span> for the lending environment. Interest rates are expected to remain stable, and economic growth forecasts are favorable.' : 
          riskLevel === 'Medium' ? 
            'a <span class="neutral">cautiously optimistic outlook</span> with some potential risks. Interest rates may experience moderate fluctuations, and economic growth shows mixed signals.' : 
            '<span class="negative">significant caution</span> is warranted. Interest rate volatility is expected, and economic indicators suggest potential downside risks.'
        }</p>
        <p><strong>Key Macroeconomic Factors:</strong></p>
        <ul>
          ${riskLevel === 'Low' ? `
            <li><span class="metric">GDP growth</span> trending <span class="positive">positively at 2.5-3%</span></li>
            <li><span class="metric">Inflation</span> remains <span class="positive">within target range of 2-2.5%</span></li>
            <li><span class="metric">Unemployment rate</span> <span class="positive">stable at 3.5-4%</span></li>
            <li><span class="metric">Consumer confidence</span> indices <span class="positive">showing strength</span></li>` : 
          riskLevel === 'Medium' ? `
            <li><span class="metric">GDP growth</span> <span class="neutral">moderate at 1.5-2%</span></li>
            <li><span class="metric">Inflation</span> <span class="neutral">slightly above target at 3-3.5%</span></li>
            <li><span class="metric">Unemployment rate</span> at <span class="neutral">4.5-5%</span></li>
            <li><span class="metric">Consumer confidence</span> showing <span class="neutral">mixed signals</span></li>` : `
            <li><span class="metric">GDP growth</span> <span class="negative">slowing to 0-1%</span></li>
            <li><span class="metric">Inflation</span> <span class="negative">above target at 4-5%</span></li>
            <li><span class="metric">Unemployment rate</span> <span class="negative">rising to 5.5-6%</span></li>
            <li><span class="metric">Consumer confidence</span> <span class="negative">trending downward</span></li>`
          }
        </ul>
      </div>`;
    
    const collateralAnalysis = collateral ? `
      <h2>Comprehensive Collateral Analysis</h2>
      <div class="highlight-box">
        <table>
          <tr>
            <th width="30%">Type</th>
            <td>${collateral.type}</td>
          </tr>
          <tr>
            <th>Value</th>
            <td>${typeof collateral.value === 'number' ? formatCurrency(collateral.value) : collateral.value}</td>
          </tr>
          <tr>
            <th>Loan-to-Value Ratio</th>
            <td><span class="metric">LTV:</span> ${typeof collateral.value === 'number' && typeof amount === 'number' ? 
                 `${Math.round((amount / collateral.value) * 100)}%` : 'N/A'}</td>
          </tr>
          <tr>
            <th>Description</th>
            <td>${collateral.description}</td>
          </tr>
        </table>
        <p><strong>Collateral Quality Assessment:</strong> ${
          riskLevel === 'Low' ? 
            '<span class="positive">High-quality collateral</span> with strong valuation supported by recent appraisals. The collateral has high liquidity and stable market value with minimal expected depreciation.' : 
          riskLevel === 'Medium' ? 
            '<span class="neutral">Adequate collateral</span> with acceptable valuation. The collateral has reasonable liquidity, though some market fluctuations may affect future value.' : 
            'The collateral presents <span class="negative">concerns regarding valuation stability</span> and liquidity. Market conditions could significantly impact value, and liquidation may be challenging.'
        }</p>
      </div>` : 
      '<p>No collateral information available for this application.</p>';
    
    const stressTestingSection = `
      <h2>Financial Stress Testing</h2>
      <p>The application has been subjected to stress testing to assess resilience under adverse scenarios:</p>
      <table>
        <tr>
          <th>Scenario</th>
          <th>Impact Assessment</th>
          <th>Mitigation Factors</th>
        </tr>
        <tr>
          <td><span class="metric">Interest Rate Increase (+2%)</span></td>
          <td class="${riskLevel === 'Low' ? 'risk-low' : riskLevel === 'Medium' ? 'risk-medium' : 'risk-high'}">
            ${riskLevel === 'Low' ? 'Low Impact' : riskLevel === 'Medium' ? 'Moderate Impact' : 'Significant Impact'}
          </td>
          <td>
            ${riskLevel === 'Low' ? 
              'Borrower maintains <span class="positive">substantial payment capacity</span> even with increased rates.' : 
            riskLevel === 'Medium' ? 
              'Borrower can absorb <span class="neutral">moderate rate increases</span> with some adjustment to cash flow.' : 
              'Borrower would face <span class="negative">significant payment stress</span> under increased rates.'}
          </td>
        </tr>
        <tr>
          <td><span class="metric">Income Reduction (-20%)</span></td>
          <td class="${riskLevel === 'Low' ? 'risk-low' : riskLevel === 'Medium' ? 'risk-medium' : 'risk-high'}">
            ${riskLevel === 'Low' ? 'Low Impact' : riskLevel === 'Medium' ? 'Moderate Impact' : 'High Impact'}
          </td>
          <td>
            ${riskLevel === 'Low' ? 
              '<span class="positive">Strong cash reserves</span> and multiple income sources provide substantial buffer.' : 
            riskLevel === 'Medium' ? 
              '<span class="neutral">Some cash reserves</span> available, but prolonged income reduction would create strain.' : 
              '<span class="negative">Limited reserves</span> and high reliance on primary income source creates vulnerability.'}
          </td>
        </tr>
        <tr>
          <td><span class="metric">Collateral Value Decline (-15%)</span></td>
          <td class="${riskLevel === 'Low' ? 'risk-low' : riskLevel === 'Medium' ? 'risk-medium' : 'risk-high'}">
            ${riskLevel === 'Low' ? 'Low Impact' : riskLevel === 'Medium' ? 'Moderate Impact' : 'High Impact'}
          </td>
          <td>
            ${riskLevel === 'Low' ? 
              '<span class="positive">Substantial equity cushion</span> would remain even after value decline.' : 
            riskLevel === 'Medium' ? 
              '<span class="neutral">Adequate but reduced equity</span> position would remain after decline.' : 
              '<span class="negative">Minimal or negative equity</span> position would result from value decline.'}
          </td>
        </tr>
      </table>`;
    
    return `
      <div class="section">
        <h1>Comprehensive Risk Assessment Report</h1>
        <p>Application ID: <strong>${id}</strong></p>
        <p>Generated by Credion AI Risk Assessment Engine on ${new Date().toLocaleDateString()}</p>
        
        <div class="highlight-box">
          <h2 style="margin-top: 0;">Risk Rating Summary</h2>
          <table>
            <tr>
              <th width="30%">Overall Risk Assessment</th>
              <td>
                <span class="${riskLevel === 'Low' ? 'risk-low' : riskLevel === 'Medium' ? 'risk-medium' : 'risk-high'}">
                  ${riskLevel} Risk
                </span>
              </td>
            </tr>
            <tr>
              <th>Risk Score</th>
              <td>${riskScore}/100</td>
            </tr>
            <tr>
              <th>Application Type</th>
              <td>${purpose} (${assetClass.replace(/_/g, ' ').replace(/\\b\\w/g, l => l.toUpperCase())})</td>
            </tr>
            <tr>
              <th>Requested Amount</th>
              <td>${typeof amount === 'number' ? formatCurrency(amount) : amount}</td>
            </tr>
          </table>
        </div>
        
        <h2>Key Risk Factors</h2>
        <ul>
          ${riskFactors.map(factor => `<li>${factor}</li>`).join('')}
        </ul>
        
        <h2>Mitigating Strengths</h2>
        <ul>
          ${riskStrengths.map(strength => `<li>${strength}</li>`).join('')}
        </ul>
        
        <h2>Financial Ratio Analysis</h2>
        <table>
          ${Object.entries(riskRatios).map(([name, value]) => `
            <tr>
              <th width="50%">${name}</th>
              <td>${value}</td>
            </tr>
          `).join('')}
        </table>
        
        ${industryAnalysis}
        
        ${economicOutlook}
        
        ${collateralAnalysis}
        
        ${stressTestingSection}
        
        <h2>Risk Assessment Conclusion</h2>
        <div class="highlight-box">
          <p>Based on comprehensive analysis of the application data, borrower profile, collateral quality, and market conditions, 
            this application presents a <span class="${riskLevel === 'Low' ? 'risk-low' : riskLevel === 'Medium' ? 'risk-medium' : 'risk-high'}">${riskLevel.toLowerCase()} level of risk</span> 
            to the institution.</p>
          <p><strong>Recommendation:</strong> ${
            riskLevel === 'Low' ? 
              '<span class="positive">Approve</span> - The application demonstrates strong fundamentals and acceptable risk parameters.' : 
            riskLevel === 'Medium' ? 
              '<span class="neutral">Conditional Approval</span> - Recommend proceeding with additional risk mitigation measures or adjusted terms.' : 
              '<span class="negative">Decline</span> - Risk factors exceed institutional guidelines. Consider alternative products or requesting additional collateral.'
          }</p>
        </div>
      </div>
    `;
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-gray-500" />
          <h2 className="text-xl font-semibold">{getDocumentTitle()}</h2>
        </div>
        {onClose && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onClose}
          >
            Close
          </Button>
        )}
      </div>
      
      <p className="text-sm text-gray-500">
        Generate a professional document based on the application data.
      </p>
      
      <div className="flex space-x-2">
        <Button 
          variant="default" 
          onClick={generateDocument}
          className="flex items-center"
        >
          <FileText className="mr-2 h-4 w-4" />
          Generate Document
        </Button>
        
        <Button 
          variant="outline" 
          onClick={generateDocument}
          className="flex items-center"
        >
          <Printer className="mr-2 h-4 w-4" />
          Print Document
        </Button>
        
        <Button 
          variant="outline" 
          onClick={generateDocument}
          className="flex items-center"
        >
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
      </div>
    </div>
  );
};

export default DocumentGenerator;

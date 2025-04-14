import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { 
  FileCheck, Clock, AlertTriangle, FileX, MessageSquare, UserCheck, 
  FileText, Send, Download, Link, Printer, CheckCircle, Loader2,
  FileQuestion, Phone, Mail, Building, User, CalendarDays
} from "lucide-react";
import { LoanApplication } from "@/types";
import { formatCurrency } from "@/services/mockDataService";
import { toast } from "sonner";

const statusIcons = {
  "Draft": <Clock className="h-4 w-4 text-slate-500" />,
  "Submitted": <Clock className="h-4 w-4 text-blue-500" />,
  "In Review": <Clock className="h-4 w-4 text-blue-500" />,
  "Information Needed": <AlertTriangle className="h-4 w-4 text-amber-500" />,
  "In Underwriting": <FileCheck className="h-4 w-4 text-indigo-500" />,
  "Approved": <CheckCircle className="h-4 w-4 text-green-500" />,
  "Conditionally Approved": <AlertTriangle className="h-4 w-4 text-green-500" />,
  "Rejected": <FileX className="h-4 w-4 text-red-500" />,
  "Funding In Progress": <Loader2 className="h-4 w-4 text-blue-500" />,
  "Funded": <CheckCircle className="h-4 w-4 text-green-500" />,
  "Closed": <CheckCircle className="h-4 w-4 text-slate-500" />
};

const statusVariants: Record<string, string> = {
  "Draft": "outline",
  "Submitted": "default",
  "In Review": "default",
  "Information Needed": "warning",
  "In Underwriting": "secondary",
  "Approved": "success",
  "Conditionally Approved": "warning",
  "Rejected": "destructive",
  "Funding In Progress": "default",
  "Funded": "success",
  "Closed": "outline"
};

type ApplicationDetailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  application: LoanApplication;
}

const ApplicationDetailModal = ({ isOpen, onClose, application }: ApplicationDetailModalProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [performingAction, setPerformingAction] = useState<string | null>(null);
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const getBorrowerName = () => {
    return application.borrower.companyName || 
           `${application.borrower.firstName} ${application.borrower.lastName}`;
  };
  
  const formatAssetClass = (assetClass: string) => {
    return assetClass
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  const handleGenerateReport = () => {
    setPerformingAction("report");
    toast.info("Generating comprehensive report...");
    setTimeout(() => {
      toast.success("Report generated successfully!");
      setPerformingAction(null);
    }, 1500);
  };
  
  const handleAddNote = () => {
    toast.info("Opening note editor...");
    // In a real app, this would open a form to add a note
  };
  
  const handleSendToNextStage = () => {
    setPerformingAction("next");
    toast.info(`Processing application ${application.id}...`);
    setTimeout(() => {
      toast.success(`Application moved to next stage successfully!`);
      setPerformingAction(null);
      onClose();
    }, 1500);
  };
  
  const handleDownloadDocument = (docName: string) => {
    toast.success(`Downloading ${docName}...`);
    // In a real app, this would trigger a file download
  };
  
  const handleVerifyDocument = (docId: string, docName: string) => {
    setPerformingAction(docId);
    toast.info(`Verifying document ${docName}...`);
    setTimeout(() => {
      toast.success(`Document ${docName} verified successfully!`);
      setPerformingAction(null);
    }, 1500);
  };
  
  const handleContactBorrower = (method: "email" | "phone") => {
    if (method === "email") {
      toast.success(`Opening email to ${application.borrower.email}`);
    } else {
      toast.success(`Initiating call to ${application.borrower.phone}`);
    }
    // In a real app, this would open the email client or phone dialer
  };
  
  const renderAddress = () => {
    if (!application.borrower.address) {
      return "No address on file";
    }
    
    const { street, city, state, zipCode } = application.borrower.address;
    return (
      <>
        {street}<br />
        {city}, {state} {zipCode}
      </>
    );
  };
  
  const statusIcon = application.displayStatus && statusIcons[application.displayStatus] 
    ? statusIcons[application.displayStatus] 
    : <Clock className="h-4 w-4 text-slate-500" />;
  
  const statusVariant = application.displayStatus && statusVariants[application.displayStatus]
    ? statusVariants[application.displayStatus] as any
    : "default";
  
  const renderRiskAssessment = () => {
    const {
      id,
      borrower,
      amount,
      purpose,
      assetClass,
      risk,
      collateral
    } = application;
  
    const borrowerName = borrower.companyName || `${borrower.firstName} ${borrower.lastName}`;
  
    let riskLevel = 'Medium';
    let riskScore = 50;
    let riskFactors: string[] = [];
    let riskStrengths: string[] = [];
    let riskRatios: Record<string, string> = {};
  
    if (risk === "Low") {
      riskLevel = 'Low';
      riskScore = 85;
      riskStrengths = [
        "Strong borrower financials",
        "Excellent credit history",
        "Stable employment",
        "Low debt-to-income ratio"
      ];
      riskRatios = {
        "Debt-to-Income Ratio": "25%",
        "Loan-to-Value Ratio": "60%",
        "Current Ratio": "2.5"
      };
    } else if (risk === "High") {
      riskLevel = 'High';
      riskScore = 20;
      riskFactors = [
        "Limited credit history",
        "Unstable employment",
        "High debt-to-income ratio",
        "Insufficient collateral"
      ];
      riskRatios = {
        "Debt-to-Income Ratio": "65%",
        "Loan-to-Value Ratio": "95%",
        "Current Ratio": "0.8"
      };
    } else {
      riskLevel = 'Medium';
      riskScore = 50;
      riskFactors = [
        "Moderate credit history",
        "Average debt-to-income ratio"
      ];
      riskStrengths = [
        "Stable income",
        "Sufficient collateral"
      ];
      riskRatios = {
        "Debt-to-Income Ratio": "45%",
        "Loan-to-Value Ratio": "75%",
        "Current Ratio": "1.5"
      };
    }
  
    return `
      <div class="section">
        <h1>Risk Assessment Report</h1>
        <p>Application ID: <strong>${id}</strong></p>
        
        <h2>Application Overview</h2>
        <table>
          <tr>
            <th width="30%">Borrower</th>
            <td>${borrowerName}</td>
          </tr>
          <tr>
            <th>Loan Amount</th>
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
          ${borrower.creditScore ? `
          <tr>
            <th>Credit Score</th>
            <td>${borrower.creditScore} ${borrower.creditRating ? `(${borrower.creditRating})` : ''}</td>
          </tr>` : ''}
          ${borrower.income ? `
          <tr>
            <th>Annual Income</th>
            <td>${typeof borrower.income === 'number' ? formatCurrency(borrower.income) : borrower.income}</td>
          </tr>` : ''}
          ${borrower.annualRevenue ? `
          <tr>
            <th>Annual Revenue</th>
            <td>${typeof borrower.annualRevenue === 'number' ? formatCurrency(borrower.annualRevenue) : borrower.annualRevenue}</td>
          </tr>` : ''}
        </table>
        
        <h2>Comprehensive Risk Assessment</h2>
        <div class="highlight-box">
          <p>Overall Risk Rating: <span class="risk-${riskLevel.toLowerCase()}">${riskLevel} Risk</span></p>
          <p>Risk Score: ${riskScore}/100</p>
          <div style="background-color: #f0f0f0; height: 20px; width: 100%; border-radius: 10px; margin: 10px 0;">
            <div style="background-color: ${
              riskLevel.toLowerCase() === 'low' ? '#10b981' : 
              riskLevel.toLowerCase() === 'medium' ? '#f59e0b' : '#e11d48'
            }; height: 100%; width: ${riskScore}%; border-radius: 10px;"></div>
          </div>
        </div>
        
        <h2>Key Risk Factors</h2>
        ${riskFactors.length > 0 ? `
        <ul>
          ${riskFactors.map(factor => `<li>${factor}</li>`).join('')}
        </ul>
        ` : '<p>No specific risk factors identified.</p>'}
        
        <h2>Key Strengths</h2>
        ${riskStrengths.length > 0 ? `
        <ul>
          ${riskStrengths.map(strength => `<li>${strength}</li>`).join('')}
        </ul>
        ` : '<p>No specific strengths highlighted.</p>'}
        
        ${Object.keys(riskRatios).length > 0 ? `
        <h2>Financial Ratios & Metrics</h2>
        <table>
          ${Object.entries(riskRatios).map(([key, value]) => `
            <tr>
              <th width="40%">${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</th>
              <td>${value}</td>
            </tr>
          `).join('')}
        </table>
        ` : ''}
        
        <h2>Industry Risk Analysis</h2>
        <p>${borrower.industry ? `The ${borrower.industry} industry currently shows ${
          riskLevel.toLowerCase() === 'low' ? 'low volatility and strong growth prospects.' : 
          riskLevel.toLowerCase() === 'medium' ? 'moderate volatility with stable growth prospects.' : 
          'high volatility and uncertain growth prospects.'
        }` : 'Industry-specific risk analysis not available.'}</p>
        
        <h2>Market Conditions Impact</h2>
        <p>Current market conditions are ${
          riskLevel.toLowerCase() === 'low' ? 'favorable for this type of financing, with stable interest rates and strong economic indicators.' : 
          riskLevel.toLowerCase() === 'medium' ? 'showing mixed signals, with some economic indicators suggesting caution.' : 
          'challenging, with multiple economic indicators suggesting heightened risk.'
        }</p>
        
        <h2>Collateral Analysis</h2>
        ${collateral ? `
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
            <td>${typeof collateral.value === 'number' && typeof amount === 'number' ? 
                 `${Math.round((amount / collateral.value) * 100)}%` : 'N/A'}</td>
          </tr>
          <tr>
            <th>Description</th>
            <td>${collateral.description}</td>
          </tr>
        </table>
        ` : '<p>No collateral information available for this application.</p>'}
        
        <h2>AI Risk Analysis Summary</h2>
        <p>${
          riskLevel.toLowerCase() === 'low' ? 
          'Based on our comprehensive analysis using AI-powered risk assessment, this application presents a low risk profile. The borrower demonstrates strong financial stability, appropriate credit history, and the loan purpose aligns well with our lending criteria. The collateral valuation is sufficient, and market conditions are favorable for this type of financing.' : 
          
          riskLevel.toLowerCase() === 'medium' ? 
          'Based on our comprehensive analysis using AI-powered risk assessment, this application presents a moderate risk profile. While there are some areas of concern, these are balanced by positive aspects of the borrower\'s profile and application. Additional monitoring or modifications to standard terms may be warranted. The collateral provides adequate coverage, though market conditions show some volatility that could impact the borrower\'s repayment capacity.' : 
          
          'Based on our comprehensive analysis using AI-powered risk assessment, this application presents a high risk profile. Several significant risk factors have been identified that require careful consideration. Additional collateral, guarantees, or significant modifications to terms would be necessary to proceed with this application. The current market conditions and industry outlook compound the inherent risks in this proposal.'
        }</p>
        
        <h2>Assessment Conclusion</h2>
        <p>Recommendation: ${
          riskLevel.toLowerCase() === 'low' ? 
          'Approval with standard terms' : 
          
          riskLevel.toLowerCase() === 'medium' ? 
          'Conditional approval with enhanced monitoring and modified terms' : 
          
          'Application requires significant additional support or restructuring before approval'
        }</p>
      </div>
      
      <div class="signature">
        <p>Risk assessment conducted by GaIgentic Underwriting Team</p>
        <p>Date: ${new Date().toLocaleDateString()}</p>
      </div>
    `;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>Application {application.id}</span>
            <Badge variant={statusVariant}>
              {statusIcon}
              <span className="ml-1">{application.displayStatus}</span>
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Submitted on {formatDate(application.dateSubmitted)}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="borrower">Borrower</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Application Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="text-sm text-muted-foreground">Borrower:</div>
                      <div className="font-medium">{getBorrowerName()}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Application ID:</div>
                      <div className="font-medium">{application.id}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Submission Date:</div>
                      <div className="font-medium">{formatDate(application.dateSubmitted)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Asset Class:</div>
                      <div className="font-medium">{formatAssetClass(application.assetClass)}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Loan Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="text-sm text-muted-foreground">Amount:</div>
                      <div className="font-medium">{formatCurrency(application.amount)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Purpose:</div>
                      <div className="font-medium">{application.purpose}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Term:</div>
                      <div className="font-medium">{application.term} months</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Interest Rate:</div>
                      <div className="font-medium">{application.interestRate ? `${application.interestRate}%` : 'TBD'}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Application Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Completion Status</span>
                    <span>{application.completeness}%</span>
                  </div>
                  <Progress value={application.completeness} className="h-2" />
                </div>
                
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className={`h-2 w-2 rounded-full ${application.completeness >= 25 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span>Application Submitted</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className={`h-2 w-2 rounded-full ${application.completeness >= 50 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span>Documents Verified</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className={`h-2 w-2 rounded-full ${application.completeness >= 75 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span>Underwriting Complete</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className={`h-2 w-2 rounded-full ${application.completeness >= 95 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span>Final Decision</span>
                  </div>
                </div>
                
                {application.risk && (
                  <div className="mt-4">
                    <div className="text-sm font-medium mb-2">Risk Assessment</div>
                    <Badge 
                      variant={
                        application.risk === "Low" ? "success" : 
                        application.risk === "Medium" ? "warning" : 
                        "destructive"
                      }
                    >
                      {application.risk} Risk
                    </Badge>
                    {application.borrower.creditScore && (
                      <div className="mt-2 text-sm">
                        <span className="text-muted-foreground">Credit Score: </span>
                        <span className="font-medium">{application.borrower.creditScore}</span>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleGenerateReport} disabled={!!performingAction}>
                {performingAction === "report" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Generate Report
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={handleAddNote}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Add Note
              </Button>
              <Button onClick={handleSendToNextStage} disabled={!!performingAction}>
                {performingAction === "next" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send to Next Stage
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="borrower" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Borrower Information</CardTitle>
                <CardDescription>
                  {application.borrower.companyName ? "Business Profile" : "Individual Profile"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium mb-2 flex items-center">
                      {application.borrower.companyName ? (
                        <><Building className="h-4 w-4 mr-2" /> Company Details</>
                      ) : (
                        <><User className="h-4 w-4 mr-2" /> Personal Details</>
                      )}
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm text-muted-foreground">
                          {application.borrower.companyName ? "Company Name" : "Full Name"}:
                        </div>
                        <div className="font-medium">
                          {application.borrower.companyName || `${application.borrower.firstName} ${application.borrower.lastName}`}
                        </div>
                      </div>
                      {!application.borrower.companyName && application.borrower.dateOfBirth && (
                        <div>
                          <div className="text-sm text-muted-foreground">Date of Birth:</div>
                          <div className="font-medium">{formatDate(application.borrower.dateOfBirth)}</div>
                        </div>
                      )}
                      {application.borrower.companyName && application.borrower.yearsInBusiness && (
                        <div>
                          <div className="text-sm text-muted-foreground">Years in Business:</div>
                          <div className="font-medium">{application.borrower.yearsInBusiness} years</div>
                        </div>
                      )}
                      {application.borrower.companyName && application.borrower.industry && (
                        <div>
                          <div className="text-sm text-muted-foreground">Industry:</div>
                          <div className="font-medium">{application.borrower.industry}</div>
                        </div>
                      )}
                      {application.borrower.taxId && (
                        <div>
                          <div className="text-sm text-muted-foreground">Tax ID:</div>
                          <div className="font-medium">{application.borrower.taxId}</div>
                        </div>
                      )}
                      {application.borrower.creditScore && (
                        <div>
                          <div className="text-sm text-muted-foreground">Credit Score:</div>
                          <div className="font-medium">{application.borrower.creditScore} ({application.borrower.creditRating})</div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2 flex items-center">
                      <Mail className="h-4 w-4 mr-2" /> Contact Information
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm text-muted-foreground">Email:</div>
                        <div className="font-medium">{application.borrower.email}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Phone:</div>
                        <div className="font-medium">{application.borrower.phone}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Address:</div>
                        <div className="font-medium">
                          {renderAddress()}
                        </div>
                      </div>
                      {application.borrower.relationshipManager && (
                        <div>
                          <div className="text-sm text-muted-foreground">Relationship Manager:</div>
                          <div className="font-medium">{application.borrower.relationshipManager}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => handleContactBorrower("email")}>
                    <Mail className="mr-2 h-4 w-4" />
                    Email Borrower
                  </Button>
                  <Button variant="outline" onClick={() => handleContactBorrower("phone")}>
                    <Phone className="mr-2 h-4 w-4" />
                    Call Borrower
                  </Button>
                  <Button onClick={() => {
                    toast.success("Opening borrower profile");
                    // In a real app, this would navigate to the borrower detail page
                  }}>
                    <Link className="mr-2 h-4 w-4" />
                    View Full Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {application.borrower.companyName && application.borrower.annualRevenue && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Financial Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Annual Revenue:</div>
                      <div className="font-medium">{formatCurrency(application.borrower.annualRevenue)}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {!application.borrower.companyName && application.borrower.employmentInfo && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Employment Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Employer:</div>
                      <div className="font-medium">{application.borrower.employmentInfo.employer}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Position:</div>
                      <div className="font-medium">{application.borrower.employmentInfo.position}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Start Date:</div>
                      <div className="font-medium">{formatDate(application.borrower.employmentInfo.startDate)}</div>
                    </div>
                    {application.borrower.income && (
                      <div>
                        <div className="text-sm text-muted-foreground">Annual Income:</div>
                        <div className="font-medium">{formatCurrency(application.borrower.income)}</div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="documents" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Required Documents</CardTitle>
                <CardDescription>Status of required documentation for this application</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {application.documents.length > 0 ? (
                    application.documents.map((doc) => (
                      <div key={doc.id}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {doc.status === "verified" ? (
                              <FileCheck className="h-5 w-5 text-green-500" />
                            ) : doc.status === "rejected" ? (
                              <FileX className="h-5 w-5 text-red-500" />
                            ) : (
                              <FileQuestion className="h-5 w-5 text-amber-500" />
                            )}
                            <div>
                              <div className="font-medium">{doc.type}</div>
                              <div className="text-xs text-muted-foreground">
                                {doc.status === "verified" 
                                  ? `Verified on ${formatDate(doc.uploadedAt)}`
                                  : doc.status === "rejected"
                                  ? `Rejected on ${formatDate(doc.uploadedAt)}`
                                  : `Uploaded on ${formatDate(doc.uploadedAt)}`}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={
                              doc.status === "verified" ? "success" : 
                              doc.status === "rejected" ? "destructive" : 
                              "warning"
                            }>
                              {doc.status === "verified" ? "Verified" : 
                               doc.status === "rejected" ? "Rejected" : 
                               "Pending"}
                            </Badge>
                            <div className="flex gap-1">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleDownloadDocument(doc.name)}
                                title="Download Document"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              {doc.status === "pending" && (
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleVerifyDocument(doc.id, doc.name)}
                                  disabled={!!performingAction}
                                  title="Verify Document"
                                >
                                  {performingAction === doc.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <CheckCircle className="h-4 w-4" />
                                  )}
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                        {doc.aiAnalysisComplete && doc.aiAnalysisSummary && (
                          <div className="mt-1 ml-7 text-xs p-2 bg-muted rounded-sm">
                            <span className="font-medium">AI Analysis: </span>
                            {doc.aiAnalysisSummary}
                          </div>
                        )}
                        <Separator className="my-3" />
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      No documents have been uploaded yet.
                    </div>
                  )}
                  
                  <div className="mt-4 flex justify-end">
                    <Button variant="outline" onClick={() => toast.info("Opening document uploader...")}>
                      <FileText className="mr-2 h-4 w-4" />
                      Request Documents
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Application Notes</CardTitle>
                <CardDescription>Communication history and notes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {application.notes.length > 0 ? (
                  application.notes.map((note) => (
                    <div key={note.id} className="bg-muted p-3 rounded-md space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {note.isAgentNote ? (
                            <UserCheck className="h-4 w-4 text-primary" />
                          ) : (
                            <User className="h-4 w-4 text-primary" />
                          )}
                          <span className="font-medium">
                            {note.isAgentNote ? "AI Agent" : "Loan Officer"}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(note.createdAt)} · {new Date(note.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                      <p className="text-sm">{note.content}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No notes have been added yet.
                  </div>
                )}
                
                <div className="mt-4">
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="timeline" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Application Timeline</CardTitle>
                <CardDescription>Chronological history of this application</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {application.dateSubmitted && (
                    <div className="flex">
                      <div className="flex flex-col items-center mr-4">
                        <div className="h-2.5 w-2.5 rounded-full bg-blue-500"></div>
                        <div className="h-full w-px bg-gray-200 my-1"></div>
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-start justify-between">
                          <p className="text-sm font-medium">Application Submitted</p>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(application.dateSubmitted)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {getBorrowerName()} submitted loan application for {formatCurrency(application.amount)}.
                        </p>
                        <div className="text-xs text-muted-foreground flex items-center mt-1">
                          <span className="inline-block w-2 h-2 rounded-full mr-1.5 bg-blue-500" />
                          <span>Intake AI Agent</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {application.dateReviewed && (
                    <div className="flex">
                      <div className="flex flex-col items-center mr-4">
                        <div className="h-2.5 w-2.5 rounded-full bg-indigo-500"></div>
                        <div className="h-full w-px bg-gray-200 my-1"></div>
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-start justify-between">
                          <p className="text-sm font-medium">Application Reviewed</p>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(application.dateReviewed)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Initial review completed. Documents processed and verified.
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Action: Document verification and initial risk assessment completed.
                        </p>
                        <div className="text-xs text-muted-foreground flex items-center mt-1">
                          <span className="inline-block w-2 h-2 rounded-full mr-1.5 bg-indigo-500" />
                          <span>Processing AI Agent</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {application.dateUnderwritten && (
                    <div className="flex">
                      <div className="flex flex-col items-center mr-4">
                        <div className="h-2.5 w-2.5 rounded-full bg-purple-500"></div>
                        <div className="h-full w-px bg-gray-200 my-1"></div>
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-start justify-between">
                          <p className="text-sm font-medium">Underwriting Completed</p>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(application.dateUnderwritten)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Full underwriting analysis completed with {application.risk} risk assessment.
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Action: Comprehensive risk assessment performed, financial analysis completed, and underwriting recommendation provided.
                        </p>
                        <div className="text-xs text-muted-foreground flex items-center mt-1">
                          <span className="inline-block w-2 h-2 rounded-full mr-1.5 bg-purple-500" />
                          <span>Underwriting AI Agent</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {application.dateApproved && (
                    <div className="flex">
                      <div className="flex flex-col items-center mr-4">
                        <div className="h-2.5 w-2.5 rounded-full bg-emerald-500"></div>
                        <div className="h-full w-px bg-gray-200 my-1"></div>
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-start justify-between">
                          <p className="text-sm font-medium">Decision Made</p>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(application.dateApproved)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Application {application.status === "approved" ? "approved" : application.status === "conditionally_approved" ? "conditionally approved" : "rejected"}.
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Action: Final loan decision determined based on comprehensive analysis of all application data, risk assessment, and policy guidelines.
                        </p>
                        <div className="text-xs text-muted-foreground flex items-center mt-1">
                          <span className="inline-block w-2 h-2 rounded-full mr-1.5 bg-emerald-500" />
                          <span>Decision AI Agent</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {application.dateFunded && (
                    <div className="flex">
                      <div className="flex flex-col items-center mr-4">
                        <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-start justify-between">
                          <p className="text-sm font-medium">Loan Funded</p>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(application.dateFunded)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Loan disbursed: {formatCurrency(application.amount)}.
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Action: Funds transfer initiated and confirmation sent to borrower.
                        </p>
                      </div>
                    </div>
                  )}

                  {application.notes && application.notes.length > 0 && application.notes.map((note, index) => (
                    note.isAgentNote && (
                      <div key={note.id} className="flex">
                        <div className="flex flex-col items-center mr-4">
                          <div className="h-2.5 w-2.5 rounded-full bg-primary"></div>
                          {index < application.notes.length - 1 && (
                            <div className="h-full w-px bg-gray-200 my-1"></div>
                          )}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-start justify-between">
                            <p className="text-sm font-medium">AI Agent Action</p>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(note.createdAt)}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{note.content}</p>
                          <div className="text-xs text-muted-foreground flex items-center mt-1">
                            <span className="inline-block w-2 h-2 rounded-full mr-1.5 bg-primary" />
                            <span>AI Agent</span>
                          </div>
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationDetailModal;

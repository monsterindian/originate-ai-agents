
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { LineChart } from "@/components/ui/charts";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Building, FileText, MessageSquare, CreditCard, AlertCircle, Calendar, Clock, DollarSign, Printer } from "lucide-react";
import { toast } from "sonner";

type LoanDetailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  loan: any; // Using any for the mock data, would be Loan in a real implementation
}

const getBorrowerInitials = (name: string) => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

const LoanDetailModal = ({ isOpen, onClose, loan }: LoanDetailModalProps) => {
  // Mock data for the payment history chart
  const paymentData = [
    { month: "Jan", payment: 20000 },
    { month: "Feb", payment: 20000 },
    { month: "Mar", payment: 20000 },
    { month: "Apr", payment: 20000 },
    { month: "May", payment: 0 },
    { month: "Jun", payment: 0 },
  ];

  const generateCreditMemo = () => {
    toast.info(`Generating credit memo for Loan ${loan?.id}`);
    
    setTimeout(() => {
      const win = window.open("", "_blank");
      if (win) {
        win.document.write(`
          <html>
            <head>
              <title>Credit Memo - Loan ${loan?.id}</title>
              <style>
                @media print {
                  .no-print {
                    display: none;
                  }
                  body {
                    padding: 20px;
                  }
                }
                body { 
                  font-family: Arial, sans-serif; 
                  margin: 0; 
                  padding: 20px; 
                  color: #1A1F2C;
                }
                .header { 
                  display: flex; 
                  justify-content: space-between; 
                  align-items: center; 
                  margin-bottom: 30px; 
                  padding-bottom: 10px;
                  border-bottom: 2px solid #9b87f5;
                }
                .logo { 
                  max-width: 200px; 
                }
                .print-button {
                  background-color: #9b87f5;
                  color: white;
                  border: none;
                  padding: 10px 20px;
                  border-radius: 4px;
                  cursor: pointer;
                  display: flex;
                  align-items: center;
                  gap: 6px;
                  font-weight: bold;
                }
                .print-icon {
                  width: 16px;
                  height: 16px;
                }
                h1, h2 { 
                  color: #7E69AB; 
                }
                h1 {
                  font-size: 26px;
                  margin: 0;
                }
                h2 {
                  border-bottom: 1px solid #D6BCFA;
                  padding-bottom: 5px;
                  margin-top: 30px;
                  font-size: 18px;
                }
                .memo-id {
                  color: #8E9196;
                  font-size: 14px;
                }
                table { 
                  width: 100%; 
                  border-collapse: collapse; 
                  margin: 20px 0; 
                }
                th, td { 
                  padding: 10px; 
                  text-align: left; 
                  border-bottom: 1px solid #ddd; 
                }
                th { 
                  background-color: #f2f2f2; 
                  color: #6E59A5;
                  font-weight: 600;
                }
                .section { 
                  margin-bottom: 30px; 
                }
                .badge {
                  display: inline-block;
                  padding: 3px 10px;
                  border-radius: 12px;
                  font-size: 12px;
                  font-weight: 500;
                }
                .badge-outline {
                  background-color: transparent;
                  border: 1px solid #9b87f5;
                  color: #6E59A5;
                }
                .badge-success {
                  background-color: #10b981;
                  color: white;
                }
                .badge-warning {
                  background-color: #f59e0b;
                  color: white;
                }
                .badge-danger {
                  background-color: #e11d48;
                  color: white;
                }
                .flex-between {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  margin-bottom: 10px;
                }
                .text-primary {
                  color: #7E69AB;
                }
                .text-muted {
                  color: #8E9196;
                  font-size: 14px;
                }
                .text-bold {
                  font-weight: 600;
                }
                .approval-section {
                  margin-top: 50px;
                  page-break-inside: avoid;
                }
                .signature-line {
                  border-top: 1px solid #1A1F2C;
                  margin-top: 60px;
                  width: 200px;
                  display: inline-block;
                }
                .metrics-grid {
                  display: grid;
                  grid-template-columns: repeat(2, 1fr);
                  gap: 15px;
                  margin: 20px 0;
                }
                .metric-card {
                  border: 1px solid #D6BCFA;
                  border-radius: 8px;
                  padding: 15px;
                }
                .metric-value {
                  font-size: 24px;
                  font-weight: bold;
                  color: #1A1F2C;
                  margin: 5px 0;
                }
                @media print {
                  .page-break {
                    page-break-before: always;
                  }
                }
              </style>
            </head>
            <body>
              <div class="header">
                <div>
                  <h1>Credit Memorandum</h1>
                  <p class="memo-id">Memo ID: CM-${loan?.id}-${Math.floor(Math.random() * 1000)}</p>
                  <p class="memo-id">Date: ${new Date().toLocaleDateString()}</p>
                </div>
                <img src="/lovable-uploads/b33a1622-519b-4d29-bcb5-c1f47afab476.png" class="logo" alt="Logo">
                <button onclick="window.print()" class="print-button no-print">
                  <svg class="print-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
                  </svg>
                  Print Credit Memo
                </button>
              </div>

              <div class="section">
                <h2>Executive Summary</h2>
                <p>
                  This credit memorandum provides a comprehensive analysis and recommendation for the ${loan?.amount} 
                  ${loan?.assetClass} loan request from ${loan?.borrower}. The loan was originated on 
                  ${loan?.origination} with a ${loan?.term} term at ${loan?.interestRate} interest rate.
                </p>
                <p>
                  Based on our thorough analysis of the borrower's creditworthiness, financial history, and the 
                  collateral provided, this loan is <span class="text-bold text-primary">recommended for approval</span>.
                </p>
              </div>

              <div class="section">
                <h2>Loan Information</h2>
                <table>
                  <tr>
                    <th>Loan ID</th>
                    <td>${loan?.id}</td>
                    <th>Status</th>
                    <td>
                      <span class="badge ${loan?.status === 'Active' ? 'badge-success' : 'badge-outline'}">
                        ${loan?.status}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <th>Principal Amount</th>
                    <td>${loan?.amount}</td>
                    <th>Payment Status</th>
                    <td>
                      <span class="badge ${loan?.paymentStatus === 'Current' ? 'badge-success' : 'badge-warning'}">
                        ${loan?.paymentStatus}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <th>Interest Rate</th>
                    <td>${loan?.interestRate}</td>
                    <th>Asset Class</th>
                    <td>${loan?.assetClass}</td>
                  </tr>
                  <tr>
                    <th>Term</th>
                    <td>${loan?.term}</td>
                    <th>Origination Date</th>
                    <td>${loan?.origination}</td>
                  </tr>
                  <tr>
                    <th>Maturity Date</th>
                    <td>2029-03-15</td>
                    <th>Monthly Payment</th>
                    <td>$20,000.00</td>
                  </tr>
                </table>
              </div>

              <div class="section">
                <h2>Borrower Information</h2>
                <table>
                  <tr>
                    <th>Name</th>
                    <td colspan="3">${loan?.borrower}</td>
                  </tr>
                  <tr>
                    <th>Business Type</th>
                    <td>${loan?.assetClass}</td>
                    <th>Years in Business</th>
                    <td>8</td>
                  </tr>
                  <tr>
                    <th>Total Active Loans</th>
                    <td>1</td>
                    <th>Total Exposure</th>
                    <td>${loan?.amount}</td>
                  </tr>
                  <tr>
                    <th>Risk Rating</th>
                    <td>
                      <span class="badge badge-success">Low</span>
                    </td>
                    <th>Industry</th>
                    <td>Commercial Real Estate</td>
                  </tr>
                </table>
              </div>

              <div class="metrics-grid">
                <div class="metric-card">
                  <div class="text-muted">Debt Service Coverage Ratio</div>
                  <div class="metric-value">1.35x</div>
                  <div class="text-muted">Minimum required: 1.20x</div>
                </div>
                <div class="metric-card">
                  <div class="text-muted">Loan to Value</div>
                  <div class="metric-value">75%</div>
                  <div class="text-muted">Maximum allowed: 80%</div>
                </div>
                <div class="metric-card">
                  <div class="text-muted">Credit Score</div>
                  <div class="metric-value">720</div>
                  <div class="text-muted">Minimum required: 680</div>
                </div>
                <div class="metric-card">
                  <div class="text-muted">Debt-to-Income Ratio</div>
                  <div class="metric-value">38%</div>
                  <div class="text-muted">Maximum allowed: 43%</div>
                </div>
              </div>

              <div class="section">
                <h2>Financial Analysis</h2>
                <p>
                  The borrower has demonstrated consistent financial performance over the past three years with revenue 
                  growth averaging 12% annually. Cash flow is sufficient to service the proposed debt with a debt service 
                  coverage ratio of 1.35x, which exceeds our minimum requirement of 1.20x.
                </p>
                <p>
                  Key financial highlights include:
                </p>
                <ul>
                  <li>Annual revenue: $3,500,000</li>
                  <li>Net operating income: $875,000</li>
                  <li>Current assets: $1,200,000</li>
                  <li>Current liabilities: $650,000</li>
                  <li>Current ratio: 1.85</li>
                </ul>
              </div>

              <div class="section">
                <h2>Collateral Analysis</h2>
                <p>
                  The loan is secured by a first lien on commercial real estate property located at 123 Main Street, 
                  valued at $2,950,000 based on an independent appraisal completed on ${loan?.origination}. This provides
                  a loan-to-value ratio of 75%, which is within our acceptable risk parameters.
                </p>
                <p>
                  The property is a multi-tenant office building with 90% occupancy and an average remaining lease term of 
                  4.2 years. The location is in a stable commercial district with positive growth projections.
                </p>
              </div>

              <div class="page-break"></div>

              <div class="section">
                <h2>Risk Assessment</h2>
                <table>
                  <tr>
                    <th>Risk Factor</th>
                    <th>Assessment</th>
                    <th>Mitigating Factors</th>
                  </tr>
                  <tr>
                    <td>Credit Risk</td>
                    <td><span class="badge badge-success">Low</span></td>
                    <td>Strong payment history, no delinquencies in the last 36 months</td>
                  </tr>
                  <tr>
                    <td>Market Risk</td>
                    <td><span class="badge badge-warning">Medium</span></td>
                    <td>Property in established market with stable demand, diversified tenant base</td>
                  </tr>
                  <tr>
                    <td>Liquidity Risk</td>
                    <td><span class="badge badge-success">Low</span></td>
                    <td>Borrower maintains adequate cash reserves equivalent to 6 months of debt service</td>
                  </tr>
                  <tr>
                    <td>Industry Risk</td>
                    <td><span class="badge badge-warning">Medium</span></td>
                    <td>While commercial real estate faces challenges, the property's strong tenant mix mitigates concern</td>
                  </tr>
                </table>
              </div>

              <div class="section">
                <h2>Payment History</h2>
                <p>
                  The borrower has made 4 out of 60 scheduled payments on this loan. All payments have been received on time
                  and in full as indicated below:
                </p>
                <table>
                  <tr>
                    <th>Payment Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                  <tr>
                    <td>Apr 15, 2024</td>
                    <td>$20,000.00</td>
                    <td><span class="badge badge-success">Paid</span></td>
                  </tr>
                  <tr>
                    <td>Mar 15, 2024</td>
                    <td>$20,000.00</td>
                    <td><span class="badge badge-success">Paid</span></td>
                  </tr>
                  <tr>
                    <td>Feb 15, 2024</td>
                    <td>$20,000.00</td>
                    <td><span class="badge badge-success">Paid</span></td>
                  </tr>
                  <tr>
                    <td>Jan 15, 2024</td>
                    <td>$20,000.00</td>
                    <td><span class="badge badge-success">Paid</span></td>
                  </tr>
                </table>
              </div>

              <div class="section">
                <h2>Policy Exceptions</h2>
                <p>None. This loan request complies with all lending policies and guidelines.</p>
              </div>

              <div class="section">
                <h2>Recommendation</h2>
                <p>
                  Based on the comprehensive analysis provided in this credit memo, we recommend <span class="text-bold text-primary">approval</span> 
                  of this loan with the following terms and conditions:
                </p>
                <ul>
                  <li>Principal Amount: ${loan?.amount}</li>
                  <li>Interest Rate: ${loan?.interestRate}</li>
                  <li>Term: ${loan?.term}</li>
                  <li>Payment: $20,000.00 monthly (principal and interest)</li>
                  <li>Collateral: First lien on commercial real estate property</li>
                </ul>
              </div>

              <div class="approval-section">
                <h2>Approval</h2>
                <div style="display: flex; justify-content: space-between; margin-top: 30px;">
                  <div>
                    <p class="signature-line"></p>
                    <div>Credit Officer Signature</div>
                    <div class="text-muted">Date: _______________</div>
                  </div>
                  <div>
                    <p class="signature-line"></p>
                    <div>Senior Loan Officer Signature</div>
                    <div class="text-muted">Date: _______________</div>
                  </div>
                  <div>
                    <p class="signature-line"></p>
                    <div>Credit Committee Chair Signature</div>
                    <div class="text-muted">Date: _______________</div>
                  </div>
                </div>
              </div>
              
              <div style="margin-top: 50px;">
                <p class="text-muted">Credit Memo ID: CM-${loan?.id}-${Math.floor(Math.random() * 1000)}</p>
                <p class="text-muted">Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
                <p class="text-muted">This document is confidential and intended for internal use only.</p>
              </div>
            </body>
          </html>
        `);
        win.document.close();
      }
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>Loan {loan?.id}</span>
            <Badge>{loan?.status}</Badge>
          </DialogTitle>
          <DialogDescription>
            Originated on {loan?.origination} • {loan?.term}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="modifications">Modifications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Loan Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Principal Amount:</span>
                    <span className="font-medium">{loan?.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Interest Rate:</span>
                    <span className="font-medium">{loan?.interestRate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Term:</span>
                    <span className="font-medium">{loan?.term}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Origination Date:</span>
                    <span className="font-medium">{loan?.origination}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Maturity Date:</span>
                    <span className="font-medium">2029-03-15</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Payment Status:</span>
                    <Badge variant={loan?.paymentStatus === "Current" ? "outline" : "destructive"}>
                      {loan?.paymentStatus}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Asset Class:</span>
                    <span className="font-medium">{loan?.assetClass}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Borrower Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar>
                      <AvatarFallback>{getBorrowerInitials(loan?.borrower || '')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{loan?.borrower}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Building className="h-3 w-3" />
                        <span>{loan?.assetClass}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="my-2" />
                  
                  <div className="space-y-2 mt-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Active Loans:</span>
                      <span className="font-medium">1</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Exposure:</span>
                      <span className="font-medium">{loan?.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Risk Rating:</span>
                      <Badge variant="outline">Low</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Payment Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Monthly Payment</div>
                    <div className="text-2xl font-semibold">$20,000</div>
                    <div className="text-xs text-muted-foreground">Principal + Interest</div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Next Payment</div>
                    <div className="text-2xl font-semibold">May 15, 2024</div>
                    <div className="text-xs text-muted-foreground">Due in 5 days</div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Remaining Balance</div>
                    <div className="text-2xl font-semibold">{loan?.amount}</div>
                    <div className="text-xs text-muted-foreground">As of Apr 13, 2024</div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Payments Made</div>
                    <div className="text-2xl font-semibold">4 / 60</div>
                    <div className="text-xs text-muted-foreground">Months completed</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={generateCreditMemo}>
                <FileText className="mr-2 h-4 w-4" />
                Generate Credit Memo
              </Button>
              <Button variant="outline">
                <MessageSquare className="mr-2 h-4 w-4" />
                Contact Borrower
              </Button>
              <Button>
                <CreditCard className="mr-2 h-4 w-4" />
                Process Payment
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="payments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Payment History</CardTitle>
                <CardDescription>Recent payment activity for this loan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-60 mb-6">
                  <LineChart 
                    data={paymentData}
                    dataKey="month"
                    categories={["payment"]}
                    colors={["#0ea5e9"]}
                    valueFormatter={(value: number) => `$${value.toLocaleString()}`}
                    showLegend={false}
                  />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 border rounded-md bg-muted/50">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-green-500" />
                      <div>
                        <div className="font-medium">April Payment</div>
                        <div className="text-xs text-muted-foreground">Apr 15, 2024</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">$20,000.00</div>
                      <Badge variant="outline">Paid</Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 border rounded-md bg-muted/50">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-green-500" />
                      <div>
                        <div className="font-medium">March Payment</div>
                        <div className="text-xs text-muted-foreground">Mar 15, 2024</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">$20,000.00</div>
                      <Badge variant="outline">Paid</Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 border rounded-md bg-muted/50">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-green-500" />
                      <div>
                        <div className="font-medium">February Payment</div>
                        <div className="text-xs text-muted-foreground">Feb 15, 2024</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">$20,000.00</div>
                      <Badge variant="outline">Paid</Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 border rounded-md bg-muted/50">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-green-500" />
                      <div>
                        <div className="font-medium">January Payment</div>
                        <div className="text-xs text-muted-foreground">Jan 15, 2024</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">$20,000.00</div>
                      <Badge variant="outline">Paid</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Upcoming Payments</CardTitle>
                <CardDescription>Future scheduled payments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 border rounded-md bg-amber-50 border-amber-200">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-amber-500" />
                      <div>
                        <div className="font-medium">May Payment</div>
                        <div className="text-xs text-muted-foreground">Due May 15, 2024</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">$20,000.00</div>
                      <Button size="sm">Pay Now</Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 border rounded-md">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">June Payment</div>
                        <div className="text-xs text-muted-foreground">Due Jun 15, 2024</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">$20,000.00</div>
                      <Badge variant="secondary">Upcoming</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="documents" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Loan Documents</CardTitle>
                <CardDescription>All documents related to this loan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 border rounded-md hover:bg-muted">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <div>
                        <div className="font-medium">Loan Agreement</div>
                        <div className="text-xs text-muted-foreground">Signed on {loan?.origination}</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 border rounded-md hover:bg-muted">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <div>
                        <div className="font-medium">Promissory Note</div>
                        <div className="text-xs text-muted-foreground">Signed on {loan?.origination}</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 border rounded-md hover:bg-muted">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <div>
                        <div className="font-medium">Security Agreement</div>
                        <div className="text-xs text-muted-foreground">Signed on {loan?.origination}</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 border rounded-md hover:bg-muted">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <div>
                        <div className="font-medium">Amortization Schedule</div>
                        <div className="text-xs text-muted-foreground">Generated on {loan?.origination}</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="modifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Loan Modifications</CardTitle>
                <CardDescription>History of changes to this loan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Clock className="h-16 w-16 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-semibold">No Modifications</h3>
                  <p className="text-muted-foreground text-sm mt-2">This loan has not been modified since origination.</p>
                  <Button className="mt-4">
                    Request Modification
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default LoanDetailModal;

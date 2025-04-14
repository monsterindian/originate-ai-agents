import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Search, CheckCircle, AlertCircle, Clock, Loader2, BarChart3, ArrowRight, Eye, FileText, Download, Ban, BarChart4, UserCheck, Receipt } from "lucide-react";
import OpenAIStatusIndicator from "@/components/agents/OpenAIStatusIndicator";
import ApplicationDetailModal from "@/components/modals/ApplicationDetailModal";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const mockUnderwritingTasks = [
  {
    id: "APP-3845",
    borrower: "Sunrise Properties LLC",
    amount: "$2,200,000",
    purpose: "Property Acquisition",
    status: "In Underwriting",
    dateSubmitted: "2024-04-05",
    completeness: 75,
    assetClass: "Commercial Real Estate",
    priority: "High",
    creditScore: 720,
    dti: "38%",
    ltvRatio: "75%",
    collateralValue: "$2,950,000",
    riskAssessment: {
      level: "Medium",
      score: 65,
      factors: [
        "Property in secondary market with moderate appreciation potential",
        "Borrower has moderate leverage with existing properties",
        "Historic cash flow covers debt service by 1.2x"
      ],
      strengths: [
        "Experienced management team with 15+ years in real estate",
        "Strong tenant mix with 5+ year leases" 
      ],
      ratios: {
        debtServiceCoverage: "1.2x",
        returnOnInvestment: "8.4%",
        operatingExpenseRatio: "42%",
        vacancyRate: "5%"
      }
    },
    estimatedCompletion: "2024-04-18"
  },
  {
    id: "APP-3848",
    borrower: "Evergreen Developments",
    amount: "$4,500,000",
    purpose: "Construction",
    status: "Credit Analysis",
    dateSubmitted: "2024-04-01",
    completeness: 95,
    assetClass: "Construction",
    priority: "High",
    creditScore: 750,
    dti: "35%",
    ltvRatio: "70%",
    collateralValue: "$6,500,000",
    riskAssessment: {
      level: "Low",
      score: 82,
      factors: [
        "Pre-sales covering 65% of total project value",
        "Borrower has sufficient liquidity for cost overruns",
        "Project located in high-demand area"
      ],
      strengths: [
        "Developer has completed 12 similar projects in the last decade",
        "Construction timeline aligns with market conditions",
        "All permits and approvals secured"
      ],
      ratios: {
        debtServiceCoverage: "1.5x",
        returnOnInvestment: "18.2%",
        loanToValue: "70%",
        preSalesPercentage: "65%"
      }
    },
    estimatedCompletion: "2024-04-15"
  },
  {
    id: "APP-3849",
    borrower: "Coastal Shipping Co",
    amount: "$850,000",
    purpose: "Working Capital",
    status: "Credit Review",
    dateSubmitted: "2024-04-08",
    completeness: 60,
    assetClass: "Working Capital",
    priority: "Medium",
    creditScore: 680,
    dti: "42%",
    ltvRatio: "N/A",
    collateralValue: "$1,200,000",
    riskAssessment: {
      level: "Medium",
      score: 58,
      factors: [
        "Industry experiencing cyclical downturn",
        "Accounts receivable aging longer than industry average",
        "Seasonal cash flow fluctuations"
      ],
      strengths: [
        "Long-term contracts with major clients",
        "Diversified customer base across industries"
      ],
      ratios: {
        currentRatio: "1.3x",
        quickRatio: "0.9x",
        daysReceivablesOutstanding: "65 days",
        inventoryTurnover: "6.2x annually"
      }
    },
    estimatedCompletion: "2024-04-20"
  }
];

const UnderwritingAgent = () => {
  const [tab, setTab] = useState("applications");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApplication, setSelectedApplication] = useState<any | null>(null);
  const [analyzingTask, setAnalyzingTask] = useState<string | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (analyzingTask) {
      const interval = setInterval(() => {
        setAnalysisProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            toast.success(`Risk analysis complete for ${analyzingTask}`);
            setAnalyzingTask(null);
            return 0;
          }
          return prev + 5;
        });
      }, 300);
      
      return () => clearInterval(interval);
    }
  }, [analyzingTask]);

  const handleViewApplication = (application: any) => {
    setSelectedApplication(application);
  };

  const handleRunRiskAnalysis = (appId: string) => {
    setAnalyzingTask(appId);
    toast.info(`AI risk analysis started for ${appId}`);
  };

  const handleSendToDecision = (appId: string) => {
    toast.success(`Application ${appId} sent to Decision Agent`);
    navigate(`/agents/decision?applicationId=${appId}`);
  };

  const generateCreditMemo = (appId: string) => {
    const app = mockUnderwritingTasks.find(app => app.id === appId);
    if (!app) return;
    
    toast.info(`Generating credit memo for ${appId}`);
    
    setTimeout(() => {
      const win = window.open("", "_blank");
      if (win) {
        win.document.write(`
          <html>
            <head>
              <title>Credit Memo - ${appId}</title>
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
                  <p class="memo-id">Memo ID: CM-${appId}-${Math.floor(Math.random() * 1000)}</p>
                  <p class="memo-id">Date: ${new Date().toLocaleDateString()}</p>
                </div>
                <img src="/lovable-uploads/c358cff4-5e06-49e8-af0b-d9e4c7099001.png" class="logo" alt="GaIGentic Logo">
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
                  This credit memorandum provides a comprehensive analysis and recommendation for the ${app.amount} 
                  ${app.purpose} loan request from ${app.borrower}. The application was submitted on 
                  ${app.dateSubmitted} and is currently in ${app.status} stage.
                </p>
                <p>
                  Based on our thorough analysis of the borrower's creditworthiness, financial history, and the 
                  collateral provided, this loan is <span class="text-bold text-primary">${app.riskAssessment.level === 'Low' ? 'recommended for approval' : app.riskAssessment.level === 'Medium' ? 'recommended for approval with conditions' : 'recommended for additional review'}</span>.
                </p>
              </div>

              <div class="section">
                <h2>Loan Request Details</h2>
                <table>
                  <tr>
                    <th>Application ID</th>
                    <td>${app.id}</td>
                    <th>Status</th>
                    <td>
                      <span class="badge badge-outline">
                        ${app.status}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <th>Requested Amount</th>
                    <td>${app.amount}</td>
                    <th>Asset Class</th>
                    <td>${app.assetClass}</td>
                  </tr>
                  <tr>
                    <th>Date Submitted</th>
                    <td>${app.dateSubmitted}</td>
                    <th>Purpose</th>
                    <td>${app.purpose}</td>
                  </tr>
                  <tr>
                    <th>Collateral Value</th>
                    <td>${app.collateralValue}</td>
                    <th>Loan-to-Value</th>
                    <td>${app.ltvRatio}</td>
                  </tr>
                </table>
              </div>

              <div class="section">
                <h2>Borrower Information</h2>
                <table>
                  <tr>
                    <th>Borrower</th>
                    <td colspan="3">${app.borrower}</td>
                  </tr>
                  <tr>
                    <th>Credit Score</th>
                    <td>${app.creditScore}</td>
                    <th>Debt-to-Income</th>
                    <td>${app.dti}</td>
                  </tr>
                  <tr>
                    <th>Industry</th>
                    <td>${app.assetClass}</td>
                    <th>Priority Rating</th>
                    <td>
                      <span class="badge badge-${app.priority === 'High' ? 'danger' : app.priority === 'Medium' ? 'warning' : 'outline'}">
                        ${app.priority}
                      </span>
                    </td>
                  </tr>
                </table>
              </div>

              <div class="metrics-grid">
                ${Object.entries(app.riskAssessment.ratios).slice(0, 4).map(([key, value]) => `
                  <div class="metric-card">
                    <div class="text-muted">${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</div>
                    <div class="metric-value">${value}</div>
                  </div>
                `).join('')}
              </div>

              <div class="section">
                <h2>Financial Analysis</h2>
                <p>
                  The borrower has demonstrated ${app.riskAssessment.level === 'Low' ? 'strong' : app.riskAssessment.level === 'Medium' ? 'adequate' : 'concerning'} 
                  financial performance with the following key metrics:
                </p>
                <ul>
                  ${Object.entries(app.riskAssessment.ratios).map(([key, value]) => `
                    <li><strong>${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</strong> ${value}</li>
                  `).join('')}
                </ul>
              </div>

              <div class="section">
                <h2>Risk Assessment</h2>
                <div class="flex-between">
                  <h3>Risk Level: 
                    <span class="badge badge-${app.riskAssessment.level === 'Low' ? 'success' : app.riskAssessment.level === 'Medium' ? 'warning' : 'danger'}">
                      ${app.riskAssessment.level}
                    </span>
                  </h3>
                  <h3>Risk Score: ${app.riskAssessment.score}/100</h3>
                </div>
                
                <h3>Risk Factors</h3>
                <ul>
                  ${app.riskAssessment.factors.map(factor => `<li>${factor}</li>`).join('')}
                </ul>
                
                <h3>Key Strengths</h3>
                <ul>
                  ${app.riskAssessment.strengths.map(strength => `<li>${strength}</li>`).join('')}
                </ul>
              </div>

              <div class="page-break"></div>

              <div class="section">
                <h2>Funding Recommendation</h2>
                <p>
                  Based on our comprehensive analysis, this loan application is 
                  ${app.riskAssessment.level === 'Low' 
                    ? '<span class="text-bold text-primary">recommended for approval</span> through Rabo Bank with standard terms.'
                    : app.riskAssessment.level === 'Medium' 
                    ? '<span class="text-bold text-primary">recommended for approval with conditions</span> through ABN AMRO Bank.'
                    : '<span class="text-bold">recommended for additional review</span> before funding consideration.'
                  }
                </p>

                <div style="margin-top: 20px;">
                  <h3>Recommended Terms</h3>
                  <table>
                    <tr>
                      <th>Amount</th>
                      <td>${app.amount}</td>
                      <th>Funding Source</th>
                      <td>${app.riskAssessment.level === 'Low' ? 'Rabo Bank' : 'ABN AMRO Bank'}</td>
                    </tr>
                    <tr>
                      <th>Interest Rate</th>
                      <td>${app.riskAssessment.level === 'Low' ? '5.75%' : app.riskAssessment.level === 'Medium' ? '6.25%' : '7.0%'}</td>
                      <th>Term</th>
                      <td>60 months</td>
                    </tr>
                    <tr>
                      <th>Conditions</th>
                      <td colspan="3">
                        ${app.riskAssessment.level === 'Low' 
                          ? 'Standard documentation and verification requirements.'
                          : app.riskAssessment.level === 'Medium'
                          ? 'Additional reserves of 10% of loan value and quarterly financial reporting required.'
                          : 'Substantial additional collateral required, personal guarantees, and monthly financial reporting.'
                        }
                      </td>
                    </tr>
                  </table>
                </div>
              </div>

              <div class="approval-section">
                <h2>Approval</h2>
                <div style="display: flex; justify-content: space-between; margin-top: 30px;">
                  <div>
                    <p class="signature-line"></p>
                    <div>Underwriter Signature</div>
                    <div class="text-muted">Date: _______________</div>
                  </div>
                  <div>
                    <p class="signature-line"></p>
                    <div>Credit Officer Signature</div>
                    <div class="text-muted">Date: _______________</div>
                  </div>
                  <div>
                    <p class="signature-line"></p>
                    <div>Approval Committee Chair</div>
                    <div class="text-muted">Date: _______________</div>
                  </div>
                </div>
              </div>
              
              <div style="margin-top: 50px;">
                <p class="text-muted">Credit Memo ID: CM-${appId}-${Math.floor(Math.random() * 1000)}</p>
                <p class="text-muted">Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
                <p class="text-muted">This document is confidential and intended for internal use only.</p>
              </div>
            </body>
          </html>
        `);
        win.document.close();
      }
    }, 1000);
  };

  const handleViewBorrower = (borrower: string) => {
    const borrowerId = "B-" + borrower.split(" ")[0].toUpperCase();
    navigate(`/borrowers?id=${borrowerId}`);
  };

  const handleDownloadReport = (appId: string) => {
    toast.success(`Downloading credit memo for ${appId}`);
  };

  const getPriorityBadge = (priority: string) => {
    if (priority === "High") return <Badge variant="destructive">High</Badge>;
    if (priority === "Medium") return <Badge variant="secondary">Medium</Badge>;
    return <Badge variant="outline">Low</Badge>;
  };

  const getRiskBadge = (risk: string) => {
    if (risk === "High") return <Badge variant="destructive">High Risk</Badge>;
    if (risk === "Medium") return <Badge variant="warning">Medium Risk</Badge>;
    return <Badge variant="success">Low Risk</Badge>;
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Underwriting Agent</h1>
            <p className="text-muted-foreground">
              AI agent for supporting credit analysis and underwriting decisions
            </p>
          </div>
          <OpenAIStatusIndicator />
        </div>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium">Active Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockUnderwritingTasks.length}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>In underwriting analysis</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium">Completed Analyses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <div className="flex items-center gap-1 text-xs text-green-500">
                <CheckCircle className="h-3 w-3" />
                <span>This month</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium">Avg. Risk Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Medium</div>
              <div className="flex items-center gap-1 text-xs text-amber-500">
                <AlertCircle className="h-3 w-3" />
                <span>Across current applications</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">68%</div>
              <div className="flex items-center gap-1 text-xs text-green-500">
                <CheckCircle className="h-3 w-3" />
                <span>Based on AI recommendations</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Underwriting Agent Dashboard</CardTitle>
            <CardDescription>AI-powered credit analysis, risk assessment, and decision recommendations.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={tab} onValueChange={setTab} className="w-full">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                <TabsList>
                  <TabsTrigger value="applications">Applications</TabsTrigger>
                  <TabsTrigger value="analysis">Risk Analysis</TabsTrigger>
                  <TabsTrigger value="metrics">Financial Metrics</TabsTrigger>
                </TabsList>
                
                <div className="relative w-full sm:w-60">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    className="pl-8 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <TabsContent value="applications" className="w-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Application ID</TableHead>
                      <TableHead>Borrower</TableHead>
                      <TableHead>Loan Details</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Credit Profile</TableHead>
                      <TableHead>Risk</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockUnderwritingTasks.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell className="font-medium">{task.id}</TableCell>
                        <TableCell>{task.borrower}</TableCell>
                        <TableCell>
                          <div>
                            <div>{task.amount}</div>
                            <div className="text-xs text-muted-foreground">{task.assetClass}</div>
                            <div className="text-xs text-muted-foreground">{task.purpose}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{task.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="w-full">
                            <Progress value={task.completeness} className="h-2" />
                            <div className="text-xs text-muted-foreground mt-1">{task.completeness}% complete</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="text-xs">Credit Score: <span className="font-medium">{task.creditScore}</span></div>
                            <div className="text-xs">DTI: <span className="font-medium">{task.dti}</span></div>
                            <div className="text-xs">LTV: <span className="font-medium">{task.ltvRatio}</span></div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {task.riskAssessment.level === "Low" ? (
                            <Badge variant="success">Low Risk</Badge>
                          ) : task.riskAssessment.level === "Medium" ? (
                            <Badge variant="warning">Medium Risk</Badge>
                          ) : (
                            <Badge variant="destructive">High Risk</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" onClick={() => handleViewApplication(task)} title="View Application">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleRunRiskAnalysis(task.id)}
                              disabled={!!analyzingTask}
                              title="Run Risk Analysis"
                            >
                              <BarChart3 className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => generateCreditMemo(task.id)}
                              title="Generate Credit Memo"
                            >
                              <Receipt className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleSendToDecision(task.id)}
                              disabled={task.completeness < 90}
                              title="Send to Decision"
                            >
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                {analyzingTask && (
                  <div className="mt-4 p-4 border rounded-md bg-muted/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <div className="font-medium">Analyzing Application {analyzingTask}</div>
                    </div>
                    <Progress value={analysisProgress} className="h-2" />
                    <div className="text-xs text-muted-foreground mt-1">
                      AI risk analysis in progress: Evaluating credit risk factors, financial stability, and collateral assessment...
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="analysis" className="w-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Application ID</TableHead>
                      <TableHead>Borrower</TableHead>
                      <TableHead>Credit Score</TableHead>
                      <TableHead>DTI Ratio</TableHead>
                      <TableHead>LTV Ratio</TableHead>
                      <TableHead>Collateral</TableHead>
                      <TableHead>Risk Assessment</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockUnderwritingTasks.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell className="font-medium">{task.id}</TableCell>
                        <TableCell>{task.borrower}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {task.creditScore >= 720 ? (
                              <CheckCircle className="h-3 w-3 text-green-500" />
                            ) : task.creditScore >= 680 ? (
                              <AlertCircle className="h-3 w-3 text-amber-500" />
                            ) : (
                              <AlertCircle className="h-3 w-3 text-red-500" />
                            )}
                            <span>{task.creditScore}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {parseInt(task.dti) <= 36 ? (
                              <CheckCircle className="h-3 w-3 text-green-500" />
                            ) : parseInt(task.dti) <= 43 ? (
                              <AlertCircle className="h-3 w-3 text-amber-500" />
                            ) : (
                              <AlertCircle className="h-3 w-3 text-red-500" />
                            )}
                            <span>{task.dti}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {task.ltvRatio !== "N/A" ? (
                            <div className="flex items-center gap-1">
                              {parseInt(task.ltvRatio) <= 70 ? (
                                <CheckCircle className="h-3 w-3 text-green-500" />
                              ) : parseInt(task.ltvRatio) <= 80 ? (
                                <AlertCircle className="h-3 w-3 text-amber-500" />
                              ) : (
                                <AlertCircle className="h-3 w-3 text-red-500" />
                              )}
                              <span>{task.ltvRatio}</span>
                            </div>
                          ) : (
                            <span>N/A</span>
                          )}
                        </TableCell>
                        <TableCell>{task.collateralValue}</TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            {task.riskAssessment.level === "Low" ? (
                              <Badge variant="success">Low Risk</Badge>
                            ) : task.riskAssessment.level === "Medium" ? (
                              <Badge variant="warning">Medium Risk</Badge>
                            ) : (
                              <Badge variant="destructive">High Risk</Badge>
                            )}
                            <div className="flex items-center gap-1 mt-1">
                              <Progress 
                                value={task.riskAssessment.score} 
                                className={`h-2 ${
                                  task.riskAssessment.level === "Low" ? "bg-green-200" : 
                                  task.riskAssessment.level === "Medium" ? "bg-amber-200" : 
                                  "bg-red-200"
                                }`} 
                              />
                              <span className="text-xs">{task.riskAssessment.score}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => generateCreditMemo(task.id)}
                              className="h-8 px-2 text-xs"
                            >
                              <Receipt className="h-3.5 w-3.5 mr-1" />
                              Credit Memo
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleDownloadReport(task.id)}
                              className="h-8 px-2 text-xs"
                            >
                              <Download className="h-3.5 w-3.5 mr-1" />
                              Download
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
              
              <TabsContent value="metrics" className="w-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Application</TableHead>
                      <TableHead>Borrower</TableHead>
                      <TableHead>Loan Type</TableHead>
                      <TableHead>Key Financial Metrics</TableHead>
                      <TableHead>Risk Factors</TableHead>
                      <TableHead>Strengths</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockUnderwritingTasks.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell className="font-medium">{task.id}</TableCell>
                        <TableCell>{task.borrower}</TableCell>
                        <TableCell>{task.assetClass}</TableCell>
                        <TableCell>
                          <div className="space-y-1 text-sm">
                            {Object.entries(task.riskAssessment.ratios).slice(0, 3).map(([key, value]) => (
                              <div key={key}>
                                <span className="font-medium">
                                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                                </span> {value}
                              </div>
                            ))}
                            {Object.keys(task.riskAssessment.ratios).length > 3 && (
                              <div className="text-xs text-muted-foreground">
                                +{Object.keys(task.riskAssessment.ratios).length - 3} more metrics
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <ul className="list-disc pl-4 text-sm">
                            {task.riskAssessment.factors.slice(0, 2).map((factor, idx) => (
                              <li key={idx} className="text-sm">{factor}</li>
                            ))}
                            {task.riskAssessment.factors.length > 2 && (
                              <li className="text-xs text-muted-foreground">
                                +{task.riskAssessment.factors.length - 2} more factors
                              </li>
                            )}
                          </ul>
                        </TableCell>
                        <TableCell>
                          <ul className="list-disc pl-4 text-sm">
                            {task.riskAssessment.strengths.slice(0, 2).map((strength, idx) => (
                              <li key={idx} className="text-sm">{strength}</li>
                            ))}
                            {task.riskAssessment.strengths.length > 2 && (
                              <li className="text-xs text-muted-foreground">
                                +{task.riskAssessment.strengths.length - 2} more strengths
                              </li>
                            )}
                          </ul>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button size="icon" variant="ghost" onClick={() => handleViewApplication(task)} title="View Application">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" onClick={() => handleViewBorrower(task.borrower)} title="View Borrower">
                              <UserCheck className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" onClick={() => handleRunRiskAnalysis(task.id)} title="Run Financial Analysis">
                              <BarChart4 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {selectedApplication && (
        <ApplicationDetailModal 
          isOpen={!!selectedApplication} 
          onClose={() => setSelectedApplication(null)} 
          application={selectedApplication} 
        />
      )}
    </MainLayout>
  );
};

export default UnderwritingAgent;


import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Search, CheckCircle, AlertCircle, Clock, Loader2, BarChart3, ArrowRight, Eye, FileText, Download, Ban, BarChart4, UserCheck } from "lucide-react";
import OpenAIStatusIndicator from "@/components/agents/OpenAIStatusIndicator";
import ApplicationDetailModal from "@/components/modals/ApplicationDetailModal";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

// Mock data for underwriting with enhanced risk data
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

  // Simulate AI risk analysis
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

  const handleViewReport = (appId: string) => {
    const app = mockUnderwritingTasks.find(app => app.id === appId);
    if (!app) return;
    
    toast.info(`Generating risk assessment report for ${appId}`);
    
    setTimeout(() => {
      const win = window.open("", "_blank");
      if (win) {
        win.document.write(`
          <html>
            <head>
              <title>Risk Assessment Report - ${appId}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
                .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
                .logo { max-width: 200px; }
                h1, h2 { color: #333; }
                h3 { color: #555; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
                th { background-color: #f2f2f2; }
                .section { margin-bottom: 30px; }
                .risk-high { color: #e11d48; font-weight: 600; }
                .risk-medium { color: #f59e0b; font-weight: 600; }
                .risk-low { color: #10b981; font-weight: 600; }
                .metric { color: #2563eb; font-weight: 600; }
                .strength { color: #16a34a; font-weight: 600; }
                .progress-container { width: 100%; height: 20px; background-color: #f0f0f0; border-radius: 10px; margin: 10px 0; }
                .progress-bar { height: 100%; border-radius: 10px; }
                .progress-low { background-color: #10b981; }
                .progress-medium { background-color: #f59e0b; }
                .progress-high { background-color: #e11d48; }
              </style>
            </head>
            <body>
              <div class="header">
                <div>
                  <h1>Risk Assessment Report</h1>
                  <p>Application ID: ${appId}</p>
                  <p>Date: ${new Date().toLocaleDateString()}</p>
                </div>
                <img src="/lovable-uploads/c358cff4-5e06-49e8-af0b-d9e4c7099001.png" class="logo" alt="GaIGentic Logo">
              </div>
              
              <div class="section">
                <h2>Application Summary</h2>
                <table>
                  <tr>
                    <th>Borrower</th>
                    <td>${app.borrower}</td>
                    <th>Loan Amount</th>
                    <td>${app.amount}</td>
                  </tr>
                  <tr>
                    <th>Purpose</th>
                    <td>${app.purpose}</td>
                    <th>Asset Class</th>
                    <td>${app.assetClass}</td>
                  </tr>
                  <tr>
                    <th>Date Submitted</th>
                    <td>${app.dateSubmitted}</td>
                    <th>Collateral Value</th>
                    <td>${app.collateralValue}</td>
                  </tr>
                  <tr>
                    <th>Credit Score</th>
                    <td>${app.creditScore}</td>
                    <th>Loan-to-Value</th>
                    <td><span class="metric">Loan-to-Value:</span> ${app.ltvRatio}</td>
                  </tr>
                  <tr>
                    <th>Debt-to-Income</th>
                    <td><span class="metric">Debt-to-Income:</span> ${app.dti}</td>
                    <th>Completion Status</th>
                    <td>${app.completeness}%</td>
                  </tr>
                </table>
              </div>
              
              <div class="section">
                <h2>Risk Assessment Overview</h2>
                <h3>Risk Level: <span class="risk-${app.riskAssessment.level.toLowerCase()}">${app.riskAssessment.level} Risk</span></h3>
                
                <p>Risk Score: ${app.riskAssessment.score}/100</p>
                <div class="progress-container">
                  <div class="progress-bar progress-${app.riskAssessment.level.toLowerCase()}" style="width: ${app.riskAssessment.score}%;"></div>
                </div>
                
                <h3>Key Risk Factors</h3>
                <ul>
                  ${app.riskAssessment.factors.map(factor => {
                    let className = '';
                    if (factor.toLowerCase().includes('debt') || factor.toLowerCase().includes('ratio') || factor.toLowerCase().includes('utilization')) {
                      className = 'metric';
                    } else if (factor.toLowerCase().includes('strong') || factor.toLowerCase().includes('sufficient') || factor.toLowerCase().includes('high-demand')) {
                      className = 'risk-low';
                    } else if (factor.toLowerCase().includes('moderate') || factor.toLowerCase().includes('cyclical') || factor.toLowerCase().includes('longer')) {
                      className = 'risk-medium';
                    } else if (factor.toLowerCase().includes('downturn') || factor.toLowerCase().includes('seasonal') || factor.toLowerCase().includes('volatile')) {
                      className = 'risk-high';
                    }
                    return `<li><span class="${className}">${factor}</span></li>`;
                  }).join('')}
                </ul>
                
                <h3>Key Strengths</h3>
                <ul>
                  ${app.riskAssessment.strengths.map(strength => 
                    `<li><span class="strength">${strength}</span></li>`
                  ).join('')}
                </ul>
              </div>
              
              <div class="section">
                <h2>Financial Ratios & Metrics</h2>
                <table>
                  ${Object.entries(app.riskAssessment.ratios).map(([key, value]) => `
                    <tr>
                      <th>${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</th>
                      <td><span class="metric">${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</span> ${value}</td>
                    </tr>
                  `).join('')}
                </table>
              </div>
              
              <div class="section">
                <h2>Recommendation</h2>
                <p>${app.riskAssessment.level === 'Low' ? 
                  'Based on the comprehensive risk analysis, this application presents a <span class="risk-low">low risk profile</span> and is recommended for approval with standard terms.' :
                  app.riskAssessment.level === 'Medium' ? 
                  'Based on the comprehensive risk analysis, this application presents a <span class="risk-medium">moderate risk profile</span>. Recommend approval with additional monitoring or modified terms to mitigate identified risk factors.' :
                  'Based on the comprehensive risk analysis, this application presents a <span class="risk-high">high risk profile</span>. Recommend additional collateral requirements or guarantees before proceeding, or denial if risks cannot be adequately mitigated.'
                }</p>
              </div>
              
              <div style="margin-top: 50px;">
                <p><strong>Prepared by:</strong> GaIGentic Underwriting AI Agent</p>
                <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                <p><small>This report was automatically generated based on AI analysis. Human review recommended before final decision.</small></p>
              </div>
            </body>
          </html>
        `);
        win.document.close();
      }
    }, 1000);
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
  
  const handleDownloadReport = (appId: string) => {
    toast.success(`Downloading risk report for ${appId}`);
  };

  const handleViewBorrower = (borrower: string) => {
    // Convert borrower name to a simulated ID for navigation
    const borrowerId = "B-" + borrower.split(" ")[0].toUpperCase();
    navigate(`/borrowers?id=${borrowerId}`);
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
                        <TableCell>{getRiskBadge(task.riskAssessment.level)}</TableCell>
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
                            {getRiskBadge(task.riskAssessment.level)}
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
                              onClick={() => handleViewReport(task.id)}
                              className="h-8 px-2 text-xs"
                            >
                              <FileText className="h-3.5 w-3.5 mr-1" />
                              View
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

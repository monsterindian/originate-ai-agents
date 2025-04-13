
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { 
  Search, CheckCircle, AlertCircle, Clock, Loader2, BarChart3, Eye, 
  FileText, ThumbsUp, ThumbsDown, CircleSlash, Check, Filter, RefreshCw,
  Download, MessageSquare, Lightbulb, PieChart, UserCheck
} from "lucide-react";
import OpenAIStatusIndicator from "@/components/agents/OpenAIStatusIndicator";
import ApplicationDetailModal from "@/components/modals/ApplicationDetailModal";
import { toast } from "sonner";
import { LoanApplication } from "@/types";
import {
  getApplicationsForAgentType,
  getMockLoanApplications,
  formatCurrency
} from "@/services/mockDataService";

type DecisionTask = LoanApplication & {
  aiRecommendation: "Approve" | "Conditionally Approve" | "Reject" | "Review";
  conditions?: string[];
  decisionReason?: string;
  dti?: string;
  ltvRatio?: string;
};

const DecisionAgent = () => {
  const [tab, setTab] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApplication, setSelectedApplication] = useState<LoanApplication | null>(null);
  const [analyzingTask, setAnalyzingTask] = useState<string | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [decisionTasks, setDecisionTasks] = useState<DecisionTask[]>([]);
  const [pastDecisions, setPastDecisions] = useState<DecisionTask[]>([]);
  const [loading, setLoading] = useState(true);

  // Load decision tasks on mount
  useEffect(() => {
    setLoading(true);
    const loadData = async () => {
      try {
        // Get applications ready for decision
        const appsForDecision = getApplicationsForAgentType("decision");
        
        // Transform applications into decision tasks
        const tasks: DecisionTask[] = appsForDecision.map(app => {
          const dti = `${Math.floor(Math.random() * 20) + 25}%`; // Random DTI between 25% and 45%
          const ltvRatio = `${Math.floor(Math.random() * 30) + 60}%`; // Random LTV between 60% and 90%
          
          // Determine AI recommendation based on risk and other factors
          let aiRecommendation: "Approve" | "Conditionally Approve" | "Reject" | "Review";
          let conditions: string[] = [];
          
          if (app.risk === "Low") {
            aiRecommendation = "Approve";
          } else if (app.risk === "Medium") {
            if (app.completeness > 90) {
              aiRecommendation = "Conditionally Approve";
              conditions = [
                "Increase down payment to 25%",
                "Provide additional collateral verification"
              ];
            } else {
              aiRecommendation = "Review";
            }
          } else {
            if (parseInt(dti) > 40) {
              aiRecommendation = "Reject";
            } else {
              aiRecommendation = "Conditionally Approve";
              conditions = [
                "Increase down payment to 35%",
                "Require personal guarantee",
                "Increase interest rate by 0.5%"
              ];
            }
          }
          
          return {
            ...app,
            aiRecommendation,
            conditions,
            dti,
            ltvRatio
          };
        });
        
        // Get past decisions (using approved/rejected applications)
        const decidedApps = getMockLoanApplications({
          status: ["approved", "conditionally_approved", "rejected"],
          limit: 10
        });
        
        const decisions: DecisionTask[] = decidedApps.map(app => {
          const dti = `${Math.floor(Math.random() * 20) + 25}%`;
          const ltvRatio = `${Math.floor(Math.random() * 30) + 60}%`;
          
          // Determine AI recommendation that matches the actual decision
          let aiRecommendation: "Approve" | "Conditionally Approve" | "Reject" | "Review";
          let humanDecision: "Approve" | "Conditionally Approve" | "Reject";
          let decisionReason: string;
          
          if (app.status === "approved") {
            aiRecommendation = "Approve";
            humanDecision = "Approve";
            decisionReason = "Strong financials, good credit history, adequate collateral";
          } else if (app.status === "conditionally_approved") {
            aiRecommendation = "Conditionally Approve";
            humanDecision = "Conditionally Approve";
            decisionReason = "Approval with conditions: Additional equity injection required";
          } else {
            aiRecommendation = "Reject";
            humanDecision = "Reject";
            decisionReason = "High debt-to-income ratio, insufficient cash flow projections";
          }
          
          return {
            ...app,
            aiRecommendation,
            decisionReason,
            humanDecision,
            dti,
            ltvRatio
          };
        });
        
        setDecisionTasks(tasks);
        setPastDecisions(decisions);
        setLoading(false);
      } catch (error) {
        console.error("Error loading decision tasks:", error);
        toast.error("Failed to load decision tasks");
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Simulate AI final decision analysis
  useEffect(() => {
    if (analyzingTask) {
      const interval = setInterval(() => {
        setAnalysisProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            toast.success(`Final analysis complete for ${analyzingTask}`);
            setAnalyzingTask(null);
            return 0;
          }
          return prev + 5;
        });
      }, 300);
      
      return () => clearInterval(interval);
    }
  }, [analyzingTask]);

  const handleViewApplication = (application: LoanApplication) => {
    setSelectedApplication(application);
  };

  const handleRunAnalysis = (appId: string) => {
    setAnalyzingTask(appId);
    toast.info(`AI final decision analysis started for ${appId}`);
  };

  const handleApprove = (app: DecisionTask) => {
    toast.success(`Application ${app.id} has been APPROVED`);
    // In a real app, this would update the application status to approved
    
    // Move the task to past decisions
    const decisionTask: DecisionTask = {
      ...app,
      status: "approved",
      displayStatus: "Approved",
      decisionReason: "Strong financials, good credit history, adequate collateral",
      dateApproved: new Date().toISOString().split('T')[0]
    };
    
    setPastDecisions(prev => [decisionTask, ...prev]);
    setDecisionTasks(prev => prev.filter(task => task.id !== app.id));
  };

  const handleCondApprove = (app: DecisionTask) => {
    toast.success(`Application ${app.id} has been CONDITIONALLY APPROVED`);
    // In a real app, this would update the application status to conditionally approved
    
    // Move the task to past decisions
    const decisionTask: DecisionTask = {
      ...app,
      status: "conditionally_approved",
      displayStatus: "Conditionally Approved",
      decisionReason: "Approved with conditions: Additional requirements must be met",
      dateApproved: new Date().toISOString().split('T')[0]
    };
    
    setPastDecisions(prev => [decisionTask, ...prev]);
    setDecisionTasks(prev => prev.filter(task => task.id !== app.id));
  };

  const handleReject = (app: DecisionTask) => {
    toast.success(`Application ${app.id} has been REJECTED`);
    // In a real app, this would update the application status to rejected
    
    // Move the task to past decisions
    const decisionTask: DecisionTask = {
      ...app,
      status: "rejected",
      displayStatus: "Rejected",
      decisionReason: "High debt-to-income ratio, insufficient documentation, risk factors",
      dateApproved: new Date().toISOString().split('T')[0]
    };
    
    setPastDecisions(prev => [decisionTask, ...prev]);
    setDecisionTasks(prev => prev.filter(task => task.id !== app.id));
  };

  const handleViewReport = (appId: string) => {
    toast.info(`Viewing decision report for ${appId}`);
    // In a real app, this would open a detailed decision report
  };

  const handleRefreshData = () => {
    setLoading(true);
    toast.info("Refreshing decision tasks...");
    
    // Simulate API refresh
    setTimeout(() => {
      // This would actually fetch new data in a real application
      setLoading(false);
      toast.success("Decision tasks refreshed successfully");
    }, 800);
  };

  const getRecommendationBadge = (rec: string) => {
    if (rec === "Approve") return <Badge variant="success">Approve</Badge>;
    if (rec === "Conditionally Approve") return <Badge variant="warning">Conditionally Approve</Badge>;
    if (rec === "Reject") return <Badge variant="destructive">Reject</Badge>;
    return <Badge variant="secondary">Review</Badge>;
  };

  const getDecisionBadge = (decision: string) => {
    if (decision === "Approved") return <Badge variant="success">Approved</Badge>;
    if (decision === "Conditionally Approved") return <Badge variant="warning">Conditionally Approved</Badge>;
    return <Badge variant="destructive">Rejected</Badge>;
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Decision Agent</h1>
            <p className="text-muted-foreground">
              AI agent for final loan approval decision support
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleRefreshData}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <OpenAIStatusIndicator />
          </div>
        </div>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium">Pending Decisions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{decisionTasks.length}</div>
              <div className="flex items-center gap-1 text-xs text-amber-500">
                <Clock className="h-3 w-3" />
                <span>Awaiting final decision</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium">Decisions Made</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pastDecisions.length}</div>
              <div className="flex items-center gap-1 text-xs text-green-500">
                <CheckCircle className="h-3 w-3" />
                <span>This month</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(() => {
                  const approvals = pastDecisions.filter(d => 
                    d.status === "approved" || d.status === "conditionally_approved"
                  ).length;
                  
                  return pastDecisions.length > 0 
                    ? `${Math.round((approvals / pastDecisions.length) * 100)}%` 
                    : "N/A";
                })()}
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <BarChart3 className="h-3 w-3" />
                <span>
                  {(() => {
                    const approvals = pastDecisions.filter(d => 
                      d.status === "approved" || d.status === "conditionally_approved"
                    ).length;
                    
                    return `${approvals} of ${pastDecisions.length} decisions were approvals`;
                  })()}
                </span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium">AI Agreement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">100%</div>
              <div className="flex items-center gap-1 text-xs text-green-500">
                <CheckCircle className="h-3 w-3" />
                <span>Human/AI decision alignment</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Decision Agent Dashboard</CardTitle>
            <CardDescription>AI-powered final review and approval recommendations for loan applications.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={tab} onValueChange={setTab} className="w-full">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                <TabsList>
                  <TabsTrigger value="pending">Pending Decisions</TabsTrigger>
                  <TabsTrigger value="history">Decision History</TabsTrigger>
                </TabsList>
                
                <div className="flex items-center gap-2">
                  <div className="relative w-full sm:w-60">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search..."
                      className="pl-8 w-full"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                </div>
              </div>
              
              <TabsContent value="pending" className="w-full">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-2">Loading decision tasks...</span>
                  </div>
                ) : decisionTasks.length > 0 ? (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Application ID</TableHead>
                          <TableHead>Borrower</TableHead>
                          <TableHead>Loan Details</TableHead>
                          <TableHead>Risk Assessment</TableHead>
                          <TableHead>AI Recommendation</TableHead>
                          <TableHead>Conditions</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {decisionTasks.map((task) => (
                          <TableRow key={task.id}>
                            <TableCell className="font-medium">{task.id}</TableCell>
                            <TableCell>
                              {task.borrower.companyName || `${task.borrower.firstName} ${task.borrower.lastName}`}
                            </TableCell>
                            <TableCell>
                              <div>
                                <div>{formatCurrency(task.amount)}</div>
                                <div className="text-xs text-muted-foreground">
                                  {task.assetClass.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                </div>
                                <div className="text-xs text-muted-foreground">{task.purpose}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <Badge 
                                  variant={
                                    task.risk === "Low" ? "success" : 
                                    task.risk === "Medium" ? "warning" : 
                                    "destructive"
                                  }
                                >
                                  {task.risk} Risk
                                </Badge>
                                <div className="text-xs mt-1">Credit: {task.borrower.creditScore || "N/A"}</div>
                                <div className="text-xs">DTI: {task.dti}</div>
                                <div className="text-xs">LTV: {task.ltvRatio}</div>
                              </div>
                            </TableCell>
                            <TableCell>{getRecommendationBadge(task.aiRecommendation)}</TableCell>
                            <TableCell>
                              {task.conditions && task.conditions.length > 0 ? (
                                <div className="max-w-[200px] text-xs">
                                  {task.conditions.map((condition, idx) => (
                                    <div key={idx} className="flex items-start gap-1 mb-1">
                                      <div className="min-w-3">•</div>
                                      <div>{condition}</div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-xs text-muted-foreground">No conditions</div>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-1">
                                  <Button variant="ghost" size="icon" onClick={() => handleViewApplication(task)} title="View Application">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => handleRunAnalysis(task.id)}
                                    disabled={!!analyzingTask}
                                    title="Run Final Analysis"
                                  >
                                    <BarChart3 className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => handleViewReport(task.id)}
                                    title="View Report"
                                  >
                                    <FileText className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => toast.info(`Viewing borrower details for ${task.borrower.companyName || `${task.borrower.firstName} ${task.borrower.lastName}`}`)}
                                    title="View Borrower"
                                  >
                                    <UserCheck className="h-4 w-4" />
                                  </Button>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="w-full"
                                    onClick={() => handleApprove(task)}
                                  >
                                    <ThumbsUp className="h-3 w-3 mr-1" />
                                    Approve
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="w-full"
                                    onClick={() => handleCondApprove(task)}
                                  >
                                    <Check className="h-3 w-3 mr-1" />
                                    Cond.
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="w-full"
                                    onClick={() => handleReject(task)}
                                  >
                                    <ThumbsDown className="h-3 w-3 mr-1" />
                                    Reject
                                  </Button>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Lightbulb className="h-12 w-12 text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-semibold">No Pending Decisions</h3>
                    <p className="text-muted-foreground text-sm mt-2 max-w-md">
                      There are currently no applications ready for a decision. Applications will appear here when they are ready for final review.
                    </p>
                    <Button variant="outline" className="mt-4" onClick={handleRefreshData}>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Check for New Applications
                    </Button>
                  </div>
                )}
                
                {analyzingTask && (
                  <div className="mt-4 p-4 border rounded-md bg-muted/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <div className="font-medium">Running Final Decision Analysis for {analyzingTask}</div>
                    </div>
                    <Progress value={analysisProgress} className="h-2" />
                    <div className="text-xs text-muted-foreground mt-1">
                      AI decision engine is analyzing all risk factors and providing a final recommendation...
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="history" className="w-full">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-2">Loading decision history...</span>
                  </div>
                ) : pastDecisions.length > 0 ? (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Application ID</TableHead>
                          <TableHead>Borrower</TableHead>
                          <TableHead>Loan Details</TableHead>
                          <TableHead>Decision</TableHead>
                          <TableHead>AI Recommendation</TableHead>
                          <TableHead>Reason</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pastDecisions.map((decision) => (
                          <TableRow key={decision.id}>
                            <TableCell className="font-medium">{decision.id}</TableCell>
                            <TableCell>
                              {decision.borrower.companyName || `${decision.borrower.firstName} ${decision.borrower.lastName}`}
                            </TableCell>
                            <TableCell>
                              <div>
                                <div>{formatCurrency(decision.amount)}</div>
                                <div className="text-xs text-muted-foreground">{decision.purpose}</div>
                              </div>
                            </TableCell>
                            <TableCell>{getDecisionBadge(decision.displayStatus)}</TableCell>
                            <TableCell>{getRecommendationBadge(decision.aiRecommendation)}</TableCell>
                            <TableCell>
                              <div className="max-w-[200px] text-xs">
                                {decision.decisionReason}
                              </div>
                            </TableCell>
                            <TableCell>{decision.dateApproved || "N/A"}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => handleViewApplication(decision)}
                                  title="View Application"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => handleViewReport(decision.id)}
                                  title="View Report"
                                >
                                  <FileText className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => toast.success(`Downloading report for ${decision.id}`)}
                                  title="Download Report"
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <PieChart className="h-12 w-12 text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-semibold">No Decision History</h3>
                    <p className="text-muted-foreground text-sm mt-2 max-w-md">
                      There are no decisions in the history yet. Once you make decisions on applications, they will appear here.
                    </p>
                  </div>
                )}
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

export default DecisionAgent;


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
  FileText, ThumbsUp, ThumbsDown, CircleSlash, Check, Filter 
} from "lucide-react";
import OpenAIStatusIndicator from "@/components/agents/OpenAIStatusIndicator";
import ApplicationDetailModal from "@/components/modals/ApplicationDetailModal";
import { toast } from "sonner";

// Mock data for decision agent
const mockDecisionTasks = [
  {
    id: "APP-3845",
    borrower: "Sunrise Properties LLC",
    amount: "$2,200,000",
    purpose: "Property Acquisition",
    status: "Ready for Decision",
    dateSubmitted: "2024-04-05",
    completeness: 98,
    assetClass: "Commercial Real Estate",
    priority: "High",
    creditScore: 720,
    dti: "38%",
    ltvRatio: "75%",
    riskAssessment: "Medium",
    aiRecommendation: "Conditionally Approve",
    conditions: ["Increase down payment to 30%", "Provide additional collateral"]
  },
  {
    id: "APP-3848",
    borrower: "Evergreen Developments",
    amount: "$4,500,000",
    purpose: "Construction",
    status: "Ready for Decision",
    dateSubmitted: "2024-04-01",
    completeness: 100,
    assetClass: "Construction",
    priority: "High",
    creditScore: 750,
    dti: "35%",
    ltvRatio: "70%",
    riskAssessment: "Low",
    aiRecommendation: "Approve",
    conditions: []
  },
  {
    id: "APP-3849",
    borrower: "Coastal Shipping Co",
    amount: "$850,000",
    purpose: "Working Capital",
    status: "Ready for Decision",
    dateSubmitted: "2024-04-08",
    completeness: 95,
    assetClass: "Working Capital",
    priority: "Medium",
    creditScore: 680,
    dti: "42%",
    ltvRatio: "N/A",
    riskAssessment: "Medium",
    aiRecommendation: "Review",
    conditions: ["Verify additional income sources", "Require personal guarantee"]
  }
];

// Past decisions for the history tab
const mockPastDecisions = [
  {
    id: "APP-3820",
    borrower: "Metro Medical Services",
    amount: "$1,500,000",
    purpose: "Equipment Purchase",
    decision: "Approved",
    dateDecided: "2024-04-01",
    aiRecommendation: "Approve",
    humanDecision: "Approve",
    decisionReason: "Strong financials, good credit history, adequate collateral"
  },
  {
    id: "APP-3822",
    borrower: "Riverfront Hospitality",
    amount: "$3,200,000",
    purpose: "Property Renovation",
    decision: "Conditionally Approved",
    dateDecided: "2024-04-02",
    aiRecommendation: "Conditionally Approve",
    humanDecision: "Conditionally Approve",
    decisionReason: "Approval with conditions: Additional equity injection required"
  },
  {
    id: "APP-3830",
    borrower: "Urban Transit Solutions",
    amount: "$750,000",
    purpose: "Fleet Expansion",
    decision: "Rejected",
    dateDecided: "2024-04-05",
    aiRecommendation: "Reject",
    humanDecision: "Reject",
    decisionReason: "High debt-to-income ratio, insufficient cash flow projections"
  }
];

const DecisionAgent = () => {
  const [tab, setTab] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApplication, setSelectedApplication] = useState<any | null>(null);
  const [analyzingTask, setAnalyzingTask] = useState<string | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);

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

  const handleViewApplication = (application: any) => {
    setSelectedApplication(application);
  };

  const handleRunAnalysis = (appId: string) => {
    setAnalyzingTask(appId);
    toast.info(`AI final decision analysis started for ${appId}`);
  };

  const handleApprove = (appId: string) => {
    toast.success(`Application ${appId} has been APPROVED`);
    // In a real app, this would update the application status to approved
  };

  const handleCondApprove = (appId: string) => {
    toast.success(`Application ${appId} has been CONDITIONALLY APPROVED`);
    // In a real app, this would update the application status to conditionally approved
  };

  const handleReject = (appId: string) => {
    toast.success(`Application ${appId} has been REJECTED`);
    // In a real app, this would update the application status to rejected
  };

  const handleViewReport = (appId: string) => {
    toast.info(`Viewing decision report for ${appId}`);
    // In a real app, this would open a detailed decision report
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
          <OpenAIStatusIndicator />
        </div>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium">Pending Decisions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockDecisionTasks.length}</div>
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
              <div className="text-2xl font-bold">{mockPastDecisions.length}</div>
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
              <div className="text-2xl font-bold">66%</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <BarChart3 className="h-3 w-3" />
                <span>2 of 3 decisions were approvals</span>
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
                    {mockDecisionTasks.map((task) => (
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
                          <div>
                            <Badge 
                              variant={
                                task.riskAssessment === "Low" ? "success" : 
                                task.riskAssessment === "Medium" ? "warning" : 
                                "destructive"
                              }
                            >
                              {task.riskAssessment} Risk
                            </Badge>
                            <div className="text-xs mt-1">Credit: {task.creditScore}</div>
                            <div className="text-xs">DTI: {task.dti}</div>
                          </div>
                        </TableCell>
                        <TableCell>{getRecommendationBadge(task.aiRecommendation)}</TableCell>
                        <TableCell>
                          {task.conditions.length > 0 ? (
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
                            </div>
                            <div className="flex items-center gap-1">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="w-full"
                                onClick={() => handleApprove(task.id)}
                              >
                                <ThumbsUp className="h-3 w-3 mr-1" />
                                Approve
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="w-full"
                                onClick={() => handleCondApprove(task.id)}
                              >
                                <Check className="h-3 w-3 mr-1" />
                                Cond.
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="w-full"
                                onClick={() => handleReject(task.id)}
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
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Application ID</TableHead>
                      <TableHead>Borrower</TableHead>
                      <TableHead>Loan Details</TableHead>
                      <TableHead>Decision</TableHead>
                      <TableHead>AI Recommendation</TableHead>
                      <TableHead>Human Decision</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockPastDecisions.map((decision) => (
                      <TableRow key={decision.id}>
                        <TableCell className="font-medium">{decision.id}</TableCell>
                        <TableCell>{decision.borrower}</TableCell>
                        <TableCell>
                          <div>
                            <div>{decision.amount}</div>
                            <div className="text-xs text-muted-foreground">{decision.purpose}</div>
                          </div>
                        </TableCell>
                        <TableCell>{getDecisionBadge(decision.decision)}</TableCell>
                        <TableCell>{getRecommendationBadge(decision.aiRecommendation)}</TableCell>
                        <TableCell>{getRecommendationBadge(decision.humanDecision)}</TableCell>
                        <TableCell>
                          <div className="max-w-[200px] text-xs">
                            {decision.decisionReason}
                          </div>
                        </TableCell>
                        <TableCell>{decision.dateDecided}</TableCell>
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

export default DecisionAgent;


import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Search, CheckCircle, AlertCircle, Clock, Loader2, BarChart3, ArrowRight, Eye, FileText } from "lucide-react";
import OpenAIStatusIndicator from "@/components/agents/OpenAIStatusIndicator";
import ApplicationDetailModal from "@/components/modals/ApplicationDetailModal";
import { toast } from "sonner";

// Mock data for underwriting
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
    riskAssessment: "Medium",
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
    riskAssessment: "Low",
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
    riskAssessment: "Medium",
    estimatedCompletion: "2024-04-20"
  }
];

const UnderwritingAgent = () => {
  const [tab, setTab] = useState("applications");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApplication, setSelectedApplication] = useState<any | null>(null);
  const [analyzingTask, setAnalyzingTask] = useState<string | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);

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
    // In a real app, this would update the application status and route it to decision
  };

  const handleViewReport = (appId: string) => {
    toast.info(`Viewing risk assessment report for ${appId}`);
    // In a real app, this would open a detailed risk report
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
                        <TableCell>{getRiskBadge(task.riskAssessment)}</TableCell>
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
                        <TableCell>{getRiskBadge(task.riskAssessment)}</TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline" onClick={() => handleViewReport(task.id)}>
                            <FileText className="h-4 w-4 mr-2" />
                            View Report
                          </Button>
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

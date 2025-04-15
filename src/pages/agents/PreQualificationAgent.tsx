
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { 
  Check, Clock, Info, X, ListFilter, User, Building, CreditCard,
  FileText, BarChart, ChevronUp, ChevronDown, Calculator, AlertCircle,
  CalendarClock, ClipboardList
} from "lucide-react";
import { getApplicationsForAgentType } from "@/services/mock/loanApplicationService";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LoanApplication, PreQualificationFactor } from "@/types";

const PreQualificationAgent = () => {
  const [searchParams] = useSearchParams();
  const applicationId = searchParams.get("applicationId");
  const [application, setApplication] = useState<LoanApplication | null>(null);
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Get applications for pre-qualification agent
        const apps = getApplicationsForAgentType('pre-qualification', 50);
        setApplications(apps);
        
        // If applicationId is provided, fetch that specific application
        if (applicationId) {
          const app = apps.find(a => a.id === applicationId);
          if (app) {
            setApplication(app);
          } else {
            toast.error(`Application ${applicationId} not found`);
          }
        }
      } catch (error) {
        console.error("Failed to fetch application:", error);
        toast.error("Failed to load application data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [applicationId]);

  const handleSelectApplication = (app: LoanApplication) => {
    setApplication(app);
  };

  const generatePreQualificationScore = () => {
    if (!application) return;
    
    setIsProcessing(true);
    setProcessingProgress(0);
    
    // Simulate processing progress
    const interval = setInterval(() => {
      setProcessingProgress(prev => {
        const newProgress = prev + Math.random() * 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          
          // Create pre-qualification data
          const preQualificationScore = Math.floor(Math.random() * 40) + 50; // 50-90
          const scoreLabel = preQualificationScore >= 80 
            ? "Excellent" 
            : preQualificationScore >= 70 
              ? "Good" 
              : preQualificationScore >= 60 
                ? "Moderate" 
                : "Fair";
          
          // Update application with pre-qualification data
          setApplication(prev => {
            if (!prev) return null;
            
            // Create factors
            const factors: PreQualificationFactor[] = [
              {
                factor: "Credit Score",
                score: Math.floor(Math.random() * 30) + 65,
                weight: 5,
                explanation: `Credit score of ${prev.borrower.creditScore || '720'} meets underwriting criteria.`,
                impact: "positive"
              },
              {
                factor: "Debt-to-Income Ratio",
                score: Math.floor(Math.random() * 40) + 50,
                weight: 4,
                explanation: "Debt obligations relative to income are within acceptable range.",
                impact: "positive"
              },
              {
                factor: "Collateral Value",
                score: Math.floor(Math.random() * 20) + 70,
                weight: 3,
                explanation: `Collateral value of $${prev.collateral?.value.toLocaleString()} provides adequate security.`,
                impact: "positive"
              },
              {
                factor: "Documentation Completeness",
                score: prev.completeness > 80 ? 85 : 55,
                weight: 3,
                explanation: prev.completeness > 80 
                  ? "All required documentation provided and verified." 
                  : "Some documentation still pending or incomplete.",
                impact: prev.completeness > 80 ? "positive" : "neutral"
              }
            ];
            
            if (prev.borrower.companyName) {
              factors.push({
                factor: "Business Performance",
                score: Math.floor(Math.random() * 30) + 60,
                weight: 4,
                explanation: "Business shows stable cash flow and revenue trends.",
                impact: "positive"
              });
            }
            
            const recommendation = preQualificationScore >= 70
              ? "Application meets pre-qualification criteria. Recommended for full processing."
              : preQualificationScore >= 60
                ? "Pre-qualification score indicates potential viability. Proceed with caution and additional verification."
                : "Pre-qualification score below threshold. Consider requesting additional documentation or clarification.";
            
            return {
              ...prev,
              status: "pre_qualification_complete",
              displayStatus: "Pre-Qualification Complete",
              datePreQualified: new Date().toISOString(),
              preQualification: {
                score: preQualificationScore,
                scoreLabel: scoreLabel,
                recommendation: recommendation,
                factors: factors,
                dateGenerated: new Date().toISOString(),
                algorithmVersion: "v2.1.3",
                thresholdForApproval: 60,
                generatedBy: "Pre-Qualification Agent"
              },
              notes: [
                ...prev.notes,
                {
                  id: Date.now().toString(),
                  content: `Pre-qualification completed with score of ${preQualificationScore}/100 (${scoreLabel}). ${recommendation}`,
                  createdBy: "Pre-Qualification Agent",
                  createdAt: new Date().toISOString(),
                  isAgentNote: true
                }
              ]
            };
          });
          
          toast.success("Pre-qualification analysis completed successfully");
          return 100;
        }
        return newProgress;
      });
    }, 300);
    
    return () => clearInterval(interval);
  };

  // Function to get appropriate color based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 70) return "text-emerald-600";
    if (score >= 60) return "text-blue-600";
    if (score >= 50) return "text-yellow-600";
    if (score >= 40) return "text-orange-600";
    return "text-red-600";
  };

  // Function to get appropriate background color based on score
  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-100";
    if (score >= 70) return "bg-emerald-100";
    if (score >= 60) return "bg-blue-100";
    if (score >= 50) return "bg-yellow-100";
    if (score >= 40) return "bg-orange-100";
    return "bg-red-100";
  };

  // Function to get badge variant based on factor impact
  const getFactorBadgeVariant = (impact: "positive" | "negative" | "neutral") => {
    switch (impact) {
      case "positive": return "bg-green-100 text-green-800";
      case "negative": return "bg-red-100 text-red-800";
      case "neutral": return "bg-blue-100 text-blue-800";
      default: return "";
    }
  };

  // Function to get icon based on factor impact
  const getFactorIcon = (impact: "positive" | "negative" | "neutral") => {
    switch (impact) {
      case "positive": return <ChevronUp className="w-4 h-4 text-green-600" />;
      case "negative": return <ChevronDown className="w-4 h-4 text-red-600" />;
      case "neutral": return <span className="w-4 h-4">•</span>;
      default: return null;
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em]" />
            <p className="mt-4 text-lg">Loading application data...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  // If no application is selected, show the application list
  if (!application) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Pre-Qualification Agent</h1>
              <p className="text-muted-foreground">
                Analyze and pre-qualify loan applications before full processing
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <ListFilter className="w-4 h-4 mr-2" /> Filter
              </Button>
            </div>
          </div>
          
          {applications.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {applications.map((app) => (
                <Card key={app.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleSelectApplication(app)}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base font-medium">
                        {app.borrower.companyName || `${app.borrower.firstName} ${app.borrower.lastName}`}
                      </CardTitle>
                      <Badge variant="outline">
                        {app.displayStatus || app.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm mb-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Application ID:</span>
                        <span className="font-medium">{app.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Loan Amount:</span>
                        <span className="font-medium">${app.amount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <span className="font-medium">{app.displayStatus || app.status}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Documents:</span>
                        <span className="font-medium">{app.documents.length} uploaded</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Completeness:</span>
                        <span className="font-medium">{app.completeness}%</span>
                      </div>
                    </div>
                    <Separator className="my-3" />
                    <div className="flex justify-end mt-2">
                      <Button
                        size="sm"
                        className="h-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectApplication(app);
                        }}
                      >
                        <Calculator className="w-4 h-4 mr-2" /> Pre-Qualify
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-dashed border-muted">
              <CardContent className="py-12 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No Applications Available</h3>
                <p className="text-muted-foreground max-w-md mb-4">
                  There are currently no applications in the pre-qualification queue.
                </p>
                <Button onClick={() => window.location.href = "/applications"}>
                  Browse Applications
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </MainLayout>
    );
  }

  // Show selected application details
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Pre-Qualification Agent</h1>
            <p className="text-muted-foreground">
              Analyze and pre-qualify loan applications before full processing
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={() => setApplication(null)}
              size="sm"
            >
              Back to List
            </Button>
            <Badge variant="outline">
              {application.displayStatus || application.status}
            </Badge>
            
            <Button 
              variant="default" 
              disabled={isProcessing || application.status === "pre_qualification_complete"}
              onClick={generatePreQualificationScore}
            >
              <Calculator className="mr-2 h-4 w-4" />
              Generate Pre-Qualification
            </Button>
          </div>
        </div>

        {/* Application Info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <span>{application.id}</span>
              <Badge variant="outline">
                {application.assetClass.replace("_", " ")}
              </Badge>
            </CardTitle>
            <CardDescription>
              {application.borrower.companyName || `${application.borrower.firstName} ${application.borrower.lastName}`} - 
              ${application.amount.toLocaleString()} {application.purpose}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isProcessing ? (
              <div className="space-y-3">
                <div className="flex justify-between text-sm mb-1">
                  <span>Analyzing application data...</span>
                  <span>{Math.round(processingProgress)}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div className="bg-primary h-2.5 rounded-full" style={{ width: `${processingProgress}%` }}></div>
                </div>
                <div className="text-xs text-muted-foreground">
                  Evaluating credit data, calculating risk factors, assessing eligibility...
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Status</div>
                    <div className="font-medium">{application.displayStatus || application.status}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Submitted Date</div>
                    <div className="font-medium">
                      {application.dateSubmitted 
                        ? new Date(application.dateSubmitted).toLocaleDateString() 
                        : "Not submitted"}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Completeness</div>
                    <div className="font-medium">
                      <Progress 
                        value={application.completeness} 
                        className="h-2 mt-1" 
                      />
                      <span className="text-xs mt-1 inline-block">{application.completeness}%</span>
                    </div>
                  </div>
                </div>
                
                {/* Pre-qualification score summary (if available) */}
                {application.preQualification && (
                  <div className={`p-4 rounded-md mt-2 ${getScoreBgColor(application.preQualification.score)}`}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">Pre-Qualification Score</span>
                        <span className={`text-2xl font-bold ${getScoreColor(application.preQualification.score)}`}>
                          {application.preQualification.score}/100 
                          <span className="text-sm ml-1">({application.preQualification.scoreLabel})</span>
                        </span>
                      </div>
                      <div className="mt-2 md:mt-0">
                        <Badge variant={application.preQualification.score >= 60 ? "success" : "outline"}>
                          {application.preQualification.score >= 60 ? "Meets Threshold" : "Below Threshold"}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm mt-2">{application.preQualification.recommendation}</p>
                    <div className="text-xs text-muted-foreground mt-1">
                      Generated: {new Date(application.preQualification.dateGenerated).toLocaleString()} 
                      • Algorithm: {application.preQualification.algorithmVersion}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Application Tabs for Details */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-4 md:w-auto md:inline-flex mb-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="qualification">Qualification</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="borrower">Borrower</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <CreditCard className="mr-2 h-5 w-5" /> Loan Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">Amount:</div>
                    <div className="font-medium">${application.amount.toLocaleString()}</div>
                    
                    <div className="text-muted-foreground">Term:</div>
                    <div className="font-medium">{application.term} months</div>
                    
                    <div className="text-muted-foreground">Interest Rate:</div>
                    <div className="font-medium">{application.interestRate}%</div>
                    
                    <div className="text-muted-foreground">Asset Class:</div>
                    <div className="font-medium">{application.assetClass.replace('_', ' ')}</div>
                    
                    <div className="text-muted-foreground">Purpose:</div>
                    <div className="font-medium">{application.purpose}</div>
                    
                    <div className="text-muted-foreground">Risk Level:</div>
                    <div className="font-medium">{application.risk || 'Not assessed'}</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Building className="mr-2 h-5 w-5" /> Collateral Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {application.collateral ? (
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-muted-foreground">Type:</div>
                      <div className="font-medium">{application.collateral.type}</div>
                      
                      <div className="text-muted-foreground">Value:</div>
                      <div className="font-medium">${application.collateral.value.toLocaleString()}</div>
                      
                      <div className="text-muted-foreground">Description:</div>
                      <div className="font-medium">{application.collateral.description}</div>
                      
                      <div className="text-muted-foreground">LTV Ratio:</div>
                      <div className="font-medium">
                        {Math.round((application.amount / application.collateral.value) * 100)}%
                      </div>
                    </div>
                  ) : (
                    <div className="text-muted-foreground italic">No collateral information provided</div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <CalendarClock className="mr-2 h-5 w-5" /> Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">Created:</div>
                    <div className="font-medium">
                      {application.dateCreated ? new Date(application.dateCreated).toLocaleDateString() : 'N/A'}
                    </div>
                    
                    <div className="text-muted-foreground">Submitted:</div>
                    <div className="font-medium">
                      {application.dateSubmitted ? new Date(application.dateSubmitted).toLocaleDateString() : 'Not submitted'}
                    </div>
                    
                    <div className="text-muted-foreground">Last Updated:</div>
                    <div className="font-medium">
                      {application.dateUpdated ? new Date(application.dateUpdated).toLocaleDateString() : 'N/A'}
                    </div>
                    
                    <div className="text-muted-foreground">Pre-Qualified:</div>
                    <div className="font-medium">
                      {application.datePreQualified ? new Date(application.datePreQualified).toLocaleDateString() : 'Not pre-qualified'}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <ClipboardList className="mr-2 h-5 w-5" /> Application Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">Status:</div>
                    <div className="font-medium">{application.displayStatus}</div>
                    
                    <div className="text-muted-foreground">Completeness:</div>
                    <div className="font-medium">
                      <Progress value={application.completeness} className="h-2 mt-1" />
                      <span className="text-xs mt-1 inline-block">{application.completeness}%</span>
                    </div>
                    
                    <div className="text-muted-foreground">Document Count:</div>
                    <div className="font-medium">{application.documents.length}</div>
                    
                    <div className="text-muted-foreground">Pre-Qualification:</div>
                    <div className="font-medium">
                      {application.preQualification 
                        ? `${application.preQualification.score}/100 (${application.preQualification.scoreLabel})` 
                        : 'Not completed'}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Qualification Tab */}
          <TabsContent value="qualification" className="space-y-4">
            {application.preQualification ? (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Pre-Qualification Analysis</span>
                      <Badge variant={application.preQualification.score >= 60 ? "success" : "outline"}>
                        {application.preQualification.score >= 60 ? "Qualified" : "Not Qualified"}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      Generated on {new Date(application.preQualification.dateGenerated).toLocaleString()} 
                      • Algorithm version: {application.preQualification.algorithmVersion}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col md:flex-row items-center bg-muted rounded-md p-4">
                      <div className="flex-1 text-center md:text-left">
                        <p className="text-muted-foreground text-sm">Pre-Qualification Score</p>
                        <div className="flex items-baseline">
                          <span className={`text-4xl font-bold ${getScoreColor(application.preQualification.score)}`}>
                            {application.preQualification.score}
                          </span>
                          <span className="text-muted-foreground ml-1">/ 100</span>
                        </div>
                        <p className="text-sm font-medium">{application.preQualification.scoreLabel}</p>
                      </div>
                      
                      <Separator className="my-4 md:hidden" />
                      <Separator className="hidden md:block md:mx-4 md:h-20 md:w-px" orientation="vertical" />
                      
                      <div className="flex-1 text-center md:text-left space-y-1">
                        <p className="text-muted-foreground text-sm">Threshold for Approval</p>
                        <p className="text-xl font-medium">{application.preQualification.thresholdForApproval} / 100</p>
                        <div className="w-full bg-muted-foreground/20 h-2 rounded-full mt-2">
                          <div 
                            className={`h-2 rounded-full ${application.preQualification.score >= application.preQualification.thresholdForApproval ? 'bg-green-500' : 'bg-orange-500'}`}
                            style={{ width: `${Math.min(100, (application.preQualification.score / 100) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Recommendation</h3>
                      <p className="text-sm bg-muted/50 p-3 rounded-md">
                        {application.preQualification.recommendation}
                      </p>
                      
                      {application.preQualification.overrideReason && (
                        <div className="mt-3 bg-yellow-50 p-3 rounded-md border border-yellow-100">
                          <h4 className="text-sm font-medium text-yellow-800">Manual Override</h4>
                          <p className="text-sm text-yellow-800">{application.preQualification.overrideReason}</p>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-3">Contributing Factors</h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Factor</TableHead>
                            <TableHead>Score</TableHead>
                            <TableHead>Weight</TableHead>
                            <TableHead>Impact</TableHead>
                            <TableHead className="hidden md:table-cell">Explanation</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {application.preQualification.factors.map((factor, index) => (
                            <TableRow key={index}>
                              <TableCell>{factor.factor}</TableCell>
                              <TableCell>
                                <span className={getScoreColor(factor.score)}>{factor.score}</span>
                              </TableCell>
                              <TableCell>{factor.weight}</TableCell>
                              <TableCell>
                                <Badge className={getFactorBadgeVariant(factor.impact)}>
                                  <span className="flex items-center gap-1">
                                    {getFactorIcon(factor.impact)}
                                    {factor.impact.charAt(0).toUpperCase() + factor.impact.slice(1)}
                                  </span>
                                </Badge>
                              </TableCell>
                              <TableCell className="hidden md:table-cell">{factor.explanation}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline"
                      disabled={application.status !== "pre_qualification_complete"}
                      onClick={() => {
                        window.location.href = `/agents/processing?applicationId=${application.id}`;
                      }}
                    >
                      Send to Processing
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <BarChart className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No Pre-Qualification Data</h3>
                  <p className="text-muted-foreground max-w-md mb-4">
                    This application hasn't been pre-qualified yet. Generate a pre-qualification score to proceed.
                  </p>
                  <Button 
                    disabled={isProcessing}
                    onClick={generatePreQualificationScore}
                  >
                    <Calculator className="mr-2 h-4 w-4" /> Generate Pre-Qualification
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight">Documents</h2>
            </div>
            
            {application.documents.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="py-8 text-center">
                  <AlertCircle className="mx-auto h-8 w-8 text-muted-foreground" />
                  <h3 className="mt-2 text-lg font-semibold">No Documents Uploaded</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    This application doesn't have any documents uploaded yet.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {application.documents.map((doc) => (
                  <Card key={doc.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center justify-between">
                        <span>{doc.name}</span>
                        {doc.status === "verified" ? (
                          <Badge variant="success" className="flex items-center gap-1">
                            <Check className="h-3 w-3" />
                            Verified
                          </Badge>
                        ) : doc.status === "rejected" ? (
                          <Badge variant="destructive" className="flex items-center gap-1">
                            <X className="h-3 w-3" />
                            Rejected
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Pending
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <span>{doc.type}</span>
                        <span>•</span>
                        <span>Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}</span>
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="pb-2">
                      {doc.aiAnalysisComplete && doc.aiAnalysisSummary && (
                        <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md">
                          <p className="font-medium text-xs uppercase mb-1">AI Analysis:</p>
                          <p>{doc.aiAnalysisSummary}</p>
                        </div>
                      )}
                    </CardContent>
                    
                    <CardFooter className="pt-2">
                      <Button variant="ghost" size="sm">View Document</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          {/* Borrower Tab */}
          <TabsContent value="borrower" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight">Borrower Information</h2>
            </div>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <User className="mr-2 h-5 w-5" /> 
                  {application.borrower.companyName 
                    ? "Business Information" 
                    : "Personal Information"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {application.borrower.companyName ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground mb-1">Company Name</div>
                      <div className="font-medium">{application.borrower.companyName}</div>
                    </div>
                    
                    <div>
                      <div className="text-muted-foreground mb-1">Tax ID</div>
                      <div className="font-medium">{application.borrower.taxId || 'Not provided'}</div>
                    </div>
                    
                    <div>
                      <div className="text-muted-foreground mb-1">Industry</div>
                      <div className="font-medium">{application.borrower.industry || 'Not specified'}</div>
                    </div>
                    
                    <div>
                      <div className="text-muted-foreground mb-1">Years in Business</div>
                      <div className="font-medium">{application.borrower.yearsInBusiness || 'Not specified'}</div>
                    </div>
                    
                    <div>
                      <div className="text-muted-foreground mb-1">Annual Revenue</div>
                      <div className="font-medium">
                        {application.borrower.annualRevenue 
                          ? `$${application.borrower.annualRevenue.toLocaleString()}` 
                          : 'Not provided'}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground mb-1">Name</div>
                      <div className="font-medium">{application.borrower.firstName} {application.borrower.lastName}</div>
                    </div>
                    
                    <div>
                      <div className="text-muted-foreground mb-1">SSN</div>
                      <div className="font-medium">{application.borrower.ssn || 'Not provided'}</div>
                    </div>
                    
                    <div>
                      <div className="text-muted-foreground mb-1">Date of Birth</div>
                      <div className="font-medium">
                        {application.borrower.dateOfBirth 
                          ? new Date(application.borrower.dateOfBirth).toLocaleDateString() 
                          : 'Not provided'}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-muted-foreground mb-1">Employment Status</div>
                      <div className="font-medium">{application.borrower.employmentStatus || 'Not specified'}</div>
                    </div>
                    
                    <div>
                      <div className="text-muted-foreground mb-1">Income</div>
                      <div className="font-medium">
                        {application.borrower.income 
                          ? `$${application.borrower.income.toLocaleString()}` 
                          : 'Not provided'}
                      </div>
                    </div>
                  </div>
                )}
                
                <Separator />
                
                <div>
                  <div className="text-muted-foreground mb-2">Contact Information</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground mb-1">Email</div>
                      <div className="font-medium">{application.borrower.email}</div>
                    </div>
                    
                    <div>
                      <div className="text-muted-foreground mb-1">Phone</div>
                      <div className="font-medium">{application.borrower.phone}</div>
                    </div>
                    
                    <div className="md:col-span-2">
                      <div className="text-muted-foreground mb-1">Address</div>
                      <div className="font-medium">
                        {application.borrower.address.street}, {application.borrower.address.city}, {application.borrower.address.state} {application.borrower.address.zipCode}
                      </div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <div className="text-muted-foreground mb-2">Credit Information</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground mb-1">Credit Score</div>
                      <div className="font-medium">{application.borrower.creditScore || 'Not available'}</div>
                    </div>
                    
                    <div>
                      <div className="text-muted-foreground mb-1">Credit Rating</div>
                      <div className="font-medium">{application.borrower.creditRating || 'Not available'}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default PreQualificationAgent;

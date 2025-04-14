
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { 
  Check, Clock, Info, X, ListFilter, CheckCircle, AlertCircle, 
  FileText, User, Building, CreditCard, CalendarClock, ClipboardList
} from "lucide-react";
import { getApplicationsForAgentType } from "@/services/mock/loanApplicationService";
import { LoanApplication } from "@/types";

const ProcessingAgent = () => {
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
        // Get applications for processing agent
        const apps = getApplicationsForAgentType('processing', 50);
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

  const startProcessing = () => {
    setIsProcessing(true);
    setProcessingProgress(0);
    
    // Simulate processing progress
    const interval = setInterval(() => {
      setProcessingProgress(prev => {
        const newProgress = prev + Math.random() * 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          
          // Update application status after processing
          if (application) {
            setApplication(prev => {
              if (!prev) return null;
              return {
                ...prev,
                status: "reviewing",
                displayStatus: "In Review",
                documents: prev.documents.map(doc => ({
                  ...doc,
                  status: Math.random() > 0.2 ? "verified" : "pending",
                  aiAnalysisComplete: true,
                  aiAnalysisSummary: "Document verified with 97% confidence. Information matches application data."
                })),
                notes: [
                  ...prev.notes,
                  {
                    id: Date.now().toString(),
                    content: "Automated processing completed. Documents verified and ready for underwriting review.",
                    createdBy: "Processing Agent",
                    createdAt: new Date().toISOString(),
                    isAgentNote: true
                  }
                ]
              };
            });
            
            toast.success("Processing completed successfully");
          }
          
          return 100;
        }
        return newProgress;
      });
    }, 300);
    
    return () => clearInterval(interval);
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
              <h1 className="text-3xl font-bold tracking-tight">Processing Agent</h1>
              <p className="text-muted-foreground">
                Process and verify application documents and information
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
                        <span className="font-medium">{app.documents.length} to review</span>
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
                        <FileText className="w-4 h-4 mr-2" /> Process Application
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
                  There are currently no applications in the processing queue.
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
            <h1 className="text-3xl font-bold tracking-tight">Processing Agent</h1>
            <p className="text-muted-foreground">
              Process and verify application documents and information
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
              disabled={isProcessing || application.status !== "submitted"}
              onClick={startProcessing}
            >
              <Check className="mr-2 h-4 w-4" />
              Process Documents
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
                  <span>Processing documents...</span>
                  <span>{Math.round(processingProgress)}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div className="bg-primary h-2.5 rounded-full" style={{ width: `${processingProgress}%` }}></div>
                </div>
                <div className="text-xs text-muted-foreground">
                  Extracting data, verifying information, checking for compliance...
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
                    <div className="text-sm text-muted-foreground">Documents</div>
                    <div className="font-medium">
                      {application.documents.length} ({application.documents.filter(d => d.status === "verified").length} verified)
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 text-sm border rounded-md p-3 bg-muted/30">
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Processing time:</span>
                    <span className="ml-1 font-medium">~2 minutes</span>
                  </div>
                  
                  <div className="flex items-center md:ml-auto">
                    <Info className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Completeness score:</span>
                    <span className="ml-1 font-medium">{application.completeness}%</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Application Tabs for Details */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-4 md:w-auto md:inline-flex mb-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="borrower">Borrower</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
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
                    
                    <div className="text-muted-foreground">Last Reviewed:</div>
                    <div className="font-medium">
                      {application.dateReviewed ? new Date(application.dateReviewed).toLocaleDateString() : 'Not reviewed'}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <ClipboardList className="mr-2 h-5 w-5" /> Processing Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">Completeness:</div>
                    <div className="font-medium">{application.completeness}%</div>
                    
                    <div className="text-muted-foreground">Document Status:</div>
                    <div className="font-medium">
                      {application.documents.length > 0 
                        ? `${application.documents.filter(d => d.status === "verified").length} of ${application.documents.length} verified`
                        : 'No documents uploaded'}
                    </div>
                    
                    <div className="text-muted-foreground">Processing Agent:</div>
                    <div className="font-medium">
                      {application.agentAssignments.processingAgentId ? 'Assigned' : 'Not assigned'}
                    </div>
                    
                    <div className="text-muted-foreground">Next Step:</div>
                    <div className="font-medium">
                      {application.status === "reviewing" 
                        ? "Send to Underwriting" 
                        : application.status === "submitted"
                        ? "Process Documents"
                        : "Update Application Status"}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight">Documents</h2>
              <Button variant="outline" size="sm" disabled={isProcessing}>
                <ListFilter className="mr-2 h-4 w-4" />
                Filter
              </Button>
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
                            <CheckCircle className="h-3 w-3" />
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
                      <Button variant="ghost" size="sm" disabled={isProcessing}>View Document</Button>
                      
                      {doc.status === "pending" && (
                        <div className="ml-auto flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-green-600" 
                            disabled={isProcessing}
                          >
                            <Check className="mr-1 h-3 w-3" />
                            Verify
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-red-600" 
                            disabled={isProcessing}
                          >
                            <X className="mr-1 h-3 w-3" />
                            Reject
                          </Button>
                        </div>
                      )}
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
          
          {/* Notes Tab */}
          <TabsContent value="notes" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight">Application Notes</h2>
              <Button variant="outline" size="sm" disabled={isProcessing}>
                <Check className="mr-2 h-4 w-4" />
                Add Note
              </Button>
            </div>
            
            {application.notes.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="py-8 text-center">
                  <AlertCircle className="mx-auto h-8 w-8 text-muted-foreground" />
                  <h3 className="mt-2 text-lg font-semibold">No Notes</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    There are no notes associated with this application yet.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {application.notes.map((note) => (
                  <Card key={note.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center justify-between">
                        <span className="flex items-center">
                          {note.isAgentNote ? (
                            <Badge variant="outline" className="mr-2">Agent</Badge>
                          ) : (
                            <Badge variant="secondary" className="mr-2">System</Badge>
                          )}
                          <span>{note.createdBy}</span>
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {new Date(note.createdAt).toLocaleString()}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent>
                      <p className="text-sm">{note.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default ProcessingAgent;

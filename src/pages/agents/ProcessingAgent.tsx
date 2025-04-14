
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Check, Clock, Info, X, ListFilter, CheckCircle, AlertCircle, FileText } from "lucide-react";
import { getMockLoanApplications } from "@/services/mockDataService";
import { LoanApplication } from "@/types";

const ProcessingAgent = () => {
  const [searchParams] = useSearchParams();
  const applicationId = searchParams.get("applicationId");
  const [application, setApplication] = useState<LoanApplication | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [activeTab, setActiveTab] = useState("documents");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // If applicationId is provided, fetch that specific application
        if (applicationId) {
          const allApplications = getMockLoanApplications(50);
          const app = allApplications.find(a => a.id === applicationId);
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

  // If no application is provided, show a placeholder
  if (!application) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Processing Agent</h1>
              <p className="text-muted-foreground">
                Process and verify application documents
              </p>
            </div>
          </div>
          
          <Card className="border-dashed border-muted">
            <CardContent className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Application Selected</h3>
              <p className="text-muted-foreground max-w-md mb-4">
                Please select an application from the Applications dashboard to process its documents.
              </p>
              <Button onClick={() => window.location.href = "/applications"}>
                Browse Applications
              </Button>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Processing Agent</h1>
            <p className="text-muted-foreground">
              Process and verify application documents
            </p>
          </div>
          
          <div className="flex items-center gap-2">
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
        
        {/* Documents Section */}
        <div className="space-y-4">
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
        </div>
      </div>
    </MainLayout>
  );
};

export default ProcessingAgent;

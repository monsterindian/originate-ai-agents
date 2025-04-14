import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Shield, AlertTriangle, CheckCircle, Users, Filter, Eye, ShieldAlert, ShieldCheck, ShieldX } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { getApplicationsForAgentType } from "@/services/mockDataService";
import { LoanApplication } from "@/types";
import AgentStatusIndicator from "@/components/agents/AgentStatusIndicator";
import OpenAIStatusIndicator from "@/components/agents/OpenAIStatusIndicator";

// Type for the fraud risk detail
type FraudRiskDetail = {
  identityVerificationScore: number;
  suspiciousActivity: boolean;
  documentVerification: 'Verified' | 'Pending' | 'Failed';
  riskFactors: string[];
};

const FraudRiskAgent = () => {
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [riskFilter, setRiskFilter] = useState<string>("all");
  const [selectedApplication, setSelectedApplication] = useState<LoanApplication | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [scanningProgress, setScanningProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Get applications for fraud risk analysis
        const apps = getApplicationsForAgentType("fraud-risk", 150);
        setApplications(apps);
      } catch (error) {
        console.error("Failed to fetch applications:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filterApplications = () => {
    let filtered = [...applications];
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(app => app.status === statusFilter);
    }
    
    if (riskFilter !== "all") {
      filtered = filtered.filter(app => app.risk === riskFilter);
    }
    
    return filtered;
  };

  const handleScanForFraudRisk = (application: LoanApplication) => {
    setSelectedApplication(application);
    setIsScanning(true);
    setScanningProgress(0);
    
    // Simulate scanning progress
    const interval = setInterval(() => {
      setScanningProgress(prev => {
        const newProgress = prev + Math.random() * 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          
          setTimeout(() => {
            // Update the risk level based on the scan
            const updatedApplications = applications.map(app => {
              if (app.id === application.id) {
                const newRisk = Math.random() < 0.7 ? "Low" : Math.random() < 0.5 ? "Medium" : "High";
                return { ...app, risk: newRisk };
              }
              return app;
            });
            
            setApplications(updatedApplications);
            toast.success(`Fraud risk scan completed for ${application.id}`);
            setShowDetailsDialog(true);
          }, 500);
          
          return 100;
        }
        return newProgress;
      });
    }, 200);
    
    return () => clearInterval(interval);
  };

  const getRiskBadge = (risk: string | undefined) => {
    if (!risk) return <Badge variant="outline">Unknown</Badge>;
    
    switch (risk) {
      case "Low":
        return <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">Low Risk</Badge>;
      case "Medium":
        return <Badge variant="warning">Medium Risk</Badge>;
      case "High":
        return <Badge variant="destructive">High Risk</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getRiskIcon = (risk: string | undefined) => {
    if (!risk) return <Shield className="h-5 w-5" />;
    
    switch (risk) {
      case "Low":
        return <ShieldCheck className="h-5 w-5 text-green-500" />;
      case "Medium":
        return <ShieldAlert className="h-5 w-5 text-amber-500" />;
      case "High":
        return <ShieldX className="h-5 w-5 text-red-500" />;
      default:
        return <Shield className="h-5 w-5" />;
    }
  };

  // Mock function to get fraud risk details
  const getFraudRiskDetails = (application: LoanApplication): FraudRiskDetail => {
    // Check if we already have fraud risk indicators added from the mock service
    if (application.fraudRiskIndicators) {
      return application.fraudRiskIndicators as FraudRiskDetail;
    }
    
    // Otherwise generate mock data
    return {
      identityVerificationScore: Math.floor(Math.random() * 100),
      suspiciousActivity: Math.random() > 0.7,
      documentVerification: Math.random() > 0.7 ? 'Verified' : Math.random() > 0.5 ? 'Pending' : 'Failed',
      riskFactors: Array.from({ length: Math.floor(Math.random() * 4) }, () => 
        ['Multiple applications', 'Address mismatch', 'Credit bureau alerts', 'Unusual transaction pattern', 'Device risk'][Math.floor(Math.random() * 5)]
      )
    };
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em]" />
            <p className="mt-4 text-lg">Loading applications for fraud risk analysis...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Fraud Risk Agent</h1>
            <p className="text-muted-foreground">
              Analyze applications for potential fraud indicators
            </p>
          </div>
          <div className="flex items-center gap-3">
            <AgentStatusIndicator active={true} type="security" />
            <OpenAIStatusIndicator status="connected" />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="statistics flex flex-wrap gap-4">
            <Card className="w-[140px]">
              <CardHeader className="py-3">
                <CardTitle className="text-sm font-medium">Total</CardTitle>
              </CardHeader>
              <CardContent className="py-0">
                <p className="text-2xl font-bold">{applications.length}</p>
              </CardContent>
            </Card>
            <Card className="w-[140px]">
              <CardHeader className="py-3">
                <CardTitle className="text-sm font-medium">Low Risk</CardTitle>
              </CardHeader>
              <CardContent className="py-0">
                <p className="text-2xl font-bold text-green-600">
                  {applications.filter(app => app.risk === "Low").length}
                </p>
              </CardContent>
            </Card>
            <Card className="w-[140px]">
              <CardHeader className="py-3">
                <CardTitle className="text-sm font-medium">Medium Risk</CardTitle>
              </CardHeader>
              <CardContent className="py-0">
                <p className="text-2xl font-bold text-amber-600">
                  {applications.filter(app => app.risk === "Medium").length}
                </p>
              </CardContent>
            </Card>
            <Card className="w-[140px]">
              <CardHeader className="py-3">
                <CardTitle className="text-sm font-medium">High Risk</CardTitle>
              </CardHeader>
              <CardContent className="py-0">
                <p className="text-2xl font-bold text-red-600">
                  {applications.filter(app => app.risk === "High").length}
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex items-center space-x-2">
            <Select value={riskFilter} onValueChange={setRiskFilter}>
              <SelectTrigger className="w-[140px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Risk Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Risk Level</SelectLabel>
                  <SelectItem value="all">All Risks</SelectItem>
                  <SelectItem value="Low">Low Risk</SelectItem>
                  <SelectItem value="Medium">Medium Risk</SelectItem>
                  <SelectItem value="High">High Risk</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Application Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Status</SelectLabel>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="reviewing">In Review</SelectItem>
                  <SelectItem value="underwriting">In Underwriting</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Applications Pending Fraud Risk Assessment</CardTitle>
            <CardDescription>
              Review applications for potential fraud indicators and risk factors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Application ID</TableHead>
                  <TableHead>Borrower</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filterApplications().slice(0, 10).map((application) => (
                  <TableRow key={application.id}>
                    <TableCell className="font-medium">{application.id}</TableCell>
                    <TableCell>
                      {application.borrower.companyName || 
                        `${application.borrower.firstName} ${application.borrower.lastName}`}
                    </TableCell>
                    <TableCell>${application.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{application.status.replace(/_/g, ' ')}</Badge>
                    </TableCell>
                    <TableCell>{getRiskBadge(application.risk)}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleScanForFraudRisk(application)}
                      >
                        <Eye className="mr-1 h-4 w-4" /> Scan
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filterApplications().slice(10, 19).map((application) => (
            <Card key={application.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base">{application.id}</CardTitle>
                    <CardDescription className="line-clamp-1">
                      {application.borrower.companyName || 
                        `${application.borrower.firstName} ${application.borrower.lastName}`}
                    </CardDescription>
                  </div>
                  {getRiskIcon(application.risk)}
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount:</span>
                    <span>${application.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Purpose:</span>
                    <span className="line-clamp-1 max-w-[180px] text-right">{application.purpose}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Credit Score:</span>
                    <span>{application.borrower.creditScore}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Risk Level:</span>
                    {getRiskBadge(application.risk)}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  size="sm"
                  onClick={() => handleScanForFraudRisk(application)}
                >
                  <Eye className="mr-1 h-4 w-4" /> 
                  Scan for Fraud Risk
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Application Scan Dialog */}
      <Dialog open={isScanning || showDetailsDialog} onOpenChange={(open) => {
        if (!isScanning) setShowDetailsDialog(open);
      }}>
        <DialogContent className="max-w-3xl">
          {selectedApplication && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span>Fraud Risk Analysis: {selectedApplication.id}</span>
                  {!isScanning && getRiskBadge(selectedApplication.risk)}
                </DialogTitle>
                <DialogDescription>
                  {isScanning 
                    ? "Analyzing application for potential fraud indicators..."
                    : "Detailed fraud risk assessment results"
                  }
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                {isScanning ? (
                  <div className="space-y-4">
                    <Progress value={scanningProgress} className="h-2" />
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-medium">Current scan: </span>
                        {scanningProgress < 30 ? "Identity verification" : 
                         scanningProgress < 60 ? "Document validation" : 
                         scanningProgress < 85 ? "Transaction pattern analysis" : 
                         "Cross-referencing external databases"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Analyzing data points and risk signals across multiple systems...
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Fraud Risk Summary */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Risk Assessment Summary</h3>
                      <div className={`p-4 rounded-md ${
                        selectedApplication.risk === "Low" 
                          ? "bg-green-50 border border-green-100" 
                          : selectedApplication.risk === "Medium"
                          ? "bg-amber-50 border border-amber-100"
                          : "bg-red-50 border border-red-100"
                      }`}>
                        <div className="flex items-start gap-3">
                          {selectedApplication.risk === "Low" ? (
                            <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                          ) : selectedApplication.risk === "Medium" ? (
                            <AlertTriangle className="h-6 w-6 text-amber-500 flex-shrink-0 mt-1" />
                          ) : (
                            <ShieldAlert className="h-6 w-6 text-red-500 flex-shrink-0 mt-1" />
                          )}
                          <div>
                            <p className="font-medium mb-1">
                              {selectedApplication.risk === "Low" 
                                ? "Low risk of fraud detected" 
                                : selectedApplication.risk === "Medium"
                                ? "Some suspicious patterns detected" 
                                : "High probability of fraudulent activity"
                              }
                            </p>
                            <p className="text-sm">
                              {selectedApplication.risk === "Low" 
                                ? "This application has passed all major fraud detection checks with minor or no concerns." 
                                : selectedApplication.risk === "Medium"
                                ? "This application shows some irregular patterns that warrant additional verification." 
                                : "Multiple high-risk indicators suggest this application requires immediate investigation."
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Identity Verification */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Identity Verification</h3>
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium">Verification Score</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Progress 
                                  value={getFraudRiskDetails(selectedApplication).identityVerificationScore} 
                                  className="h-2 w-40" 
                                />
                                <span>{getFraudRiskDetails(selectedApplication).identityVerificationScore}/100</span>
                              </div>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Document Verification</TableCell>
                            <TableCell>
                              <Badge variant={
                                getFraudRiskDetails(selectedApplication).documentVerification === 'Verified'
                                  ? "outline" 
                                  : getFraudRiskDetails(selectedApplication).documentVerification === 'Pending'
                                  ? "secondary"
                                  : "destructive"  
                              }>
                                {getFraudRiskDetails(selectedApplication).documentVerification}
                              </Badge>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Suspicious Activity</TableCell>
                            <TableCell>
                              {getFraudRiskDetails(selectedApplication).suspiciousActivity 
                                ? <Badge variant="destructive">Detected</Badge>
                                : <Badge variant="outline" className="bg-green-50 text-green-700">None Detected</Badge>
                              }
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>

                    {/* Risk Factors */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Risk Factors</h3>
                      {getFraudRiskDetails(selectedApplication).riskFactors.length > 0 ? (
                        <ul className="space-y-2">
                          {getFraudRiskDetails(selectedApplication).riskFactors.map((factor, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                              <span>{factor}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-muted-foreground">No significant risk factors detected</p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-4">
                      <Button 
                        variant="outline" 
                        onClick={() => setShowDetailsDialog(false)}
                      >
                        Close
                      </Button>
                      <Button 
                        variant={selectedApplication.risk === "High" ? "destructive" : "default"}
                        onClick={() => {
                          toast.success(`Fraud risk report for ${selectedApplication.id} has been sent to the review team.`);
                          setShowDetailsDialog(false);
                        }}
                      >
                        {selectedApplication.risk === "High" 
                          ? "Flag for Investigation" 
                          : selectedApplication.risk === "Medium"
                          ? "Request Additional Verification" 
                          : "Approve Risk Assessment"
                        }
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default FraudRiskAgent;

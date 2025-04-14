
import { useState, useEffect } from "react";
import { Users, FileText, FileCheck, Clock, CheckCircle, XCircle, Filter } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { getApplicationsForAgentType } from "@/services/mock/loanApplicationService";
import { LoanApplication } from "@/types";

const DecisionAgent = () => {
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedApplication, setSelectedApplication] = useState<LoanApplication | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Get applications that are in the decision stage
        const relevantApplications = getApplicationsForAgentType("decision", 50);
        
        setApplications(relevantApplications);
      } catch (error) {
        console.error("Failed to fetch applications:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filterApplications = () => {
    if (statusFilter === "all") {
      return applications;
    }
    return applications.filter(app => app.status === statusFilter);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "underwriting":
        return <Badge variant="outline">In Underwriting</Badge>;
      case "approved":
        return <Badge variant="success">Approved</Badge>;
      case "conditionally_approved":
        return <Badge variant="warning">Conditionally Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleViewDetails = (application: LoanApplication) => {
    setSelectedApplication(application);
    setShowDetailsDialog(true);
  };

  const handleApproveApplication = (application: LoanApplication) => {
    toast.success(`Application ${application.id} has been approved`);
    // Update the application status in the local state
    setApplications(prevApplications => 
      prevApplications.map(app => 
        app.id === application.id ? { ...app, status: "approved" } : app
      )
    );
    // Close the dialog if it's open
    if (showDetailsDialog) {
      setShowDetailsDialog(false);
    }
  };

  const handleConditionalApproval = (application: LoanApplication) => {
    toast.success(`Application ${application.id} has been conditionally approved`);
    // Update the application status in the local state
    setApplications(prevApplications => 
      prevApplications.map(app => 
        app.id === application.id ? { ...app, status: "conditionally_approved" } : app
      )
    );
    // Close the dialog if it's open
    if (showDetailsDialog) {
      setShowDetailsDialog(false);
    }
  };

  const handleRejectApplication = (application: LoanApplication) => {
    toast.error(`Application ${application.id} has been rejected`);
    // Update the application status in the local state
    setApplications(prevApplications => 
      prevApplications.map(app => 
        app.id === application.id ? { ...app, status: "rejected" } : app
      )
    );
    // Close the dialog if it's open
    if (showDetailsDialog) {
      setShowDetailsDialog(false);
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateDebtServiceCoverageRatio = (app: LoanApplication): number => {
    // Simple DSCR calculation - this would be more sophisticated in a real app
    const monthlyPayment = (app.amount * (app.interestRate || 5) / 100) / 12 + (app.amount / app.term);
    const monthlyIncome = app.borrower.companyName 
      ? (app.borrower.annualRevenue || 0) / 12 
      : (app.borrower.income || 0) / 12;
    
    return monthlyIncome > 0 ? monthlyIncome / monthlyPayment : 0;
  };

  const getDSCRRating = (dscr: number): { text: string; color: string } => {
    if (dscr >= 1.5) return { text: "Strong", color: "text-green-600" };
    if (dscr >= 1.2) return { text: "Satisfactory", color: "text-blue-600" };
    if (dscr >= 1.0) return { text: "Adequate", color: "text-amber-600" };
    return { text: "Weak", color: "text-red-600" };
  };

  const calculateLoanToValueRatio = (app: LoanApplication): number => {
    if (!app.collateral || !app.collateral.value || app.collateral.value === 0) return 100;
    return (app.amount / app.collateral.value) * 100;
  };

  const getLTVRating = (ltv: number): { text: string; color: string } => {
    if (ltv <= 50) return { text: "Excellent", color: "text-green-600" };
    if (ltv <= 70) return { text: "Good", color: "text-blue-600" };
    if (ltv <= 80) return { text: "Fair", color: "text-amber-600" };
    return { text: "High Risk", color: "text-red-600" };
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em]" />
            <p className="mt-4 text-lg">Loading applications...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Decision Agent</h1>
            <p className="text-muted-foreground">
              Review applications, make final credit decisions, and set terms
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Status</SelectLabel>
                  <SelectItem value="all">All Applications</SelectItem>
                  <SelectItem value="underwriting">In Underwriting</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="conditionally_approved">Conditionally Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filterApplications().length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">No Applications Found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                No applications match your current filter criteria.
              </p>
              <Button variant="outline" className="mt-4" onClick={() => setStatusFilter("all")}>
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filterApplications().map((application) => (
              <Card key={application.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between">
                    <span className="truncate">{application.id}</span>
                    {getStatusBadge(application.status)}
                  </CardTitle>
                  <CardDescription>
                    {application.borrower.companyName || `${application.borrower.firstName} ${application.borrower.lastName}`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Loan Amount</span>
                      <span className="font-medium">${application.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Purpose</span>
                      <span className="truncate max-w-[150px]">{application.purpose}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Term</span>
                      <span>{application.term} months</span>
                    </div>
                    {application.risk && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Risk Level</span>
                        <Badge
                          variant={
                            application.risk === "Low" ? "outline" :
                            application.risk === "Medium" ? "warning" :
                            "destructive"
                          }
                        >
                          {application.risk}
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-2">
                  <Button variant="ghost" size="sm" onClick={() => handleViewDetails(application)}>
                    View Details
                  </Button>
                  {application.status === "underwriting" && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700" onClick={() => handleApproveApplication(application)}>
                        <CheckCircle className="mr-1 h-4 w-4" />
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700" onClick={() => handleRejectApplication(application)}>
                        <XCircle className="mr-1 h-4 w-4" />
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

      {/* Enhanced Application Detail Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedApplication && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span>Application {selectedApplication.id}</span>
                  {getStatusBadge(selectedApplication.status)}
                </DialogTitle>
                <DialogDescription>
                  Detailed information for decision-making
                </DialogDescription>
              </DialogHeader>
              
              <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-6">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="financials">Financials</TabsTrigger>
                  <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                  <TabsTrigger value="borrower">Borrower</TabsTrigger>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Application Summary</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <div className="text-sm text-muted-foreground">Borrower:</div>
                            <div className="font-medium">
                              {selectedApplication.borrower.companyName || 
                                `${selectedApplication.borrower.firstName} ${selectedApplication.borrower.lastName}`}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Application ID:</div>
                            <div className="font-medium">{selectedApplication.id}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Date Submitted:</div>
                            <div className="font-medium">{formatDate(selectedApplication.dateSubmitted)}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Completeness:</div>
                            <div className="flex items-center space-x-2">
                              <Progress value={selectedApplication.completeness} className="h-2 flex-1" />
                              <span className="text-sm font-medium">{selectedApplication.completeness}%</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="text-sm text-muted-foreground mb-1">Product Type:</div>
                          <div className="font-medium">
                            {selectedApplication.assetClass.replace(/_/g, ' ')}
                          </div>
                        </div>

                        <div>
                          <div className="text-sm text-muted-foreground mb-1">Loan Purpose:</div>
                          <div className="font-medium">{selectedApplication.purpose}</div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Loan Request</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <div className="text-sm text-muted-foreground">Amount:</div>
                            <div className="font-medium text-lg">{formatCurrency(selectedApplication.amount)}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Term:</div>
                            <div className="font-medium">{selectedApplication.term} months</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Interest Rate:</div>
                            <div className="font-medium">{selectedApplication.interestRate}%</div>
                          </div>
                          {selectedApplication.collateral && (
                            <div>
                              <div className="text-sm text-muted-foreground">Collateral Value:</div>
                              <div className="font-medium">{formatCurrency(selectedApplication.collateral.value)}</div>
                            </div>
                          )}
                        </div>

                        {selectedApplication.collateral && (
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">Collateral:</div>
                            <div className="font-medium">{selectedApplication.collateral.type}</div>
                            <div className="text-sm text-muted-foreground mt-1">{selectedApplication.collateral.description}</div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Key Decision Metrics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <div className="text-sm text-muted-foreground">Risk Rating</div>
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant={
                                selectedApplication.risk === "Low" ? "outline" :
                                selectedApplication.risk === "Medium" ? "warning" :
                                "destructive"
                              }
                              className="text-lg px-3 py-1"
                            >
                              {selectedApplication.risk} Risk
                            </Badge>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="text-sm text-muted-foreground">Debt Service Coverage</div>
                          {(() => {
                            const dscr = calculateDebtServiceCoverageRatio(selectedApplication);
                            const rating = getDSCRRating(dscr);
                            return (
                              <div className="space-y-1">
                                <div className="font-medium text-lg">{dscr.toFixed(2)}x</div>
                                <div className={`text-sm ${rating.color}`}>{rating.text}</div>
                              </div>
                            );
                          })()}
                        </div>

                        <div className="space-y-2">
                          <div className="text-sm text-muted-foreground">Loan-to-Value Ratio</div>
                          {(() => {
                            const ltv = calculateLoanToValueRatio(selectedApplication);
                            const rating = getLTVRating(ltv);
                            return (
                              <div className="space-y-1">
                                <div className="font-medium text-lg">{ltv.toFixed(0)}%</div>
                                <div className={`text-sm ${rating.color}`}>{rating.text}</div>
                              </div>
                            );
                          })()}
                        </div>
                      </div>

                      <Separator />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm font-medium mb-2">Credit Analysis</div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Credit Score:</span>
                              <span className="font-medium">{selectedApplication.borrower.creditScore || "N/A"}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Credit Rating:</span>
                              <span className="font-medium">{selectedApplication.borrower.creditRating || "N/A"}</span>
                            </div>
                            {selectedApplication.borrower.companyName && (
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Years in Business:</span>
                                <span className="font-medium">{selectedApplication.borrower.yearsInBusiness || "N/A"}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <div className="text-sm font-medium mb-2">Financial Health</div>
                          <div className="space-y-2">
                            {selectedApplication.borrower.companyName ? (
                              <>
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Annual Revenue:</span>
                                  <span className="font-medium">{formatCurrency(selectedApplication.borrower.annualRevenue || 0)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Industry:</span>
                                  <span className="font-medium">{selectedApplication.borrower.industry || "N/A"}</span>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Annual Income:</span>
                                  <span className="font-medium">{formatCurrency(selectedApplication.borrower.income || 0)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Employment:</span>
                                  <span className="font-medium">
                                    {selectedApplication.borrower.employmentInfo?.employer || "N/A"}
                                  </span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Decision Actions */}
                  {selectedApplication.status === "underwriting" && (
                    <div className="flex justify-end gap-3 pt-4">
                      <Button 
                        variant="outline" 
                        className="text-red-600 hover:text-red-700 hover:bg-red-50" 
                        onClick={() => handleRejectApplication(selectedApplication)}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject Application
                      </Button>
                      <Button 
                        variant="outline"
                        className="text-amber-600 hover:text-amber-700"
                        onClick={() => handleConditionalApproval(selectedApplication)}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Conditionally Approve
                      </Button>
                      <Button 
                        variant="default"
                        onClick={() => handleApproveApplication(selectedApplication)}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Approve Application
                      </Button>
                    </div>
                  )}
                </TabsContent>

                {/* Financials Tab */}
                <TabsContent value="financials" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Financial Analysis</CardTitle>
                      <CardDescription>Detailed financial assessment for decision-making</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h3 className="text-base font-medium mb-3">Debt Service Coverage Analysis</h3>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Item</TableHead>
                              <TableHead className="text-right">Monthly Amount</TableHead>
                              <TableHead className="text-right">Annual Amount</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selectedApplication.borrower.companyName ? (
                              // Business loans
                              <>
                                <TableRow>
                                  <TableCell className="font-medium">Annual Revenue</TableCell>
                                  <TableCell className="text-right">
                                    {formatCurrency((selectedApplication.borrower.annualRevenue || 0) / 12)}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    {formatCurrency(selectedApplication.borrower.annualRevenue || 0)}
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="font-medium">Estimated EBITDA (30%)</TableCell>
                                  <TableCell className="text-right">
                                    {formatCurrency(((selectedApplication.borrower.annualRevenue || 0) * 0.3) / 12)}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    {formatCurrency((selectedApplication.borrower.annualRevenue || 0) * 0.3)}
                                  </TableCell>
                                </TableRow>
                              </>
                            ) : (
                              // Individual loans
                              <TableRow>
                                <TableCell className="font-medium">Annual Income</TableCell>
                                <TableCell className="text-right">
                                  {formatCurrency((selectedApplication.borrower.income || 0) / 12)}
                                </TableCell>
                                <TableCell className="text-right">
                                  {formatCurrency(selectedApplication.borrower.income || 0)}
                                </TableCell>
                              </TableRow>
                            )}
                            
                            <TableRow>
                              <TableCell className="font-medium">Proposed Loan Payment</TableCell>
                              <TableCell className="text-right">
                                {formatCurrency(
                                  (selectedApplication.amount * ((selectedApplication.interestRate || 5) / 100)) / 12 + 
                                  (selectedApplication.amount / selectedApplication.term)
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                {formatCurrency(
                                  ((selectedApplication.amount * ((selectedApplication.interestRate || 5) / 100)) / 12 + 
                                  (selectedApplication.amount / selectedApplication.term)) * 12
                                )}
                              </TableCell>
                            </TableRow>
                            
                            <TableRow className="font-medium bg-muted">
                              <TableCell>Debt Service Coverage Ratio</TableCell>
                              <TableCell className="text-right" colSpan={2}>
                                {calculateDebtServiceCoverageRatio(selectedApplication).toFixed(2)}x
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>

                      <div>
                        <h3 className="text-base font-medium mb-3">Loan-to-Value Analysis</h3>
                        <Table>
                          <TableBody>
                            <TableRow>
                              <TableCell className="font-medium">Loan Amount</TableCell>
                              <TableCell className="text-right">
                                {formatCurrency(selectedApplication.amount)}
                              </TableCell>
                            </TableRow>
                            {selectedApplication.collateral && (
                              <TableRow>
                                <TableCell className="font-medium">Collateral Value</TableCell>
                                <TableCell className="text-right">
                                  {formatCurrency(selectedApplication.collateral.value)}
                                </TableCell>
                              </TableRow>
                            )}
                            <TableRow className="font-medium bg-muted">
                              <TableCell>Loan-to-Value Ratio</TableCell>
                              <TableCell className="text-right">
                                {calculateLoanToValueRatio(selectedApplication).toFixed(0)}%
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>

                      <div>
                        <h3 className="text-base font-medium mb-3">Proposed Loan Terms</h3>
                        <Table>
                          <TableBody>
                            <TableRow>
                              <TableCell className="font-medium">Principal Amount</TableCell>
                              <TableCell className="text-right">
                                {formatCurrency(selectedApplication.amount)}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Interest Rate</TableCell>
                              <TableCell className="text-right">
                                {selectedApplication.interestRate}%
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Term</TableCell>
                              <TableCell className="text-right">
                                {selectedApplication.term} months
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Estimated Monthly Payment</TableCell>
                              <TableCell className="text-right">
                                {formatCurrency(
                                  (selectedApplication.amount * ((selectedApplication.interestRate || 5) / 100)) / 12 + 
                                  (selectedApplication.amount / selectedApplication.term)
                                )}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Total Payments</TableCell>
                              <TableCell className="text-right">
                                {formatCurrency(
                                  (((selectedApplication.amount * ((selectedApplication.interestRate || 5) / 100)) / 12 + 
                                  (selectedApplication.amount / selectedApplication.term)) * 
                                  selectedApplication.term)
                                )}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Total Interest</TableCell>
                              <TableCell className="text-right">
                                {formatCurrency(
                                  (((selectedApplication.amount * ((selectedApplication.interestRate || 5) / 100)) / 12 + 
                                  (selectedApplication.amount / selectedApplication.term)) * 
                                  selectedApplication.term) - selectedApplication.amount
                                )}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Risk Analysis Tab */}
                <TabsContent value="risk" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Risk Assessment</CardTitle>
                      <CardDescription>Comprehensive risk analysis for this application</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="space-y-1">
                          <div className="text-lg font-medium">Overall Risk Rating</div>
                          <div className="text-sm text-muted-foreground">Composite evaluation based on multiple factors</div>
                        </div>
                        <Badge
                          variant={
                            selectedApplication.risk === "Low" ? "outline" :
                            selectedApplication.risk === "Medium" ? "warning" :
                            "destructive"
                          }
                          className="text-lg px-4 py-1"
                        >
                          {selectedApplication.risk} Risk
                        </Badge>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="text-base font-medium mb-3">Credit Risk Factors</h3>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Risk Factor</TableHead>
                              <TableHead>Evaluation</TableHead>
                              <TableHead>Risk Level</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell className="font-medium">Credit History</TableCell>
                              <TableCell>
                                Credit Score: {selectedApplication.borrower.creditScore || "N/A"}
                                {selectedApplication.borrower.creditRating && (
                                  <span> ({selectedApplication.borrower.creditRating})</span>
                                )}
                              </TableCell>
                              <TableCell>
                                <Badge variant={
                                  !selectedApplication.borrower.creditScore ? "outline" :
                                  selectedApplication.borrower.creditScore >= 700 ? "outline" :
                                  selectedApplication.borrower.creditScore >= 640 ? "warning" :
                                  "destructive"
                                }>
                                  {!selectedApplication.borrower.creditScore ? "Unknown" :
                                   selectedApplication.borrower.creditScore >= 700 ? "Low" :
                                   selectedApplication.borrower.creditScore >= 640 ? "Medium" :
                                   "High"}
                                </Badge>
                              </TableCell>
                            </TableRow>
                            
                            <TableRow>
                              <TableCell className="font-medium">Repayment Capacity</TableCell>
                              <TableCell>
                                DSCR: {calculateDebtServiceCoverageRatio(selectedApplication).toFixed(2)}x
                              </TableCell>
                              <TableCell>
                                {(() => {
                                  const dscr = calculateDebtServiceCoverageRatio(selectedApplication);
                                  return (
                                    <Badge variant={
                                      dscr >= 1.5 ? "outline" :
                                      dscr >= 1.2 ? "default" :
                                      dscr >= 1.0 ? "warning" :
                                      "destructive"
                                    }>
                                      {dscr >= 1.5 ? "Low" :
                                       dscr >= 1.2 ? "Low-Medium" :
                                       dscr >= 1.0 ? "Medium" :
                                       "High"}
                                    </Badge>
                                  );
                                })()}
                              </TableCell>
                            </TableRow>
                            
                            <TableRow>
                              <TableCell className="font-medium">Collateral</TableCell>
                              <TableCell>
                                LTV: {calculateLoanToValueRatio(selectedApplication).toFixed(0)}%
                              </TableCell>
                              <TableCell>
                                {(() => {
                                  const ltv = calculateLoanToValueRatio(selectedApplication);
                                  return (
                                    <Badge variant={
                                      ltv <= 50 ? "outline" :
                                      ltv <= 70 ? "default" :
                                      ltv <= 80 ? "warning" :
                                      "destructive"
                                    }>
                                      {ltv <= 50 ? "Low" :
                                       ltv <= 70 ? "Low-Medium" :
                                       ltv <= 80 ? "Medium" :
                                       "High"}
                                    </Badge>
                                  );
                                })()}
                              </TableCell>
                            </TableRow>
                            
                            {selectedApplication.borrower.companyName && (
                              <TableRow>
                                <TableCell className="font-medium">Business Stability</TableCell>
                                <TableCell>
                                  {selectedApplication.borrower.yearsInBusiness || "Unknown"} years in business
                                </TableCell>
                                <TableCell>
                                  <Badge variant={
                                    !selectedApplication.borrower.yearsInBusiness ? "warning" :
                                    selectedApplication.borrower.yearsInBusiness >= 5 ? "outline" :
                                    selectedApplication.borrower.yearsInBusiness >= 2 ? "warning" :
                                    "destructive"
                                  }>
                                    {!selectedApplication.borrower.yearsInBusiness ? "Unknown" :
                                     selectedApplication.borrower.yearsInBusiness >= 5 ? "Low" :
                                     selectedApplication.borrower.yearsInBusiness >= 2 ? "Medium" :
                                     "High"}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            )}
                            
                            {selectedApplication.fraudRiskScore !== undefined && (
                              <TableRow>
                                <TableCell className="font-medium">Fraud Risk</TableCell>
                                <TableCell>
                                  Fraud Score: {selectedApplication.fraudRiskScore}
                                </TableCell>
                                <TableCell>
                                  <Badge variant={
                                    selectedApplication.fraudRiskScore >= 80 ? "destructive" :
                                    selectedApplication.fraudRiskScore >= 50 ? "warning" :
                                    "outline"
                                  }>
                                    {selectedApplication.fraudRiskScore >= 80 ? "High" :
                                     selectedApplication.fraudRiskScore >= 50 ? "Medium" :
                                     "Low"}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>

                      {selectedApplication.riskFactors && selectedApplication.riskFactors.length > 0 && (
                        <div>
                          <h3 className="text-base font-medium mb-2">Risk Factors</h3>
                          <div className="space-y-2">
                            {selectedApplication.riskFactors.map((factor, index) => (
                              <div key={index} className="p-2 bg-muted rounded-md">
                                <div className="text-sm">{factor}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <h3 className="text-base font-medium mb-2">Policy Compliance</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Maximum LTV (80%)</span>
                            <Badge variant={calculateLoanToValueRatio(selectedApplication) <= 80 ? "success" : "destructive"}>
                              {calculateLoanToValueRatio(selectedApplication) <= 80 ? "Compliant" : "Exception Required"}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Minimum DSCR (1.2x)</span>
                            <Badge variant={calculateDebtServiceCoverageRatio(selectedApplication) >= 1.2 ? "success" : "destructive"}>
                              {calculateDebtServiceCoverageRatio(selectedApplication) >= 1.2 ? "Compliant" : "Exception Required"}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Maximum Loan Term (60 months)</span>
                            <Badge variant={selectedApplication.term <= 60 ? "success" : "destructive"}>
                              {selectedApplication.term <= 60 ? "Compliant" : "Exception Required"}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Minimum Credit Score (640)</span>
                            <Badge variant={
                              !selectedApplication.borrower.creditScore ? "warning" :
                              selectedApplication.borrower.creditScore >= 640 ? "success" : "destructive"
                            }>
                              {!selectedApplication.borrower.creditScore ? "Unable to Verify" :
                               selectedApplication.borrower.creditScore >= 640 ? "Compliant" : "Exception Required"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Documents Tab */}
                <TabsContent value="documents" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Application Documents</CardTitle>
                      <CardDescription>Review and verify supporting documentation</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {selectedApplication.documents && selectedApplication.documents.length > 0 ? (
                        <div className="space-y-4">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Document</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Uploaded</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {selectedApplication.documents.map((doc) => (
                                <TableRow key={doc.id}>
                                  <TableCell className="font-medium">{doc.name}</TableCell>
                                  <TableCell>{doc.type}</TableCell>
                                  <TableCell>
                                    <Badge variant={
                                      doc.status === "verified" ? "success" :
                                      doc.status === "rejected" ? "destructive" :
                                      "warning"
                                    }>
                                      {doc.status === "verified" ? "Verified" :
                                       doc.status === "rejected" ? "Rejected" : "Pending"}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>{formatDate(doc.uploadedAt)}</TableCell>
                                  <TableCell className="text-right">
                                    <Button variant="ghost" size="sm" onClick={() => toast.info(`Viewing document: ${doc.name}`)}>
                                      View
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                          
                          <div>
                            <h3 className="text-base font-medium mb-2">AI Document Analysis</h3>
                            <div className="space-y-2">
                              {selectedApplication.documents
                                .filter(doc => doc.aiAnalysisComplete && doc.aiAnalysisSummary)
                                .map(doc => (
                                  <div key={`analysis-${doc.id}`} className="p-3 bg-muted rounded-md">
                                    <div className="font-medium text-sm mb-1">{doc.type}</div>
                                    <div className="text-sm">{doc.aiAnalysisSummary}</div>
                                  </div>
                                ))}
                              
                              {selectedApplication.documents.filter(doc => doc.aiAnalysisComplete && doc.aiAnalysisSummary).length === 0 && (
                                <div className="text-sm text-muted-foreground italic">
                                  No AI analysis available for these documents.
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          No documents attached to this application.
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Borrower Tab */}
                <TabsContent value="borrower" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Borrower Information</CardTitle>
                      <CardDescription>
                        {selectedApplication.borrower.companyName ? "Business Profile" : "Individual Profile"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-base font-medium mb-3">Basic Information</h3>
                          <Table>
                            <TableBody>
                              {selectedApplication.borrower.companyName ? (
                                <>
                                  <TableRow>
                                    <TableCell className="font-medium">Company Name</TableCell>
                                    <TableCell>{selectedApplication.borrower.companyName}</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell className="font-medium">Industry</TableCell>
                                    <TableCell>{selectedApplication.borrower.industry || "N/A"}</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell className="font-medium">Years in Business</TableCell>
                                    <TableCell>{selectedApplication.borrower.yearsInBusiness || "N/A"}</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell className="font-medium">Annual Revenue</TableCell>
                                    <TableCell>{formatCurrency(selectedApplication.borrower.annualRevenue || 0)}</TableCell>
                                  </TableRow>
                                </>
                              ) : (
                                <>
                                  <TableRow>
                                    <TableCell className="font-medium">Full Name</TableCell>
                                    <TableCell>{`${selectedApplication.borrower.firstName} ${selectedApplication.borrower.lastName}`}</TableCell>
                                  </TableRow>
                                  {selectedApplication.borrower.dateOfBirth && (
                                    <TableRow>
                                      <TableCell className="font-medium">Date of Birth</TableCell>
                                      <TableCell>{formatDate(selectedApplication.borrower.dateOfBirth)}</TableCell>
                                    </TableRow>
                                  )}
                                  {selectedApplication.borrower.employmentInfo && (
                                    <>
                                      <TableRow>
                                        <TableCell className="font-medium">Employer</TableCell>
                                        <TableCell>{selectedApplication.borrower.employmentInfo.employer}</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell className="font-medium">Position</TableCell>
                                        <TableCell>{selectedApplication.borrower.employmentInfo.position}</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell className="font-medium">Employment Start</TableCell>
                                        <TableCell>{formatDate(selectedApplication.borrower.employmentInfo.startDate)}</TableCell>
                                      </TableRow>
                                    </>
                                  )}
                                  {selectedApplication.borrower.income && (
                                    <TableRow>
                                      <TableCell className="font-medium">Annual Income</TableCell>
                                      <TableCell>{formatCurrency(selectedApplication.borrower.income)}</TableCell>
                                    </TableRow>
                                  )}
                                </>
                              )}
                            </TableBody>
                          </Table>
                        </div>
                        
                        <div>
                          <h3 className="text-base font-medium mb-3">Contact & Credit Information</h3>
                          <Table>
                            <TableBody>
                              <TableRow>
                                <TableCell className="font-medium">Email</TableCell>
                                <TableCell>{selectedApplication.borrower.email}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">Phone</TableCell>
                                <TableCell>{selectedApplication.borrower.phone}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">Address</TableCell>
                                <TableCell>
                                  {selectedApplication.borrower.address.street}<br />
                                  {selectedApplication.borrower.address.city}, {selectedApplication.borrower.address.state} {selectedApplication.borrower.address.zipCode}
                                </TableCell>
                              </TableRow>
                              {selectedApplication.borrower.creditScore && (
                                <TableRow>
                                  <TableCell className="font-medium">Credit Score</TableCell>
                                  <TableCell>{selectedApplication.borrower.creditScore}</TableCell>
                                </TableRow>
                              )}
                              {selectedApplication.borrower.creditRating && (
                                <TableRow>
                                  <TableCell className="font-medium">Credit Rating</TableCell>
                                  <TableCell>{selectedApplication.borrower.creditRating}</TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Notes Tab */}
                <TabsContent value="notes" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Application Notes</CardTitle>
                      <CardDescription>Notes and communications history</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {selectedApplication.notes && selectedApplication.notes.length > 0 ? (
                        <div className="space-y-3">
                          {selectedApplication.notes.map((note) => (
                            <div key={note.id} className="p-3 bg-muted rounded-md space-y-1">
                              <div className="flex items-center justify-between">
                                <div className="font-medium">{note.createdBy}</div>
                                <div className="text-xs text-muted-foreground">
                                  {formatDate(note.createdAt)}
                                </div>
                              </div>
                              <div className="text-sm">{note.content}</div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          No notes available for this application.
                        </div>
                      )}
                      
                      <div className="mt-4">
                        <Button 
                          variant="outline" 
                          className="w-full" 
                          onClick={() => toast.info("Adding a new note...")}
                        >
                          Add Decision Note
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
              
              {/* Decision Actions Bottom */}
              {selectedApplication.status === "underwriting" && (
                <div className="flex justify-end gap-3 mt-6">
                  <Button 
                    variant="outline" 
                    className="text-red-600 hover:text-red-700 hover:bg-red-50" 
                    onClick={() => handleRejectApplication(selectedApplication)}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject Application
                  </Button>
                  <Button 
                    variant="outline"
                    className="text-amber-600 hover:text-amber-700"
                    onClick={() => handleConditionalApproval(selectedApplication)}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Conditionally Approve
                  </Button>
                  <Button 
                    variant="default"
                    onClick={() => handleApproveApplication(selectedApplication)}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve Application
                  </Button>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default DecisionAgent;


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
import { getMockLoanApplications } from "@/services/mockDataService";
import { LoanApplication } from "@/types";

const DecisionAgent = () => {
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedApplication, setSelectedApplication] = useState<LoanApplication | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Get applications that are in the decision stage
        // For decision agent, we're interested in applications in underwriting and approved statuses
        const allApplications = getMockLoanApplications(150); // Increased to ensure at least 100 applications
        const relevantApplications = allApplications.filter(app => 
          ["underwriting", "approved", "conditionally_approved", "rejected"].includes(app.status)
        );
        
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
  };

  const handleRejectApplication = (application: LoanApplication) => {
    toast.error(`Application ${application.id} has been rejected`);
    // Update the application status in the local state
    setApplications(prevApplications => 
      prevApplications.map(app => 
        app.id === application.id ? { ...app, status: "rejected" } : app
      )
    );
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

      {/* Application Detail Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedApplication && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span>Application {selectedApplication.id}</span>
                  {getStatusBadge(selectedApplication.status)}
                </DialogTitle>
                <DialogDescription>
                  Detailed information about this loan application
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                {/* Borrower Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Borrower Information</h3>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Name</TableCell>
                        <TableCell>
                          {selectedApplication.borrower.companyName || 
                            `${selectedApplication.borrower.firstName} ${selectedApplication.borrower.lastName}`}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Email</TableCell>
                        <TableCell>{selectedApplication.borrower.email}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Phone</TableCell>
                        <TableCell>{selectedApplication.borrower.phone}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Credit Score</TableCell>
                        <TableCell>{selectedApplication.borrower.creditScore}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Credit Rating</TableCell>
                        <TableCell>{selectedApplication.borrower.creditRating}</TableCell>
                      </TableRow>
                      {selectedApplication.borrower.companyName && (
                        <>
                          <TableRow>
                            <TableCell className="font-medium">Annual Revenue</TableCell>
                            <TableCell>${selectedApplication.borrower.annualRevenue?.toLocaleString()}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Industry</TableCell>
                            <TableCell>{selectedApplication.borrower.industry}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Years in Business</TableCell>
                            <TableCell>{selectedApplication.borrower.yearsInBusiness}</TableCell>
                          </TableRow>
                        </>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Loan Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Loan Information</h3>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Amount</TableCell>
                        <TableCell>${selectedApplication.amount.toLocaleString()}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Term</TableCell>
                        <TableCell>{selectedApplication.term} months</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Interest Rate</TableCell>
                        <TableCell>{selectedApplication.interestRate}%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Purpose</TableCell>
                        <TableCell>{selectedApplication.purpose}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Asset Class</TableCell>
                        <TableCell>{selectedApplication.assetClass.replace(/_/g, ' ')}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Risk Level</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              selectedApplication.risk === "Low" ? "outline" :
                              selectedApplication.risk === "Medium" ? "warning" :
                              "destructive"
                            }
                          >
                            {selectedApplication.risk}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                {/* Decision Actions */}
                {selectedApplication.status === "underwriting" && (
                  <div className="flex justify-end gap-3 pt-4">
                    <Button 
                      variant="outline" 
                      className="text-red-600 hover:text-red-700 hover:bg-red-50" 
                      onClick={() => {
                        handleRejectApplication(selectedApplication);
                        setShowDetailsDialog(false);
                      }}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject Application
                    </Button>
                    <Button 
                      variant="default"
                      onClick={() => {
                        handleApproveApplication(selectedApplication);
                        setShowDetailsDialog(false);
                      }}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Approve Application
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default DecisionAgent;

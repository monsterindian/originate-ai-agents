
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress"; 
import { 
  Search, Filter, Clock, FileCheck, AlertTriangle, FileX, Eye, 
  UserCheck, ArrowRight, Download, Loader2, CheckCircle, RefreshCw, PlusCircle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import ApplicationDetailModal from "@/components/modals/ApplicationDetailModal";
import { toast } from "sonner";
import { getMockLoanApplications, formatCurrency, getApplicationCountByStatus } from "@/services/mockDataService";
import { LoanApplication, LoanStatus } from "@/types";

const statusIcons = {
  "Draft": <Clock className="h-4 w-4 text-slate-500" />,
  "Submitted": <Clock className="h-4 w-4 text-blue-500" />,
  "In Review": <Clock className="h-4 w-4 text-blue-500" />,
  "Information Needed": <AlertTriangle className="h-4 w-4 text-amber-500" />,
  "In Underwriting": <FileCheck className="h-4 w-4 text-indigo-500" />,
  "Approved": <CheckCircle className="h-4 w-4 text-green-500" />,
  "Conditionally Approved": <AlertTriangle className="h-4 w-4 text-green-500" />,
  "Rejected": <FileX className="h-4 w-4 text-red-500" />,
  "Funding In Progress": <Loader2 className="h-4 w-4 text-blue-500" />,
  "Funded": <CheckCircle className="h-4 w-4 text-green-500" />,
  "Closed": <CheckCircle className="h-4 w-4 text-slate-500" />
};

const statusVariants: Record<string, "default" | "secondary" | "destructive" | "outline" | "success" | "warning"> = {
  "Draft": "outline",
  "Submitted": "default",
  "In Review": "default",
  "Information Needed": "warning",
  "In Underwriting": "secondary",
  "Approved": "success",
  "Conditionally Approved": "warning",
  "Rejected": "destructive",
  "Funding In Progress": "default",
  "Funded": "success",
  "Closed": "outline"
};

const Applications = () => {
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<LoanApplication[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<LoanApplication | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Check for query parameters
    const params = new URLSearchParams(location.search);
    const action = params.get('action');
    const borrowerId = params.get('borrowerId');
    const applicationId = params.get('id');
    
    if (action === 'new') {
      if (borrowerId) {
        // Simulate starting a new application for specific borrower
        toast.success(`Starting new application for borrower ID: ${borrowerId}`);
        // In a real app, you would navigate to a form or modal for creating a new application
      } else {
        toast.info("Starting new application");
        // In a real app, you would navigate to a form or modal for creating a new application
      }
    }
    
    // Load applications with a small delay to simulate API call
    setLoading(true);
    const timer = setTimeout(() => {
      const apps = getMockLoanApplications();
      setApplications(apps);
      setFilteredApplications(apps);
      
      // If an application ID was provided, open that application
      if (applicationId) {
        const app = apps.find(app => app.id === applicationId);
        if (app) {
          setSelectedApplication(app);
        } else {
          toast.error(`Application ${applicationId} not found`);
        }
      }
      
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [location.search]);
  
  // Filter applications when search term or status filter changes
  useEffect(() => {
    const filteredBySearch = applications.filter(app => {
      const borrowerName = app.borrower.companyName || `${app.borrower.firstName} ${app.borrower.lastName}`;
      const searchLower = searchTerm.toLowerCase();
      return app.id.toLowerCase().includes(searchLower) || 
             borrowerName.toLowerCase().includes(searchLower) ||
             app.purpose.toLowerCase().includes(searchLower);
    });
    
    const filteredByStatus = statusFilter === "all" 
      ? filteredBySearch
      : filteredBySearch.filter(app => app.displayStatus === statusFilter);
    
    setFilteredApplications(filteredByStatus);
  }, [searchTerm, statusFilter, applications]);
  
  const handleViewApplication = (application: LoanApplication) => {
    setSelectedApplication(application);
  };

  const handleViewBorrower = (application: LoanApplication) => {
    const borrowerName = application.borrower.companyName || `${application.borrower.firstName} ${application.borrower.lastName}`;
    toast.info(`Viewing borrower details for ${borrowerName}`);
    // Navigate to the borrower page with the corresponding ID
    navigate(`/borrowers?id=${application.borrowerId}`);
  };

  const handleSendToAgent = (application: LoanApplication) => {
    // Determine which agent the application should be sent to based on its status
    let agentType: string;
    let agentName: string;
    
    switch(application.status) {
      case "draft":
      case "submitted":
        agentType = "intake";
        agentName = "Intake Agent";
        break;
      case "reviewing":
      case "information_needed":
        agentType = "processing";
        agentName = "Processing Agent";
        break;
      case "underwriting":
        agentType = "underwriting";
        agentName = "Underwriting Agent";
        break;
      default:
        agentType = "decision";
        agentName = "Decision Agent";
    }
    
    toast(
      <div className="space-y-2">
        <p className="font-semibold">Sending Application to {agentName}</p>
        <p>Application {application.id} is being processed</p>
        <p className="text-sm text-muted-foreground">Status: {application.displayStatus}</p>
        <div className="flex gap-2 mt-2">
          <Button size="sm" onClick={() => navigate(`/agents/${agentType}?applicationId=${application.id}`)}>
            View Agent Dashboard
          </Button>
        </div>
      </div>,
      { duration: 5000 }
    );
  };
  
  const handleDownloadApplication = (application: LoanApplication) => {
    toast.success(`Generating PDF for application ${application.id}`);
    
    // Show a more detailed toast after a brief delay
    setTimeout(() => {
      toast(
        <div className="space-y-2">
          <p className="font-semibold">Application PDF Generated</p>
          <p>Application ID: {application.id}</p>
          <p>Borrower: {application.borrower.companyName || `${application.borrower.firstName} ${application.borrower.lastName}`}</p>
          <p>Amount: {formatCurrency(application.amount)}</p>
          <div className="flex gap-2 mt-2">
            <Button size="sm" onClick={() => toast.success(`PDF downloaded successfully`)}>
              Download PDF
            </Button>
          </div>
        </div>,
        { duration: 5000 }
      );
    }, 1500);
  };
  
  const handleRefreshData = () => {
    setLoading(true);
    toast.info("Refreshing application data...");
    
    // Simulate API refresh
    setTimeout(() => {
      const apps = getMockLoanApplications();
      setApplications(apps);
      setFilteredApplications(apps);
      setLoading(false);
      toast.success("Application data refreshed successfully");
    }, 800);
  };

  const handleCreateNewApplication = () => {
    toast.info("Starting new loan application process");
    navigate('/applications?action=new');
  };
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
            <p className="text-muted-foreground">
              Manage and review loan applications
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRefreshData}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button onClick={handleCreateNewApplication}>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Application
            </Button>
          </div>
        </div>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{applications.length}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium">Ready for Decision</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {getApplicationCountByStatus(["underwriting"])}
              </div>
              <p className="text-xs text-muted-foreground">Applications in final stages</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium">In Process</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {getApplicationCountByStatus(["submitted", "reviewing", "information_needed", "underwriting"])}
              </div>
              <p className="text-xs text-muted-foreground">In various stages</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(() => {
                  const decided = applications.filter(app => 
                    ["approved", "conditionally_approved", "rejected"].includes(app.status)
                  );
                  
                  if (decided.length === 0) return "N/A";
                  
                  const approved = decided.filter(app => 
                    ["approved", "conditionally_approved"].includes(app.status)
                  );
                  
                  return `${Math.round((approved.length / decided.length) * 100)}%`;
                })()}
              </div>
              <p className="text-xs text-muted-foreground">For decided applications</p>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Applications Dashboard</CardTitle>
            <CardDescription>View and process all loan applications in one place.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search applications..."
                  className="pl-8 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Submitted">Submitted</SelectItem>
                    <SelectItem value="In Review">In Review</SelectItem>
                    <SelectItem value="Information Needed">Information Needed</SelectItem>
                    <SelectItem value="In Underwriting">In Underwriting</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Conditionally Approved">Conditionally Approved</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                    <SelectItem value="Funded">Funded</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" onClick={() => toast.info("Opening advanced filters panel")}>
                  <Filter className="mr-2 h-4 w-4" />
                  More Filters
                </Button>
              </div>
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Loading applications...</span>
              </div>
            ) : (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Application ID</TableHead>
                        <TableHead>Borrower</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Purpose</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Completeness</TableHead>
                        <TableHead>Asset Class</TableHead>
                        <TableHead>Date Submitted</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredApplications.length > 0 ? (
                        filteredApplications.slice(0, 10).map((app) => (
                          <TableRow key={app.id}>
                            <TableCell className="font-medium">{app.id}</TableCell>
                            <TableCell>
                              {app.borrower.companyName || `${app.borrower.firstName} ${app.borrower.lastName}`}
                            </TableCell>
                            <TableCell>{formatCurrency(app.amount)}</TableCell>
                            <TableCell>{app.purpose}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {statusIcons[app.displayStatus]}
                                <Badge variant={statusVariants[app.displayStatus]}>{app.displayStatus}</Badge>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col gap-1">
                                <Progress value={app.completeness} className="h-2" />
                                <span className="text-xs text-muted-foreground">{app.completeness}%</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {(() => {
                                const assetClassDisplay: Record<string, string> = {
                                  "residential_mortgage": "Residential",
                                  "commercial_real_estate": "Commercial RE",
                                  "auto_loan": "Auto",
                                  "personal_loan": "Personal",
                                  "sme_loan": "SME",
                                  "equipment_finance": "Equipment",
                                  "other": "Other"
                                };
                                return assetClassDisplay[app.assetClass] || app.assetClass;
                              })()}
                            </TableCell>
                            <TableCell>{app.dateSubmitted || "Not submitted"}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Button variant="ghost" size="icon" onClick={() => handleViewApplication(app)} title="View Application">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleViewBorrower(app)} title="View Borrower">
                                  <UserCheck className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDownloadApplication(app)} title="Download Application">
                                  <Download className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => handleSendToAgent(app)}
                                  title="Send to Agent"
                                >
                                  <ArrowRight className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-4">
                            No applications found matching your criteria.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                
                {filteredApplications.length > 10 && (
                  <div className="mt-4 flex items-center justify-center">
                    <Button variant="outline" onClick={() => {
                      toast.info("Loading more applications...");
                      setTimeout(() => {
                        toast.success("Additional applications loaded");
                      }, 800);
                    }}>
                      Load More Applications
                    </Button>
                  </div>
                )}
              </>
            )}
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

export default Applications;

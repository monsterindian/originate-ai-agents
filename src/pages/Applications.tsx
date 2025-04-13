
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress"; 
import { Search, Filter, Clock, FileCheck, AlertTriangle, FileX, Eye, UserCheck, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import ApplicationDetailModal from "@/components/modals/ApplicationDetailModal";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const mockApplications = [
  {
    id: "APP-3845",
    borrower: "Sunrise Properties LLC",
    amount: "$2,200,000",
    purpose: "Property Acquisition",
    status: "In Underwriting",
    dateSubmitted: "2024-04-05",
    completeness: 75,
    assetClass: "Commercial Real Estate"
  },
  {
    id: "APP-3846",
    borrower: "Tech Solutions Inc",
    amount: "$550,000",
    purpose: "Equipment Purchase",
    status: "Document Collection",
    dateSubmitted: "2024-04-07",
    completeness: 45,
    assetClass: "Equipment"
  },
  {
    id: "APP-3847",
    borrower: "Metro Medical Services",
    amount: "$1,200,000",
    purpose: "Expansion",
    status: "Initial Review",
    dateSubmitted: "2024-04-10",
    completeness: 30,
    assetClass: "Business"
  },
  {
    id: "APP-3848",
    borrower: "Evergreen Developments",
    amount: "$4,500,000",
    purpose: "Construction",
    status: "Pending Approval",
    dateSubmitted: "2024-04-01",
    completeness: 95,
    assetClass: "Construction"
  },
  {
    id: "APP-3849",
    borrower: "Coastal Shipping Co",
    amount: "$850,000",
    purpose: "Working Capital",
    status: "Credit Review",
    dateSubmitted: "2024-04-08",
    completeness: 60,
    assetClass: "Working Capital"
  }
];

const statusIcons = {
  "Initial Review": <Clock className="h-4 w-4 text-blue-500" />,
  "Document Collection": <FileCheck className="h-4 w-4 text-amber-500" />,
  "Credit Review": <AlertTriangle className="h-4 w-4 text-orange-500" />,
  "In Underwriting": <FileCheck className="h-4 w-4 text-indigo-500" />,
  "Pending Approval": <FileCheck className="h-4 w-4 text-green-500" />,
  "Rejected": <FileX className="h-4 w-4 text-red-500" />
};

const Applications = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApplication, setSelectedApplication] = useState<any | null>(null);
  const navigate = useNavigate();
  
  const handleViewApplication = (application: any) => {
    setSelectedApplication(application);
  };

  const handleViewBorrower = (application: any) => {
    toast.info(`Viewing borrower details for ${application.borrower}`);
    // In a real application, this would navigate to the borrower page with the corresponding ID
  };

  const handleSendToAgent = (application: any, agentType: string) => {
    toast.success(`Application ${application.id} sent to ${agentType} agent`);
    
    // Navigate to the corresponding agent page
    switch(agentType) {
      case "Processing":
        navigate("/agents/processing");
        break;
      case "Underwriting":
        navigate("/agents/underwriting");
        break;
      case "Decision":
        navigate("/agents/decision");
        break;
      default:
        break;
    }
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
          <div>
            <Button>New Application</Button>
          </div>
        </div>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium">Ready for Decision</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">Application pending approval</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium">In Process</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">In various stages</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">75%</div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
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
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
            
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
                {mockApplications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell className="font-medium">{app.id}</TableCell>
                    <TableCell>{app.borrower}</TableCell>
                    <TableCell>{app.amount}</TableCell>
                    <TableCell>{app.purpose}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {statusIcons[app.status as keyof typeof statusIcons]}
                        <Badge variant="outline">{app.status}</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Progress value={app.completeness} className="h-2" />
                        <span className="text-xs text-muted-foreground">{app.completeness}%</span>
                      </div>
                    </TableCell>
                    <TableCell>{app.assetClass}</TableCell>
                    <TableCell>{app.dateSubmitted}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleViewApplication(app)} title="View Application">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleViewBorrower(app)} title="View Borrower">
                          <UserCheck className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleSendToAgent(app, app.status === "Document Collection" ? "Processing" : app.status === "Credit Review" ? "Underwriting" : "Decision")}
                          title={`Send to ${app.status === "Document Collection" ? "Processing" : app.status === "Credit Review" ? "Underwriting" : "Decision"} Agent`}
                        >
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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

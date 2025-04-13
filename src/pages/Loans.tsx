
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, FileText, Filter, Download, Eye, UserCheck, MessageSquare, AlertCircle, PlusCircle } from "lucide-react";
import LoanDetailModal from "@/components/modals/LoanDetailModal";
import { toast } from "sonner";
import { formatCurrency } from "@/services/mockDataService";

const mockLoans = [
  {
    id: "L-10245",
    borrower: "Acme Industries",
    borrowerId: "B-7512",
    amount: "$1,250,000",
    interestRate: "5.25%",
    term: "60 months",
    status: "Active",
    paymentStatus: "Current",
    assetClass: "Commercial Real Estate",
    origination: "2024-03-15",
    nextPaymentDate: "2024-05-15",
    paymentAmount: "$23,790.82",
    totalPaid: "$47,581.64",
    remainingBalance: "$1,202,418.36",
    collateralDescription: "Office building at 123 Business Park",
    collateralValue: "$1,650,000",
    loanOfficer: "Michael Rodriguez",
    loanPurpose: "Property acquisition for business expansion",
    applicationId: "APP-8542",
    documents: [
      { name: "Loan Agreement", type: "pdf", uploadedAt: "2024-03-15" },
      { name: "Collateral Assessment", type: "pdf", uploadedAt: "2024-03-10" },
      { name: "Insurance Policy", type: "pdf", uploadedAt: "2024-03-12" }
    ]
  },
  {
    id: "L-10246",
    borrower: "Bright Futures LLC",
    borrowerId: "B-7513",
    amount: "$750,000",
    interestRate: "4.75%",
    term: "36 months",
    status: "Active",
    paymentStatus: "Current",
    assetClass: "Equipment",
    origination: "2024-02-20",
    nextPaymentDate: "2024-05-20",
    paymentAmount: "$22,456.38",
    totalPaid: "$44,912.76",
    remainingBalance: "$705,087.24",
    collateralDescription: "Manufacturing equipment and machinery",
    collateralValue: "$950,000",
    loanOfficer: "Sarah Johnson",
    loanPurpose: "Equipment upgrade for production facility",
    applicationId: "APP-8425",
    documents: [
      { name: "Loan Agreement", type: "pdf", uploadedAt: "2024-02-20" },
      { name: "Equipment List", type: "xlsx", uploadedAt: "2024-02-15" }
    ]
  },
  {
    id: "L-10247",
    borrower: "Green Energy Co.",
    borrowerId: "B-7514",
    amount: "$2,500,000",
    interestRate: "6.00%",
    term: "84 months",
    status: "Active",
    paymentStatus: "Late (30 days)",
    assetClass: "Project Finance",
    origination: "2024-01-10",
    nextPaymentDate: "2024-04-10",
    paymentAmount: "$38,575.62",
    totalPaid: "$77,151.24",
    remainingBalance: "$2,422,848.76",
    collateralDescription: "Solar panel installation project",
    collateralValue: "$3,200,000",
    loanOfficer: "David Thompson",
    loanPurpose: "Renewable energy project financing",
    applicationId: "APP-8214",
    documents: [
      { name: "Loan Agreement", type: "pdf", uploadedAt: "2024-01-10" },
      { name: "Project Plan", type: "pdf", uploadedAt: "2024-01-05" },
      { name: "Environmental Assessment", type: "pdf", uploadedAt: "2024-01-03" }
    ]
  },
  {
    id: "L-10248",
    borrower: "Metro Apartments",
    borrowerId: "B-7515",
    amount: "$3,750,000",
    interestRate: "5.50%",
    term: "120 months",
    status: "Active",
    paymentStatus: "Current",
    assetClass: "Multifamily",
    origination: "2024-03-01",
    nextPaymentDate: "2024-05-01",
    paymentAmount: "$40,678.92",
    totalPaid: "$40,678.92",
    remainingBalance: "$3,709,321.08",
    collateralDescription: "32-unit apartment building",
    collateralValue: "$4,800,000",
    loanOfficer: "Lisa Rodriguez",
    loanPurpose: "Acquisition of multifamily property",
    applicationId: "APP-8498",
    documents: [
      { name: "Loan Agreement", type: "pdf", uploadedAt: "2024-03-01" },
      { name: "Property Appraisal", type: "pdf", uploadedAt: "2024-02-25" },
      { name: "Insurance Policy", type: "pdf", uploadedAt: "2024-02-28" }
    ]
  },
  {
    id: "L-10249",
    borrower: "Swift Logistics",
    borrowerId: "B-7516",
    amount: "$500,000",
    interestRate: "7.25%",
    term: "24 months",
    status: "Active",
    paymentStatus: "Current",
    assetClass: "Working Capital",
    origination: "2024-04-05",
    nextPaymentDate: "2024-05-05",
    paymentAmount: "$22,389.74",
    totalPaid: "$0.00",
    remainingBalance: "$500,000.00",
    collateralDescription: "Business inventory and receivables",
    collateralValue: "$650,000",
    loanOfficer: "Robert Carter",
    loanPurpose: "Working capital for business expansion",
    applicationId: "APP-8545",
    documents: [
      { name: "Loan Agreement", type: "pdf", uploadedAt: "2024-04-05" },
      { name: "Business Plan", type: "pdf", uploadedAt: "2024-04-01" }
    ]
  }
];

const Loans = () => {
  const [tab, setTab] = useState("active");
  const [selectedLoan, setSelectedLoan] = useState<any | null>(null);
  const navigate = useNavigate();
  
  const handleViewLoan = (loan: any) => {
    setSelectedLoan(loan);
  };

  const handleViewBorrower = (loan: any) => {
    toast.info(`Viewing borrower details for ${loan.borrower}`);
    // Navigate to the borrower details page with the proper ID
    navigate(`/borrowers?id=${loan.borrowerId}`);
  };

  const handleContactBorrower = (loan: any) => {
    toast.info(`Opening communication channel with ${loan.borrower}`);
    // Show more comprehensive information in a toast
    toast.info(
      <div className="space-y-2">
        <p className="font-semibold">Contact Options for {loan.borrower}</p>
        <p>Loan Officer: {loan.loanOfficer}</p>
        <p>Call or email the borrower directly from your dashboard</p>
        <div className="flex gap-2 mt-2">
          <Button size="sm" onClick={() => toast.success(`Email sent to ${loan.borrower}`)}>
            Email
          </Button>
          <Button size="sm" variant="outline" onClick={() => toast.success(`Call initiated to ${loan.borrower}`)}>
            Call
          </Button>
        </div>
      </div>,
      { duration: 5000 }
    );
  };

  const handleFlagLoan = (loan: any) => {
    toast.warning(
      <div className="space-y-2">
        <p className="font-semibold">Loan {loan.id} flagged for review</p>
        <p>Reason: Payment status - {loan.paymentStatus}</p>
        <p>Next payment of {loan.paymentAmount} due on {loan.nextPaymentDate}</p>
        <div className="flex gap-2 mt-2">
          <Button size="sm" onClick={() => navigate(`/risk?loanId=${loan.id}`)}>
            View Risk Analysis
          </Button>
        </div>
      </div>,
      { duration: 5000 }
    );
  };

  const handleCreateNewLoan = () => {
    toast.info("Starting new loan application process");
    navigate('/applications?action=new');
  };

  const handleExportLoans = () => {
    toast.success("Exporting loan portfolio data");
    // Simulate download after a brief delay
    setTimeout(() => {
      toast.success("Loan portfolio data exported successfully");
    }, 1500);
  };
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Loans</h1>
            <p className="text-muted-foreground">
              View and manage active loans across all asset classes
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => toast.info("Filtering loan data...")}>
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportLoans}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button size="sm" onClick={handleCreateNewLoan}>
              <FileText className="mr-2 h-4 w-4" />
              New Loan
            </Button>
          </div>
        </div>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium">Total Portfolio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$8,750,000</div>
              <p className="text-xs text-muted-foreground">5 active loans</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium">Average Interest Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5.45%</div>
              <p className="text-xs text-muted-foreground">Across all active loans</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium">Payment Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">80%</div>
              <p className="text-xs text-muted-foreground">Loans current on payments</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium">Risk Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Low</div>
              <p className="text-xs text-muted-foreground">Overall portfolio health</p>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Loan Portfolio</CardTitle>
            <CardDescription>Monitor loan performance, review terms, and manage modifications.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={tab} onValueChange={setTab} className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="active">Active Loans</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="closed">Closed</TabsTrigger>
              </TabsList>
              
              <TabsContent value="active" className="w-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Loan ID</TableHead>
                      <TableHead>Borrower</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Interest Rate</TableHead>
                      <TableHead>Term</TableHead>
                      <TableHead>Payment Status</TableHead>
                      <TableHead>Asset Class</TableHead>
                      <TableHead>Origination Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockLoans.map((loan) => (
                      <TableRow key={loan.id}>
                        <TableCell className="font-medium">{loan.id}</TableCell>
                        <TableCell>{loan.borrower}</TableCell>
                        <TableCell>{loan.amount}</TableCell>
                        <TableCell>{loan.interestRate}</TableCell>
                        <TableCell>{loan.term}</TableCell>
                        <TableCell>
                          <Badge variant={loan.paymentStatus === "Current" ? "outline" : "destructive"}>
                            {loan.paymentStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>{loan.assetClass}</TableCell>
                        <TableCell>{loan.origination}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" onClick={() => handleViewLoan(loan)} title="View Loan Details">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleViewBorrower(loan)} title="View Borrower">
                              <UserCheck className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleContactBorrower(loan)} title="Contact Borrower">
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                            {loan.paymentStatus !== "Current" && (
                              <Button variant="ghost" size="icon" onClick={() => handleFlagLoan(loan)} title="Flag for Review">
                                <AlertCircle className="h-4 w-4 text-amber-500" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
              
              <TabsContent value="pending">
                <div className="flex flex-col items-center justify-center py-8">
                  <PlusCircle className="h-16 w-16 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-semibold">No Pending Loans</h3>
                  <p className="text-muted-foreground text-sm mt-2">All loan applications are currently processed.</p>
                  <Button variant="outline" className="mt-4" onClick={handleCreateNewLoan}>Start New Loan Application</Button>
                </div>
              </TabsContent>
              
              <TabsContent value="closed">
                <div className="flex flex-col items-center justify-center py-8">
                  <BarChart className="h-16 w-16 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-semibold">No Closed Loans</h3>
                  <p className="text-muted-foreground text-sm mt-2">No loans have been closed in the current period.</p>
                  <Button variant="outline" className="mt-4" onClick={() => navigate('/analytics?view=historical')}>View Historical Data</Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {selectedLoan && (
        <LoanDetailModal
          isOpen={!!selectedLoan}
          onClose={() => setSelectedLoan(null)}
          loan={selectedLoan}
        />
      )}
    </MainLayout>
  );
};

export default Loans;

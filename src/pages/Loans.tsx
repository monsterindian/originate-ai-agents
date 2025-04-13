
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, FileText, Filter, Download, Eye, UserCheck, MessageSquare, AlertCircle } from "lucide-react";
import LoanDetailModal from "@/components/modals/LoanDetailModal";
import { toast } from "sonner";

const mockLoans = [
  {
    id: "L-10245",
    borrower: "Acme Industries",
    amount: "$1,250,000",
    interestRate: "5.25%",
    term: "60 months",
    status: "Active",
    paymentStatus: "Current",
    assetClass: "Commercial Real Estate",
    origination: "2024-03-15"
  },
  {
    id: "L-10246",
    borrower: "Bright Futures LLC",
    amount: "$750,000",
    interestRate: "4.75%",
    term: "36 months",
    status: "Active",
    paymentStatus: "Current",
    assetClass: "Equipment",
    origination: "2024-02-20"
  },
  {
    id: "L-10247",
    borrower: "Green Energy Co.",
    amount: "$2,500,000",
    interestRate: "6.00%",
    term: "84 months",
    status: "Active",
    paymentStatus: "Late (30 days)",
    assetClass: "Project Finance",
    origination: "2024-01-10"
  },
  {
    id: "L-10248",
    borrower: "Metro Apartments",
    amount: "$3,750,000",
    interestRate: "5.50%",
    term: "120 months",
    status: "Active",
    paymentStatus: "Current",
    assetClass: "Multifamily",
    origination: "2024-03-01"
  },
  {
    id: "L-10249",
    borrower: "Swift Logistics",
    amount: "$500,000",
    interestRate: "7.25%",
    term: "24 months",
    status: "Active",
    paymentStatus: "Current",
    assetClass: "Working Capital",
    origination: "2024-04-05"
  }
];

const Loans = () => {
  const [tab, setTab] = useState("active");
  const [selectedLoan, setSelectedLoan] = useState<any | null>(null);
  
  const handleViewLoan = (loan: any) => {
    setSelectedLoan(loan);
  };

  const handleViewBorrower = (loan: any) => {
    toast.info(`Viewing borrower details for ${loan.borrower}`);
    // In a real app, this would navigate to the borrower details page
  };

  const handleContactBorrower = (loan: any) => {
    toast.info(`Contacting borrower ${loan.borrower}`);
    // In a real app, this would open a communication interface
  };

  const handleFlagLoan = (loan: any) => {
    toast.warning(`Loan ${loan.id} flagged for review`);
    // In a real app, this would mark the loan for special attention
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
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button size="sm">
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
                  <BarChart className="h-16 w-16 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-semibold">No Pending Loans</h3>
                  <p className="text-muted-foreground text-sm mt-2">All loan applications are currently processed.</p>
                </div>
              </TabsContent>
              
              <TabsContent value="closed">
                <div className="flex flex-col items-center justify-center py-8">
                  <BarChart className="h-16 w-16 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-semibold">No Closed Loans</h3>
                  <p className="text-muted-foreground text-sm mt-2">No loans have been closed in the current period.</p>
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

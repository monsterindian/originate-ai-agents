
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Filter, UserPlus, Building2, Users, FileText, Eye, CreditCard, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import BorrowerDetailModal from "@/components/modals/BorrowerDetailModal";
import { toast } from "sonner";

const mockBorrowers = [
  {
    id: "B-7512",
    name: "Acme Industries",
    type: "Corporation",
    industry: "Manufacturing",
    contactPerson: "John Smith",
    email: "john.smith@acme.com",
    phone: "(555) 123-4567",
    activeLoans: 1,
    totalBalance: "$1,250,000",
    riskRating: "Low"
  },
  {
    id: "B-7513",
    name: "Bright Futures LLC",
    type: "LLC",
    industry: "Education",
    contactPerson: "Sarah Johnson",
    email: "sjohnson@brightfutures.com",
    phone: "(555) 234-5678",
    activeLoans: 1,
    totalBalance: "$750,000",
    riskRating: "Low"
  },
  {
    id: "B-7514",
    name: "Green Energy Co.",
    type: "Corporation",
    industry: "Energy",
    contactPerson: "Michael Chen",
    email: "mchen@greenenergy.com",
    phone: "(555) 345-6789",
    activeLoans: 1,
    totalBalance: "$2,500,000",
    riskRating: "Medium"
  },
  {
    id: "B-7515",
    name: "Metro Apartments",
    type: "Partnership",
    industry: "Real Estate",
    contactPerson: "Lisa Rodriguez",
    email: "lrodriguez@metroapts.com",
    phone: "(555) 456-7890",
    activeLoans: 1,
    totalBalance: "$3,750,000",
    riskRating: "Low"
  },
  {
    id: "B-7516",
    name: "Swift Logistics",
    type: "Corporation",
    industry: "Transportation",
    contactPerson: "David Thompson",
    email: "dthompson@swiftlog.com",
    phone: "(555) 567-8901",
    activeLoans: 1,
    totalBalance: "$500,000",
    riskRating: "Medium"
  }
];

const getBorrowerInitials = (name: string) => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

const getBadgeColor = (rating: string) => {
  if (rating === "Low") return "success";
  if (rating === "Medium") return "warning";
  return "destructive";
};

const Borrowers = () => {
  const [tab, setTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBorrower, setSelectedBorrower] = useState<any | null>(null);

  const handleViewBorrower = (borrower: any) => {
    setSelectedBorrower(borrower);
  };

  const handleNewLoanApplication = (borrower: any) => {
    toast.success(`Starting new loan application for ${borrower.name}`);
    // In a real app, this would navigate to a new loan application form
  };

  const handleContactBorrower = (borrower: any) => {
    toast.info(`Contacting ${borrower.name} at ${borrower.email}`);
    // In a real app, this would open a communication interface
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Borrowers</h1>
            <p className="text-muted-foreground">
              Manage borrower information and profiles
            </p>
          </div>
          <div>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Borrower
            </Button>
          </div>
        </div>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium">Total Borrowers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Users className="h-3 w-3" />
                <span>Active client relationships</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium">Corporate Clients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Building2 className="h-3 w-3" />
                <span>Corporation entities</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <FileText className="h-3 w-3" />
                <span>Across all borrowers</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium">Total Exposure</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$8.75M</div>
              <p className="text-xs text-muted-foreground">Outstanding loan balances</p>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Borrowers Directory</CardTitle>
            <CardDescription>Access and update borrower information from a central location.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={tab} onValueChange={setTab} className="w-full">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                <TabsList>
                  <TabsTrigger value="all">All Borrowers</TabsTrigger>
                  <TabsTrigger value="corporate">Corporate</TabsTrigger>
                  <TabsTrigger value="individual">Individual</TabsTrigger>
                </TabsList>
                
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative w-full sm:w-60">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search borrowers..."
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
              </div>
              
              <TabsContent value="all" className="w-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Borrower</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Industry</TableHead>
                      <TableHead>Contact Person</TableHead>
                      <TableHead>Contact Info</TableHead>
                      <TableHead>Active Loans</TableHead>
                      <TableHead>Total Balance</TableHead>
                      <TableHead>Risk Rating</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockBorrowers.map((borrower) => (
                      <TableRow key={borrower.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback>{getBorrowerInitials(borrower.name)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{borrower.name}</div>
                              <div className="text-xs text-muted-foreground">{borrower.id}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{borrower.type}</TableCell>
                        <TableCell>{borrower.industry}</TableCell>
                        <TableCell>{borrower.contactPerson}</TableCell>
                        <TableCell>
                          <div className="text-sm">{borrower.email}</div>
                          <div className="text-xs text-muted-foreground">{borrower.phone}</div>
                        </TableCell>
                        <TableCell>{borrower.activeLoans}</TableCell>
                        <TableCell>{borrower.totalBalance}</TableCell>
                        <TableCell>
                          <Badge variant={getBadgeColor(borrower.riskRating) as any}>{borrower.riskRating}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" onClick={() => handleViewBorrower(borrower)} title="View Borrower">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleNewLoanApplication(borrower)} title="New Loan Application">
                              <CreditCard className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleContactBorrower(borrower)} title="Contact Borrower">
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
              
              <TabsContent value="corporate">
                <div className="flex flex-col items-center justify-center py-8">
                  <Building2 className="h-16 w-16 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-semibold">Corporate View Coming Soon</h3>
                  <p className="text-muted-foreground text-sm mt-2">This view is currently under development.</p>
                </div>
              </TabsContent>
              
              <TabsContent value="individual">
                <div className="flex flex-col items-center justify-center py-8">
                  <Users className="h-16 w-16 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-semibold">Individual View Coming Soon</h3>
                  <p className="text-muted-foreground text-sm mt-2">This view is currently under development.</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {selectedBorrower && (
        <BorrowerDetailModal
          isOpen={!!selectedBorrower}
          onClose={() => setSelectedBorrower(null)}
          borrower={selectedBorrower}
        />
      )}
    </MainLayout>
  );
};

export default Borrowers;

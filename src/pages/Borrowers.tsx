
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Filter, UserPlus, Building2, Users, FileText, Eye, CreditCard, MessageSquare, Phone, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import BorrowerDetailModal from "@/components/modals/BorrowerDetailModal";
import { toast } from "sonner";
import { useEffect } from "react";

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
    riskRating: "Low",
    foundedYear: "1985",
    employeeCount: "250+",
    creditScore: "780",
    annualRevenue: "$15M-$20M",
    lastReviewDate: "2024-03-10",
    relationshipManager: "Michael Rodriguez",
    address: {
      street: "123 Industrial Blvd",
      city: "Chicago", 
      state: "IL",
      zipCode: "60007"
    },
    documents: [
      { name: "Financial Statements", type: "pdf", uploadedAt: "2024-02-15" },
      { name: "Tax Returns", type: "pdf", uploadedAt: "2024-02-15" },
      { name: "Business License", type: "pdf", uploadedAt: "2023-12-01" }
    ],
    loans: [
      { id: "L-10245", amount: "$1,250,000", status: "Current", origination: "2024-03-15" }
    ]
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
    riskRating: "Low",
    foundedYear: "2010",
    employeeCount: "50-100",
    creditScore: "765",
    annualRevenue: "$5M-$10M",
    lastReviewDate: "2024-02-20",
    relationshipManager: "Sarah Johnson",
    address: {
      street: "456 Education Ave",
      city: "Boston", 
      state: "MA",
      zipCode: "02108"
    },
    documents: [
      { name: "Financial Statements", type: "pdf", uploadedAt: "2024-01-30" },
      { name: "Business Plan", type: "pdf", uploadedAt: "2024-01-25" }
    ],
    loans: [
      { id: "L-10246", amount: "$750,000", status: "Current", origination: "2024-02-20" }
    ]
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
    riskRating: "Medium",
    foundedYear: "2015",
    employeeCount: "100-250",
    creditScore: "715",
    annualRevenue: "$10M-$15M",
    lastReviewDate: "2024-01-15",
    relationshipManager: "David Thompson",
    address: {
      street: "789 Renewable Way",
      city: "Denver", 
      state: "CO",
      zipCode: "80202"
    },
    documents: [
      { name: "Financial Statements", type: "pdf", uploadedAt: "2023-12-15" },
      { name: "Project Proposal", type: "pdf", uploadedAt: "2023-12-10" },
      { name: "Environmental Impact Study", type: "pdf", uploadedAt: "2023-11-30" }
    ],
    loans: [
      { id: "L-10247", amount: "$2,500,000", status: "Late (30 days)", origination: "2024-01-10" }
    ]
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
    riskRating: "Low",
    foundedYear: "2005",
    employeeCount: "25-50",
    creditScore: "790",
    annualRevenue: "$5M-$10M",
    lastReviewDate: "2024-03-05",
    relationshipManager: "Lisa Rodriguez",
    address: {
      street: "101 Urban Heights",
      city: "New York", 
      state: "NY",
      zipCode: "10001"
    },
    documents: [
      { name: "Financial Statements", type: "pdf", uploadedAt: "2024-02-25" },
      { name: "Property Portfolio", type: "pdf", uploadedAt: "2024-02-20" },
      { name: "Insurance Documents", type: "pdf", uploadedAt: "2024-02-15" }
    ],
    loans: [
      { id: "L-10248", amount: "$3,750,000", status: "Current", origination: "2024-03-01" }
    ]
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
    riskRating: "Medium",
    foundedYear: "2018",
    employeeCount: "50-100",
    creditScore: "705",
    annualRevenue: "$2M-$5M",
    lastReviewDate: "2024-04-01",
    relationshipManager: "Robert Carter",
    address: {
      street: "202 Transport Drive",
      city: "Atlanta", 
      state: "GA",
      zipCode: "30308"
    },
    documents: [
      { name: "Financial Statements", type: "pdf", uploadedAt: "2024-03-25" },
      { name: "Fleet Information", type: "pdf", uploadedAt: "2024-03-20" }
    ],
    loans: [
      { id: "L-10249", amount: "$500,000", status: "Current", origination: "2024-04-05" }
    ]
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
  const [filteredBorrowers, setFilteredBorrowers] = useState(mockBorrowers);
  const navigate = useNavigate();
  const location = useLocation();

  // Check for query parameters to automatically open a borrower's details
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const borrowerId = params.get('id');
    
    if (borrowerId) {
      const borrower = mockBorrowers.find(b => b.id === borrowerId);
      if (borrower) {
        setSelectedBorrower(borrower);
      } else {
        toast.error(`Borrower with ID ${borrowerId} not found`);
      }
    }
  }, [location.search]);

  // Filter borrowers based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredBorrowers(mockBorrowers);
    } else {
      const lowercaseSearch = searchTerm.toLowerCase();
      const filtered = mockBorrowers.filter(
        borrower => 
          borrower.name.toLowerCase().includes(lowercaseSearch) || 
          borrower.id.toLowerCase().includes(lowercaseSearch) ||
          borrower.industry.toLowerCase().includes(lowercaseSearch) ||
          borrower.contactPerson.toLowerCase().includes(lowercaseSearch) ||
          borrower.email.toLowerCase().includes(lowercaseSearch)
      );
      setFilteredBorrowers(filtered);
    }
  }, [searchTerm]);

  const handleViewBorrower = (borrower: any) => {
    setSelectedBorrower(borrower);
  };

  const handleNewLoanApplication = (borrower: any) => {
    toast(
      <div className="space-y-2">
        <p className="font-semibold">New Loan Application</p>
        <p>Starting new loan application for {borrower.name}</p>
        <p className="text-sm text-muted-foreground">Customer since: {borrower.foundedYear}</p>
        <p className="text-sm text-muted-foreground">Credit Score: {borrower.creditScore}</p>
        <div className="flex gap-2 mt-2">
          <Button size="sm" onClick={() => navigate(`/applications?action=new&borrowerId=${borrower.id}`)}>
            Continue
          </Button>
        </div>
      </div>,
      { duration: 5000 }
    );
  };

  const handleContactBorrower = (borrower: any) => {
    toast(
      <div className="space-y-2">
        <p className="font-semibold">Contact {borrower.name}</p>
        <p>Primary Contact: {borrower.contactPerson}</p>
        <div className="flex flex-col gap-1 mt-2">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <span>{borrower.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            <span>{borrower.phone}</span>
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          <Button size="sm" onClick={() => toast.success(`Email sent to ${borrower.email}`)}>
            Send Email
          </Button>
          <Button variant="outline" size="sm" onClick={() => toast.success(`Call initiated to ${borrower.phone}`)}>
            Call
          </Button>
        </div>
      </div>,
      { duration: 6000 }
    );
  };

  const handleAddBorrower = () => {
    toast.info("Opening new borrower registration form");
    navigate('/borrowers/new');
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
            <Button onClick={handleAddBorrower}>
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
                  <Button variant="outline" size="sm" onClick={() => toast.info("Opening advanced filter options")}>
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
                    {filteredBorrowers.map((borrower) => (
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
                  <h3 className="mt-4 text-lg font-semibold">Corporate Filter</h3>
                  <p className="text-muted-foreground text-sm mt-2">Showing only corporate entities.</p>
                  <Button className="mt-4" onClick={() => {
                    setTab("all");
                    setSearchTerm("Corporation");
                  }}>
                    View Corporate Borrowers
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="individual">
                <div className="flex flex-col items-center justify-center py-8">
                  <Users className="h-16 w-16 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-semibold">Individual Filter</h3>
                  <p className="text-muted-foreground text-sm mt-2">Showing only individual borrowers.</p>
                  <Button className="mt-4" onClick={() => {
                    setTab("all");
                    setSearchTerm("Partnership");
                  }}>
                    View Individual Borrowers
                  </Button>
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


import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { 
  ShieldAlert, 
  CreditCard, 
  UserSearch, 
  FlagTriangleRight, 
  FileCheck, 
  CircleAlert,
  Shield,
  Clock,
  ChevronDown,
  FileSearch
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Mock data for fraud risk items
const fraudRiskItems = [
  {
    id: "FR001",
    applicationId: "APP78934",
    borrowerId: "B00123",
    borrowerName: "John Doe",
    riskScore: 87,
    status: "high-risk",
    fraudType: "Identity Theft",
    dateDetected: "2025-03-15",
    actionTaken: "Application Suspended",
    flaggedFields: ["SSN", "Employment History", "Bank Statements"],
    details: "Multiple inconsistencies in provided documentation. SSN has been flagged in multiple recent applications."
  },
  {
    id: "FR002",
    applicationId: "APP45621",
    borrowerId: "B00456",
    borrowerName: "Alice Smith",
    riskScore: 64,
    status: "medium-risk",
    fraudType: "Document Manipulation",
    dateDetected: "2025-03-28",
    actionTaken: "Additional Verification",
    flaggedFields: ["Income Proof", "Tax Documents"],
    details: "Potential document manipulation detected in income verification documents."
  },
  {
    id: "FR003",
    applicationId: "APP34567",
    borrowerId: "B00789",
    borrowerName: "Robert Johnson",
    riskScore: 32,
    status: "low-risk",
    fraudType: "Address Discrepancy",
    dateDetected: "2025-04-02",
    actionTaken: "Cleared After Verification",
    flaggedFields: ["Address"],
    details: "Minor address discrepancy that was verified and cleared."
  },
  {
    id: "FR004",
    applicationId: "APP98765",
    borrowerId: "B00234",
    borrowerName: "Emily Taylor",
    riskScore: 91,
    status: "high-risk",
    fraudType: "Synthetic Identity",
    dateDetected: "2025-04-10",
    actionTaken: "Referred to Investigations",
    flaggedFields: ["Identity Documents", "Credit History", "Employment Records"],
    details: "Potential synthetic identity detected. Credit file appears to be recently established with inconsistent records."
  },
  {
    id: "FR005",
    applicationId: "APP12345",
    borrowerId: "B00567",
    borrowerName: "Michael Brown",
    riskScore: 45,
    status: "medium-risk",
    fraudType: "Straw Borrower",
    dateDetected: "2025-04-12",
    actionTaken: "Manual Review",
    flaggedFields: ["Income vs. Expenses", "Property Records"],
    details: "Suspicious pattern of application similar to previous identified straw borrower cases."
  }
];

// Risk score thresholds
const RISK_SCORE_HIGH = 75;
const RISK_SCORE_MEDIUM = 40;

const getRiskBadge = (score: number) => {
  if (score >= RISK_SCORE_HIGH) {
    return <Badge className="bg-red-500 hover:bg-red-600">High Risk</Badge>;
  } else if (score >= RISK_SCORE_MEDIUM) {
    return <Badge className="bg-amber-500 hover:bg-amber-600">Medium Risk</Badge>;
  } else {
    return <Badge className="bg-green-500 hover:bg-green-600">Low Risk</Badge>;
  }
};

interface FraudAlertProps {
  alert: typeof fraudRiskItems[0];
}

const FraudAlert: React.FC<FraudAlertProps> = ({ alert }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-red-500" />
            <CardTitle className="text-lg">{alert.fraudType}</CardTitle>
          </div>
          {getRiskBadge(alert.riskScore)}
        </div>
        <CardDescription>
          Application #{alert.applicationId} - {alert.borrowerName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-2 text-sm">
          <div>
            <span className="font-medium">Risk Score:</span> {alert.riskScore}/100
          </div>
          <div>
            <span className="font-medium">Detected:</span> {alert.dateDetected}
          </div>
          <div>
            <span className="font-medium">Status:</span> {alert.actionTaken}
          </div>
          <div>
            <span className="font-medium">Alert ID:</span> {alert.id}
          </div>
        </div>
        
        <div className="mb-2">
          <span className="font-medium text-sm">Flagged Fields:</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {alert.flaggedFields.map((field) => (
              <Badge key={field} variant="outline" className="text-xs">{field}</Badge>
            ))}
          </div>
        </div>
        
        {expanded && (
          <>
            <Separator className="my-3" />
            <div className="mt-2">
              <h4 className="font-medium text-sm mb-1">Details:</h4>
              <p className="text-sm text-muted-foreground">{alert.details}</p>
            </div>
          </>
        )}
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="mt-2 w-full text-xs flex items-center justify-center"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Show Less" : "Show More"} 
          <ChevronDown className={`ml-1 h-4 w-4 ${expanded ? "rotate-180" : ""} transition-transform`} />
        </Button>
      </CardContent>
    </Card>
  );
};

// Filters component
const FraudFilters = () => {
  return (
    <div className="flex gap-2 mb-4 flex-wrap">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            Risk Level
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>All</DropdownMenuItem>
          <DropdownMenuItem>High Risk</DropdownMenuItem>
          <DropdownMenuItem>Medium Risk</DropdownMenuItem>
          <DropdownMenuItem>Low Risk</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            Fraud Type
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>All Types</DropdownMenuItem>
          <DropdownMenuItem>Identity Theft</DropdownMenuItem>
          <DropdownMenuItem>Document Manipulation</DropdownMenuItem>
          <DropdownMenuItem>Synthetic Identity</DropdownMenuItem>
          <DropdownMenuItem>Straw Borrower</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            Status
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>All Statuses</DropdownMenuItem>
          <DropdownMenuItem>Application Suspended</DropdownMenuItem>
          <DropdownMenuItem>Additional Verification</DropdownMenuItem>
          <DropdownMenuItem>Manual Review</DropdownMenuItem>
          <DropdownMenuItem>Cleared</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            Time Period
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Last 7 Days</DropdownMenuItem>
          <DropdownMenuItem>Last 30 Days</DropdownMenuItem>
          <DropdownMenuItem>Last 90 Days</DropdownMenuItem>
          <DropdownMenuItem>This Year</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

// Analytics overview cards
const FraudAnalytics = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            <div className="flex items-center">
              <ShieldAlert className="mr-2 h-4 w-4 text-red-500" />
              High Risk Alerts
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">2</div>
          <p className="text-xs text-muted-foreground">+5% from last month</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            <div className="flex items-center">
              <Shield className="mr-2 h-4 w-4 text-amber-500" />
              Total Fraud Alerts
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">5</div>
          <p className="text-xs text-muted-foreground">+12% from last month</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            <div className="flex items-center">
              <FileCheck className="mr-2 h-4 w-4 text-green-500" />
              Cleared Alerts
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">1</div>
          <p className="text-xs text-muted-foreground">-8% from last month</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4 text-blue-500" />
              Average Response Time
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">2.5 hrs</div>
          <p className="text-xs text-muted-foreground">Improved by 15%</p>
        </CardContent>
      </Card>
    </div>
  );
};

// Fraud Detection Rules table
const FraudRules = () => {
  const rules = [
    { id: 1, name: "Identity Verification Check", description: "Verifies borrower identity through multiple sources", status: "Active" },
    { id: 2, name: "Document Consistency Analysis", description: "Checks for inconsistencies across submitted documents", status: "Active" },
    { id: 3, name: "Address Verification", description: "Validates address against postal records", status: "Active" },
    { id: 4, name: "Employment History Check", description: "Verifies employment details with reported sources", status: "Active" },
    { id: 5, name: "Credit Report Analysis", description: "Flags suspicious credit report patterns", status: "Active" },
    { id: 6, name: "Bank Statement Authentication", description: "Verifies authenticity of bank statements", status: "Active" },
    { id: 7, name: "Income Validation", description: "Cross-checks income claims with third-party data", status: "Active" },
  ];
  
  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Fraud Detection Rules</h3>
        <Button size="sm">
          <FileSearch className="mr-2 h-4 w-4" />
          Run All Checks
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Rule Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rules.map((rule) => (
            <TableRow key={rule.id}>
              <TableCell className="font-medium">{rule.name}</TableCell>
              <TableCell>{rule.description}</TableCell>
              <TableCell>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  {rule.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const FraudRiskAgent = () => {
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <ShieldAlert className="mr-2 h-6 w-6 text-red-500" />
        <h1 className="text-2xl font-bold">Fraud Risk Agent</h1>
      </div>
      
      <Tabs defaultValue="alerts">
        <TabsList className="mb-4">
          <TabsTrigger value="alerts">
            <CircleAlert className="mr-2 h-4 w-4" />
            Fraud Alerts
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <CreditCard className="mr-2 h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="rules">
            <FlagTriangleRight className="mr-2 h-4 w-4" />
            Detection Rules
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="alerts">
          <FraudFilters />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fraudRiskItems.map((alert) => (
              <FraudAlert key={alert.id} alert={alert} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="analytics">
          <FraudAnalytics />
          
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Fraud Detection by Category</h3>
            <Card>
              <CardContent className="pt-6">
                <div className="h-[300px] flex items-center justify-center">
                  <p className="text-muted-foreground">Fraud detection analytics visualization would appear here</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-md">Fraud by Application Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center">
                  <p className="text-muted-foreground">Chart visualization would appear here</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-md">Fraud Detection Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center">
                  <p className="text-muted-foreground">Timeline visualization would appear here</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="rules">
          <FraudRules />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FraudRiskAgent;

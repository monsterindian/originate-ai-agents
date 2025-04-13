
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Search, Filter, Clock, AlertTriangle, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const mockApplications = [
  {
    id: "APP-3845",
    borrower: "Sunrise Properties LLC",
    amount: "$2,200,000",
    dateSubmitted: "2024-04-05",
    stage: "Credit Review",
    progress: 75,
    assigned: "AI Agent",
    priority: "High",
    daysInStage: 3
  },
  {
    id: "APP-3848",
    borrower: "Evergreen Developments",
    amount: "$4,500,000",
    dateSubmitted: "2024-04-01",
    stage: "Final Approval",
    progress: 95,
    assigned: "Maria Chen",
    priority: "Critical",
    daysInStage: 1
  },
  {
    id: "APP-3846",
    borrower: "Tech Solutions Inc",
    amount: "$550,000",
    dateSubmitted: "2024-04-07",
    stage: "Initial Review",
    progress: 45,
    assigned: "AI Agent",
    priority: "Medium",
    daysInStage: 2
  },
  {
    id: "APP-3849",
    borrower: "Coastal Shipping Co",
    amount: "$850,000",
    dateSubmitted: "2024-04-08",
    stage: "Document Verification",
    progress: 60,
    assigned: "James Wilson",
    priority: "Medium",
    daysInStage: 2
  },
  {
    id: "APP-3847",
    borrower: "Metro Medical Services",
    amount: "$1,200,000",
    dateSubmitted: "2024-04-10",
    stage: "Initial Review",
    progress: 30,
    assigned: "AI Agent",
    priority: "Low",
    daysInStage: 1
  }
];

const mockCompletedApplications = [
  {
    id: "APP-3830",
    borrower: "Mountain View Resorts",
    amount: "$3,400,000",
    dateSubmitted: "2024-03-27",
    decision: "Approved",
    completionDate: "2024-04-05",
    underwriter: "Sarah Johnson"
  },
  {
    id: "APP-3832",
    borrower: "Downtown Retail Inc",
    amount: "$1,200,000",
    dateSubmitted: "2024-03-29",
    decision: "Rejected",
    completionDate: "2024-04-07",
    underwriter: "AI Agent"
  },
  {
    id: "APP-3835",
    borrower: "Harbor Storage LLC",
    amount: "$800,000",
    dateSubmitted: "2024-03-31",
    decision: "Approved with Conditions",
    completionDate: "2024-04-08",
    underwriter: "James Wilson"
  }
];

const getBadgeColor = (priority: string) => {
  if (priority === "Critical") return "destructive";
  if (priority === "High") return "warning";
  if (priority === "Medium") return "default";
  return "secondary";
};

const getDecisionBadge = (decision: string) => {
  if (decision === "Approved") return <Badge variant="success">Approved</Badge>;
  if (decision === "Rejected") return <Badge variant="destructive">Rejected</Badge>;
  return <Badge variant="warning">Approved with Conditions</Badge>;
};

const getProgressColor = (progress: number) => {
  if (progress < 50) return "bg-blue-500";
  if (progress < 80) return "bg-amber-500";
  return "bg-green-500";
};

const getInitials = (name: string) => {
  if (name === "AI Agent") return "AI";
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

const Underwriting = () => {
  const [tab, setTab] = useState("active");
  const [searchTerm, setSearchTerm] = useState("");
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Underwriting</h1>
            <p className="text-muted-foreground">
              Review and process loan applications through underwriting
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button>
              <Loader2 className="mr-2 h-4 w-4" />
              Assign
            </Button>
          </div>
        </div>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium">Active Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">In underwriting process</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium">Critical Priority</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <div className="flex items-center gap-1 text-xs text-red-500">
                <AlertTriangle className="h-3 w-3" />
                <span>Needs immediate attention</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium">Avg. Process Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3.2 days</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>Last 30 days</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium">AI-Processed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">60%</div>
              <p className="text-xs text-muted-foreground">Of all applications</p>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Underwriting Workspace</CardTitle>
            <CardDescription>Access all tools needed for credit analysis and risk assessment.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={tab} onValueChange={setTab} className="w-full">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                <TabsList>
                  <TabsTrigger value="active">In Process</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>
                
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search applications..."
                    className="pl-8 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <TabsContent value="active" className="w-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Application ID</TableHead>
                      <TableHead>Borrower</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Current Stage</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Time in Stage</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockApplications.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell className="font-medium">{app.id}</TableCell>
                        <TableCell>{app.borrower}</TableCell>
                        <TableCell>{app.amount}</TableCell>
                        <TableCell>{app.stage}</TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <Progress value={app.progress} className={`h-2 ${getProgressColor(app.progress)}`} />
                            <span className="text-xs text-muted-foreground">{app.progress}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs">{getInitials(app.assigned)}</AvatarFallback>
                            </Avatar>
                            <span>{app.assigned}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getBadgeColor(app.priority) as any}>{app.priority}</Badge>
                        </TableCell>
                        <TableCell>{app.daysInStage} day{app.daysInStage !== 1 ? 's' : ''}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">Review</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
              
              <TabsContent value="completed">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Application ID</TableHead>
                      <TableHead>Borrower</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date Submitted</TableHead>
                      <TableHead>Decision</TableHead>
                      <TableHead>Completion Date</TableHead>
                      <TableHead>Underwriter</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockCompletedApplications.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell className="font-medium">{app.id}</TableCell>
                        <TableCell>{app.borrower}</TableCell>
                        <TableCell>{app.amount}</TableCell>
                        <TableCell>{app.dateSubmitted}</TableCell>
                        <TableCell>
                          {getDecisionBadge(app.decision)}
                        </TableCell>
                        <TableCell>{app.completionDate}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs">{getInitials(app.underwriter)}</AvatarFallback>
                            </Avatar>
                            <span>{app.underwriter}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">View</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Underwriting;


import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Search, Filter, Download, AlertCircle, CheckCircle2, Clock, ArrowUpDown, 
  FileText, UserCheck, Building, BarChart4, PiggyBank, ShieldCheck
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const mockApplications = [
  {
    id: "APP-2023-0523",
    borrower: "Quantum Holdings LLC",
    amount: "$2,500,000",
    type: "Commercial Real Estate",
    status: "In Progress",
    progress: 65,
    date: "May 23, 2023",
    notes: "Missing tax returns for 2021-2022"
  },
  {
    id: "APP-2023-0518",
    borrower: "Atlas Logistics Inc.",
    amount: "$1,800,000",
    type: "Equipment Finance",
    status: "Complete",
    progress: 100,
    date: "May 18, 2023",
    notes: "All documentation verified"
  },
  {
    id: "APP-2023-0511",
    borrower: "Meridian Healthcare Partners",
    amount: "$4,200,000",
    type: "Commercial Real Estate",
    status: "In Progress",
    progress: 85,
    date: "May 11, 2023",
    notes: "Pending environmental assessment"
  },
  {
    id: "APP-2023-0505",
    borrower: "SunCoast Hospitality Group",
    amount: "$3,750,000",
    type: "Commercial Real Estate",
    status: "Pending Review",
    progress: 40,
    date: "May 5, 2023",
    notes: "Waiting for property appraisal"
  },
  {
    id: "APP-2023-0429",
    borrower: "GreenField Agricultural Supplies",
    amount: "$950,000",
    type: "Working Capital",
    status: "In Progress",
    progress: 75,
    date: "April 29, 2023",
    notes: "Pending business plan review"
  }
];

const mockTasks = [
  {
    id: "TASK-001",
    application: "APP-2023-0523",
    task: "Financial Statement Analysis",
    assignee: "John Anderson",
    dueDate: "May 30, 2023",
    priority: "High",
    status: "In Progress"
  },
  {
    id: "TASK-002",
    application: "APP-2023-0523",
    task: "Tax Return Verification",
    assignee: "Sarah Miller",
    dueDate: "May 29, 2023",
    priority: "High",
    status: "Pending"
  },
  {
    id: "TASK-003",
    application: "APP-2023-0511",
    task: "Environmental Assessment Review",
    assignee: "Robert Chen",
    dueDate: "May 28, 2023",
    priority: "Medium",
    status: "In Progress"
  },
  {
    id: "TASK-004",
    application: "APP-2023-0505",
    task: "Property Appraisal",
    assignee: "Jennifer Taylor",
    dueDate: "May 27, 2023",
    priority: "Medium",
    status: "Completed"
  },
  {
    id: "TASK-005",
    application: "APP-2023-0429",
    task: "Business Plan Review",
    assignee: "Michael Rodriguez",
    dueDate: "May 26, 2023",
    priority: "Low",
    status: "In Progress"
  }
];

const getStatusColor = (status: string) => {
  if (status === "Complete" || status === "Completed") return "default";
  if (status === "In Progress") return "secondary";
  if (status === "Pending" || status === "Pending Review") return "outline";
  return "destructive";
};

const getPriorityColor = (priority: string) => {
  if (priority === "Low") return "default";
  if (priority === "Medium") return "secondary";
  return "destructive";
};

const Underwriting = () => {
  const [tab, setTab] = useState("applications");
  const [searchTerm, setSearchTerm] = useState("");
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Underwriting</h1>
            <p className="text-muted-foreground">
              Manage and review loan applications in the underwriting process
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button size="sm">
              <ShieldCheck className="mr-2 h-4 w-4" />
              Review Applications
            </Button>
          </div>
        </div>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium">Open Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <div className="flex items-center gap-1 text-xs text-amber-500">
                <Clock className="h-3 w-3" />
                <span>4 require attention</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium">Assigned Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <div className="flex items-center gap-1 text-xs text-red-500">
                <AlertCircle className="h-3 w-3" />
                <span>7 past due</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium">Completed Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <div className="flex items-center gap-1 text-xs text-green-500">
                <CheckCircle2 className="h-3 w-3" />
                <span>This month</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium">Avg. Review Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5.2 days</div>
              <div className="flex items-center gap-1 text-xs text-green-500">
                <CheckCircle2 className="h-3 w-3" />
                <span>-1.3 days from last month</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Underwriting Dashboard</CardTitle>
            <CardDescription>Manage applications in the underwriting process and assigned tasks.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={tab} onValueChange={setTab} className="w-full">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                <TabsList>
                  <TabsTrigger value="applications">Applications</TabsTrigger>
                  <TabsTrigger value="tasks">Tasks</TabsTrigger>
                </TabsList>
                
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-60">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search..."
                      className="pl-8 w-full"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[120px]">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="inprogress">In Progress</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="complete">Complete</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <TabsContent value="applications" className="w-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <div className="flex items-center gap-1">
                          ID <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead>Borrower</TableHead>
                      <TableHead>Loan Details</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockApplications.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell className="font-medium">{app.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-muted-foreground" />
                            {app.borrower}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{app.amount}</div>
                            <div className="text-muted-foreground">{app.type}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="w-full">
                            <div className="flex justify-between text-xs mb-1">
                              <span>Review Progress</span>
                              <span>{app.progress}%</span>
                            </div>
                            <Progress value={app.progress} className="h-2" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(app.status) as "default" | "secondary" | "outline" | "destructive"}>
                            {app.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{app.date}</TableCell>
                        <TableCell>
                          <div className="max-w-[200px] truncate" title={app.notes}>
                            {app.notes}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" title="View Application">
                              <FileText className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" title="View Borrower">
                              <UserCheck className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" title="View Financial Analysis">
                              <BarChart4 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
              
              <TabsContent value="tasks" className="w-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <div className="flex items-center gap-1">
                          Task <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead>Application</TableHead>
                      <TableHead>Assignee</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockTasks.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell className="font-medium">{task.task}</TableCell>
                        <TableCell>{task.application}</TableCell>
                        <TableCell>{task.assignee}</TableCell>
                        <TableCell>{task.dueDate}</TableCell>
                        <TableCell>
                          <Badge variant={getPriorityColor(task.priority) as "default" | "secondary" | "destructive"}>
                            {task.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(task.status) as "default" | "secondary" | "outline" | "destructive"}>
                            {task.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" title="View Task">
                              <FileText className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" title="View Application">
                              <PiggyBank className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" title="Assign Task">
                              <UserCheck className="h-4 w-4" />
                            </Button>
                          </div>
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

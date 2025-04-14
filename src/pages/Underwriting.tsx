
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
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const mockApplications = [
  {
    id: "APP-2023-0523",
    borrower: "Quantum Holdings LLC",
    amount: "$2,500,000",
    type: "Commercial Real Estate",
    status: "In Progress",
    progress: 65,
    date: "May 23, 2023",
    notes: "Missing tax returns for 2021-2022",
    risk: {
      level: "Medium",
      factors: ["Debt service coverage ratio below target", "Limited operating history"],
      score: 68,
      debtToIncome: "42%",
      loanToValue: "75%",
      creditUtilization: "62%"
    }
  },
  {
    id: "APP-2023-0518",
    borrower: "Atlas Logistics Inc.",
    amount: "$1,800,000",
    type: "Equipment Finance",
    status: "Complete",
    progress: 100,
    date: "May 18, 2023",
    notes: "All documentation verified",
    risk: {
      level: "Low",
      factors: ["Strong cash flow", "Excellent payment history", "Established business"],
      score: 85,
      debtToIncome: "34%",
      loanToValue: "65%",
      creditUtilization: "48%"
    }
  },
  {
    id: "APP-2023-0511",
    borrower: "Meridian Healthcare Partners",
    amount: "$4,200,000",
    type: "Commercial Real Estate",
    status: "In Progress",
    progress: 85,
    date: "May 11, 2023",
    notes: "Pending environmental assessment",
    risk: {
      level: "Medium",
      factors: ["Property in flood zone", "Specialized collateral", "Regulatory compliance concerns"],
      score: 62,
      debtToIncome: "39%",
      loanToValue: "78%",
      creditUtilization: "55%"
    }
  },
  {
    id: "APP-2023-0505",
    borrower: "SunCoast Hospitality Group",
    amount: "$3,750,000",
    type: "Commercial Real Estate",
    status: "Pending Review",
    progress: 40,
    date: "May 5, 2023",
    notes: "Waiting for property appraisal",
    risk: {
      level: "High",
      factors: ["Seasonal revenue fluctuations", "Industry volatility post-pandemic", "High debt load"],
      score: 45,
      debtToIncome: "48%",
      loanToValue: "82%",
      creditUtilization: "75%"
    }
  },
  {
    id: "APP-2023-0429",
    borrower: "GreenField Agricultural Supplies",
    amount: "$950,000",
    type: "Working Capital",
    status: "In Progress",
    progress: 75,
    date: "April 29, 2023",
    notes: "Pending business plan review",
    risk: {
      level: "Low",
      factors: ["Strong collateral", "Consistent revenue growth", "Low existing debt"],
      score: 78,
      debtToIncome: "35%",
      loanToValue: "60%",
      creditUtilization: "42%"
    }
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
  if (status === "Complete" || status === "Completed") return "success";
  if (status === "In Progress") return "secondary";
  if (status === "Pending" || status === "Pending Review") return "outline";
  return "destructive";
};

const getPriorityColor = (priority: string) => {
  if (priority === "Low") return "success";
  if (priority === "Medium") return "secondary";
  return "destructive";
};

const getRiskColor = (level: string) => {
  if (level === "Low") return "success";
  if (level === "Medium") return "warning";
  return "destructive";
};

const Underwriting = () => {
  const [tab, setTab] = useState("applications");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  
  const handleViewApplication = (appId: string) => {
    navigate(`/applications?id=${appId}`);
  };
  
  const handleViewBorrower = (borrower: string) => {
    // Convert borrower name to a simulated ID for navigation
    const borrowerId = "B-" + borrower.split(" ")[0].toUpperCase();
    navigate(`/borrowers?id=${borrowerId}`);
  };
  
  const handleGenerateReport = (appId: string) => {
    toast.success(`Generating underwriting report for ${appId}`);
    
    setTimeout(() => {
      toast(
        <div className="space-y-2">
          <p className="font-semibold">Underwriting Report Ready</p>
          <p>Report for {appId} has been generated</p>
          <div className="flex gap-2 mt-2">
            <Button size="sm" onClick={() => {
              const win = window.open("", "_blank");
              if (win) {
                win.document.write(`
                  <html>
                    <head>
                      <title>Underwriting Report - ${appId}</title>
                      <style>
                        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
                        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
                        .logo { max-width: 200px; }
                        h1 { color: #333; }
                        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                        th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
                        th { background-color: #f2f2f2; }
                        .risk-high { color: #e11d48; font-weight: 600; }
                        .risk-medium { color: #f59e0b; font-weight: 600; }
                        .risk-low { color: #10b981; font-weight: 600; }
                        .metric { color: #2563eb; font-weight: 600; }
                      </style>
                    </head>
                    <body>
                      <div class="header">
                        <div>
                          <h1>Underwriting Report</h1>
                          <p>Application ID: ${appId}</p>
                          <p>Date: ${new Date().toLocaleDateString()}</p>
                        </div>
                        <img src="/lovable-uploads/c358cff4-5e06-49e8-af0b-d9e4c7099001.png" class="logo" alt="GaIGentic Logo">
                      </div>
                      
                      <h2>Application Details</h2>
                      <table>
                        <tr>
                          <th>Borrower</th>
                          <td>${mockApplications.find(a => a.id === appId)?.borrower || 'N/A'}</td>
                        </tr>
                        <tr>
                          <th>Amount</th>
                          <td>${mockApplications.find(a => a.id === appId)?.amount || 'N/A'}</td>
                        </tr>
                        <tr>
                          <th>Type</th>
                          <td>${mockApplications.find(a => a.id === appId)?.type || 'N/A'}</td>
                        </tr>
                        <tr>
                          <th>Date Submitted</th>
                          <td>${mockApplications.find(a => a.id === appId)?.date || 'N/A'}</td>
                        </tr>
                        <tr>
                          <th>Status</th>
                          <td>${mockApplications.find(a => a.id === appId)?.status || 'N/A'}</td>
                        </tr>
                      </table>
                      
                      <h2>Risk Assessment</h2>
                      <table>
                        <tr>
                          <th>Risk Level</th>
                          <td class="risk-${mockApplications.find(a => a.id === appId)?.risk.level.toLowerCase() || 'medium'}">${mockApplications.find(a => a.id === appId)?.risk.level || 'N/A'}</td>
                        </tr>
                        <tr>
                          <th>Risk Score</th>
                          <td>${mockApplications.find(a => a.id === appId)?.risk.score || 'N/A'}/100</td>
                        </tr>
                        <tr>
                          <th>Debt-to-Income Ratio</th>
                          <td><span class="metric">Debt-to-Income Ratio:</span> ${mockApplications.find(a => a.id === appId)?.risk.debtToIncome || 'N/A'}</td>
                        </tr>
                        <tr>
                          <th>Loan-to-Value Ratio</th>
                          <td><span class="metric">Loan-to-Value Ratio:</span> ${mockApplications.find(a => a.id === appId)?.risk.loanToValue || 'N/A'}</td>
                        </tr>
                        <tr>
                          <th>Credit Utilization</th>
                          <td><span class="metric">Credit Utilization:</span> ${mockApplications.find(a => a.id === appId)?.risk.creditUtilization || 'N/A'}</td>
                        </tr>
                      </table>
                      
                      <h2>Risk Factors</h2>
                      <ul>
                        ${mockApplications.find(a => a.id === appId)?.risk.factors.map(factor => {
                          let className = '';
                          if (factor.toLowerCase().includes('debt') || factor.toLowerCase().includes('ratio') || factor.toLowerCase().includes('utilization')) {
                            className = 'metric';
                          } else if (factor.toLowerCase().includes('strong') || factor.toLowerCase().includes('excellent') || factor.toLowerCase().includes('low')) {
                            className = 'risk-low';
                          } else if (factor.toLowerCase().includes('below') || factor.toLowerCase().includes('limited')) {
                            className = 'risk-medium';
                          } else if (factor.toLowerCase().includes('high') || factor.toLowerCase().includes('concern') || factor.toLowerCase().includes('volatile')) {
                            className = 'risk-high';
                          }
                          return `<li><span class="${className}">${factor}</span></li>`;
                        }).join('') || '<li>No risk factors identified</li>'}
                      </ul>
                      
                      <h2>Notes</h2>
                      <p>${mockApplications.find(a => a.id === appId)?.notes || 'No notes available'}</p>
                      
                      <div style="margin-top: 50px;">
                        <p><strong>Prepared by:</strong> GaIGentic Underwriting Team</p>
                        <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                      </div>
                    </body>
                  </html>
                `);
                win.document.close();
              }
            }}>
              View Report
            </Button>
            <Button size="sm" variant="outline">
              Download PDF
            </Button>
          </div>
        </div>,
        { duration: 10000 }
      );
    }, 1500);
  };
  
  const filteredApplications = mockApplications.filter(app => 
    app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.borrower.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.status.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
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
                  <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
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
                    {filteredApplications.map((app) => (
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
                          <Badge variant={getStatusColor(app.status) as "success" | "secondary" | "outline" | "destructive" | "warning"}>
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
                            <Button variant="ghost" size="icon" title="View Application" onClick={() => handleViewApplication(app.id)}>
                              <FileText className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" title="View Borrower" onClick={() => handleViewBorrower(app.borrower)}>
                              <UserCheck className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" title="Generate Financial Report" onClick={() => handleGenerateReport(app.id)}>
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
                          <Badge variant={getPriorityColor(task.priority) as "success" | "secondary" | "destructive"}>
                            {task.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(task.status) as "success" | "secondary" | "outline" | "destructive" | "warning"}>
                            {task.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" title="View Task"
                              onClick={() => toast.info(`Viewing details for task ${task.id}`)}>
                              <FileText className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" title="View Application" 
                              onClick={() => handleViewApplication(task.application)}>
                              <PiggyBank className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" title="Assign Task"
                              onClick={() => toast.info(`Opening assignment dialog for task ${task.id}`)}>
                              <UserCheck className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
              
              <TabsContent value="risk" className="w-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Application</TableHead>
                      <TableHead>Borrower</TableHead>
                      <TableHead>Risk Rating</TableHead>
                      <TableHead>Risk Score</TableHead>
                      <TableHead>Key Metrics</TableHead>
                      <TableHead>Risk Factors</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplications.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell className="font-medium">{app.id}</TableCell>
                        <TableCell>{app.borrower}</TableCell>
                        <TableCell>
                          <Badge variant={getRiskColor(app.risk.level) as "success" | "warning" | "destructive"}>
                            {app.risk.level} Risk
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={app.risk.score} className="h-2 w-16" />
                            <span className="text-sm">{app.risk.score}/100</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm space-y-1">
                            <div>DTI: {app.risk.debtToIncome}</div>
                            <div>LTV: {app.risk.loanToValue}</div>
                            <div>Credit Util: {app.risk.creditUtilization}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-[200px]">
                            <ul className="text-xs list-disc pl-4">
                              {app.risk.factors.slice(0, 2).map((factor, idx) => (
                                <li key={idx}>{factor}</li>
                              ))}
                              {app.risk.factors.length > 2 && (
                                <li className="text-muted-foreground">+{app.risk.factors.length - 2} more</li>
                              )}
                            </ul>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" title="View Full Risk Analysis" 
                              onClick={() => handleGenerateReport(app.id)}>
                              <FileText className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" title="View Application" 
                              onClick={() => handleViewApplication(app.id)}>
                              <PiggyBank className="h-4 w-4" />
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

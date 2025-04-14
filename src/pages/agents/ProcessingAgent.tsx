import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Search, CheckCircle, AlertCircle, Clock, FileText, Loader2, FileCheck, ArrowRight, Eye, Download, UserCheck, MessagesSquare } from "lucide-react";
import OpenAIStatusIndicator from "@/components/agents/OpenAIStatusIndicator";
import ApplicationDetailModal from "@/components/modals/ApplicationDetailModal";
import DocumentGenerator from "@/components/DocumentGenerator";
import { toast } from "sonner";
import { getMockLoanApplications, getMockLoanApplicationById } from "@/services/mockDataService";
import { Document, LoanApplication, LoanStatus } from "@/types";
import { useNavigate } from "react-router-dom";

const mockProcessingTasks = [
  {
    id: "APP-3846",
    borrower: "Tech Solutions Inc",
    status: "Document Collection",
    dateSubmitted: "2024-04-07",
    completeness: 45,
    priority: "High",
    missingDocuments: ["Financial Statements", "Business Plan"],
    estimatedCompletion: "2024-04-17",
    assetClass: "Equipment",
    amount: "$850,000",
    purpose: "Equipment Purchase"
  },
  {
    id: "APP-3847",
    borrower: "Metro Medical Services",
    status: "Initial Review",
    dateSubmitted: "2024-04-10",
    completeness: 30,
    priority: "Medium",
    missingDocuments: ["Tax Returns", "Proof of Collateral", "Business License"],
    estimatedCompletion: "2024-04-20",
    assetClass: "Business",
    amount: "$1,200,000",
    purpose: "Business Expansion"
  },
  {
    id: "APP-3849",
    borrower: "Coastal Shipping Co",
    status: "Document Verification",
    dateSubmitted: "2024-04-08",
    completeness: 60,
    priority: "Medium",
    missingDocuments: ["Property Appraisal"],
    estimatedCompletion: "2024-04-15",
    assetClass: "Working Capital",
    amount: "$750,000",
    purpose: "Working Capital"
  }
];

const documentStatuses = [
  { 
    id: "DOC-1", 
    appId: "APP-3846", 
    name: "Business Registration", 
    status: "verified", 
    uploadDate: "2024-04-07", 
    aiVerified: true 
  },
  { 
    id: "DOC-2", 
    appId: "APP-3846", 
    name: "Identity Verification", 
    status: "verified", 
    uploadDate: "2024-04-07", 
    aiVerified: true 
  },
  { 
    id: "DOC-3", 
    appId: "APP-3846", 
    name: "Financial Statements", 
    status: "pending", 
    uploadDate: "-", 
    aiVerified: false 
  },
  { 
    id: "DOC-4", 
    appId: "APP-3847", 
    name: "Business Registration", 
    status: "verified", 
    uploadDate: "2024-04-10", 
    aiVerified: true 
  },
  { 
    id: "DOC-5", 
    appId: "APP-3847", 
    name: "Tax Returns", 
    status: "pending", 
    uploadDate: "-", 
    aiVerified: false 
  },
  { 
    id: "DOC-6", 
    appId: "APP-3849", 
    name: "Business Registration", 
    status: "verified", 
    uploadDate: "2024-04-08", 
    aiVerified: true 
  },
  { 
    id: "DOC-7", 
    appId: "APP-3849", 
    name: "Financial Statements", 
    status: "verified", 
    uploadDate: "2024-04-09", 
    aiVerified: true 
  },
  { 
    id: "DOC-8", 
    appId: "APP-3849", 
    name: "Property Appraisal", 
    status: "pending", 
    uploadDate: "-", 
    aiVerified: false 
  }
];

const ProcessingAgent = () => {
  const [tab, setTab] = useState("applications");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApplication, setSelectedApplication] = useState<LoanApplication | null>(null);
  const [processingTask, setProcessingTask] = useState<string | null>(null);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [showDocumentGenerator, setShowDocumentGenerator] = useState<{show: boolean, appId: string} | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (processingTask) {
      const interval = setInterval(() => {
        setProcessingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            toast.success(`Document verification complete for ${processingTask}`);
            setProcessingTask(null);
            return 0;
          }
          return prev + 10;
        });
      }, 500);
      
      return () => clearInterval(interval);
    }
  }, [processingTask]);

  const handleViewApplication = (task: any) => {
    const realApp = getMockLoanApplicationById(task.id);
    
    if (realApp) {
      setSelectedApplication(realApp);
    } else {
      const mockApplication: LoanApplication = {
        id: task.id,
        borrowerId: `B-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        borrower: {
          id: `B-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
          firstName: task.borrower.split(' ')[0] || "John",
          lastName: task.borrower.split(' ').slice(1).join(' ') || "Doe",
          companyName: task.borrower,
          email: `info@${task.borrower.toLowerCase().replace(/\s+/g, '')}.com`,
          phone: `(${Math.floor(Math.random() * 900) + 100})-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
          address: {
            street: "123 Main St",
            city: "Anytown",
            state: "CA",
            zipCode: "12345",
            country: "USA"
          },
          creditScore: Math.floor(Math.random() * 300) + 550,
          creditRating: "Good",
          dateCreated: new Date().toISOString().split('T')[0],
          dateUpdated: new Date().toISOString().split('T')[0]
        },
        assetClass: task.assetClass?.toLowerCase().includes("equipment") ? "equipment_finance" : 
                  task.assetClass?.toLowerCase().includes("capital") ? "sme_loan" : "commercial_real_estate",
        amount: typeof task.amount === 'string' ? 
                parseInt(task.amount.replace(/[$,]/g, '')) : 
                Math.floor(Math.random() * 500000) + 50000,
        term: 36,
        interestRate: 5.25,
        purpose: task.purpose || "Business Expansion",
        completeness: task.completeness || 50,
        displayStatus: task.status || "In Review",
        risk: task.priority === "High" ? "High" : task.priority === "Medium" ? "Medium" : "Low",
        status: "reviewing" as LoanStatus,
        documents: documentStatuses
          .filter(doc => doc.appId === task.id)
          .map(doc => ({
            id: doc.id,
            name: doc.name,
            type: doc.name.includes("Registration") ? "Registration" : 
                 doc.name.includes("Verification") ? "Identity" : 
                 doc.name.includes("Financial") ? "Financial" : 
                 doc.name.includes("Tax") ? "Tax" : "Other",
            url: "http://example.com/doc1",
            uploadedBy: "borrower",
            uploadedAt: doc.uploadDate !== "-" ? doc.uploadDate : new Date().toISOString().split('T')[0],
            status: doc.status === "verified" ? "verified" : doc.status === "rejected" ? "rejected" : "pending",
            aiAnalysisComplete: doc.aiVerified,
            aiAnalysisSummary: doc.aiVerified ? "Document appears to be authentic." : undefined
          })) as Document[],
        notes: [
          {
            id: "NOTE-1",
            content: "Initial review completed. Awaiting additional documentation.",
            createdBy: "Agent",
            createdAt: new Date().toISOString().split('T')[0],
            isAgentNote: true
          }
        ],
        dateCreated: new Date().toISOString().split('T')[0],
        dateUpdated: new Date().toISOString().split('T')[0],
        dateSubmitted: task.dateSubmitted,
        agentAssignments: {
          intakeAgentId: "intake-123",
          processingAgentId: "processing-456"
        }
      };
      
      setSelectedApplication(mockApplication);
    }
  };

  const handleVerifyDocuments = (appId: string) => {
    setProcessingTask(appId);
    toast.info(`AI document verification started for ${appId}`);
  };

  const handleSendToUnderwriting = (appId: string) => {
    toast.success(`Application ${appId} sent to Underwriting Agent`);
    navigate(`/agents/underwriting?applicationId=${appId}`);
  };

  const handleRequestDocument = (appId: string, document: string) => {
    toast.info(`Document request sent for ${document} on application ${appId}`);
    
    setTimeout(() => {
      toast(
        <div className="space-y-2">
          <p className="font-semibold">Document Request Sent</p>
          <p>Request for {document} has been sent to the borrower</p>
          <div className="flex gap-2 mt-2">
            <Button size="sm" onClick={() => navigate(`/applications?id=${appId}`)}>
              View Application
            </Button>
          </div>
        </div>,
        { duration: 5000 }
      );
    }, 1000);
  };
  
  const handleGenerateDocumentSummary = (appId: string) => {
    const app = mockProcessingTasks.find(task => task.id === appId);
    if (!app) return;
    
    setShowDocumentGenerator({
      show: true,
      appId
    });
  };
  
  const handleViewBorrower = (borrower: string) => {
    const borrowerId = "B-" + borrower.split(" ")[0].toUpperCase();
    navigate(`/borrowers?id=${borrowerId}`);
  };

  const getPriorityBadge = (priority: string) => {
    if (priority === "High") return <Badge variant="destructive">High</Badge>;
    if (priority === "Medium") return <Badge variant="secondary">Medium</Badge>;
    return <Badge variant="outline">Low</Badge>;
  };

  const getStatusBadge = (status: string) => {
    if (status === "verified") return <Badge variant="success">Verified</Badge>;
    return <Badge variant="outline">Pending</Badge>;
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Processing Agent</h1>
            <p className="text-muted-foreground">
              AI agent for handling loan processing tasks
            </p>
          </div>
          <OpenAIStatusIndicator />
        </div>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium">Active Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockProcessingTasks.length}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>In document collection phase</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium">Documents Processed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {documentStatuses.filter(doc => doc.status === "verified").length}
              </div>
              <div className="flex items-center gap-1 text-xs text-green-500">
                <CheckCircle className="h-3 w-3" />
                <span>Verified documents</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium">Documents Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {documentStatuses.filter(doc => doc.status === "pending").length}
              </div>
              <div className="flex items-center gap-1 text-xs text-amber-500">
                <AlertCircle className="h-3 w-3" />
                <span>Awaiting upload or verification</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium">Average Processing Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.3 days</div>
              <div className="flex items-center gap-1 text-xs text-green-500">
                <CheckCircle className="h-3 w-3" />
                <span>Faster than target</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Processing Agent Dashboard</CardTitle>
            <CardDescription>Automated document verification, validation, and processing status tracking.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={tab} onValueChange={setTab} className="w-full">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                <TabsList>
                  <TabsTrigger value="applications">Applications</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                </TabsList>
                
                <div className="relative w-full sm:w-60">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    className="pl-8 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <TabsContent value="applications" className="w-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Application ID</TableHead>
                      <TableHead>Borrower</TableHead>
                      <TableHead>Loan Details</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Missing Documents</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockProcessingTasks.filter(task => 
                      task.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      task.borrower.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      task.status.toLowerCase().includes(searchTerm.toLowerCase())
                    ).map((task) => (
                      <TableRow key={task.id}>
                        <TableCell className="font-medium">{task.id}</TableCell>
                        <TableCell>
                          <div>
                            <div>{task.borrower}</div>
                            <div className="text-xs text-muted-foreground">{task.assetClass}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div>{task.amount}</div>
                            <div className="text-xs text-muted-foreground">{task.purpose}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{task.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="w-full">
                            <Progress value={task.completeness} className="h-2" />
                            <div className="text-xs text-muted-foreground mt-1">{task.completeness}% complete</div>
                          </div>
                        </TableCell>
                        <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                        <TableCell>
                          <div className="max-w-[200px]">
                            {task.missingDocuments.length > 0 ? (
                              <div className="text-sm text-amber-600">
                                Missing {task.missingDocuments.length} document(s)
                              </div>
                            ) : (
                              <div className="text-sm text-green-600">All documents received</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" onClick={() => handleViewApplication(task)} title="View Application">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleVerifyDocuments(task.id)}
                              disabled={!!processingTask}
                              title="Verify Documents"
                            >
                              <FileCheck className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleGenerateDocumentSummary(task.id)}
                              title="Generate Document Summary"
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleSendToUnderwriting(task.id)}
                              disabled={task.completeness < 70}
                              title="Send to Underwriting"
                            >
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                {processingTask && (
                  <div className="mt-4 p-4 border rounded-md bg-muted/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <div className="font-medium">Processing Documents for {processingTask}</div>
                    </div>
                    <Progress value={processingProgress} className="h-2" />
                    <div className="text-xs text-muted-foreground mt-1">AI document verification in progress...</div>
                  </div>
                )}
                
                {showDocumentGenerator && (
                  <div className="mt-4 p-4 border rounded-md">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium">Generate Document Summary for {showDocumentGenerator.appId}</h3>
                      <Button variant="outline" size="sm" onClick={() => setShowDocumentGenerator(null)}>
                        Close
                      </Button>
                    </div>
                    
                    <DocumentGenerator 
                      documentType="application" 
                      applicationData={{
                        ...mockProcessingTasks.find(t => t.id === showDocumentGenerator.appId),
                        borrower: {
                          companyName: mockProcessingTasks.find(t => t.id === showDocumentGenerator.appId)?.borrower,
                          address: {
                            street: "123 Business Ave",
                            city: "Commerce City",
                            state: "CA",
                            zipCode: "90001",
                            country: "USA"
                          }
                        }
                      }}
                      onClose={() => setShowDocumentGenerator(null)}
                    />
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="documents" className="w-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document ID</TableHead>
                      <TableHead>Application</TableHead>
                      <TableHead>Document Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Upload Date</TableHead>
                      <TableHead>AI Verified</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documentStatuses.filter(doc => 
                      doc.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      doc.appId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      doc.name.toLowerCase().includes(searchTerm.toLowerCase())
                    ).map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell className="font-medium">{doc.id}</TableCell>
                        <TableCell>{doc.appId}</TableCell>
                        <TableCell>{doc.name}</TableCell>
                        <TableCell>{getStatusBadge(doc.status)}</TableCell>
                        <TableCell>{doc.uploadDate}</TableCell>
                        <TableCell>
                          {doc.aiVerified ? (
                            <div className="flex items-center text-green-600">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              <span>Yes</span>
                            </div>
                          ) : (
                            <div className="flex items-center text-muted-foreground">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>Pending</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {doc.status === "pending" ? (
                              <Button size="sm" variant="outline" onClick={() => handleRequestDocument(doc.appId, doc.name)}>
                                <MessagesSquare className="h-4 w-4 mr-2" />
                                Request Document
                              </Button>
                            ) : (
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline">
                                  <Eye className="h-4 w-4 mr-2" />
                                  View
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Download className="h-4 w-4 mr-2" />
                                  Download
                                </Button>
                              </div>
                            )}
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

export default ProcessingAgent;

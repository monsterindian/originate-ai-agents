import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { 
  FileCheck, Clock, AlertTriangle, FileX, MessageSquare, UserCheck, 
  FileText, Send, Download, Link, Printer, CheckCircle, Loader2,
  FileQuestion, Phone, Mail, Building, User, CalendarDays
} from "lucide-react";
import { LoanApplication } from "@/types";
import { formatCurrency } from "@/services/mockDataService";
import { toast } from "sonner";
import DocumentGenerator from "@/components/DocumentGenerator";

const statusIcons = {
  "Draft": <Clock className="h-4 w-4 text-slate-500" />,
  "Submitted": <Clock className="h-4 w-4 text-blue-500" />,
  "In Review": <Clock className="h-4 w-4 text-blue-500" />,
  "Information Needed": <AlertTriangle className="h-4 w-4 text-amber-500" />,
  "In Underwriting": <FileCheck className="h-4 w-4 text-indigo-500" />,
  "Approved": <CheckCircle className="h-4 w-4 text-green-500" />,
  "Conditionally Approved": <AlertTriangle className="h-4 w-4 text-green-500" />,
  "Rejected": <FileX className="h-4 w-4 text-red-500" />,
  "Funding In Progress": <Loader2 className="h-4 w-4 text-blue-500" />,
  "Funded": <CheckCircle className="h-4 w-4 text-green-500" />,
  "Closed": <CheckCircle className="h-4 w-4 text-slate-500" />
};

const statusVariants: Record<string, string> = {
  "Draft": "outline",
  "Submitted": "default",
  "In Review": "default",
  "Information Needed": "warning",
  "In Underwriting": "secondary",
  "Approved": "success",
  "Conditionally Approved": "warning",
  "Rejected": "destructive",
  "Funding In Progress": "default",
  "Funded": "success",
  "Closed": "outline"
};

type ApplicationDetailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  application: LoanApplication;
}

const ApplicationDetailModal = ({ isOpen, onClose, application }: ApplicationDetailModalProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [performingAction, setPerformingAction] = useState<string | null>(null);
  const [selectedDocumentType, setSelectedDocumentType] = useState<'application' | 'risk-assessment' | 'approval' | 'rejection' | 'funding' | null>(null);
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const getBorrowerName = () => {
    return application.borrower.companyName || 
           `${application.borrower.firstName} ${application.borrower.lastName}`;
  };
  
  const formatAssetClass = (assetClass: string) => {
    return assetClass
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  const handleGenerateReport = () => {
    setPerformingAction("report");
    toast.info("Generating comprehensive report...");
    setTimeout(() => {
      toast.success("Report generated successfully!");
      setPerformingAction(null);
    }, 1500);
  };
  
  const handleAddNote = () => {
    toast.info("Opening note editor...");
    // In a real app, this would open a form to add a note
  };
  
  const handleSendToNextStage = () => {
    setPerformingAction("next");
    toast.info(`Processing application ${application.id}...`);
    setTimeout(() => {
      toast.success(`Application moved to next stage successfully!`);
      setPerformingAction(null);
      onClose();
    }, 1500);
  };
  
  const handleDownloadDocument = (docName: string) => {
    toast.success(`Downloading ${docName}...`);
    // In a real app, this would trigger a file download
  };
  
  const handleVerifyDocument = (docId: string, docName: string) => {
    setPerformingAction(docId);
    toast.info(`Verifying document ${docName}...`);
    setTimeout(() => {
      toast.success(`Document ${docName} verified successfully!`);
      setPerformingAction(null);
    }, 1500);
  };
  
  const handleContactBorrower = (method: "email" | "phone") => {
    if (method === "email") {
      toast.success(`Opening email to ${application.borrower.email}`);
    } else {
      toast.success(`Initiating call to ${application.borrower.phone}`);
    }
    // In a real app, this would open the email client or phone dialer
  };
  
  const handleGenerateDocument = (docType: 'application' | 'risk-assessment' | 'approval' | 'rejection' | 'funding') => {
    setSelectedDocumentType(docType);
  };
  
  const renderAddress = () => {
    if (!application.borrower.address) {
      return "No address on file";
    }
    
    const { street, city, state, zipCode } = application.borrower.address;
    return (
      <>
        {street}<br />
        {city}, {state} {zipCode}
      </>
    );
  };
  
  const statusIcon = application.displayStatus && statusIcons[application.displayStatus] 
    ? statusIcons[application.displayStatus] 
    : <Clock className="h-4 w-4 text-slate-500" />;
  
  const statusVariant = application.displayStatus && statusVariants[application.displayStatus]
    ? statusVariants[application.displayStatus] as any
    : "default";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        setSelectedDocumentType(null);
        onClose();
      }
    }}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {selectedDocumentType ? (
          <div className="space-y-4">
            <Button variant="ghost" onClick={() => setSelectedDocumentType(null)} className="mb-2">
              ← Back to Application
            </Button>
            <DocumentGenerator 
              documentType={selectedDocumentType} 
              applicationData={application} 
              onClose={() => setSelectedDocumentType(null)}
            />
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <span>Application {application.id}</span>
                <Badge variant={statusVariant}>
                  {statusIcon}
                  <span className="ml-1">{application.displayStatus}</span>
                </Badge>
              </DialogTitle>
              <DialogDescription>
                Submitted on {formatDate(application.dateSubmitted)}
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-5 mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="borrower">Borrower</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Application Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <div className="text-sm text-muted-foreground">Borrower:</div>
                          <div className="font-medium">{getBorrowerName()}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Application ID:</div>
                          <div className="font-medium">{application.id}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Submission Date:</div>
                          <div className="font-medium">{formatDate(application.dateSubmitted)}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Asset Class:</div>
                          <div className="font-medium">{formatAssetClass(application.assetClass)}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Loan Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <div className="text-sm text-muted-foreground">Amount:</div>
                          <div className="font-medium">{formatCurrency(application.amount)}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Purpose:</div>
                          <div className="font-medium">{application.purpose}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Term:</div>
                          <div className="font-medium">{application.term} months</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Interest Rate:</div>
                          <div className="font-medium">{application.interestRate ? `${application.interestRate}%` : 'TBD'}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Application Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Completion Status</span>
                        <span>{application.completeness}%</span>
                      </div>
                      <Progress value={application.completeness} className="h-2" />
                    </div>
                    
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-2 text-sm">
                        <div className={`h-2 w-2 rounded-full ${application.completeness >= 25 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <span>Application Submitted</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className={`h-2 w-2 rounded-full ${application.completeness >= 50 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <span>Documents Verified</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className={`h-2 w-2 rounded-full ${application.completeness >= 75 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <span>Underwriting Complete</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className={`h-2 w-2 rounded-full ${application.completeness >= 95 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <span>Final Decision</span>
                      </div>
                    </div>
                    
                    {application.risk && (
                      <div className="mt-4">
                        <div className="text-sm font-medium mb-2">Risk Assessment</div>
                        <Badge 
                          variant={
                            application.risk === "Low" ? "success" : 
                            application.risk === "Medium" ? "warning" : 
                            "destructive"
                          }
                        >
                          {application.risk} Risk
                        </Badge>
                        {application.borrower.creditScore && (
                          <div className="mt-2 text-sm">
                            <span className="text-muted-foreground">Credit Score: </span>
                            <span className="font-medium">{application.borrower.creditScore}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Document Generation</CardTitle>
                    <CardDescription>Generate documents for this application</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <Button variant="outline" onClick={() => handleGenerateDocument('application')}>
                        <FileText className="mr-2 h-4 w-4" />
                        Application Summary
                      </Button>
                      <Button variant="outline" onClick={() => handleGenerateDocument('risk-assessment')}>
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        Risk Assessment
                      </Button>
                      {application.status === "approved" || application.status === "conditionally_approved" ? (
                        <Button variant="outline" onClick={() => handleGenerateDocument('approval')}>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Approval Letter
                        </Button>
                      ) : application.status === "rejected" ? (
                        <Button variant="outline" onClick={() => handleGenerateDocument('rejection')}>
                          <FileX className="mr-2 h-4 w-4" />
                          Rejection Letter
                        </Button>
                      ) : null}
                      {application.status === "funded" && (
                        <Button variant="outline" onClick={() => handleGenerateDocument('funding')}>
                          <FileCheck className="mr-2 h-4 w-4" />
                          Funding Document
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={handleGenerateReport} disabled={!!performingAction}>
                    {performingAction === "report" ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <FileText className="mr-2 h-4 w-4" />
                        Generate Report
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={handleAddNote}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Add Note
                  </Button>
                  <Button onClick={handleSendToNextStage} disabled={!!performingAction}>
                    {performingAction === "next" ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send to Next Stage
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="borrower" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Borrower Information</CardTitle>
                    <CardDescription>
                      {application.borrower.companyName ? "Business Profile" : "Individual Profile"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-medium mb-2 flex items-center">
                          {application.borrower.companyName ? (
                            <><Building className="h-4 w-4 mr-2" /> Company Details</>
                          ) : (
                            <><User className="h-4 w-4 mr-2" /> Personal Details</>
                          )}
                        </h3>
                        <div className="space-y-3">
                          <div>
                            <div className="text-sm text-muted-foreground">
                              {application.borrower.companyName ? "Company Name" : "Full Name"}:
                            </div>
                            <div className="font-medium">
                              {application.borrower.companyName || `${application.borrower.firstName} ${application.borrower.lastName}`}
                            </div>
                          </div>
                          {!application.borrower.companyName && application.borrower.dateOfBirth && (
                            <div>
                              <div className="text-sm text-muted-foreground">Date of Birth:</div>
                              <div className="font-medium">{formatDate(application.borrower.dateOfBirth)}</div>
                            </div>
                          )}
                          {application.borrower.companyName && application.borrower.yearsInBusiness && (
                            <div>
                              <div className="text-sm text-muted-foreground">Years in Business:</div>
                              <div className="font-medium">{application.borrower.yearsInBusiness} years</div>
                            </div>
                          )}
                          {application.borrower.companyName && application.borrower.industry && (
                            <div>
                              <div className="text-sm text-muted-foreground">Industry:</div>
                              <div className="font-medium">{application.borrower.industry}</div>
                            </div>
                          )}
                          {application.borrower.taxId && (
                            <div>
                              <div className="text-sm text-muted-foreground">Tax ID:</div>
                              <div className="font-medium">{application.borrower.taxId}</div>
                            </div>
                          )}
                          {application.borrower.creditScore && (
                            <div>
                              <div className="text-sm text-muted-foreground">Credit Score:</div>
                              <div className="font-medium">{application.borrower.creditScore} ({application.borrower.creditRating})</div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-2 flex items-center">
                          <Mail className="h-4 w-4 mr-2" /> Contact Information
                        </h3>
                        <div className="space-y-3">
                          <div>
                            <div className="text-sm text-muted-foreground">Email:</div>
                            <div className="font-medium">{application.borrower.email}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Phone:</div>
                            <div className="font-medium">{application.borrower.phone}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Address:</div>
                            <div className="font-medium">
                              {renderAddress()}
                            </div>
                          </div>
                          {application.borrower.relationshipManager && (
                            <div>
                              <div className="text-sm text-muted-foreground">Relationship Manager:</div>
                              <div className="font-medium">{application.borrower.relationshipManager}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-end gap-2 mt-4">
                      <Button variant="outline" onClick={() => handleContactBorrower("email")}>
                        <Mail className="mr-2 h-4 w-4" />
                        Email Borrower
                      </Button>
                      <Button variant="outline" onClick={() => handleContactBorrower("phone")}>
                        <Phone className="mr-2 h-4 w-4" />
                        Call Borrower
                      </Button>
                      <Button onClick={() => {
                        toast.success("Opening borrower profile");
                        // In a real app, this would navigate to the borrower detail page
                      }}>
                        <Link className="mr-2 h-4 w-4" />
                        View Full Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                {application.borrower.companyName && application.borrower.annualRevenue && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Financial Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-muted-foreground">Annual Revenue:</div>
                          <div className="font-medium">{formatCurrency(application.borrower.annualRevenue)}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {!application.borrower.companyName && application.borrower.employmentInfo && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Employment Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-muted-foreground">Employer:</div>
                          <div className="font-medium">{application.borrower.employmentInfo.employer}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Position:</div>
                          <div className="font-medium">{application.borrower.employmentInfo.position}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Start Date:</div>
                          <div className="font-medium">{formatDate(application.borrower.employmentInfo.startDate)}</div>
                        </div>
                        {application.borrower.income && (
                          <div>
                            <div className="text-sm text-muted-foreground">Annual Income:</div>
                            <div className="font-medium">{formatCurrency(application.borrower.income)}</div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="documents" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Required Documents</CardTitle>
                    <CardDescription>Status of required documentation for this application</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {application.documents.length > 0 ? (
                        application.documents.map((doc) => (
                          <div key={doc.id}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {doc.status === "verified" ? (
                                  <FileCheck className="h-5 w-5 text-green-500" />
                                ) : doc.status === "rejected" ? (
                                  <FileX className="h-5 w-5 text-red-500" />
                                ) : (
                                  <FileQuestion className="h-5 w-5 text-amber-500" />
                                )}
                                <div>
                                  <div className="font-medium">{doc.type}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {doc.status === "verified" 
                                      ? `Verified on ${formatDate(doc.uploadedAt)}`
                                      : doc.status === "rejected"
                                      ? `Rejected on ${formatDate(doc.uploadedAt)}`
                                      : `Uploaded on ${formatDate(doc.uploadedAt)}`}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant={
                                  doc.status === "verified" ? "success" : 
                                  doc.status === "rejected" ? "destructive" : 
                                  "warning"
                                }>
                                  {doc.status === "verified" ? "Verified" : 
                                   doc.status === "rejected" ? "Rejected" : 
                                   "Pending"}
                                </Badge>
                                <div className="flex gap-1">
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => handleDownloadDocument(doc.name)}
                                    title="Download Document"
                                  >
                                    <Download className="h-4 w-4" />
                                  </Button>
                                  {doc.status === "pending" && (
                                    <Button 
                                      variant="ghost" 
                                      size="icon"
                                      onClick={() => handleVerifyDocument(doc.id, doc.name)}
                                      disabled={!!performingAction}
                                      title="Verify Document"
                                    >
                                      {performingAction === doc.id ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                      ) : (
                                        <CheckCircle className="h-4 w-4" />
                                      )}
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                            {doc.aiAnalysisComplete && doc.aiAnalysisSummary && (
                              <div className="mt-1 ml-7 text-xs p-2 bg-muted rounded-sm">
                                <span className="font-medium">AI Analysis: </span>
                                {doc.aiAnalysisSummary}
                              </div>
                            )}
                            <Separator className="my-3" />
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-muted-foreground">
                          No documents have been uploaded yet.
                        </div>
                      )}
                      
                      <div className="mt-4 flex justify-end">
                        <Button variant="outline" onClick={() => toast.info("Opening document uploader...")}>
                          <FileText className="mr-2 h-4 w-4" />
                          Request Documents
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="notes" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Application Notes</CardTitle>
                    <CardDescription>Communication history and notes</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {application.notes.length > 0 ? (
                      application.notes.map((note) => (
                        <div key={note.id} className="bg-muted p-3 rounded-md space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {note.isAgentNote ? (
                                <UserCheck className="h-4 w-4 text-primary" />
                              ) : (
                                <User className="h-4 w-4 text-primary" />
                              )}
                              <span className="font-medium">
                                {note.isAgentNote ? "AI Agent" : "Loan Officer"}
                              </span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(note.createdAt)} · {new Date(note.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                          </div>
                          <p className="text-sm">{note.content}</p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        No notes have been added yet.
                      </div>
                    )}
                    
                    <div className="mt-4">
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="timeline" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Application Timeline</CardTitle>
                    <CardDescription>Chronological history of this application</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {application.dateSubmitted && (
                        <div className="flex">
                          <div className="flex flex-col items-center mr-4">
                            <div className="h-2.5 w-2.5 rounded-full bg-blue-500"></div>
                            <div className="h-full w-px bg-gray-200 my-1"></div>
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-start justify-between">
                              <p className="text-sm font-medium">Application Submitted</p>
                              <span className="text-xs text-muted-foreground">
                                {formatDate(application.dateSubmitted)}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {getBorrowerName()} submitted loan application for {formatCurrency(application.amount)}.
                            </p>
                            <div className="text-sm text-muted-foreground">
                              <span className="font-medium">Action Performed:</span> The intake process was initiated with form validation, initial risk screening, and preliminary eligibility check.
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              <span className="font-medium">Documents Processed:</span> Application form, initial identification documents, and preliminary financial statements were received and logged.
                            </div>
                            <div className="text-xs text-muted-foreground flex items-center mt-1">
                              <span className="inline-block w-2 h-2 rounded-full mr-1.5 bg-blue-500" />
                              <span>Intake AI Agent</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {application.dateReviewed && (
                        <div className="flex">
                          <div className="flex flex-col items-center mr-4">
                            <div className="h-2.5 w-2.5 rounded-full bg-indigo-500"></div>
                            <div className="h-full w-px bg-gray-200 my-1"></div>
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-start justify-between">
                              <p className="text-sm font-medium">Application Reviewed</p>
                              <span className="text-xs text-muted-foreground">
                                {formatDate(application.dateReviewed)}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Initial review completed. Documents processed and verified.
                            </p>
                            <div className="text-sm text-muted-foreground">
                              <span className="font-medium">Action Performed:</span> Comprehensive document verification, credit history analysis, and identity verification were completed. Data extraction from financial documents was performed to prepare for underwriting.
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              <span className="font-medium">System Integrations:</span> Credit bureau data was retrieved, bank statements were analyzed through financial data API, and tax documents were processed for income verification.
                            </div>
                            {application.documents.length > 0 && (
                              <div className="text-sm text-muted-foreground mt-1">
                                <span className="font-medium">Documents Verified:</span> {application.documents.filter(doc => doc.status === 'verified').length} out of {application.documents.length} required documents.
                              </div>
                            )}
                            <div className="text-xs text-muted-foreground flex items-center mt-1">
                              <span className="inline-block w-2 h-2 rounded-full mr-1.5 bg-indigo-500" />
                              <span>Processing AI Agent</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {application.dateUnderwritten && (
                        <div className="flex">
                          <div className="flex flex-col items-center mr-4">
                            <div className="h-2.5 w-2.5 rounded-full bg-purple-500"></div>
                            <div className="h-full w-px bg-gray-200 my-1"></div>
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-start justify-between">
                              <p className="text-sm font-medium">Underwriting Completed</p>
                              <span className="text-xs text-muted-foreground">
                                {formatDate(application.dateUnderwritten)}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Full underwriting analysis completed with {application.risk} risk assessment.
                            </p>
                            <div className="text-sm text-muted-foreground">
                              <span className="font-medium">Action Performed:</span> In-depth risk analysis conducted including cash flow analysis, stress testing, industry risk assessment, and collateral valuation. The debt service coverage ratio was calculated and assessed against policy requirements.
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              <span className="font-medium">Risk Factors Identified:</span> {
                                application.risk === "Low" 
                                  ? "Minimal risk factors were identified with strong financials and excellent credit history."
                                  : application.risk === "Medium"
                                  ? "Some moderate concerns were identified including slightly elevated debt-to-income ratio and limited operating history."
                                  : "Several significant risk factors were identified including credit issues, insufficient income documentation, and industry volatility."
                              }
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              <span className="font-medium">Policy Compliance:</span> {
                                application.risk === "Low" 
                                  ? "All policy requirements were fully satisfied with no exceptions needed."
                                  : application.risk === "Medium"
                                  ? "Minor policy exceptions were required regarding collateral coverage and debt service ratio."
                                  : "Multiple significant policy exceptions would be required to proceed with this application."
                              }
                            </div>
                            <div className="text-xs text-muted-foreground flex items-center mt-1">
                              <span className="inline-block w-2 h-2 rounded-full

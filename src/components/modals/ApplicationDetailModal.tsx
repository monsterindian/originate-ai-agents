
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { FileCheck, Clock, AlertTriangle, FileX, MessageSquare, UserCheck, FileText, Send } from "lucide-react";
import { LoanApplication } from "@/types";

const statusIcons = {
  "Initial Review": <Clock className="h-4 w-4 text-blue-500" />,
  "Document Collection": <FileCheck className="h-4 w-4 text-amber-500" />,
  "Credit Review": <AlertTriangle className="h-4 w-4 text-orange-500" />,
  "In Underwriting": <FileCheck className="h-4 w-4 text-indigo-500" />,
  "Pending Approval": <FileCheck className="h-4 w-4 text-green-500" />,
  "Rejected": <FileX className="h-4 w-4 text-red-500" />
};

type ApplicationDetailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  application: any; // Using any for the mock data, would be LoanApplication in a real implementation
}

const ApplicationDetailModal = ({ isOpen, onClose, application }: ApplicationDetailModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>Application {application?.id}</span>
            <Badge variant="outline">{application?.status}</Badge>
          </DialogTitle>
          <DialogDescription>
            Submitted on {application?.dateSubmitted}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Borrower Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <div className="font-medium">{application?.borrower}</div>
                    <div className="text-sm text-muted-foreground">{application?.assetClass}</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Loan Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Amount:</span>
                    <span>{application?.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Purpose:</span>
                    <span>{application?.purpose}</span>
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
                    <span>{application?.completeness}%</span>
                  </div>
                  <Progress value={application?.completeness} className="h-2" />
                </div>
                
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    <span>Documents Verified</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                    <span>Underwriting In Progress</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span>Credit Analysis Complete</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="h-2 w-2 rounded-full bg-gray-300"></div>
                    <span>Final Decision Pending</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Button variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
              <Button variant="outline">
                <MessageSquare className="mr-2 h-4 w-4" />
                Add Note
              </Button>
              <Button>
                <Send className="mr-2 h-4 w-4" />
                Send to Next Stage
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="documents" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Required Documents</CardTitle>
                <CardDescription>Status of required documentation for this application</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileCheck className="h-5 w-5 text-green-500" />
                      <div>
                        <div className="font-medium">Income Verification</div>
                        <div className="text-xs text-muted-foreground">Uploaded on April 5, 2024</div>
                      </div>
                    </div>
                    <Badge>Verified</Badge>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileCheck className="h-5 w-5 text-green-500" />
                      <div>
                        <div className="font-medium">Business Plan</div>
                        <div className="text-xs text-muted-foreground">Uploaded on April 3, 2024</div>
                      </div>
                    </div>
                    <Badge>Verified</Badge>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                      <div>
                        <div className="font-medium">Property Appraisal</div>
                        <div className="text-xs text-muted-foreground">Awaiting verification</div>
                      </div>
                    </div>
                    <Badge variant="outline">Pending</Badge>
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
                <div className="bg-muted p-3 rounded-md space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <UserCheck className="h-4 w-4 text-primary" />
                      <span className="font-medium">Sarah Miller (Underwriter)</span>
                    </div>
                    <span className="text-xs text-muted-foreground">April 10, 2024 · 2:45 PM</span>
                  </div>
                  <p className="text-sm">Credit analysis complete. Borrower meets our lending criteria with strong financials and solid business plan. Recommend proceeding with property assessment verification.</p>
                </div>
                
                <div className="bg-muted p-3 rounded-md space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <UserCheck className="h-4 w-4 text-primary" />
                      <span className="font-medium">John Davis (Processing)</span>
                    </div>
                    <span className="text-xs text-muted-foreground">April 8, 2024 · 11:20 AM</span>
                  </div>
                  <p className="text-sm">All documents received. Verification process initiated. Income statements and business registration documents appear to be in order.</p>
                </div>
                
                <div className="mt-4">
                  <Button className="w-full">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Add New Note
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="timeline" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Application Timeline</CardTitle>
                <CardDescription>Progress history of this application</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center">
                        <FileCheck className="h-3 w-3 text-white" />
                      </div>
                      <div className="h-full w-0.5 bg-green-200 mt-1"></div>
                    </div>
                    <div className="space-y-1 pb-4">
                      <div className="text-sm font-medium">Application Submitted</div>
                      <div className="text-xs text-muted-foreground">April 5, 2024 · 9:30 AM</div>
                      <div className="text-sm mt-1">Initial application form submitted with required documents.</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center">
                        <UserCheck className="h-3 w-3 text-white" />
                      </div>
                      <div className="h-full w-0.5 bg-green-200 mt-1"></div>
                    </div>
                    <div className="space-y-1 pb-4">
                      <div className="text-sm font-medium">Initial Review Complete</div>
                      <div className="text-xs text-muted-foreground">April 7, 2024 · 11:45 AM</div>
                      <div className="text-sm mt-1">Application passed initial review and moved to document verification.</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="h-5 w-5 rounded-full bg-amber-500 flex items-center justify-center">
                        <Clock className="h-3 w-3 text-white" />
                      </div>
                      <div className="h-full w-0.5 bg-amber-200 mt-1"></div>
                    </div>
                    <div className="space-y-1 pb-4">
                      <div className="text-sm font-medium">Underwriting In Progress</div>
                      <div className="text-xs text-muted-foreground">April 10, 2024 · 2:15 PM</div>
                      <div className="text-sm mt-1">Application is currently under review by the underwriting team.</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="h-5 w-5 rounded-full bg-gray-300 flex items-center justify-center">
                        <Clock className="h-3 w-3 text-white" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm font-medium">Final Decision</div>
                      <div className="text-xs text-muted-foreground">Pending</div>
                      <div className="text-sm mt-1">Awaiting final decision from the approval committee.</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationDetailModal;


import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Building2, Phone, Mail, MapPin, FileText, MessageSquare, CreditCard, User, Send } from "lucide-react";

type BorrowerDetailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  borrower: any; // Using any for the mock data, would be Borrower in a real implementation
}

const getBorrowerInitials = (name: string) => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

const BorrowerDetailModal = ({ isOpen, onClose, borrower }: BorrowerDetailModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{getBorrowerInitials(borrower?.name || '')}</AvatarFallback>
            </Avatar>
            <span>{borrower?.name}</span>
          </DialogTitle>
          <DialogDescription>
            {borrower?.id} • {borrower?.type} • {borrower?.industry}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="loans">Loans</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Borrower Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="font-medium">{borrower?.name}</div>
                      <div className="text-sm text-muted-foreground">{borrower?.type} • {borrower?.industry}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="font-medium">Contact Phone</div>
                      <div className="text-sm text-muted-foreground">{borrower?.phone}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="font-medium">Email Address</div>
                      <div className="text-sm text-muted-foreground">{borrower?.email}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="font-medium">Business Address</div>
                      <div className="text-sm text-muted-foreground">123 Business Park, Suite 100</div>
                      <div className="text-sm text-muted-foreground">San Francisco, CA 94103</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Account Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="text-sm text-muted-foreground">Active Loans</div>
                      <div className="text-xl font-semibold">{borrower?.activeLoans}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Total Balance</div>
                      <div className="text-xl font-semibold">{borrower?.totalBalance}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Risk Rating</div>
                      <Badge variant={borrower?.riskRating === "Low" ? "success" : borrower?.riskRating === "Medium" ? "warning" : "destructive"}>
                        {borrower?.riskRating}
                      </Badge>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Customer Since</div>
                      <div>Jan 2023</div>
                    </div>
                  </div>
                  
                  <Separator className="my-2" />
                  
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Latest Activity</div>
                    <div className="text-sm">Loan application submitted on April 10, 2024</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Primary Contact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {borrower?.contactPerson ? getBorrowerInitials(borrower.contactPerson) : 'CP'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{borrower?.contactPerson}</div>
                    <div className="text-sm text-muted-foreground">Chief Financial Officer</div>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        <span>{borrower?.email}</span>
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        <span>{borrower?.phone}</span>
                      </div>
                    </div>
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
                Contact Borrower
              </Button>
              <Button>
                <CreditCard className="mr-2 h-4 w-4" />
                New Loan Application
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="loans" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Active Loans</CardTitle>
                <CardDescription>All current loans for this borrower</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-muted p-3 rounded-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">L-10245</div>
                        <div className="text-sm text-muted-foreground">{borrower?.assetClass}</div>
                      </div>
                      <Badge>Active</Badge>
                    </div>
                    <Separator className="my-2" />
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <div className="text-muted-foreground">Amount</div>
                        <div>{borrower?.totalBalance}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Interest Rate</div>
                        <div>5.25%</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Term</div>
                        <div>60 months</div>
                      </div>
                    </div>
                    <div className="mt-3 flex justify-end">
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="documents" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Borrower Documents</CardTitle>
                <CardDescription>Important documents for this borrower</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 border rounded-md hover:bg-muted">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <div>
                        <div className="font-medium">Business Registration</div>
                        <div className="text-xs text-muted-foreground">Uploaded on January 15, 2023</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 border rounded-md hover:bg-muted">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <div>
                        <div className="font-medium">Financial Statements</div>
                        <div className="text-xs text-muted-foreground">Uploaded on March 10, 2024</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 border rounded-md hover:bg-muted">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <div>
                        <div className="font-medium">Tax Returns 2023</div>
                        <div className="text-xs text-muted-foreground">Uploaded on February 28, 2024</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                </div>
                
                <div className="mt-4">
                  <Button className="w-full">
                    <Send className="mr-2 h-4 w-4" />
                    Upload New Document
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="contacts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Contact Persons</CardTitle>
                <CardDescription>Key contacts at this organization</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {borrower?.contactPerson ? getBorrowerInitials(borrower.contactPerson) : 'CP'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-medium">{borrower?.contactPerson}</div>
                    <div className="text-sm text-muted-foreground">Chief Financial Officer</div>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        <span>{borrower?.email}</span>
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        <span>{borrower?.phone}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Contact
                  </Button>
                </div>
                
                <Separator />
                
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-medium">Jane Doe</div>
                    <div className="text-sm text-muted-foreground">Operations Manager</div>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        <span>jane.doe@company.com</span>
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        <span>(555) 987-6543</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Contact
                  </Button>
                </div>
                
                <div className="mt-4">
                  <Button className="w-full">
                    <User className="mr-2 h-4 w-4" />
                    Add New Contact
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default BorrowerDetailModal;

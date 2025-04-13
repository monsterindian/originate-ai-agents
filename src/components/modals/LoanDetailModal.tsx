
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { LineChart } from "@/components/ui/charts";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Building, FileText, MessageSquare, CreditCard, AlertCircle, Calendar, Clock, DollarSign } from "lucide-react";

type LoanDetailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  loan: any; // Using any for the mock data, would be Loan in a real implementation
}

const getBorrowerInitials = (name: string) => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

const LoanDetailModal = ({ isOpen, onClose, loan }: LoanDetailModalProps) => {
  // Mock data for the payment history chart
  const paymentData = [
    { month: "Jan", payment: 20000 },
    { month: "Feb", payment: 20000 },
    { month: "Mar", payment: 20000 },
    { month: "Apr", payment: 20000 },
    { month: "May", payment: 0 },
    { month: "Jun", payment: 0 },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>Loan {loan?.id}</span>
            <Badge>{loan?.status}</Badge>
          </DialogTitle>
          <DialogDescription>
            Originated on {loan?.origination} • {loan?.term}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="modifications">Modifications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Loan Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Principal Amount:</span>
                    <span className="font-medium">{loan?.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Interest Rate:</span>
                    <span className="font-medium">{loan?.interestRate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Term:</span>
                    <span className="font-medium">{loan?.term}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Origination Date:</span>
                    <span className="font-medium">{loan?.origination}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Maturity Date:</span>
                    <span className="font-medium">2029-03-15</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Payment Status:</span>
                    <Badge variant={loan?.paymentStatus === "Current" ? "outline" : "destructive"}>
                      {loan?.paymentStatus}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Asset Class:</span>
                    <span className="font-medium">{loan?.assetClass}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Borrower Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar>
                      <AvatarFallback>{getBorrowerInitials(loan?.borrower || '')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{loan?.borrower}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Building className="h-3 w-3" />
                        <span>{loan?.assetClass}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="my-2" />
                  
                  <div className="space-y-2 mt-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Active Loans:</span>
                      <span className="font-medium">1</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Exposure:</span>
                      <span className="font-medium">{loan?.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Risk Rating:</span>
                      <Badge variant="outline">Low</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Payment Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Monthly Payment</div>
                    <div className="text-2xl font-semibold">$20,000</div>
                    <div className="text-xs text-muted-foreground">Principal + Interest</div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Next Payment</div>
                    <div className="text-2xl font-semibold">May 15, 2024</div>
                    <div className="text-xs text-muted-foreground">Due in 5 days</div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Remaining Balance</div>
                    <div className="text-2xl font-semibold">{loan?.amount}</div>
                    <div className="text-xs text-muted-foreground">As of Apr 13, 2024</div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Payments Made</div>
                    <div className="text-2xl font-semibold">4 / 60</div>
                    <div className="text-xs text-muted-foreground">Months completed</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Button variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Generate Statement
              </Button>
              <Button variant="outline">
                <MessageSquare className="mr-2 h-4 w-4" />
                Contact Borrower
              </Button>
              <Button>
                <CreditCard className="mr-2 h-4 w-4" />
                Process Payment
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="payments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Payment History</CardTitle>
                <CardDescription>Recent payment activity for this loan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-60 mb-6">
                  <LineChart 
                    data={paymentData}
                    dataKey="month"
                    categories={["payment"]}
                    colors={["#0ea5e9"]}
                    valueFormatter={(value: number) => `$${value.toLocaleString()}`}
                    showLegend={false}
                  />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 border rounded-md bg-muted/50">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-green-500" />
                      <div>
                        <div className="font-medium">April Payment</div>
                        <div className="text-xs text-muted-foreground">Apr 15, 2024</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">$20,000.00</div>
                      <Badge variant="outline">Paid</Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 border rounded-md bg-muted/50">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-green-500" />
                      <div>
                        <div className="font-medium">March Payment</div>
                        <div className="text-xs text-muted-foreground">Mar 15, 2024</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">$20,000.00</div>
                      <Badge variant="outline">Paid</Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 border rounded-md bg-muted/50">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-green-500" />
                      <div>
                        <div className="font-medium">February Payment</div>
                        <div className="text-xs text-muted-foreground">Feb 15, 2024</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">$20,000.00</div>
                      <Badge variant="outline">Paid</Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 border rounded-md bg-muted/50">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-green-500" />
                      <div>
                        <div className="font-medium">January Payment</div>
                        <div className="text-xs text-muted-foreground">Jan 15, 2024</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">$20,000.00</div>
                      <Badge variant="outline">Paid</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Upcoming Payments</CardTitle>
                <CardDescription>Future scheduled payments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 border rounded-md bg-amber-50 border-amber-200">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-amber-500" />
                      <div>
                        <div className="font-medium">May Payment</div>
                        <div className="text-xs text-muted-foreground">Due May 15, 2024</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">$20,000.00</div>
                      <Button size="sm">Pay Now</Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 border rounded-md">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">June Payment</div>
                        <div className="text-xs text-muted-foreground">Due Jun 15, 2024</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">$20,000.00</div>
                      <Badge variant="secondary">Upcoming</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="documents" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Loan Documents</CardTitle>
                <CardDescription>All documents related to this loan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 border rounded-md hover:bg-muted">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <div>
                        <div className="font-medium">Loan Agreement</div>
                        <div className="text-xs text-muted-foreground">Signed on {loan?.origination}</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 border rounded-md hover:bg-muted">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <div>
                        <div className="font-medium">Promissory Note</div>
                        <div className="text-xs text-muted-foreground">Signed on {loan?.origination}</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 border rounded-md hover:bg-muted">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <div>
                        <div className="font-medium">Security Agreement</div>
                        <div className="text-xs text-muted-foreground">Signed on {loan?.origination}</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 border rounded-md hover:bg-muted">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <div>
                        <div className="font-medium">Amortization Schedule</div>
                        <div className="text-xs text-muted-foreground">Generated on {loan?.origination}</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="modifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Loan Modifications</CardTitle>
                <CardDescription>History of changes to this loan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Clock className="h-16 w-16 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-semibold">No Modifications</h3>
                  <p className="text-muted-foreground text-sm mt-2">This loan has not been modified since origination.</p>
                  <Button className="mt-4">
                    Request Modification
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

export default LoanDetailModal;

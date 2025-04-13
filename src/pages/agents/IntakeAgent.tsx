
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, FileUp, RefreshCw, Settings, Upload } from "lucide-react";
import { toast } from "sonner";

const IntakeAgent = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState("interaction");
  const [userPrompt, setUserPrompt] = useState("");
  const [agentResponse, setAgentResponse] = useState("");

  const handleSendPrompt = async () => {
    if (!userPrompt.trim()) {
      toast.error("Please enter a prompt for the agent");
      return;
    }

    setIsProcessing(true);
    setAgentResponse("");

    try {
      // Simulate API response delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock response
      const response = `I've analyzed your request regarding loan application intake. Here's what I can do:

1. Create a new loan application based on the details you provided
2. Process initial documentation and verify completeness
3. Perform preliminary borrower verification checks
4. Suggest next steps for the application

To proceed with creating a new application, I'll need the following information:
- Borrower full name
- Contact information (email and phone)
- Loan amount requested
- Purpose of the loan
- Asset class (e.g., residential mortgage, auto loan, etc.)

Would you like me to set up a new application form or help with something else?`;
      
      setAgentResponse(response);
      toast.success("Agent has processed your request");
    } catch (error) {
      console.error("Error processing agent request:", error);
      toast.error("Failed to process your request. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Bot className="h-7 w-7 text-primary" />
              Intake Agent
            </h1>
            <p className="text-muted-foreground mt-1">
              AI assistant for processing new loan applications and initial documentation
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1">
              <RefreshCw className="h-4 w-4" />
              <span>Reset</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-1">
              <Settings className="h-4 w-4" />
              <span>Configure</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList>
                <TabsTrigger value="interaction">Agent Interaction</TabsTrigger>
                <TabsTrigger value="upload">Document Upload</TabsTrigger>
                <TabsTrigger value="history">Interaction History</TabsTrigger>
              </TabsList>
              
              <TabsContent value="interaction" className="space-y-4">
                <Card className="min-h-[400px] flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-lg">Agent Chat</CardTitle>
                    <CardDescription>
                      Communicate with the AI Intake Agent to process applications
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <div className="flex-1 border rounded-md p-4 mb-4 overflow-y-auto bg-muted/20 min-h-[240px]">
                      {agentResponse ? (
                        <div className="flex gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Bot className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1 prose-sm max-w-none">
                            <p className="font-medium mb-1">Intake Agent</p>
                            <div className="whitespace-pre-line">{agentResponse}</div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center text-muted-foreground py-10">
                          <Bot className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>Send a message to start interacting with the Intake Agent</p>
                        </div>
                      )}
                    </div>
                    <div className="space-y-3">
                      <Textarea 
                        placeholder="Type your message to the Intake Agent..."
                        value={userPrompt}
                        onChange={(e) => setUserPrompt(e.target.value)}
                        className="min-h-[100px]"
                      />
                      <div className="flex justify-end">
                        <Button 
                          onClick={handleSendPrompt} 
                          disabled={isProcessing}
                        >
                          {isProcessing ? (
                            <>
                              <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                              Processing...
                            </>
                          ) : "Send Message"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="upload">
                <Card className="min-h-[400px]">
                  <CardHeader>
                    <CardTitle className="text-lg">Document Upload</CardTitle>
                    <CardDescription>
                      Upload documents for the agent to analyze
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center space-y-4 min-h-[300px]">
                    <div className="border-2 border-dashed border-muted rounded-lg p-12 text-center w-full max-w-lg flex flex-col items-center justify-center">
                      <FileUp className="h-10 w-10 text-muted-foreground mb-4" />
                      <h3 className="font-medium text-lg">Drag and drop documents here</h3>
                      <p className="text-muted-foreground mb-4">
                        Upload ID verification, income proof, bank statements or other documents
                      </p>
                      <Button className="gap-2">
                        <Upload className="h-4 w-4" />
                        Select Files
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="history">
                <Card className="min-h-[400px]">
                  <CardHeader>
                    <CardTitle className="text-lg">Interaction History</CardTitle>
                    <CardDescription>
                      Recent conversations with the Intake Agent
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="border rounded-md p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">New Residential Mortgage Application</h3>
                          <span className="text-xs text-muted-foreground">Today, 10:24 AM</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          Agent assisted with creating a new mortgage application for John Smith
                        </p>
                        <Button variant="outline" size="sm">View Details</Button>
                      </div>
                      
                      <div className="border rounded-md p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">Document Analysis - Auto Loan</h3>
                          <span className="text-xs text-muted-foreground">Yesterday, 3:15 PM</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          Agent analyzed income verification documents for auto loan application
                        </p>
                        <Button variant="outline" size="sm">View Details</Button>
                      </div>
                      
                      <div className="border rounded-md p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">Application Status Update</h3>
                          <span className="text-xs text-muted-foreground">April 11, 2:30 PM</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          Agent updated status of commercial real estate loan application
                        </p>
                        <Button variant="outline" size="sm">View Details</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Agent Capabilities</CardTitle>
                <CardDescription>What this agent can do</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium">Application Intake</h3>
                  <p className="text-sm text-muted-foreground">
                    Process new loan applications and collect required information
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Document Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    Analyze uploaded documents for completeness and verification
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Borrower Verification</h3>
                  <p className="text-sm text-muted-foreground">
                    Perform initial verification of borrower details and identity
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Custom Application Forms</h3>
                  <p className="text-sm text-muted-foreground">
                    Generate tailored application forms for different asset classes
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Processing Time</span>
                  <span className="text-sm">2.3 minutes avg.</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div className="bg-primary h-2.5 rounded-full" style={{ width: '85%' }}></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Accuracy Rate</span>
                  <span className="text-sm">97.8%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div className="bg-primary h-2.5 rounded-full" style={{ width: '97.8%' }}></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Applications Processed</span>
                  <span className="text-sm">145 this month</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div className="bg-primary h-2.5 rounded-full" style={{ width: '72%' }}></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default IntakeAgent;

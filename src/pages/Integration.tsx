
import { useState } from "react";
import { Brain, Key, ClipboardCheck, AlertOctagon } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { initializeOpenAI } from "@/services/openAIService";

const Integration = () => {
  const [apiKey, setApiKey] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [openAIConnected, setOpenAIConnected] = useState(false);

  const handleConnect = async () => {
    if (!apiKey.trim()) {
      toast.error("Please enter an API key");
      return;
    }

    setIsConnecting(true);
    try {
      const connected = await initializeOpenAI(apiKey);
      
      if (connected) {
        setOpenAIConnected(true);
        toast.success("Successfully connected to OpenAI API");
        setApiKey(""); // Clear for security
      } else {
        toast.error("Failed to connect to OpenAI API. Please check your key and try again.");
      }
    } catch (error) {
      console.error("Error connecting to OpenAI:", error);
      toast.error("An error occurred while connecting to OpenAI");
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Integrations</h1>
          <p className="text-muted-foreground mt-1">
            Connect external services to enhance AI agent capabilities
          </p>
        </div>

        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>OpenAI Integration</CardTitle>
                  <CardDescription>
                    Connect to OpenAI API to power AI agents and enhance loan processing
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="apiKey">OpenAI API Key</Label>
                  <div className="flex gap-2">
                    <Input
                      id="apiKey"
                      type="password"
                      placeholder="sk-..."
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      disabled={isConnecting || openAIConnected}
                    />
                    <Button 
                      onClick={handleConnect} 
                      disabled={isConnecting || openAIConnected}
                    >
                      {isConnecting ? "Connecting..." : openAIConnected ? "Connected" : "Connect"}
                    </Button>
                  </div>
                </div>

                {openAIConnected ? (
                  <div className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-md border border-green-200">
                    <ClipboardCheck className="h-5 w-5" />
                    <span>Successfully connected to OpenAI API</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-3 bg-yellow-50 text-yellow-700 rounded-md border border-yellow-200">
                    <AlertOctagon className="h-5 w-5" />
                    <span>OpenAI API connection required for full AI agent functionality</span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start">
              <p className="text-sm text-muted-foreground">
                Your API key is not stored on our servers and is only used to establish a direct connection between your browser and OpenAI.
              </p>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Key className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Available Integrations</CardTitle>
                  <CardDescription>
                    Other services that can be integrated with the system
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-md space-y-2">
                  <h3 className="font-medium">Credit Bureau APIs</h3>
                  <p className="text-sm text-muted-foreground">
                    Connect to Equifax, Experian, or TransUnion for automated credit checks.
                  </p>
                  <Button variant="outline" className="mt-2">Configure</Button>
                </div>
                
                <div className="p-4 border rounded-md space-y-2">
                  <h3 className="font-medium">Document Processing APIs</h3>
                  <p className="text-sm text-muted-foreground">
                    Connect to document verification and OCR services for automated document processing.
                  </p>
                  <Button variant="outline" className="mt-2">Configure</Button>
                </div>
                
                <div className="p-4 border rounded-md space-y-2">
                  <h3 className="font-medium">Payment Processors</h3>
                  <p className="text-sm text-muted-foreground">
                    Integrate with payment gateways for loan disbursement and repayment processing.
                  </p>
                  <Button variant="outline" className="mt-2">Configure</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Integration;

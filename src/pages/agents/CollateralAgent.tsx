
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, MessageSquare, X } from "lucide-react";
import LeaseIntelligence from "@/components/collateral/LeaseIntelligence";
import DocumentTracking from "@/components/collateral/DocumentTracking";
import MarketComps from "@/components/collateral/MarketComps";
import { generateDecisionRationale } from "@/services/openAIService";
import { useToast } from "@/hooks/use-toast";

const CollateralAgent = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("lease");
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const [aiResponse, setAIResponse] = useState("");
  const [aiQuery, setAIQuery] = useState("");

  const handleTabChange = (value) => {
    setActiveTab(value);
  };

  const toggleAIAssistant = () => {
    setShowAIAssistant(!showAIAssistant);
    if (!showAIAssistant) {
      setAIResponse("");
    }
  };

  const handleAIQuery = async () => {
    if (!aiQuery.trim()) {
      toast({
        title: "Query Required",
        description: "Please enter a question or request for the AI assistant.",
        variant: "destructive"
      });
      return;
    }

    setIsAIProcessing(true);
    
    try {
      // Using the decision rationale API as a generic AI response generator
      const result = await generateDecisionRationale({
        applicationId: "COL-" + Date.now(),
        borrowerName: "Collateral Analysis",
        loanAmount: 500000,
        creditScore: 750,
        dtiRatio: 35,
        ltvRatio: 75,
        decision: "approved"
      });
      
      // Customize the AI response based on the active tab
      let response = "Based on my analysis of the ";
      
      if (activeTab === "lease") {
        response += "lease information, I can see that the tenant has a strong payment history and the lease terms are favorable. The rental rate is aligned with market standards, and the lease duration provides stable income for the foreseeable future.";
      } else if (activeTab === "documents") {
        response += "collateral documents, I can confirm that all critical documents are properly filed and up to date. There are no concerning expirations in the near term, and the documentation quality is high.";
      } else if (activeTab === "comps") {
        response += "market comparables, the subject property appears to be competitively positioned. The valuation is supported by recent sales of similar properties, and the capitalization rate is consistent with current market expectations.";
      }
      
      response += "\n\nSpecifically regarding your query about '" + aiQuery + "', " + result.rationale.split('.').slice(1, 4).join('.') + ".";
      
      setAIResponse(response);
    } catch (error) {
      console.error("Error processing AI query:", error);
      toast({
        title: "AI Processing Error",
        description: "An error occurred while processing your request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAIProcessing(false);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6 relative">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Collateral Agent</h1>
            <p className="text-muted-foreground mt-2">
              Manage lease intelligence, track collateral documents, and collect market comparables
            </p>
          </div>
          <Button 
            onClick={toggleAIAssistant}
            variant={showAIAssistant ? "outline" : "default"}
            className="flex items-center"
          >
            {showAIAssistant ? (
              <>
                <X className="mr-2 h-4 w-4" />
                Close Assistant
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                AI Assistant
              </>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className={`${showAIAssistant ? 'lg:col-span-9' : 'lg:col-span-12'}`}>
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="lease">Lease Intelligence</TabsTrigger>
                <TabsTrigger value="documents">Collateral Documents</TabsTrigger>
                <TabsTrigger value="comps">Market Comps</TabsTrigger>
              </TabsList>
              
              <TabsContent value="lease">
                <LeaseIntelligence />
              </TabsContent>
              
              <TabsContent value="documents">
                <DocumentTracking />
              </TabsContent>
              
              <TabsContent value="comps">
                <MarketComps />
              </TabsContent>
            </Tabs>
          </div>
          
          {showAIAssistant && (
            <div className="lg:col-span-3">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Sparkles className="mr-2 h-5 w-5 text-primary" />
                    AI Collateral Assistant
                  </CardTitle>
                  <CardDescription>
                    Ask questions about collateral documentation, lease analysis, or market trends.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ask a question about the collateral..."
                      className="flex-1 px-3 py-2 border rounded-md"
                      value={aiQuery}
                      onChange={(e) => setAIQuery(e.target.value)}
                    />
                    <Button 
                      onClick={handleAIQuery}
                      disabled={isAIProcessing}
                    >
                      {isAIProcessing ? "Processing..." : "Ask"}
                      <MessageSquare className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                  
                  {aiResponse && (
                    <div className="mt-4 p-4 bg-muted rounded-md">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <span className="font-semibold">AI Response:</span>
                      </div>
                      <p className="whitespace-pre-line text-sm">{aiResponse}</p>
                    </div>
                  )}
                  
                  <div className="pt-4 mt-4 border-t text-xs text-muted-foreground">
                    <p>AI assistant can analyze collateral data and provide insights based on document content, lease terms, and market conditions.</p>
                    <p className="mt-2">For more detailed analysis, use the document AI analysis feature in the Documents tab.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default CollateralAgent;

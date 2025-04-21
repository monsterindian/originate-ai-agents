
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, FileSearch, AlertTriangle, Shield } from "lucide-react";
import { analyzeDocument } from "@/services/openAIService";
import { Badge } from "@/components/ui/badge";

interface AIDocumentAnalysisProps {
  document: {
    id: string;
    propertyId: string;
    propertyName: string;
    documentType: string;
    fileName: string;
    description?: string;
  };
  onComplete?: (analysisResult: any) => void;
}

const AIDocumentAnalysis = ({ document, onComplete }: AIDocumentAnalysisProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("summary");

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeDocument({
        documentType: document.documentType,
        borrowerName: "N/A",
        applicationId: document.id,
      });

      setAnalysisResult(result);
      if (onComplete) {
        onComplete(result);
      }
    } catch (error) {
      console.error("Error analyzing document:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-4">
      {!analysisResult ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sparkles className="mr-2 h-5 w-5 text-primary" />
              AI Document Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">
              Use AI to analyze this document for key information, risks, and insights. The analysis will help identify important details and potential issues.
            </p>
            <div className="flex justify-center">
              <Button onClick={handleAnalyze} disabled={isAnalyzing} className="w-full">
                {isAnalyzing ? "Analyzing..." : "Analyze Document"}
                <Sparkles className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">AI Analysis Results</h3>
            </div>
            <Badge 
              className={analysisResult.structuredData?.verificationStatus === "verified" ? "bg-green-500" : "bg-amber-500"}
            >
              {analysisResult.structuredData?.verificationStatus === "verified" ? "Verified" : "Needs Review"}
            </Badge>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="details">Key Details</TabsTrigger>
              <TabsTrigger value="risks">Risks & Flags</TabsTrigger>
            </TabsList>
            
            <TabsContent value="summary" className="pt-4">
              <Card>
                <CardContent className="pt-4">
                  <p className="whitespace-pre-line">{analysisResult.analysis}</p>
                  <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                    <span>Confidence: {Math.round(analysisResult.confidenceScore * 100)}%</span>
                    <span>Processing time: {(analysisResult.processingTime / 1000).toFixed(2)}s</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="details" className="pt-4">
              <Card>
                <CardContent className="pt-4 space-y-4">
                  <div className="flex items-center space-x-2">
                    <FileSearch className="h-5 w-5 text-blue-500" />
                    <h4 className="font-medium">Document Information</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="font-medium">Document Type:</div>
                      <div>{analysisResult.structuredData?.documentType}</div>
                      
                      <div className="font-medium">Identity Confirmed:</div>
                      <div>{analysisResult.structuredData?.keyDataPoints?.identityConfirmed ? "Yes" : "No"}</div>
                      
                      <div className="font-medium">Income Verified:</div>
                      <div>{analysisResult.structuredData?.keyDataPoints?.incomeVerified ? "Yes" : "No"}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="risks" className="pt-4">
              <Card>
                <CardContent className="pt-4 space-y-4">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    <h4 className="font-medium">Potential Issues</h4>
                  </div>
                  
                  {analysisResult.structuredData?.keyDataPoints?.discrepanciesFound ? (
                    <div className="rounded-md bg-amber-50 p-3 text-amber-700 border border-amber-200">
                      <p>Discrepancies were found in this document that require attention.</p>
                    </div>
                  ) : (
                    <div className="rounded-md bg-green-50 p-3 text-green-700 border border-green-200">
                      <p>No significant issues or discrepancies were detected in this document.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default AIDocumentAnalysis;

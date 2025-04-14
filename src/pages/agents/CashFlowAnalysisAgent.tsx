import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { 
  AlertTriangle, 
  BarChart4, 
  CheckCircle2, 
  ChevronRight, 
  Search, 
  Upload, 
  DollarSign, 
  TrendingUp, 
  ListChecks, 
  Briefcase
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import MainLayout from "@/components/layout/MainLayout";
import { LoanApplication } from '@/types';
import { generateMockCashFlowAnalysis } from '@/services/mock';
import { getApplicationsForAgentType } from '@/services/mock';
import { CashFlowCharts } from '@/components/cashflow/CashFlowCharts';

const CashFlowAnalysisAgent = () => {
  const { id } = useParams<{ id: string }>();
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<LoanApplication | null>(null);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [showBasicAnalysisModal, setShowBasicAnalysisModal] = useState(false);

  useEffect(() => {
    const loadApplications = async () => {
      try {
        setIsLoading(true);
        const apps = getApplicationsForAgentType('cash-flow-analysis', 50);
        setApplications(apps);
      } catch (error) {
        console.error("Failed to load applications:", error);
        toast.error("Failed to load applications");
      } finally {
        setIsLoading(false);
      }
    };

    loadApplications();
  }, [id]);

  const handleViewCashFlowAnalysis = (application: LoanApplication) => {
    setSelectedApplication(application);
    setShowAnalysisModal(true);
  };

  const handleBasicAnalysis = (application: LoanApplication) => {
    setSelectedApplication(application);
    setShowBasicAnalysisModal(true);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">Cash Flow Analysis Agent</h1>
            <p className="text-muted-foreground">Analyze cash flow strength and debt service capacity</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Active
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="queue">
          <TabsList>
            <TabsTrigger value="queue">Application Queue</TabsTrigger>
            <TabsTrigger value="processed">Processed Applications</TabsTrigger>
          </TabsList>
          <TabsContent value="queue" className="space-y-4 mt-4">
            <div className="flex justify-between mb-4">
              <div className="text-sm text-muted-foreground">
                {isLoading ? "Loading applications..." : `${applications.length} applications in queue`}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Search className="w-4 h-4 mr-2" /> Filter
                </Button>
                <Button variant="outline" size="sm">
                  <Upload className="w-4 h-4 mr-2" /> Export
                </Button>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <p>Loading applications...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {applications.map((application) => (
                  <Card key={application.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base font-medium">
                          {application.borrower.companyName || `${application.borrower.firstName} ${application.borrower.lastName}`}
                        </CardTitle>
                        <div>
                          {application.risk === "High" && (
                            <Badge variant="destructive" className="ml-2 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" /> High Risk
                            </Badge>
                          )}
                          {application.risk === "Medium" && (
                            <Badge variant="outline" className="ml-2 bg-orange-50 text-orange-700 border-orange-200">
                              Medium Risk
                            </Badge>
                          )}
                          {application.risk === "Low" && (
                            <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
                              Low Risk
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm mb-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Application ID:</span>
                          <span className="font-medium">{application.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Loan Amount:</span>
                          <span className="font-medium">${application.amount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Status:</span>
                          <span className="font-medium">{application.displayStatus}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Asset Class:</span>
                          <span className="font-medium capitalize">{application.assetClass.replace(/_/g, ' ')}</span>
                        </div>
                      </div>
                      <Separator className="my-3" />
                      <div className="flex justify-between items-center mt-3">
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8"
                            onClick={() => handleBasicAnalysis(application)}
                          >
                            <BarChart4 className="w-4 h-4 mr-2" /> Basic Analysis
                          </Button>
                        </div>
                        <Button
                          size="sm"
                          className="h-8"
                          onClick={() => handleViewCashFlowAnalysis(application)}
                        >
                          <TrendingUp className="w-4 h-4 mr-2" /> View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="processed" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {applications.slice(0, 6).map((application) => (
                <Card key={application.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base font-medium">
                        {application.borrower.companyName || `${application.borrower.firstName} ${application.borrower.lastName}`}
                      </CardTitle>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        Analyzed
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm mb-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Application ID:</span>
                        <span className="font-medium">{application.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Loan Amount:</span>
                        <span className="font-medium">${application.amount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <span className="font-medium">Analyzed</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Analyzed On:</span>
                        <span className="font-medium">{new Date().toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Separator className="my-3" />
                    <div className="flex justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8"
                        onClick={() => handleViewCashFlowAnalysis(application)}
                      >
                        <TrendingUp className="w-4 h-4 mr-2" /> View Analysis
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <Dialog open={showAnalysisModal} onOpenChange={setShowAnalysisModal}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
            {selectedApplication && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-xl flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Cash Flow Analysis for {selectedApplication.borrower.companyName || 
                      `${selectedApplication.borrower.firstName} ${selectedApplication.borrower.lastName}`}
                  </DialogTitle>
                </DialogHeader>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center">
                        <DollarSign className="w-4 h-4 mr-1 text-green-600" /> 
                        Cash Flow Health
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {generateMockCashFlowAnalysis(selectedApplication).cashFlowHealth}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Overall cash flow strength assessment
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center">
                        <Briefcase className="w-4 h-4 mr-1 text-blue-600" /> 
                        Repayment Capacity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {generateMockCashFlowAnalysis(selectedApplication).repaymentCapacity}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Ability to service debt obligations
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center">
                        <ListChecks className="w-4 h-4 mr-1 text-purple-600" /> 
                        Recommendation
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-lg font-bold">
                        {generateMockCashFlowAnalysis(selectedApplication).recommendation}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Based on cash flow strength assessment
                      </p>
                    </CardContent>
                  </Card>
                </div>
                
                <CashFlowCharts analysis={generateMockCashFlowAnalysis(selectedApplication)} />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Strengths</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {generateMockCashFlowAnalysis(selectedApplication).strengths.map((strength, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Concerns</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {generateMockCashFlowAnalysis(selectedApplication).concerns.map((concern, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
                            <span>{concern}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
                
                <DialogFooter className="mt-6">
                  <Button variant="outline" onClick={() => setShowAnalysisModal(false)}>
                    Close
                  </Button>
                  <Button>
                    Send to Underwriting <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={showBasicAnalysisModal} onOpenChange={setShowBasicAnalysisModal}>
          <DialogContent className="max-w-3xl">
            {selectedApplication && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-xl flex items-center gap-2">
                    <BarChart4 className="w-5 h-5" />
                    Basic Cash Flow Analysis
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Revenue Stability</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Revenue Volatility:</span>
                        <Badge 
                          variant={
                            generateMockCashFlowAnalysis(selectedApplication).volatilityMetrics.peakToTroughRatio < 1.3
                              ? "outline" 
                              : generateMockCashFlowAnalysis(selectedApplication).volatilityMetrics.peakToTroughRatio < 1.7
                                ? "secondary" 
                                : "destructive"
                          }
                        >
                          {(generateMockCashFlowAnalysis(selectedApplication).volatilityMetrics.peakToTroughRatio * 10 - 10).toFixed(1)}%
                        </Badge>
                      </div>
                      <div className="h-2.5 w-full bg-gray-200 rounded-full mt-2">
                        <div 
                          className="h-2.5 rounded-full bg-blue-600" 
                          style={{ 
                            width: `${Math.min((generateMockCashFlowAnalysis(selectedApplication).volatilityMetrics.peakToTroughRatio - 1) * 100, 100)}%`,
                            backgroundColor: generateMockCashFlowAnalysis(selectedApplication).volatilityMetrics.peakToTroughRatio < 1.3
                              ? '#22c55e' 
                              : generateMockCashFlowAnalysis(selectedApplication).volatilityMetrics.peakToTroughRatio < 1.7
                                ? '#f59e0b' 
                                : '#ef4444'
                          }}
                        />
                      </div>
                      <p className="text-sm mt-3">
                        {generateMockCashFlowAnalysis(selectedApplication).volatilityMetrics.peakToTroughRatio < 1.3
                          ? "The business shows strong revenue stability with minimal fluctuations." 
                          : generateMockCashFlowAnalysis(selectedApplication).volatilityMetrics.peakToTroughRatio < 1.7
                            ? "The business shows moderate revenue fluctuations, typical for the industry." 
                            : "Revenue shows significant volatility, which may impact debt servicing ability."
                        }
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Operating Cash Flow</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">Average Monthly</div>
                          <div className="text-xl font-medium">
                            ${Math.round(generateMockCashFlowAnalysis(selectedApplication).historicalData.operatingCashFlow / 12).toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">Annual Trend</div>
                          <div className="text-xl font-medium flex items-center">
                            {generateMockCashFlowAnalysis(selectedApplication).historicalData.operatingCashFlowTrend > 0 ? '+' : ''}
                            {generateMockCashFlowAnalysis(selectedApplication).historicalData.operatingCashFlowTrend.toFixed(1)}%
                            {generateMockCashFlowAnalysis(selectedApplication).historicalData.operatingCashFlowTrend > 0 
                              ? <TrendingUp className="ml-1 text-green-500 w-4 h-4" /> 
                              : <TrendingUp className="ml-1 text-red-500 w-4 h-4 rotate-180" />
                            }
                          </div>
                        </div>
                      </div>
                      <Separator className="my-3" />
                      <p className="text-sm">
                        {generateMockCashFlowAnalysis(selectedApplication).historicalData.operatingCashFlowTrend > 10 
                          ? "Strong positive cash flow trend indicates excellent business health and growth potential." 
                          : generateMockCashFlowAnalysis(selectedApplication).historicalData.operatingCashFlowTrend > 0 
                            ? "Positive cash flow trend shows good operational management." 
                            : "Declining cash flow trend requires attention and may impact loan servicing."
                        }
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Debt Service Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm mb-2">
                        <span className="font-medium">Debt Service Coverage Ratio (DSCR):</span> 
                        <span className={`ml-2 ${
                          generateMockCashFlowAnalysis(selectedApplication).projections.debtServiceCoverageRatio >= 1.5 
                            ? 'text-green-600' 
                            : generateMockCashFlowAnalysis(selectedApplication).projections.debtServiceCoverageRatio >= 1.2 
                              ? 'text-yellow-600' 
                              : 'text-red-600'
                        }`}>
                          {generateMockCashFlowAnalysis(selectedApplication).projections.debtServiceCoverageRatio.toFixed(2)}x
                        </span>
                      </div>
                      <p className="text-sm mb-3">
                        {generateMockCashFlowAnalysis(selectedApplication).projections.debtServiceCoverageRatio >= 1.5 
                          ? "Strong DSCR indicates the business can comfortably service its debt obligations." 
                          : generateMockCashFlowAnalysis(selectedApplication).projections.debtServiceCoverageRatio >= 1.2 
                            ? "Adequate DSCR shows the business can service debt with careful management." 
                            : "Low DSCR suggests potential difficulty in meeting debt obligations."
                        }
                      </p>
                      <div className="text-sm mt-4">
                        <span className="font-medium">Quick Assessment:</span> 
                        <span className="ml-2">
                          {generateMockCashFlowAnalysis(selectedApplication).repaymentCapacity}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <DialogFooter className="mt-4">
                  <Button variant="outline" onClick={() => setShowBasicAnalysisModal(false)}>
                    Close
                  </Button>
                  <Button onClick={() => {
                    setShowBasicAnalysisModal(false);
                    setShowAnalysisModal(true);
                  }}>
                    View Detailed Analysis <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default CashFlowAnalysisAgent;

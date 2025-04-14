
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { 
  Download, TrendingUp, Calendar, DollarSign, PieChart, 
  BarChart, LineChart, ArrowDownRight, ArrowUpRight, Clock,
  FileText, AlertCircle, CheckCircle, Wallet, CreditCard
} from "lucide-react";

import MainLayout from "@/components/layout/MainLayout";
import AgentStatusIndicator from "@/components/agents/AgentStatusIndicator";
import OpenAIStatusIndicator from "@/components/agents/OpenAIStatusIndicator";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "sonner";

import { LoanApplication, CashFlowAnalysis } from "@/types";
import { getMockLoanApplications, generateMockCashFlowAnalysis } from "@/services/mockDataService";

const CashFlowAnalysisAgent = () => {
  const [searchParams] = useSearchParams();
  const applicationId = searchParams.get("applicationId");
  const [application, setApplication] = useState<LoanApplication | null>(null);
  const [cashFlowAnalysis, setCashFlowAnalysis] = useState<CashFlowAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState("12");
  const [activeTab, setActiveTab] = useState("overview");

  // Load application data if ID provided in URL
  useEffect(() => {
    if (applicationId) {
      const applications = getMockLoanApplications();
      const app = applications.find(a => a.id === applicationId);
      if (app) {
        setApplication(app);
        // Start analysis immediately when application is found
        runCashFlowAnalysis(app);
      } else {
        toast.error(`Application ${applicationId} not found`);
      }
    }
  }, [applicationId]);

  const runCashFlowAnalysis = (app: LoanApplication) => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    // Simulate analysis progress
    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        const newProgress = prev + Math.random() * 15;
        if (newProgress >= 100) {
          clearInterval(interval);
          setIsAnalyzing(false);
          
          // Generate the analysis results
          const analysis = generateMockCashFlowAnalysis(app);
          setCashFlowAnalysis(analysis);
          
          toast.success("Cash flow analysis completed successfully");
          return 100;
        }
        return newProgress;
      });
    }, 500);
    
    return () => clearInterval(interval);
  };

  const handleDownloadSummary = () => {
    if (!cashFlowAnalysis) return;
    
    toast.success("Preparing cash flow analysis summary for download");
    
    setTimeout(() => {
      toast(
        <div className="space-y-2">
          <p className="font-semibold">Cash Flow Analysis Ready</p>
          <p>Analysis summary for {application?.id} has been generated</p>
          <div className="flex gap-2 mt-2">
            <Button size="sm" onClick={() => {
              const win = window.open("", "_blank");
              if (win) {
                win.document.write(`
                  <html>
                    <head>
                      <title>Cash Flow Analysis - ${application?.id}</title>
                      <style>
                        @media print {
                          .no-print {
                            display: none;
                          }
                          body {
                            padding: 20px;
                          }
                        }
                        body { 
                          font-family: Arial, sans-serif; 
                          margin: 0; 
                          padding: 20px; 
                          color: #1A1F2C;
                        }
                        .header { 
                          display: flex; 
                          justify-content: space-between; 
                          align-items: center; 
                          margin-bottom: 30px; 
                          padding-bottom: 10px;
                          border-bottom: 2px solid #9b87f5;
                        }
                        .logo { 
                          max-width: 200px; 
                        }
                        .print-button {
                          background-color: #9b87f5;
                          color: white;
                          border: none;
                          padding: 10px 20px;
                          border-radius: 4px;
                          cursor: pointer;
                          display: flex;
                          align-items: center;
                          gap: 6px;
                          font-weight: bold;
                        }
                        .print-icon {
                          width: 16px;
                          height: 16px;
                        }
                        h1, h2, h3 { 
                          color: #7E69AB; 
                        }
                        h1 {
                          font-size: 26px;
                          margin: 0;
                        }
                        h2 {
                          border-bottom: 1px solid #D6BCFA;
                          padding-bottom: 5px;
                          margin-top: 30px;
                          font-size: 20px;
                        }
                        h3 {
                          font-size: 16px;
                          margin-top: 20px;
                        }
                        .report-id {
                          color: #8E9196;
                          font-size: 14px;
                        }
                        table { 
                          width: 100%; 
                          border-collapse: collapse; 
                          margin: 20px 0; 
                        }
                        th, td { 
                          padding: 10px; 
                          text-align: left; 
                          border-bottom: 1px solid #ddd; 
                        }
                        th { 
                          background-color: #f2f2f2; 
                          color: #6E59A5;
                          font-weight: 600;
                        }
                        .section { 
                          margin-bottom: 30px; 
                        }
                        .metrics-grid {
                          display: grid;
                          grid-template-columns: repeat(3, 1fr);
                          gap: 15px;
                          margin: 20px 0;
                        }
                        .metric-card {
                          border: 1px solid #D6BCFA;
                          border-radius: 8px;
                          padding: 15px;
                        }
                        .metric-title {
                          font-size: 14px;
                          color: #8E9196;
                          margin-bottom: 5px;
                        }
                        .metric-value {
                          font-size: 24px;
                          font-weight: bold;
                          color: #1A1F2C;
                          margin: 5px 0;
                        }
                        .metric-trend {
                          font-size: 14px;
                          display: flex;
                          align-items: center;
                          gap: 5px;
                        }
                        .trend-up {
                          color: #10b981;
                        }
                        .trend-down {
                          color: #ef4444;
                        }
                        .text-primary {
                          color: #7E69AB;
                        }
                        .text-muted {
                          color: #8E9196;
                          font-size: 14px;
                        }
                        .text-bold {
                          font-weight: 600;
                        }
                        .badge {
                          display: inline-block;
                          padding: 3px 10px;
                          border-radius: 12px;
                          font-size: 12px;
                          font-weight: 500;
                          margin-right: 5px;
                        }
                        .badge-success {
                          background-color: #10b981;
                          color: white;
                        }
                        .badge-warning {
                          background-color: #f59e0b;
                          color: white;
                        }
                        .badge-danger {
                          background-color: #e11d48;
                          color: white;
                        }
                        .chart-placeholder {
                          width: 100%;
                          height: 300px;
                          background-color: #f2f2f2;
                          border: 1px dashed #D6BCFA;
                          display: flex;
                          align-items: center;
                          justify-content: center;
                          margin: 20px 0;
                          border-radius: 8px;
                        }
                        .risk-high { color: #e11d48; }
                        .risk-medium { color: #f59e0b; }
                        .risk-low { color: #10b981; }
                        @media print {
                          .page-break {
                            page-break-before: always;
                          }
                        }
                        .summary-box {
                          background-color: #E5DEFF;
                          border-radius: 8px;
                          padding: 15px;
                          margin-top: 15px;
                        }
                        .prediction-table tr td:first-child {
                          width: 40%;
                          font-weight: 500;
                        }
                      </style>
                    </head>
                    <body>
                      <div class="header">
                        <div>
                          <h1>Cash Flow Analysis Summary</h1>
                          <p class="report-id">Report ID: CF-${application?.id}-${Math.floor(Math.random() * 1000)}</p>
                          <p class="report-id">Date: ${new Date().toLocaleDateString()}</p>
                        </div>
                        <img src="/lovable-uploads/b33a1622-519b-4d29-bcb5-c1f47afab476.png" class="logo" alt="Logo">
                        <button onclick="window.print()" class="print-button no-print">
                          <svg class="print-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
                          </svg>
                          Print Report
                        </button>
                      </div>
                      
                      <div class="section">
                        <h2>Executive Summary</h2>
                        <p>
                          This cash flow analysis report provides a comprehensive evaluation of the financial position and future projections for
                          ${application?.borrower.companyName || `${application?.borrower.firstName} ${application?.borrower.lastName}`}, 
                          in relation to their ${application?.amount ? '$' + application?.amount.toLocaleString() : 'N/A'} 
                          ${application?.purpose || ''} loan application.
                        </p>
                        
                        <div class="summary-box">
                          <h3 style="margin-top: 0;">Key Findings</h3>
                          <p>
                            <span class="text-bold">Cash Flow Health:</span> 
                            <span class="${cashFlowAnalysis?.cashFlowHealth === 'Strong' ? 'risk-low' : 
                                         cashFlowAnalysis?.cashFlowHealth === 'Moderate' ? 'risk-medium' : 'risk-high'}">
                              ${cashFlowAnalysis?.cashFlowHealth || 'N/A'}
                            </span>
                          </p>
                          <p>
                            <span class="text-bold">Loan Repayment Capacity:</span> 
                            <span class="${cashFlowAnalysis?.repaymentCapacity === 'Strong' ? 'risk-low' : 
                                         cashFlowAnalysis?.repaymentCapacity === 'Moderate' ? 'risk-medium' : 'risk-high'}">
                              ${cashFlowAnalysis?.repaymentCapacity || 'N/A'}
                            </span>
                          </p>
                          <p>
                            <span class="text-bold">Recommendation:</span> 
                            ${cashFlowAnalysis?.recommendation || 'N/A'}
                          </p>
                        </div>
                      </div>
                      
                      <div class="section">
                        <h2>Historical Cash Flow Analysis</h2>
                        
                        <div class="metrics-grid">
                          <div class="metric-card">
                            <div class="metric-title">Operating Cash Flow (OCF)</div>
                            <div class="metric-value">$${cashFlowAnalysis?.historicalData.operatingCashFlow.toLocaleString()}</div>
                            <div class="metric-trend ${cashFlowAnalysis?.historicalData.operatingCashFlowTrend > 0 ? 'trend-up' : 'trend-down'}">
                              ${cashFlowAnalysis?.historicalData.operatingCashFlowTrend > 0 ? '↑' : '↓'} 
                              ${Math.abs(cashFlowAnalysis?.historicalData.operatingCashFlowTrend || 0)}% year-over-year
                            </div>
                          </div>
                          <div class="metric-card">
                            <div class="metric-title">Cash Conversion Cycle</div>
                            <div class="metric-value">${cashFlowAnalysis?.historicalData.cashConversionCycle} days</div>
                            <div class="metric-trend ${cashFlowAnalysis?.historicalData.cashConversionCycleTrend < 0 ? 'trend-up' : 'trend-down'}">
                              ${cashFlowAnalysis?.historicalData.cashConversionCycleTrend < 0 ? '↑' : '↓'} 
                              ${Math.abs(cashFlowAnalysis?.historicalData.cashConversionCycleTrend || 0)}% improvement
                            </div>
                          </div>
                          <div class="metric-card">
                            <div class="metric-title">Debt Service Coverage Ratio</div>
                            <div class="metric-value">${cashFlowAnalysis?.historicalData.debtServiceCoverageRatio.toFixed(2)}x</div>
                            <div class="metric-trend ${cashFlowAnalysis?.historicalData.debtServiceCoverageTrend > 0 ? 'trend-up' : 'trend-down'}">
                              ${cashFlowAnalysis?.historicalData.debtServiceCoverageTrend > 0 ? '↑' : '↓'} 
                              ${Math.abs(cashFlowAnalysis?.historicalData.debtServiceCoverageTrend || 0)}% year-over-year
                            </div>
                          </div>
                        </div>
                        
                        <h3>Monthly Cash Flow (Last 12 Months)</h3>
                        <div class="chart-placeholder">
                          [Monthly Cash Flow Chart - Showing inflows, outflows, and net position]
                        </div>
                        
                        <h3>Cash Flow Components</h3>
                        <table>
                          <tr>
                            <th>Category</th>
                            <th>Amount</th>
                            <th>% of Revenue</th>
                            <th>YoY Change</th>
                          </tr>
                          <tr>
                            <td>Revenue</td>
                            <td>$${cashFlowAnalysis?.historicalData.revenue.toLocaleString()}</td>
                            <td>100.0%</td>
                            <td class="${cashFlowAnalysis?.historicalData.revenueTrend > 0 ? 'trend-up' : 'trend-down'}">
                              ${cashFlowAnalysis?.historicalData.revenueTrend > 0 ? '+' : ''}${cashFlowAnalysis?.historicalData.revenueTrend}%
                            </td>
                          </tr>
                          <tr>
                            <td>Cost of Goods Sold</td>
                            <td>$${cashFlowAnalysis?.historicalData.cogs.toLocaleString()}</td>
                            <td>${((cashFlowAnalysis?.historicalData.cogs || 0) / (cashFlowAnalysis?.historicalData.revenue || 1) * 100).toFixed(1)}%</td>
                            <td class="${cashFlowAnalysis?.historicalData.cogsTrend < 0 ? 'trend-up' : 'trend-down'}">
                              ${cashFlowAnalysis?.historicalData.cogsTrend > 0 ? '+' : ''}${cashFlowAnalysis?.historicalData.cogsTrend}%
                            </td>
                          </tr>
                          <tr>
                            <td>Operating Expenses</td>
                            <td>$${cashFlowAnalysis?.historicalData.operatingExpenses.toLocaleString()}</td>
                            <td>${((cashFlowAnalysis?.historicalData.operatingExpenses || 0) / (cashFlowAnalysis?.historicalData.revenue || 1) * 100).toFixed(1)}%</td>
                            <td class="${cashFlowAnalysis?.historicalData.operatingExpensesTrend < 0 ? 'trend-up' : 'trend-down'}">
                              ${cashFlowAnalysis?.historicalData.operatingExpensesTrend > 0 ? '+' : ''}${cashFlowAnalysis?.historicalData.operatingExpensesTrend}%
                            </td>
                          </tr>
                          <tr>
                            <td>Capital Expenditures</td>
                            <td>$${cashFlowAnalysis?.historicalData.capitalExpenditures.toLocaleString()}</td>
                            <td>${((cashFlowAnalysis?.historicalData.capitalExpenditures || 0) / (cashFlowAnalysis?.historicalData.revenue || 1) * 100).toFixed(1)}%</td>
                            <td class="${cashFlowAnalysis?.historicalData.capitalExpendituresTrend < 0 ? 'trend-up' : 'trend-down'}">
                              ${cashFlowAnalysis?.historicalData.capitalExpendituresTrend > 0 ? '+' : ''}${cashFlowAnalysis?.historicalData.capitalExpendituresTrend}%
                            </td>
                          </tr>
                          <tr>
                            <td>Existing Debt Service</td>
                            <td>$${cashFlowAnalysis?.historicalData.existingDebtService.toLocaleString()}</td>
                            <td>${((cashFlowAnalysis?.historicalData.existingDebtService || 0) / (cashFlowAnalysis?.historicalData.revenue || 1) * 100).toFixed(1)}%</td>
                            <td class="${cashFlowAnalysis?.historicalData.existingDebtServiceTrend < 0 ? 'trend-up' : 'trend-down'}">
                              ${cashFlowAnalysis?.historicalData.existingDebtServiceTrend > 0 ? '+' : ''}${cashFlowAnalysis?.historicalData.existingDebtServiceTrend}%
                            </td>
                          </tr>
                        </table>
                      </div>

                      <div class="page-break"></div>

                      <div class="section">
                        <h2>Seasonality & Volatility Analysis</h2>
                        
                        <div class="chart-placeholder">
                          [Seasonality Chart - Showing monthly revenue patterns across multiple years]
                        </div>
                        
                        <h3>Key Observations</h3>
                        <ul>
                          ${cashFlowAnalysis?.seasonalityInsights.map(insight => `<li>${insight}</li>`).join('') || '<li>No seasonality data available</li>'}
                        </ul>
                        
                        <h3>Cash Flow Volatility Metrics</h3>
                        <table>
                          <tr>
                            <th>Metric</th>
                            <th>Value</th>
                            <th>Interpretation</th>
                          </tr>
                          <tr>
                            <td>Standard Deviation (Monthly Revenue)</td>
                            <td>$${cashFlowAnalysis?.volatilityMetrics.revenueStandardDeviation.toLocaleString()}</td>
                            <td>${cashFlowAnalysis?.volatilityMetrics.revenueVolatilityInterpretation}</td>
                          </tr>
                          <tr>
                            <td>Cash Buffer (Months)</td>
                            <td>${cashFlowAnalysis?.volatilityMetrics.cashBufferMonths.toFixed(1)} months</td>
                            <td>${cashFlowAnalysis?.volatilityMetrics.cashBufferInterpretation}</td>
                          </tr>
                          <tr>
                            <td>Peak to Trough Ratio</td>
                            <td>${cashFlowAnalysis?.volatilityMetrics.peakToTroughRatio.toFixed(2)}x</td>
                            <td>${cashFlowAnalysis?.volatilityMetrics.peakToTroughInterpretation}</td>
                          </tr>
                        </table>
                      </div>
                      
                      <div class="section">
                        <h2>Future Cash Flow Projections (${cashFlowAnalysis?.projectionPeriod} Month Forecast)</h2>
                        
                        <div class="chart-placeholder">
                          [Cash Flow Forecast Chart - Showing projected inflows, outflows, and loan payments]
                        </div>
                        
                        <h3>Projected Financial Metrics</h3>
                        <table class="prediction-table">
                          <tr>
                            <td>Projected Annual Revenue</td>
                            <td>$${cashFlowAnalysis?.projections.annualRevenue.toLocaleString()}</td>
                          </tr>
                          <tr>
                            <td>Projected Annual Growth Rate</td>
                            <td>${cashFlowAnalysis?.projections.annualGrowthRate}%</td>
                          </tr>
                          <tr>
                            <td>Projected Operating Cash Flow</td>
                            <td>$${cashFlowAnalysis?.projections.operatingCashFlow.toLocaleString()}</td>
                          </tr>
                          <tr>
                            <td>Projected Debt Service Coverage Ratio</td>
                            <td>${cashFlowAnalysis?.projections.debtServiceCoverageRatio.toFixed(2)}x</td>
                          </tr>
                          <tr>
                            <td>Projected Free Cash Flow</td>
                            <td>$${cashFlowAnalysis?.projections.freeCashFlow.toLocaleString()}</td>
                          </tr>
                          <tr>
                            <td>Loan Payment Capacity</td>
                            <td>$${cashFlowAnalysis?.projections.loanPaymentCapacity.toLocaleString()} per month</td>
                          </tr>
                        </table>
                        
                        <h3>Stress Testing Results</h3>
                        <p>${cashFlowAnalysis?.stressTestingSummary}</p>
                        
                        <table>
                          <tr>
                            <th>Scenario</th>
                            <th>Revenue Impact</th>
                            <th>DSCR Impact</th>
                            <th>Cash Buffer Impact</th>
                          </tr>
                          <tr>
                            <td>10% Revenue Decrease</td>
                            <td>-$${Math.round(cashFlowAnalysis?.projections.annualRevenue * 0.1).toLocaleString()}</td>
                            <td>${(cashFlowAnalysis?.projections.debtServiceCoverageRatio * 0.85).toFixed(2)}x</td>
                            <td>${Math.round(cashFlowAnalysis?.volatilityMetrics.cashBufferMonths * 0.8).toFixed(1)} months</td>
                          </tr>
                          <tr>
                            <td>20% Revenue Decrease</td>
                            <td>-$${Math.round(cashFlowAnalysis?.projections.annualRevenue * 0.2).toLocaleString()}</td>
                            <td>${(cashFlowAnalysis?.projections.debtServiceCoverageRatio * 0.7).toFixed(2)}x</td>
                            <td>${Math.round(cashFlowAnalysis?.volatilityMetrics.cashBufferMonths * 0.6).toFixed(1)} months</td>
                          </tr>
                          <tr>
                            <td>25% Expense Increase</td>
                            <td>$0</td>
                            <td>${(cashFlowAnalysis?.projections.debtServiceCoverageRatio * 0.75).toFixed(2)}x</td>
                            <td>${Math.round(cashFlowAnalysis?.volatilityMetrics.cashBufferMonths * 0.7).toFixed(1)} months</td>
                          </tr>
                        </table>
                      </div>
                      
                      <div class="section">
                        <h2>Funding Recommendation</h2>
                        
                        <div class="summary-box">
                          <h3 style="margin-top: 0;">Primary Recommendation</h3>
                          <p>
                            <span class="text-bold">Recommended Funding Source:</span> 
                            ${cashFlowAnalysis?.recommendedFundingSource || 'N/A'}
                          </p>
                          <p>
                            <span class="text-bold">Recommended Loan Structure:</span> 
                            ${cashFlowAnalysis?.recommendedLoanStructure || 'N/A'}
                          </p>
                          <p>
                            <span class="text-bold">Rationale:</span> 
                            ${cashFlowAnalysis?.fundingRationale || 'N/A'}
                          </p>
                        </div>
                        
                        <h3>Risk Assessment</h3>
                        <ul>
                          ${cashFlowAnalysis?.riskFactors.map(risk => `
                            <li class="${risk.includes('Strong') || risk.includes('Positive') ? 'risk-low' : 
                                       risk.includes('Moderate') || risk.includes('Mixed') ? 'risk-medium' : 'risk-high'}">
                              ${risk}
                            </li>
                          `).join('') || '<li>No risk factors identified</li>'}
                        </ul>
                        
                        <h3>Mitigation Strategies</h3>
                        <ul>
                          ${cashFlowAnalysis?.mitigationStrategies.map(strategy => `<li>${strategy}</li>`).join('') || '<li>No mitigation strategies suggested</li>'}
                        </ul>
                      </div>

                      <div style="margin-top: 50px;">
                        <p class="text-muted">Cash Flow Analysis Report ID: CF-${application?.id}-${Math.floor(Math.random() * 1000)}</p>
                        <p class="text-muted">Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
                        <p class="text-muted">This report was generated by the Cash Flow Analysis Agent and is intended for internal use only.</p>
                        <p class="text-muted">Recommended funding sources: Rabo Bank or ABN AMRO Bank based on the borrower's risk profile and cash flow stability.</p>
                      </div>
                    </body>
                  </html>
                `);
                win.document.close();
              }
            }}>
              View Summary
            </Button>
            <Button size="sm" variant="outline">
              Download PDF
            </Button>
          </div>
        </div>,
        { duration: 10000 }
      );
    }, 1500);
  };

  const getAnalysisStatusBadge = () => {
    if (isAnalyzing) {
      return <Badge variant="secondary">Analyzing...</Badge>;
    }
    if (!cashFlowAnalysis) {
      return <Badge variant="outline">Not Started</Badge>;
    }
    if (cashFlowAnalysis.cashFlowHealth === 'Strong') {
      return <Badge variant="success">Strong Cash Flow</Badge>;
    }
    if (cashFlowAnalysis.cashFlowHealth === 'Moderate') {
      return <Badge variant="warning">Moderate Cash Flow</Badge>;
    }
    return <Badge variant="destructive">Weak Cash Flow</Badge>;
  };

  // If no application is provided, show a placeholder
  if (!application) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Cash Flow Analysis Agent</h1>
              <p className="text-muted-foreground">
                Analyze borrower's cash flow history and predict future cash flow
              </p>
            </div>
          </div>
          
          <Card className="border-dashed border-muted">
            <CardContent className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <LineChart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Application Selected</h3>
              <p className="text-muted-foreground max-w-md mb-4">
                Please select an application from the Applications dashboard to analyze its cash flow.
              </p>
              <Button onClick={() => window.location.href = "/applications"}>
                Browse Applications
              </Button>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Cash Flow Analysis Agent</h1>
            <p className="text-muted-foreground">
              Analyze borrower's cash flow history and predict future cash flow
            </p>
          </div>
          <div className="flex items-center gap-3">
            <AgentStatusIndicator active={true} type="analysis" />
            <OpenAIStatusIndicator status="connected" />
          </div>
        </div>

        {/* Application Info Card */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <CardTitle className="text-xl">Application: {application.id}</CardTitle>
                <CardDescription>
                  {application.borrower.companyName || `${application.borrower.firstName} ${application.borrower.lastName}`} - 
                  ${application.amount.toLocaleString()} {application.purpose}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {getAnalysisStatusBadge()}
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.location.href = `/applications?id=${application.id}`}
                >
                  View Application
                </Button>
                <Button 
                  variant="default" 
                  size="sm"
                  disabled={isAnalyzing || !cashFlowAnalysis}
                  onClick={handleDownloadSummary}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Analysis
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isAnalyzing ? (
              <div className="space-y-3">
                <div className="flex justify-between text-sm mb-1">
                  <span>Analyzing financial data...</span>
                  <span>{Math.round(analysisProgress)}%</span>
                </div>
                <Progress value={analysisProgress} className="h-2" />
                <div className="text-xs text-muted-foreground">
                  Processing bank statements, P&L documents, and credit reports...
                </div>
              </div>
            ) : !cashFlowAnalysis ? (
              <div className="flex justify-center py-6">
                <Button onClick={() => runCashFlowAnalysis(application)}>
                  Start Cash Flow Analysis
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="text-sm font-medium">Projection Period:</div>
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12">12 Months</SelectItem>
                      <SelectItem value="24">24 Months</SelectItem>
                      <SelectItem value="36">36 Months</SelectItem>
                      <SelectItem value="60">60 Months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {cashFlowAnalysis && (
          <>
            {/* Key Metrics */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="py-2">
                  <CardTitle className="text-sm font-medium">Cash Flow Health</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {cashFlowAnalysis.cashFlowHealth}
                  </div>
                  <div className="flex items-center mt-1 text-xs text-muted-foreground">
                    <Calendar className="mr-1 h-3 w-3" />
                    Based on 12-month history
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="py-2">
                  <CardTitle className="text-sm font-medium">DSCR</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {cashFlowAnalysis.historicalData.debtServiceCoverageRatio.toFixed(2)}x
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-xs">
                    <div className={cashFlowAnalysis.historicalData.debtServiceCoverageTrend > 0 ? "text-green-500" : "text-red-500"}>
                      {cashFlowAnalysis.historicalData.debtServiceCoverageTrend > 0 ? (
                        <ArrowUpRight className="h-3 w-3" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3" />
                      )}
                    </div>
                    <span className={cashFlowAnalysis.historicalData.debtServiceCoverageTrend > 0 ? "text-green-500" : "text-red-500"}>
                      {Math.abs(cashFlowAnalysis.historicalData.debtServiceCoverageTrend)}% vs. last year
                    </span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="py-2">
                  <CardTitle className="text-sm font-medium">Repayment Capacity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {cashFlowAnalysis.repaymentCapacity}
                  </div>
                  <div className="flex items-center mt-1 text-xs text-muted-foreground">
                    <DollarSign className="mr-1 h-3 w-3" />
                    ${cashFlowAnalysis.projections.loanPaymentCapacity.toLocaleString()}/month
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="py-2">
                  <CardTitle className="text-sm font-medium">Cash Buffer</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {cashFlowAnalysis.volatilityMetrics.cashBufferMonths.toFixed(1)} months
                  </div>
                  <div className="flex items-center mt-1 text-xs">
                    <div className={cashFlowAnalysis.volatilityMetrics.cashBufferMonths >= 3 ? "text-green-500" : "text-red-500"}>
                      {cashFlowAnalysis.volatilityMetrics.cashBufferMonths >= 3 ? (
                        <CheckCircle className="mr-1 h-3 w-3" />
                      ) : (
                        <AlertCircle className="mr-1 h-3 w-3" />
                      )}
                      <span>{cashFlowAnalysis.volatilityMetrics.cashBufferInterpretation}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <Card>
              <CardHeader>
                <CardTitle>Cash Flow Analysis</CardTitle>
                <CardDescription>
                  Historical cash flow analysis and future projections
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="mb-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="historical">Historical</TabsTrigger>
                    <TabsTrigger value="projections">Projections</TabsTrigger>
                    <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Executive Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm">
                          <p className="mb-4">
                            The cash flow analysis for {application.borrower.companyName || `${application.borrower.firstName} ${application.borrower.lastName}`}'s
                            ${application.amount.toLocaleString()} {application.purpose} loan application reveals a 
                            <span className={
                              cashFlowAnalysis.cashFlowHealth === 'Strong' ? ' text-green-600 font-medium' :
                              cashFlowAnalysis.cashFlowHealth === 'Moderate' ? ' text-amber-600 font-medium' : ' text-red-600 font-medium'
                            }>
                              {' ' + cashFlowAnalysis.cashFlowHealth.toLowerCase() + ' '}
                            </span>
                            cash flow position with
                            <span className={
                              cashFlowAnalysis.repaymentCapacity === 'Strong' ? ' text-green-600 font-medium' :
                              cashFlowAnalysis.repaymentCapacity === 'Moderate' ? ' text-amber-600 font-medium' : ' text-red-600 font-medium'
                            }>
                              {' ' + cashFlowAnalysis.repaymentCapacity.toLowerCase() + ' '}
                            </span>
                            loan repayment capacity.
                          </p>
                          
                          <h4 className="font-semibold mb-2">Key Findings:</h4>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Operating Cash Flow: ${cashFlowAnalysis.historicalData.operatingCashFlow.toLocaleString()} annually</li>
                            <li>Current Debt Service Coverage Ratio: {cashFlowAnalysis.historicalData.debtServiceCoverageRatio.toFixed(2)}x</li>
                            <li>Cash Buffer: {cashFlowAnalysis.volatilityMetrics.cashBufferMonths.toFixed(1)} months of expenses</li>
                            <li>
                              Projected Annual Revenue: ${cashFlowAnalysis.projections.annualRevenue.toLocaleString()} 
                              ({cashFlowAnalysis.projections.annualGrowthRate > 0 ? '+' : ''}{cashFlowAnalysis.projections.annualGrowthRate}%)
                            </li>
                          </ul>
                        </CardContent>
                        <CardFooter className="pt-0 text-sm">
                          <div className="py-2 px-3 bg-muted rounded-md w-full">
                            <span className="font-semibold">Recommendation:</span> {cashFlowAnalysis.recommendation}
                          </div>
                        </CardFooter>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Strengths & Concerns</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm">
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-semibold mb-2 text-green-600">Strengths:</h4>
                              <ul className="list-disc pl-5 space-y-1">
                                {cashFlowAnalysis.strengths.map((strength, idx) => (
                                  <li key={idx}>{strength}</li>
                                ))}
                              </ul>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold mb-2 text-red-600">Concerns:</h4>
                              <ul className="list-disc pl-5 space-y-1">
                                {cashFlowAnalysis.concerns.map((concern, idx) => (
                                  <li key={idx}>{concern}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Monthly Cash Flow Trend</CardTitle>
                        <CardDescription>Last 12 months</CardDescription>
                      </CardHeader>
                      <CardContent className="h-[300px] flex items-center justify-center border border-dashed rounded-md mt-2">
                        [Cash Flow Chart Placeholder]
                      </CardContent>
                      <CardFooter className="text-xs text-muted-foreground">
                        <div className="flex items-center">
                          <Clock className="mr-1 h-3 w-3" />
                          Data extracted from 12 months of bank statements and financial records.
                        </div>
                      </CardFooter>
                    </Card>
                  </TabsContent>

                  <TabsContent value="historical" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Historical Cash Flow Analysis</CardTitle>
                        <CardDescription>Detailed breakdown of historical cash flow components</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Historical content here */}
                        <div className="border border-dashed rounded-md h-[400px] flex items-center justify-center">
                          [Historical Data Analysis Charts]
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="projections" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Future Cash Flow Projections</CardTitle>
                        <CardDescription>{selectedPeriod}-month forecast with stress testing scenarios</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Projections content here */}
                        <div className="border border-dashed rounded-md h-[400px] flex items-center justify-center">
                          [Cash Flow Projections Charts]
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="recommendations" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Cash Flow Improvement Recommendations</CardTitle>
                        <CardDescription>Actionable strategies to strengthen financial position</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                          {cashFlowAnalysis.improvementRecommendations.map((rec, idx) => (
                            <Card key={idx}>
                              <CardHeader className="py-3">
                                <CardTitle className="text-base">{rec.title}</CardTitle>
                              </CardHeader>
                              <CardContent className="py-2 text-sm">
                                {rec.description}
                              </CardContent>
                              <CardFooter className="py-2">
                                <div className="flex flex-wrap gap-2">
                                  {rec.tags.map((tag, tagIdx) => (
                                    <Badge key={tagIdx} variant="secondary">{tag}</Badge>
                                  ))}
                                </div>
                              </CardFooter>
                            </Card>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm" onClick={() => window.location.href = "/applications"}>
                  Back to Applications
                </Button>
                <Button 
                  variant="default" 
                  size="sm"
                  disabled={isAnalyzing}
                  onClick={handleDownloadSummary}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Full Report
                </Button>
              </CardFooter>
            </Card>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default CashFlowAnalysisAgent;

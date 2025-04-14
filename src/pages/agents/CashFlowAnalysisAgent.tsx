
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
                    <TabsTrigger value="historical">Historical Analysis</TabsTrigger>
                    <TabsTrigger value="forecasts">Future Projections</TabsTrigger>
                    <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="space-y-6">
                    <div className="bg-muted/40 p-4 rounded-md border">
                      <h3 className="text-lg font-medium mb-2">Executive Summary</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Analysis of {application.borrower.companyName || `${application.borrower.firstName} ${application.borrower.lastName}`}'s 
                        cash flow indicates a {cashFlowAnalysis.cashFlowHealth.toLowerCase()} overall financial position with 
                        {cashFlowAnalysis.repaymentCapacity.toLowerCase()} capacity to service the requested loan of ${application.amount.toLocaleString()}.
                      </p>
                      
                      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 mt-6">
                        <div>
                          <h4 className="text-sm font-semibold mb-2">Key Strengths</h4>
                          <ul className="space-y-1 text-sm">
                            {cashFlowAnalysis.strengths.map((strength, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                                <span>{strength}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold mb-2">Areas of Concern</h4>
                          <ul className="space-y-1 text-sm">
                            {cashFlowAnalysis.concerns.map((concern, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5" />
                                <span>{concern}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Cash Flow Overview</h3>
                        <div className="h-[300px] bg-muted/40 rounded-md border flex items-center justify-center">
                          [Cash Flow Overview Chart]
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-4">Key Financial Ratios</h3>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="text-sm font-medium">Debt Service Coverage Ratio</div>
                              <div className="text-xs text-muted-foreground">Net operating income / Total debt service</div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-semibold">{cashFlowAnalysis.historicalData.debtServiceCoverageRatio.toFixed(2)}x</div>
                              <div className={`text-xs ${cashFlowAnalysis.historicalData.debtServiceCoverageRatio >= 1.25 ? "text-green-500" : "text-amber-500"}`}>
                                {cashFlowAnalysis.historicalData.debtServiceCoverageRatio >= 1.25 ? "Good" : "Needs Improvement"}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="text-sm font-medium">Cash Conversion Cycle</div>
                              <div className="text-xs text-muted-foreground">DIO + DSO - DPO</div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-semibold">{cashFlowAnalysis.historicalData.cashConversionCycle} days</div>
                              <div className={`text-xs ${cashFlowAnalysis.historicalData.cashConversionCycle <= 60 ? "text-green-500" : "text-amber-500"}`}>
                                {cashFlowAnalysis.historicalData.cashConversionCycle <= 60 ? "Efficient" : "Room for Improvement"}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="text-sm font-medium">Operating Cash Flow Ratio</div>
                              <div className="text-xs text-muted-foreground">Operating cash flow / Current liabilities</div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-semibold">{(cashFlowAnalysis.historicalData.operatingCashFlow / (cashFlowAnalysis.historicalData.existingDebtService * 3)).toFixed(2)}</div>
                              <div className={`text-xs ${(cashFlowAnalysis.historicalData.operatingCashFlow / (cashFlowAnalysis.historicalData.existingDebtService * 3)) >= 1 ? "text-green-500" : "text-amber-500"}`}>
                                {(cashFlowAnalysis.historicalData.operatingCashFlow / (cashFlowAnalysis.historicalData.existingDebtService * 3)) >= 1 ? "Strong" : "Weak"}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="text-sm font-medium">Cash to Debt Ratio</div>
                              <div className="text-xs text-muted-foreground">Cash and equivalents / Total debt</div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-semibold">{(cashFlowAnalysis.volatilityMetrics.cashBufferMonths * cashFlowAnalysis.historicalData.operatingExpenses / 12 / (cashFlowAnalysis.historicalData.existingDebtService * 12)).toFixed(2)}</div>
                              <div className={`text-xs ${(cashFlowAnalysis.volatilityMetrics.cashBufferMonths * cashFlowAnalysis.historicalData.operatingExpenses / 12 / (cashFlowAnalysis.historicalData.existingDebtService * 12)) >= 0.2 ? "text-green-500" : "text-amber-500"}`}>
                                {(cashFlowAnalysis.volatilityMetrics.cashBufferMonths * cashFlowAnalysis.historicalData.operatingExpenses / 12 / (cashFlowAnalysis.historicalData.existingDebtService * 12)) >= 0.2 ? "Adequate" : "Low"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="historical" className="space-y-6">
                    <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Monthly Cash Flow</h3>
                        <div className="h-[350px] bg-muted/40 rounded-md border flex items-center justify-center">
                          [Monthly Cash Flow Chart - Last 12 Months]
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-4">Revenue vs. Operating Expenses</h3>
                        <div className="h-[350px] bg-muted/40 rounded-md border flex items-center justify-center">
                          [Revenue vs. Expenses Chart]
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Cash Flow Components</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-2 px-4 font-medium">Category</th>
                              <th className="text-right py-2 px-4 font-medium">Amount</th>
                              <th className="text-right py-2 px-4 font-medium">% of Revenue</th>
                              <th className="text-right py-2 px-4 font-medium">YoY Change</th>
                              <th className="text-left py-2 px-4 font-medium">Note</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b">
                              <td className="py-3 px-4">Revenue</td>
                              <td className="py-3 px-4 text-right">${cashFlowAnalysis.historicalData.revenue.toLocaleString()}</td>
                              <td className="py-3 px-4 text-right">100.0%</td>
                              <td className={`py-3 px-4 text-right ${cashFlowAnalysis.historicalData.revenueTrend > 0 ? "text-green-500" : "text-red-500"}`}>
                                {cashFlowAnalysis.historicalData.revenueTrend > 0 ? '+' : ''}{cashFlowAnalysis.historicalData.revenueTrend}%
                              </td>
                              <td className="py-3 px-4 text-sm text-muted-foreground">
                                {cashFlowAnalysis.historicalData.revenueTrend > 5 ? "Strong growth" : 
                                 cashFlowAnalysis.historicalData.revenueTrend > 0 ? "Stable growth" : "Declining"}
                              </td>
                            </tr>
                            <tr className="border-b">
                              <td className="py-3 px-4">Cost of Goods Sold</td>
                              <td className="py-3 px-4 text-right">${cashFlowAnalysis.historicalData.cogs.toLocaleString()}</td>
                              <td className="py-3 px-4 text-right">
                                {((cashFlowAnalysis.historicalData.cogs / cashFlowAnalysis.historicalData.revenue) * 100).toFixed(1)}%
                              </td>
                              <td className={`py-3 px-4 text-right ${cashFlowAnalysis.historicalData.cogsTrend < 0 ? "text-green-500" : "text-red-500"}`}>
                                {cashFlowAnalysis.historicalData.cogsTrend > 0 ? '+' : ''}{cashFlowAnalysis.historicalData.cogsTrend}%
                              </td>
                              <td className="py-3 px-4 text-sm text-muted-foreground">
                                {cashFlowAnalysis.historicalData.cogsTrend < 0 ? "Improving efficiency" : "Increasing costs"}
                              </td>
                            </tr>
                            <tr className="border-b">
                              <td className="py-3 px-4">Operating Expenses</td>
                              <td className="py-3 px-4 text-right">${cashFlowAnalysis.historicalData.operatingExpenses.toLocaleString()}</td>
                              <td className="py-3 px-4 text-right">
                                {((cashFlowAnalysis.historicalData.operatingExpenses / cashFlowAnalysis.historicalData.revenue) * 100).toFixed(1)}%
                              </td>
                              <td className={`py-3 px-4 text-right ${cashFlowAnalysis.historicalData.operatingExpensesTrend < 0 ? "text-green-500" : "text-red-500"}`}>
                                {cashFlowAnalysis.historicalData.operatingExpensesTrend > 0 ? '+' : ''}{cashFlowAnalysis.historicalData.operatingExpensesTrend}%
                              </td>
                              <td className="py-3 px-4 text-sm text-muted-foreground">
                                {cashFlowAnalysis.historicalData.operatingExpensesTrend < 0 ? "Good cost control" : "Increasing overhead"}
                              </td>
                            </tr>
                            <tr className="border-b">
                              <td className="py-3 px-4">Operating Cash Flow</td>
                              <td className="py-3 px-4 text-right">${cashFlowAnalysis.historicalData.operatingCashFlow.toLocaleString()}</td>
                              <td className="py-3 px-4 text-right">
                                {((cashFlowAnalysis.historicalData.operatingCashFlow / cashFlowAnalysis.historicalData.revenue) * 100).toFixed(1)}%
                              </td>
                              <td className={`py-3 px-4 text-right ${cashFlowAnalysis.historicalData.operatingCashFlowTrend > 0 ? "text-green-500" : "text-red-500"}`}>
                                {cashFlowAnalysis.historicalData.operatingCashFlowTrend > 0 ? '+' : ''}{cashFlowAnalysis.historicalData.operatingCashFlowTrend}%
                              </td>
                              <td className="py-3 px-4 text-sm text-muted-foreground">
                                {cashFlowAnalysis.historicalData.operatingCashFlowTrend > 0 ? "Improving operations" : "Decreasing efficiency"}
                              </td>
                            </tr>
                            <tr className="border-b">
                              <td className="py-3 px-4">Capital Expenditures</td>
                              <td className="py-3 px-4 text-right">${cashFlowAnalysis.historicalData.capitalExpenditures.toLocaleString()}</td>
                              <td className="py-3 px-4 text-right">
                                {((cashFlowAnalysis.historicalData.capitalExpenditures / cashFlowAnalysis.historicalData.revenue) * 100).toFixed(1)}%
                              </td>
                              <td className={`py-3 px-4 text-right ${cashFlowAnalysis.historicalData.capitalExpendituresTrend > 10 ? "text-amber-500" : "text-green-500"}`}>
                                {cashFlowAnalysis.historicalData.capitalExpendituresTrend > 0 ? '+' : ''}{cashFlowAnalysis.historicalData.capitalExpendituresTrend}%
                              </td>
                              <td className="py-3 px-4 text-sm text-muted-foreground">
                                {cashFlowAnalysis.historicalData.capitalExpendituresTrend > 10 ? "Heavy investment" : "Sustainable investment"}
                              </td>
                            </tr>
                            <tr>
                              <td className="py-3 px-4">Existing Debt Service</td>
                              <td className="py-3 px-4 text-right">${cashFlowAnalysis.historicalData.existingDebtService.toLocaleString()}</td>
                              <td className="py-3 px-4 text-right">
                                {((cashFlowAnalysis.historicalData.existingDebtService / cashFlowAnalysis.historicalData.revenue) * 100).toFixed(1)}%
                              </td>
                              <td className={`py-3 px-4 text-right ${cashFlowAnalysis.historicalData.existingDebtServiceTrend < 0 ? "text-green-500" : "text-amber-500"}`}>
                                {cashFlowAnalysis.historicalData.existingDebtServiceTrend > 0 ? '+' : ''}{cashFlowAnalysis.historicalData.existingDebtServiceTrend}%
                              </td>
                              <td className="py-3 px-4 text-sm text-muted-foreground">
                                {cashFlowAnalysis.historicalData.existingDebtServiceTrend < 0 ? "Decreasing debt burden" : "Increasing debt burden"}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Seasonality & Volatility Analysis</h3>
                      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                        <div>
                          <div className="h-[300px] bg-muted/40 rounded-md border flex items-center justify-center">
                            [Seasonality Chart]
                          </div>
                        </div>
                        <div className="space-y-4">
                          <h4 className="text-md font-medium">Key Observations</h4>
                          <ul className="space-y-2">
                            {cashFlowAnalysis.seasonalityInsights.map((insight, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm">
                                <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                                <span>{insight}</span>
                              </li>
                            ))}
                          </ul>
                          
                          <div className="pt-4">
                            <h4 className="text-md font-medium mb-2">Volatility Metrics</h4>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <div className="text-sm">Cash Buffer</div>
                                <div className="text-sm font-medium">{cashFlowAnalysis.volatilityMetrics.cashBufferMonths.toFixed(1)} months</div>
                              </div>
                              <div className="flex justify-between items-center">
                                <div className="text-sm">Revenue Standard Deviation</div>
                                <div className="text-sm font-medium">${cashFlowAnalysis.volatilityMetrics.revenueStandardDeviation.toLocaleString()}</div>
                              </div>
                              <div className="flex justify-between items-center">
                                <div className="text-sm">Peak to Trough Ratio</div>
                                <div className="text-sm font-medium">{cashFlowAnalysis.volatilityMetrics.peakToTroughRatio.toFixed(2)}x</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="forecasts" className="space-y-6">
                    <div className="bg-muted/40 p-4 rounded-md border">
                      <h3 className="text-lg font-medium mb-2">Projection Summary</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        The {parseInt(selectedPeriod)}-month projection is based on historical performance, seasonality patterns, 
                        industry trends, and the impact of the proposed loan. The forecast indicates 
                        {cashFlowAnalysis.projections.annualGrowthRate > 0 ? " growth" : " stability"} with 
                        {cashFlowAnalysis.repaymentCapacity === "Strong" ? " strong" : cashFlowAnalysis.repaymentCapacity === "Moderate" ? " adequate" : " limited"} 
                        debt service capacity.
                      </p>
                    </div>
                    
                    <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Projected Cash Flow</h3>
                        <div className="h-[350px] bg-muted/40 rounded-md border flex items-center justify-center">
                          [Projected Cash Flow Chart - {selectedPeriod} Months]
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-4">Projected Financial Metrics</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <div className="space-y-0.5">
                              <div className="text-sm font-medium">Annual Revenue</div>
                              <div className="text-xs text-muted-foreground">Projected for next 12 months</div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-semibold">${cashFlowAnalysis.projections.annualRevenue.toLocaleString()}</div>
                              <div className={`text-xs ${cashFlowAnalysis.projections.annualGrowthRate > 0 ? "text-green-500" : "text-amber-500"}`}>
                                {cashFlowAnalysis.projections.annualGrowthRate > 0 ? '+' : ''}{cashFlowAnalysis.projections.annualGrowthRate}% growth
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-start">
                            <div className="space-y-0.5">
                              <div className="text-sm font-medium">Operating Cash Flow</div>
                              <div className="text-xs text-muted-foreground">Projected for next 12 months</div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-semibold">${cashFlowAnalysis.projections.operatingCashFlow.toLocaleString()}</div>
                              <div className={`text-xs ${cashFlowAnalysis.historicalData.operatingCashFlowTrend > 0 ? "text-green-500" : "text-amber-500"}`}>
                                {cashFlowAnalysis.historicalData.operatingCashFlowTrend > 0 ? '+' : ''}{cashFlowAnalysis.historicalData.operatingCashFlowTrend}% vs. current
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-start">
                            <div className="space-y-0.5">
                              <div className="text-sm font-medium">Free Cash Flow</div>
                              <div className="text-xs text-muted-foreground">After capital expenditures</div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-semibold">${cashFlowAnalysis.projections.freeCashFlow.toLocaleString()}</div>
                              <div className="text-xs text-muted-foreground">
                                {((cashFlowAnalysis.projections.freeCashFlow / cashFlowAnalysis.projections.operatingCashFlow) * 100).toFixed(0)}% of operating cash flow
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-start">
                            <div className="space-y-0.5">
                              <div className="text-sm font-medium">DSCR with New Loan</div>
                              <div className="text-xs text-muted-foreground">Including proposed debt</div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-semibold">{cashFlowAnalysis.projections.debtServiceCoverageRatio.toFixed(2)}x</div>
                              <div className={`text-xs ${cashFlowAnalysis.projections.debtServiceCoverageRatio >= 1.25 ? "text-green-500" : "text-amber-500"}`}>
                                {cashFlowAnalysis.projections.debtServiceCoverageRatio >= 1.25 ? "Acceptable" : "Below target"}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-start">
                            <div className="space-y-0.5">
                              <div className="text-sm font-medium">Monthly Payment Capacity</div>
                              <div className="text-xs text-muted-foreground">Maximum sustainable payment</div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-semibold">${cashFlowAnalysis.projections.loanPaymentCapacity.toLocaleString()}/month</div>
                              <div className="text-xs text-muted-foreground">
                                Based on 50% of projected operating cash flow
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Stress Testing Results</h3>
                      <div className="bg-muted/40 p-4 rounded-md border mb-6">
                        <p className="text-sm">
                          {cashFlowAnalysis.stressTestingSummary}
                        </p>
                      </div>
                      
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-2 px-4 font-medium">Scenario</th>
                              <th className="text-right py-2 px-4 font-medium">Revenue Impact</th>
                              <th className="text-right py-2 px-4 font-medium">DSCR Impact</th>
                              <th className="text-right py-2 px-4 font-medium">Cash Buffer Impact</th>
                              <th className="text-left py-2 px-4 font-medium">Risk Assessment</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b">
                              <td className="py-3 px-4">Baseline</td>
                              <td className="py-3 px-4 text-right">$0</td>
                              <td className="py-3 px-4 text-right">{cashFlowAnalysis.projections.debtServiceCoverageRatio.toFixed(2)}x</td>
                              <td className="py-3 px-4 text-right">{cashFlowAnalysis.volatilityMetrics.cashBufferMonths.toFixed(1)} months</td>
                              <td className="py-3 px-4">
                                <Badge variant={cashFlowAnalysis.cashFlowHealth === "Strong" ? "success" : 
                                              cashFlowAnalysis.cashFlowHealth === "Moderate" ? "warning" : "destructive"}>
                                  {cashFlowAnalysis.cashFlowHealth === "Strong" ? "Low Risk" : 
                                   cashFlowAnalysis.cashFlowHealth === "Moderate" ? "Medium Risk" : "High Risk"}
                                </Badge>
                              </td>
                            </tr>
                            <tr className="border-b">
                              <td className="py-3 px-4">10% Revenue Decrease</td>
                              <td className="py-3 px-4 text-right text-red-500">-${Math.round(cashFlowAnalysis.projections.annualRevenue * 0.1).toLocaleString()}</td>
                              <td className="py-3 px-4 text-right">{(cashFlowAnalysis.projections.debtServiceCoverageRatio * 0.85).toFixed(2)}x</td>
                              <td className="py-3 px-4 text-right">{(cashFlowAnalysis.volatilityMetrics.cashBufferMonths * 0.8).toFixed(1)} months</td>
                              <td className="py-3 px-4">
                                <Badge variant={cashFlowAnalysis.cashFlowHealth === "Strong" ? "warning" : "destructive"}>
                                  {cashFlowAnalysis.cashFlowHealth === "Strong" ? "Medium Risk" : "High Risk"}
                                </Badge>
                              </td>
                            </tr>
                            <tr className="border-b">
                              <td className="py-3 px-4">20% Revenue Decrease</td>
                              <td className="py-3 px-4 text-right text-red-500">-${Math.round(cashFlowAnalysis.projections.annualRevenue * 0.2).toLocaleString()}</td>
                              <td className="py-3 px-4 text-right">{(cashFlowAnalysis.projections.debtServiceCoverageRatio * 0.7).toFixed(2)}x</td>
                              <td className="py-3 px-4 text-right">{(cashFlowAnalysis.volatilityMetrics.cashBufferMonths * 0.6).toFixed(1)} months</td>
                              <td className="py-3 px-4">
                                <Badge variant="destructive">High Risk</Badge>
                              </td>
                            </tr>
                            <tr>
                              <td className="py-3 px-4">25% Expense Increase</td>
                              <td className="py-3 px-4 text-right">$0</td>
                              <td className="py-3 px-4 text-right">{(cashFlowAnalysis.projections.debtServiceCoverageRatio * 0.75).toFixed(2)}x</td>
                              <td className="py-3 px-4 text-right">{(cashFlowAnalysis.volatilityMetrics.cashBufferMonths * 0.7).toFixed(1)} months</td>
                              <td className="py-3 px-4">
                                <Badge variant={cashFlowAnalysis.cashFlowHealth === "Strong" ? "warning" : "destructive"}>
                                  {cashFlowAnalysis.cashFlowHealth === "Strong" ? "Medium Risk" : "High Risk"}
                                </Badge>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="recommendations" className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Funding Recommendation</h3>
                      <div className="bg-muted/40 p-4 rounded-md border">
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <div className="text-sm font-medium">Recommended Funding Source</div>
                            <div className="font-semibold">{cashFlowAnalysis.recommendedFundingSource}</div>
                          </div>
                          <div className="flex justify-between items-start">
                            <div className="text-sm font-medium">Recommended Loan Structure</div>
                            <div className="font-semibold">{cashFlowAnalysis.recommendedLoanStructure}</div>
                          </div>
                          <div className="flex justify-between items-start">
                            <div className="text-sm font-medium">Recommended Interest Rate</div>
                            <div className="font-semibold">{cashFlowAnalysis.recommendedInterestRate}%</div>
                          </div>
                          <div className="pt-2">
                            <div className="text-sm font-medium mb-1">Rationale</div>
                            <p className="text-sm">{cashFlowAnalysis.fundingRationale}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Risk Factors</h3>
                        <div className="space-y-3">
                          {cashFlowAnalysis.riskFactors.map((factor, idx) => (
                            <div key={idx} className="bg-muted/40 p-3 rounded-md border">
                              <p className={`text-sm ${
                                factor.includes('Strong') || factor.includes('Positive') || factor.includes('Low') ? 'text-green-600' : 
                                factor.includes('Moderate') || factor.includes('Flat') ? 'text-amber-600' : 'text-red-600'
                              }`}>
                                {factor}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-4">Mitigation Strategies</h3>
                        <div className="space-y-3">
                          {cashFlowAnalysis.mitigationStrategies.map((strategy, idx) => (
                            <div key={idx} className="bg-muted/40 p-3 rounded-md border">
                              <p className="text-sm">{strategy}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Cash Flow Improvement Recommendations</h3>
                      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                        {cashFlowAnalysis.improvementRecommendations.map((rec, idx) => (
                          <Card key={idx}>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base">{rec.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="pb-3">
                              <p className="text-sm text-muted-foreground">{rec.description}</p>
                            </CardContent>
                            <CardFooter className="pt-0">
                              <div className="flex flex-wrap gap-1">
                                {rec.tags.map((tag, tagIdx) => (
                                  <Badge key={tagIdx} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default CashFlowAnalysisAgent;

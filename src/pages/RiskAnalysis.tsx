
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BarChart, LineChart } from "@/components/ui/charts";
import { Search, Filter, Download, AlertCircle, TrendingUp, TrendingDown, AlertTriangle, ShieldAlert, BarChart4 } from "lucide-react";
import { Input } from "@/components/ui/input";

const mockRiskMetrics = [
  {
    id: "RM-001",
    name: "Average Loan-to-Value Ratio",
    value: "65%",
    trend: "+3%",
    status: "Acceptable",
    description: "The average LTV ratio across the portfolio, indicating the loan amount relative to the appraised value of assets."
  },
  {
    id: "RM-002",
    name: "Portfolio Concentration Risk",
    value: "Medium",
    trend: "Stable",
    status: "Caution",
    description: "Measures overexposure to specific sectors, geographies, or borrowers that could amplify losses during adverse events."
  },
  {
    id: "RM-003",
    name: "Probability of Default",
    value: "2.7%",
    trend: "-0.5%",
    status: "Good",
    description: "The likelihood that a borrower will fail to make required debt service payments over a specific time horizon."
  },
  {
    id: "RM-004",
    name: "Loss Given Default Ratio",
    value: "28%",
    trend: "+1%",
    status: "Acceptable",
    description: "The proportion of an exposure that would be lost if a borrower defaults, after accounting for recoveries."
  },
  {
    id: "RM-005",
    name: "Interest Rate Risk",
    value: "High",
    trend: "+10%",
    status: "Warning",
    description: "The portfolio's sensitivity to interest rate fluctuations, particularly for fixed-rate loans in a rising rate environment."
  },
  {
    id: "RM-006",
    name: "Average Debt Service Coverage Ratio",
    value: "1.45",
    trend: "+0.1",
    status: "Good",
    description: "The ability of cash flows to cover debt service payments, with higher ratios indicating stronger borrower financial health."
  }
];

const mockChartData = [
  { name: "Jan", expected: 2.1, actual: 2.0 },
  { name: "Feb", expected: 2.2, actual: 2.1 },
  { name: "Mar", expected: 2.3, actual: 2.4 },
  { name: "Apr", expected: 2.4, actual: 2.7 },
  { name: "May", expected: 2.5, actual: 2.5 },
  { name: "Jun", expected: 2.6, actual: 2.3 },
  { name: "Jul", expected: 2.7, actual: 2.4 },
  { name: "Aug", expected: 2.8, actual: 2.9 },
  { name: "Sep", expected: 2.9, actual: 3.1 },
  { name: "Oct", expected: 3.0, actual: 2.7 },
  { name: "Nov", expected: 3.1, actual: 2.5 },
  { name: "Dec", expected: 3.2, actual: 2.7 },
];

const mockStressTestData = [
  { name: "Baseline", loss: 2.1 },
  { name: "Mild Recession", loss: 4.3 },
  { name: "Severe Recession", loss: 7.8 },
  { name: "Financial Crisis", loss: 12.5 },
];

const getStatusColor = (status: string) => {
  if (status === "Good") return "success";
  if (status === "Acceptable") return "default";
  if (status === "Caution") return "warning";
  return "destructive";
};

const getTrendIcon = (trend: string) => {
  if (trend.startsWith("+")) return <TrendingUp className="h-4 w-4 text-red-500" />;
  if (trend.startsWith("-")) return <TrendingDown className="h-4 w-4 text-green-500" />;
  return <TrendingDown className="h-4 w-4 text-amber-500 rotate-45" />;
};

const RiskAnalysis = () => {
  const [tab, setTab] = useState("metrics");
  const [searchTerm, setSearchTerm] = useState("");
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Risk Analysis</h1>
            <p className="text-muted-foreground">
              Analyze and manage risk across the loan portfolio
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button size="sm">
              <BarChart4 className="mr-2 h-4 w-4" />
              Run Stress Test
            </Button>
          </div>
        </div>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium">Overall Portfolio Risk</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Moderate</div>
              <div className="flex items-center gap-1 text-xs text-amber-500">
                <AlertTriangle className="h-3 w-3" />
                <span>Trending stable</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium">Risk-Adjusted Return</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">6.8%</div>
              <div className="flex items-center gap-1 text-xs text-green-500">
                <TrendingUp className="h-3 w-3" />
                <span>+0.4% from last quarter</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium">Expected Loss Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.7%</div>
              <div className="flex items-center gap-1 text-xs text-green-500">
                <TrendingDown className="h-3 w-3" />
                <span>-0.3% from last quarter</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium">Risk Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <div className="flex items-center gap-1 text-xs text-red-500">
                <ShieldAlert className="h-3 w-3" />
                <span>Requires attention</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Risk Management Dashboard</CardTitle>
            <CardDescription>Monitor portfolio risk metrics and review risk assessment reports.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={tab} onValueChange={setTab} className="w-full">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                <TabsList>
                  <TabsTrigger value="metrics">Risk Metrics</TabsTrigger>
                  <TabsTrigger value="trends">Risk Trends</TabsTrigger>
                  <TabsTrigger value="stress">Stress Tests</TabsTrigger>
                </TabsList>
                
                <div className="relative w-full sm:w-60">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search metrics..."
                    className="pl-8 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <TabsContent value="metrics" className="w-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Metric</TableHead>
                      <TableHead>Current Value</TableHead>
                      <TableHead>Trend</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockRiskMetrics.map((metric) => (
                      <TableRow key={metric.id}>
                        <TableCell className="font-medium">{metric.name}</TableCell>
                        <TableCell>{metric.value}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {getTrendIcon(metric.trend)}
                            <span>{metric.trend}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(metric.status) as any}>{metric.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">View</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
              
              <TabsContent value="trends">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Default Rate - Expected vs. Actual</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <LineChart
                        data={mockChartData}
                        dataKey="name"
                        categories={["expected", "actual"]}
                        colors={["#8B5CF6", "#EF4444"]}
                        valueFormatter={(value) => `${value}%`}
                        yAxisWidth={30}
                      />
                    </div>
                  </CardContent>
                </Card>
                
                <div className="mt-6">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>Risk Trend Analysis</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground mb-4">
                          The portfolio's default rate has been trending slightly above projections in recent months, 
                          suggesting a need to tighten underwriting standards or adjust risk models. The current 2.7% rate
                          still falls within acceptable parameters but warrants monitoring.
                        </p>
                        <p className="text-muted-foreground">
                          Contributing factors include rising interest rates and economic uncertainty in key markets.
                          Recommended actions include reviewing concentration limits and increasing reserves for potential losses.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-2">
                      <AccordionTrigger>Emerging Risk Factors</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                          <li>Increasing interest rate volatility affecting variable-rate loans</li>
                          <li>Sector concentration in commercial real estate may require diversification</li>
                          <li>Regional economic slowdown in the southwest market</li>
                          <li>Regulatory changes anticipated in Q3 that may impact capital requirements</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-3">
                      <AccordionTrigger>Risk Mitigation Strategies</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                          <li>Implement enhanced early warning system for at-risk loans</li>
                          <li>Review and adjust collateral requirements for high-risk sectors</li>
                          <li>Increase diversification across asset classes and geographies</li>
                          <li>Deploy AI-driven predictive analytics for proactive risk management</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </TabsContent>
              
              <TabsContent value="stress">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Portfolio Loss Projections Under Stress Scenarios</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <BarChart
                        data={mockStressTestData}
                        dataKey="name"
                        categories={["loss"]}
                        colors={["#EF4444"]}
                        valueFormatter={(value) => `${value}%`}
                        yAxisWidth={30}
                      />
                    </div>
                  </CardContent>
                </Card>
                
                <div className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Stress Test Methodology</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">
                        This stress test evaluates portfolio resilience across multiple economic scenarios:
                      </p>
                      
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="scenario-1">
                          <AccordionTrigger>Baseline Scenario</AccordionTrigger>
                          <AccordionContent>
                            <p className="text-muted-foreground">
                              Current economic conditions persist with moderate growth of 2-3% GDP,
                              stable interest rates, and normal market volatility. Expected loss: 2.1%.
                            </p>
                          </AccordionContent>
                        </AccordionItem>
                        
                        <AccordionItem value="scenario-2">
                          <AccordionTrigger>Mild Recession Scenario</AccordionTrigger>
                          <AccordionContent>
                            <p className="text-muted-foreground">
                              Economic slowdown with -0.5% to -1.5% GDP contraction for 2-3 quarters,
                              moderate unemployment increase, and 100-150 basis point rise in interest rates.
                              Expected loss: 4.3%.
                            </p>
                          </AccordionContent>
                        </AccordionItem>
                        
                        <AccordionItem value="scenario-3">
                          <AccordionTrigger>Severe Recession Scenario</AccordionTrigger>
                          <AccordionContent>
                            <p className="text-muted-foreground">
                              Deep economic contraction with -3% to -5% GDP decline lasting 4+ quarters,
                              significant unemployment spike, and sharp property value declines of 15-25%.
                              Expected loss: 7.8%.
                            </p>
                          </AccordionContent>
                        </AccordionItem>
                        
                        <AccordionItem value="scenario-4">
                          <AccordionTrigger>Financial Crisis Scenario</AccordionTrigger>
                          <AccordionContent>
                            <p className="text-muted-foreground">
                              Systemic financial stress similar to 2008, with severe market disruption,
                              liquidity crisis, GDP decline exceeding 6%, and commercial property value
                              collapses of 30-40%. Expected loss: 12.5%.
                            </p>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </CardContent>
                    <CardFooter>
                      <p className="text-sm text-muted-foreground">
                        The portfolio remains adequately capitalized to withstand a severe recession without
                        breaching regulatory capital requirements. However, a financial crisis scenario would
                        require contingency funding measures.
                      </p>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default RiskAnalysis;

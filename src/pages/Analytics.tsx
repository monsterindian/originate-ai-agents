import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, BarChart, PieChart } from "@/components/ui/charts";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Download, BarChart as BarChartIcon, PieChart as PieChartIcon, LineChart as LineChartIcon, TrendingUp } from "lucide-react";

const mockMonthlyData = [
  { name: "Jan", value: 1200000 },
  { name: "Feb", value: 1900000 },
  { name: "Mar", value: 2400000 },
  { name: "Apr", value: 1850000 },
  { name: "May", value: 3200000 },
  { name: "Jun", value: 2800000 },
  { name: "Jul", value: 3800000 },
  { name: "Aug", value: 3100000 },
  { name: "Sep", value: 2700000 },
  { name: "Oct", value: 3500000 },
  { name: "Nov", value: 3900000 },
  { name: "Dec", value: 3300000 },
];

const mockAssetClassData = [
  { name: "Commercial Real Estate", value: 45 },
  { name: "Equipment", value: 20 },
  { name: "Working Capital", value: 15 },
  { name: "Construction", value: 12 },
  { name: "Other", value: 8 },
];

const mockPerformanceData = [
  { name: "Current", value: 85 },
  { name: "30-60 Days", value: 10 },
  { name: "60-90 Days", value: 4 },
  { name: "90+ Days", value: 1 },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const Analytics = () => {
  const [timeframe, setTimeframe] = useState("year");
  const [tab, setTab] = useState("overview");
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
            <p className="text-muted-foreground">
              View performance metrics and trends across the loan portfolio
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select defaultValue="year">
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Calendar className="mr-2 h-4 w-4" />
              Date Range
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium">Total Portfolio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$8.75M</div>
              <div className="flex items-center gap-1 text-xs text-emerald-500">
                <TrendingUp className="h-3 w-3" />
                <span>+12.5% from last year</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <div className="flex items-center gap-1 text-xs text-emerald-500">
                <TrendingUp className="h-3 w-3" />
                <span>+8.3% from last year</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">75%</div>
              <div className="flex items-center gap-1 text-xs text-emerald-500">
                <TrendingUp className="h-3 w-3" />
                <span>+5% from last year</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium">Average Loan Size</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$1.75M</div>
              <div className="flex items-center gap-1 text-xs text-emerald-500">
                <TrendingUp className="h-3 w-3" />
                <span>+15% from last year</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>Analytics Dashboard</CardTitle>
            <CardDescription>Access comprehensive reporting and visualizations for business insights.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={tab} onValueChange={setTab} className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="overview">
                  <BarChartIcon className="mr-2 h-4 w-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="volume">
                  <LineChartIcon className="mr-2 h-4 w-4" />
                  Loan Volume
                </TabsTrigger>
                <TabsTrigger value="assets">
                  <PieChartIcon className="mr-2 h-4 w-4" />
                  Asset Classes
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Monthly Loan Origination</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <BarChart
                          data={mockMonthlyData}
                          dataKey="name"
                          categories={["value"]}
                          colors={["#8B5CF6"]}
                          valueFormatter={(value) => formatCurrency(value)}
                          yAxisWidth={80}
                        />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Loan Portfolio by Asset Class</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center">
                      <div className="h-80 w-80">
                        <PieChart
                          data={mockAssetClassData}
                          dataKey="name"
                          categories={["value"]}
                          colors={["#8B5CF6", "#22C55E", "#F59E0B", "#EF4444", "#0EA5E9"]}
                          valueFormatter={(value) => `${value}%`}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Loan Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <PieChart
                          data={mockPerformanceData}
                          dataKey="name"
                          categories={["value"]}
                          colors={["#22C55E", "#F59E0B", "#EF4444", "#8B5CF6"]}
                          valueFormatter={(value) => `${value}%`}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="volume">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Loan Volume Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-96">
                      <LineChart
                        data={mockMonthlyData}
                        dataKey="name"
                        categories={["value"]}
                        colors={["#8B5CF6"]}
                        valueFormatter={(value) => formatCurrency(value)}
                        yAxisWidth={80}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="assets">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Asset Class Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-96">
                      <PieChart 
                        data={mockAssetClassData}
                        dataKey="name"
                        categories={["value"]}
                        colors={["#8B5CF6", "#22C55E", "#F59E0B", "#EF4444", "#0EA5E9"]}
                        valueFormatter={(value) => `${value}%`}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Analytics;

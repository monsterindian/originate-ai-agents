
import React from 'react';
import { 
  BarChart, 
  LineChart, 
  PieChart
} from '@/components/ui/charts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Info } from 'lucide-react';
import { CashFlowAnalysis } from '@/types';
import { 
  generateMonthlyTrendData, 
  generateHistoricalCashFlowData, 
  generateProjectionsData,
  generateCashFlowSourceData
} from '@/services/mock/cashFlowChartData';

interface CashFlowChartsProps {
  analysis: CashFlowAnalysis;
}

export const CashFlowCharts: React.FC<CashFlowChartsProps> = ({ analysis }) => {
  // Generate all the chart data
  const monthlyTrendData = generateMonthlyTrendData(analysis);
  const historicalData = generateHistoricalCashFlowData(analysis);
  const projectionsData = generateProjectionsData(analysis);
  const cashFlowSourceData = generateCashFlowSourceData(analysis);

  // Format currency values
  const currencyFormatter = (value: number) => 
    new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      maximumFractionDigits: 0 
    }).format(value);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Monthly Cash Flow Trend */}
      <Card className="col-span-1 md:col-span-2">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle>Monthly Cash Flow Trend</CardTitle>
            <Badge variant="outline" className="px-2 py-1">
              Last 12 Months
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Track your revenue, expenses, and net cash flow over time
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4 text-sm">
            <div className="flex items-center mr-4">
              <div className="w-3 h-3 rounded-full bg-[#22C55E] mr-1"></div>
              <span>Revenue</span>
            </div>
            <div className="flex items-center mr-4">
              <div className="w-3 h-3 rounded-full bg-[#EF4444] mr-1"></div>
              <span>Expenses</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-[#2563EB] mr-1"></div>
              <span>Net Cash Flow</span>
            </div>
          </div>
          <div className="h-[300px] flex items-center justify-center">
            <LineChart
              data={monthlyTrendData}
              dataKey="month"
              categories={["Revenue", "Expenses", "Net Cash Flow"]}
              colors={["#22C55E", "#EF4444", "#2563EB"]}
              valueFormatter={currencyFormatter}
              showLegend={false}
              showGrid
            />
          </div>
          <div className="flex items-center text-xs text-muted-foreground mt-2">
            <Info className="w-3 h-3 mr-1" />
            <span>Monthly fluctuations may be influenced by seasonality and business cycles</span>
          </div>
        </CardContent>
      </Card>

      {/* Historical Cash Flow Analysis */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Historical Cash Flow Analysis</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Operating vs Free Cash Flow by quarter
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <BarChart
              data={historicalData}
              dataKey="period"
              categories={["Operating Cash Flow", "Free Cash Flow"]}
              colors={["#2563EB", "#8B5CF6"]}
              valueFormatter={currencyFormatter}
              showLegend
              showGrid
            />
          </div>
          <Separator className="my-4" />
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">Avg. Operating CF</div>
              <div className="font-medium">
                {currencyFormatter(
                  Math.round(
                    historicalData.reduce((sum, item) => sum + (item["Operating Cash Flow"] as number), 0) / 
                    historicalData.length
                  )
                )}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">Avg. Free CF</div>
              <div className="font-medium">
                {currencyFormatter(
                  Math.round(
                    historicalData.reduce((sum, item) => sum + (item["Free Cash Flow"] as number), 0) / 
                    historicalData.length
                  )
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Future Cash Flow Projections */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Future Cash Flow Projections</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            12-month forecast of cash flows and debt service
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <LineChart
              data={projectionsData.slice(0, 12)} // Show first 12 months
              dataKey="period"
              categories={["Operating Cash Flow", "Free Cash Flow", "Debt Service"]}
              colors={["#2563EB", "#8B5CF6", "#F59E0B"]}
              valueFormatter={currencyFormatter}
              showLegend
              showGrid
            />
          </div>
          <div className="flex flex-col space-y-2 mt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Annual Growth Rate:</span>
              <Badge variant={analysis.projections.annualGrowthRate > 5 ? "success" : "outline"}>
                {Math.round(analysis.projections.annualGrowthRate)}%
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Avg. Projected DSCR:</span>
              <Badge variant={analysis.projections.debtServiceCoverageRatio >= 1.5 ? "success" : "outline"}>
                {Math.round(analysis.projections.debtServiceCoverageRatio)}x
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cash Flow Sources */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Revenue Sources Breakdown</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Distribution of revenue by business line
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center mb-4">
            <div className="w-64 h-64">
              <PieChart
                data={cashFlowSourceData}
                dataKey="name"
                categories={["value"]}
                colors={["#2563EB", "#8B5CF6", "#F59E0B"]}
                valueFormatter={currencyFormatter}
                showLegend
              />
            </div>
          </div>
          <Separator className="mb-4" />
          <div className="space-y-2">
            {cashFlowSourceData.map((source, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{backgroundColor: index === 0 ? '#2563EB' : index === 1 ? '#8B5CF6' : '#F59E0B'}}
                  ></div>
                  <span className="text-sm">{source.name}</span>
                </div>
                <div className="text-sm font-medium">
                  {Math.round((source.value / cashFlowSourceData.reduce((sum, s) => sum + s.value, 0)) * 100)}%
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Debt Service Coverage Ratio Trend */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>DSCR Projection Trend</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Debt service coverage ratio over 12 months
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <LineChart
              data={projectionsData.slice(0, 12)}
              dataKey="period"
              categories={["DSCR"]}
              colors={["#22C55E"]}
              valueFormatter={(value: number) => Math.round(value) + "x"}
              showLegend={false}
              showGrid
            />
          </div>
          <div className="mt-4 p-3 bg-muted/30 rounded-md">
            <div className="text-sm font-medium">Key DSCR Thresholds</div>
            <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
              <div>
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                  &lt; 1.2x
                </Badge>
                <p className="mt-1">High Risk</p>
              </div>
              <div>
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                  1.2x - 1.5x
                </Badge>
                <p className="mt-1">Moderate Risk</p>
              </div>
              <div>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  &gt; 1.5x
                </Badge>
                <p className="mt-1">Low Risk</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};


import React from 'react';
import { 
  BarChart, 
  LineChart, 
  PieChart
} from '@/components/ui/charts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
        <CardHeader>
          <CardTitle>Monthly Cash Flow Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <LineChart
            data={monthlyTrendData}
            dataKey="month"
            categories={["Revenue", "Expenses", "Net Cash Flow"]}
            colors={["#22C55E", "#EF4444", "#2563EB"]}
            valueFormatter={currencyFormatter}
            showLegend
            showGrid
          />
        </CardContent>
      </Card>

      {/* Historical Cash Flow Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Historical Cash Flow Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <BarChart
            data={historicalData}
            dataKey="period"
            categories={["Operating Cash Flow", "Free Cash Flow"]}
            colors={["#2563EB", "#8B5CF6"]}
            valueFormatter={currencyFormatter}
            showLegend
            showGrid
          />
        </CardContent>
      </Card>

      {/* Future Cash Flow Projections */}
      <Card>
        <CardHeader>
          <CardTitle>Future Cash Flow Projections</CardTitle>
        </CardHeader>
        <CardContent>
          <LineChart
            data={projectionsData.slice(0, 12)} // Show first 12 months
            dataKey="period"
            categories={["Operating Cash Flow", "Free Cash Flow", "Debt Service"]}
            colors={["#2563EB", "#8B5CF6", "#F59E0B"]}
            valueFormatter={currencyFormatter}
            showLegend
            showGrid
          />
        </CardContent>
      </Card>

      {/* Cash Flow Sources */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Sources Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
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
        </CardContent>
      </Card>

      {/* Debt Service Coverage Ratio Trend */}
      <Card>
        <CardHeader>
          <CardTitle>DSCR Projection Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <LineChart
            data={projectionsData.slice(0, 12)}
            dataKey="period"
            categories={["DSCR"]}
            colors={["#22C55E"]}
            valueFormatter={(value: number) => value.toFixed(2) + "x"}
            showLegend
            showGrid
          />
        </CardContent>
      </Card>
    </div>
  );
};

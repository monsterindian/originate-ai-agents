
import { 
  Bar, 
  BarChart, 
  CartesianGrid, 
  Legend, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AssetClass } from "@/types";

type AssetClassChartProps = {
  data: Record<AssetClass, number>;
  className?: string;
};

const AssetClassChart = ({ data, className }: AssetClassChartProps) => {
  const assetNames: Record<AssetClass, string> = {
    residential_mortgage: "Residential Mortgage",
    commercial_real_estate: "Commercial RE",
    auto_loan: "Auto Loan",
    personal_loan: "Personal Loan",
    sme_loan: "SME Loan",
    equipment_finance: "Equipment Finance",
    other: "Other"
  };

  const chartData = Object.entries(data)
    .map(([assetClass, count]) => ({
      name: assetNames[assetClass as AssetClass],
      count,
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Loans by Asset Class</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 60,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={70}
              />
              <YAxis />
              <Tooltip
                formatter={(value, name) => [value, "Count"]}
                labelFormatter={(label) => `Asset Class: ${label}`}
              />
              <Legend />
              <Bar dataKey="count" name="Application Count" fill="#3182CE" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssetClassChart;

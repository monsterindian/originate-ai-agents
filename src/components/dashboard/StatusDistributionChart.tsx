
import { 
  Cell, 
  Legend, 
  Pie, 
  PieChart, 
  ResponsiveContainer, 
  Tooltip 
} from "recharts";
import { LoanStatus } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type StatusDistributionChartProps = {
  data: Record<LoanStatus, number>;
  className?: string;
};

const StatusDistributionChart = ({ data, className }: StatusDistributionChartProps) => {
  const statusNames: Record<LoanStatus, string> = {
    draft: "Draft",
    submitted: "Submitted",
    reviewing: "Under Review",
    information_needed: "Info Needed",
    underwriting: "Underwriting",
    approved: "Approved",
    conditionally_approved: "Conditionally Approved",
    rejected: "Rejected",
    funding: "Funding",
    funded: "Funded",
    closed: "Closed",
    pre_qualification_complete: "Pre-Qualification Complete"
  };

  const statusColors: Record<LoanStatus, string> = {
    draft: "#CBD5E1", // slate-300
    submitted: "#93C5FD", // blue-300
    reviewing: "#60A5FA", // blue-400
    information_needed: "#C4B5FD", // violet-300
    underwriting: "#818CF8", // indigo-400
    approved: "#4ADE80", // green-400
    conditionally_approved: "#FCD34D", // amber-300
    rejected: "#F87171", // red-400
    funding: "#A78BFA", // violet-400
    funded: "#34D399", // emerald-400
    closed: "#6B7280", // gray-500
    pre_qualification_complete: "#8B5CF6" // violet-500
  };

  const chartData = Object.entries(data)
    .filter(([_, value]) => value > 0) // Only include statuses with applications
    .map(([status, value]) => ({
      name: statusNames[status as LoanStatus],
      value,
      status,
      color: statusColors[status as LoanStatus]
    }));

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Application Status Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${Math.round(percent * 100)}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number, name: string) => [
                  `${Math.round(value)} applications`, name
                ]}
              />
              <Legend 
                layout="vertical" 
                verticalAlign="middle" 
                align="right"
                wrapperStyle={{ paddingLeft: 20 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusDistributionChart;

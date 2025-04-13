
import * as React from "react"
import { 
  AreaChart as RechartsAreaChart,
  BarChart as RechartsBarChart,
  LineChart as RechartsLineChart,
  PieChart as RechartsPieChart,
  Area, 
  Bar, 
  Line, 
  Pie,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
} from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./chart"

type ChartProps = {
  data: any[]
  dataKey: string
  categories: string[]
  colors?: string[]
  valueFormatter?: (value: number) => string
  yAxisWidth?: number
  showLegend?: boolean
  showTooltip?: boolean
  showGrid?: boolean
  className?: string
}

export function BarChart({
  data,
  dataKey,
  categories,
  colors = ["#8B5CF6"],
  valueFormatter = (value: number) => `${value}`,
  yAxisWidth = 50,
  showLegend = true,
  showTooltip = true,
  showGrid = true,
  className,
}: ChartProps) {
  const chartColors = {
    ...Object.fromEntries(
      categories.map((category, i) => [
        category,
        { color: colors[i % colors.length] },
      ])
    ),
  }

  return (
    <ChartContainer
      config={chartColors}
      className={className}
    >
      <RechartsBarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" vertical={false} />}
        <XAxis
          dataKey={dataKey}
          axisLine={false}
          tickLine={false}
          tickMargin={10}
          tick={{ fontSize: 12 }}
        />
        <YAxis
          width={yAxisWidth}
          axisLine={false}
          tickLine={false}
          tickMargin={10}
          tick={{ fontSize: 12 }}
          tickFormatter={valueFormatter}
        />
        {showTooltip && (
          <ChartTooltip content={<ChartTooltipContent formatter={valueFormatter} />} />
        )}
        {showLegend && (
          <Legend
            verticalAlign="top"
            height={40}
            fontSize={12}
          />
        )}
        {categories.map((category, i) => (
          <Bar
            key={category}
            name={category}
            type="monotone"
            dataKey={category}
            fill={colors[i % colors.length]}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </RechartsBarChart>
    </ChartContainer>
  )
}

export function LineChart({
  data,
  dataKey,
  categories,
  colors = ["#8B5CF6"],
  valueFormatter = (value: number) => `${value}`,
  yAxisWidth = 50,
  showLegend = true,
  showTooltip = true,
  showGrid = true,
  className,
}: ChartProps) {
  const chartColors = {
    ...Object.fromEntries(
      categories.map((category, i) => [
        category,
        { color: colors[i % colors.length] },
      ])
    ),
  }

  return (
    <ChartContainer
      config={chartColors}
      className={className}
    >
      <RechartsLineChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" vertical={false} />}
        <XAxis
          dataKey={dataKey}
          axisLine={false}
          tickLine={false}
          tickMargin={10}
          tick={{ fontSize: 12 }}
        />
        <YAxis
          width={yAxisWidth}
          axisLine={false}
          tickLine={false}
          tickMargin={10}
          tick={{ fontSize: 12 }}
          tickFormatter={valueFormatter}
        />
        {showTooltip && (
          <ChartTooltip content={<ChartTooltipContent formatter={valueFormatter} />} />
        )}
        {showLegend && (
          <Legend
            verticalAlign="top"
            height={40}
            fontSize={12}
          />
        )}
        {categories.map((category, i) => (
          <Line
            key={category}
            name={category}
            type="monotone"
            dataKey={category}
            stroke={colors[i % colors.length]}
            activeDot={{ r: 6 }}
            strokeWidth={2}
          />
        ))}
      </RechartsLineChart>
    </ChartContainer>
  )
}

type PieChartProps = {
  data: any[]
  dataKey?: string
  categories?: string[]
  colors?: string[]
  valueFormatter?: (value: number) => string
  showLegend?: boolean
  showTooltip?: boolean
  className?: string
  series?: any[]
}

export function PieChart({
  data,
  dataKey = "name",
  categories = ["value"],
  colors = ["#8B5CF6", "#22C55E", "#F59E0B", "#EF4444", "#0EA5E9"],
  valueFormatter = (value: number) => `${value}`,
  showLegend = true,
  showTooltip = true,
  className,
  series,
}: PieChartProps) {
  const chartColors = {
    ...Object.fromEntries(
      colors.map((color, i) => [
        `color${i}`,
        { color },
      ])
    ),
  }

  return (
    <ChartContainer
      config={chartColors}
      className={className}
    >
      <RechartsPieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
        <Pie
          data={data}
          dataKey={categories[0]}
          nameKey={dataKey}
          cx="50%"
          cy="50%"
          outerRadius={80}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        {showTooltip && <Tooltip formatter={valueFormatter} />}
        {showLegend && (
          <Legend 
            layout="vertical" 
            verticalAlign="middle" 
            align="right"
            wrapperStyle={{ paddingLeft: 20 }}
          />
        )}
      </RechartsPieChart>
    </ChartContainer>
  )
}

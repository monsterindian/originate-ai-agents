
import { faker } from "@faker-js/faker";
import { CashFlowAnalysis } from "@/types";

// Generate monthly cash flow trend data for charts
export const generateMonthlyTrendData = (analysis: CashFlowAnalysis, monthCount: number = 12) => {
  const { historicalData, volatilityMetrics } = analysis;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const baseOperatingCashFlow = historicalData.operatingCashFlow / 12;
  const stdDev = volatilityMetrics.revenueStandardDeviation / 12;
  
  // Apply some seasonal patterns based on volatility
  const seasonality = [0.9, 0.85, 0.95, 1.05, 1.1, 1.15, 1.2, 1.15, 1.05, 1.0, 1.1, 1.2];
  
  return Array.from({ length: monthCount }, (_, i) => {
    const monthIndex = i % 12;
    const yearOffset = Math.floor(i / 12);
    const growthFactor = 1 + ((historicalData.operatingCashFlowTrend / 100) * yearOffset);
    
    // Calculate cash flow with seasonality and some randomness
    const operatingCashFlow = Math.round(
      baseOperatingCashFlow * seasonality[monthIndex] * growthFactor +
      faker.number.int({ min: -stdDev / 2, max: stdDev / 2 })
    );
    
    // Calculate revenue and expenses
    const revenue = Math.round(
      (historicalData.revenue / 12) * seasonality[monthIndex] * growthFactor +
      faker.number.int({ min: -stdDev, max: stdDev })
    );
    
    const expenses = revenue - operatingCashFlow;
    
    return {
      month: months[monthIndex] + (yearOffset > 0 ? ` '${(new Date().getFullYear() + yearOffset) % 100}` : ''),
      Revenue: revenue,
      Expenses: expenses,
      "Net Cash Flow": operatingCashFlow
    };
  });
};

// Generate historical cash flow analysis data
export const generateHistoricalCashFlowData = (analysis: CashFlowAnalysis) => {
  const { historicalData } = analysis;
  
  // Create quarterly data for the past 2 years
  const quarters = ["Q1", "Q2", "Q3", "Q4", "Q1", "Q2", "Q3", "Q4"];
  const currentYear = new Date().getFullYear();
  
  return quarters.map((quarter, i) => {
    const yearOffset = Math.floor(i / 4);
    const year = currentYear - 2 + yearOffset;
    const period = `${quarter} ${year}`;
    
    // Apply trends over time
    const trendFactor = 1 + ((historicalData.operatingCashFlowTrend / 100) * (i / 4));
    
    // Quarterly revenue and expenses with some variance
    const quarterlyRevenue = Math.round((historicalData.revenue / 4) * trendFactor);
    const quarterlyCOGS = Math.round((historicalData.cogs / 4) * trendFactor);
    const quarterlyOpEx = Math.round((historicalData.operatingExpenses / 4) * trendFactor);
    
    // Cash flow metrics
    const operatingCashFlow = quarterlyRevenue - quarterlyCOGS - quarterlyOpEx;
    const capEx = Math.round((historicalData.capitalExpenditures / 4) * trendFactor);
    const freeCashFlow = operatingCashFlow - capEx;
    
    return {
      period,
      Revenue: quarterlyRevenue,
      COGS: quarterlyCOGS,
      "Operating Expenses": quarterlyOpEx,
      "Operating Cash Flow": operatingCashFlow,
      "Capital Expenditures": capEx,
      "Free Cash Flow": freeCashFlow
    };
  });
};

// Generate future cash flow projections
export const generateProjectionsData = (analysis: CashFlowAnalysis) => {
  const { projections, projectionPeriod } = analysis;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  
  // Create projection data for each month in the projection period
  return Array.from({ length: projectionPeriod }, (_, i) => {
    const monthIndex = (currentMonth + i) % 12;
    const yearOffset = Math.floor((currentMonth + i) / 12);
    const year = currentDate.getFullYear() + yearOffset;
    
    // Monthly growth rate
    const monthlyGrowthRate = (projections.annualGrowthRate / 100) / 12;
    const growthFactor = Math.pow(1 + monthlyGrowthRate, i);
    
    // Apply some seasonality
    const seasonalFactor = 1 + (((monthIndex % 3 === 0) ? 0.1 : (monthIndex % 3 === 1) ? -0.05 : 0) * growthFactor);
    
    // Monthly projections with growth and seasonality
    const projectedRevenue = Math.round((projections.annualRevenue / 12) * growthFactor * seasonalFactor);
    const projectedOperatingCashFlow = Math.round((projections.operatingCashFlow / 12) * growthFactor * seasonalFactor);
    const projectedFreeCashFlow = Math.round((projections.freeCashFlow / 12) * growthFactor * seasonalFactor);
    
    // Debt service remains relatively constant (slight increases possible for variable rate loans)
    const debtService = Math.round(projectedOperatingCashFlow / projections.debtServiceCoverageRatio);
    
    // Calculate DSCR for this month
    const monthlyDSCR = projectedOperatingCashFlow / (debtService || 1);
    
    return {
      period: `${months[monthIndex]} ${year}`,
      "Projected Revenue": projectedRevenue,
      "Operating Cash Flow": projectedOperatingCashFlow,
      "Free Cash Flow": projectedFreeCashFlow,
      "Debt Service": debtService,
      "DSCR": parseFloat(monthlyDSCR.toFixed(2))
    };
  });
};

// Generate cash flow source breakdown data for a pie chart
export const generateCashFlowSourceData = (analysis: CashFlowAnalysis) => {
  const { historicalData } = analysis;
  
  // Calculate relative revenue streams based on the historical data
  const totalRevenue = historicalData.revenue;
  const primaryRevenue = Math.round(totalRevenue * 0.65);
  const secondaryRevenue = Math.round(totalRevenue * 0.25);
  const otherRevenue = totalRevenue - primaryRevenue - secondaryRevenue;
  
  return [
    { name: "Primary Business Line", value: primaryRevenue },
    { name: "Secondary Business Line", value: secondaryRevenue },
    { name: "Other Revenue Sources", value: otherRevenue }
  ];
};

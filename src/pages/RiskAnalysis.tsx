
import MainLayout from "@/components/layout/MainLayout";

const RiskAnalysis = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Risk Analysis</h1>
        <p className="text-muted-foreground">
          Analyze and manage risk across the loan portfolio
        </p>
        <div className="border rounded-lg p-8 text-center bg-card">
          <h2 className="text-2xl font-semibold mb-4">Risk Management Dashboard</h2>
          <p className="text-muted-foreground mb-6">Monitor portfolio risk metrics and review risk assessment reports.</p>
        </div>
      </div>
    </MainLayout>
  );
};

export default RiskAnalysis;

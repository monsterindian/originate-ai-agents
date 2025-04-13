
import MainLayout from "@/components/layout/MainLayout";

const Analytics = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          View performance metrics and trends across the loan portfolio
        </p>
        <div className="border rounded-lg p-8 text-center bg-card">
          <h2 className="text-2xl font-semibold mb-4">Analytics Dashboard</h2>
          <p className="text-muted-foreground mb-6">Access comprehensive reporting and visualizations for business insights.</p>
        </div>
      </div>
    </MainLayout>
  );
};

export default Analytics;


import MainLayout from "@/components/layout/MainLayout";

const Underwriting = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Underwriting</h1>
        <p className="text-muted-foreground">
          Review and process loan applications through underwriting
        </p>
        <div className="border rounded-lg p-8 text-center bg-card">
          <h2 className="text-2xl font-semibold mb-4">Underwriting Workspace</h2>
          <p className="text-muted-foreground mb-6">Access all tools needed for credit analysis and risk assessment.</p>
        </div>
      </div>
    </MainLayout>
  );
};

export default Underwriting;

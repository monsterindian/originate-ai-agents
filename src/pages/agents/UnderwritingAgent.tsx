
import MainLayout from "@/components/layout/MainLayout";

const UnderwritingAgent = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Underwriting Agent</h1>
        <p className="text-muted-foreground">
          AI agent for supporting credit analysis and underwriting decisions
        </p>
        <div className="border rounded-lg p-8 text-center bg-card">
          <h2 className="text-2xl font-semibold mb-4">Underwriting Agent Dashboard</h2>
          <p className="text-muted-foreground mb-6">AI-powered credit analysis, risk assessment, and decision recommendations.</p>
        </div>
      </div>
    </MainLayout>
  );
};

export default UnderwritingAgent;

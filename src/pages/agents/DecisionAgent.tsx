
import MainLayout from "@/components/layout/MainLayout";

const DecisionAgent = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Decision Agent</h1>
        <p className="text-muted-foreground">
          AI agent for final loan approval decision support
        </p>
        <div className="border rounded-lg p-8 text-center bg-card">
          <h2 className="text-2xl font-semibold mb-4">Decision Agent Dashboard</h2>
          <p className="text-muted-foreground mb-6">AI-powered final review and approval recommendations for loan applications.</p>
        </div>
      </div>
    </MainLayout>
  );
};

export default DecisionAgent;

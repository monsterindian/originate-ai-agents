
import MainLayout from "@/components/layout/MainLayout";

const Loans = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Loans</h1>
        <p className="text-muted-foreground">
          View and manage active loans across all asset classes
        </p>
        <div className="border rounded-lg p-8 text-center bg-card">
          <h2 className="text-2xl font-semibold mb-4">Loan Portfolio</h2>
          <p className="text-muted-foreground mb-6">Monitor loan performance, review terms, and manage modifications.</p>
        </div>
      </div>
    </MainLayout>
  );
};

export default Loans;

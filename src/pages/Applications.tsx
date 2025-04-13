
import MainLayout from "@/components/layout/MainLayout";

const Applications = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
        <p className="text-muted-foreground">
          Manage and review loan applications
        </p>
        <div className="border rounded-lg p-8 text-center bg-card">
          <h2 className="text-2xl font-semibold mb-4">Applications Dashboard</h2>
          <p className="text-muted-foreground mb-6">View and process all loan applications in one place.</p>
        </div>
      </div>
    </MainLayout>
  );
};

export default Applications;

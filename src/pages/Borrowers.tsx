
import MainLayout from "@/components/layout/MainLayout";

const Borrowers = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Borrowers</h1>
        <p className="text-muted-foreground">
          Manage borrower information and profiles
        </p>
        <div className="border rounded-lg p-8 text-center bg-card">
          <h2 className="text-2xl font-semibold mb-4">Borrowers Directory</h2>
          <p className="text-muted-foreground mb-6">Access and update borrower information from a central location.</p>
        </div>
      </div>
    </MainLayout>
  );
};

export default Borrowers;


import { useEffect, useState } from "react";
import { FileText, CreditCard, Clock, AlertCircle, CheckCircle, TrendingUp, Users } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import DashboardCard from "@/components/dashboard/DashboardCard";
import StatusDistributionChart from "@/components/dashboard/StatusDistributionChart";
import AssetClassChart from "@/components/dashboard/AssetClassChart";
import RecentActivityList from "@/components/dashboard/RecentActivityList";
import { getMockDashboardSummary } from "@/services/mockDataService";
import { DashboardSummary } from "@/types";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Simulating API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        const data = getMockDashboardSummary();
        
        // Ensure all values are whole numbers
        if (data) {
          data.totalApplications = Math.round(data.totalApplications);
          data.applicationsToday = Math.round(data.applicationsToday);
          data.pendingReview = Math.round(data.pendingReview);
          data.approvedToday = Math.round(data.approvedToday);
          data.fundedToday = Math.round(data.fundedToday);
          data.rejectedToday = Math.round(data.rejectedToday);
          data.totalPortfolioValue = Math.round(data.totalPortfolioValue);
          
          // Round values in applicationsByStatus
          Object.keys(data.applicationsByStatus).forEach(key => {
            data.applicationsByStatus[key as keyof typeof data.applicationsByStatus] = 
              Math.round(data.applicationsByStatus[key as keyof typeof data.applicationsByStatus]);
          });
          
          // Round values in applicationsByAssetClass
          Object.keys(data.applicationsByAssetClass).forEach(key => {
            data.applicationsByAssetClass[key as keyof typeof data.applicationsByAssetClass] = 
              Math.round(data.applicationsByAssetClass[key as keyof typeof data.applicationsByAssetClass]);
          });
        }
        
        setSummary(data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  if (isLoading || !summary) {
    return (
      <MainLayout>
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em]" />
            <p className="mt-4 text-lg">Loading dashboard data...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            System overview and key performance indicators
          </p>
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <DashboardCard 
            title="Total Applications" 
            value={summary.totalApplications}
            icon={<FileText />}
            trend={{ value: 12, label: "vs. last month", positive: true }}
          />
          
          <DashboardCard 
            title="New Today" 
            value={summary.applicationsToday}
            icon={<Clock />}
            description="Applications received today"
          />
          
          <DashboardCard 
            title="Pending Review" 
            value={summary.pendingReview}
            icon={<AlertCircle />}
            trend={{ value: 5, label: "vs. yesterday", positive: false }}
          />
          
          <DashboardCard 
            title="Approved Today" 
            value={summary.approvedToday}
            icon={<CheckCircle />}
          />
        </div>

        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
          <StatusDistributionChart data={summary.applicationsByStatus} />
          <AssetClassChart data={summary.applicationsByAssetClass} />
        </div>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          <RecentActivityList 
            activities={summary.recentActivity} 
            className="md:col-span-2"
          />
          
          <div className="space-y-4">
            <DashboardCard 
              title="Funded Today" 
              value={`$${Math.round(summary.fundedToday * 125000).toLocaleString()}`}
              icon={<CreditCard />}
              description="Total loan value funded today"
            />
            
            <DashboardCard 
              title="Active Borrowers" 
              value={Math.round(summary.totalApplications * 0.7)} // Just a mock calculation
              icon={<Users />}
              trend={{ value: 8, label: "growth this quarter", positive: true }}
            />
            
            <DashboardCard 
              title="Conversion Rate" 
              value={`${Math.round(summary.approvedToday / (summary.approvedToday + summary.rejectedToday) * 100 || 0)}%`}
              icon={<TrendingUp />}
              description="Approved vs. total processed today"
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;

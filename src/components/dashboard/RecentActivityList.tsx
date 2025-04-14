
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ActivityItem from "./ActivityItem";

export type Activity = {
  timestamp: string;
  action: string;
  details: string;
  agentId?: string;
  agentType?: string;
  actionResult?: string;
  applicationId?: string;
  documentGenerated?: string;
  riskAssessment?: string;
};

type RecentActivityListProps = {
  activities: Activity[];
  className?: string;
};

const RecentActivityList = ({ activities, className }: RecentActivityListProps) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {activities.map((activity, index) => (
            <ActivityItem 
              key={index} 
              activity={activity} 
              index={index}
              isLast={index === activities.length - 1}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivityList;

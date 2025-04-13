
import { format, isToday, isYesterday } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Activity = {
  timestamp: string;
  action: string;
  details: string;
  agentId?: string;
};

type RecentActivityListProps = {
  activities: Activity[];
  className?: string;
};

const RecentActivityList = ({ activities, className }: RecentActivityListProps) => {
  // Format the timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    
    if (isToday(date)) {
      return `Today, ${format(date, "h:mm a")}`;
    } else if (isYesterday(date)) {
      return `Yesterday, ${format(date, "h:mm a")}`;
    } else {
      return format(date, "MMM d, h:mm a");
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {activities.map((activity, index) => (
            <div key={index} className="flex">
              <div className="flex flex-col items-center mr-4">
                <div className="h-2.5 w-2.5 rounded-full bg-primary"></div>
                {index < activities.length - 1 && (
                  <div className="h-full w-px bg-gray-200 my-1"></div>
                )}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-start justify-between">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <span className="text-xs text-muted-foreground">
                    {formatTimestamp(activity.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{activity.details}</p>
                {activity.agentId && (
                  <div className="text-xs text-muted-foreground flex items-center mt-1">
                    <span 
                      className={cn(
                        "inline-block w-2 h-2 rounded-full mr-1.5",
                        "bg-green-500"
                      )}
                    />
                    <span>Processed by AI Agent</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivityList;

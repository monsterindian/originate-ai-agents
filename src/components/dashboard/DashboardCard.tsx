
import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type DashboardCardProps = {
  title: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    label: string;
    positive?: boolean;
  };
  onClick?: () => void;
  className?: string;
};

const DashboardCard = ({
  title,
  value,
  description,
  icon,
  trend,
  onClick,
  className
}: DashboardCardProps) => {
  return (
    <Card 
      className={cn(
        "transition-all duration-200", 
        onClick && "cursor-pointer hover:shadow-md hover:border-primary/20",
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon && <div className="h-5 w-5 text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        {trend && (
          <div className="flex items-center mt-2">
            <span
              className={cn(
                "text-xs font-medium",
                trend.positive ? "text-green-600" : "text-red-600"
              )}
            >
              {trend.positive ? "↑" : "↓"} {trend.value}%
            </span>
            <span className="ml-1 text-xs text-muted-foreground">{trend.label}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardCard;

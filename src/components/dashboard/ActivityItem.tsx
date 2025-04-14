
import { format, isToday, isYesterday } from "date-fns";
import { cn } from "@/lib/utils";

type Activity = {
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

type ActivityItemProps = {
  activity: Activity;
  index: number;
  isLast: boolean;
};

const ActivityItem = ({ activity, index, isLast }: ActivityItemProps) => {
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

  // Determine badge color based on agent type
  const getAgentBadgeColor = (agentType?: string) => {
    if (!agentType) return "bg-green-500";
    
    switch (agentType.toLowerCase()) {
      case "intake":
        return "bg-blue-500";
      case "processing":
        return "bg-indigo-500";
      case "underwriting":
        return "bg-purple-500";
      case "decision":
        return "bg-emerald-500";
      default:
        return "bg-green-500";
    }
  };

  // Render agent badge based on agent type
  const renderAgentBadge = (agentType?: string) => {
    if (!agentType) return "AI Agent";
    
    switch (agentType.toLowerCase()) {
      case "intake":
        return "Intake AI Agent";
      case "processing":
        return "Processing AI Agent";
      case "underwriting":
        return "Underwriting AI Agent";
      case "decision":
        return "Decision AI Agent";
      default:
        return "AI Agent";
    }
  };

  // Highlight key risk terms in appropriate colors
  const highlightText = (text: string) => {
    if (!text) return "";
    
    // Create a regex to find key risk terms
    const riskRegex = /(high risk|medium risk|low risk|risk assessment|debt-to-income|loan-to-value|credit utilization|strong cash flow|insufficient|excellent|poor|concern|volatility|stable|uncertain|approval|rejection|ratio|credit score|collateral value|cash reserves|payment history|delinquencies|default risk|debt service coverage|liquidity|profitability|net worth|capital|assets|liabilities)/gi;
    
    // Split the text by the regex matches
    const parts = text.split(riskRegex);
    const matches = text.match(riskRegex) || [];
    
    // Combine parts and matches with appropriate styling
    return parts.map((part, index) => {
      // Return part as is
      if (index === parts.length - 1) return part;
      
      // Get the corresponding match
      const match = matches[index];
      if (!match) return part;
      
      // Determine color based on match content
      let color = "text-slate-600 font-medium";
      const lowerMatch = match.toLowerCase();
      
      if (lowerMatch.includes("high risk") || lowerMatch.includes("poor") || lowerMatch.includes("insufficient") || 
          lowerMatch.includes("rejection") || lowerMatch.includes("volatility") || lowerMatch.includes("uncertain") || 
          lowerMatch.includes("concern") || lowerMatch.includes("delinquencies") || lowerMatch.includes("default risk")) {
        color = "text-red-600 font-medium";
      } else if (lowerMatch.includes("medium risk") || lowerMatch.includes("ratio") || lowerMatch.includes("credit score") || 
                 lowerMatch.includes("capital") || lowerMatch.includes("liabilities")) {
        color = "text-amber-600 font-medium";
      } else if (lowerMatch.includes("low risk") || lowerMatch.includes("excellent") || lowerMatch.includes("strong") || 
                 lowerMatch.includes("approval") || lowerMatch.includes("stable") || lowerMatch.includes("assets") || 
                 lowerMatch.includes("profitability") || lowerMatch.includes("net worth")) {
        color = "text-green-600 font-medium";
      } else if (lowerMatch.includes("debt-to-income") || lowerMatch.includes("loan-to-value") || 
                 lowerMatch.includes("credit utilization") || lowerMatch.includes("collateral value") || 
                 lowerMatch.includes("debt service coverage") || lowerMatch.includes("liquidity")) {
        color = "text-blue-600 font-medium";
      }
      
      return (
        <>
          {part}
          <span className={color}>{match}</span>
        </>
      );
    });
  };

  return (
    <div className="flex">
      <div className="flex flex-col items-center mr-4">
        <div className={cn("h-2.5 w-2.5 rounded-full", activity.agentType ? getAgentBadgeColor(activity.agentType) : "bg-primary")}></div>
        {!isLast && (
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
        <p className="text-sm text-muted-foreground">{highlightText(activity.details)}</p>
        {activity.actionResult && (
          <p className="text-xs text-muted-foreground italic">
            Result: {highlightText(activity.actionResult)}
          </p>
        )}
        {activity.documentGenerated && (
          <p className="text-xs text-muted-foreground">
            Document Generated: {activity.documentGenerated}
          </p>
        )}
        {activity.riskAssessment && (
          <p className="text-xs text-muted-foreground">
            Risk Assessment: {highlightText(activity.riskAssessment)}
          </p>
        )}
        {activity.applicationId && (
          <p className="text-xs text-muted-foreground">
            Application: {activity.applicationId}
          </p>
        )}
        {activity.agentId && (
          <div className="text-xs text-muted-foreground flex items-center mt-1">
            <span 
              className={cn(
                "inline-block w-2 h-2 rounded-full mr-1.5",
                activity.agentType ? getAgentBadgeColor(activity.agentType) : "bg-green-500"
              )}
            />
            <span>{renderAgentBadge(activity.agentType)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityItem;

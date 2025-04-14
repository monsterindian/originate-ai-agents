
import { cn } from "@/lib/utils";

type AgentStatusIndicatorProps = {
  active?: boolean;
  status?: string;
  type?: string;
};

const AgentStatusIndicator = ({ active = true, status, type }: AgentStatusIndicatorProps) => {
  // Determine if agent is active based on either the active prop or status prop
  const isActive = active || status === "active";
  
  return (
    <span 
      className={cn(
        "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
        isActive 
          ? "bg-emerald-100 text-emerald-800" 
          : "bg-gray-100 text-gray-800"
      )}
    >
      <span 
        className={cn(
          "w-2 h-2 mr-1 rounded-full",
          isActive ? "bg-emerald-500" : "bg-gray-500"
        )}
      />
      {isActive ? "Active" : "Inactive"}
      {type && ` (${type})`}
    </span>
  );
};

export default AgentStatusIndicator;

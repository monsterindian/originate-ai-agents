
import { cn } from "@/lib/utils";

type AgentStatusIndicatorProps = {
  active?: boolean;
  status?: string;
  type?: string;
};

const AgentStatusIndicator = ({ active = false, status, type }: AgentStatusIndicatorProps) => {
  // Determine if agent is active based on either the active prop or status prop
  const isActive = active || status === "active";
  
  return (
    <span 
      className={cn(
        "agent-indicator",
        isActive ? "agent-indicator-active" : "agent-indicator-inactive"
      )}
    >
      {isActive ? "Active" : "Inactive"}
      {type && ` (${type})`}
    </span>
  );
};

export default AgentStatusIndicator;

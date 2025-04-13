
import { cn } from "@/lib/utils";

type AgentStatusIndicatorProps = {
  active?: boolean;
};

const AgentStatusIndicator = ({ active = false }: AgentStatusIndicatorProps) => {
  return (
    <span 
      className={cn(
        "agent-indicator",
        active ? "agent-indicator-active" : "agent-indicator-inactive"
      )}
    >
      {active ? "Active" : "Inactive"}
    </span>
  );
};

export default AgentStatusIndicator;

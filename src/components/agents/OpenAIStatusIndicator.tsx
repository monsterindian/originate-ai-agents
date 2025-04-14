
import { cn } from "@/lib/utils";

type OpenAIStatusIndicatorProps = {
  status?: string;
};

const OpenAIStatusIndicator = ({ status = "disconnected" }: OpenAIStatusIndicatorProps) => {
  const isConnected = status === "connected";
  
  return (
    <span 
      className={cn(
        "openai-indicator",
        isConnected ? "openai-indicator-connected" : "openai-indicator-disconnected"
      )}
    >
      OpenAI {isConnected ? "Connected" : "Disconnected"}
    </span>
  );
};

export default OpenAIStatusIndicator;

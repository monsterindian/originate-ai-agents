
import { cn } from "@/lib/utils";

type OpenAIStatusIndicatorProps = {
  status?: string;
};

const OpenAIStatusIndicator = ({ status = "connected" }: OpenAIStatusIndicatorProps) => {
  const isConnected = status === "connected";
  
  return (
    <span 
      className={cn(
        "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
        isConnected 
          ? "bg-blue-100 text-blue-800" 
          : "bg-red-100 text-red-800"
      )}
    >
      <span 
        className={cn(
          "w-2 h-2 mr-1 rounded-full",
          isConnected ? "bg-blue-500" : "bg-red-500"
        )}
      />
      OpenAI {isConnected ? "Connected" : "Disconnected"}
    </span>
  );
};

export default OpenAIStatusIndicator;

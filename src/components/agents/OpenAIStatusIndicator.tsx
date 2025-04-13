
import { useState, useEffect } from "react";
import { Brain, AlertCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const OpenAIStatusIndicator = () => {
  const [status, setStatus] = useState<"connected" | "error">("connected");

  // Simulate checking OpenAI connection status
  useEffect(() => {
    const checkOpenAIStatus = () => {
      // In a real app, this would be a call to check the OpenAI API connection
      const isConnected = true; // Simulate always connected for now
      setStatus(isConnected ? "connected" : "error");
    };
    
    checkOpenAIStatus();
    const interval = setInterval(checkOpenAIStatus, 5 * 60 * 1000); // Every 5 minutes
    
    return () => clearInterval(interval);
  }, []);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium bg-green-50 text-green-700 border border-green-200">
            {status === "connected" ? (
              <>
                <Brain className="h-4 w-4" />
                <span className="hidden md:inline">OpenAI Connected</span>
              </>
            ) : (
              <>
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span className="hidden md:inline text-red-500">OpenAI Disconnected</span>
              </>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          {status === "connected" 
            ? "OpenAI API is connected and all AI agents are operational" 
            : "OpenAI API connection error. AI agents may not function properly"
          }
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default OpenAIStatusIndicator;

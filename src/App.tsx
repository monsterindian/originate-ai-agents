
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Integration from "./pages/Integration";
import Settings from "./pages/Settings";
import IntakeAgent from "./pages/agents/IntakeAgent";
import NotFound from "./pages/NotFound";
import Applications from "./pages/Applications";
import Borrowers from "./pages/Borrowers";
import ProcessingAgent from "./pages/agents/ProcessingAgent";
import UnderwritingAgent from "./pages/agents/UnderwritingAgent";
import DecisionAgent from "./pages/agents/DecisionAgent";
import FraudRiskAgent from "./pages/agents/FraudRiskAgent";
import FundingAgent from "./pages/agents/FundingAgent";
import CashFlowAnalysisAgent from "./pages/agents/CashFlowAnalysisAgent";
import PreQualificationAgent from "./pages/agents/PreQualificationAgent";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/integration" element={<Integration />} />
          <Route path="/settings" element={<Settings />} />
          
          <Route path="/agents/intake" element={<IntakeAgent />} />
          <Route path="/agents/pre-qualification" element={<PreQualificationAgent />} />
          <Route path="/agents/processing" element={<ProcessingAgent />} />
          <Route path="/agents/underwriting" element={<UnderwritingAgent />} />
          <Route path="/agents/decision" element={<DecisionAgent />} />
          <Route path="/agents/fraud-risk" element={<FraudRiskAgent />} />
          <Route path="/agents/funding" element={<FundingAgent />} />
          <Route path="/agents/cash-flow-analysis" element={<CashFlowAnalysisAgent />} />
          
          <Route path="/applications" element={<Applications />} />
          <Route path="/borrowers" element={<Borrowers />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

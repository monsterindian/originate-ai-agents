import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Integration from "./pages/Integration";
import Settings from "./pages/Settings";
import IntakeAgent from "./pages/agents/IntakeAgent";
import NotFound from "./pages/NotFound";

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
          <Route path="/agents/processing" element={<Navigate to="/agents/intake" />} />
          <Route path="/agents/underwriting" element={<Navigate to="/agents/intake" />} />
          <Route path="/agents/decision" element={<Navigate to="/agents/intake" />} />
          
          <Route path="/applications" element={<Navigate to="/" />} />
          <Route path="/borrowers" element={<Navigate to="/" />} />
          <Route path="/loans" element={<Navigate to="/" />} />
          <Route path="/underwriting" element={<Navigate to="/" />} />
          <Route path="/risk" element={<Navigate to="/" />} />
          <Route path="/analytics" element={<Navigate to="/" />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

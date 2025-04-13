
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Bot, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10">
          <Bot className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-5xl font-bold text-primary">404</h1>
        <h2 className="text-2xl font-semibold">Page Not Found</h2>
        <p className="text-muted-foreground">
          We couldn't find the page you're looking for. The AI agents have analyzed the situation and determined this route doesn't exist.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
          <Button variant="default" onClick={() => navigate("/")} className="gap-2">
            <Home className="h-4 w-4" />
            Return to Dashboard
          </Button>
          <Button variant="outline" onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { verifyEnvironment } from "@/lib/env";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import AuthCallback from "./pages/AuthCallback";
import Dashboard from "./pages/Dashboard";
import { ProtectedRoute } from '@/components/ProtectedRoute';
import NotFound from "./pages/NotFound";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { LoginPage } from '@/pages/Login';
import ChatInterface from '@/components/ChatInterface';

const queryClient = new QueryClient();

const App = () => {
  const { toast } = useToast();

  useEffect(() => {
    const envStatus = verifyEnvironment();
    if (envStatus.missingKeys.length > 0) {
      toast({
        title: "Limited Functionality",
        description: "Some features may be disabled due to missing configuration. The application will continue to work with limited functionality.",
        duration: 5000,
      });
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <Router>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <div className="container mx-auto px-4 py-8">
                      <ChatInterface uploadedFile={null} />
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

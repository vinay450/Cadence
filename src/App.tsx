import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/NotFound";
import FileUpload from "@/components/FileUpload";
import ChatInterface from '@/components/ChatInterface';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <Router>
            <Routes>
              <Route
                path="/"
                element={
                  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
                    <div className="max-w-4xl mx-auto">
                      <FileUpload>
                        {(uploadedFile, fileContent) => (
                          <ChatInterface
                            uploadedFile={uploadedFile}
                            fileContent={fileContent}
                          />
                        )}
                      </FileUpload>
                    </div>
                  </div>
                }
              />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

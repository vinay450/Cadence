import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ChatInterface from '@/components/ChatInterface';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <div className="container mx-auto px-4 py-8">
          <ChatInterface uploadedFile={null} />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

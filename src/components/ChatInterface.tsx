
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send } from "lucide-react";

interface ChatInterfaceProps {
  uploadedFile: string | null;
}

const ChatInterface = ({ uploadedFile }: ChatInterfaceProps) => {
  const [chatMessage, setChatMessage] = useState("");

  return (
    <div className="mt-8 space-y-4">
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-6">
        <div className="flex items-start space-x-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-700 mb-1">Cadence AI</p>
            <p className="text-gray-600">
              {uploadedFile 
                ? `Great! I've analyzed your dataset "${uploadedFile}". What insights would you like me to generate?`
                : "Hello! Upload a dataset above and I'll help you discover insights through interactive visualizations."
              }
            </p>
          </div>
        </div>
      </div>

      <div className="flex space-x-3">
        <Textarea
          placeholder="Ask me anything about your data... e.g., 'Show me sales trends by region' or 'What are the top performing products?'"
          value={chatMessage}
          onChange={(e) => setChatMessage(e.target.value)}
          className="flex-1 min-h-[60px] resize-none border-gray-300 focus:border-blue-500"
          disabled={!uploadedFile}
        />
        <Button 
          size="lg" 
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6"
          disabled={!uploadedFile || !chatMessage.trim()}
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>

      {uploadedFile && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-left justify-start"
            onClick={() => setChatMessage("Show me a summary of the data")}
          >
            📊 Data Summary
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-left justify-start"
            onClick={() => setChatMessage("Create a trend analysis")}
          >
            📈 Trend Analysis
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-left justify-start"
            onClick={() => setChatMessage("Find correlations in the data")}
          >
            🔍 Find Patterns
          </Button>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;

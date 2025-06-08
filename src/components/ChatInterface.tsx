import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send, Loader2 } from "lucide-react";
import { ChatMessage } from "@/lib/claude";
import { analyzeDataset, chatWithClaude } from "@/lib/api";
import ReactMarkdown from 'react-markdown';
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatInterfaceProps {
  uploadedFile: string | null;
  fileContent?: string;
}

const ChatInterface = ({ uploadedFile, fileContent }: ChatInterfaceProps) => {
  const [chatMessage, setChatMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!chatMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: chatMessage,
    };

    setIsLoading(true);
    setMessages(prev => [...prev, userMessage]);
    setChatMessage("");

    try {
      let response: string;
      
      // If this is the first message, use analyzeDataset
      if (messages.length === 0 && fileContent) {
        const analysis = await analyzeDataset({
          dataContent: fileContent || '',
          fileType: (uploadedFile?.split('.').pop() || 'csv') as 'csv' | 'json' | 'excel',
          question: chatMessage
        });
        response = analysis;
      } else {
        // For follow-up questions, use chatWithClaude
        response = await chatWithClaude(
          [...messages, userMessage],
          fileContent
        );
      }

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error in chat:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'I apologize, but I encountered an error while processing your request. Please try again.',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="mt-8 space-y-4">
      <ScrollArea className="h-[400px] rounded-lg border bg-white p-4">
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-6">
            <div className="flex items-start space-x-3">
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

          {messages.map((message, index) => (
            <div
              key={index}
              className={`rounded-lg p-6 ${
                message.role === 'user'
                  ? 'bg-blue-50'
                  : 'bg-gradient-to-r from-gray-50 to-blue-50'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === 'user'
                      ? 'bg-blue-600'
                      : 'bg-gradient-to-br from-blue-500 to-purple-600'
                  }`}
                >
                  {message.role === 'user' ? (
                    <span className="text-white text-sm">You</span>
                  ) : (
                    <MessageSquare className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    {message.role === 'user' ? 'You' : 'Cadence AI'}
                  </p>
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="flex space-x-3">
        <Textarea
          placeholder="Ask me anything about your data... e.g., 'Show me sales trends by region' or 'What are the top performing products?'"
          value={chatMessage}
          onChange={(e) => setChatMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          className="flex-1 min-h-[60px] resize-none border-gray-300 focus:border-blue-500"
          disabled={!uploadedFile || isLoading}
        />
        <Button 
          size="lg" 
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6"
          disabled={!uploadedFile || !chatMessage.trim() || isLoading}
          onClick={handleSendMessage}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </Button>
      </div>

      {uploadedFile && !isLoading && (
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

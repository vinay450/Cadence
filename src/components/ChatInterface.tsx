import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send, Loader2 } from "lucide-react";
import { ChatMessage } from "@/lib/claude";
import { analyzeDataset, chatWithClaude } from "@/lib/api";
import type { VisualizationResponse } from "@/lib/types/visualization";
import ReactMarkdown from 'react-markdown';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loading } from "@/components/ui/Loading";
import { DataVisualization } from "./visualizations/DataVisualization";
import { useApiKey } from '@/contexts/ApiKeyContext';
import { useToast } from '@/components/ui/use-toast';
import Papa from 'papaparse';

interface ChatInterfaceProps {
  uploadedFile: string | null;
  fileContent?: string;
}

const ChatInterface = ({ uploadedFile, fileContent }: ChatInterfaceProps) => {
  const [chatMessage, setChatMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialAnalysis, setIsInitialAnalysis] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [visualizations, setVisualizations] = useState<VisualizationResponse>();
  const [parsedData, setParsedData] = useState<any[]>([]);
  const { apiKey, isLoading: isApiKeyLoading, error: apiKeyError } = useApiKey();
  const { toast } = useToast();

  const parseFileContent = (content: string, fileType: string) => {
    try {
      switch (fileType.toLowerCase()) {
        case 'csv':
          const results = Papa.parse(content, {
            header: true,
            skipEmptyLines: true
          });
          return results.data;
        case 'json':
          return JSON.parse(content);
        case 'excel':
          // For now, assume it's CSV format
          const excelResults = Papa.parse(content, {
            header: true,
            skipEmptyLines: true
          });
          return excelResults.data;
        default:
          console.error('Unsupported file type:', fileType);
          return [];
      }
    } catch (error) {
      console.error('Error parsing file content:', error);
      return [];
    }
  };

  const formatAnalysisContent = (content: string) => {
    const sections = {
      visualizations: content.match(/\[VISUALIZATION METHODS\]([\s\S]*?)(?=\[|$)/)?.[1]?.trim(),
      structure: content.match(/\[DATA STRUCTURE\]([\s\S]*?)(?=\[|$)/)?.[1]?.trim(),
      statistics: content.match(/\[KEY STATISTICS\]([\s\S]*?)(?=\[|$)/)?.[1]?.trim(),
      insights: content.match(/\[NOTABLE INSIGHTS\]([\s\S]*?)(?=\[|$)/)?.[1]?.trim(),
      correlations: content.match(/\[CORRELATIONS\]([\s\S]*?)(?=\[|$)/)?.[1]?.trim(),
    };

    if (Object.values(sections).some(section => section)) {
      return (
        <div className="space-y-6">
          {sections.visualizations && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Visualization Methods</h3>
              <div className="prose prose-blue max-w-none">
                <ReactMarkdown>{sections.visualizations}</ReactMarkdown>
              </div>
            </div>
          )}
          {sections.structure && (
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-900 mb-2">Data Structure</h3>
              <div className="prose prose-purple max-w-none">
                <ReactMarkdown>{sections.structure}</ReactMarkdown>
              </div>
            </div>
          )}
          {sections.statistics && (
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-900 mb-2">Key Statistics</h3>
              <div className="prose prose-green max-w-none">
                <ReactMarkdown>{sections.statistics}</ReactMarkdown>
              </div>
            </div>
          )}
          {sections.insights && (
            <div className="bg-amber-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-amber-900 mb-2">Notable Insights</h3>
              <div className="prose prose-amber max-w-none">
                <ReactMarkdown>{sections.insights}</ReactMarkdown>
              </div>
            </div>
          )}
          {sections.correlations && (
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-red-900 mb-2">Correlations</h3>
              <div className="prose prose-red max-w-none">
                <ReactMarkdown>{sections.correlations}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      );
    }

    return <ReactMarkdown>{content}</ReactMarkdown>;
  };

  const handleSendMessage = async () => {
    if (!apiKey) {
      toast({
        title: 'Error',
        description: 'API key not available. Please try again later.',
        variant: 'destructive',
      });
      return;
    }

    if (!chatMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: chatMessage,
    };

    setIsLoading(true);
    setMessages(prev => [...prev, userMessage]);
    setChatMessage("");

    try {
      if (messages.length === 0 && fileContent) {
        setLoadingMessage("Analyzing your dataset in detail...");
        const fileType = uploadedFile?.split('.').pop() || 'csv';
        
        const analysis = await analyzeDataset({
          dataContent: fileContent,
          fileType: fileType as 'csv' | 'json' | 'excel',
          question: chatMessage
        });

        if (analysis.visualizations) {
          setVisualizations(analysis.visualizations);
          const data = parseFileContent(fileContent, fileType);
          setParsedData(Array.isArray(data) ? data : [data]);
        }

        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: analysis.textAnalysis,
        };

        setMessages(prev => [...prev, assistantMessage]);
        setIsInitialAnalysis(false);
      } else {
        setLoadingMessage("Processing your question...");
        const response = await chatWithClaude(
          [...messages, userMessage],
          fileContent
        );

        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: response,
        };

        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error('Error in chat:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'I apologize, but I encountered an error while processing your request. Please try again.',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setLoadingMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (isApiKeyLoading) {
    return <div className="text-center p-4">Loading API key...</div>;
  }

  if (apiKeyError) {
    return (
      <div className="text-center p-4 text-red-600">
        Error loading API key. Please try again later.
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-4">
      <ScrollArea className="relative h-[400px] rounded-lg border bg-white p-4">
        {isLoading && isInitialAnalysis ? (
          <Loading message={loadingMessage} />
        ) : (
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
                      ? `Great! I've received your dataset "${uploadedFile}". What insights would you like me to generate?`
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
                      {message.role === 'assistant' 
                        ? formatAnalysisContent(message.content)
                        : <p>{message.content}</p>
                      }
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && !isInitialAnalysis && (
              <div className="rounded-lg bg-gradient-to-r from-gray-50 to-blue-50 p-4">
                <div className="flex items-center justify-center space-x-2">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  <span className="text-sm text-primary">{loadingMessage}</span>
                </div>
              </div>
            )}

            {visualizations && parsedData.length > 0 && (
              <DataVisualization
                visualizations={visualizations}
                data={parsedData}
              />
            )}
          </div>
        )}
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

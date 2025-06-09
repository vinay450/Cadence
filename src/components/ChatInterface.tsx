import { useState, useRef, useEffect } from "react";
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
import { useToast } from '@/components/ui/use-toast';
import Papa from 'papaparse';
import { motion, AnimatePresence } from "framer-motion";
import { ThinkingAnimation } from "@/components/ui/ThinkingAnimation";
import { DataDomain } from '@/lib/types/dataTypes';

interface ChatInterfaceProps {
  uploadedFile: string | null;
  fileContent?: string;
  dataDomain: DataDomain;
}

const ChatInterface = ({ uploadedFile, fileContent, dataDomain }: ChatInterfaceProps) => {
  const [chatMessage, setChatMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialAnalysis, setIsInitialAnalysis] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [visualizations, setVisualizations] = useState<VisualizationResponse>();
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [hasStartedAnalysis, setHasStartedAnalysis] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  const handleInitialAnalysis = async () => {
    setIsLoading(true);
    setIsTyping(true);
    setLoadingMessage("Analyzing your dataset in detail...");

    try {
      const fileType = uploadedFile?.split('.').pop() || 'csv';
      console.log('Starting analysis with file type:', fileType);
      console.log('Raw file content:', fileContent?.substring(0, 200) + '...');
      
      const analysis = await analyzeDataset({
        dataContent: fileContent!,
        fileType: fileType as 'csv' | 'json' | 'excel',
        question: "Analyze this dataset and provide a comprehensive summary including key statistics, patterns, and potential insights.",
        domain: dataDomain
      });

      console.log('Analysis response:', analysis);
      console.log('Visualizations:', analysis.visualizations);

      if (analysis.visualizations) {
        console.log('Setting visualizations:', analysis.visualizations);
        setVisualizations(analysis.visualizations);
        const data = parseFileContent(fileContent!, fileType);
        console.log('Parsed data:', data);
        const processedData = Array.isArray(data) ? data : [data];
        console.log('Processed data:', processedData);
        setParsedData(processedData);
      } else {
        console.error('No visualizations received from analysis');
      }

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: analysis.textAnalysis,
      };

      setMessages([assistantMessage]);
      setIsInitialAnalysis(false);
      setHasStartedAnalysis(true);
    } catch (error) {
      console.error('Error in initial analysis:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while analyzing your dataset. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      setLoadingMessage("");
      setIsTyping(false);
    }
  };

  const handleSendMessage = async () => {
    if (!chatMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: chatMessage,
    };

    setIsLoading(true);
    setMessages(prev => [...prev, userMessage]);
    setChatMessage("");
    setIsTyping(true);

    try {
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
    } catch (error) {
      console.error('Error in chat:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while processing your request. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      setLoadingMessage("");
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const MessageBubble = ({ message, index }: { message: ChatMessage; index: number }) => {
    const isUser = message.role === 'user';
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.2, delay: index * 0.1 }}
        className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div className={`flex items-start space-x-2 max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              isUser
                ? 'bg-blue-600'
                : 'bg-gradient-to-br from-blue-500 to-purple-600'
            }`}
          >
            {isUser ? (
              <span className="text-white text-sm">You</span>
            ) : (
              <MessageSquare className="w-4 h-4 text-white" />
            )}
          </div>
          <div
            className={`rounded-2xl px-4 py-3 ${
              isUser
                ? 'bg-blue-600 text-white rounded-br-none'
                : 'bg-gray-100 text-gray-900 rounded-bl-none'
            }`}
          >
            <div className="prose prose-sm max-w-none">
              {message.role === 'assistant' 
                ? formatAnalysisContent(message.content)
                : <p className="m-0">{message.content}</p>
              }
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const TypingIndicator = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center space-x-2 text-gray-500 mb-4"
    >
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
        <MessageSquare className="w-4 h-4 text-white" />
      </div>
      <div className="bg-gray-100 rounded-full px-4 py-2">
        <div className="flex space-x-1">
          <motion.div
            className="w-2 h-2 bg-gray-400 rounded-full"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
          />
          <motion.div
            className="w-2 h-2 bg-gray-400 rounded-full"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse", delay: 0.1 }}
          />
          <motion.div
            className="w-2 h-2 bg-gray-400 rounded-full"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse", delay: 0.2 }}
          />
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="mt-8 space-y-6">
      {/* Chat Section */}
      <div className="flex flex-col h-[500px]">
        <ScrollArea className="flex-1 px-4 py-4 bg-white rounded-t-lg border">
          <div className="space-y-4">
            {!hasStartedAnalysis ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center h-full space-y-4"
              >
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {uploadedFile 
                      ? `Dataset "${uploadedFile}" uploaded successfully!`
                      : "Upload a dataset to get started"
                    }
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {uploadedFile
                      ? "Click the button below to begin analyzing your data"
                      : "Upload a CSV, JSON, or Excel file to analyze"
                    }
                  </p>
                </div>
                {uploadedFile && !isLoading && (
                  <Button
                    size="lg"
                    onClick={handleInitialAnalysis}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : null}
                    Start Researching
                  </Button>
                )}
              </motion.div>
            ) : (
              <AnimatePresence mode="wait">
                {isLoading && isInitialAnalysis ? (
                  <motion.div
                    key="thinking"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex items-center justify-center"
                  >
                    <ThinkingAnimation />
                  </motion.div>
                ) : (
                  <motion.div
                    key="messages"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {messages.map((message, index) => (
                      <MessageBubble key={index} message={message} index={index} />
                    ))}
                    {isTyping && <TypingIndicator />}
                  </motion.div>
                )}
              </AnimatePresence>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="p-4 border-t bg-white rounded-b-lg">
          <div className="flex space-x-4">
            <Textarea
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={hasStartedAnalysis ? "Ask a question about your data..." : "Start researching to begin the conversation..."}
              className="flex-1 min-h-[50px] max-h-[200px] resize-none"
              disabled={isLoading || !hasStartedAnalysis}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!chatMessage.trim() || isLoading || !hasStartedAnalysis}
              className="self-end"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Visualizations Section */}
      {visualizations && parsedData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg border p-6"
        >
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">Data Visualizations</h2>
          <DataVisualization
            visualizations={visualizations}
            data={parsedData}
          />
        </motion.div>
      )}

      {/* Quick Actions */}
      {hasStartedAnalysis && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg border p-4"
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
        </motion.div>
      )}
    </div>
  );
};

export default ChatInterface;

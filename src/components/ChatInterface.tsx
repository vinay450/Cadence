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

// Debug logger function
const debugLog = (stage: string, data: any) => {
  console.log(`🔍 [ChatInterface Debug - ${stage}]`, JSON.stringify(data, null, 2));
};

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
  const componentId = useRef(crypto.randomUUID());

  useEffect(() => {
    debugLog('Component Mounted', {
      componentId: componentId.current,
      uploadedFile,
      hasFileContent: !!fileContent,
      dataDomain
    });
  }, []);

  useEffect(() => {
    debugLog('Messages Updated', {
      componentId: componentId.current,
      messageCount: messages.length,
      lastMessage: messages[messages.length - 1]
    });
    scrollToBottom();
  }, [messages]);

  const parseFileContent = (content: string, fileType: string) => {
    debugLog('Parsing File Content', {
      componentId: componentId.current,
      fileType,
      contentLength: content.length
    });

    try {
      let parsedData;
      switch (fileType.toLowerCase()) {
        case 'csv':
          parsedData = Papa.parse(content, {
            header: true,
            skipEmptyLines: true
          });
          break;
        case 'json':
          parsedData = JSON.parse(content);
          break;
        case 'excel':
          parsedData = Papa.parse(content, {
            header: true,
            skipEmptyLines: true
          });
          break;
        default:
          console.error('Unsupported file type:', fileType);
          return [];
      }

      debugLog('File Content Parsed', {
        componentId: componentId.current,
        fileType,
        rowCount: Array.isArray(parsedData.data) ? parsedData.data.length : 1,
        hasHeaders: !!parsedData.meta?.fields
      });

      return parsedData.data;
    } catch (error) {
      debugLog('File Parse Error', {
        componentId: componentId.current,
        error: error instanceof Error ? error.message : String(error),
        fileType
      });
      return [];
    }
  };

  const handleInitialAnalysis = async () => {
    debugLog('Starting Initial Analysis', {
      componentId: componentId.current,
      uploadedFile,
      hasFileContent: !!fileContent,
      dataDomain
    });

    setIsLoading(true);
    setIsTyping(true);
    setLoadingMessage("Analyzing your dataset in detail...");

    try {
      const fileType = uploadedFile?.split('.').pop() || 'csv';
      
      debugLog('Analysis Request Preparation', {
        componentId: componentId.current,
        fileType,
        contentPreview: fileContent?.substring(0, 100)
      });

      const analysisResponse = await analyzeDataset({
        dataContent: fileContent!,
        fileType: fileType as 'csv' | 'json' | 'excel',
        question: "Analyze this dataset and provide a comprehensive summary including key statistics, patterns, and potential insights.",
        domain: dataDomain
      });

      debugLog('Analysis Response Received', {
        componentId: componentId.current,
        hasTextAnalysis: !!analysisResponse?.textAnalysis,
        textAnalysisLength: analysisResponse?.textAnalysis?.length
      });

      const newMessage: ChatMessage = {
        role: 'assistant',
        content: analysisResponse.textAnalysis
      };

      debugLog('Updating Chat State', {
        componentId: componentId.current,
        messageType: 'assistant',
        contentLength: newMessage.content.length
      });

      setMessages(prev => [...prev, newMessage]);
      setIsInitialAnalysis(false);
      setHasStartedAnalysis(true);
    } catch (error) {
      debugLog('Analysis Error', {
        componentId: componentId.current,
        error: error instanceof Error ? error.message : String(error)
      });

      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: `I encountered an error while analyzing the dataset: ${error instanceof Error ? error.message : 'Unknown error occurred'}\n\nPlease try again or contact support if the issue persists.`
      };

      setMessages(prev => [...prev, errorMessage]);

      toast({
        title: 'Analysis Error',
        description: error instanceof Error ? error.message : 'An error occurred while analyzing your dataset. Please try again.',
        variant: 'destructive',
      });
    } finally {
      debugLog('Analysis Completed', {
        componentId: componentId.current,
        success: !isLoading && hasStartedAnalysis
      });

      setIsLoading(false);
      setLoadingMessage("");
      setIsTyping(false);
    }
  };

  const formatAnalysisContent = (content: string) => {
    return <pre className="whitespace-pre-wrap font-mono text-sm">{content}</pre>;
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

  return (
    <div className="flex flex-col h-full">
      {/* Rest of the component code */}
    </div>
  );
};

export default ChatInterface; 
import { supabase } from '@/lib/supabase';

// Types for chat messages and responses
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  response: string;
  usage?: {
    input_tokens: number;
    output_tokens: number;
  };
}

export interface DatasetAnalysisRequest {
  dataContent: string;
  fileType: 'csv' | 'json' | 'excel';
  question?: string;
}

export interface ClaudeResponse {
  analysis: string;
  error?: string;
}

// Feature configuration
export const featureConfig = {
  webSearch: {
    enabled: false, // Disabled by default to prevent unexpected costs
    costPerSearch: 0.01, // $0.01 per search
  }
};

// Function to analyze dataset
export async function analyzeDataset(request: DatasetAnalysisRequest): Promise<string> {
  try {
    const { data, error } = await supabase.functions.invoke('bright-api', {
      body: { messages: [{ role: 'user', content: `Please analyze this ${request.fileType} data:\n\n${request.dataContent}${request.question ? `\n\nSpecific question: ${request.question}` : ''}` }] }
    });

    if (error) throw error;
    return data.analysis || 'No analysis received';
  } catch (error) {
    console.error('Error analyzing dataset:', error);
    return 'An error occurred while analyzing the dataset. Please try again later.';
  }
}

// Function to continue chat conversation
export async function chatWithClaude(
  messages: ChatMessage[],
  dataContext?: string
): Promise<string> {
  try {
    let allMessages = messages;
    if (dataContext) {
      allMessages = [
        {
          role: 'user',
          content: `Context about the data:\n${dataContext}`
        },
        ...messages
      ];
    }

    const { data, error } = await supabase.functions.invoke('bright-api', {
      body: { messages: allMessages }
    });

    if (error) throw error;
    return data.analysis || 'No response received';
  } catch (error) {
    console.error('Error in chat:', error);
    return 'An error occurred during the chat. Please try again later.';
  }
} 
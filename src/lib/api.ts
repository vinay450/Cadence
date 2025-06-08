import { ChatMessage } from './claude';
import { supabase } from '@/integrations/supabase/client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const API_KEY = import.meta.env.VITE_BACKEND_API_KEY;

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

interface AnalysisResponse {
  analysis: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

interface ChatResponse {
  response: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${API_KEY}`,
};

export async function analyzeDataset(dataContent: string, fileType: string, question?: string): Promise<string> {
  try {
    const response = await fetch(`${API_URL}/api/analyze`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ dataContent, fileType, question }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ApiResponse<AnalysisResponse> = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }

    return data.data?.analysis || 'No analysis received';
  } catch (error) {
    console.error('Error analyzing dataset:', error);
    throw error;
  }
}

export async function chatWithClaude(messages: ChatMessage[], dataContext?: string): Promise<string> {
  try {
    const response = await fetch(`${API_URL}/api/chat`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ messages, dataContext }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ApiResponse<ChatResponse> = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }

    return data.data?.response || 'No response received';
  } catch (error) {
    console.error('Error in chat:', error);
    throw error;
  }
}

export async function analyzeData(messages: any[]) {
  const { data, error } = await supabase.functions.invoke('analyze', {
    body: { messages },
  });

  if (error) throw error;
  return data;
}

export async function chatWithData(messages: any[]) {
  const { data, error } = await supabase.functions.invoke('analyze', {
    body: { messages },
  });

  if (error) throw error;
  return data;
} 
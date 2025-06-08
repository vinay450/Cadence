import Anthropic from '@anthropic-ai/sdk';
import { MessageParam } from '@anthropic-ai/sdk/resources';
import * as dotenv from 'dotenv';

// Load environment variables in Node.js environment
if (typeof process !== 'undefined') {
  dotenv.config();
}

// Get API key from environment
const getApiKey = () => {
  if (typeof process !== 'undefined' && process.env.VITE_ANTHROPIC_API_KEY) {
    return process.env.VITE_ANTHROPIC_API_KEY;
  }
  if (typeof import.meta !== 'undefined' && import.meta.env.VITE_ANTHROPIC_API_KEY) {
    return import.meta.env.VITE_ANTHROPIC_API_KEY;
  }
  throw new Error('Anthropic API key not found in environment variables');
};

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: getApiKey(),
});

// Types for our chat interface
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface DatasetAnalysisRequest {
  dataContent: string;
  fileType: 'csv' | 'json' | 'excel';
  question?: string;
}

// Function to analyze dataset
export async function analyzeDataset(request: DatasetAnalysisRequest): Promise<string> {
  try {
    const systemPrompt = `You are a data analysis assistant. Analyze the following ${request.fileType} data and provide insights.
    If a specific question is asked, focus on answering that question.
    Format your response in clear, concise markdown.`;

    const userMessage = request.question 
      ? `Question about the data: ${request.question}\n\nData:\n${request.dataContent}`
      : `Please provide a basic analysis of this data:\n${request.dataContent}`;

    const response = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: userMessage,
        },
      ],
      system: systemPrompt,
    });

    // Extract the response content
    const content = response.content[0];
    if ('text' in content) {
      return content.text;
    }
    return 'No text response received';
  } catch (error) {
    console.error('Error analyzing dataset:', error);
    throw new Error('Failed to analyze dataset');
  }
}

// Function to continue chat conversation
export async function chatWithClaude(
  messages: ChatMessage[],
  dataContext?: string
): Promise<string> {
  try {
    const systemPrompt = dataContext
      ? `You are a data analysis assistant. Use this data context for answering questions:\n${dataContext}`
      : 'You are a data analysis assistant. Help users understand their data.';

    const formattedMessages: MessageParam[] = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    const response = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 1000,
      messages: formattedMessages,
      system: systemPrompt,
    });

    // Extract the response content
    const content = response.content[0];
    if ('text' in content) {
      return content.text;
    }
    return 'No text response received';
  } catch (error) {
    console.error('Error in chat:', error);
    throw new Error('Failed to get response');
  }
} 
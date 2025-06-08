import Anthropic from '@anthropic-ai/sdk';
import { MessageParam } from '@anthropic-ai/sdk/resources';

// Configuration for features that incur additional costs
export const featureConfig = {
  webSearch: {
    enabled: false, // Disabled by default to prevent unexpected costs
    costPerSearch: 0.01, // $0.01 per search
  }
};

// Get API key from environment
const getApiKey = () => {
  // Try different ways to access the API key
  const apiKey = 
    import.meta.env.VITE_ANTHROPIC_API_KEY || // Vite way
    process.env.VITE_ANTHROPIC_API_KEY;       // Traditional way

  // Debug logging for environment variables
  console.debug('Environment check:', {
    isDev: import.meta.env.DEV,
    mode: import.meta.env.MODE,
    hasViteEnv: typeof import.meta.env !== 'undefined',
    hasProcessEnv: typeof process !== 'undefined' && !!process.env,
    envKeys: Object.keys(import.meta.env).filter(key => key.startsWith('VITE_')),
    apiKeyFound: !!apiKey,
  });
  
  if (!apiKey) {
    console.warn('API key not found. Environment details:', {
      apiKeyExists: !!apiKey,
      apiKeyType: typeof apiKey,
      viteEnvType: typeof import.meta.env,
      processEnvType: typeof process !== 'undefined' ? typeof process.env : 'undefined',
    });
    return null;
  }
  
  console.debug('API key found with length:', apiKey.length);
  return apiKey;
};

// Initialize Anthropic client
let anthropicInstance: Anthropic | null = null;

const getAnthropicClient = () => {
  if (!anthropicInstance) {
    const apiKey = getApiKey();
    if (!apiKey) {
      return null;
    }
    anthropicInstance = new Anthropic({ apiKey });
  }
  return anthropicInstance;
};

// Cost calculation helper
const calculateCost = (inputTokens: number, outputTokens: number) => {
  const inputCost = (inputTokens / 1000000) * 3; // $3 per million input tokens
  const outputCost = (outputTokens / 1000000) * 15; // $15 per million output tokens
  return {
    inputCost,
    outputCost,
    totalCost: inputCost + outputCost,
    inputTokens,
    outputTokens,
  };
};

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
    const anthropic = getAnthropicClient();
    if (!anthropic) {
      return 'API key not configured - analysis features are currently disabled. Please contact support.';
    }

    const systemPrompt = `You are a data analysis assistant. Analyze the following ${request.fileType} data and provide insights.
    If a specific question is asked, focus on answering that question.
    Format your response in clear, concise markdown.
    Do not attempt to search the web or access external resources.`;

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

    // Log token usage and cost
    if (response.usage) {
      const costs = calculateCost(
        response.usage.input_tokens,
        response.usage.output_tokens
      );
      console.log('Analysis Request Costs:', {
        ...costs,
        details: 'Costs in USD',
      });
    }

    const content = response.content[0];
    if ('text' in content) {
      return content.text;
    }
    return 'No text response received';
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
    const anthropic = getAnthropicClient();
    if (!anthropic) {
      return 'API key not configured - chat features are currently disabled. Please contact support.';
    }

    const systemPrompt = `You are a data analysis assistant. ${
      dataContext ? `Use this data context for answering questions:\n${dataContext}\n` : ''
    }Do not attempt to search the web or access external resources. If you need current information, please inform the user that web search is disabled.`;

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

    // Log token usage and cost
    if (response.usage) {
      const costs = calculateCost(
        response.usage.input_tokens,
        response.usage.output_tokens
      );
      console.log('Chat Request Costs:', {
        ...costs,
        details: 'Costs in USD',
      });
    }

    const content = response.content[0];
    if ('text' in content) {
      return content.text;
    }
    return 'No text response received';
  } catch (error) {
    console.error('Error in chat:', error);
    return 'An error occurred during the chat. Please try again later.';
  }
} 
import { supabase } from '@/lib/supabase';
import type { VisualizationResponse } from './types/visualization';
import { ChatMessage } from './claude';
import { DataDomain } from './types/dataTypes';

// Debug logger function
const debugLog = (stage: string, data: any) => {
  console.log(`🔍 [Frontend Debug - ${stage}]`, JSON.stringify(data, null, 2));
};

// Types for chat messages and responses
export interface DatasetAnalysisRequest {
  dataContent: string;
  fileType: 'csv' | 'json' | 'excel';
  question?: string;
  domain?: DataDomain;
}

export interface AnalysisResponse {
  textAnalysis: string;
  visualizations?: VisualizationResponse;
}

// Function to analyze dataset
export const analyzeDataset = async ({ dataContent, fileType, question, domain }: DatasetAnalysisRequest) => {
  const requestId = crypto.randomUUID();
  debugLog('Analysis Request Started', {
    requestId,
    timestamp: new Date().toISOString(),
    fileType,
    domain,
    dataContentLength: dataContent?.length || 0,
    hasQuestion: !!question
  });

  const messages = [{
    role: 'user' as const,
    content: `You are a data analysis assistant specializing in time series analysis and anomaly detection. You are analyzing ${fileType.toUpperCase()} data${domain ? ` in the ${domain} domain` : ''}.

Your task is to:
1. Analyze the data for patterns, trends, and seasonality
2. Identify any anomalies or outliers in the dataset
3. Detect correlations between different variables
4. Assess data quality and completeness
5. Provide actionable insights based on the analysis

Analyze this data:\n\n${dataContent}`
  }];

  try {
    debugLog('Preparing Request', {
      requestId,
      messageCount: messages.length,
      firstMessagePreview: messages[0].content.substring(0, 200) + '...'
    });

    const requestPayload = {
      messages,
      data: dataContent,
      requestType: 'analysis',
      analysisOptions: {
        timeSeriesAnalysis: true,
        anomalyDetection: true,
        correlationAnalysis: true,
        dataQualityMetrics: true,
        statisticalAnalysis: {
          basic: true,
          distribution: true,
          confidenceIntervals: true
        }
      }
    };

    debugLog('Invoking Edge Function', {
      requestId,
      functionName: 'bright-api',
      payloadSize: JSON.stringify(requestPayload).length,
      options: requestPayload.analysisOptions
    });

    const { data, error } = await supabase.functions.invoke('bright-api', {
      body: requestPayload
    });

    debugLog('Edge Function Response', {
      requestId,
      hasError: !!error,
      hasData: !!data,
      dataType: typeof data,
      errorMessage: error?.message,
      responseKeys: data ? Object.keys(data) : [],
      rawResponse: data
    });

    if (error) {
      debugLog('Edge Function Error', {
        requestId,
        error,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      throw new Error(`Edge function error: ${error.message}`);
    }

    if (!data) {
      debugLog('No Data Received', {
        requestId,
        response: data
      });
      throw new Error('No data received from Edge Function');
    }

    if (!data.analysis) {
      debugLog('No Analysis in Response', {
        requestId,
        response: data
      });
      throw new Error('No analysis received from API');
    }

    // Return the raw analysis as textAnalysis
    return {
      textAnalysis: data.analysis,
      visualizations: undefined
    };
  } catch (error) {
    debugLog('Analysis Error', {
      requestId,
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack
      } : error,
      type: error instanceof Error ? 'Error' : typeof error
    });
    throw error;
  }
};

// Function to continue chat conversation
export const chatWithClaude = async (
  messages: ChatMessage[],
  dataContent?: string
): Promise<string> => {
  const requestId = crypto.randomUUID();
  debugLog('Chat Request Started', {
    requestId,
    messageCount: messages.length,
    hasDataContent: !!dataContent
  });

  try {
    const { data, error } = await supabase.functions.invoke('bright-api', {
      body: {
        messages,
        data: dataContent,
        requestType: 'chat',
        includeEnhancedAnalytics: true,
        analysisOptions: {
          timeSeriesAnalysis: true,
          anomalyDetection: true,
          correlationAnalysis: true,
          predictiveInsights: true,
          dataQualityMetrics: true,
          statisticalAnalysis: {
            basic: true,
            distribution: true,
            confidenceIntervals: true,
            hypothesisTests: true,
            distributionFitting: true,
            parameters: true
          }
        }
      }
    });

    debugLog('Chat Response Received', {
      requestId,
      hasError: !!error,
      hasData: !!data,
      hasAnalysis: data?.analysis !== undefined
    });

    if (error) {
      debugLog('Chat Error', {
        requestId,
        error,
        message: error.message
      });
      throw error;
    }

    if (!data || !data.analysis) {
      debugLog('Invalid Chat Response', {
        requestId,
        data
      });
      throw new Error('No response received from API');
    }

    debugLog('Chat Success', {
      requestId,
      responseLength: data.analysis.length
    });

    return data.analysis;
  } catch (error) {
    debugLog('Chat Error', {
      requestId,
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack
      } : error
    });
    throw error;
  }
}; 
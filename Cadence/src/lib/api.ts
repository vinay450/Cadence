import { supabase } from '@/lib/supabase';
import type { VisualizationResponse } from './types/visualization';
import { ChatMessage } from './claude';
import { DataDomain } from './types/dataTypes';

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

interface AnalyzeDatasetParams {
  dataContent: string;
  fileType: 'csv' | 'json' | 'excel';
  question: string;
  domain?: DataDomain;
}

// Feature configuration
export const featureConfig = {
  webSearch: {
    enabled: false, // Disabled by default to prevent unexpected costs
    costPerSearch: 0.01, // $0.01 per search
  }
};

// Function to analyze dataset
export const analyzeDataset = async ({
  dataContent,
  fileType,
  question,
  domain = 'auto_detect'
}: AnalyzeDatasetParams): Promise<AnalysisResponse> => {
  try {
    console.log('Analyzing dataset:', {
      fileType,
      domain,
      dataContentPreview: dataContent.substring(0, 200) + '...'
    });

    const prompt = `You are a data analysis expert. Your role is to analyze and research this ${fileType} data deeply to find any patterns or trends.

Please provide your analysis in the following strictly formatted sections, each separated by dividers:

[VISUALIZATION METHODS]
List the two best ways to represent this data graphically, with a brief explanation for each choice.
1.
2.

[DATA STRUCTURE]
Provide a clear summary of:
- Number of records and variables
- Data types present
- Format of special fields
- Any missing data patterns

[KEY STATISTICS]
Present the main statistical findings:
- Ranges and means of numerical variables
- Distribution of categorical variables
- Key percentages and counts

[NOTABLE INSIGHTS]
Highlight 3-5 significant findings or anomalies discovered in the data.
- 
- 
- 

[CORRELATIONS]
List any meaningful relationships between variables, ordered by strength of correlation.
- 
- `;

    const { data, error } = await supabase.functions.invoke('bright-api', {
      body: {
        messages: [{
          role: 'user',
          content: prompt
        }],
        data: dataContent,
        domain
      }
    });

    if (error) {
      console.error('Supabase function error:', error);
      throw error;
    }

    if (!data || !data.analysis) {
      console.error('No analysis received from API');
      throw new Error('No analysis received from API');
    }

    console.log('Raw API response:', data.analysis);

    const response = data.analysis;
    const textAnalysisMatch = response.match(/---TEXT ANALYSIS---([\s\S]*?)(?=---VISUALIZATION RECOMMENDATIONS---)/);
    const visualizationMatch = response.match(/---VISUALIZATION RECOMMENDATIONS---([\s\S]*)/);

    console.log('Text analysis match:', textAnalysisMatch?.[1]?.substring(0, 200));
    console.log('Visualization match:', visualizationMatch?.[1]?.substring(0, 200));

    const textAnalysis = textAnalysisMatch ? textAnalysisMatch[1].trim() : 'No analysis received';
    let visualizations: VisualizationResponse | undefined;

    if (visualizationMatch) {
      const jsonStr = visualizationMatch[1].trim();
      try {
        console.log('Attempting to parse visualization JSON:', jsonStr.substring(0, 200));
        visualizations = JSON.parse(jsonStr);
        console.log('Successfully parsed visualizations:', {
          recommendationsCount: visualizations?.recommendations?.length,
          firstRecommendation: visualizations?.recommendations?.[0]
        });
      } catch (e) {
        console.error('Error parsing visualization recommendations:', e);
        console.error('Invalid JSON string:', jsonStr);
      }
    } else {
      console.error('No visualization section found in response');
    }

    return {
      textAnalysis,
      visualizations
    };
  } catch (error) {
    console.error('Error analyzing dataset:', error);
    throw error;
  }
};

// Function to continue chat conversation
export const chatWithClaude = async (
  messages: ChatMessage[],
  dataContent?: string
): Promise<string> => {
  try {
    const { data, error } = await supabase.functions.invoke('bright-api', {
      body: {
        messages,
        data: dataContent
      }
    });

    if (error) throw error;

    if (!data || !data.analysis) {
      throw new Error('No response received from API');
    }

    return data.analysis;
  } catch (error) {
    console.error('Error chatting with Claude:', error);
    throw error;
  }
};

// Remove unused functions
export async function analyzeData(messages: any[]) {
  const { data, error } = await supabase.functions.invoke('bright-api', {
    body: { messages }
  });

  if (error) throw error;
  return data;
}

export async function chatWithData(messages: any[]) {
  // Get the user's session
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('No active session');
  }

  const { data, error } = await supabase.functions.invoke('analyze', {
    body: { messages },
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  if (error) throw error;
  return data;
} 
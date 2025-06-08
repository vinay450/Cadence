import { supabase } from '@/lib/supabase';
import type { VisualizationResponse } from './types/visualization';

// Types for chat messages and responses
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface DatasetAnalysisRequest {
  dataContent: string;
  fileType: 'csv' | 'json' | 'excel';
  question?: string;
}

export interface AnalysisResponse {
  textAnalysis: string;
  visualizations?: VisualizationResponse;
}

// Feature configuration
export const featureConfig = {
  webSearch: {
    enabled: false, // Disabled by default to prevent unexpected costs
    costPerSearch: 0.01, // $0.01 per search
  }
};

// Function to analyze dataset
export async function analyzeDataset(request: DatasetAnalysisRequest): Promise<AnalysisResponse> {
  try {
    const prompt = `You are a data analysis expert. Your role is to analyze and research this ${request.fileType} data deeply to find any patterns or trends.

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
- 

Format your response as follows:
---TEXT ANALYSIS---
[VISUALIZATION METHODS]
{Your analysis}

[DATA STRUCTURE]
{Your analysis}

[KEY STATISTICS]
{Your analysis}

[NOTABLE INSIGHTS]
{Your analysis}

[CORRELATIONS]
{Your analysis}

---VISUALIZATION RECOMMENDATIONS---
{
  "recommendations": [
    {
      "chartType": "[One of: LineChart, BarChart, AreaChart, PieChart, ScatterChart, ComposedChart]",
      "reason": "[Explanation why this chart type is appropriate]",
      "dataPoints": {
        "xAxis": "[Column name for x-axis]",
        "yAxis": ["Column(s) for y-axis"],
        "groupBy": "[Optional: Column to group by]",
        "aggregation": "[Optional: sum, average, or count]"
      },
      "title": "[Suggested chart title]",
      "xAxisLabel": "[Label for x-axis]",
      "yAxisLabel": "[Label for y-axis]"
    }
  ]
}

Data to analyze:
${request.dataContent}
${request.question ? `\nSpecific question to address: ${request.question}` : ''}`;

    // Get the user's session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('No active session');
    }

    const { data, error } = await supabase.functions.invoke('bright-api', {
      body: { messages: [{ role: 'user', content: prompt }] },
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (error) throw error;

    // Parse the response to separate text analysis and visualization recommendations
    const response = data.analysis || '';
    const textAnalysisMatch = response.match(/---TEXT ANALYSIS---([\s\S]*?)(?=---VISUALIZATION RECOMMENDATIONS---)/);
    const visualizationMatch = response.match(/---VISUALIZATION RECOMMENDATIONS---([\s\S]*)/);

    const textAnalysis = textAnalysisMatch ? textAnalysisMatch[1].trim() : 'No analysis received';
    let visualizations: VisualizationResponse | undefined;

    if (visualizationMatch) {
      try {
        const jsonStr = visualizationMatch[1].trim();
        visualizations = JSON.parse(jsonStr);
      } catch (e) {
        console.error('Error parsing visualization recommendations:', e);
      }
    }

    return {
      textAnalysis,
      visualizations
    };
  } catch (error) {
    console.error('Error analyzing dataset:', error);
    return {
      textAnalysis: 'An error occurred while analyzing the dataset. Please try again later.'
    };
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

    // Get the user's session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('No active session');
    }

    const { data, error } = await supabase.functions.invoke('bright-api', {
      body: { messages: allMessages },
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (error) throw error;
    return data.analysis || 'No response received';
  } catch (error) {
    console.error('Error in chat:', error);
    return 'An error occurred during the chat. Please try again later.';
  }
}

export async function analyzeData(messages: any[]) {
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
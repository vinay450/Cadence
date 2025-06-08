import { supabase } from '@/lib/supabase';
import type { VisualizationResponse } from '@/lib/types/visualization';

export async function POST(request: Request) {
  try {
    const { data: dataContent, fileType, question } = await request.json();

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
${dataContent}
${question ? `\nSpecific question to address: ${question}` : ''}`;

    // Get the user's session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return new Response(JSON.stringify({ error: 'No active session' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
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

    return new Response(JSON.stringify({
      textAnalysis,
      visualizations,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze API:', error);
    return new Response(JSON.stringify({
      error: 'An error occurred while analyzing the dataset',
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 
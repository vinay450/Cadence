import { supabase } from '@/lib/supabase';
import type { VisualizationResponse } from '@/lib/types/visualization';
import { DataDomain, domainMetadata } from '@/lib/types/dataTypes';

export async function POST(request: Request) {
  try {
    const { data: dataContent, fileType, question, domain = 'auto_detect' } = await request.json();

    // Get domain-specific context
    const domainContext = domain !== 'auto_detect' 
      ? `\nData Domain Context:
- Domain: ${domainMetadata[domain as DataDomain].description}
- Common Metrics: ${domainMetadata[domain as DataDomain].commonMetrics.join(', ')}
- Expected Columns: ${domainMetadata[domain as DataDomain].typicalColumns.join(', ')}
- Special Considerations: ${domainMetadata[domain as DataDomain].specialConsiderations.join(', ')}

Please optimize your analysis for this specific domain, paying special attention to domain-specific metrics, patterns, and best practices.`
      : '\nPlease analyze the data and infer the most appropriate domain for analysis.';

    const prompt = `You are a data analysis expert. Your role is to analyze and research this ${fileType} data deeply to find any patterns and trends.${domainContext}

Please provide your analysis in the following strictly formatted sections, each separated by dividers:

[VISUALIZATION METHODS]
List the three most effective ways to represent this data graphically, with technical justification:
1. Primary Visualization: [Chart Type]
   - Technical Reason:
   - Key Variables:
   - Expected Insights:

2. Secondary Visualization: [Chart Type]
   - Technical Reason:
   - Key Variables:
   - Expected Insights:

3. Supplementary Visualization: [Chart Type]
   - Technical Reason:
   - Key Variables:
   - Expected Insights:

[DATA STRUCTURE]
Technical Overview:
- Record Count: [exact number]
- Variable Count: [exact number]
- Memory Usage Estimate: [size in KB/MB]
- Schema Definition:
  {column_name}: {data_type} [null_count] [unique_values_count]

Data Quality Metrics:
- Completeness: [% of non-null values per column]
- Uniqueness: [% of unique values per column]
- Consistency: [data format consistency score]
- Accuracy: [range validation results]

[KEY STATISTICS]
Numerical Variables:
{for each numerical column}
- Column: [name]
  - Mean: [value]
  - Median: [value]
  - Mode: [value]
  - Standard Deviation: [value]
  - Quartiles: [Q1, Q3]
  - Skewness: [value]
  - Kurtosis: [value]
  - Outliers: [count and range]

Categorical Variables:
{for each categorical column}
- Column: [name]
  - Unique Categories: [count]
  - Mode: [most frequent]
  - Category Distribution: [top 5 with percentages]
  - Entropy: [information entropy score]

Time Series Metrics (if applicable):
- Seasonality: [detected patterns]
- Trend: [direction and magnitude]
- Cyclical Patterns: [period length]
- Stationarity Test: [result]

[NOTABLE INSIGHTS]
Statistical Significance:
- Highlight statistically significant findings (p < 0.05)
- List confidence intervals for key metrics
- Document any hypothesis tests performed

Key Findings:
1. [Primary Finding]
   - Statistical Evidence:
   - Confidence Level:
   - Business Impact:

2. [Secondary Finding]
   - Statistical Evidence:
   - Confidence Level:
   - Business Impact:

3. [Tertiary Finding]
   - Statistical Evidence:
   - Confidence Level:
   - Business Impact:

[CORRELATIONS]
Correlation Matrix:
- Strong Correlations (|r| > 0.7):
  {var1} ~ {var2}: [correlation coefficient]
  - Direction: [positive/negative]
  - Statistical Significance: [p-value]
  - Relationship Type: [linear/non-linear]

Feature Importance:
- Primary Drivers: [top 3 influential variables]
- Secondary Factors: [next 3 influential variables]
- Interaction Effects: [significant variable interactions]

[RECOMMENDATIONS]
Data Quality:
- Specific actions to improve data quality
- Suggested data collection improvements
- Recommended validation rules

Analysis Opportunities:
- Suggested deep-dive areas
- Potential predictive modeling approaches
- Additional data points that could enhance analysis

Format your response as follows:
---TEXT ANALYSIS---
[Include all sections above with their analysis]

---VISUALIZATION RECOMMENDATIONS---
{
  "recommendations": [
    {
      "chartType": "[One of: LineChart, BarChart, AreaChart, PieChart, ScatterChart, ComposedChart]",
      "reason": "[Technical justification for this chart type]",
      "dataPoints": {
        "xAxis": "[Column name for x-axis]",
        "yAxis": ["Column(s) for y-axis"],
        "groupBy": "[Optional: Column to group by]",
        "aggregation": "[Optional: sum, average, count]",
        "statisticalOverlays": ["confidence_intervals", "trend_lines", "outlier_markers"],
        "transformations": ["log", "normalize", "standardize"]
      },
      "title": "[Suggested chart title]",
      "xAxisLabel": "[Label for x-axis]",
      "yAxisLabel": "[Label for y-axis]",
      "technicalNotes": {
        "dataPreparation": "[Required data transformations]",
        "statisticalTests": "[Relevant statistical tests]",
        "limitations": "[Data or visualization limitations]"
      }
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
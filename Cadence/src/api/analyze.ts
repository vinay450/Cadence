import { supabase } from '@/lib/supabase';
import type { VisualizationResponse } from '@/lib/types/visualization';
import { DataDomain, domainMetadata } from '@/lib/types/dataTypes';

const VISUALIZATION_FORMAT = `{
  "recommendations": [
    {
      "title": "[Clear, descriptive chart title]",
      "chartType": "[One of: LineChart, BarChart, AreaChart, PieChart, ScatterChart, ComposedChart]",
      "dataPoints": {
        "xAxis": "[Column name for x-axis]",
        "yAxis": ["Array of column names for y-axis"],
        "xAxisLabel": "[Descriptive x-axis label with units]",
        "yAxisLabel": "[Descriptive y-axis label with units]",
        "aggregation": "[Optional: sum, average, count]",
        "groupBy": ["Optional: Array of columns to group by"],
        "statisticalOverlays": ["Optional: confidence_intervals, trend_lines, outlier_markers"]
      },
      "reason": "[Technical justification for this chart type]",
      "technicalNotes": {
        "dataPreparation": "[Required data transformations]",
        "limitations": "[Data or visualization limitations]"
      }
    }
  ],
  "dataQualityMetrics": {
    "completeness": {
      "[column_name]": [percentage]
    },
    "uniqueness": {
      "[column_name]": [percentage]
    },
    "consistency": [overall_score]
  },
  "correlationMatrix": {
    "[variable1]": {
      "[variable2]": [correlation_coefficient]
    }
  },
  "timeSeriesMetrics": {
    "seasonality": {
      "pattern": "[pattern_description]",
      "period": [number]
    },
    "trend": {
      "direction": "[increasing/decreasing/stable]",
      "magnitude": [number]
    },
    "stationarity": {
      "isStationary": [boolean],
      "pValue": [number]
    }
  }
}`;

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

    const prompt = `You are a data analysis expert specializing in enterprise-level data visualization. Your role is to analyze this ${fileType} data deeply and provide professional, insightful visualizations that follow best practices.${domainContext}

Please provide your analysis in the following strictly formatted sections:

[VISUALIZATION METHODS]
For each visualization, carefully consider:
1. Data Distribution: Is the data continuous, discrete, categorical, or time-series?
2. Relationship Types: Are we showing trends, comparisons, compositions, or distributions?
3. Scale Considerations: Linear vs logarithmic, handling outliers, appropriate units
4. Visual Clarity: Avoiding chart junk, maintaining data-ink ratio, color accessibility

Recommend EXACTLY TWO visualizations that best represent the key insights from the data.
For each recommended visualization, provide:
- Technical Justification: Why this chart type is optimal
- Key Variables: The specific variables and their roles
- Data Preparation: Any necessary transformations or aggregations
- Statistical Context: Relevant statistical overlays or annotations
- Limitations: Any potential issues or considerations

[DATA STRUCTURE]
Technical Overview:
- Record Count: [exact number]
- Variable Types: [Detailed type information for each column]
- Data Quality:
  * Completeness: [% per column]
  * Type Consistency: [Any mixed types or format issues]
  * Value Ranges: [Min, Max, Outliers]
  * Special Values: [Nulls, Defaults, Placeholders]

[KEY STATISTICS]
For Numerical Variables:
{for each numerical column}
- Column: [name]
  * Distribution Type: [normal, skewed, multimodal, etc.]
  * Central Tendency: [mean, median, mode]
  * Spread: [std dev, IQR, range]
  * Outliers: [count, range, significance]
  * Quality Metrics: [% valid, % complete]

For Categorical Variables:
{for each categorical column}
- Column: [name]
  * Cardinality: [unique values count]
  * Mode: [most frequent]
  * Distribution: [top categories with %]
  * Special Cases: [empty, invalid, other]

For Time Series (if applicable):
- Temporal Patterns:
  * Seasonality: [period, strength]
  * Trend: [direction, magnitude]
  * Cycles: [length, significance]
  * Anomalies: [points of interest]

[CORRELATIONS]
Relationship Analysis:
- Strong Correlations (|r| > 0.7):
  * Variable Pairs: [names and coefficients]
  * Relationship Type: [linear, non-linear, categorical]
  * Statistical Significance: [p-value]
  * Visualization Recommendation: [best chart type]

[TECHNICAL RECOMMENDATIONS]
Data Preparation:
- Cleaning Steps: [specific actions needed]
- Transformations: [log, normalize, bin, etc.]
- Aggregations: [recommended grouping]
- Format Standardization: [date formats, units, etc.]

Visualization Best Practices:
- Scale Selection: [linear, log, categorical]
- Color Schemes: [recommended palettes]
- Annotation Needs: [trend lines, confidence intervals]
- Interactive Features: [zoom, filter, drill-down]

Format your response as follows:
---TEXT ANALYSIS---
[Include all sections above with their analysis]

---VISUALIZATION RECOMMENDATIONS---
${VISUALIZATION_FORMAT}

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
    console.log('Raw API response:', response);

    const textAnalysisMatch = response.match(/---TEXT ANALYSIS---([\s\S]*?)(?=---VISUALIZATION RECOMMENDATIONS---)/);
    const visualizationMatch = response.match(/---VISUALIZATION RECOMMENDATIONS---([\s\S]*)/);

    console.log('Text analysis match:', textAnalysisMatch);
    console.log('Visualization match:', visualizationMatch);

    const textAnalysis = textAnalysisMatch ? textAnalysisMatch[1].trim() : 'No analysis received';
    let visualizations: VisualizationResponse | undefined;

    if (visualizationMatch) {
      try {
        const jsonStr = visualizationMatch[1].trim();
        console.log('Visualization JSON string:', jsonStr);
        visualizations = JSON.parse(jsonStr);
        console.log('Parsed visualizations:', visualizations);
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
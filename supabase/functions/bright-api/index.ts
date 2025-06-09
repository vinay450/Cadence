import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { Anthropic } from "https://esm.sh/@anthropic-ai/sdk@0.18.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Debug logger function
const debugLog = (stage: string, data: any) => {
  console.log(`🔍 [DEBUG - ${stage}]`, JSON.stringify(data, null, 2));
};

// Helper function to handle CORS headers
const getCorsHeaders = (origin)=>{
  debugLog('CORS Headers', { origin });
  // List of allowed origins
  const allowedOrigins = [
    'http://localhost:8080',
    'http://localhost:8082',
    'http://localhost:3000',
    'http://127.0.0.1:8080',
    'http://127.0.0.1:8082',
    'http://127.0.0.1:3000'
  ];
  // If no origin provided or origin not in allowed list, default to the first allowed origin
  const validOrigin = origin && allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
  debugLog('CORS Validation', { requestOrigin: origin, validOrigin, isAllowed: allowedOrigins.includes(origin) });
  return {
    'Access-Control-Allow-Origin': validOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400'
  };
};

// Helper function to create error responses
const createErrorResponse = (message, status = 500, details, origin)=>{
  debugLog('Error Response', { message, status, details });
  console.error(`Edge Function error: ${message}`, details);
  return new Response(JSON.stringify({
    error: message,
    details: details || 'Check the function logs for more details'
  }), {
    status,
    headers: {
      ...getCorsHeaders(origin),
      'Content-Type': 'application/json'
    }
  });
};

serve(async (req)=>{
  const requestId = crypto.randomUUID();
  debugLog('Request Received', {
    requestId,
    method: req.method,
    url: req.url,
    headers: Object.fromEntries(req.headers.entries())
  });

  const origin = req.headers.get('origin');
  debugLog('Request Origin', { origin });

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    debugLog('CORS Preflight', { origin });
    return new Response(null, {
      status: 204,
      headers: getCorsHeaders(origin)
    });
  }

  try {
    // Check environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');
    
    debugLog('Environment Check', {
      hasSuperbaseUrl: !!supabaseUrl,
      hasSupabaseAnonKey: !!supabaseAnonKey,
      hasAnthropicApiKey: !!anthropicApiKey
    });

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase configuration');
      return createErrorResponse('Missing Supabase configuration', 500, undefined, origin);
    }
    if (!anthropicApiKey) {
      console.error('Missing Anthropic API key');
      return createErrorResponse('Missing Anthropic API key', 500, undefined, origin);
    }

    // Validate authorization
    const authHeader = req.headers.get('authorization');
    debugLog('Authorization Check', { hasAuthHeader: !!authHeader });
    
    if (!authHeader) {
      console.error('Missing authorization header');
      return createErrorResponse('No authorization header', 401, undefined, origin);
    }

    // Create Supabase client
    debugLog('Supabase Client Creation', { url: supabaseUrl });
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      },
      global: {
        headers: {
          Authorization: authHeader
        }
      }
    });

    // Parse request body first
    let requestData;
    try {
      requestData = await req.json();
      debugLog('Request Body Parsed', {
        hasMessages: !!requestData?.messages,
        messageCount: requestData?.messages?.length,
        hasData: !!requestData?.data,
        dataPreview: requestData?.data ? `${requestData.data.substring(0, 100)}...` : null
      });
    } catch (e) {
      console.error('Failed to parse request body:', e);
      return createErrorResponse('Invalid JSON in request body', 400, e.message, origin);
    }

    // Validate request data
    if (!requestData?.messages || !Array.isArray(requestData.messages)) {
      debugLog('Invalid Request Data', { requestData });
      return createErrorResponse('Invalid request: messages array is required', 400, undefined, origin);
    }

    const { messages, data } = requestData;
    
    // Initialize Anthropic with API key from environment variable
    debugLog('Anthropic Client Initialization', { timestamp: new Date().toISOString() });
    const anthropic = new Anthropic({
      apiKey: anthropicApiKey
    });

    // Determine request type and set system prompt
    const isAnalysisRequest = messages[0]?.content?.includes('You are a data analysis expert');
    debugLog('Request Type Detection', { 
      isAnalysisRequest,
      firstMessagePreview: messages[0]?.content?.substring(0, 100)
    });
    const systemPrompt = isAnalysisRequest ? `You are an expert data analyst and visualization specialist named Cadence AI. Your role is to perform comprehensive analysis of datasets and provide actionable insights with specific visualization recommendations.

CRITICAL FORMATTING REQUIREMENTS:
You MUST respond using EXACTLY this two-section format with these EXACT markers:

---ANALYSIS---
[Your detailed analysis content here]

---VISUALIZATION---
[Your JSON visualization recommendations here]

Do NOT add any text before ---ANALYSIS--- or after the JSON in ---VISUALIZATION---. These markers are case-sensitive and must be exactly as shown.

=== ANALYSIS SECTION REQUIREMENTS ===

Provide a comprehensive analysis covering these specific areas:

**Dataset Overview:**
- Total records, time span, and data collection frequency
- Variables present with their data types and roles
- Data completeness and quality assessment

**Statistical Summary:**
- Descriptive statistics for numerical variables (mean, median, std dev, range)
- Distribution analysis (normal, skewed, bimodal, outliers)
- Categorical variable frequencies and cardinality
- Missing data patterns and implications

**Pattern Recognition:**
- Temporal trends (increasing, decreasing, cyclical, seasonal)
- Correlation analysis between variables (strong relationships > 0.7)
- Anomaly detection with specific timestamps and values
- Clustering or grouping patterns in the data

**Domain-Specific Insights:**
- Key performance indicators relevant to the data domain
- Business/operational implications of findings
- Risk factors or concerning patterns identified
- Opportunities for optimization or improvement

**Data Quality Assessment:**
- Completeness percentage by variable
- Consistency issues or format problems
- Outlier analysis with statistical significance
- Reliability and accuracy considerations

=== VISUALIZATION SECTION REQUIREMENTS ===

Provide EXACTLY this JSON structure with NO additional text:

{
  "recommendations": [
    {
      "title": "Clear, descriptive title that explains what insight the chart reveals",
      "chartType": "LineChart | BarChart | AreaChart | PieChart | ScatterChart | ComposedChart",
      "dataPoints": {
        "xAxis": "exact_column_name_from_data",
        "yAxis": ["array_of_column_names"],
        "xAxisLabel": "Descriptive label with units (e.g., 'Time (Hours)', 'Device ID')",
        "yAxisLabel": "Descriptive label with units (e.g., 'Temperature (°C)', 'Count')",
        "aggregation": "sum | average | count | max | min (if needed)",
        "groupBy": ["column_names_for_grouping"],
        "color": "column_name_for_color_coding (optional)",
        "size": "column_name_for_size_variation (optional)"
      },
      "insights": "What specific pattern or trend this visualization reveals",
      "priority": "high | medium | low"
    }
  ],
  "dataQualityMetrics": {
    "completeness": {
      "column_name": percentage_complete
    },
    "outlierCount": number_of_outliers_detected,
    "anomalies": [
      {
        "timestamp": "exact_timestamp_or_identifier",
        "variable": "affected_column_name",
        "value": actual_anomalous_value,
        "severity": "high | medium | low",
        "description": "brief_explanation"
      }
    ]
  },
  "statisticalSummary": {
    "correlations": [
      {
        "variables": ["var1", "var2"],
        "coefficient": correlation_value,
        "strength": "strong | moderate | weak"
      }
    ],
    "trends": [
      {
        "variable": "column_name",
        "direction": "increasing | decreasing | stable",
        "slope": numerical_slope_value,
        "r_squared": r_squared_value
      }
    ]
  },
  "businessInsights": {
    "keyFindings": [
      "Most important insight from the data",
      "Second most important finding",
      "Third key insight"
    ],
    "recommendations": [
      "Specific actionable recommendation based on data",
      "Second recommendation",
      "Third recommendation"
    ],
    "riskFactors": [
      "Identified risk or concern from the data",
      "Additional risk factors"
    ]
  }
}

=== CHART TYPE SELECTION GUIDELINES ===

Choose chart types based on data characteristics:

**LineChart:** Time series data, trends over time, continuous variables
**BarChart:** Categorical comparisons, counts, discrete values
**AreaChart:** Cumulative data, stacked categories over time, proportions
**ScatterChart:** Correlation analysis, relationship between two continuous variables
**PieChart:** Composition analysis, parts of a whole (use sparingly, only for 3-7 categories)
**ComposedChart:** Multiple data types (line + bar), different scales on same chart

=== QUALITY STANDARDS ===

- Use actual column names from the provided data
- Provide specific numerical values, not approximations
- Include units in axis labels where applicable
- Ensure all JSON is valid and properly formatted
- Focus on actionable insights that drive decision-making
- Prioritize visualizations that reveal the most important patterns

Remember: The markers ---ANALYSIS--- and ---VISUALIZATION--- are critical for parsing. Do not modify them or add extra text around them.` : 'You are a helpful AI assistant.';

    // Make API call to Anthropic
    let response;
    try {
      debugLog('Claude API Request', {
        model: 'claude-3-5-sonnet-20241022',
        messageCount: messages.length,
        temperature: isAnalysisRequest ? 0.7 : 0.5
      });

      response = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4096,
        system: systemPrompt,
        messages: messages.map((msg)=>({
          role: msg.role,
          content: msg.content + (data ? `\n\nContext: ${data}` : '')
        })),
        temperature: isAnalysisRequest ? 0.7 : 0.5
      });

      debugLog('Claude API Response', {
        hasContent: !!response?.content,
        contentLength: response?.content?.[0]?.text?.length,
        contentPreview: response?.content?.[0]?.text?.substring(0, 100)
      });
    } catch (e) {
      debugLog('Claude API Error', {
        error: e.message,
        stack: e.stack
      });
      return createErrorResponse('Failed to call Claude API', 500, e.message, origin);
    }

    // Validate response
    if (!response?.content?.[0]?.text) {
      debugLog('Invalid Claude Response', { response });
      return createErrorResponse('Invalid response from Claude API', 500, undefined, origin);
    }

    // Just return the raw text from Claude
    const rawResponse = response.content[0].text;
    
    debugLog('Final Response', {
      responseLength: rawResponse.length,
      preview: rawResponse.substring(0, 100)
    });

    return new Response(JSON.stringify({ analysis: rawResponse }), {
      headers: {
        ...getCorsHeaders(origin),
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    debugLog('Unexpected Error', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    return createErrorResponse('Unexpected error in edge function', 500, error instanceof Error ? error.stack : String(error), origin);
  }
});

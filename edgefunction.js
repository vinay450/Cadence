import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { Anthropic } from "https://esm.sh/@anthropic-ai/sdk@0.18.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// In-memory session store (consider Redis for production)
const sessionStore = new Map();

// Debug logger function
const debugLog = (stage, data) => {
  console.log(`🔍 [DEBUG - ${stage}]`, JSON.stringify(data, null, 2));
};

// Helper function to handle CORS headers
const getCorsHeaders = (origin) => {
  debugLog('CORS Headers', { origin });
  const allowedOrigins = [
    'http://localhost:8080',
    'http://localhost:8081',
    'http://localhost:3000',
    'http://127.0.0.1:8080',
    'http://127.0.0.1:8082',
    'http://127.0.0.1:3000'
  ];
  const validOrigin = origin && allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
  debugLog('CORS Validation', {
    requestOrigin: origin,
    validOrigin,
    isAllowed: allowedOrigins.includes(origin)
  });
  return {
    'Access-Control-Allow-Origin': validOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400'
  };
};

// Helper function to create error responses
const createErrorResponse = (message, status = 500, details, origin) => {
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

// Function to generate data summary for context
const generateDataSummary = (data) => {
  try {
    const lines = data.split('\n').filter(line => line.trim());
    const headers = lines[0] || '';
    const sampleRows = lines.slice(1, 4); // First 3 data rows
    
    return {
      headers,
      sampleRows,
      totalRows: Math.max(0, lines.length - 1),
      summary: `Dataset with ${Math.max(0, lines.length - 1)} rows and columns: ${headers}`
    };
  } catch (error) {
    debugLog('Error generating data summary', { error: error.message });
    return {
      headers: '',
      sampleRows: [],
      totalRows: 0,
      summary: 'Dataset summary unavailable'
    };
  }
};

// Function to store session data
const storeSessionData = (sessionId, data, analysis) => {
  try {
    const dataSummary = generateDataSummary(data);
    sessionStore.set(sessionId, {
      dataSummary,
      fullData: data,
      initialAnalysis: analysis,
      timestamp: Date.now(),
      messageCount: 1
    });
    
    debugLog('Session Stored', { sessionId, dataRows: dataSummary.totalRows });
  } catch (error) {
    debugLog('Error storing session', { sessionId, error: error.message });
  }
};

// Function to get session context
const getSessionContext = (sessionId) => {
  if (!sessionId) return null;
  
  const session = sessionStore.get(sessionId);
  if (!session) {
    debugLog('Session not found', { sessionId });
    return null;
  }
  
  // Auto-expire sessions after 1 hour
  if (Date.now() - session.timestamp > 3600000) {
    sessionStore.delete(sessionId);
    debugLog('Session expired', { sessionId });
    return null;
  }
  
  return session;
};

// Function to clean up old sessions (run periodically)
const cleanupSessions = () => {
  const now = Date.now();
  let cleaned = 0;
  
  for (const [sessionId, session] of sessionStore.entries()) {
    if (now - session.timestamp > 3600000) { // 1 hour
      sessionStore.delete(sessionId);
      cleaned++;
    }
  }
  
  if (cleaned > 0) {
    debugLog('Session cleanup', { cleaned, remaining: sessionStore.size });
  }
};

// Run cleanup every 15 minutes
setInterval(cleanupSessions, 15 * 60 * 1000);

serve(async (req) => {
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
      hasSupabaseUrl: !!supabaseUrl,
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

    // Parse request body
    let requestData;
    try {
      requestData = await req.json();
      debugLog('Request Body Parsed', {
        hasMessages: !!requestData?.messages,
        messageCount: requestData?.messages?.length,
        hasData: !!requestData?.data,
        hasSessionId: !!requestData?.sessionId,
        isNewAnalysis: !!requestData?.isNewAnalysis,
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

    const { messages, data, sessionId, isNewAnalysis } = requestData;

    // Initialize Anthropic client
    debugLog('Anthropic Client Initialization', { timestamp: new Date().toISOString() });
    const anthropic = new Anthropic({ apiKey: anthropicApiKey });

    // Determine request type
    const isInitialAnalysis = isNewAnalysis || (!!data && !sessionId);
    let session = null;
    let systemPrompt = '';
    let contextualMessages = [...messages];

    debugLog('Request Type Detection', {
      isInitialAnalysis,
      hasData: !!data,
      hasSessionId: !!sessionId,
      sessionStoreSize: sessionStore.size
    });

    if (isInitialAnalysis && data) {
      // NEW ANALYSIS: Process data and store session
      debugLog('Processing New Analysis', { hasData: !!data, dataLength: data.length });
      
      systemPrompt = `You are Cadence AI, a data analyst analyzing this dataset as a researcher. 

MANDATORY: Your response MUST start with exactly "---ANALYSIS---" and contain exactly "---VISUALIZATION---" followed by valid JSON.

REQUIRED FORMAT (copy this structure exactly):

---ANALYSIS---
[Write your analysis of the dataset here. Include overview, statistics, patterns, and insights in paragraph form.]

---VISUALIZATION---
{
  "recommendations": [
    {
      "title": "Chart title describing the insight",
      "chartType": "LineChart",
      "dataPoints": {
        "xAxis": "column_name",
        "yAxis": ["column_name"],
        "xAxisLabel": "Label with units",
        "yAxisLabel": "Label with units"
      },
      "insights": "What this chart reveals",
      "priority": "high"
    }
  ],
  "dataQualityMetrics": {
    "completeness": {"column_name": 100},
    "outlierCount": 0,
    "anomalies": []
  },
  "statisticalSummary": {
    "correlations": [],
    "trends": []
  },
  "businessInsights": {
    "keyFindings": ["Finding 1", "Finding 2"],
    "recommendations": ["Recommendation 1"],
    "riskFactors": ["Risk 1"]
  }
}

CHART TYPES: LineChart, BarChart, ScatterChart, AreaChart, PieChart, ComposedChart

CRITICAL: 
- Start immediately with ---ANALYSIS---
- Use exact column names from the data
- End with valid JSON only
- No text after the JSON`;

      // Add data to the first message
      contextualMessages = messages.map((msg, index) => ({
        role: msg.role,
        content: index === 0 ? `${msg.content}\n\nData to analyze:\n${data}` : msg.content
      }));

    } else if (sessionId) {
      // CONTINUATION: Use stored session context
      session = getSessionContext(sessionId);
      
      if (!session) {
        debugLog('Session Not Found', { sessionId, availableSessions: Array.from(sessionStore.keys()) });
        return createErrorResponse('Session expired or not found. Please start a new analysis.', 404, undefined, origin);
      }
      
      debugLog('Continuing Session', { 
        sessionId, 
        messageCount: session.messageCount + 1,
        dataRows: session.dataSummary.totalRows,
        sessionAge: Date.now() - session.timestamp
      });

      // Update session
      session.messageCount++;
      session.timestamp = Date.now();

      systemPrompt = `You are Cadence AI, a data analyst. You previously analyzed a dataset with the following characteristics:

DATASET CONTEXT:
- ${session.dataSummary.summary}
- Headers: ${session.dataSummary.headers}
- Sample data rows: ${session.dataSummary.sampleRows.join('\n')}

PREVIOUS ANALYSIS SUMMARY:
${session.initialAnalysis.substring(0, 500)}${session.initialAnalysis.length > 500 ? '...' : ''}

The user is now asking follow-up questions about this dataset. You can reference the data structure and your previous analysis. If you need to see specific data values, ask the user to clarify which aspects they want to explore further.

Respond naturally and conversationally. You don't need to use the structured format unless specifically analyzing new aspects of the data.`;

    } else {
      // REGULAR CHAT: No data analysis
      debugLog('Regular Chat Mode', { messageCount: messages.length });
      systemPrompt = 'You are a helpful AI assistant.';
    }

    // Make API call to Anthropic
    let response;
    try {
      debugLog('Claude API Request', {
        model: 'claude-3-5-sonnet-20241022',
        messageCount: contextualMessages.length,
        temperature: isInitialAnalysis ? 0.0 : 0.7,
        systemPromptLength: systemPrompt.length
      });

      response = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4096,
        system: systemPrompt,
        messages: contextualMessages,
        temperature: isInitialAnalysis ? 0.0 : 0.7
      });

      debugLog('Claude API Response', {
        hasContent: !!response?.content,
        contentLength: response?.content?.[0]?.text?.length,
        contentPreview: response?.content?.[0]?.text?.substring(0, 200)
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

    const fullResponse = response.content[0].text;
    let responseObj = {};

    if (isInitialAnalysis) {
      // Parse structured analysis response
      debugLog('Parsing Initial Analysis', {
        responseLength: fullResponse.length,
        startsWithAnalysis: fullResponse.startsWith('---ANALYSIS---'),
        containsVisualization: fullResponse.includes('---VISUALIZATION---')
      });

      // Validate format before parsing
      if (!fullResponse.startsWith('---ANALYSIS---')) {
        debugLog('Format Validation Failed', {
          expectedStart: '---ANALYSIS---',
          actualStart: fullResponse.substring(0, 50)
        });
        return createErrorResponse(
          'Claude response format error - missing required markers', 
          500, 
          `Expected response to start with ---ANALYSIS--- but got: ${fullResponse.substring(0, 100)}...`, 
          origin
        );
      }

      // Parse the response
      const analysisMatch = fullResponse.match(/---ANALYSIS---([\s\S]*?)(?=---VISUALIZATION---|$)/);
      const visualizationMatch = fullResponse.match(/---VISUALIZATION---([\s\S]*)/);

      debugLog('Response Parsing', {
        hasAnalysisMatch: !!analysisMatch,
        hasVisualizationMatch: !!visualizationMatch
      });

      let textAnalysis = '';
      let visualizations = null;

      // Handle analysis section
      if (analysisMatch) {
        textAnalysis = analysisMatch[1].trim();
        debugLog('Analysis Extracted', { length: textAnalysis.length });
      } else {
        textAnalysis = fullResponse;
        debugLog('Analysis Fallback', { usingFullResponse: true });
      }

      // Handle visualization section
      if (visualizationMatch) {
        try {
          let jsonString = visualizationMatch[1].trim();
          // Clean any markdown formatting
          jsonString = jsonString.replace(/^```json\s*/, '').replace(/\s*```$/, '');
          jsonString = jsonString.replace(/^```\s*/, '').replace(/\s*```$/, '');
          
          // Find JSON object
          const jsonMatch = jsonString.match(/({[\s\S]*})/);
          if (jsonMatch) {
            debugLog('JSON Parsing Attempt', {
              jsonLength: jsonMatch[1].length,
              preview: jsonMatch[1].substring(0, 200)
            });
            visualizations = JSON.parse(jsonMatch[1]);
            debugLog('JSON Parsed Successfully', {
              hasRecommendations: !!visualizations.recommendations,
              recommendationCount: visualizations.recommendations?.length
            });
          } else {
            debugLog('No JSON Found', { visualizationSection: jsonString });
          }
        } catch (e) {
          debugLog('JSON Parse Error', {
            error: e.message,
            jsonString: visualizationMatch[1]
          });
          // Create default structure for failed parsing
          visualizations = {
            recommendations: [],
            dataQualityMetrics: {
              completeness: {},
              outlierCount: 0,
              anomalies: []
            },
            statisticalSummary: {
              correlations: [],
              trends: []
            },
            businessInsights: {
              keyFindings: [],
              recommendations: [],
              riskFactors: []
            }
          };
        }
      } else {
        debugLog('No Visualization Section', { creatingDefault: true });
        // Create default structure if no visualization section found
        visualizations = {
          recommendations: [],
          dataQualityMetrics: {
            completeness: {},
            outlierCount: 0,
            anomalies: []
          },
          statisticalSummary: {
            correlations: [],
            trends: []
          },
          businessInsights: {
            keyFindings: [],
            recommendations: [],
            riskFactors: []
          }
        };
      }

      // Store session for future reference
      const newSessionId = sessionId || crypto.randomUUID();
      storeSessionData(newSessionId, data, textAnalysis);

      responseObj = {
        analysis: textAnalysis || 'No analysis available',
        visualizations,
        sessionId: newSessionId,
        isNewSession: true
      };

    } else {
      // Simple conversational response
      debugLog('Conversational Response', {
        responseLength: fullResponse.length,
        hasSessionId: !!sessionId
      });

      responseObj = {
        analysis: fullResponse,
        visualizations: null,
        sessionId: sessionId,
        isNewSession: false
      };
    }

    // Final response
    debugLog('Final Response Object', {
      hasAnalysis: !!responseObj.analysis,
      analysisLength: responseObj.analysis?.length,
      hasVisualizations: !!responseObj.visualizations,
      visualizationKeys: responseObj.visualizations ? Object.keys(responseObj.visualizations) : [],
      sessionId: responseObj.sessionId,
      isNewSession: responseObj.isNewSession
    });

    return new Response(JSON.stringify(responseObj), {
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
    return createErrorResponse(
      'Unexpected error in edge function', 
      500, 
      error instanceof Error ? error.stack : String(error), 
      origin
    );
  }
});
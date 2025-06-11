import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { Anthropic } from "https://esm.sh/@anthropic-ai/sdk@0.18.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
// Debug logger function
const debugLog = (stage, data)=>{
 console.log(`🔍 [DEBUG - ${stage}]`, JSON.stringify(data, null, 2));
};
// Helper function to handle CORS headers
const getCorsHeaders = (origin)=>{
 debugLog('CORS Headers', {
   origin
 });
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
const createErrorResponse = (message, status = 500, details, origin)=>{
 debugLog('Error Response', {
   message,
   status,
   details
 });
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
 debugLog('Request Origin', {
   origin
 });
 // Handle CORS preflight requests
 if (req.method === 'OPTIONS') {
   debugLog('CORS Preflight', {
     origin
   });
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
   debugLog('Authorization Check', {
     hasAuthHeader: !!authHeader
   });
   if (!authHeader) {
     console.error('Missing authorization header');
     return createErrorResponse('No authorization header', 401, undefined, origin);
   }
   // Create Supabase client
   debugLog('Supabase Client Creation', {
     url: supabaseUrl
   });
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
       dataPreview: requestData?.data ? `${requestData.data.substring(0, 100)}...` : null
     });
   } catch (e) {
     console.error('Failed to parse request body:', e);
     return createErrorResponse('Invalid JSON in request body', 400, e.message, origin);
   }
   // Validate request data
   if (!requestData?.messages || !Array.isArray(requestData.messages)) {
     debugLog('Invalid Request Data', {
       requestData
     });
     return createErrorResponse('Invalid request: messages array is required', 400, undefined, origin);
   }
   const { messages, data } = requestData;
   // Initialize Anthropic client
   debugLog('Anthropic Client Initialization', {
     timestamp: new Date().toISOString()
   });
   const anthropic = new Anthropic({
     apiKey: anthropicApiKey
   });
   // Better detection logic for analysis requests
   const isAnalysisRequest = messages[0]?.content?.includes('You are a data analysis expert') || messages[0]?.content?.includes('analyze') || !!data;
   debugLog('Request Type Detection', {
     isAnalysisRequest,
     hasData: !!data,
     firstMessagePreview: messages[0]?.content?.substring(0, 100)
   });
   // New simplified and enforced prompt
   const systemPrompt = isAnalysisRequest ? `You are Cadence AI, a data analyst analyzing this dataset as a researcher.


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
- No text after the JSON` : 'You are a helpful AI assistant.';
   // Make API call to Anthropic
   let response;
   try {
     debugLog('Claude API Request', {
       model: 'claude-3-5-sonnet-20241022',
       messageCount: messages.length,
       temperature: isAnalysisRequest ? 0.0 : 0.5,
       systemPromptLength: systemPrompt.length
     });
     response = await anthropic.messages.create({
       model: 'claude-3-5-sonnet-20241022',
       max_tokens: 4096,
       system: systemPrompt,
       messages: messages.map((msg)=>({
           role: msg.role,
           content: msg.content + (data ? `\n\nData to analyze:\n${data}` : '')
         })),
       temperature: isAnalysisRequest ? 0.0 : 0.5 // Maximum consistency for analysis
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
     debugLog('Invalid Claude Response', {
       response
     });
     return createErrorResponse('Invalid response from Claude API', 500, undefined, origin);
   }
   // Parse Claude's response with format validation
   const fullResponse = response.content[0].text;
   debugLog('Full Response', {
     responseLength: fullResponse.length,
     startsWithAnalysis: fullResponse.startsWith('---ANALYSIS---'),
     containsVisualization: fullResponse.includes('---VISUALIZATION---'),
     preview: fullResponse.substring(0, 200)
   });
   // Validate format before parsing
   if (isAnalysisRequest && !fullResponse.startsWith('---ANALYSIS---')) {
     debugLog('Format Validation Failed', {
       expectedStart: '---ANALYSIS---',
       actualStart: fullResponse.substring(0, 50)
     });
     // Return error with format issue
     return createErrorResponse('Claude response format error - missing required markers', 500, `Expected response to start with ---ANALYSIS--- but got: ${fullResponse.substring(0, 100)}...`, origin);
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
     debugLog('Analysis Extracted', {
       length: textAnalysis.length
     });
   } else if (isAnalysisRequest) {
     // Fallback for analysis requests
     textAnalysis = fullResponse;
     debugLog('Analysis Fallback', {
       usingFullResponse: true
     });
   } else {
     textAnalysis = fullResponse; // For regular chat
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
         debugLog('No JSON Found', {
           visualizationSection: jsonString
         });
       }
     } catch (e) {
       debugLog('JSON Parse Error', {
         error: e.message,
         jsonString: visualizationMatch[1]
       });
       // Create default structure for failed parsing
       if (isAnalysisRequest) {
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
     }
   } else if (isAnalysisRequest) {
     debugLog('No Visualization Section', {
       creatingDefault: true
     });
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
   // Final response
   const responseObj = {
     analysis: textAnalysis || 'No analysis available',
     visualizations: visualizations
   };
   debugLog('Final Response Object', {
     hasAnalysis: !!responseObj.analysis,
     analysisLength: responseObj.analysis.length,
     hasVisualizations: !!responseObj.visualizations,
     visualizationKeys: responseObj.visualizations ? Object.keys(responseObj.visualizations) : []
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
   return createErrorResponse('Unexpected error in edge function', 500, error instanceof Error ? error.stack : String(error), origin);
 }
});




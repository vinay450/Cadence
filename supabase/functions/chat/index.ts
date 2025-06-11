import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { Anthropic } from 'https://esm.sh/@anthropic-ai/sdk@0.18.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'); // Use service role key for database access
const supabase = createClient(supabaseUrl, supabaseKey);
// Helper function to handle CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-requested-with',
  'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
  'Access-Control-Max-Age': '86400',
  'Content-Type': 'application/json'
};
// Helper function to create response with CORS
const createCorsResponse = (body, status = 200)=>{
  return new Response(JSON.stringify(body), {
    status,
    headers: corsHeaders
  });
};
// Function to generate data summary for context
const generateDataSummary = (data)=>{
  try {
    const lines = data.split('\n').filter((line)=>line.trim());
    const headers = lines[0] || '';
    const sampleRows = lines.slice(1, 4); // First 3 data rows
    return {
      headers,
      sampleRows,
      totalRows: Math.max(0, lines.length - 1),
      summary: `Dataset with ${Math.max(0, lines.length - 1)} rows and columns: ${headers}`
    };
  } catch (error) {
    console.error('Error generating data summary:', error);
    return {
      headers: '',
      sampleRows: [],
      totalRows: 0,
      summary: 'Dataset summary unavailable'
    };
  }
};
// Function to store session data in database
const storeSessionData = async (sessionId, data, analysis)=>{
  try {
    const dataSummary = generateDataSummary(data);
    const { error } = await supabase.from('chat_sessions').upsert({
      session_id: sessionId,
      data_summary: dataSummary,
      full_data: data,
      initial_analysis: analysis,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    if (error) {
      console.error('Error storing session in database:', error);
      throw error;
    }
    console.log(`Session stored in database: ${sessionId}`);
  } catch (error) {
    console.error('Error storing session:', error);
    throw error;
  }
};
// Function to get session context from database
const getSessionContext = async (sessionId)=>{
  if (!sessionId) return null;
  try {
    console.log(`Looking for session in database: ${sessionId}`);
    const { data, error } = await supabase.from('chat_sessions').select('*').eq('session_id', sessionId).single();
    if (error) {
      console.error('Error fetching session:', error);
      return null;
    }
    if (!data) {
      console.log(`Session not found in database: ${sessionId}`);
      return null;
    }
    // Check if session is expired (1 hour)
    const sessionAge = Date.now() - new Date(data.created_at).getTime();
    if (sessionAge > 3600000) {
      console.log(`Session expired: ${sessionId}`);
      // Delete expired session
      await supabase.from('chat_sessions').delete().eq('session_id', sessionId);
      return null;
    }
    console.log(`Session found in database: ${sessionId}`);
    return {
      dataSummary: data.data_summary,
      fullData: data.full_data,
      initialAnalysis: data.initial_analysis,
      timestamp: new Date(data.created_at).getTime()
    };
  } catch (error) {
    console.error('Error getting session context:', error);
    return null;
  }
};
// Function to clean up old sessions (optional - can be called periodically)
const cleanupOldSessions = async ()=>{
  try {
    const { error } = await supabase.rpc('cleanup_old_sessions');
    if (error) {
      console.error('Error cleaning up old sessions:', error);
    } else {
      console.log('Old sessions cleaned up successfully');
    }
  } catch (error) {
    console.error('Error in cleanup function:', error);
  }
};
serve(async (req)=>{
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders
    });
  }
  try {
    console.log('Request received:', {
      method: req.method,
      url: req.url,
      origin: req.headers.get('origin')
    });
    // Validate environment variables
    const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');
    if (!anthropicApiKey) {
      console.error('ANTHROPIC_API_KEY not found');
      throw new Error('ANTHROPIC_API_KEY environment variable is not set');
    }
    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase environment variables missing:', {
        supabaseUrl: !!supabaseUrl,
        supabaseKey: !!supabaseKey
      });
      throw new Error('Supabase environment variables are not set');
    }
    // Parse request body
    let requestBody;
    try {
      requestBody = await req.json();
    } catch (e) {
      console.error('Error parsing request body:', e);
      throw new Error('Invalid JSON in request body');
    }
    const { messages, data, sessionId, isNewAnalysis } = requestBody;
    console.log('Request parsed:', {
      hasMessages: !!messages,
      messageCount: messages?.length,
      hasData: !!data,
      sessionId,
      isNewAnalysis
    });
    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey: anthropicApiKey
    });
    // Determine request type
    const isInitialAnalysis = isNewAnalysis || !!data && !sessionId;
    let systemPrompt = '';
    let contextualMessages = [
      ...messages
    ];
    if (isInitialAnalysis && data) {
      console.log('Processing initial analysis');
      // NEW ANALYSIS: Process data and store session
      systemPrompt = `You are Cadence AI, a data analyst analyzing this dataset as a researcher. 

MANDATORY: Your response MUST follow this EXACT format:

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

CRITICAL: 
- Start with exactly "---ANALYSIS---"
- End with exactly "---VISUALIZATION---" followed by valid JSON
- Use exact column names from the data
- No text after the JSON`;
      // Add data to the first message
      contextualMessages = messages.map((msg, index)=>({
          role: msg.role,
          content: index === 0 ? `${msg.content}\n\nData to analyze:\n${data}` : msg.content
        }));
    } else if (sessionId || data) {
      console.log('Processing follow-up question', {
        sessionId,
        hasData: !!data
      });
      if (data) {
        // If data is provided in follow-up, use it directly
        const dataSummary = generateDataSummary(data);
        systemPrompt = `You are Cadence AI, a data analyst. You are analyzing a dataset with the following characteristics:

DATASET CONTEXT:
- ${dataSummary.summary}
- Headers: ${dataSummary.headers}
- Sample data rows: ${dataSummary.sampleRows.join('\n')}

The user is asking questions about this dataset. You can reference the data structure. If you need to see specific data values, ask the user to clarify which aspects they want to explore further.

Respond naturally and conversationally. You don't need to use the structured format unless specifically analyzing new aspects of the data.`;
      } else {
        // Try to get session context from database
        const session = await getSessionContext(sessionId);
        if (!session) {
          console.log('Session not found, treating as new chat');
          systemPrompt = `You are Cadence AI, a helpful data analysis assistant. The user previously had a data analysis session, but the session context is no longer available. You can still help answer general questions about data analysis, but you won't have access to their specific dataset unless they provide it again.`;
        } else {
          systemPrompt = `You are Cadence AI, a data analyst. You previously analyzed a dataset with the following characteristics:

DATASET CONTEXT:
- ${session.dataSummary.summary}
- Headers: ${session.dataSummary.headers}
- Sample data rows: ${session.dataSummary.sampleRows.join('\n')}

PREVIOUS ANALYSIS SUMMARY:
${session.initialAnalysis.substring(0, 500)}${session.initialAnalysis.length > 500 ? '...' : ''}

The user is now asking follow-up questions about this dataset. You can reference the data structure and your previous analysis. If you need to see specific data values, ask the user to clarify which aspects they want to explore further.

Respond naturally and conversationally. You don't need to use the structured format unless specifically analyzing new aspects of the data.`;
        }
      }
    } else {
      console.log('Processing regular chat');
      // REGULAR CHAT: No data analysis
      systemPrompt = 'You are Cadence AI, a helpful AI assistant specializing in data analysis.';
    }
    // Make API call to Anthropic
    console.log('Calling Anthropic API');
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      system: systemPrompt,
      messages: contextualMessages,
      temperature: isInitialAnalysis ? 0.0 : 0.7
    });
    console.log('Anthropic API response received');
    const fullResponse = response.content[0].text;
    let responseObj = {};
    if (isInitialAnalysis) {
      console.log('Processing initial analysis response');
      // Parse structured analysis response
      const analysisMatch = fullResponse.match(/---ANALYSIS---([\s\S]*?)(?=---VISUALIZATION---|$)/);
      const visualizationMatch = fullResponse.match(/---VISUALIZATION---([\s\S]*)/);
      let textAnalysis = '';
      let visualizations = null;
      // Extract analysis section
      if (analysisMatch) {
        textAnalysis = analysisMatch[1].trim();
      } else {
        textAnalysis = fullResponse.trim();
      }
      // Extract visualization section
      if (visualizationMatch) {
        try {
          let jsonString = visualizationMatch[1].trim();
          // Clean any markdown formatting
          jsonString = jsonString.replace(/^```json\s*/, '').replace(/\s*```$/, '');
          jsonString = jsonString.replace(/^```\s*/, '').replace(/\s*```$/, '');
          // Find JSON object
          const jsonMatch = jsonString.match(/({[\s\S]*})/);
          if (jsonMatch) {
            visualizations = JSON.parse(jsonMatch[1]);
          }
        } catch (e) {
          console.error('Error parsing visualization JSON:', e);
        }
      }
      // Create default visualization structure if parsing failed
      if (!visualizations) {
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
      await storeSessionData(newSessionId, data, textAnalysis);
      responseObj = {
        analysis: textAnalysis || 'No analysis available',
        visualizations,
        sessionId: newSessionId,
        isNewSession: true
      };
    } else {
      console.log('Processing chat response');
      responseObj = {
        analysis: fullResponse,
        visualizations: null,
        sessionId: sessionId,
        isNewSession: false
      };
    }
    console.log('Sending response:', {
      hasAnalysis: !!responseObj.analysis,
      sessionId: responseObj.sessionId
    });
    return createCorsResponse(responseObj);
  } catch (error) {
    console.error('Error in chat function:', error);
    return createCorsResponse({
      error: error.message,
      details: error.stack,
      timestamp: new Date().toISOString()
    }, 500);
  }
});

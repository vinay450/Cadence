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
// Function to create comprehensive dataset context for chat
const createChatDatasetContext = (data, chatAnalysis)=>{
  const dataSummary = generateDataSummary(data);
  return {
    structure: dataSummary,
    chatAnalysis: chatAnalysis,
    summary: `This dataset contains ${dataSummary.totalRows} rows with columns: ${dataSummary.headers}.
    
Chat Analysis Context: ${chatAnalysis.substring(0, 1500)}${chatAnalysis.length > 1500 ? '...' : ''}`
  };
};
// Function to store session data in database (for chat context)
const storeSessionData = async (sessionId, data, chatAnalysis)=>{
  try {
    const chatContext = createChatDatasetContext(data, chatAnalysis);
    const { error } = await supabase.from('chat_sessions').upsert({
      session_id: sessionId,
      data_summary: chatContext,
      full_data: data,
      initial_analysis: chatAnalysis,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    if (error) {
      console.error('Error storing session in database:', error);
      throw error;
    }
    console.log(`Chat session stored in database: ${sessionId}`);
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
      chatContext: data.data_summary,
      fullData: data.full_data,
      initialAnalysis: data.initial_analysis,
      timestamp: new Date(data.created_at).getTime()
    };
  } catch (error) {
    console.error('Error getting session context:', error);
    return null;
  }
};

const VALID_MODELS = [
  'claude-3-5-haiku-20241022',
  'claude-3-5-sonnet-20241022',
  'claude-3-7-sonnet-20250219',
  'claude-opus-4-20250514'
]

interface RequestBody {
  message: string
  data?: string
  sessionId?: string
  isNewAnalysis?: boolean
  model?: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders
    })
  }

  try {
    console.log('Request received:', {
      method: req.method,
      url: req.url,
      origin: req.headers.get('origin')
    })

    // Validate environment variables
    const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY')
    if (!anthropicApiKey) {
      console.error('ANTHROPIC_API_KEY not found')
      throw new Error('ANTHROPIC_API_KEY environment variable is not set')
    }
    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase environment variables missing:', {
        supabaseUrl: !!supabaseUrl,
        supabaseKey: !!supabaseKey
      })
      throw new Error('Supabase environment variables are not set')
    }

    // Parse request body
    let requestBody
    try {
      requestBody = await req.json() as RequestBody
    } catch (e) {
      console.error('Error parsing request body:', e)
      throw new Error('Invalid JSON in request body')
    }

    const { message, data, sessionId, isNewAnalysis, model = 'claude-3-5-sonnet-20241022' } = requestBody

    // Validate model selection
    if (!VALID_MODELS.includes(model)) {
      return createCorsResponse({
        error: 'Invalid model selected'
      }, 400)
    }

    console.log('Request parsed:', {
      hasMessage: !!message,
      hasData: !!data,
      dataSize: data ? data.length : 0,
      sessionId,
      isNewAnalysis,
      model
    })

    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey: anthropicApiKey
    })

    // Determine request type
    let systemPrompt = ''
    let contextualMessages = [
      {
        role: 'user',
        content: message
      }
    ]
    let shouldStoreSession = false

    console.log('Request type determination:', {
      isNewAnalysis,
      hasData: !!data,
      hasSessionId: !!sessionId
    })

    if (isNewAnalysis && data) {
      console.log('Processing INITIAL ANALYSIS - will store in database')
      // INITIAL ANALYSIS: Analyze and store in database
      systemPrompt = `You are Cadence AI, a data analyst analyzing this dataset as a researcher. 

The user has uploaded a dataset for analysis. Analyze the provided dataset thoroughly.

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
- No text after the JSON

DATASET TO ANALYZE:
${data}`
      shouldStoreSession = true
    } else if (sessionId) {
      console.log('Processing FOLLOW-UP CHAT with existing session')
      // FOLLOW-UP CHAT: Use stored session context
      const session = await getSessionContext(sessionId)
      if (!session) {
        console.log('Session not found, treating as new chat')
        systemPrompt = `You are Cadence AI, a helpful data analysis assistant. The user previously had a data analysis session, but the session context is no longer available. You can still help answer general questions about data analysis, but you won't have access to their specific dataset unless they provide it again.`
      } else {
        console.log('Session found, using stored chat context')
        systemPrompt = `You are Cadence AI, a data analyst. You have access to a dataset context from your previous analysis:

${session.chatContext.summary}

PREVIOUS CHAT ANALYSIS:
${session.initialAnalysis}

The user is asking follow-up questions about this dataset. You have comprehensive context about the data structure, patterns, and insights. Reference specific findings from your analysis to provide detailed, accurate responses.

Respond naturally and conversationally based on your knowledge of this dataset.`
      }
    } else {
      console.log('Processing regular chat - no dataset context')
      systemPrompt = 'You are Cadence AI, a helpful AI assistant specializing in data analysis.'
    }

    // Make API call to Anthropic
    console.log('Calling Anthropic API with:', {
      systemPromptLength: systemPrompt.length,
      messagesCount: contextualMessages.length,
      totalMessageLength: contextualMessages.reduce((sum, msg) => sum + msg.content.length, 0),
      estimatedTotalTokens: Math.ceil((systemPrompt.length + contextualMessages.reduce((sum, msg) => sum + msg.content.length, 0)) / 4),
      model
    })

    const response = await anthropic.messages.create({
      model,
      max_tokens: 4096,
      system: systemPrompt,
      messages: contextualMessages,
      temperature: isNewAnalysis ? 0.0 : 0.7
    })

    console.log('Anthropic API response received')
    console.log('Token usage:', {
      inputTokens: response.usage?.input_tokens || 'unknown',
      outputTokens: response.usage?.output_tokens || 'unknown',
      totalTokens: (response.usage?.input_tokens || 0) + (response.usage?.output_tokens || 0)
    })

    const fullResponse = response.content[0].text
    let responseObj = {}

    if (isNewAnalysis) {
      console.log('Processing initial analysis response - STORING in database')
      // Parse structured analysis response
      const analysisMatch = fullResponse.match(/---ANALYSIS---([\s\S]*?)(?=---VISUALIZATION---|$)/)
      const visualizationMatch = fullResponse.match(/---VISUALIZATION---([\s\S]*)/)
      let textAnalysis = ''
      let visualizations = null

      // Extract analysis section
      if (analysisMatch) {
        textAnalysis = analysisMatch[1].trim()
      } else {
        textAnalysis = fullResponse.trim()
      }

      // Extract visualization section
      if (visualizationMatch) {
        try {
          let jsonString = visualizationMatch[1].trim()
          jsonString = jsonString.replace(/^```json\s*/, '').replace(/\s*```$/, '')
          jsonString = jsonString.replace(/^```\s*/, '').replace(/\s*```$/, '')
          const jsonMatch = jsonString.match(/({[\s\S]*})/)
          if (jsonMatch) {
            visualizations = JSON.parse(jsonMatch[1])
          }
        } catch (e) {
          console.error('Error parsing visualization JSON:', e)
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
        }
      }

      // Store session in database
      const newSessionId = crypto.randomUUID()
      await storeSessionData(newSessionId, data, textAnalysis)
      responseObj = {
        analysis: textAnalysis || 'No analysis available',
        visualizations,
        sessionId: newSessionId,
        isNewSession: true
      }
    } else {
      console.log('Processing regular chat response')
      responseObj = {
        analysis: fullResponse,
        visualizations: null,
        sessionId: sessionId,
        isNewSession: false
      }
    }

    console.log('Sending response:', {
      hasAnalysis: !!responseObj.analysis,
      sessionId: responseObj.sessionId,
      isNewSession: responseObj.isNewSession
    })

    return createCorsResponse(responseObj)
  } catch (error) {
    console.error('Error in chat function:', error)
    return createCorsResponse({
      error: error.message,
      details: error.stack,
      timestamp: new Date().toISOString()
    }, 500)
  }
})

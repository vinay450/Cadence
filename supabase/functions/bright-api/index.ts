import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { Anthropic } from 'https://esm.sh/@anthropic-ai/sdk@0.18.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { messages } = await req.json()

    // If this is an initial data analysis request
    if (messages.length === 1 && messages[0].content.includes('You are a data analysis expert')) {
      // The prompt is already formatted correctly, just pass it through
      const anthropic = new Anthropic({
        apiKey: Deno.env.get('ANTHROPIC_API_KEY'),
      })

      const response = await anthropic.messages.create({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 4096,
        messages: messages,
        temperature: 0.7, // Add some creativity for insights while maintaining accuracy
      })

      const content = response.content[0]
      if ('text' in content) {
        return new Response(
          JSON.stringify({ analysis: content.text }),
          {
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json',
            },
          }
        )
      }
    } else {
      // For follow-up questions, use the default handling
      const anthropic = new Anthropic({
        apiKey: Deno.env.get('ANTHROPIC_API_KEY'),
      })

      const response = await anthropic.messages.create({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 4096,
        messages: messages,
      })

      const content = response.content[0]
      if ('text' in content) {
        return new Response(
          JSON.stringify({ analysis: content.text }),
          {
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json',
            },
          }
        )
      }
    }

    return new Response(
      JSON.stringify({ error: 'Unexpected response format' }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )
  }
}) 
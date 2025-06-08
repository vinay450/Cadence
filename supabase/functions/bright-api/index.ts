import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { Anthropic } from 'npm:@anthropic-ai/sdk@0.18.0'

interface RequestBody {
  messages: Array<{
    role: string;
    content: string;
  }>;
}

serve(async (req: Request) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers });
  }

  try {
    const apiKey = Deno.env.get('ANTHROPIC_API_KEY');
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY environment variable is not set');
    }

    const anthropic = new Anthropic({
      apiKey,
    });

    const body: RequestBody = await req.json();

    if (!body.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
      throw new Error('Invalid request body: messages array is required');
    }

    // Check if the message contains CSV data
    const firstMessage = body.messages[0].content;
    if (firstMessage.includes('Please analyze this csv data:')) {
      // Extract the CSV data between the markers
      const csvData = firstMessage.split('\n\n')[1];
      if (!csvData) {
        throw new Error('No CSV data found in the message');
      }

      // Add specific instructions for CSV analysis
      body.messages[0].content = `You are a data analysis expert. Please analyze this CSV data and provide insights:\n\n${csvData}\n\nPlease provide:\n1. A summary of the data structure\n2. Key statistics and patterns\n3. Any notable insights or anomalies\n4. Potential correlations between variables`;
    }

    const completion = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 4000,
      messages: body.messages,
    });

    if (!completion.content || !completion.content[0] || !completion.content[0].text) {
      throw new Error('Unexpected response format from Claude API');
    }

    const responseBody = {
      analysis: completion.content[0].text,
      usage: {
        input_tokens: completion.usage.input_tokens,
        output_tokens: completion.usage.output_tokens,
      },
    };

    return new Response(
      JSON.stringify(responseBody),
      {
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Edge Function error:', err.message);
    
    return new Response(
      JSON.stringify({ 
        error: err.message,
        details: 'Please check that all required environment variables are set and try again.'
      }),
      {
        status: 500,
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
      }
    );
  }
}); 
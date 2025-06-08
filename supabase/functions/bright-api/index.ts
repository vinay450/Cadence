import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { Anthropic } from '@anthropic-ai/sdk'

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
    const anthropic = new Anthropic({
      apiKey: Deno.env.get('ANTHROPIC_API_KEY') || '',
    });

    const body: RequestBody = await req.json();

    const completion = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 4000,
      messages: body.messages,
    });

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
    return new Response(
      JSON.stringify({ error: err.message }),
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
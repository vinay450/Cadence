import { supabase } from '@/lib/supabase';
import type { ChatMessage } from '@/lib/claude';

export async function POST(request: Request) {
  try {
    const { messages, data: dataContent } = await request.json();

    let allMessages = messages;
    if (dataContent) {
      allMessages = [
        {
          role: 'user',
          content: `Context about the data:\n${dataContent}`,
        },
        ...messages,
      ];
    }

    // Get the user's session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return new Response(JSON.stringify({ error: 'No active session' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { data, error } = await supabase.functions.invoke('bright-api', {
      body: { messages: allMessages },
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (error) throw error;

    return new Response(JSON.stringify({
      analysis: data.analysis || 'No response received',
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in chat API:', error);
    return new Response(JSON.stringify({
      error: 'An error occurred during the chat',
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 
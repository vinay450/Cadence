import { supabase } from '@/lib/supabase';

export const getApiKey = async (): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('bright_api')
      .select('api_key')
      .single();

    if (error) {
      console.error('Error fetching API key:', error);
      return null;
    }

    return data?.api_key || null;
  } catch (error) {
    console.error('Error in getApiKey:', error);
    return null;
  }
}; 
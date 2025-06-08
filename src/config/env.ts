export const config = {
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  },
  anthropic: {
    apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  },
  isDevelopment: import.meta.env.DEV,
} as const;

export const isConfigValid = () => {
  const missingVars: string[] = [];

  if (!config.supabase.url) missingVars.push('VITE_SUPABASE_URL');
  if (!config.supabase.anonKey) missingVars.push('VITE_SUPABASE_ANON_KEY');
  if (!config.anthropic.apiKey) missingVars.push('VITE_ANTHROPIC_API_KEY');

  if (missingVars.length > 0) {
    console.warn('Missing environment variables:', missingVars.join(', '));
    return false;
  }

  return true;
}; 
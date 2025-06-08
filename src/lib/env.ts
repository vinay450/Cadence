// Environment variable verification
export const verifyEnvironment = () => {
  const envVariables = {
    VITE_API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    VITE_BACKEND_API_KEY: import.meta.env.VITE_BACKEND_API_KEY,
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
  };

  const missingKeys = [];
  if (!envVariables.VITE_BACKEND_API_KEY) missingKeys.push('VITE_BACKEND_API_KEY');
  if (!envVariables.VITE_SUPABASE_URL) missingKeys.push('VITE_SUPABASE_URL');
  if (!envVariables.VITE_SUPABASE_ANON_KEY) missingKeys.push('VITE_SUPABASE_ANON_KEY');

  if (missingKeys.length > 0) {
    console.warn('Some environment variables are missing:', missingKeys.join(', '));
    console.warn('Some features may be disabled or not work correctly.');
  }

  console.debug('Environment Variables Status:', {
    hasBackendApiKey: !!envVariables.VITE_BACKEND_API_KEY,
    hasSupabaseUrl: !!envVariables.VITE_SUPABASE_URL,
    hasSupabaseKey: !!envVariables.VITE_SUPABASE_ANON_KEY,
    apiUrl: envVariables.VITE_API_URL,
    allEnvKeys: Object.keys(import.meta.env),
  });

  return {
    variables: envVariables,
    missingKeys,
    isFullyConfigured: missingKeys.length === 0
  };
}; 
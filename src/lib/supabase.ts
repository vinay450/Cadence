import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

// Default values for development
const SUPABASE_URL = 'https://awuibcrmituuaailkrdl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3dWliY3JtaXR1dWFhaWxrcmRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk5MjA0NzcsImV4cCI6MjAyNTQ5NjQ3N30.RqOyoXZ_1UoFnYwsOAJeqNwFNe_z_5YlDO-_h0JQZL4';

// Create Supabase client with fallback to default values
export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
); 
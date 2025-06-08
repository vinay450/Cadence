import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

// Get the Supabase URL and key with fallbacks
const supabaseUrl = 'https://awuibcrmituuaailkrdl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3dWliY3JtaXR1dWFhaWxrcmRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk5MjA0NzcsImV4cCI6MjAyNTQ5NjQ3N30.RqOyoXZ_1UoFnYwsOAJeqNwFNe_z_5YlDO-_h0JQZL4';

// Create Supabase client
export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey
); 
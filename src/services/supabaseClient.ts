import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Check if environment variables are properly configured
if (!supabaseUrl || supabaseUrl === 'your_supabase_url' || !supabaseUrl.startsWith('https://')) {
  console.error('VITE_SUPABASE_URL is not properly configured. Please set up Supabase connection.');
}

if (!supabaseAnonKey || supabaseAnonKey === 'your_supabase_anon_key') {
  console.error('VITE_SUPABASE_ANON_KEY is not properly configured. Please set up Supabase connection.');
}

// Only create client if both values are properly configured
let supabase: any = null;

if (supabaseUrl && supabaseUrl !== 'your_supabase_url' && supabaseUrl.startsWith('https://') && 
    supabaseAnonKey && supabaseAnonKey !== 'your_supabase_anon_key') {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.warn('Supabase client not initialized due to missing or invalid configuration. Please connect to Supabase.');
}

export { supabase };
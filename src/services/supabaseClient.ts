import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Validate environment variables
if (!supabaseUrl) {
  console.error('❌ VITE_SUPABASE_URL is not set in environment variables');
}

if (!supabaseAnonKey) {
  console.error('❌ VITE_SUPABASE_ANON_KEY is not set in environment variables');
}

if (supabaseUrl && !supabaseUrl.startsWith('https://')) {
  console.error('❌ VITE_SUPABASE_URL should start with https://');
}

if (supabaseAnonKey && supabaseAnonKey.length < 50) {
  console.error('❌ VITE_SUPABASE_ANON_KEY seems too short to be valid');
}

// Check if environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are not set. Some features may not work properly.');
  console.warn('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables.');
}

console.log('Supabase Config Debug:', {
  url: supabaseUrl,
  hasKey: !!supabaseAnonKey,
  keyLength: supabaseAnonKey?.length,
  isDev: import.meta.env.DEV
});

// Only create client if environment variables are available
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce' // Use PKCE flow for better security
      }
    })
  : null;

// Log the client creation
if (supabase && import.meta.env.DEV) {
  console.log('✅ Supabase client created successfully');
} else if (!supabase) {
  console.error('❌ Failed to create Supabase client');
}
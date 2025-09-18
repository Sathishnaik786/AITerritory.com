const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
console.log('Environment variables loaded:', {
  SUPABASE_URL: process.env.SUPABASE_URL ? 'Present' : 'Missing',
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Present' : 'Missing',
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV
});

const { createClient } = require('@supabase/supabase-js');

// Use backend environment variables, not frontend ones
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

module.exports = supabase;
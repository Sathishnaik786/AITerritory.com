require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Check if Supabase credentials are available
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('⚠️  Supabase credentials not found. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your environment variables.');
  console.warn('   For development, you can create a .env file in the server directory with:');
  console.warn('   SUPABASE_URL=your_supabase_url');
  console.warn('   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key');
}

const supabase = createClient(
  process.env.SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder_key'
);

module.exports = { supabase }; 
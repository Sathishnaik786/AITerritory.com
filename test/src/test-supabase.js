// Test Supabase connection
import { createClient } from '@supabase/supabase-js';

// You need to replace these with your actual Supabase credentials
const supabaseUrl = 'https://your-project.supabase.co';
const supabaseAnonKey = 'your-anon-key';

console.log('Testing Supabase connection...');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseAnonKey ? 'Set' : 'Not set');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase credentials not configured!');
  console.log('Please set your Supabase credentials in your environment variables:');
  console.log('VITE_SUPABASE_URL=https://your-project.supabase.co');
  console.log('VITE_SUPABASE_ANON_KEY=your-anon-key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test the connection
async function testConnection() {
  try {
    console.log('🔗 Testing Supabase connection...');
    
    // Try to fetch blogs
    const { data, error } = await supabase
      .from('blogs')
      .select('id, title, slug')
      .limit(1);
    
    if (error) {
      console.error('❌ Supabase error:', error);
      return;
    }
    
    console.log('✅ Supabase connection successful!');
    console.log('📊 Blogs found:', data?.length || 0);
    console.log('📝 Sample blog:', data?.[0]);
    
  } catch (error) {
    console.error('❌ Connection failed:', error);
  }
}

testConnection(); 
const { createClient } = require('@supabase/supabase-js');

// Test Supabase connection
async function testSupabaseConnection() {
  console.log('Testing Supabase connection...\n');
  
  // Check if environment variables are set
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  console.log('Environment variables:');
  console.log('SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
  console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseKey ? '✅ Set' : '❌ Missing');
  
  if (!supabaseUrl || !supabaseKey) {
    console.log('\n❌ Missing environment variables. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    return;
  }
  
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test connection by querying blogs table
    console.log('\nTesting database connection...');
    const { data, error } = await supabase
      .from('blogs')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log('❌ Database connection failed:', error.message);
      return;
    }
    
    console.log('✅ Database connection successful');
    
    // Test blog_comments table
    console.log('\nTesting blog_comments table...');
    const { data: comments, error: commentsError } = await supabase
      .from('blog_comments')
      .select('*')
      .limit(1);
    
    if (commentsError) {
      console.log('❌ blog_comments table error:', commentsError.message);
      return;
    }
    
    console.log('✅ blog_comments table accessible');
    console.log('Comments count:', comments?.length || 0);
    
  } catch (error) {
    console.log('❌ Connection test failed:', error.message);
  }
}

testSupabaseConnection().catch(console.error); 
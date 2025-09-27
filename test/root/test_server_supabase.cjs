require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function testServerSupabase() {
  console.log('Testing server Supabase connection...\n');
  
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  console.log('Environment variables:');
  console.log('SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
  console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseKey ? '✅ Set' : '❌ Missing');
  
  if (!supabaseUrl || !supabaseKey) {
    console.log('\n❌ Missing environment variables!');
    return;
  }
  
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test blog_comments table
    console.log('\nTesting blog_comments table...');
    const { data: comments, error: commentsError } = await supabase
      .from('blog_comments')
      .select('*')
      .eq('blog_id', 'future-of-ai-recent-updates')
      .limit(5);
    
    if (commentsError) {
      console.log('❌ blog_comments query failed:', commentsError.message);
      console.log('Error details:', commentsError);
      return;
    }
    
    console.log('✅ blog_comments query successful');
    console.log('Comments found:', comments?.length || 0);
    console.log('Sample comment:', comments?.[0] || 'No comments found');
    
  } catch (error) {
    console.log('❌ Connection test failed:', error.message);
    console.log('Error details:', error);
  }
}

testServerSupabase().catch(console.error); 
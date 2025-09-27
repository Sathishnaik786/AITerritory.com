const { createClient } = require('@supabase/supabase-js');

// Test script to verify blog system setup
async function testBlogSystem() {
  console.log('🔍 Testing Blog System Setup...\n');

  // Check environment variables
  console.log('1. Checking Environment Variables:');
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.log('❌ Missing Supabase credentials in environment variables');
    console.log('   Please create server/.env file with:');
    console.log('   SUPABASE_URL=your_supabase_url');
    console.log('   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key');
    return;
  }
  
  console.log('✅ Supabase credentials found');

  // Test Supabase connection
  console.log('\n2. Testing Supabase Connection:');
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test blogs table
    const { data: blogs, error: blogsError } = await supabase
      .from('blogs')
      .select('id, title, slug')
      .limit(1);
    
    if (blogsError) {
      console.log('❌ Error accessing blogs table:', blogsError.message);
    } else {
      console.log('✅ Blogs table accessible');
      console.log(`   Found ${blogs?.length || 0} blog(s)`);
    }

    // Test blog_likes table
    const { data: likes, error: likesError } = await supabase
      .from('blog_likes')
      .select('id')
      .limit(1);
    
    if (likesError) {
      console.log('❌ Error accessing blog_likes table:', likesError.message);
      console.log('   Run the migration: database/supabase/migrations/20250101000000_create_blog_likes.sql');
    } else {
      console.log('✅ Blog_likes table accessible');
    }

    // Test blog_bookmarks table
    const { data: bookmarks, error: bookmarksError } = await supabase
      .from('blog_bookmarks')
      .select('id')
      .limit(1);
    
    if (bookmarksError) {
      console.log('❌ Error accessing blog_bookmarks table:', bookmarksError.message);
    } else {
      console.log('✅ Blog_bookmarks table accessible');
    }

    // Test blog_comments table
    const { data: comments, error: commentsError } = await supabase
      .from('blog_comments')
      .select('id')
      .limit(1);
    
    if (commentsError) {
      console.log('❌ Error accessing blog_comments table:', commentsError.message);
    } else {
      console.log('✅ Blog_comments table accessible');
    }

  } catch (error) {
    console.log('❌ Failed to connect to Supabase:', error.message);
  }

  // Test server endpoints
  console.log('\n3. Testing Server Endpoints:');
  try {
    const response = await fetch('http://localhost:3001/api/blogs');
    if (response.ok) {
      console.log('✅ Backend server is running');
    } else {
      console.log('❌ Backend server returned error:', response.status);
    }
  } catch (error) {
    console.log('❌ Backend server not running or not accessible');
    console.log('   Start it with: cd server && npm start');
  }

  console.log('\n📋 Summary:');
  console.log('If you see any ❌ errors above, fix them before testing the blog system.');
  console.log('If all tests pass ✅, your blog system should be working!');
}

// Run the test
testBlogSystem().catch(console.error); 
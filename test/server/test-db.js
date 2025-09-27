require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Test database connection
async function testDatabaseConnection() {
  console.log('🔍 Testing Database Connection...\n');

  try {
    // Check if environment variables are set
    const supabaseUrl = process.env.SUPABASE_URL || 'https://ckahkadgnaxzcfhmsdaj.supabase.co';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    console.log('Supabase URL:', supabaseUrl);
    console.log('Supabase Key exists:', !!supabaseKey);

    if (!supabaseKey) {
      console.log('❌ SUPABASE_SERVICE_ROLE_KEY not found in environment variables');
      return;
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Test 1: Check existing blogs
    console.log('\n1. Checking existing blogs...');
    const { data: blogs, error: blogsError } = await supabase
      .from('blogs')
      .select('id, title, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    if (blogsError) {
      console.log('❌ Error fetching blogs:', blogsError);
    } else {
      console.log(`✅ Found ${blogs.length} existing blogs`);
      blogs.forEach(blog => {
        console.log(`   - ${blog.title} (ID: ${blog.id})`);
      });
    }

    // Test 2: Try to insert a test blog
    console.log('\n2. Testing blog insertion...');
    const testBlog = {
      title: 'Database Test Blog',
      slug: 'database-test-blog',
      description: 'Testing database connection',
      content: '<p>Test content</p>',
      author_name: 'Test Author',
      category: 'Technology',
      tags: ['test']
    };

    const { data: insertedBlog, error: insertError } = await supabase
      .from('blogs')
      .insert(testBlog)
      .select()
      .single();

    if (insertError) {
      console.log('❌ Error inserting blog:', insertError);
      console.log('Error details:', insertError.details);
      console.log('Error hint:', insertError.hint);
    } else {
      console.log('✅ Blog inserted successfully!');
      console.log('Inserted blog ID:', insertedBlog.id);
      
      // Clean up: Delete the test blog
      const { error: deleteError } = await supabase
        .from('blogs')
        .delete()
        .eq('id', insertedBlog.id);

      if (deleteError) {
        console.log('⚠️  Warning: Could not delete test blog:', deleteError);
      } else {
        console.log('✅ Test blog cleaned up');
      }
    }

  } catch (error) {
    console.log('❌ Database connection error:', error.message);
  }
}

testDatabaseConnection(); 
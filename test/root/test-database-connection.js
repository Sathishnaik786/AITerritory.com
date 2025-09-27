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

    // Test 1: Check if blogs table exists
    console.log('\n1. Checking blogs table...');
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'blogs');

    if (tablesError) {
      console.log('❌ Error checking tables:', tablesError);
    } else {
      console.log('✅ Blogs table exists');
    }

    // Test 2: Check blogs table structure
    console.log('\n2. Checking blogs table structure...');
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_schema', 'public')
      .eq('table_name', 'blogs')
      .order('ordinal_position');

    if (columnsError) {
      console.log('❌ Error checking columns:', columnsError);
    } else {
      console.log('✅ Blogs table columns:');
      columns.forEach(col => {
        console.log(`   ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
      });
    }

    // Test 3: Check existing blogs
    console.log('\n3. Checking existing blogs...');
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

    // Test 4: Try to insert a test blog
    console.log('\n4. Testing blog insertion...');
    const testBlog = {
      title: 'Database Test Blog',
      description: 'Testing database connection',
      content: '<p>Test content</p>',
      author_name: 'Test Author',
      category: 'Technology',
      tags: ['test'],
      published: false
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
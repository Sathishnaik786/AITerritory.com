require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase URL or key in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDatabase() {
  console.log('🧪 Testing database connection and tables...');

  try {
    // Test 1: Check if we can connect to Supabase
    console.log('1. Testing Supabase connection...');
    const { data: testData, error: testError } = await supabase
      .from('tools')
      .select('id, name')
      .limit(1);

    if (testError) {
      console.error('❌ Cannot connect to Supabase:', testError);
      return;
    }
    console.log('✅ Supabase connection successful');

    // Test 2: Check if likes table exists
    console.log('2. Checking if likes table exists...');
    const { data: likesData, error: likesError } = await supabase
      .from('likes')
      .select('*')
      .limit(1);

    if (likesError) {
      if (likesError.code === '42P01') {
        console.log('❌ Likes table does not exist');
        console.log('📝 Please run the SQL commands in your Supabase SQL Editor:');
        console.log(`
          CREATE TABLE IF NOT EXISTS public.likes (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            tool_id uuid REFERENCES tools(id) ON DELETE CASCADE,
            user_id uuid,
            created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
          );
        `);
      } else {
        console.error('❌ Error checking likes table:', likesError);
      }
    } else {
      console.log('✅ Likes table exists');
    }

    // Test 3: Check if shares table exists
    console.log('3. Checking if shares table exists...');
    const { data: sharesData, error: sharesError } = await supabase
      .from('shares')
      .select('*')
      .limit(1);

    if (sharesError) {
      if (sharesError.code === '42P01') {
        console.log('❌ Shares table does not exist');
        console.log('📝 Please run the SQL commands in your Supabase SQL Editor:');
        console.log(`
          CREATE TABLE IF NOT EXISTS public.shares (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            tool_id uuid REFERENCES tools(id) ON DELETE CASCADE,
            user_id uuid,
            created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
          );
        `);
      } else {
        console.error('❌ Error checking shares table:', sharesError);
      }
    } else {
      console.log('✅ Shares table exists');
    }

    // Test 4: Get a real tool ID for testing
    console.log('4. Getting a real tool ID for testing...');
    const { data: tools, error: toolsError } = await supabase
      .from('tools')
      .select('id, name')
      .limit(1);

    if (toolsError || !tools || tools.length === 0) {
      console.error('❌ No tools found in database');
      return;
    }

    const testToolId = tools[0].id;
    console.log(`✅ Found tool: ${tools[0].name} (ID: ${testToolId})`);

    // Test 5: Test like count API
    console.log('5. Testing like count API...');
    const { data: likeCount, error: likeCountError } = await supabase
      .from('likes')
      .select('*', { count: 'exact', head: true })
      .eq('tool_id', testToolId);

    if (likeCountError) {
      console.error('❌ Error getting like count:', likeCountError);
    } else {
      console.log(`✅ Like count for tool ${testToolId}: ${likeCount || 0}`);
    }

    // Test 6: Test adding a like
    console.log('6. Testing adding a like...');
    const { data: newLike, error: addLikeError } = await supabase
      .from('likes')
      .insert([
        {
          tool_id: testToolId,
          user_id: null // Anonymous like for testing
        }
      ])
      .select()
      .single();

    if (addLikeError) {
      console.error('❌ Error adding like:', addLikeError);
    } else {
      console.log('✅ Successfully added like:', newLike.id);
      
      // Clean up test like
      await supabase
        .from('likes')
        .delete()
        .eq('id', newLike.id);
      console.log('✅ Cleaned up test like');
    }

    console.log('\n🎉 Database tests completed!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testDatabase(); 
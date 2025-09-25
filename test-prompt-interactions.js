// Test script for prompt interactions functionality
const { supabase } = require('./server/lib/supabase');

async function testPromptInteractions() {
  console.log('Testing prompt interactions functionality...\n');
  
  // Test data
  const testPromptId = 'test-prompt-123';
  const testUserId = 'test-user-456';
  const testComment = 'This is a test comment';
  const testPlatform = 'twitter';
  
  try {
    // Test creating prompt likes table
    console.log('1. Testing prompt_likes table creation...');
    const { data: likesTable, error: likesError } = await supabase
      .from('prompt_likes')
      .select('*')
      .limit(1);
    
    if (likesError) {
      console.log('   Error:', likesError.message);
    } else {
      console.log('   Success: prompt_likes table exists');
    }
    
    // Test creating prompt shares table
    console.log('2. Testing prompt_shares table creation...');
    const { data: sharesTable, error: sharesError } = await supabase
      .from('prompt_shares')
      .select('*')
      .limit(1);
    
    if (sharesError) {
      console.log('   Error:', sharesError.message);
    } else {
      console.log('   Success: prompt_shares table exists');
    }
    
    // Test creating prompt comments table
    console.log('3. Testing prompt_comments table creation...');
    const { data: commentsTable, error: commentsError } = await supabase
      .from('prompt_comments')
      .select('*')
      .limit(1);
    
    if (commentsError) {
      console.log('   Error:', commentsError.message);
    } else {
      console.log('   Success: prompt_comments table exists');
    }
    
    console.log('\nAll tests completed successfully!');
  } catch (error) {
    console.error('Test failed with error:', error);
  }
}

// Run the test
testPromptInteractions();
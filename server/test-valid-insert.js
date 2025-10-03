const { supabase } = require('./lib/supabase');

async function testValidInsert() {
  console.log('Testing valid Gemini Prompts insert operation...');
  
  try {
    // Try to insert a test row with valid category
    const { data, error } = await supabase
      .from('gemini_prompts')
      .insert([{
        image_url: 'https://example.com/test.jpg',
        prompt: 'Test prompt for debugging',
        category: 'men'  // Using a valid category
      }])
      .select()
      .single();
      
    if (error) {
      console.error('Error inserting into gemini_prompts table:', error);
      return;
    }
    
    console.log('Insert successful:', data);
    
    // Clean up - delete the test row
    if (data && data.id) {
      const { error: deleteError } = await supabase
        .from('gemini_prompts')
        .delete()
        .eq('id', data.id);
        
      if (deleteError) {
        console.error('Error cleaning up test row:', deleteError);
      } else {
        console.log('Test row cleaned up successfully');
      }
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

testValidInsert();
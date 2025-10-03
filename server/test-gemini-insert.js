const { supabase } = require('./lib/supabase');

async function testGeminiInsert() {
  console.log('Testing Gemini Prompts insert operation...');
  
  try {
    // Try to insert a test row
    const { data, error } = await supabase
      .from('gemini_prompts')
      .insert([{
        image_url: 'https://example.com/test.jpg',
        prompt: 'Test prompt for debugging',
        category: 'test',
        submitted_via: 'web_form',
        submitter_name: 'Test User',
        submitter_email: 'test@example.com',
        status: 'draft'
      }])
      .select()
      .single();
      
    if (error) {
      console.error('Error inserting into gemini_prompts table:', error);
      return;
    }
    
    console.log('Insert successful:', data);
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

testGeminiInsert();
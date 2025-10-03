const { supabase } = require('./lib/supabase');

async function testSimpleInsert() {
  console.log('Testing simple Gemini Prompts insert operation...');
  
  try {
    // Try to insert a test row with only the columns we know exist
    const { data, error } = await supabase
      .from('gemini_prompts')
      .insert([{
        image_url: 'https://example.com/test.jpg',
        prompt: 'Test prompt for debugging',
        category: 'test'
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

testSimpleInsert();
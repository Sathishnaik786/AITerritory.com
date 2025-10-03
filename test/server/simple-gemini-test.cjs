const { supabase } = require('../../server/lib/supabase');

async function testCRUDOperations() {
  console.log('Testing Gemini Prompts CRUD Operations...');
  
  // Test creating a new prompt
  console.log('1. Creating a new Gemini prompt...');
  const { data: createdData, error: createError } = await supabase
    .from('gemini_prompts')
    .insert([{
      prompt: 'Test prompt for CRUD operations',
      category: 'all',
      image_url: null,
      submitted_via: 'test',
      status: 'published'
    }])
    .select()
    .single();

  if (createError) {
    console.error('Create Error:', createError);
    return;
  }
  
  console.log('Created:', createdData);
  const testPromptId = createdData.id;
  
  // Test updating a prompt
  console.log('2. Updating the Gemini prompt...');
  const { data: updatedData, error: updateError } = await supabase
    .from('gemini_prompts')
    .update({
      prompt: 'Updated test prompt',
      category: 'men'
    })
    .eq('id', testPromptId)
    .select()
    .single();

  if (updateError) {
    console.error('Update Error:', updateError);
    return;
  }
  
  console.log('Updated:', updatedData);
  
  // Test deleting a prompt
  console.log('3. Deleting the Gemini prompt...');
  const { error: deleteError } = await supabase
    .from('gemini_prompts')
    .delete()
    .eq('id', testPromptId);

  if (deleteError) {
    console.error('Delete Error:', deleteError);
    return;
  }
  
  console.log('Deleted successfully!');
  console.log('All tests passed!');
}

// Run the test
testCRUDOperations().catch(console.error);
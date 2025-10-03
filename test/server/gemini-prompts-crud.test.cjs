const { supabase } = require('../../server/lib/supabase');

describe('Gemini Prompts CRUD Operations', () => {
  let testPromptId;

  // Test creating a new prompt
  it('should create a new Gemini prompt', async () => {
    const { data, error } = await supabase
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

    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.prompt).toBe('Test prompt for CRUD operations');
    expect(data.category).toBe('all');
    
    testPromptId = data.id;
  });

  // Test updating a prompt
  it('should update an existing Gemini prompt', async () => {
    const { data, error } = await supabase
      .from('gemini_prompts')
      .update({
        prompt: 'Updated test prompt',
        category: 'men'
      })
      .eq('id', testPromptId)
      .select()
      .single();

    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.prompt).toBe('Updated test prompt');
    expect(data.category).toBe('men');
  });

  // Test deleting a prompt
  it('should delete a Gemini prompt', async () => {
    const { error } = await supabase
      .from('gemini_prompts')
      .delete()
      .eq('id', testPromptId);

    expect(error).toBeNull();
  });
});
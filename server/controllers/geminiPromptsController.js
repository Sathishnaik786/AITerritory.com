const { supabase } = require('../lib/supabase');

// GET /api/gemini-prompts
exports.getAllGeminiPrompts = async (req, res) => {
  console.log('Fetching all Gemini prompts from Supabase');
  
  const { data, error } = await supabase
    .from('gemini_prompts')
    .select('*')
    .order('created_at', { ascending: false });
    
  console.log('Supabase query result:', { 
    data: data ? data.length : 0, 
    error: error ? error.message : null 
  });
  
  if (error) {
    console.error('Supabase error:', error);
    return res.status(500).json({ error: error.message });
  }
  
  // Log some sample data to see what we're getting
  if (data && data.length > 0) {
    console.log('Sample prompts:');
    data.slice(0, 5).forEach((prompt, index) => {
      console.log(`${index + 1}. ID: ${prompt.id}, Category: ${prompt.category}, Image URL: ${prompt.image_url}`);
    });
  }
  
  // Send raw data without deepStringify
  res.json(data);
};

// POST /api/gemini-prompts
exports.createGeminiPrompt = async (req, res) => {
  const { image_url, prompt, category } = req.body;
  console.log('Creating new Gemini prompt:', { image_url, prompt, category });
  
  if (!prompt || !category) {
    console.log('Validation failed: prompt or category missing');
    return res.status(400).json({ error: 'Prompt and category are required.' });
  }
  
  const { data, error } = await supabase
    .from('gemini_prompts')
    .insert([{ image_url, prompt, category }])
    .select()
    .single();
    
  if (error) {
    console.error('Supabase insert error:', error);
    return res.status(500).json({ error: error.message });
  }
  
  console.log('Successfully created prompt:', data);
  res.status(201).json(data);
};
const { supabase } = require('../lib/supabase');

// GET /api/gemini-prompts
exports.getAllGeminiPrompts = async (req, res) => {
  console.log('Fetching all Gemini prompts from Supabase');
  
  // Only fetch published prompts
  const { data, error } = await supabase
    .from('gemini_prompts')
    .select('*')
    .eq('status', 'published') // Only show published prompts
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
  } else {
    console.log('No prompts found in database');
  }
  
  // Send raw data without deepStringify
  res.json(data);
};

// POST /api/gemini-prompts
exports.createGeminiPrompt = async (req, res) => {
  const { image_url, prompt, category, submitter_name, submitter_email } = req.body;
  console.log('Creating new Gemini prompt:', { image_url, prompt, category, submitter_name, submitter_email });
  
  if (!prompt || !category) {
    console.log('Validation failed: prompt or category missing');
    return res.status(400).json({ error: 'Prompt and category are required.' });
  }
  
  const { data, error } = await supabase
    .from('gemini_prompts')
    .insert([{
      image_url,
      prompt,
      category,
      submitted_via: 'web_form',
      submitter_name: submitter_name || null,
      submitter_email: submitter_email || null,
      status: 'published' // Web form submissions are published immediately
    }])
    .select()
    .single();
    
  if (error) {
    console.error('Supabase insert error:', error);
    return res.status(500).json({ error: error.message });
  }
  
  console.log('Successfully created prompt:', data);
  res.status(201).json(data);
};
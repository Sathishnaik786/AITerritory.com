const { supabase } = require('../lib/supabase');

// GET /api/gemini-prompts
exports.getAllGeminiPrompts = async (req, res) => {
  console.log('Fetching all Gemini prompts from Supabase');
  
  // Only fetch published prompts
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
  } else {
    console.log('No prompts found in database');
  }
  
  // Send raw data without deepStringify
  res.json(data);
};

// GET /api/gemini-prompts/:id - get specific prompt by ID for SEO
exports.getGeminiPromptById = async (req, res) => {
  const { id } = req.params;
  console.log(`Fetching Gemini prompt with ID: ${id}`);
  
  const { data, error } = await supabase
    .from('gemini_prompts')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    console.error('Supabase error:', error);
    return res.status(404).json({ error: 'Prompt not found' });
  }
  
  // Send prompt data
  res.json(data);
};

// GET /api/seo/gemini-prompts/:id - get SEO data for a specific prompt
exports.getSEOGeminiPromptById = async (req, res) => {
  const { id } = req.params;
  console.log(`Fetching SEO data for Gemini prompt with ID: ${id}`);
  
  // Fetch the prompt
  const { data: prompt, error } = await supabase
    .from('gemini_prompts')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    console.error('Supabase error:', error);
    return res.status(404).json({ error: 'Prompt not found' });
  }
  
  // Fetch interaction counts (likes, shares, comments)
  // For now, we'll return placeholder values as these features aren't fully implemented
  // In a real implementation, you would query your interactions table
  const likesCount = 0;
  const sharesCount = 0;
  const commentsCount = 0;
  
  // Generate SEO title based on category
  let seoTitle;
  switch (prompt.category.toLowerCase()) {
    case 'men':
      seoTitle = 'Gemini Men\'s Prompt';
      break;
    case 'women':
      seoTitle = 'Gemini Women\'s Prompt';
      break;
    case 'couple':
      seoTitle = 'Gemini Couple\'s Prompt';
      break;
    default:
      seoTitle = 'Gemini Prompt';
  }
  
  // Truncate description for SEO
  const seoDescription = prompt.prompt.length > 160 
    ? prompt.prompt.substring(0, 157) + '...' 
    : prompt.prompt;
  
  // Use prompt image or fallback to default
  const seoImage = prompt.image_url && prompt.image_url.trim() !== '' 
    ? prompt.image_url 
    : 'https://aiterritory.org/assets/og-default.png';
  
  // Send SEO data
  res.json({
    id: prompt.id,
    title: seoTitle,
    description: seoDescription,
    image_url: seoImage,
    category: prompt.category,
    created_at: prompt.created_at,
    likes: likesCount,
    shares: sharesCount,
    comments: commentsCount
  });
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
      submitter_email: submitter_email || null
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
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
  
  console.log('Sending response with', data ? data.length : 0, 'prompts');
  
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
  const { data: prompt, error: promptError } = await supabase
    .from('gemini_prompts')
    .select('*')
    .eq('id', id)
    .single();
    
  if (promptError) {
    console.error('Supabase error:', promptError);
    return res.status(404).json({ error: 'Prompt not found' });
  }
  
  console.log('Found prompt for SEO:', prompt);
  
  // Fetch interaction counts (likes, shares, comments)
  // For now, we'll return placeholder values as these features aren't fully implemented
  // In a real implementation, you would query your interactions table
  let likesCount = 0;
  let sharesCount = 0;
  let commentsCount = 0;
  
  try {
    // Try to fetch actual counts from the database
    const { count: likes, error: likesError } = await supabase
      .from('prompt_likes')
      .select('*', { count: 'exact', head: true })
      .eq('prompt_id', id);
    
    if (!likesError && likes !== null) {
      likesCount = likes;
    }
    
    const { count: shares, error: sharesError } = await supabase
      .from('prompt_shares')
      .select('*', { count: 'exact', head: true })
      .eq('prompt_id', id);
    
    if (!sharesError && shares !== null) {
      sharesCount = shares;
    }
    
    const { count: comments, error: commentsError } = await supabase
      .from('prompt_comments')
      .select('*', { count: 'exact', head: true })
      .eq('prompt_id', id);
    
    if (!commentsError && comments !== null) {
      commentsCount = comments;
    }
  } catch (interactionError) {
    console.warn('Failed to fetch interaction counts:', interactionError);
    // Use placeholder values if we can't fetch actual counts
  }
  
  // Generate SEO title based on category
  let seoTitle;
  switch (prompt.category.toLowerCase()) {
    case 'men':
      seoTitle = `Gemini Men's Prompt: ${prompt.prompt.substring(0, 50)}${prompt.prompt.length > 50 ? '...' : ''}`;
      break;
    case 'women':
      seoTitle = `Gemini Women's Prompt: ${prompt.prompt.substring(0, 50)}${prompt.prompt.length > 50 ? '...' : ''}`;
      break;
    case 'couple':
      seoTitle = `Gemini Couple's Prompt: ${prompt.prompt.substring(0, 50)}${prompt.prompt.length > 50 ? '...' : ''}`;
      break;
    default:
      seoTitle = `Gemini Prompt: ${prompt.prompt.substring(0, 50)}${prompt.prompt.length > 50 ? '...' : ''}`;
  }
  
  // Truncate description for SEO (150 characters as requested)
  const seoDescription = prompt.prompt.length > 150 
    ? prompt.prompt.substring(0, 147) + '...' 
    : prompt.prompt;
  
  // Use prompt image, fallback to dynamic OG image, or default
  const seoImage = prompt.image_url && prompt.image_url.trim() !== '' 
    ? prompt.image_url 
    : `https://aiterritory-com.onrender.com/api/og/prompts/${prompt.id}`;
  
  // Generate canonical URL
  const slug = prompt.prompt.substring(0, 50).toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '') || prompt.id;
    
  const canonicalUrl = `https://aiterritory.org/gemini-prompts/${prompt.category}/${slug}-${prompt.id}`;
  
  // Prepare SEO data
  const seoData = {
    id: prompt.id,
    title: seoTitle,
    description: seoDescription,
    image_url: seoImage,
    category: prompt.category,
    created_at: prompt.created_at,
    likes: likesCount,
    shares: sharesCount,
    comments: commentsCount,
    canonical_url: canonicalUrl
  };
  
  console.log('Sending SEO data:', seoData);
  
  // Send SEO data
  res.json(seoData);
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
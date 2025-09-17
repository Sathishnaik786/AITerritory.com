const { supabase } = require('../lib/supabase');

/**
 * Controller to handle Google Forms webhook submissions
 * This endpoint can be configured as a webhook in Google Forms
 */

// POST /api/google-forms/prompts
exports.handlePromptSubmission = async (req, res) => {
  try {
    console.log('Received Google Forms prompt submission:', req.body);
    
    // Extract data from Google Forms payload
    // Map Google Form field names to our database fields
    const { 
      'Prompt Text': prompt,
      'Category': category = 'all',
      'Image': image_url = null,
      'Your Name': submitter_name = null,
      'Email': submitter_email = null
    } = req.body;
    
    // Validate required fields
    if (!prompt) {
      return res.status(400).json({ 
        error: 'Prompt text is required' 
      });
    }
    
    // Validate category
    const validCategories = ['all', 'men', 'women', 'couple'];
    const normalizedCategory = category.toLowerCase().trim();
    if (!validCategories.includes(normalizedCategory)) {
      return res.status(400).json({ 
        error: 'Invalid category. Must be one of: all, men, women, couple' 
      });
    }
    
    // Validate image URL if provided
    if (image_url && !isValidUrl(image_url)) {
      return res.status(400).json({ 
        error: 'Invalid image URL format' 
      });
    }
    
    // Insert into database with automatic publishing
    const { data, error } = await supabase
      .from('gemini_prompts')
      .insert([{
        prompt: prompt.trim(),
        category: normalizedCategory,
        image_url: image_url,
        submitted_via: 'google_form',
        submitter_name: submitter_name,
        submitter_email: submitter_email,
        status: 'published' // Automatically publish submissions
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Database insertion error:', error);
      return res.status(500).json({ 
        error: 'Failed to save prompt submission' 
      });
    }
    
    console.log('Prompt submission saved successfully:', data);
    
    // Send success response
    res.status(201).json({
      message: 'Prompt submission received and published successfully',
      data: data
    });
    
  } catch (error) {
    console.error('Error handling Google Forms submission:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
};

// POST /api/google-forms/prompts-with-file
// New endpoint to handle file uploads
exports.handlePromptSubmissionWithFile = async (req, res) => {
  try {
    console.log('Received Google Forms prompt submission with file:', req.body);
    
    // Extract data from form payload
    const { 
      'Prompt Text': prompt,
      'Category': category = 'all',
      'Your Name': submitter_name = null,
      'Email': submitter_email = null
    } = req.body;
    
    let image_url = null;
    
    // Handle file upload if present
    if (req.file) {
      // Upload file to Supabase storage
      const fileName = `${Date.now()}_${req.file.originalname}`;
      const { data, error } = await supabase
        .storage
        .from('images')
        .upload(`prompts/${fileName}`, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: false
        });
      
      if (error) {
        console.error('File upload error:', error);
        return res.status(500).json({ 
          error: 'Failed to upload image file' 
        });
      }
      
      // Get public URL for the uploaded file
      const { data: { publicUrl } } = supabase
        .storage
        .from('images')
        .getPublicUrl(`prompts/${fileName}`);
      
      image_url = publicUrl;
    }
    
    // Validate required fields
    if (!prompt) {
      return res.status(400).json({ 
        error: 'Prompt text is required' 
      });
    }
    
    // Validate category
    const validCategories = ['all', 'men', 'women', 'couple'];
    const normalizedCategory = category.toLowerCase().trim();
    if (!validCategories.includes(normalizedCategory)) {
      return res.status(400).json({ 
        error: 'Invalid category. Must be one of: all, men, women, couple' 
      });
    }
    
    // Insert into database with automatic publishing
    const { data, error: dbError } = await supabase
      .from('gemini_prompts')
      .insert([{
        prompt: prompt.trim(),
        category: normalizedCategory,
        image_url: image_url,
        submitted_via: 'google_form',
        submitter_name: submitter_name,
        submitter_email: submitter_email,
        status: 'published' // Automatically publish submissions
      }])
      .select()
      .single();
    
    if (dbError) {
      console.error('Database insertion error:', dbError);
      return res.status(500).json({ 
        error: 'Failed to save prompt submission' 
      });
    }
    
    console.log('Prompt submission saved successfully:', data);
    
    // Send success response
    res.status(201).json({
      message: 'Prompt submission received and published successfully',
      data: data
    });
    
  } catch (error) {
    console.error('Error handling Google Forms submission with file:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
};

// Helper function to validate URLs
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

// GET /api/google-forms/prompts/test
// Test endpoint to verify the route is working
exports.testEndpoint = async (req, res) => {
  res.json({ 
    message: 'Google Forms prompt submission endpoint is working',
    timestamp: new Date().toISOString()
  });
};
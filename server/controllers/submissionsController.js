const supabase = require('../config/database');
const { sendEmail } = require('../lib/resend');
const { sanitizeText } = require('../lib/sanitizeHtml');

// Generic function to get submissions
const getSubmissions = (tableName) => async (req, res) => {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error(`Error fetching ${tableName}:`, error);
      throw error;
    }

    res.status(200).json(data);
  } catch (error) {
    console.error(`Error in getSubmissions for ${tableName}:`, error);
    res.status(500).json({ error: error.message });
  }
};

// POST: Contact Us Form Submission
const submitContactUs = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['name', 'email', 'message'],
        received: { name, email, message }
      });
    }

    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeText(String(name).trim().slice(0, 255)),
      email: sanitizeText(String(email).trim().slice(0, 255)),
      message: sanitizeText(String(message).trim().slice(0, 2000))
    };

    const { data, error } = await supabase
      .from('contact_us')
      .insert([sanitizedData])
      .select()
      .single();

    if (error) {
      console.error('Contact Us submission error:', error);
      throw error;
    }

    res.status(201).json({ 
      success: true, 
      message: 'Contact form submitted successfully',
      data 
    });
  } catch (error) {
    console.error('Contact Us submission error:', error);
    res.status(500).json({ 
      error: 'Failed to submit contact form',
      details: error.message 
    });
  }
};

// POST: Advertise Request Form Submission
const submitAdvertiseRequest = async (req, res) => {
  try {
    const { name, email, company, message } = req.body;
    
    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['name', 'email', 'message'],
        received: { name, email, company, message }
      });
    }

    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeText(String(name).trim().slice(0, 255)),
      email: sanitizeText(String(email).trim().slice(0, 255)),
      company: company ? sanitizeText(String(company).trim().slice(0, 255)) : null,
      message: sanitizeText(String(message).trim().slice(0, 2000))
    };

    const { data, error } = await supabase
      .from('advertise_requests')
      .insert([sanitizedData])
      .select()
      .single();

    if (error) {
      console.error('Advertise request submission error:', error);
      throw error;
    }

    res.status(201).json({ 
      success: true, 
      message: 'Advertise request submitted successfully',
      data 
    });
  } catch (error) {
    console.error('Advertise request submission error:', error);
    res.status(500).json({ 
      error: 'Failed to submit advertise request',
      details: error.message 
    });
  }
};

// POST: Tool Submission Form
const submitTool = async (req, res) => {
  try {
    const { email, tool_name, tool_url, youtube_url } = req.body;
    // Validation
    if (!email || !tool_name || !tool_url) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['email', 'tool_name', 'tool_url'],
        received: { email, tool_name, tool_url, youtube_url }
      });
    }
    // Validate URL format
    try {
      new URL(tool_url);
      if (youtube_url) new URL(youtube_url);
    } catch (urlError) {
      return res.status(400).json({ 
        error: 'Invalid URL format' 
      });
    }
    // Sanitize inputs
    const sanitizedData = {
      email: sanitizeText(String(email).trim().slice(0, 255)),
      tool_name: sanitizeText(String(tool_name).trim().slice(0, 255)),
      tool_url: sanitizeText(String(tool_url).trim().slice(0, 500)),
      youtube_url: youtube_url ? sanitizeText(String(youtube_url).trim().slice(0, 500)) : null,
    };
    const { data, error } = await supabase
      .from('tool_submissions')
      .insert([sanitizedData])
      .select()
      .single();
    if (error) {
      console.error('Tool submission error:', error);
      throw error;
    }
    res.status(201).json({ 
      success: true, 
      message: 'Tool submitted successfully',
      data 
    });
  } catch (error) {
    console.error('Tool submission error:', error);
    res.status(500).json({ 
      error: 'Failed to submit tool',
      details: error.message 
    });
  }
};

// POST: Feature Request Form Submission
const submitFeatureRequest = async (req, res) => {
  try {
    const { name, email, feature, details } = req.body;
    
    // Validation
    if (!name || !email || !feature) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['name', 'email', 'feature'],
        received: { name, email, feature, details }
      });
    }

    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeText(String(name).trim().slice(0, 255)),
      email: sanitizeText(String(email).trim().slice(0, 255)),
      feature: sanitizeText(String(feature).trim().slice(0, 255)),
      details: details ? sanitizeText(String(details).trim().slice(0, 2000)) : null
    };

    const { data, error } = await supabase
      .from('feature_requests')
      .insert([sanitizedData])
      .select()
      .single();

    if (error) {
      console.error('Feature request submission error:', error);
      throw error;
    }

    res.status(201).json({ 
      success: true, 
      message: 'Feature request submitted successfully',
      data 
    });
  } catch (error) {
    console.error('Feature request submission error:', error);
    res.status(500).json({ 
      error: 'Failed to submit feature request',
      details: error.message 
    });
  }
};

// DELETE: Tool Submission by ID
const deleteToolSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('tool_submissions')
      .delete()
      .eq('id', id);
    if (error) {
      if (error.code === 'PGRST116') {
        // Not found
        return res.status(404).json({ error: 'Submission not found' });
      }
      throw error;
    }
    return res.status(204).send();
  } catch (error) {
    console.error('Delete tool submission error:', error);
    res.status(500).json({ error: 'Failed to delete tool submission', details: error.message });
  }
};

// PATCH: Update status (approve/reject) for tool submission
const updateToolSubmissionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    const { data, error } = await supabase
      .from('tool_submissions')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    if (error) {
      return res.status(500).json({ error: 'Failed to update status', details: error.message });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Update tool submission status error:', error);
    res.status(500).json({ error: 'Failed to update status', details: error.message });
  }
};

module.exports = {
  // GET methods for admin viewing
  getContactSubmissions: getSubmissions('contact_us'),
  getAdvertiseSubmissions: getSubmissions('advertise_requests'),
  getToolSubmissions: getSubmissions('submitted_tools'),
  getFeatureRequests: getSubmissions('feature_requests'),
  
  // POST methods for form submissions
  submitContactUs,
  submitAdvertiseRequest,
  submitTool,
  submitFeatureRequest,
  deleteToolSubmission,
  updateToolSubmissionStatus,
}; 
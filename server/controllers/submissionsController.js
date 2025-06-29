const supabase = require('../config/database');

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
      name: String(name).trim().slice(0, 255),
      email: String(email).trim().slice(0, 255),
      message: String(message).trim().slice(0, 2000)
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
      name: String(name).trim().slice(0, 255),
      email: String(email).trim().slice(0, 255),
      company: company ? String(company).trim().slice(0, 255) : null,
      message: String(message).trim().slice(0, 2000)
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
    const { name, email, tool_name, tool_url, description } = req.body;
    
    // Validation
    if (!name || !email || !tool_name || !tool_url) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['name', 'email', 'tool_name', 'tool_url'],
        received: { name, email, tool_name, tool_url, description }
      });
    }

    // Validate URL format
    try {
      new URL(tool_url);
    } catch (urlError) {
      return res.status(400).json({ 
        error: 'Invalid tool URL format' 
      });
    }

    // Sanitize inputs
    const sanitizedData = {
      name: String(name).trim().slice(0, 255),
      email: String(email).trim().slice(0, 255),
      tool_name: String(tool_name).trim().slice(0, 255),
      tool_url: String(tool_url).trim().slice(0, 500),
      description: description ? String(description).trim().slice(0, 2000) : null
    };

    const { data, error } = await supabase
      .from('submitted_tools')
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
      name: String(name).trim().slice(0, 255),
      email: String(email).trim().slice(0, 255),
      feature: String(feature).trim().slice(0, 255),
      details: details ? String(details).trim().slice(0, 2000) : null
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
}; 
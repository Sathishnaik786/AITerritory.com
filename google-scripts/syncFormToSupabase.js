/**
 * Google Apps Script to automatically sync Google Form responses to Supabase
 * This script should be added to your Google Sheet that collects form responses
 */

// Configuration - Update these values with your actual settings
const CONFIG = {
  // Your Supabase project URL and API key
  SUPABASE_URL: 'https://ckahkadgnaxzcfhmsdaj.supabase.co', // Replace with your Supabase URL
  SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNrYWhrYWRnbmF4emNmaG1zZGFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEzOTQ0MzcsImV4cCI6MjAzNjk3MDQzN30.EZ26rzdG8I0Y73bJF1YNYc4TZH5qlK1N8vF5mL9dH9k', // Replace with your Supabase anon key
  
  // Supabase table name where prompts should be stored
  TABLE_NAME: 'gemini_prompts',
  
  // Column mapping - Update to match your Google Form questions and Supabase table columns
  COLUMN_MAPPING: {
    'Prompt Text': 'prompt',
    'Category': 'category',
    'Image URL': 'image_url',
    'Your Name': 'submitter_name',
    'Email': 'submitter_email'
  }
};

/**
 * Trigger function that runs when a new form response is submitted
 */
function onFormSubmit(e) {
  try {
    console.log('Form submission received');
    
    // Get the form response data
    const formResponse = e.namedValues;
    console.log('Form response data:', formResponse);
    
    // Transform the data to match Supabase table structure
    const promptData = transformFormData(formResponse);
    console.log('Transformed data:', promptData);
    
    // Insert the data into Supabase
    const result = insertIntoSupabase(promptData);
    console.log('Insert result:', result);
    
  } catch (error) {
    console.error('Error syncing form response to Supabase:', error);
  }
}

/**
 * Transform Google Form data to match Supabase table structure
 */
function transformFormData(formResponse) {
  const data = {
    // Default values
    status: 'published', // Automatically publish submissions
    submitted_via: 'google_form'
  };
  
  // Map form fields to database columns
  Object.keys(CONFIG.COLUMN_MAPPING).forEach(formField => {
    const dbColumn = CONFIG.COLUMN_MAPPING[formField];
    const formValue = formResponse[formField];
    
    if (formValue && formValue.length > 0) {
      // Handle array values (Google Forms sometimes returns arrays)
      data[dbColumn] = Array.isArray(formValue) ? formValue[0] : formValue;
    }
  });
  
  // Set default category if not provided
  if (!data.category) {
    data.category = 'all';
  }
  
  // Normalize category values
  const categoryMap = {
    'Men': 'men',
    'Women': 'women',
    'Couple': 'couple',
    'All': 'all'
  };
  
  if (data.category) {
    data.category = categoryMap[data.category] || data.category.toLowerCase();
  }
  
  return data;
}

/**
 * Insert data into Supabase database
 */
function insertIntoSupabase(data) {
  const url = `${CONFIG.SUPABASE_URL}/rest/v1/${CONFIG.TABLE_NAME}`;
  
  const payload = {
    ...data,
    created_at: new Date().toISOString()
  };
  
  console.log('Sending data to Supabase:', payload);
  
  const options = {
    method: 'post',
    headers: {
      'Authorization': `Bearer ${CONFIG.SUPABASE_KEY}`,
      'apikey': CONFIG.SUPABASE_KEY,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    payload: JSON.stringify(payload)
  };
  
  try {
    const response = UrlFetchApp.fetch(url, options);
    const responseCode = response.getResponseCode();
    const responseBody = response.getContentText();
    
    console.log('Supabase response code:', responseCode);
    console.log('Supabase response body:', responseBody);
    
    if (responseCode >= 200 && responseCode < 300) {
      return {
        success: true,
        data: JSON.parse(responseBody)
      };
    } else {
      throw new Error(`HTTP ${responseCode}: ${responseBody}`);
    }
  } catch (error) {
    console.error('Error inserting into Supabase:', error);
    throw error;
  }
}

/**
 * Test function to manually trigger the sync
 */
function testSync() {
  // This is just for testing - in real usage, the onFormSubmit trigger will be called automatically
  console.log('Test sync function called');
}
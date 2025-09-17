/**
 * Google Apps Script to automatically send form submissions to your backend
 * Add this script to your Google Form's script editor (Extensions > Apps Script)
 */

// Replace with your actual backend API endpoint
const API_ENDPOINT = 'https://aiterritory-com.onrender.com/api/gemini-prompts';
const API_KEY = 'your-api-key-here'; // If you implement API key authentication

function onSubmit(e) {
  const formResponse = e.response;
  const itemResponses = formResponse.getItemResponses();
  
  // Extract data from form responses
  let promptData = {
    prompt: '',
    category: 'all',
    image_url: '',
    submitter_name: '',
    submitter_email: ''
  };
  
  // Map form responses to our data structure
  itemResponses.forEach(response => {
    const question = response.getItem().getTitle();
    const answer = response.getResponse();
    
    switch(question.toLowerCase()) {
      case 'prompt text':
      case 'prompt':
        promptData.prompt = answer;
        break;
      case 'category':
        promptData.category = answer.toLowerCase();
        break;
      case 'image url':
      case 'image':
        promptData.image_url = answer;
        break;
      case 'submitter name':
      case 'name':
        promptData.submitter_name = answer;
        break;
      case 'email':
      case 'submitter email':
        promptData.submitter_email = answer;
        break;
    }
  });
  
  // Validate required fields
  if (!promptData.prompt) {
    console.error('Prompt text is required');
    return;
  }
  
  // Send to your backend API
  try {
    const payload = {
      prompt: promptData.prompt,
      category: promptData.category,
      image_url: promptData.image_url || null
    };
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
        // Add authentication headers if needed
        // 'Authorization': 'Bearer ' + API_KEY
      },
      payload: JSON.stringify(payload)
    };
    
    const response = UrlFetchApp.fetch(API_ENDPOINT, options);
    console.log('Prompt submitted successfully:', response.getContentText());
    
  } catch (error) {
    console.error('Error submitting prompt:', error.toString());
  }
}

// Install the trigger to run on form submission
function installTrigger() {
  ScriptApp.newTrigger('onSubmit')
    .forForm(FormApp.getActiveForm())
    .onFormSubmit()
    .create();
}

// Run this function once to set up the trigger
function setup() {
  installTrigger();
  console.log('Trigger installed successfully');
}
/**
 * Simple Google Apps Script for automatic prompt submission
 * Just replace the API_ENDPOINT with your actual backend URL
 */

// REPLACE THIS WITH YOUR ACTUAL BACKEND URL
const API_ENDPOINT = 'https://aiterritory-com.onrender.com/api/google-forms/prompts';

function onSubmit(e) {
  const formResponse = e.response;
  const itemResponses = formResponse.getItemResponses();
  
  // Create payload object
  let payload = {};
  
  // Map form responses to API fields
  itemResponses.forEach(response => {
    const question = response.getItem().getTitle();
    const answer = response.getResponse();
    
    // Map field names to match API expectations
    switch(question) {
      case 'Image URL':
        // Map "Image URL" field to "Image" expected by API
        payload['Image'] = answer;
        break;
      default:
        // Use field name as-is for other fields
        payload[question] = answer;
    }
  });
  
  // Send to your backend API
  try {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify(payload)
    };
    
    const response = UrlFetchApp.fetch(API_ENDPOINT, options);
    console.log('Prompt submitted successfully:', response.getContentText());
    
  } catch (error) {
    console.error('Error submitting prompt:', error.toString());
  }
}

// Setup function - run this once
function setup() {
  ScriptApp.newTrigger('onSubmit')
    .forForm(FormApp.getActiveForm())
    .onFormSubmit()
    .create();
  
  console.log('Trigger installed successfully!');
  console.log('Make sure you have updated the API_ENDPOINT variable with your actual backend URL');
}
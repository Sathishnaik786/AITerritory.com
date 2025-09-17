# Google Forms Integration Setup

This document provides instructions for setting up Google Forms integration with automatic prompt submission to the AITerritory platform.

## Table of Contents
1. [Google Form Setup](#google-form-setup)
2. [Manual Submission Method](#manual-submission-method)
3. [Automatic Sync to Supabase](#automatic-sync-to-supabase)
4. [Testing and Verification](#testing-and-verification)

## Google Form Setup

Create a Google Form with the following fields:

1. **Prompt Text** (Long Answer field)
   - Type: Paragraph
   - Required: Yes

2. **Category** (Multiple Choice field)
   - Type: Multiple choice
   - Options: All, Men, Women, Couple
   - Required: Yes

3. **Image URL** (Text field)
   - Type: Text
   - Required: No
   - Description: "Enter a URL to an image that represents your prompt (optional)"

4. **Your Name** (Text field)
   - Type: Text
   - Required: No

5. **Email** (Email field)
   - Type: Email
   - Required: No

## Manual Submission Method

After creating your form:

1. Click the "Send" button in Google Forms
2. Copy the form URL (should look like: `https://docs.google.com/forms/d/e/FORM_ID/viewform`)
3. Update the form URL in:
   - [src/pages/GeminiPromptsPage.tsx](file:///c:/Users/sathi/OneDrive/Desktop/AITerritory.com/src/pages/GeminiPromptsPage.tsx) - Button click handlers
   - Any other places where the form is referenced

## Automatic Sync to Supabase

To automatically sync Google Form responses to your Supabase database:

### 1. Set up Google Sheets integration

1. Open your Google Form
2. Click on "Responses" tab
3. Click the green Sheets icon to create a spreadsheet for responses
4. Note the spreadsheet URL for later use

### 2. Add the Google Apps Script

1. Open the Google Sheet that collects form responses
2. Go to Extensions > Apps Script
3. Replace the default code with the contents of [google-scripts/syncFormToSupabase.js](file:///c:/Users/sathi/OneDrive/Desktop/AITerritory.com/google-scripts/syncFormToSupabase.js)
4. Update the CONFIG section with your Supabase settings:
   ```javascript
   const CONFIG = {
     SUPABASE_URL: 'https://your-project.supabase.co',
     SUPABASE_KEY: 'your-anon-key',
     TABLE_NAME: 'gemini_prompts',
     COLUMN_MAPPING: {
       'Prompt Text': 'prompt',
       'Category': 'category',
       'Image URL': 'image_url',
       'Your Name': 'submitter_name',
       'Email': 'submitter_email'
     }
   };
   ```

### 3. Set up the trigger

1. In the Apps Script editor, click on the clock icon (Triggers)
2. Click "Add Trigger"
3. Select these options:
   - Function: `onFormSubmit`
   - Deployment: Head
   - Event type: On form submit
4. Click "Save"

### 4. Test the integration

1. Submit a test response through your Google Form
2. Check the Apps Script execution log (View > Logs)
3. Verify the data appears in your Supabase table

## Testing and Verification

1. Submit a test prompt through the Google Form
2. Check that the prompt appears in your Google Sheet
3. Verify the Apps Script executed without errors (View > Execution Log)
4. Confirm the prompt appears on your website after a refresh

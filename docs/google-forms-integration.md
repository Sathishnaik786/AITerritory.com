# Google Forms Integration for Gemini Prompts

This document explains how to set up Google Forms to collect and automatically submit Gemini prompts to your AITerritory application.

## Setting Up Google Forms

1. Go to [Google Forms](https://forms.google.com)
2. Create a new form titled "Gemini Prompts Submission"
3. Add these required fields:
   - **Prompt Text** (Long Answer)
   - **Category** (Multiple Choice: All, Men, Women, Couple)
4. Add these optional fields:
   - **Image URL** (Short Answer)
   - **Your Name** (Short Answer)
   - **Email** (Short Answer)

## Option 1: Manual Export/Import

1. After collecting responses, go to the "Responses" tab
2. Click the Google Sheets icon to export responses to a spreadsheet
3. Download the spreadsheet as CSV
4. Use a script or manual process to import the data into your Supabase database

## Option 2: Automated Integration with Google Apps Script

1. In your Google Form, go to Extensions > Apps Script
2. Replace the default code with the script from `google-scripts/submitPrompt.js`
3. Update the `API_ENDPOINT` constant with your actual backend URL:
   ```javascript
   const API_ENDPOINT = 'https://aiterritory-com.onrender.com/api/google-forms/prompts';
   ```
4. Run the `setup()` function to install the trigger
5. The script will automatically send form submissions to your backend

## Option 3: Web Form Integration

Users can also submit prompts directly through your website using the web form at `/gemini-prompts`.

## Backend API Endpoints

### Submit Prompt via Google Forms
```
POST /api/google-forms/prompts
Content-Type: application/json

{
  "prompt": "Your prompt text here",
  "category": "all",
  "image_url": "https://example.com/image.jpg",
  "submitter_name": "John Doe",
  "submitter_email": "john@example.com"
}
```

### Standard Prompt Submission
```
POST /api/gemini-prompts
Content-Type: application/json

{
  "prompt": "Your prompt text here",
  "category": "all",
  "image_url": "https://example.com/image.jpg"
}
```

## Database Schema

The prompts are stored in the `gemini_prompts` table with these additional fields:

- `submitted_via` - How the prompt was submitted ('web_form' or 'google_form')
- `submitter_name` - Name of the person who submitted the prompt
- `submitter_email` - Email of the person who submitted the prompt
- `status` - Review status ('draft', 'pending_review', 'published', 'rejected')

## Admin Interface

Admins can review pending submissions at `/admin/prompt-submissions`.

## Security Considerations

1. All submissions should be reviewed before publishing
2. Implement rate limiting to prevent spam
3. Validate all input data
4. Consider adding authentication for the Google Forms webhook endpoint
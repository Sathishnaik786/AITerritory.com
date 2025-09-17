# Google Scripts for AITerritory

This directory contains Google Apps Script files for integrating Google Forms with the AITerritory platform.

## Scripts

### 1. syncFormToSupabase.js

Automatically syncs Google Form responses to the Supabase database.

**Features:**
- Triggers automatically when a new form response is submitted
- Maps form fields to database columns
- Inserts data into Supabase with proper formatting
- Handles error logging

**Setup:**
1. Open your Google Form response spreadsheet
2. Go to Extensions > Apps Script
3. Replace the default code with this script
4. Update the CONFIG section with your settings
5. Set up a trigger for "onFormSubmit"

### 2. simpleSubmitPrompt.js

Simple script for submitting prompts directly to the backend API.

**Features:**
- Submits form data to a webhook endpoint
- Handles basic error responses
- Works with forms that have direct webhook submission

**Setup:**
1. Open your Google Form
2. Go to Extensions > Apps Script
3. Replace the default code with this script
4. Update the WEBHOOK_URL with your backend endpoint
5. Set up a trigger for "onFormSubmit"

## Configuration

Each script contains a CONFIG section that needs to be updated with your specific settings:

```javascript
const CONFIG = {
  // Your settings here
};
```

## Troubleshooting

### Script execution errors

1. Check the execution log: View > Logs
2. Verify all configuration values are correct
3. Ensure the Google Sheet has the expected column names
4. Check that your Supabase/API endpoint is accessible

### Data not appearing in database

1. Verify the trigger is properly set up
2. Check that form field names match the COLUMN_MAPPING
3. Confirm your database connection settings are correct
4. Look for any error messages in the execution log

## Security Notes

- Never commit API keys or sensitive configuration to version control
- Use environment-specific configuration for different environments
- Regularly review script permissions and access
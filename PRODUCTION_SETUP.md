# Production Setup Guide

## Critical: Replace Development Keys with Production Keys

You're currently seeing the "Using Clerk development keys in production" warning because your [.env.production](file:///C:/Users/sathi/OneDrive/Desktop/AITerritory.com/.env.production) file contains development keys. This must be fixed before deploying to production.

### Steps to Fix:

1. **Get Production Keys from Clerk Dashboard:**
   - Go to https://dashboard.clerk.com/
   - Select your application
   - Navigate to "API Keys" section
   - Copy your production "Publishable Key" and "Secret Key"

2. **Update [.env.production](file:///C:/Users/sathi/OneDrive/Desktop/AITerritory.com/.env.production):**
   ```
   # Replace these placeholder values with your actual production keys
   VITE_CLERK_PUBLISHABLE_KEY=pk_live_your_actual_production_publishable_key
   VITE_CLERK_SECRET_KEY=sk_live_your_actual_production_secret_key
   ```

3. **Update Render Environment Variables:**
   - Go to your Render dashboard
   - Navigate to your service settings
   - Add or update the environment variables:
     - `VITE_CLERK_PUBLISHABLE_KEY`: Your production publishable key
     - `VITE_CLERK_SECRET_KEY`: Your production secret key

4. **Redeploy Your Application:**
   After updating the keys, rebuild and redeploy your application.

### Why This Matters:

- Development keys have strict usage limits that will break your app in production
- Production keys are required for proper authentication functionality
- Using development keys in production is a security risk

### Additional Notes:

- Never commit actual keys to version control
- Use environment variables in your deployment platform (Render, Vercel, etc.)
- Test thoroughly after switching to production keys

## API Endpoint Issue

The 404 error for `/api/gemini-prompts/categories` suggests there might be an issue with how the API routes are being served. This could be related to:

1. The SSR server not properly proxying API requests
2. The API server not running correctly
3. CORS issues between frontend and backend

### Troubleshooting Steps:

1. Check the server logs in Render for any errors
2. Verify that the API server is starting correctly on port 3001
3. Ensure that the SSR server is properly configured to serve API requests

## Cookie Warnings

The cookie warnings are likely related to the Clerk authentication setup. Once you switch to production keys, these warnings should disappear.

## Base64 Preload Issue

The base64 encoded preload warning suggests there's still some incorrect preload configuration. This should be resolved with the updated index.html file.
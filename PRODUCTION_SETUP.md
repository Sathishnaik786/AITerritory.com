# Production Setup Guide

## Critical: Replace Development Keys with Production Keys

You're currently seeing the "Using Clerk development keys in production" warning because your environment is using development keys. This must be fixed before deploying to production.

### Steps to Fix:

1. **Get Production Keys from Clerk Dashboard:**
   - Go to https://dashboard.clerk.com/
   - Select your application
   - Navigate to "API Keys" section
   - Copy your production "Publishable Key" and "Secret Key"

2. **Update Render Environment Variables:**
   - Go to your Render dashboard
   - Navigate to your service settings
   - Update the environment variables:
     - `VITE_CLERK_PUBLISHABLE_KEY`: Your production publishable key (should start with pk_live_)
     - `VITE_CLERK_SECRET_KEY`: Your production secret key (should start with sk_live_)

3. **Redeploy Your Application:**
   After updating the keys, trigger a new deployment.

### Why This Matters:

- Development keys have strict usage limits that will break your app in production
- Production keys are required for proper authentication functionality
- Using development keys in production is a security risk

## API Server Issue

The 404 error for `/api/gemini-prompts/categories` indicates that your API server is not running correctly or not accessible.

### Current Deployment Structure:

Your Render configuration only starts the SSR server (`server/production-ssr.js`) but doesn't start the API server (`server/server.js`).

### Solution:

You need to modify your deployment to start both servers. Here are two approaches:

### Approach 1: Modify startCommand to run both servers

Update your [render.yaml](file:///C:/Users/sathi/OneDrive/Desktop/AITerritory.com/render.yaml) to use a script that starts both servers:

```yaml
services:
  - name: ai-territory
    type: web
    plan: free
    runtime: node
    buildCommand: npm run build
    startCommand: node server/start-production.js
    # ... rest of your configuration
```

Then create `server/start-production.js`:

### Approach 2: Use concurrently to run both servers

1. Install concurrently in your server directory:
   ```bash
   cd server
   npm install concurrently
   ```

2. Add a script to your server's package.json:
   ```json
   "scripts": {
     "start:prod": "concurrently \"node server.js\" \"node ../server/production-ssr.js\""
   }
   ```

3. Update your [render.yaml](file:///C:/Users/sathi/OneDrive/Desktop/AITerritory.com/render.yaml):
   ```yaml
   startCommand: npm run start:prod
   ```

## Layout Flash Issue

The "Layout was forced before the page was fully loaded" warning is related to CSS loading. This can be improved by:

1. Ensuring critical CSS is inlined in [index.html](file:///C:/Users/sathi/OneDrive/Desktop/AITerritory.com/index.html)
2. Properly configuring CSS loading order in Vite
3. Using appropriate loading indicators

## Cookie Warnings

These warnings are related to the Clerk authentication setup and should disappear once you switch to production keys.

## Next Steps

1. Get production Clerk keys from your Clerk dashboard
2. Update your Render environment variables
3. Modify your deployment setup to run both the API server and SSR server
4. Redeploy your application
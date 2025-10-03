# Deployment Guide for AI Territory

## Overview

This guide explains how to properly deploy the AI Territory application to Render. The application consists of:

1. Frontend (React with Vite)
2. Backend API (Express.js)
3. SSR Server for serving the frontend

## Deployment Process

### 1. Environment Variables

Before deploying, ensure all environment variables are properly set in your Render dashboard:

```
NODE_ENV=production
PORT=3000
VITE_CLERK_PUBLISHABLE_KEY=your_production_key
VITE_CLERK_SECRET_KEY=your_production_key
VITE_API_BASE_URL=https://your-app.onrender.com/api
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

### 2. Build Process

Render will automatically run `npm run build` which:
1. Cleans the dist directory
2. Compiles TypeScript
3. Builds the Vite frontend application

### 3. Start Process

Render will start the application using `node server/production-ssr.js` which:
1. Serves static assets from the dist directory
2. Handles SSR for the React application
3. Falls back to static serving if SSR fails

### 4. Deploying to Render

1. Push your code to the repository connected to Render
2. Render will automatically detect changes and start a new deployment
3. Monitor the build logs in the Render dashboard

## Troubleshooting

### Module Loading Issues

If you see errors like "Loading failed for the module", check:

1. Ensure the build completed successfully
2. Verify that the JavaScript file referenced in index.html exists in dist/assets/
3. Check that the PORT is correctly set (should be 3000)
4. Make sure you're using the production SSR server (server/production-ssr.js)

### File Not Found Errors

If static assets aren't loading:

1. Verify the dist directory structure after build
2. Check that express.static is correctly configured in production-ssr.js
3. Ensure the asset paths in index.html are correct

### SSR Issues

If the server-side rendering is failing:

1. Check the server logs for SSR errors
2. Verify that all dependencies are properly imported as ES modules
3. Ensure the App component can be rendered server-side

## Local Testing

To test the production setup locally:

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production SSR server:
   ```bash
   npm run ssr:prod
   ```

3. Visit http://localhost:3000 to test

## Common Issues and Solutions

### 1. "require is not defined" Errors

This happens when CommonJS modules are used in an ES module environment. Ensure:
- All server files use ES module syntax (import/export)
- No require() statements in .js files in the src directory
- Use dynamic imports for modules that only work in browser environments

### 2. CSS Loading Issues

To prevent FOUC (Flash of Unstyled Content):
- Critical CSS is included in index.html
- Proper loading indicators are shown during initialization
- CSS files are properly preloaded

### 3. Clerk Authentication Issues

Ensure you're using production keys, not development keys:
- Development keys have strict rate limits
- Production keys are required for proper authentication
- Keys should be set as environment variables, not hardcoded
# Simplified Deployment Guide

## Overview

This guide explains the new simplified deployment setup for AI Territory. We've removed SSR completely and are now using a simple static file server.

## Architecture

1. **Frontend**: React app built with Vite
2. **Backend**: Express.js API server (in the `server` directory)
3. **Deployment**: Static files served by a simple Express server

## Deployment Process

### 1. Build Process

Render will automatically run `npm run build` which:
1. Cleans the dist directory
2. Compiles TypeScript
3. Builds the Vite frontend application

### 2. Start Process

Render will start the application using `npm start` which runs `node server.js`:
1. Serves static assets from the dist directory
2. Handles client-side routing by serving index.html for all routes

### 3. Deploying to Render

1. Push your code to the repository connected to Render
2. Render will automatically detect changes and start a new deployment
3. Monitor the build logs in the Render dashboard

## Why This Fixes the "require is not defined" Error

The "require is not defined" error was caused by CommonJS code from `react-comments-section` making it into the browser bundle. By removing SSR entirely and using a simple static file server:

1. We eliminate the complex SSR setup that was causing module conflicts
2. We ensure all code runs in the browser environment where dynamic imports work correctly
3. We simplify the deployment process to reduce potential issues

## Troubleshooting

### Module Loading Issues

If you see "Loading failed for the module" errors:

1. Run `npm run build:clean` to clear all caches
2. Check that the referenced JavaScript files actually exist in dist/assets/
3. Ensure your browser cache is cleared

### Authentication Issues

If Clerk authentication isn't working:

1. Verify that `VITE_CLERK_PUBLISHABLE_KEY` is set in Render environment variables
2. Ensure you're using production keys, not development keys
3. Check the browser console for specific error messages

### API Issues

If API calls are failing:

1. Verify that `VITE_API_BASE_URL` is set correctly in Render environment variables
2. Check that the backend server is running and accessible
3. Ensure CORS is properly configured

## Local Testing

To test the production setup locally:

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the simple server:
   ```bash
   npm start
   ```

3. Visit http://localhost:3000 to test

## Benefits of This Approach

1. **Simpler deployment**: No complex SSR setup to maintain
2. **Better performance**: Static files are served more efficiently
3. **Fewer errors**: Eliminates SSR-related module conflicts
4. **Easier debugging**: Less complexity means fewer things that can go wrong
5. **Faster builds**: No SSR compilation step needed

## File Structure

After deployment, your application will have this structure:
```
/
├── dist/                 # Built frontend files
│   ├── assets/           # JavaScript, CSS, images
│   └── index.html        # Main HTML file
├── server/               # Backend API server
└── server.js             # Simple static file server
```

The `server.js` file serves static files from `dist/` and handles client-side routing.
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
   VITE_CLERK_PUBLISHABLE_KEY=your_actual_production_publishable_key
   VITE_CLERK_SECRET_KEY=your_actual_production_secret_key
   ```

3. **Redeploy Your Application:**
   After updating the keys, rebuild and redeploy your application.

### Why This Matters:

- Development keys have strict usage limits that will break your app in production
- Production keys are required for proper authentication functionality
- Using development keys in production is a security risk

### Additional Notes:

- Never commit actual keys to version control
- Use environment variables in your deployment platform (Render, Vercel, etc.)
- Test thoroughly after switching to production keys

## Cookie Warnings

The cookie warnings are likely related to the Clerk authentication setup. Once you switch to production keys, these warnings should disappear.

## Initial Load Issues

The changes made to [index.html](file:///C:/Users/sathi/OneDrive/Desktop/AITerritory.com/index.html) and [main.tsx](file:///C:/Users/sathi/OneDrive/Desktop/AITerritory.com/src/main.tsx) should help with the initial loading problem:
- Added better FOUC (Flash of Unstyled Content) prevention
- Improved error handling for hydration issues
- Added loading indicators for better UX
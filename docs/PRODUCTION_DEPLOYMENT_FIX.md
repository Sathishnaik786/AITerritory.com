# Production Server Deployment Fix

## Issue Identified

The production server is returning 404 errors for all `/api/interactions` endpoints because:

1. **Wrong start command**: `render.yaml` was trying to start `server/ssr.js` (which doesn't exist)
2. **Missing environment variables**: Production server needs Supabase credentials
3. **Outdated deployment**: The server hasn't been redeployed with the latest code

## Fixes Applied

### 1. Fixed `render.yaml`
- ✅ Changed `startCommand` from `node server/ssr.js` to `node server/server.js`
- ✅ Added required environment variables:
  - `SUPABASE_URL`: https://ckahkadgnaxzcfhmsdaj.supabase.co
  - `SUPABASE_SERVICE_ROLE_KEY`: (needs to be set in Render dashboard)
  - `PORT`: 3001
  - `ENABLE_REDIS`: false

### 2. Database Schema
- ✅ All tables exist: `blog_likes`, `blog_bookmarks`, `blog_comments`, `blog_events`
- ✅ Correct schemas with proper RLS policies
- ✅ `blog_events` has correct `user_id` as `text`

## Next Steps

### Step 1: Set Environment Variables in Render
1. Go to your Render dashboard
2. Navigate to your `ai-territory` service
3. Go to "Environment" tab
4. Add the `SUPABASE_SERVICE_ROLE_KEY`:
   - Key: `SUPABASE_SERVICE_ROLE_KEY`
   - Value: Your Supabase service role key (from Supabase dashboard)

### Step 2: Redeploy the Server
1. In Render dashboard, go to "Manual Deploy"
2. Click "Deploy latest commit"
3. Wait for deployment to complete

### Step 3: Test the Endpoints
After deployment, test these endpoints:
- `GET /api/interactions/blogs/future-of-ai-recent-updates/likes/count`
- `GET /api/interactions/blogs/future-of-ai-recent-updates/bookmarks/count`
- `GET /api/blogs/future-of-ai-recent-updates/comments/threaded`

## Expected Results

After fixing the deployment:
- ✅ All `/api/interactions` endpoints will return 200 instead of 404
- ✅ Blog likes, bookmarks, and comments will work properly
- ✅ Blog events tracking will work without 400 errors
- ✅ All interaction features will function correctly

## Files Modified

1. `render.yaml` - Fixed start command and added environment variables
2. `PRODUCTION_DEPLOYMENT_FIX.md` - This summary

## Notes

- The local development server works fine
- The database schema is correct
- The API routes are properly configured
- The issue is specifically with the production deployment
- Once redeployed with correct environment variables, all functionality should work 
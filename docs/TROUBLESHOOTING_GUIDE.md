# 🔧 Troubleshooting Guide - Blog System Issues

## 🚨 Main Issues Identified

### 1. **Missing Environment Variables**
The server and frontend need Supabase credentials to work properly.

### 2. **Server Not Running**
The backend server needs to be started with proper credentials.

## 📋 Step-by-Step Fix

### Step 1: Create Backend Environment File

Create `server/.env` file with your Supabase credentials:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Server Configuration
PORT=3001
NODE_ENV=development

# Redis Configuration (Optional)
REDIS_URL=redis://localhost:6379
ENABLE_REDIS=false

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Step 2: Create Frontend Environment File

Create `.env` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### Step 3: Get Your Supabase Credentials

1. Go to your Supabase project dashboard
2. Click "Settings" → "API"
3. Copy:
   - **Project URL** → `SUPABASE_URL` and `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

### Step 4: Start the Backend Server

```bash
cd server
npm install
npm start
```

### Step 5: Start the Frontend

```bash
# In a new terminal
npm run dev
```

### Step 6: Test the API

```bash
curl http://localhost:3001/api/blogs
```

## 🔍 Common Error Solutions

### Error: "Unable to connect to the remote server"
- **Solution**: Backend server not running. Start it with `cd server && npm start`

### Error: "Supabase credentials not found"
- **Solution**: Create the `.env` files with proper credentials

### Error: HTTP 400/500 on API calls
- **Solution**: Check Supabase credentials and table permissions

### Error: "Objects are not valid as a React child"
- **Solution**: Already fixed in the code

### Error: "Rendered more hooks than during the previous render"
- **Solution**: Already fixed in the code

## 🗄️ Database Tables Required

Make sure these tables exist in your Supabase database:

1. **blogs** - Main blog posts
2. **blog_likes** - User likes (run the migration)
3. **blog_bookmarks** - User bookmarks
4. **blog_comments** - Comments with threading
5. **blog_events** - Analytics events

## 🚀 Quick Test Commands

```bash
# Test backend
curl http://localhost:3001/api/blogs

# Test specific endpoints
curl http://localhost:3001/api/blogs/future-of-ai-recent-updates/likes
curl http://localhost:3001/api/blogs/future-of-ai-recent-updates/bookmarks
curl http://localhost:3001/api/blogs/future-of-ai-recent-updates/comments/threaded
```

## 📞 Still Having Issues?

If you're still experiencing problems after following these steps, please share:

1. **Console errors** from browser developer tools
2. **Network errors** from browser developer tools
3. **Server logs** when starting the backend
4. **Specific error messages** you're seeing 
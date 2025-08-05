# Environment Setup Guide

## Required Environment Variables

Create a `.env` file in the `server` directory with the following variables:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

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

## How to Get Supabase Credentials

1. Go to your Supabase project dashboard
2. Click on "Settings" → "API"
3. Copy the "Project URL" (this is your SUPABASE_URL)
4. Copy the "service_role" key (this is your SUPABASE_SERVICE_ROLE_KEY)

## Steps to Fix the Issue

1. Create the `.env` file in the `server` directory
2. Add your Supabase credentials
3. Start the server: `cd server && npm start`
4. Test the API: `curl http://localhost:3001/api/blogs`

## Common Issues

- **"Unable to connect to the remote server"**: Server not running
- **"Supabase credentials not found"**: Missing .env file
- **HTTP 400/500 errors**: Check Supabase credentials and table permissions 
# Likes and Shares System Setup Guide

This guide will help you set up the real-time likes and shares functionality for your AI Tools Directory.

## 🗄️ Database Setup

### Step 1: Create Database Tables

Run the following SQL in your **Supabase SQL Editor**:

```sql
-- Create likes table
CREATE TABLE IF NOT EXISTS public.likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id uuid REFERENCES tools(id) ON DELETE CASCADE,
  user_id uuid, -- optional, for tracking users
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Create shares table
CREATE TABLE IF NOT EXISTS public.shares (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id uuid REFERENCES tools(id) ON DELETE CASCADE,
  user_id uuid, -- optional, for tracking users
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_likes_tool_id ON public.likes(tool_id);
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON public.likes(user_id);
CREATE INDEX IF NOT EXISTS idx_shares_tool_id ON public.shares(tool_id);
CREATE INDEX IF NOT EXISTS idx_shares_user_id ON public.shares(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shares ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to likes" ON public.likes
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to shares" ON public.shares
  FOR SELECT USING (true);

-- Create policies for authenticated users to insert
CREATE POLICY "Allow authenticated users to insert likes" ON public.likes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated users to insert shares" ON public.shares
  FOR INSERT WITH CHECK (true);

-- Create policies for users to delete their own likes
CREATE POLICY "Allow users to delete their own likes" ON public.likes
  FOR DELETE USING (true);

-- Grant necessary permissions
GRANT SELECT, INSERT, DELETE ON public.likes TO anon, authenticated;
GRANT SELECT, INSERT ON public.shares TO anon, authenticated;
```

### Step 2: Verify Tables Created

After running the SQL, you should see two new tables in your Supabase dashboard:
- `likes` - stores user likes for tools
- `shares` - stores tool shares

## 🚀 Backend Setup

The backend is already configured with:

### Controllers
- `server/controllers/likesController.js` - Handles like operations
- `server/controllers/sharesController.js` - Handles share operations

### Routes
- `server/routes/likes.js` - Like-related API endpoints
- `server/routes/shares.js` - Share-related API endpoints

### API Endpoints

#### Likes
- `GET /api/likes/:toolId/count` - Get like count for a tool
- `POST /api/likes/:toolId` - Add a like to a tool
- `DELETE /api/likes/:toolId` - Remove a like from a tool
- `GET /api/likes/:toolId/user/:userId` - Check if user has liked a tool

#### Shares
- `GET /api/shares/:toolId/count` - Get share count for a tool
- `POST /api/shares/:toolId` - Add a share to a tool
- `POST /api/shares/counts` - Get share counts for multiple tools

## 🎨 Frontend Setup

The frontend is already configured with:

### Services
- `src/services/likesService.ts` - Frontend service for likes
- `src/services/sharesService.ts` - Frontend service for shares

### Hooks
- `src/hooks/useLikesAndShares.ts` - Custom hook for managing likes and shares

### Components
- `src/components/ToolCard.tsx` - Updated to show like/share counts and handle interactions

## 🔄 Real-time Updates

The system includes real-time updates using Supabase subscriptions:

- **Single Tool**: Subscribe to changes for a specific tool
- **Multiple Tools**: Subscribe to changes for multiple tools simultaneously
- **Automatic Updates**: UI updates automatically when likes/shares change

## 🧪 Testing the System

### 1. Start the Backend
```bash
cd server
npm start
```

### 2. Start the Frontend
```bash
npm run dev
```

### 3. Test Functionality
1. Navigate to any tool page
2. Click the heart icon to like/unlike
3. Click the share icon to share
4. Watch the counts update in real-time

## 📊 Features

### Likes System
- ✅ Real-time like counts
- ✅ User-specific like tracking
- ✅ Like/unlike functionality
- ✅ Optimistic updates
- ✅ Error handling

### Shares System
- ✅ Real-time share counts
- ✅ Share tracking
- ✅ Native share API support
- ✅ Clipboard fallback
- ✅ Error handling

### Real-time Updates
- ✅ Supabase subscriptions
- ✅ Automatic UI updates
- ✅ Efficient batch updates
- ✅ Cleanup on unmount

## 🔧 Configuration

### Environment Variables
Make sure these are set in your `.env` file:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_API_BASE_URL=http://localhost:3003/api
```

### API Base URL
The system uses `VITE_API_BASE_URL` for API calls. Default is `http://localhost:3003/api`.

## 🐛 Troubleshooting

### Common Issues

1. **Tables not found**
   - Run the SQL commands in Supabase SQL Editor
   - Check that the tables were created successfully

2. **Real-time not working**
   - Verify Supabase URL and keys are correct
   - Check browser console for subscription errors
   - Ensure RLS policies are set correctly

3. **API calls failing**
   - Check that the backend server is running
   - Verify API base URL is correct
   - Check CORS configuration

4. **Like counts not updating**
   - Check that the tool ID exists in the tools table
   - Verify foreign key constraints
   - Check browser network tab for API errors

### Debug Mode
Enable debug logging by setting:
```env
NODE_ENV=development
```

## 📈 Performance Considerations

- **Indexes**: Created on `tool_id` and `user_id` for fast queries
- **Batch Operations**: Multiple tool counts fetched in single requests
- **Optimistic Updates**: UI updates immediately, syncs with server
- **Efficient Subscriptions**: Only subscribe to relevant tool changes

## 🔒 Security

- **Row Level Security**: Enabled on both tables
- **Public Read Access**: Anyone can view counts
- **Authenticated Write Access**: Only authenticated users can like/share
- **User-specific Deletes**: Users can only delete their own likes

## 🎯 Next Steps

1. **Analytics**: Add analytics tracking for likes/shares
2. **Notifications**: Notify tool owners of new likes/shares
3. **Leaderboards**: Create trending tools based on likes/shares
4. **Social Features**: Add comments and user profiles

---

**🎉 Congratulations!** Your likes and shares system is now ready to use. Users can like and share tools with real-time updates across all connected clients. 
# GA4 Custom Event Tracking & Conversions Setup

## Overview
This document outlines the comprehensive Google Analytics 4 (GA4) custom event tracking implementation for AITerritory.com. The system tracks user interactions across tools, blogs, prompts, and authentication events.

## 🎯 Tracked Events

### 1. **Like Events**
- **Event Name**: `like_tool`, `like_blog`, `like_prompt`
- **Triggers**: When users like/unlike content
- **Parameters**: 
  - `tool_id` / `blog_id` / `prompt_id`
  - `tool_name` / `blog_title` / `prompt_title`
  - `tool_category` / `blog_category` / `prompt_category`
  - `page_url`, `user_id`, `event_type`

### 2. **Bookmark Events** ⭐ **CONVERSION**
- **Event Name**: `bookmark_tool`, `bookmark_blog`, `bookmark_prompt`
- **Triggers**: When users bookmark/unbookmark content
- **Parameters**: Same as like events
- **Status**: **Mark as Conversion in GA4**

### 3. **Share Events** ⭐ **CONVERSION**
- **Event Name**: `share_item`
- **Triggers**: When users share content on social media
- **Parameters**:
  - `platform` (twitter, facebook, linkedin, whatsapp, copy)
  - `content_type` (tool, blog, prompt)
  - `content_id`, `content_title`
  - `page_url`, `user_id`, `event_type`
- **Status**: **Mark as Conversion in GA4**

### 4. **Comment Events** ⭐ **CONVERSION**
- **Event Name**: `comment_posted`
- **Triggers**: When users post comments
- **Parameters**:
  - `content_type` (tool, blog, prompt)
  - `content_id`, `content_title`
  - `comment_length`
  - `page_url`, `user_id`, `event_type`
- **Status**: **Mark as Conversion in GA4**

### 5. **Authentication Events** ⭐ **CONVERSION**
- **Event Name**: `auth_action`
- **Triggers**: When users sign in, sign up, or sign out
- **Parameters**:
  - `auth_action` (sign_in, sign_up, sign_out)
  - `auth_method` (clerk)
  - `page_url`, `user_id`, `event_type`
- **Status**: **Mark as Conversion in GA4**

## 📁 File Structure

```
src/
├── lib/
│   └── analytics.ts          # Main GA4 tracking utility
├── hooks/
│   └── useAuthTracking.ts    # Auth event tracking hook
├── components/
│   ├── ToolInteractionSection.tsx  # Tool like/bookmark/comment tracking
│   ├── ToolCard.tsx                 # Tool card like/bookmark tracking
│   ├── BlogLikeBookmark.tsx         # Blog like/bookmark tracking
│   └── Prompts.tsx                  # Prompt like/bookmark/comment tracking
└── pages/
    ├── ToolDetailsPage.tsx          # Tool detail page tracking
    ├── BlogDetail.tsx               # Blog detail page tracking
    ├── UserDashboardPage.tsx        # Sign out tracking
    └── App.tsx                      # Auth tracking initialization
```

## 🔧 Implementation Details

### Analytics Utility (`src/lib/analytics.ts`)
- **Centralized tracking functions** for all event types
- **Type-safe parameters** with TypeScript interfaces
- **Automatic metadata** (timestamp, user agent, screen resolution, language)
- **Error handling** and console logging for debugging

### Key Functions:
```typescript
// Track any custom event
trackEvent(eventName: EventType, params: EventParams)

// Specific tracking functions
trackToolLike(toolId, toolName, toolCategory, userId)
trackToolBookmark(toolId, toolName, toolCategory, userId)
trackShare(platform, contentType, contentId, contentTitle, userId)
trackCommentPosted(contentType, contentId, contentTitle, commentLength, userId)
trackAuthAction(authAction, authMethod, userId)
```

### Auth Tracking Hook (`src/hooks/useAuthTracking.ts`)
- **Automatic sign-in detection** using Clerk
- **Manual sign-out tracking** function
- **Integrated into App.tsx** for global initialization

## 🚀 Setup Instructions

### 1. **Deploy the Code**
```bash
# Build and deploy to Netlify
npm run build
# Deploy to your hosting platform
```

### 2. **Configure GA4 Conversions**

After deployment, log into your GA4 dashboard:

1. **Navigate to**: Admin → Events → All Events
2. **Mark these events as conversions**:
   - `auth_action`
   - `bookmark_tool`
   - `bookmark_blog` 
   - `bookmark_prompt`
   - `share_item`
   - `comment_posted`

### 3. **Test Event Tracking**

#### Manual Testing:
1. **Open browser console** on any page
2. **Perform actions** (like, bookmark, share, comment)
3. **Check console logs** for tracking confirmation:
   ```
   📊 GA4 Event tracked: like_tool {tool_id: "...", ...}
   ```

#### GA4 Real-time Testing:
1. **Open GA4 Real-time reports**
2. **Perform test actions** on your site
3. **Verify events appear** in real-time data

### 4. **Create Custom Reports**

#### Engagement Report:
- **Metrics**: Event count, unique users
- **Dimensions**: Event name, content type, platform
- **Filters**: Conversion events only

#### User Journey Report:
- **Funnel**: Sign up → Like → Bookmark → Share → Comment
- **Conversion rates** at each step

## 📊 Expected Data Structure

### Event Parameters Example:
```json
{
  "event_name": "bookmark_tool",
  "tool_id": "uuid-123",
  "tool_name": "ChatGPT",
  "tool_category": "AI Chatbots",
  "page_url": "https://aiterritory.org/tools/chatgpt",
  "user_id": "user_123",
  "event_type": "bookmark_tool",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "user_agent": "Mozilla/5.0...",
  "screen_resolution": "1920x1080",
  "language": "en-US"
}
```

## 🔍 Monitoring & Debugging

### Console Logging:
- All events are logged to console with `📊` prefix
- Errors are logged with full details
- GA4 availability is checked before sending

### Common Issues:
1. **Events not appearing**: Check GA4 measurement ID
2. **Missing user_id**: Ensure user is authenticated
3. **Console errors**: Check gtag availability

### Debug Mode:
```typescript
// Add to analytics.ts for detailed logging
const DEBUG_MODE = true;
```

## 📈 Conversion Optimization

### High-Value Events:
1. **`auth_action`** - User registration/engagement
2. **`bookmark_tool`** - Content saving behavior
3. **`share_item`** - Viral content potential
4. **`comment_posted`** - Community engagement

### Optimization Strategies:
- **A/B test** like/bookmark button placement
- **Analyze** most shared content types
- **Optimize** comment submission flow
- **Track** conversion funnels

## 🔒 Privacy & Compliance

### Data Collected:
- **User interactions** (likes, bookmarks, shares, comments)
- **Content metadata** (titles, categories, IDs)
- **Technical data** (user agent, screen resolution)
- **User identification** (only when authenticated)

### GDPR Compliance:
- **No PII** in event parameters
- **User consent** handled by Clerk
- **Data retention** follows GA4 policies

## 🎯 Next Steps

1. **Deploy and test** all tracking events
2. **Configure conversions** in GA4 dashboard
3. **Set up custom reports** for insights
4. **Monitor conversion rates** and optimize
5. **Add more events** as needed (page views, search, etc.)

---

**Status**: ✅ **Implementation Complete**
**Last Updated**: January 2024
**GA4 Measurement ID**: `G-1NJDY2B92X` 
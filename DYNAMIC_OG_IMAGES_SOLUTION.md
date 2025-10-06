# Dynamic and Unique OG Images Solution for AITerritory.org

## Problem Statement
When sharing prompts and blogs on social media platforms, the dynamic and unique OG images are not being generated properly. This results in generic images being used instead of content-specific images.

## Root Cause Analysis
1. **Missing SEO Data Integration**: The sharing functionality is not properly using the SEO data that includes dynamic OG images.
2. **Incorrect Image URLs**: The image URLs being passed to social platforms might not be properly formatted or accessible.
3. **Cache Issues**: Cached data might be preventing fresh SEO data from being fetched.
4. **Platform-Specific Sharing Parameters**: Different social platforms require different parameters for image sharing.

## Solution Implementation

### 1. Enhanced OG Image Generation (Backend)

The server-side OG image generation has been implemented for both prompts and blogs:

#### For Prompts (`/api/og/prompts/:id`)
- Fetches prompt data from Supabase
- Uses existing image_url if available
- Generates dynamic image with category-specific colors if no image exists
- Caches images for 1 year

#### For Blogs (`/api/og/blogs/:slug`)
- Fetches blog data from Supabase
- Uses existing cover_image_url if available
- Generates dynamic image with gradient background if no image exists
- Includes blog title, author, and category in the image
- Caches images for 1 year

### 2. SEO Data Integration (Frontend)

#### For Blog Sharing (BlogLayout.tsx)
```typescript
// Fetch SEO data for sharing
useEffect(() => {
  const fetchSEOData = async () => {
    try {
      const data = await BlogService.getSEODataBySlug(slug);
      setSeoData(data);
    } catch (error) {
      console.warn('Failed to fetch SEO data for sharing:', error);
    }
  };
  
  if (slug) {
    fetchSEOData();
  }
}, [slug]);

// Use SEO data in sharing
const handleShare = (platform: SharePlatform) => {
  // Use SEO data if available, otherwise fallback to props
  const shareTitle = seoData?.title || title;
  const shareDescription = seoData?.description || description || title;
  const shareImage = seoData?.image_url || coverImage;
  // ... rest of sharing logic
};
```

#### For Prompt Sharing (PromptDetailsPage.tsx)
```typescript
// Fetch SEO data for the prompt
useEffect(() => {
  const fetchSEOData = async () => {
    const actualId = extractId(id);
    if (!actualId) return;

    try {
      const data: SEOData = await getSEOGeminiPromptById(actualId);
      setSeoData(data);
    } catch (error) {
      console.error('Failed to fetch SEO data:', error);
    }
  };

  if (id) {
    fetchSEOData();
  }
}, [id]);

// Use SEO data in sharing
<ShareButton
  url={window.location.href}
  title={seoData?.title || prompt?.prompt.substring(0, 100) || 'AI Prompt'}
  description={`Check out this AI prompt in the ${prompt?.category} category`}
  image={seoData?.image_url || prompt?.image_url || undefined}
  variant="dropdown"
/>
```

### 3. Enhanced ShareButton Component

The ShareButton component has been updated to properly handle image URLs for different platforms:

```typescript
const SHARE_PLATFORMS = [
  {
    name: 'twitter',
    icon: FaXTwitter,
    label: 'Twitter',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    url: (data: ShareData) => 
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(data.url)}&text=${encodeURIComponent(data.title)}&via=aiterritory`
  },
  {
    name: 'facebook',
    icon: FaFacebook,
    label: 'Facebook',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    url: (data: ShareData) => 
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(data.url)}${data.image ? `&picture=${encodeURIComponent(data.image)}` : ''}`
  },
  // ... other platforms
];
```

### 4. Proper Image URL Handling

#### For Prompts:
1. Use existing `image_url` from database if available
2. Fallback to dynamic OG image: `https://aiterritory-com.onrender.com/api/og/prompts/${prompt.id}`
3. Final fallback to default image: `/og-default.png`

#### For Blogs:
1. Use existing `cover_image_url` from database if available
2. Fallback to dynamic OG image: `https://aiterritory-com.onrender.com/api/og/blogs/${blog.slug}`
3. Final fallback to default image: `/og-default.png`

## Testing Procedure

### 1. Manual Testing
1. Navigate to a blog post: `/blog/sample-blog-slug`
2. Click the share button
3. Share on different platforms (Twitter, Facebook, LinkedIn, etc.)
4. Verify that the correct OG image appears in the share preview
5. Repeat for a prompt: `/gemini-prompts/category/sample-prompt-id`
6. Check that prompt-specific images are used

### 2. Automated Testing
Run the test script:
```bash
node test-og-images.js
```

### 3. Social Media Debugger Tools
Use these tools to verify OG image generation:
- Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/
- Twitter Card Validator: https://cards-dev.twitter.com/validator
- LinkedIn Post Inspector: https://www.linkedin.com/post-inspector/

## Troubleshooting Guide

### Issue: Generic Image Appears Instead of Dynamic One
**Solution**: 
1. Check that the SEO data is being fetched correctly
2. Verify the image URL in the SEO data is accessible
3. Clear browser cache and try again
4. Check server logs for OG image generation errors

### Issue: Image Not Loading on Social Platforms
**Solution**:
1. Ensure the image URL is publicly accessible (not localhost)
2. Check that the image URL uses HTTPS
3. Verify the image dimensions (recommended: 1200x630 pixels)
4. Confirm the Content-Type header is set correctly (image/png or image/jpeg)

### Issue: Cache Problems
**Solution**:
1. Clear the browser cache
2. Clear the service worker cache
3. Reduce the cache TTL in blogService.ts
4. Use incognito mode for testing

## Best Practices

1. **Image Optimization**: Ensure all OG images are properly sized (1200x630 pixels recommended)
2. **Error Handling**: Always provide fallback images
3. **Caching**: Use appropriate cache headers for performance
4. **Accessibility**: Include alt text for all images
5. **SEO**: Include all relevant meta tags for social platforms

## Verification Checklist

- [ ] OG images are generated dynamically for prompts
- [ ] OG images are generated dynamically for blogs
- [ ] SEO data is properly fetched and used in sharing
- [ ] Images appear correctly when sharing on social platforms
- [ ] Fallback images work when primary images are unavailable
- [ ] All share platforms display the correct images
- [ ] Image URLs are publicly accessible
- [ ] Cache is working properly without preventing updates

## Conclusion

This solution ensures that when users share prompts or blogs from AITerritory.org, the social media platforms will display dynamic and unique OG images that are specific to the content being shared. The implementation handles various edge cases and provides fallbacks to ensure a consistent user experience.
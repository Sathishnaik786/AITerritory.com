# OG Image Test Plan for AITerritory.org

## Test Objectives
1. Verify that dynamic OG images are generated correctly for blogs
2. Verify that dynamic OG images are generated correctly for prompts
3. Ensure that sharing functionality uses the correct dynamic images
4. Validate that fallback mechanisms work properly

## Test Environment
- Local development server (localhost:3007)
- Production-like data in Supabase
- Social media sharing debugger tools

## Test Cases

### Test Case 1: Blog OG Image Generation
**Description**: Verify that blog OG images are generated correctly
**Steps**:
1. Start the development server
2. Navigate to `/api/og/blogs/test-blog-slug`
3. Verify that an image is returned
4. Check that the image contains blog-specific information

**Expected Result**: A 1200x630 PNG image with blog title, author, and category

### Test Case 2: Prompt OG Image Generation
**Description**: Verify that prompt OG images are generated correctly
**Steps**:
1. Start the development server
2. Navigate to `/api/og/prompts/test-prompt-id`
3. Verify that an image is returned
4. Check that the image contains prompt-specific information

**Expected Result**: A 1200x630 PNG image with prompt text and category

### Test Case 3: Blog Sharing with Existing Cover Image
**Description**: Verify that blogs with existing cover images use those images
**Steps**:
1. Create a blog with a cover_image_url in Supabase
2. Visit the blog page
3. Click the share button
4. Share on Facebook
5. Check the preview image

**Expected Result**: The preview should show the blog's cover image

### Test Case 4: Blog Sharing without Cover Image
**Description**: Verify that blogs without cover images generate dynamic images
**Steps**:
1. Create a blog without a cover_image_url in Supabase
2. Visit the blog page
3. Click the share button
4. Share on Facebook
5. Check the preview image

**Expected Result**: The preview should show a dynamically generated image

### Test Case 5: Prompt Sharing with Existing Image
**Description**: Verify that prompts with existing images use those images
**Steps**:
1. Create a prompt with an image_url in Supabase
2. Visit the prompt page
3. Click the share button
4. Share on Facebook
5. Check the preview image

**Expected Result**: The preview should show the prompt's image

### Test Case 6: Prompt Sharing without Image
**Description**: Verify that prompts without images generate dynamic images
**Steps**:
1. Create a prompt without an image_url in Supabase
2. Visit the prompt page
3. Click the share button
4. Share on Facebook
5. Check the preview image

**Expected Result**: The preview should show a dynamically generated image

### Test Case 7: Fallback to Default Image
**Description**: Verify that non-existent content falls back to default image
**Steps**:
1. Navigate to `/api/og/blogs/non-existent-slug`
2. Verify that a default image is returned

**Expected Result**: The default OG image should be returned

### Test Case 8: SEO Data Fetching
**Description**: Verify that SEO data is properly fetched for blogs
**Steps**:
1. Visit a blog page
2. Check browser console for SEO data fetch
3. Verify that the SEO data includes the correct image URL

**Expected Result**: SEO data should be fetched and include the dynamic OG image URL

### Test Case 9: Social Media Debugger Validation
**Description**: Verify that social media platforms show correct previews
**Steps**:
1. Use Facebook Sharing Debugger on a blog URL
2. Use Twitter Card Validator on a prompt URL
3. Check that the correct images are displayed

**Expected Result**: Social platforms should show content-specific images

## Automated Testing Script

```javascript
// test-og-images.js
const https = require('https');
const fs = require('fs');

async function testOGImage(url, filename) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filename);
    
    https.get(url, (response) => {
      if (response.statusCode === 200 && response.headers['content-type']?.includes('image')) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`✓ Successfully downloaded: ${filename}`);
          resolve(true);
        });
      } else {
        console.log(`✗ Failed to download from: ${url}`);
        reject(new Error(`Status: ${response.statusCode}`));
      }
    }).on('error', (err) => {
      console.log(`✗ Error downloading from: ${url}`);
      reject(err);
    });
  });
}

async function runAllTests() {
  const tests = [
    {
      url: 'https://aiterritory-com.onrender.com/api/og/blogs/test-blog',
      filename: 'blog-og-image.png'
    },
    {
      url: 'https://aiterritory-com.onrender.com/api/og/prompts/test-prompt',
      filename: 'prompt-og-image.png'
    }
  ];

  for (const test of tests) {
    try {
      await testOGImage(test.url, test.filename);
    } catch (error) {
      console.log(`Test failed for ${test.url}: ${error.message}`);
    }
  }
}

runAllTests();
```

## Manual Testing Checklist

### Blog Testing
- [ ] Blog with cover image shows correct image when shared
- [ ] Blog without cover image generates dynamic image
- [ ] Blog SEO data includes correct image URL
- [ ] Blog sharing works on all platforms

### Prompt Testing
- [ ] Prompt with image shows correct image when shared
- [ ] Prompt without image generates dynamic image
- [ ] Prompt SEO data includes correct image URL
- [ ] Prompt sharing works on all platforms

### Fallback Testing
- [ ] Non-existent blog redirects to default image
- [ ] Non-existent prompt redirects to default image
- [ ] Server errors redirect to default image

### Performance Testing
- [ ] OG images are cached properly
- [ ] SEO data is cached properly
- [ ] No excessive API calls during normal usage

## Success Criteria
1. All test cases pass
2. Social media sharing shows content-specific images
3. Fallback mechanisms work correctly
4. Performance is acceptable
5. No errors in browser console related to sharing or OG images

## Rollback Plan
If issues are found in production:
1. Revert changes to ShareButton component
2. Disable dynamic OG image generation
3. Use static default images for all content
4. Monitor social sharing metrics to ensure functionality is restored

## Monitoring
After deployment:
1. Monitor server logs for OG image generation errors
2. Check social sharing metrics
3. Verify that no 404 errors are occurring for OG image URLs
4. Monitor performance metrics for SEO data fetching
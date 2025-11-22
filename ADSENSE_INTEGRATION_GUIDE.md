# AdSense Integration Guide for AITerritory.org

## Safe Cursor Prompt for Adding AdSense via GTM

To add AdSense ad slots to your site using Google Tag Manager, use the following safe implementation approach:

### 1. Environment Variable Setup

First, ensure you have the AdSense Publisher ID in your `.env` file:
```
VITE_ADSENSE_ID=ca-pub-XXXXXXXXXXXXXXXX
```

### 2. GTM Tag Configuration

Create the following tags in Google Tag Manager:

#### A. AdSense Loader Tag
- **Tag Name**: "AdSense - Loader"
- **Tag Type**: Custom HTML
- **HTML Content**:
```html
<script>
// Check if AdSense ID exists in environment
var adsenseId = '{{AdSense ID}}';
if (adsenseId && adsenseId !== 'ca-pub-XXXXXXXXXXXXXXXX') {
  // Load AdSense script
  (function() {
    var script = document.createElement('script');
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + adsenseId;
    script.async = true;
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);
  })();
}
</script>
```
- **Trigger**: All Pages

#### B. AdSense ID Variable
- **Variable Name**: "AdSense ID"
- **Variable Type**: Constant
- **Value**: {{VITE_ADSENSE_ID}} (or your actual AdSense ID)

### 3. Ad Slot Implementation

For each ad slot you want to add:

#### A. HTML Placement
Place this HTML where you want ads to appear:
```html
<!-- Responsive Ad Slot -->
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
     data-ad-slot="XXXXXXXXXX"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
  (adsbygoogle = window.adsbygoogle || []).push({});
</script>
```

#### B. GTM Tag for Each Ad Slot
- **Tag Name**: "AdSense - [Slot Name]"
- **Tag Type**: Custom HTML
- **HTML Content**:
```html
<script>
// Only load ad if AdSense is available
if (typeof adsbygoogle !== 'undefined') {
  (adsbygoogle = window.adsbygoogle || []).push({
    google_ad_client: "{{AdSense ID}}",
    enable_page_level_ads: true,
    overlays: {bottom: true}
  });
}
</script>
```
- **Trigger**: All Pages

### 4. Responsive Ad Configuration

To ensure ads are responsive and don't break layout:

1. Use CSS to control ad container dimensions:
```css
.ad-container {
  width: 100%;
  max-width: 728px; /* Adjust based on your layout */
  margin: 20px auto;
  min-height: 90px; /* Minimum height to prevent layout shift */
}

@media (max-width: 768px) {
  .ad-container {
    min-height: 250px; /* Adjust for mobile */
  }
}
```

2. Add the container to your ad slots:
```html
<div class="ad-container">
  <ins class="adsbygoogle"
       style="display:block"
       data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
       data-ad-slot="XXXXXXXXXX"
       data-ad-format="auto"
       data-full-width-responsive="true"></ins>
  <script>
    (adsbygoogle = window.adsbygoogle || []).push({});
  </script>
</div>
```

### 5. Consent Management (Optional)

If you implement consent management, add a blocking trigger:

1. Create a Cookie Variable:
   - **Variable Name**: "Consent Cookie"
   - **Variable Type**: 1st Party Cookie
   - **Cookie Name**: consent

2. Create a Blocking Trigger:
   - **Trigger Name**: "Block Ads - No Consent"
   - **Trigger Type**: Cookie
   - **Condition**: "Consent Cookie" does not contain "advertising"

3. Add the trigger to your AdSense tags as a blocking trigger.

### 6. Testing

1. Use the GTM Preview mode to verify tags fire correctly
2. Check the AdSense dashboard for impressions
3. Use browser dev tools to ensure no JavaScript errors
4. Verify Core Web Vitals are not negatively impacted

### 7. Best Practices

1. **Non-blocking Loading**: Ads should not block page content
2. **Responsive Design**: Ads should adapt to different screen sizes
3. **User Experience**: Don't overwhelm users with too many ads
4. **Compliance**: Follow AdSense policies and guidelines
5. **Performance**: Monitor LCP and CLS metrics after implementation

### 8. Fallback Handling

Always include fallback handling in case AdSense is not available:
```html
<div class="ad-container">
  <ins class="adsbygoogle"
       style="display:block"
       data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
       data-ad-slot="XXXXXXXXXX"
       data-ad-format="auto"
       data-full-width-responsive="true"></ins>
  <script>
    try {
      (adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.warn('AdSense failed to load:', e);
      // Optional: Show fallback content
      document.currentScript.parentElement.innerHTML = '<div class="ad-placeholder">Advertisement</div>';
    }
  </script>
</div>
```

This implementation ensures AdSense integration is safe, non-blocking, and compliant with both AdSense policies and good UX practices.
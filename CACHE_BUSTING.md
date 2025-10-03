# Cache Busting Guide

## Understanding the Problem

The "Loading failed for the module" error occurs when browsers cache old versions of your HTML files that reference JavaScript files that no longer exist after a new build.

For example:
- Old build: `index.85bcbfb2.js`
- New build: `index.aca84f81.js`
- Browser tries to load the old file → 404 error

## Solutions Implemented

### 1. Server-Side Cache Control
We've configured the SSR servers to:
- Serve HTML files with `no-cache` headers to prevent caching
- Serve static assets with proper cache headers
- Use ETags and last-modified headers for efficient caching

### 2. Build Process Improvements
- Added `build:clean` script that clears all caches before building
- Using hash-based filenames for cache busting

## Deployment Steps

### Before Each Deployment:
1. Clear caches:
   ```bash
   npm run clear-cache
   ```

2. Build the project:
   ```bash
   npm run build
   ```

### For Immediate Cache Busting:
If users are still seeing old cached files after deployment:

1. **Hard Refresh**:
   - Windows: Ctrl+F5 or Ctrl+Shift+R
   - Mac: Cmd+Shift+R

2. **Clear Browser Cache**:
   - Open DevTools (F12)
   - Right-click the refresh button
   - Select "Empty Cache and Hard Reload"

3. **Incognito Mode**:
   - Test in an incognito/private browsing window

## For Render Deployment

The cache control headers we've added to the SSR servers should prevent most caching issues. However, CDNs and proxies may still cache content.

### If Issues Persist:
1. Trigger a new deployment on Render
2. Wait for DNS propagation (usually a few minutes)
3. Ask users to hard refresh or clear their cache

## Long-term Prevention

The current setup should prevent most caching issues because:
1. HTML files are served with no-cache headers
2. JavaScript/CSS files use content-based hashes in filenames
3. Proper cache headers are set for all asset types

## Emergency Cache Busting

If you need to force cache busting for all users immediately:

1. Add a query parameter to your URLs temporarily:
   ```
   https://aiterritory.org/?v=2
   ```

2. Or modify the HTML template to include a version comment that changes with each build:
   ```html
   <!-- Version: 2025-10-03-build-001 -->
   ```

This will force browsers to treat the HTML as a new resource.
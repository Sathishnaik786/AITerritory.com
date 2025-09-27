# SEO Redirect Verification Guide for AITerritory.org

## Overview
This guide provides step-by-step instructions to verify that all redirects are working correctly and to validate the SEO fix in Google Search Console.

## Quick Verification Steps

### 1. Test Redirects Using Browser Developer Tools

Open your browser's Developer Tools (F12) and test these URLs:

```bash
# Test URLs (should all redirect to https://www.aiterritory.org/)
http://aiterritory.org/
http://www.aiterritory.org/
https://aiterritory.org/
https://www.aiterritory.org/
```

**Expected Results:**
- All URLs should redirect to `https://www.aiterritory.org/`
- Status code should be `301` (Permanent Redirect)
- No redirect chains (single redirect only)

### 2. Command Line Testing (PowerShell/CMD)

```powershell
# Test HTTP to HTTPS redirect
curl -I http://aiterritory.org/

# Test non-www to www redirect
curl -I https://aiterritory.org/

# Test www HTTP to HTTPS redirect
curl -I http://www.aiterritory.org/

# Verify canonical URL works
curl -I https://www.aiterritory.org/
```

**Expected Output:**
```
HTTP/1.1 301 Moved Permanently
Location: https://www.aiterritory.org/
```

### 3. Online SEO Testing Tools

#### Quick Test Tools:
1. **Redirect Checker**: https://www.redirect-checker.org/
2. **HTTP Status Checker**: https://httpstatus.io/
3. **SEO Site Checkup**: https://seositecheckup.com/

#### Test Parameters:
- **URL**: `http://aiterritory.org/`
- **Expected Result**: `301 → https://www.aiterritory.org/`
- **No Redirect Chains**: Should be single redirect

### 4. Google Search Console Validation

#### Step 1: Access Google Search Console
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Select your property: `https://www.aiterritory.org/`

#### Step 2: Validate the Fix
1. Navigate to **Coverage** → **Valid with warnings**
2. Look for "Page with redirect" issues
3. Click on each affected URL
4. Click **"Validate Fix"** button
5. Wait for validation to complete (may take 24-48 hours)

#### Step 3: Monitor Results
- Check back in 24-48 hours for validation results
- If successful, the warnings should disappear
- If failed, check the error messages and re-verify redirects

### 5. Advanced Verification Commands

#### Using PowerShell (Windows):
```powershell
# Test all redirect scenarios
$urls = @(
    "http://aiterritory.org/",
    "http://www.aiterritory.org/", 
    "https://aiterritory.org/",
    "https://www.aiterritory.org/"
)

foreach ($url in $urls) {
    try {
        $response = Invoke-WebRequest -Uri $url -MaximumRedirection 0 -ErrorAction SilentlyContinue
        Write-Host "$url → Status: $($response.StatusCode)"
        if ($response.Headers.Location) {
            Write-Host "  Redirects to: $($response.Headers.Location)"
        }
    } catch {
        Write-Host "$url → Error: $($_.Exception.Message)"
    }
}
```

#### Using curl (if available):
```bash
# Test redirect chain
curl -I -L http://aiterritory.org/ | grep -E "(HTTP|Location)"

# Check for redirect loops
curl -I -L --max-redirs 5 http://aiterritory.org/
```

### 6. Canonical URL Verification

#### Check Canonical Tag:
1. Visit `https://www.aiterritory.org/`
2. View page source (Ctrl+U)
3. Look for: `<link rel="canonical" href="https://www.aiterritory.org/" />`
4. Verify it's in the `<head>` section

#### Browser Extension Test:
- Install "SEOquake" or "MozBar" browser extension
- Visit the site and check canonical URL in the extension

### 7. Deployment Verification

#### For Netlify Deployment:
1. **Deploy Changes**: Push changes to your repository
2. **Check Netlify Dashboard**: 
   - Go to your Netlify site dashboard
   - Check "Deploys" tab for successful deployment
   - Verify redirects in "Redirects" section
3. **Test Live Site**: Wait 5-10 minutes after deployment, then test URLs

#### For Other Hosting:
1. **Upload .htaccess**: If using Apache, ensure `.htaccess` is in root directory
2. **Update nginx.conf**: If using Nginx, restart the server
3. **Test Immediately**: Changes should take effect immediately

### 8. Troubleshooting Common Issues

#### Issue: Redirect Chain (Multiple Redirects)
**Symptoms**: URL redirects multiple times before reaching final destination
**Solution**: Check for conflicting redirect rules, ensure only one redirect per URL

#### Issue: 404 Errors
**Symptoms**: URLs return 404 instead of redirecting
**Solution**: Verify redirect rules are in correct location and syntax is correct

#### Issue: SSL Certificate Errors
**Symptoms**: HTTPS redirects fail with certificate errors
**Solution**: Ensure SSL certificate covers both `aiterritory.org` and `www.aiterritory.org`

#### Issue: Google Search Console Still Shows Errors
**Symptoms**: Validation fails even after redirects work
**Solution**: 
1. Wait 24-48 hours for Google to recrawl
2. Use "Request Indexing" feature in GSC
3. Check if redirects work in incognito mode

### 9. Performance Monitoring

#### Tools to Monitor:
1. **Google PageSpeed Insights**: https://pagespeed.web.dev/
2. **GTmetrix**: https://gtmetrix.com/
3. **WebPageTest**: https://www.webpagetest.org/

#### Key Metrics to Watch:
- **Redirect Time**: Should be < 100ms
- **No Redirect Chains**: Single redirect only
- **HTTPS Score**: Should be 100%

### 10. Final Checklist

- [ ] All non-canonical URLs redirect to `https://www.aiterritory.org/`
- [ ] Redirects return 301 status code
- [ ] No redirect chains exist
- [ ] Canonical meta tag is present in HTML
- [ ] SSL certificate covers both domains
- [ ] Google Search Console validation is requested
- [ ] Performance is not negatively impacted
- [ ] All redirects work in incognito/private browsing mode

## Expected Timeline

- **Immediate**: Redirects should work within 5-10 minutes of deployment
- **Google Search Console**: 24-48 hours for validation
- **Full SEO Impact**: 1-2 weeks for complete Google indexing

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify redirects using online tools
3. Test in different browsers and devices
4. Contact your hosting provider if server-level issues persist

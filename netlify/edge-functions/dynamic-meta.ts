import { Context } from "@netlify/edge-functions";

// API endpoint mappings
const API_MAP: Record<string, string> = {
  "/tools/": "/api/tools/",
  "/blog/": "/api/blogs/",
};

export default async (request: Request, context: Context) => {
  const url = new URL(request.url);
  
  // Find matching API endpoint
  const apiPath = Object.keys(API_MAP).find(path => url.pathname.startsWith(path));
  
  if (!apiPath) return context.next();
  
  try {
    // Extract ID from path
    const id = url.pathname.replace(apiPath, "");
    
    // Fetch content data
    const apiUrl = `${url.origin}${API_MAP[apiPath]}${id}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    // Get original HTML
    const htmlResponse = await fetch(url.origin);
    let html = await htmlResponse.text();
    
    // Determine meta fields based on type
    let metaTitle = data.title || data.name || "AI Territory";
    let metaImage = data.image_url || data.cover_image_url || url.origin + "/og-default.png";
    let metaDescription = data.description || "Discover the best AI tools and blog posts on AITerritory.";
    
    // Inject meta tags
    html = html.replace(
      "</head>",
      `
      <meta property="og:title" content="${metaTitle} | AI Territory">
      <meta property="og:image" content="${metaImage}">
      <meta property="og:description" content="${metaDescription}">
      <meta property="og:url" content="${url.href}">
      <meta name="twitter:card" content="summary_large_image">
      <meta name="twitter:title" content="${metaTitle} | AI Territory">
      <meta name="twitter:description" content="${metaDescription}">
      <meta name="twitter:image" content="${metaImage}">
      </head>`
    );
    
    return new Response(html, {
      headers: { "Content-Type": "text/html" },
    });
  } catch (error) {
    console.error("Edge function error:", error);
    return context.next();
  }
};
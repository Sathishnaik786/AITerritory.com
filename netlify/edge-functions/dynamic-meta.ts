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
    
    // Inject meta tags
    html = html.replace(
      "</head>",
      `
      <meta property="og:title" content="${data.title} | AI Territory">
      <meta property="og:image" content="${data.image_url || url.origin + '/og-default.png'}">
      <meta property="og:description" content="${data.description}">
      <meta property="og:url" content="${url.href}">
      <meta name="twitter:card" content="summary_large_image">
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
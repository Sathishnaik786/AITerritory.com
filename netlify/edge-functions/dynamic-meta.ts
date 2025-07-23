import { Context } from "@netlify/edge-functions";

const API_MAP: Record<string, string> = {
  "/tools/": "/api/tools/",
  "/blog/": "/api/blogs/",
  "/ai-automation/": "/api/ai-automation/",
  "/ai-tutorials/": "/api/ai-tutorials/",
  "/categories/": "/api/categories/", // For category pages
  "/tags/": "/api/tags/",             // For tag pages
  "/resources/": "/api/resources/",   // For resource pages (future)
  "/youtube/": "/api/youtube/",       // For YouTube content
  "/dashboard/": "/api/dashboard/",   // For user dashboard (future)
  // Add more as needed
};

export default async (request: Request, context: Context) => {
  const url = new URL(request.url);
  const apiPath = Object.keys(API_MAP).find(path => url.pathname.startsWith(path));
  let metaTitle = "AITerritory - AI Tools & Insights";
  let metaImage = url.origin + "/og-default.png";
  let metaDescription = "Discover the best AI tools and blog posts on AITerritory.";

  if (apiPath) {
    try {
      const id = url.pathname.replace(apiPath, "");
      // Use direct Render backend URL
      const apiUrl = `https://aiterritory-com.onrender.com${API_MAP[apiPath]}${id}`;
      const response = await fetch(apiUrl);
      const data = await response.json();
      if (apiPath === "/categories/") {
        metaTitle = data.name || metaTitle;
        metaDescription = data.description || metaDescription;
        // No image field, use default
      } else if (apiPath === "/tags/") {
        metaTitle = data.name || metaTitle;
        metaDescription = `Explore tools and content tagged with '${data.name || id}' on AITerritory.`;
        // No image field, use default
      } else if (apiPath === "/youtube/") {
        metaTitle = data.title || metaTitle;
        metaDescription = data.description || metaDescription;
        metaImage = data.thumbnail_url || metaImage;
      } else {
        metaTitle = data.title || data.name || metaTitle;
        metaImage = data.image_url || data.cover_image_url || metaImage;
        metaDescription = data.description || metaDescription;
      }
    } catch (error) {
      console.error("Edge function API fetch error:", error);
      // fallback to default meta
    }
  }

  // Fetch original HTML
  const htmlResponse = await fetch(url.origin);
  let html = await htmlResponse.text();

  // Remove all existing OG and Twitter meta tags
  html = html.replace(/<meta[^>]+(property|name)="og:[^"]+"[^>]*>/gi, '');
  html = html.replace(/<meta[^>]+(property|name)="twitter:[^"]+"[^>]*>/gi, '');

  html = html.replace(
    "</head>",
    `\n    <meta property=\"og:title\" content=\"${metaTitle} | AI Territory\">\n    <meta property=\"og:image\" content=\"${metaImage}\">\n    <meta property=\"og:description\" content=\"${metaDescription}\">\n    <meta property=\"og:url\" content=\"${url.href}\">\n    <meta name=\"twitter:card\" content=\"summary_large_image\">\n    <meta name=\"twitter:title\" content=\"${metaTitle} | AI Territory\">\n    <meta name=\"twitter:description\" content=\"${metaDescription}\">\n    <meta name=\"twitter:image\" content=\"${metaImage}\">\n    </head>`
  );

  // Ensure only one doctype at the very top
  if (!html.trimStart().toLowerCase().startsWith('<!doctype html>')) {
    html = '<!DOCTYPE html>\n' + html;
  }

  return new Response(html, {
    headers: { "Content-Type": "text/html" },
  });
};
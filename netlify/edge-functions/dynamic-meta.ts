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

// Route to page name mapping for breadcrumbs
const ROUTE_NAMES: Record<string, string> = {
  "/tools/": "Tools",
  "/blog/": "Blog",
  "/ai-automation/": "AI Automation",
  "/ai-tutorials/": "AI Tutorials",
  "/categories/": "Categories",
  "/tags/": "Tags",
  "/resources/": "Resources",
  "/youtube/": "YouTube",
  "/dashboard/": "Dashboard",
};

export default async (request: Request, context: Context) => {
  const url = new URL(request.url);
  const apiPath = Object.keys(API_MAP).find(path => url.pathname.startsWith(path));
  let metaTitle = "AITerritory - AI Tools & Insights";
  let metaImage = url.origin + "/og-default.png";
  let metaDescription = "Discover the best AI tools and blog posts on AITerritory.";
  let pageName = "";
  let itemName = "";
  let id = "";

  // Static meta tags for main/landing pages
  const staticMetaMap: Record<string, { title: string, description: string, image?: string }> = {
    "/ai-for-business": {
      title: "AI for Business | AITerritory",
      description: "Explore how AI is transforming business operations, strategy, and growth. Discover tools, guides, and case studies.",
      image: url.origin + "/og-default.png"
    },
    "/blog": {
      title: "AI Blog | AITerritory",
      description: "Read the latest articles, news, and insights about AI, tools, and productivity on AITerritory.",
      image: url.origin + "/og-default.png"
    },
    "/prompts": {
      title: "AI Prompts | AITerritory",
      description: "Discover, share, and use the best AI prompts for ChatGPT, Midjourney, and more on AITerritory.",
      image: url.origin + "/og-default.png"
    },
    "/resources/ai-agents": {
      title: "AI Agents Resources | AITerritory",
      description: "Find the best resources, guides, and tools for building and using AI agents.",
      image: url.origin + "/og-default.png"
    },
    // Add more static routes as needed
  };

  if (staticMetaMap[url.pathname]) {
    metaTitle = staticMetaMap[url.pathname].title;
    metaDescription = staticMetaMap[url.pathname].description;
    metaImage = staticMetaMap[url.pathname].image || metaImage;
  }

  if (apiPath) {
    try {
      id = url.pathname.replace(apiPath, "");
      pageName = ROUTE_NAMES[apiPath] || "Page";
      
      // Use direct Render backend URL
      const apiUrl = `https://aiterritory-com.onrender.com${API_MAP[apiPath]}${id}`;
      const response = await fetch(apiUrl);
      const data = await response.json();
      
      if (apiPath === "/categories/") {
        metaTitle = data.name || metaTitle;
        metaDescription = data.description || metaDescription;
        itemName = data.name || id;
        // No image field, use default
      } else if (apiPath === "/tags/") {
        metaTitle = data.name || metaTitle;
        metaDescription = `Explore tools and content tagged with '${data.name || id}' on AITerritory.`;
        itemName = data.name || id;
        // No image field, use default
      } else if (apiPath === "/youtube/") {
        metaTitle = data.title || metaTitle;
        metaDescription = data.description || metaDescription;
        metaImage = data.thumbnail_url || metaImage;
        itemName = data.title || id;
      } else {
        metaTitle = data.title || data.name || metaTitle;
        metaImage = data.image_url || data.cover_image_url || metaImage;
        metaDescription = data.description || metaDescription;
        itemName = data.title || data.name || id;
      }
    } catch (error) {
      console.error("Edge function API fetch error:", error);
      // fallback to default meta
      itemName = id || "Page";
    }
  }

  // Always ensure metaImage is set to /og-default.png if missing or empty
  if (!metaImage) {
    metaImage = url.origin + "/og-default.png";
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

  // Add Breadcrumb Schema for inner pages (not home page)
  if (url.pathname !== "/" && url.pathname !== "/home") {
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://aiterritory.org/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": pageName || "Page",
          "item": url.href
        }
      ]
    };

    // If we have a specific item name (from API), add it as a third level
    if (itemName && itemName !== pageName) {
      breadcrumbSchema.itemListElement.push({
        "@type": "ListItem",
        "position": 3,
        "name": itemName,
        "item": url.href
      });
    }

    const breadcrumbScript = `<script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>`;
    html = html.replace("</head>", `\n    ${breadcrumbScript}\n    </head>`);
  }

  // Add FAQ Schema for blog detail pages
  if (url.pathname.startsWith("/blog/") && url.pathname !== "/blog") {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is AI Territory?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "AI Territory is a platform that curates the best AI tools, tutorials, and blogs for productivity and business growth."
          }
        },
        {
          "@type": "Question",
          "name": "Are AI tools free?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We list both free and paid AI tools with detailed comparisons to help you choose the best option for your needs."
          }
        },
        {
          "@type": "Question",
          "name": "How do I find the right AI tool?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Browse our curated categories, read detailed reviews, and compare features to find the perfect AI tool for your specific use case."
          }
        },
        {
          "@type": "Question",
          "name": "Can I submit my AI tool?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! We welcome submissions of new AI tools. Visit our submit tool page to share your AI solution with our community."
          }
        }
      ]
    };

    const faqScript = `<script type="application/ld+json">${JSON.stringify(faqSchema)}</script>`;
    html = html.replace("</head>", `\n    ${faqScript}\n    </head>`);
  }

  // Ensure only one doctype at the very top
  if (!html.trimStart().toLowerCase().startsWith('<!doctype html>')) {
    html = '<!DOCTYPE html>\n' + html;
  }

  return new Response(html, {
    headers: { "Content-Type": "text/html" },
  });
};
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  article?: boolean;
  keywords?: string;
  structuredData?: Record<string, any>;
  // Blog-specific props
  blogData?: {
    title: string;
    description: string;
    coverImage: string;
    author: {
      name: string;
      bio?: string;
      image?: string;
    };
    publishedAt: string;
    modifiedAt?: string;
    category?: string;
    subcategory?: string;
    tags?: string[];
    wordCount?: number;
    readingTime?: number;
  };
}

const SEO: React.FC<SEOProps> = ({
  title = 'AI Territory',
  description = 'AITerritory is your all-in-one AI-powered content platform. Generate, manage, and optimize content smarter across web, email, and social.',
  image = 'https://aiterritory.org/og-image.png',
  article = false,
  keywords = 'AI tools, artificial intelligence, content generation, AI platform',
  structuredData,
  blogData,
}) => {
  const location = useLocation();
  const canonicalUrl = `https://aiterritory.org${location.pathname}`;

  // Generate structured data for blog articles
  const generateBlogStructuredData = () => {
    if (!blogData) return null;

    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": blogData.title,
      "description": blogData.description,
      "image": blogData.coverImage,
      "author": {
        "@type": "Person",
        "name": blogData.author.name,
        "description": blogData.author.bio,
        "image": blogData.author.image
      },
      "publisher": {
        "@type": "Organization",
        "name": "AI Territory",
        "logo": {
          "@type": "ImageObject",
          "url": "https://aiterritory.org/logo.jpg"
        }
      },
      "datePublished": blogData.publishedAt,
      "dateModified": blogData.modifiedAt || blogData.publishedAt,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": canonicalUrl
      },
      "articleSection": blogData.category,
      "keywords": blogData.tags?.join(', '),
      "wordCount": blogData.wordCount,
      "timeRequired": `PT${blogData.readingTime || 5}M`
    };

    // Breadcrumb schema
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://aiterritory.org"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Blog",
          "item": "https://aiterritory.org/blog"
        },
        ...(blogData.category ? [{
          "@type": "ListItem",
          "position": 3,
          "name": blogData.category,
          "item": `https://aiterritory.org/blog/category/${blogData.category.toLowerCase()}`
        }] : []),
        {
          "@type": "ListItem",
          "position": blogData.category ? 4 : 3,
          "name": blogData.title,
          "item": canonicalUrl
        }
      ]
    };

    return [articleSchema, breadcrumbSchema];
  };

  return (
    <Helmet>
      <title>{title} | AI Territory</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={article ? 'article' : 'website'} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={`${title} | AI Territory`} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonicalUrl} />
      <meta property="twitter:title" content={`${title} | AI Territory`} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            ...structuredData,
            name: title,
            description: description,
            image: image,
            url: canonicalUrl
          })}
        </script>
      )}
      
      {/* Blog-specific structured data */}
      {blogData && (
        <script type="application/ld+json">
          {JSON.stringify(generateBlogStructuredData())}
        </script>
      )}
      
      {/* Breadcrumb structured data */}
      {blogData?.category && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://aiterritory.org"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Blog",
                "item": "https://aiterritory.org/blog"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": blogData.category,
                "item": `https://aiterritory.org/blog/category/${blogData.category.toLowerCase()}`
              }
            ]
          })}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
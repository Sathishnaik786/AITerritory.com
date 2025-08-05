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

  const blogStructuredData = generateBlogStructuredData();

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={article ? 'article' : 'website'} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="AITerritory" />
      <meta property="og:locale" content="en_US" />
      
      {/* Enhanced Open Graph for articles */}
      {article && blogData && (
        <>
          <meta property="article:published_time" content={blogData.publishedAt} />
          {blogData.modifiedAt && (
            <meta property="article:modified_time" content={blogData.modifiedAt} />
          )}
          <meta property="article:author" content={blogData.author.name} />
          <meta property="article:section" content={blogData.category} />
          {blogData.tags?.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content="aiterritory.org" />
      <meta property="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@aiterritory" />
      
      {/* Preconnect and DNS Prefetch */}
      <link rel="preconnect" href="https://aiterritory-com.onrender.com" />
      <link rel="dns-prefetch" href="https://aiterritory-com.onrender.com" />
      <link rel="preconnect" href="https://api.openai.com" />
      <link rel="dns-prefetch" href="https://api.openai.com" />
      
      {/* JSON-LD Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
      
      {/* Blog-specific structured data */}
      {blogStructuredData?.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEO;
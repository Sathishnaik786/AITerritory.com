import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  keywords?: string;
  article?: boolean | {
    publishedTime?: string;
    modifiedTime?: string;
    section?: string;
    tags?: string[];
  };
  openGraph?: {
    type?: string;
    article?: {
      publishedTime?: string;
      modifiedTime?: string;
      section?: string;
      authors?: string[];
      tags?: string[];
    };
    images?: Array<{
      url: string;
      width?: number;
      height?: number;
      alt?: string;
      type?: string;
    }>;
    site_name?: string;
  };
  twitter?: {
    cardType?: 'summary' | 'summary_large_image' | 'app' | 'player';
    site?: string;
    handle?: string;
  };
  additionalMetaTags?: Array<{
    name: string;
    content: string;
    property?: string;
  }>;
  structuredData?: Record<string, any>;
  blogData?: {
    title: string;
    description: string;
    coverImage: string;
    author: {
      name: string;
      bio?: string;
      image?: string;
      twitter?: string;
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
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  section,
  keywords = 'AI tools, artificial intelligence, content generation, AI platform',
  article,
  openGraph,
  twitter,
  additionalMetaTags = [],
  structuredData,
  blogData,
}) => {
  const location = useLocation();
  const canonicalUrl = url || `https://aiterritory.org${location.pathname}`;
  const siteName = 'AI Territory';
  const twitterHandle = twitter?.handle || '@AITerritory';
  
  // Default OpenGraph image
  const defaultImage = {
    url: image,
    width: 1200,
    height: 630,
    alt: title,
    type: 'image/jpeg',
  };

  // Generate structured data for blog articles
  const generateBlogStructuredData = () => {
    if (!blogData) return null;

    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": blogData.title,
      "description": blogData.description,
      "image": blogData.coverImage || image,
      "author": {
        "@type": "Person",
        "name": blogData.author.name,
        "description": blogData.author.bio,
        "image": blogData.author.image,
        ...(blogData.author.twitter && {
          "sameAs": `https://twitter.com/${blogData.author.twitter.replace('@', '')}`
        })
      },
      "publisher": {
        "@type": "Organization",
        "name": siteName,
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

    return articleSchema;
  };

  // Generate breadcrumb structured data
  const generateBreadcrumbData = () => {
    if (!blogData) return null;
    
    return {
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
          "item": `https://aiterritory.org/blog/category/${blogData.category.toLowerCase().replace(/\s+/g, '-')}`
        }] : []),
        {
          "@type": "ListItem",
          "position": blogData.category ? 4 : 3,
          "name": blogData.title,
          "item": canonicalUrl
        }
      ]
    };
  };

  // Get the article data from props or blogData
  const articleData = typeof article === 'object' ? article : {};
  const articlePublishedTime = publishedTime || articleData.publishedTime || blogData?.publishedAt;
  const articleModifiedTime = modifiedTime || articleData.modifiedTime || blogData?.modifiedAt;
  const articleSection = section || articleData.section || blogData?.category;
  const articleTags = articleData.tags || blogData?.tags || [];
  const articleAuthor = author || blogData?.author?.name;

  // Prepare OpenGraph data
  const ogType = type === 'article' || blogData ? 'article' : 'website';
  const ogImages = openGraph?.images || [defaultImage];
  
  return (
    <Helmet>
      <title>{`${title} | ${siteName}`}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={openGraph?.site_name || siteName} />
      
      {/* OpenGraph Images */}
      {ogImages.map((img, index) => (
        <React.Fragment key={index}>
          <meta property="og:image" content={img.url} />
          {img.width && <meta property="og:image:width" content={String(img.width)} />}
          {img.height && <meta property="og:image:height" content={String(img.height)} />}
          {img.alt && <meta property="og:image:alt" content={img.alt} />}
          {img.type && <meta property="og:image:type" content={img.type} />}
        </React.Fragment>
      ))}
      
      {/* Article specific meta */}
      {ogType === 'article' && (
        <>
          {articlePublishedTime && <meta property="article:published_time" content={articlePublishedTime} />}
          {articleModifiedTime && <meta property="article:modified_time" content={articleModifiedTime} />}
          {articleSection && <meta property="article:section" content={articleSection} />}
          {articleAuthor && <meta property="article:author" content={articleAuthor} />}
          {articleTags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content={twitter?.cardType || 'summary_large_image'} />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {ogImages[0]?.url && <meta name="twitter:image" content={ogImages[0].url} />}
      {twitter?.site && <meta name="twitter:site" content={twitter.site} />}
      {twitter?.handle && <meta name="twitter:creator" content={twitter.handle} />}
      
      {/* Additional Meta Tags */}
      {additionalMetaTags.map((tag, index) => (
        <meta 
          key={index} 
          name={tag.name} 
          content={tag.content}
          property={tag.property}
        />
      ))}
      
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
      {blogData && (
        <script type="application/ld+json">
          {JSON.stringify(generateBreadcrumbData())}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
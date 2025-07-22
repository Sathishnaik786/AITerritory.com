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
}

const SEO: React.FC<SEOProps> = ({
  title = 'AI Territory',
  description = 'AITerritory is your all-in-one AI-powered content platform. Generate, manage, and optimize content smarter across web, email, and social.',
  image = 'https://aiterritory.org/og-image.png',
  article = false,
  keywords = 'AI tools, artificial intelligence, content generation, AI platform',
  structuredData,
}) => {
  const location = useLocation();
  const canonicalUrl = `https://aiterritory.org${location.pathname}`;

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
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content="aiterritory.org" />
      <meta property="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
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
    </Helmet>
  );
};

export default SEO;
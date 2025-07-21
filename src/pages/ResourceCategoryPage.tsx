import React from 'react';
import SimpleToolCard from '../components/SimpleToolCard';
import { useTools } from '../hooks/useTools';
import { Helmet } from "react-helmet-async";

interface ResourceCategoryPageProps {
  title: string;
  filterCategory?: string; // Optional category to filter by
  filterTag?: string;     // Optional tag to filter by
}

const ResourceCategoryPage: React.FC<ResourceCategoryPageProps> = ({ title, filterCategory, filterTag }) => {
  // Prepare filters for the API
  const filters: any = {};
  if (filterCategory) filters.category = filterCategory;
  if (filterTag) filters.tag = filterTag;

  const { data: tools = [], isLoading, isError } = useTools(filters);

  const pageTitle = filterCategory ? `${filterCategory} AI Tools | AITerritory` : filterTag ? `${filterTag} AI Tools | AITerritory` : `${title} | AITerritory`;
  const pageDescription = filterCategory
    ? `Explore the best ${filterCategory} AI tools on AITerritory. Find, compare, and review top solutions for your needs.`
    : filterTag
      ? `Discover AI tools tagged with '${filterTag}' on AITerritory. Find, compare, and review the best tools for your workflow.`
      : `Explore the best AI tools for ${title.toLowerCase()} on AITerritory.`;
  const canonicalUrl = filterCategory
    ? `https://aiterritory.org/categories/${encodeURIComponent(filterCategory)}`
    : filterTag
      ? `https://aiterritory.org/tags/${encodeURIComponent(filterTag)}`
      : `https://aiterritory.org/categories/${encodeURIComponent(title)}`;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={canonicalUrl} />
        {/* Open Graph Meta Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content="/default-thumbnail.jpg" />
        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content="/default-thumbnail.jpg" />
      </Helmet>
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          {title}
        </h1>
        <p className="text-xl text-muted-foreground">
          Explore the best AI tools for {title.toLowerCase()}.
        </p>
      </div>

      {isLoading ? (
        <p className="text-center text-lg col-span-full">Loading...</p>
      ) : isError ? (
        <p className="text-center text-lg col-span-full text-red-500">Failed to load tools.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tools.length > 0 ? (
            tools.map((tool: any) => (
              <SimpleToolCard key={tool.id} tool={tool} />
            ))
          ) : (
            <p className="text-center text-lg col-span-full">No tools found for this category.</p>
          )}
        </div>
      )}
    </div>
    </>
  );
};

export default ResourceCategoryPage; 
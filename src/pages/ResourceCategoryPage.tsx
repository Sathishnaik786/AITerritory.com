import React from 'react';
import { toolsData, Tool } from '../data/tools';
import SimpleToolCard from '../components/SimpleToolCard';

interface ResourceCategoryPageProps {
  title: string;
  filterCategory?: string; // Optional category to filter by
  filterTag?: string;     // Optional tag to filter by
}

const ResourceCategoryPage: React.FC<ResourceCategoryPageProps> = ({ title, filterCategory, filterTag }) => {
  const filteredTools = toolsData.filter((tool: Tool) => {
    if (filterCategory && tool.category !== filterCategory) {
      return false;
    }
    if (filterTag && (!tool.tags || !tool.tags.includes(filterTag))) {
      return false;
    }
    return true;
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          {title}
        </h1>
        <p className="text-xl text-muted-foreground">
          Explore the best AI tools for {title.toLowerCase()}.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTools.length > 0 ? (
          filteredTools.map((tool: Tool) => (
            <SimpleToolCard key={tool.id} tool={tool} />
          ))
        ) : (
          <p className="text-center text-lg col-span-full">No tools found for this category.</p>
        )}
      </div>
    </div>
  );
};

export default ResourceCategoryPage; 
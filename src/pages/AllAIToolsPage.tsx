import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toolsData } from '../data/tools';
import SimpleToolCard from '../components/SimpleToolCard';
import CategorySidebar from '../components/CategorySidebar';
import { getCategoryToolCounts } from '../services/categoryService';

const AllAIToolsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  // Fetch category tool counts
  const { data: categories, isLoading: loadingCounts } = useQuery({
    queryKey: ['categoryToolCounts'],
    queryFn: getCategoryToolCounts,
  });

  // Filter tools based on selected category
  const filteredTools = selectedCategory === 'All Categories'
    ? toolsData
    : toolsData.filter(tool => tool.category === selectedCategory);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">All AI Tools</h1>
      <p className="text-center text-lg mb-12">Explore a comprehensive list of all AI tools available on our platform.</p>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/4 mb-8 md:mb-0">
          <CategorySidebar
            categories={categories || []}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            loading={loadingCounts}
          />
        </div>
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTools.map(tool => (
              <SimpleToolCard key={tool.id} tool={tool} />
            ))}
            {filteredTools.length === 0 && (
              <div className="col-span-full text-center text-gray-500 py-12">No tools found for this category.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllAIToolsPage; 
import React from 'react';
import { toolsData } from '../data/tools';
import SimpleToolCard from '../components/SimpleToolCard';

const AllAIToolsPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">All AI Tools</h1>
      <p className="text-center text-lg mb-12">Explore a comprehensive list of all AI tools available on our platform.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {toolsData.map(tool => (
          <SimpleToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  );
};

export default AllAIToolsPage; 
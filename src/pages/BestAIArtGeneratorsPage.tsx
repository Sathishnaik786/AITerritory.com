import { Tool } from '../data/tools';
import ResourceCategoryPage from './ResourceCategoryPage';
import { toolsData } from '../data/tools';

const BestAIArtGeneratorsPage = () => {
  const bestArtTools = toolsData.filter(tool =>
    (tool.category === 'Art Generators' || tool.tags?.includes('AI Art')) &&
    tool.rating >= 4.5 // Filter for highly rated tools
  );

  return (
    <ResourceCategoryPage 
      title="Best AI Art Generators" 
      filterTag="AI Art" 
      tools={bestArtTools} 
    />
  );
};

export default BestAIArtGeneratorsPage; 
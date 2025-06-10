import { Tool } from '../data/tools';
import ResourceCategoryPage from './ResourceCategoryPage';
import { toolsData } from '../data/tools';

const BestAIImageGeneratorsPage = () => {
  const bestImageTools = toolsData.filter(tool =>
    (tool.category === 'Image Generators' || tool.tags?.includes('Image Generation')) &&
    tool.rating >= 4.5 // Filter for highly rated tools
  );

  return (
    <ResourceCategoryPage 
      title="Best AI Image Generators" 
      filterTag="Image Generation" 
      tools={bestImageTools} 
    />
  );
};

export default BestAIImageGeneratorsPage; 
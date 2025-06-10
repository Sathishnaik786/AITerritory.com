import { Tool } from '../data/tools';
import ResourceCategoryPage from './ResourceCategoryPage';
import { toolsData } from '../data/tools';

const BestAITextGeneratorsPage = () => {
  const bestTextTools = toolsData.filter(tool =>
    (tool.category === 'Text Generators' || tool.tags?.includes('Text Generation') || tool.tags?.includes('Content Writing')) &&
    tool.rating >= 4.5 // Filter for highly rated tools
  );

  return (
    <ResourceCategoryPage 
      title="Best AI Text Generators" 
      filterTag="Text Generation" 
      tools={bestTextTools} 
    />
  );
};

export default BestAITextGeneratorsPage; 
import { Tool } from '../data/tools';
import ResourceCategoryPage from './ResourceCategoryPage';
import { toolsData } from '../data/tools';

const ArtGeneratorsPage = () => {
  const artTools = toolsData.filter(tool =>
    tool.category === 'Art Generators' || 
    tool.tags?.includes('AI Art') ||
    tool.tags?.includes('Digital Art') ||
    tool.tags?.includes('Art Creation') ||
    tool.tags?.includes('Artistic') ||
    tool.tags?.includes('Style Transfer') ||
    tool.tags?.includes('Art Generation')
  );

  return (
    <ResourceCategoryPage 
      title="Art Generators" 
      filterTag="AI Art" 
      tools={artTools} 
    />
  );
};

export default ArtGeneratorsPage; 
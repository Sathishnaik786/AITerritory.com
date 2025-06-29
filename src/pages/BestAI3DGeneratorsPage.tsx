import { Tool } from '../data/tools';
import ResourceCategoryPage from './ResourceCategoryPage';
import { toolsData } from '../data/tools';

const BestAI3DGeneratorsPage = () => {
  const best3DTools = toolsData.filter(tool =>
    (tool.category === '3D Generators' || tool.tags?.includes('3D Generation') || tool.tags?.includes('3D Modeling')) &&
    tool.rating >= 4.5 // Filter for highly rated tools
  );

  return (
    <ResourceCategoryPage 
      title="Best AI 3D Generators" 
      filterTag="3D Generation" 
      tools={best3DTools} 
    />
  );
};

export default BestAI3DGeneratorsPage; 
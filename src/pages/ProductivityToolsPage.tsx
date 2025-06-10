import { Tool } from '../data/tools';
import ResourceCategoryPage from './ResourceCategoryPage';
import { toolsData } from '../data/tools';

const ProductivityToolsPage = () => {
  const productivityTools = toolsData.filter(tool =>
    tool.category === 'Productivity Tools' || 
    tool.tags?.includes('Productivity') ||
    tool.tags?.includes('Task Management') ||
    tool.tags?.includes('Project Management') ||
    tool.category === 'Task & Project Management' ||
    tool.category === 'Automation & Integration' ||
    tool.category === 'Communication & Meetings' ||
    tool.category === 'Research & Knowledge' ||
    tool.tags?.includes('Scheduling') ||
    tool.tags?.includes('NoteTaker') ||
    tool.tags?.includes('Time Management')
  );

  return (
    <ResourceCategoryPage 
      title="Productivity Tools" 
      filterTag="Productivity" 
      tools={productivityTools} 
    />
  );
};

export default ProductivityToolsPage; 
import { Tool } from '../data/tools';
import ResourceCategoryPage from './ResourceCategoryPage';
import { toolsData } from '../data/tools';

const AllResourcesPage = () => {
  // For all resources, we'll show tools with a rating of 4.0 or higher
  const allResources = toolsData.filter(tool => tool.rating >= 4.0);

  return (
    <ResourceCategoryPage 
      title="All Resources" 
      tools={allResources} 
    />
  );
};

export default AllResourcesPage; 
import { Tool } from '../data/tools';
import ResourceCategoryPage from './ResourceCategoryPage';
import { toolsData } from '../data/tools';

const ImageGeneratorsPage = () => {
  const imageTools = toolsData.filter(tool =>
    tool.category === 'Image Generators' || 
    tool.tags?.includes('Image Generation') ||
    tool.tags?.includes('AI Art') ||
    tool.tags?.includes('Image Editing') ||
    tool.tags?.includes('Photo Generation') ||
    tool.tags?.includes('Image Creation')
  );

  return (
    <ResourceCategoryPage 
      title="Image Generators" 
      filterTag="Image Generation" 
      tools={imageTools} 
    />
  );
};

export default ImageGeneratorsPage; 
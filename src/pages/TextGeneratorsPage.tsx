import { Tool } from '../data/tools';
import ResourceCategoryPage from './ResourceCategoryPage';
import { toolsData } from '../data/tools';

const TextGeneratorsPage = () => {
  const textTools = toolsData.filter(tool =>
    tool.category === 'Text Generators' || 
    tool.tags?.includes('Text Generation') ||
    tool.tags?.includes('Content Writing') ||
    tool.tags?.includes('Copywriting') ||
    tool.tags?.includes('Article Writing') ||
    tool.tags?.includes('Blog Writing') ||
    tool.tags?.includes('AI Writing')
  );

  return (
    <ResourceCategoryPage 
      title="Text Generators" 
      filterTag="Text Generation" 
      tools={textTools} 
    />
  );
};

export default TextGeneratorsPage; 
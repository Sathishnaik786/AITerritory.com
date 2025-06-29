import { Tool } from '../data/tools';
import ResourceCategoryPage from './ResourceCategoryPage';
import { toolsData } from '../data/tools';

const AudioGeneratorsPage = () => {
  const audioTools = toolsData.filter(tool =>
    tool.category === 'Audio Generators' || 
    tool.tags?.includes('Audio Generation') ||
    tool.tags?.includes('Music Generation') ||
    tool.tags?.includes('Voice Generation') ||
    tool.tags?.includes('Sound Effects') ||
    tool.tags?.includes('Audio Editing') ||
    tool.tags?.includes('Voice Cloning')
  );

  return (
    <ResourceCategoryPage 
      title="Audio Generators" 
      filterTag="Audio Generation" 
      tools={audioTools} 
    />
  );
};

export default AudioGeneratorsPage; 
import { Tool } from '../data/tools';
import ResourceCategoryPage from './ResourceCategoryPage';
import { toolsData } from '../data/tools';

const VideoToolsPage = () => {
  const videoTools = toolsData.filter(tool =>
    tool.category === 'Video Tools' || 
    tool.tags?.includes('Video Generation') ||
    tool.tags?.includes('Video Editing') ||
    tool.tags?.includes('Video Creation') ||
    tool.tags?.includes('Video Production') ||
    tool.tags?.includes('Video Enhancement') ||
    tool.tags?.includes('Video Effects')
  );

  return (
    <ResourceCategoryPage 
      title="Video Tools" 
      filterTag="Video Generation" 
      tools={videoTools} 
    />
  );
};

export default VideoToolsPage; 
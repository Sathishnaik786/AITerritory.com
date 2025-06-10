import { Tool } from '../data/tools';
import ResourceCategoryPage from './ResourceCategoryPage';
import { toolsData } from '../data/tools';

const BestAIChatbotsPage = () => {
  const bestChatbotTools = toolsData.filter(tool =>
    (tool.category === 'Chatbots' || tool.tags?.includes('Chatbot') || tool.tags?.includes('AI Assistant')) &&
    tool.rating >= 4.5 // Filter for highly rated tools
  );

  return (
    <ResourceCategoryPage 
      title="Best AI Chatbots" 
      filterTag="Chatbot" 
      tools={bestChatbotTools} 
    />
  );
};

export default BestAIChatbotsPage; 
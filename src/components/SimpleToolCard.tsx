import React from 'react';
import { Tool } from '../data/tools';
import { Link } from 'react-router-dom';

interface SimpleToolCardProps {
  tool: Tool;
}

const SimpleToolCard: React.FC<SimpleToolCardProps> = ({ tool }) => {
  const imageSrc = tool.image_url || tool.image;
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 flex flex-col h-full border border-gray-100 dark:border-gray-700">
      <div className="flex items-center mb-3">
        {imageSrc ? (
          <img loading="lazy" src={imageSrc} alt={tool.name} className="w-12 h-12 object-contain rounded-full mr-3" />
        ) : (
          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 text-lg font-bold">
            {tool.name.charAt(0)}
          </div>
        )}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{tool.name}</h3>
      </div>
      <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-3 flex-grow">
        {tool.description}
      </p>
      <div className="mt-auto">
        <Link to={tool.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm font-medium">
          Learn More
        </Link>
      </div>
    </div>
  );
};

export default SimpleToolCard; 
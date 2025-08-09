import React from 'react';
import { Tool } from '../data/tools';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface SimpleToolCardProps {
  tool: Tool;
}

const SimpleToolCard: React.FC<SimpleToolCardProps> = ({ tool }) => {
  const imageSrc = tool.image_url || tool.image;
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      whileFocus={{ border: '2px solid #007bff' }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 flex flex-col h-full border border-gray-100 dark:border-gray-700"
    >
      <div className="flex items-center mb-3">
        {imageSrc ? (
          <img loading="lazy" src={imageSrc} alt={tool.name} className="w-12 h-12 object-contain rounded-full mr-3 transition-opacity duration-500 ease-in-out blur-sm hover:blur-0" />
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
      <div className="mt-auto flex gap-2">
        <Link to={`/tools/${tool.id}`} className="text-blue-600 hover:underline text-sm font-medium">
          Learn More
        </Link>
        {tool.link && (
          <a href={tool.link} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 text-sm font-medium">
            Visit Site
          </a>
        )}
      </div>
    </motion.div>
  );
};

export default SimpleToolCard; 
import React from 'react';
import { Tool } from '../types/tool';
import { Bookmark, ArrowUpRight, CheckCircle } from 'lucide-react';

interface ToolListItemProps {
  tool: Tool;
  bookmarks?: number;
  upvotes?: number;
}

const ToolListItem: React.FC<ToolListItemProps> = ({ tool, bookmarks = 0, upvotes = 0 }) => {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-100 dark:border-gray-800 px-6 py-4 mb-5 w-full transition hover:shadow-lg">
      {/* Logo and badge */}
      <div className="flex items-center mr-4 mb-2 md:mb-0">
        {tool.image_url ? (
          <img
            src={tool.image_url || '/placeholder.svg'}
            alt={tool.name}
            loading="lazy"
            className="w-12 h-12 rounded-lg object-cover flex-shrink-0 transition-opacity duration-500 ease-in-out"
          />
        ) : (
          <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-2xl font-bold text-gray-500">
            {tool.name.charAt(0)}
          </div>
        )}
        <CheckCircle className="w-5 h-5 text-blue-500 ml-1" />
      </div>
      {/* Main content */}
      <div className="flex-1 min-w-0 md:mr-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-bold text-lg text-gray-900 dark:text-white truncate">{tool.name}</span>
        </div>
        <div className="text-gray-700 dark:text-gray-300 text-sm mb-2 line-clamp-1 md:line-clamp-2">
          {tool.description}
        </div>
      </div>
      {/* Stats and action */}
      <div className="flex items-center gap-4 mt-2 md:mt-0">
        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
          <Bookmark className="w-4 h-4" />
          <span className="text-sm">{bookmarks}</span>
        </div>
        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
          <ArrowUpRight className="w-4 h-4" />
          <span className="text-sm">{upvotes}</span>
        </div>
        <a
          href={`/tools/${tool.id}`}
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm whitespace-nowrap"
        >
          View Details
        </a>
      </div>
    </div>
  );
};

export default ToolListItem;
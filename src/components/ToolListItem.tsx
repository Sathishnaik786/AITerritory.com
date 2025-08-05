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
        {tool.image_url || tool.image ? (
          <img
            src={tool.image_url || tool.image}
            alt={tool.name}
            loading="lazy"
            className="w-12 h-12 rounded-lg object-cover flex-shrink-0 transition-opacity duration-500 ease-in-out blur-sm hover:blur-0"
          />
        ) : (
          <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-2xl font-bold text-gray-500">
            {tool.name.charAt(0)}
          </div>
        )}
        <CheckCircle className="w-5 h-5 text-blue-500 ml-1" title="Verified" />
      </div>
      {/* Main content */}
      <div className="flex-1 min-w-0 md:mr-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-bold text-lg text-gray-900 dark:text-white truncate">{tool.name}</span>
        </div>
        <div className="text-gray-700 dark:text-gray-300 text-sm mb-2 line-clamp-1 md:line-clamp-2">
          {tool.description}
        </div>
        <div className="flex flex-wrap gap-2">
          {tool.tags && tool.tags.map(tag => (
            <span key={tag} className="text-xs text-blue-600 dark:text-blue-400 font-medium">#{tag.toLowerCase().replace(/ /g, '')}</span>
          ))}
        </div>
      </div>
      {/* Right box: bookmark and upvote */}
      <div className="flex flex-row md:flex-col items-center md:items-end gap-3 mt-3 md:mt-0 md:ml-auto">
        <div className="flex items-center gap-1 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2">
          <Bookmark className="w-5 h-5 text-gray-400" />
          <span className="font-semibold text-gray-700 dark:text-gray-200 text-base">{bookmarks}</span>
        </div>
        <div className="flex items-center gap-1 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2">
          <ArrowUpRight className="w-5 h-5 text-green-500" />
          <span className="font-semibold text-green-600 dark:text-green-400 text-base">{upvotes}</span>
        </div>
      </div>
    </div>
  );
};

export default ToolListItem; 
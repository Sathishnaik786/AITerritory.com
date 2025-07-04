import React from 'react';
import { Tool } from '../data/tools';
import { Star, Bookmark, ExternalLink, CheckCircle } from 'lucide-react';

interface FeaturedToolCardProps {
  tool: Tool;
}

const FeaturedToolCard: React.FC<FeaturedToolCardProps> = ({ tool }) => {
  // Dummy data for features not present in Tool interface
  const rating = Math.floor(Math.random() * 5) + 1; // 1-5 stars
  const reviewsCount = Math.floor(Math.random() * 50) + 1;
  const bookmarkCount = Math.floor(Math.random() * 5000) + 100;
  const pricing = tool.status === 'Free' ? 'Free' : (Math.random() > 0.7 ? 'Active deal' : 'Freemium');

  // Use image_url from Supabase, fallback to image for legacy support
  const imageSrc = tool.image_url || tool.image;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 flex flex-col h-full p-2 xs:p-3 sm:p-5 w-full max-w-full">
      {/* Top Row: Logo, Verified, Name, Rating */}
      <div className="flex items-center gap-2 sm:gap-3 mb-2">
        {imageSrc ? (
          <img loading="lazy" src={imageSrc} alt={tool.name} className="w-12 h-12 object-contain rounded-lg flex-shrink-0" />
        ) : (
          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 text-xl font-bold">
            {tool.name.charAt(0)}
          </div>
        )}
        <CheckCircle className="w-5 h-5 text-blue-500 ml-1" title="Verified" />
        <div className="flex flex-col flex-1 min-w-0 ml-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-base sm:text-lg text-gray-900 dark:text-white truncate">{tool.name}</span>
          </div>
          <div className="flex items-center gap-1 mt-1">
            {[1,2,3,4,5].map(i => (
              <Star key={i} className={`w-4 h-4 ${rating >= i ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-700'}`} />
            ))}
            <span className="text-xs text-gray-500 ml-1">({reviewsCount})</span>
          </div>
        </div>
      </div>
      {/* Pricing and Bookmark Row */}
      <div className="flex items-center gap-2 mb-2">
        <span className="font-medium text-gray-800 dark:text-gray-200 text-base">
          {pricing}
        </span>
        <div className="flex items-center gap-1 ml-auto text-gray-500 dark:text-gray-400">
          <span className="text-base">{bookmarkCount}</span>
          <Bookmark className="w-4 h-4" />
        </div>
      </div>
      {/* Description */}
      <div className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm mb-2 line-clamp-2 break-words">
        {tool.description}
      </div>
      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-3">
        {tool.tags && tool.tags.map(tag => (
          <span key={tag} className="text-xs text-blue-600 dark:text-blue-400 font-medium">#{tag.toLowerCase().replace(/ /g, '')}</span>
        ))}
      </div>
      {/* Bottom Row: Visit right */}
      <div className="flex flex-col sm:flex-row items-center justify-end mt-auto pt-2 gap-2 w-full">
        <a
          href={tool.link}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white border border-blue-400 text-blue-600 hover:bg-blue-50 hover:border-blue-600 font-semibold px-4 sm:px-6 py-2 rounded-xl shadow-sm flex items-center gap-2 w-full sm:w-auto text-center justify-center"
        >
          Visit <ExternalLink className="w-4 h-4 ml-1" />
        </a>
      </div>
    </div>
  );
};

export default FeaturedToolCard; 
import React from 'react';
import { Tool } from '../data/tools'; // Assuming Tool interface is imported from tools.ts
import { Star, Bookmark, ExternalLink, Tag } from 'lucide-react';

interface FeaturedToolCardProps {
  tool: Tool;
}

const FeaturedToolCard: React.FC<FeaturedToolCardProps> = ({ tool }) => {
  // Dummy data for features not present in Tool interface
  const rating = Math.floor(Math.random() * 5) + 1; // 1-5 stars
  const reviewsCount = Math.floor(Math.random() * 50) + 1;
  const bookmarkCount = Math.floor(Math.random() * 5000) + 100;
  const isEditorPick = Math.random() > 0.5;
  const pricing = tool.status === 'Free' ? 'Free' : (Math.random() > 0.7 ? 'Active deal' : 'Freemium');

  const renderStars = (count: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < count) {
        stars.push(<Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />);
      } else {
        stars.push(<Star key={i} className="w-4 h-4 text-gray-300 dark:text-gray-600" />);
      }
    }
    return stars;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:scale-[1.01] border border-gray-100 dark:border-gray-700">
      {/* Top section: Logo, Name, Verified, Rating */}
      <div className="flex items-center mb-3">
        {tool.image ? (
          <img src={tool.image} alt={tool.name} className="w-14 h-14 object-contain rounded-full mr-3 border border-gray-200 dark:border-gray-600 p-1" />
        ) : (
          <div className="w-14 h-14 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 text-xl font-bold border border-gray-200 dark:border-gray-600">
            {tool.name.charAt(0)}
          </div>
        )}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            {tool.name} <img src="/verified-sticker.svg" alt="Verified" className="w-4 h-4 ml-1 inline-block" />
          </h3>
          <div className="flex items-center text-sm">
            {renderStars(rating)}
            <span className="text-gray-600 dark:text-gray-400 ml-2">({reviewsCount})</span>
          </div>
        </div>
      </div>

      {/* Pricing and Bookmark */}
      <div className="flex items-center justify-between mb-3 text-sm">
        <span className={
          `font-medium ${
            pricing === 'Active deal' ? 'text-green-600 dark:text-green-400' :
            pricing === 'Free' ? 'text-blue-600 dark:text-blue-400' :
            'text-gray-700 dark:text-gray-300'
          }`
        }>
          {pricing}
          {pricing === 'Active deal' && <Tag className="w-4 h-4 inline-block ml-1" />}
        </span>
        <div className="flex items-center text-gray-500 dark:text-gray-400">
          <Bookmark className="w-4 h-4 mr-1" /> {bookmarkCount}
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-3 flex-grow">
        {tool.description}
      </p>

      {/* Tags */}
      {tool.tags && tool.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {tool.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full font-medium">
              #{tag.toLowerCase().replace(/ /g, '')}
            </span>
          ))}
        </div>
      )}

      {/* Footer: Editor's Pick & Button */}
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
        {isEditorPick && (
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Star className="w-4 h-4 mr-1 text-yellow-500 fill-current" /> Editor's Pick
          </div>
        )}
        <a
          href={tool.link}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto bg-blue-600 text-white font-medium py-2 px-5 rounded-full inline-flex items-center justify-center transition-colors hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 shadow-md hover:shadow-lg"
        >
          {pricing === 'Active deal' ? 'Get Deal' : 'Visit'}
          <ExternalLink className="w-4 h-4 ml-2" />
        </a>
      </div>
    </div>
  );
};

export default FeaturedToolCard; 
import React from 'react';
import { Tool } from '../types/tool';
import { Star, Bookmark, ExternalLink, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FeaturedToolCardProps {
  tool: Tool;
  bookmarkCount: number; // Add bookmarkCount as a prop
}

const FeaturedToolCard: React.FC<FeaturedToolCardProps> = ({ tool, bookmarkCount }) => {
  return (
    <Link to={`/tools/${tool.id}`} className="block group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 bg-white dark:bg-gray-800">
      {/* Top Row: Logo, Verified, Name, Rating */}
      <div className="flex items-center gap-2 sm:gap-3 mb-2">
        {tool.image_url ? (
          <img loading="lazy" src={tool.image_url} alt={tool.name} className="w-12 h-12 object-contain rounded-lg flex-shrink-0" />
        ) : (
          <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center text-muted-foreground text-xl font-bold">
            {tool.name.charAt(0)}
          </div>
        )}
        <CheckCircle className="w-5 h-5 text-blue-500 ml-1" title="Verified" />
        <div className="flex flex-col flex-1 min-w-0 ml-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-base sm:text-lg text-card-foreground truncate">{tool.name}</span>
          </div>
          <div className="flex items-center gap-1 mt-1">
            {[1,2,3,4,5].map(i => (
              <Star key={i} className={`w-4 h-4 ${tool.rating >= i ? 'text-yellow-400 fill-yellow-400' : 'text-muted'}`} />
            ))}
            <span className="text-xs text-muted-foreground ml-1">({tool.reviewsCount})</span>
          </div>
        </div>
      </div>
      {/* Pricing and Bookmark Row */}
      <div className="flex items-center justify-between p-4">
        <span className="font-medium text-card-foreground text-base">
          {tool.pricing}
        </span>
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
          <span className="text-base">{bookmarkCount}</span>
          <Bookmark className="w-4 h-4" />
        </div>
      </div>
      {/* Description */}
      <div className="text-muted-foreground text-xs sm:text-sm mb-2 line-clamp-2 break-words flex-1">
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
          className="bg-background border border-blue-400 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20 hover:border-blue-600 font-semibold px-4 sm:px-6 py-2 rounded-xl shadow-sm flex items-center gap-2 w-full sm:w-auto text-center justify-center"
        >
          Visit <ExternalLink className="w-4 h-4 ml-1" />
        </a>
      </div>
    </Link>
  );
};

export default FeaturedToolCard; 
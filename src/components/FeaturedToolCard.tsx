import React from 'react';
import { Tool } from '../data/tools';
import { Star, Bookmark, ExternalLink, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

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
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      whileFocus={{ border: '2px solid #007bff' }}
      className="bg-card border border-border rounded-2xl shadow-md flex flex-col h-full min-h-[280px] p-2 xs:p-3 sm:p-5 w-full max-w-full"
    >
      {/* Top Row: Logo, Verified, Name, Rating */}
      <div className="flex items-center gap-2 sm:gap-3 mb-2">
        {imageSrc ? (
          <img loading="lazy" src={imageSrc} alt={tool.name} className="w-12 h-12 object-contain rounded-lg flex-shrink-0 transition-opacity duration-500 ease-in-out blur-sm hover:blur-0" />
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
              <Star key={i} className={`w-4 h-4 ${rating >= i ? 'text-yellow-400 fill-yellow-400' : 'text-muted'}`} />
            ))}
            <span className="text-xs text-muted-foreground ml-1">({reviewsCount})</span>
          </div>
        </div>
      </div>
      {/* Pricing and Bookmark Row */}
      <div className="flex items-center gap-2 mb-2">
        <span className="font-medium text-card-foreground text-base">
          {pricing}
        </span>
        <div className="flex items-center gap-1 ml-auto text-muted-foreground">
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
    </motion.div>
  );
};

export default FeaturedToolCard; 
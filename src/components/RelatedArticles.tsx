import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Clock, Calendar, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRelatedArticles } from '../hooks/useRelatedArticles';
import { RelatedArticle, GetRelatedArticlesParams } from '../lib/getRelatedArticles';

interface RelatedArticlesProps {
  currentSlug: string;
  category?: string;
  tags?: string[];
  title?: string;
  className?: string;
}

const RelatedArticles: React.FC<RelatedArticlesProps> = ({
  currentSlug,
  category,
  tags = [],
  title = '',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch related articles using custom hook
  const { data: relatedArticles, isLoading, error, prefetchRelatedArticles } = useRelatedArticles({
    currentSlug,
    category,
    tags,
    title,
    limit: 5
  });

  const toggleMobile = () => {
    setIsOpen(!isOpen);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleMobile();
    }
  };

  // Don't render if no related articles
  if (!relatedArticles || relatedArticles.length === 0) {
    return null;
  }

  const ArticleCard: React.FC<{ article: RelatedArticle; index: number }> = ({ article, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <Link
        to={`/blog/${article.slug}`}
        className="block bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105 border border-gray-200 dark:border-gray-700 overflow-hidden"
        prefetch="intent"
        rel="prefetch"
        onMouseEnter={() => prefetchRelatedArticles()}
      >
        {/* Image */}
        <div className="relative h-32 overflow-hidden">
          <img
            src={article.cover_image_url || '/public/placeholder.svg'}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title */}
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight line-clamp-2 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {article.title}
          </h3>

          {/* Meta info */}
          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-2">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{new Date(article.created_at).toLocaleDateString()}</span>
            </div>
            {article.read_time && (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{article.read_time} min read</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex items-center gap-1">
              <Tag className="w-3 h-3 text-gray-400" />
              <div className="flex gap-1 flex-wrap">
                {article.tags.slice(0, 2).map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );

  const RelatedArticlesContent = () => (
    <div className="space-y-4">
      {isLoading ? (
        // Loading skeleton
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse">
              <div className="h-32 bg-gray-200 dark:bg-gray-700" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        // Error state
        <div className="text-center py-4 text-gray-500 dark:text-gray-400">
          <p>Unable to load related articles</p>
        </div>
      ) : (
        // Related articles
        <div className="space-y-4">
          {relatedArticles.map((article, index) => (
            <ArticleCard key={article.id} article={article} index={index} />
          ))}
        </div>
      )}
    </div>
  );

  // Desktop version - sidebar
  if (!isMobile) {
    return (
      <aside className={`w-80 flex-shrink-0 ${className}`}>
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-4">
          <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white flex items-center gap-2">
            Related Articles
          </h3>
          <RelatedArticlesContent />
        </div>
      </aside>
    );
  }

  // Mobile version - collapsible dropdown
  return (
    <div className={`w-full ${className}`}>
      <button
        className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border border-gray-200 dark:border-gray-800 shadow-md font-semibold text-gray-900 dark:text-white transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800"
        onClick={toggleMobile}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-controls="mobile-related-articles"
        tabIndex={0}
      >
        <span className="flex items-center gap-2">
          Related Articles
          {relatedArticles && relatedArticles.length > 0 && (
            <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs px-2 py-0.5 rounded-full">
              {relatedArticles.length}
            </span>
          )}
        </span>
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="up"
              initial={{ rotate: 0 }}
              animate={{ rotate: 180 }}
              exit={{ rotate: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronUp className="w-5 h-5" />
            </motion.div>
          ) : (
            <motion.div
              key="down"
              initial={{ rotate: 180 }}
              animate={{ rotate: 0 }}
              exit={{ rotate: 180 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-related-articles"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="mt-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-4">
              <RelatedArticlesContent />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RelatedArticles; 
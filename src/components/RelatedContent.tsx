import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Calendar, 
  Tag, 
  ArrowRight,
  BookOpen,
  TrendingUp
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { OptimizedImage } from './OptimizedImage';
import { BlogCardSkeleton, NavigationSkeleton } from './SkeletonLoader';

interface RelatedArticle {
  id: string;
  slug: string;
  title: string;
  description?: string;
  cover_image_url?: string;
  created_at: string;
  category?: string;
  tags?: string[];
  reading_time?: number;
  view_count?: number;
}

interface NavigationArticle {
  id: string;
  slug: string;
  title: string;
  cover_image_url?: string;
  category?: string;
}

interface RelatedContentProps {
  currentSlug: string;
  category?: string;
  tags?: string[];
  title?: string;
  className?: string;
  variant?: 'sidebar' | 'bottom' | 'navigation';
}

// Fetch related articles using the new backend endpoint
const fetchRelatedArticles = async (currentSlug: string): Promise<RelatedArticle[]> => {
  try {
    const response = await fetch(`/api/blogs/related/${currentSlug}`);
    if (!response.ok) throw new Error('Failed to fetch related articles');
    return await response.json();
  } catch (error) {
    console.error('Error fetching related articles:', error);
    return [];
  }
};

// Fetch navigation articles (next/previous)
const fetchNavigationArticles = async (currentSlug: string): Promise<{
  next?: NavigationArticle;
  prev?: NavigationArticle;
}> => {
  try {
    const response = await fetch(`/api/blogs/navigation?currentSlug=${currentSlug}`);
    if (!response.ok) throw new Error('Failed to fetch navigation articles');
    return await response.json();
  } catch (error) {
    console.error('Error fetching navigation articles:', error);
    return {};
  }
};

export const RelatedContent: React.FC<RelatedContentProps> = ({
  currentSlug,
  category,
  tags = [],
  title = '',
  className = '',
  variant = 'sidebar'
}) => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch related articles
  const { data: relatedArticles, isLoading: isLoadingRelated } = useQuery({
    queryKey: ['relatedArticles', currentSlug],
    queryFn: () => fetchRelatedArticles(currentSlug),
    enabled: !!currentSlug,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch navigation articles
  const { data: navigationArticles, isLoading: isLoadingNavigation } = useQuery({
    queryKey: ['navigationArticles', currentSlug],
    queryFn: () => fetchNavigationArticles(currentSlug),
    enabled: !!currentSlug,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleNavigation = (direction: 'next' | 'prev') => {
    const article = navigationArticles?.[direction];
    if (article) {
      navigate(`/blog/${article.slug}`);
    }
  };

  const ArticleCard: React.FC<{ article: RelatedArticle; index: number; compact?: boolean }> = ({ 
    article, 
    index, 
    compact = false 
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: "easeOut"
      }}
      whileHover={{ 
        y: -4,
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      className="group"
    >
      <Link
        to={`/blog/${article.slug}`}
        className={`block bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105 border border-gray-200 dark:border-gray-700 overflow-hidden ${
          compact ? 'flex items-center gap-3 p-3' : ''
        }`}
        prefetch="intent"
      >
        {/* Image */}
        <div className={`relative overflow-hidden ${compact ? 'w-16 h-16 flex-shrink-0' : 'h-32'}`}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <OptimizedImage
              src={article.cover_image_url || ''}
              alt={article.title}
              className="w-full h-full object-cover"
              sizes={compact ? "64px" : "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"}
              fallbackSrc="/placeholder.svg"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        {/* Content */}
        <div className={compact ? 'flex-1 min-w-0' : 'p-4'}>
          {/* Title */}
          <h3 className={`font-semibold text-gray-900 dark:text-white leading-tight line-clamp-2 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors ${
            compact ? 'text-sm' : 'text-sm'
          }`}>
            {article.title}
          </h3>

          {/* Meta info */}
          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-2">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{new Date(article.created_at).toLocaleDateString()}</span>
            </div>
            {article.reading_time && (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{article.reading_time} min read</span>
              </div>
            )}
            {article.view_count && (
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>{article.view_count.toLocaleString()} views</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {!compact && article.tags && article.tags.length > 0 && (
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

  // Navigation component
  const NavigationComponent = () => (
    <div className="flex items-center justify-between gap-4 py-8 border-t border-gray-200 dark:border-gray-700">
      {/* Previous article */}
      <motion.button
        whileHover={{ x: -5 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handleNavigation('prev')}
        disabled={!navigationArticles?.prev}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
          navigationArticles?.prev
            ? 'border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
            : 'border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
        }`}
      >
        <ChevronLeft className="w-4 h-4" />
        <div className="text-left">
          <div className="text-xs text-gray-500 dark:text-gray-400">Previous</div>
          <div className="text-sm font-medium line-clamp-1">
            {navigationArticles?.prev?.title || 'No previous article'}
          </div>
        </div>
      </motion.button>

      {/* Next article */}
      <motion.button
        whileHover={{ x: 5 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handleNavigation('next')}
        disabled={!navigationArticles?.next}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
          navigationArticles?.next
            ? 'border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
            : 'border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
        }`}
      >
        <div className="text-right">
          <div className="text-xs text-gray-500 dark:text-gray-400">Next</div>
          <div className="text-sm font-medium line-clamp-1">
            {navigationArticles?.next?.title || 'No next article'}
          </div>
        </div>
        <ChevronRight className="w-4 h-4" />
      </motion.button>
    </div>
  );

  // Loading skeleton - now using the reusable component
  const LoadingSkeleton = ({ count = 3, compact = false }) => (
    <BlogCardSkeleton count={count} compact={compact} />
  );

  // Render based on variant
  if (variant === 'navigation') {
    return (
      <div className={className}>
        {isLoadingNavigation ? (
          <NavigationSkeleton />
        ) : (
          <NavigationComponent />
        )}
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {variant === 'sidebar' ? 'Related Articles' : 'You might also like'}
          </h2>
        </div>
        {variant === 'bottom' && (
          <Link
            to="/blog"
            className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium transition-colors"
          >
            View all
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      {/* Content */}
      {isLoadingRelated ? (
        <LoadingSkeleton count={variant === 'sidebar' ? 3 : 6} compact={variant === 'sidebar'} />
      ) : relatedArticles && relatedArticles.length > 0 ? (
        <div className={`grid gap-4 ${
          variant === 'sidebar' 
            ? 'grid-cols-1' 
            : isMobile 
              ? 'grid-cols-1 sm:grid-cols-2' 
              : 'grid-cols-2 lg:grid-cols-3'
        }`}>
          {relatedArticles.map((article, index) => (
            <ArticleCard
              key={article.id}
              article={article}
              index={index}
              compact={variant === 'sidebar'}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">No related articles found</p>
          <p className="text-sm">Check back later for more content</p>
        </div>
      )}

      {/* Navigation for bottom variant */}
      {variant === 'bottom' && (
        <NavigationComponent />
      )}
    </div>
  );
}; 
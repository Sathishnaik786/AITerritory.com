import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, ArrowRight } from 'lucide-react';
import { BlogPost } from '../types/blog';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

interface BlogCardProps {
  post: BlogPost;
  variant?: 'default' | 'featured' | 'compact';
  className?: string;
}

export const BlogCard: React.FC<BlogCardProps> = ({ 
  post, 
  variant = 'default',
  className = ''
}) => {
  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return 'Unknown Date';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    },
    hover: {
      y: -8,
      scale: 1.02,
      boxShadow: '0 8px 32px 0 rgba(60,60,120,0.12)',
      transition: { duration: 0.2 }
    }
  };

  // Fallbacks for missing data
  const fallbackImage =
    'https://placehold.co/600x400?text=No+Image';
  const displayImage = post.cover_image_url || fallbackImage;
  const displayAuthor = post.author_name || 'Unknown Author';
  const displayCategory = post.category || 'Uncategorized';
  const displaySummary = post.description || 'No summary available.';
  const displayDate = post.created_at;
  const displayReadingTime = post.reading_time ? `${post.reading_time} min` : '';
  // readTime is not available; we can omit or show a placeholder
  // const displayReadTime = post.readTime ? `${post.readTime} min` : '';

  if (variant === 'compact') {
    return (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        className={`group cursor-pointer ${className}`}
      >
        <Link to={`/blog/${post.slug}`}>
          <Card className="h-full overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <div className="aspect-video overflow-hidden rounded-md border border-gray-200 dark:border-gray-800 shadow-sm">
              <img
                src={displayImage}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
            <CardContent className="p-3 sm:p-4 md:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2 mb-2">
                <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                  {displayCategory}
                </Badge>
                {post.featured && (
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-1.5 py-0.5">
                    Featured
                  </Badge>
                )}
              </div>
              <h3 className="font-serif font-bold text-sm sm:text-base md:text-lg mb-2 line-clamp-2 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors leading-tight group-hover:underline group-hover:decoration-2 group-hover:underline-offset-4">
                {post.title}
              </h3>
              <p className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-gray-300 line-clamp-2 mb-4 leading-relaxed font-normal">
                {displaySummary}
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-2 gap-1 sm:gap-3">
                <span className="flex items-center gap-1"><User className="w-3 h-3" />{displayAuthor}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(displayDate)}</span>
                {displayReadingTime && (
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{displayReadingTime}</span>
                )}
              </div>
            </CardContent>
          </Card>
        </Link>
      </motion.div>
    );
  }

  if (variant === 'featured') {
    return (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        className={`group cursor-pointer ${className}`}
      >
        <Link to={`/blog/${post.slug}`}>
          <Card className="h-full overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-900/90 dark:to-gray-800/90 backdrop-blur-sm">
            <div className="aspect-[16/9] overflow-hidden relative rounded-md border border-gray-200 dark:border-gray-800 shadow-md">
              <img
                src={displayImage}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-2">
                  <Badge variant="secondary" className="text-xs bg-white/90 dark:bg-gray-800/90 px-1.5 py-0.5">
                    {displayCategory}
                  </Badge>
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-1.5 py-0.5">
                    Featured
                  </Badge>
                </div>
                <h3 className="font-serif font-bold text-base sm:text-lg md:text-xl text-white line-clamp-2 group-hover:text-blue-200 transition-colors leading-tight group-hover:underline group-hover:decoration-2 group-hover:underline-offset-4">
                  {post.title}
                </h3>
              </div>
            </div>
            <CardContent className="p-4 sm:p-5 md:p-6">
              <p className="text-xs sm:text-sm md:text-base text-gray-200 dark:text-gray-300 line-clamp-3 mb-4 leading-relaxed font-normal">
                {displaySummary}
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 text-xs text-gray-200 dark:text-gray-300">
                <span className="flex items-center gap-1"><User className="w-3 h-3" />{displayAuthor}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(displayDate)}</span>
                {displayReadingTime && (
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{displayReadingTime}</span>
                )}
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all duration-200 self-end sm:self-auto" />
            </CardContent>
          </Card>
        </Link>
      </motion.div>
    );
  }

  // Default variant
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className={`group cursor-pointer flex flex-col h-full ${className} transition-all duration-300 shadow-sm hover:shadow-lg hover:scale-105 hover:bg-muted/50 rounded-xl bg-white dark:bg-gray-900`}
    >
      <Link to={`/blog/${post.slug}`} aria-label={`Read blog: ${post.title}`}>
        <Card className="h-full overflow-hidden border-0 bg-transparent shadow-none rounded-xl">
          <div className="aspect-[16/10] overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <img
              src={displayImage}
              alt={post.title}
              className="w-full h-full object-cover rounded-xl group-hover:scale-105 group-hover:brightness-110 transition-transform transition-filter duration-300"
            />
          </div>
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                {displayCategory}
              </Badge>
              {post.featured && (
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-1.5 py-0.5">
                  Featured
                </Badge>
              )}
            </div>
            <h3 className="text-xl font-semibold text-primary mb-2 line-clamp-2 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors leading-tight group-hover:underline group-hover:decoration-2 group-hover:underline-offset-4">
              {post.title}
            </h3>
            <p className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-gray-300 line-clamp-3 mb-4 leading-relaxed font-normal">
              {displaySummary}
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1"><User className="w-3 h-3" />{displayAuthor}</span>
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(displayDate)}</span>
              {displayReadingTime && (
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{displayReadingTime}</span>
              )}
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
};
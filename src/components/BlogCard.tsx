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
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
      transition: { duration: 0.2 }
    }
  };

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
            <div className="aspect-video overflow-hidden">
              <img
                src={post.bannerImage}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-2">
                <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                  {post.category}
                </Badge>
                {post.featured && (
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-1.5 py-0.5">
                    Featured
                  </Badge>
                )}
              </div>
              <h3 className="font-semibold text-sm sm:text-base md:text-lg mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
                {post.title}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
                {post.summary}
              </p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span className="truncate">{post.author}</span>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Clock className="w-3 h-3" />
                  <span>{post.readTime} min</span>
                </div>
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
            <div className="aspect-[16/9] overflow-hidden relative">
              <img
                src={post.bannerImage}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-2">
                  <Badge variant="secondary" className="text-xs bg-white/90 dark:bg-gray-800/90 px-1.5 py-0.5">
                    {post.category}
                  </Badge>
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-1.5 py-0.5">
                    Featured
                  </Badge>
                </div>
                <h3 className="font-bold text-base sm:text-lg md:text-xl text-white line-clamp-2 group-hover:text-blue-200 transition-colors leading-tight">
                  {post.title}
                </h3>
              </div>
            </div>
            <CardContent className="p-4 sm:p-5 md:p-6">
              <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 mb-4 leading-relaxed">
                {post.summary}
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span className="truncate">{post.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span className="hidden sm:inline">{formatDate(post.date)}</span>
                    <span className="sm:hidden">{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{post.readTime} min</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all duration-200 self-end sm:self-auto" />
              </div>
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
      className={`group cursor-pointer ${className}`}
    >
      <Link to={`/blog/${post.slug}`}>
        <Card className="h-full overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <div className="aspect-[16/10] overflow-hidden">
            <img
              src={post.bannerImage}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-3">
              <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                {post.category}
              </Badge>
              {post.featured && (
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-1.5 py-0.5">
                  Featured
                </Badge>
              )}
            </div>
            <h3 className="font-semibold text-sm sm:text-base md:text-lg mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
              {post.title}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 mb-4 leading-relaxed">
              {post.summary}
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span className="truncate">{post.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{post.readTime} min</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all duration-200 self-end sm:self-auto" />
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}; 
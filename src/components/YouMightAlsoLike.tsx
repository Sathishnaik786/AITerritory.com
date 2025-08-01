import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { BlogService } from '../services/blogService';
import { OptimizedImage } from './OptimizedImage';
import { Clock, BookOpen, ArrowRight, Sparkles } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  description?: string;
  summary?: string;
  cover_image_url?: string;
  bannerImage?: string;
  author_name?: string;
  author?: string;
  category?: string;
  created_at?: string;
  date?: string;
  reading_time?: number;
  readTime?: number;
  tags?: string[];
}

interface YouMightAlsoLikeProps {
  currentSlug: string;
  category?: string;
  tags?: string[];
}

// Helper function to normalize blog data from different sources
const normalizeBlogData = (blog: any): BlogPost => {
  return {
    id: blog.id,
    title: blog.title,
    slug: blog.slug,
    description: blog.description || blog.summary || '',
    cover_image_url: blog.cover_image_url || blog.bannerImage || '',
    author_name: blog.author_name || blog.author || '',
    category: blog.category || '',
    created_at: blog.created_at || blog.date || '',
    reading_time: blog.reading_time || blog.readTime || 3,
    tags: blog.tags || []
  };
};

export const YouMightAlsoLike: React.FC<YouMightAlsoLikeProps> = ({ 
  currentSlug, 
  category, 
  tags 
}) => {
  const [relatedBlogs, setRelatedBlogs] = useState<BlogPost[]>([]);
  const [recentBlogs, setRecentBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  // Calculate allBlogs early for the useEffect dependency
  const allBlogs = [...relatedBlogs, ...recentBlogs].slice(0, 6);

  // First useEffect - fetch data
  useEffect(() => {
    const fetchRelatedContent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔍 Fetching related content for:', { currentSlug, category, tags });
        
        // Fetch all blogs
        const allBlogs = await BlogService.getAll();
        console.log('📚 Total blogs fetched:', allBlogs.length);
        
        // Normalize all blog data
        const normalizedBlogs = allBlogs.map(normalizeBlogData);
        console.log('📚 Normalized blogs:', normalizedBlogs.length);
        
        // Filter out current blog
        const otherBlogs = normalizedBlogs.filter(blog => blog.slug !== currentSlug);
        console.log('📚 Other blogs (excluding current):', otherBlogs.length);
        
        // Get related blogs based on category and tags
        let related: BlogPost[] = [];
        
        if (category) {
          const categoryMatches = otherBlogs.filter(blog => blog.category === category);
          console.log('🏷️ Category matches:', categoryMatches.length);
          related = [...related, ...categoryMatches];
        }
        
        if (tags && tags.length > 0) {
          const tagMatches = otherBlogs.filter(blog => 
            blog.tags && blog.tags.some(tag => tags.includes(tag))
          );
          console.log('🏷️ Tag matches:', tagMatches.length);
          related = [...related, ...tagMatches];
        }
        
        // Remove duplicates and limit to 3
        const uniqueRelated = related.filter((blog, index, self) => 
          index === self.findIndex(b => b.slug === blog.slug)
        ).slice(0, 3);
        
        console.log('🎯 Final related blogs:', uniqueRelated.length);
        setRelatedBlogs(uniqueRelated);
        
        // Get recent blogs (excluding related ones)
        const recent = otherBlogs
          .filter(blog => !uniqueRelated.find(r => r.slug === blog.slug))
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 6 - uniqueRelated.length); // Fill remaining slots
        
        console.log('📅 Recent blogs:', recent.length);
        setRecentBlogs(recent);
        
      } catch (error) {
        console.error('❌ Error fetching related content:', error);
        setError('Failed to load related content');
      } finally {
        setLoading(false);
      }
    };

    if (currentSlug) {
      fetchRelatedContent();
    }
  }, [currentSlug, category, tags]);

  const calculateReadingTime = (content: string) => {
    if (!content || typeof content !== 'string') return 3;
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50, 
      scale: 0.9,
      rotateX: -15
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    },
    hover: {
      y: -10,
      scale: 1.02,
      rotateY: 5,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };

  const loadingVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  if (loading) {
    return (
      <motion.div 
        ref={sectionRef}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-7xl mx-auto my-16 px-4"
      >
        <motion.div 
          variants={loadingVariants}
          className="mb-10 text-center"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-blue-500 animate-pulse" />
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              You Might Also Like
            </h2>
            <Sparkles className="w-6 h-6 text-purple-500 animate-pulse" />
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Discover more insights and tutorials
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              className="relative group"
            >
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 h-80 animate-pulse">
                <div className="h-48 bg-gray-300 dark:bg-gray-700 rounded-xl mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
                  <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        ref={sectionRef}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-7xl mx-auto my-16 px-4"
      >
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">{error}</p>
        </div>
      </motion.div>
    );
  }

  if (allBlogs.length === 0) {
    return (
      <motion.div 
        ref={sectionRef}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-7xl mx-auto my-16 px-4"
      >
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No related content found</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={sectionRef}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
      className="max-w-7xl mx-auto my-16 px-4"
    >
      {/* Enhanced Header */}
      <motion.div 
        variants={loadingVariants}
        className="mb-12 text-center"
      >
        <div className="inline-flex items-center gap-3 mb-6">
          <Sparkles className="w-7 h-7 text-blue-500 animate-pulse" />
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            You Might Also Like
          </h2>
          <Sparkles className="w-7 h-7 text-purple-500 animate-pulse" />
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
          Discover more insights and tutorials that will expand your knowledge
        </p>
      </motion.div>

      {/* Enhanced Cards Container with peek effect */}
      <div className="relative">
        <div 
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-8 px-4"
          style={{ scrollBehavior: 'smooth' }}
        >
          <AnimatePresence>
            {allBlogs.map((blog, index) => (
              <motion.article
                key={blog.slug}
                variants={cardVariants}
                whileHover="hover"
                onHoverStart={() => setHoveredCard(blog.slug)}
                onHoverEnd={() => setHoveredCard(null)}
                className="group cursor-pointer flex-shrink-0 relative"
                style={{ minWidth: '280px', maxWidth: '320px' }}
                onClick={() => window.location.href = `/blog/${blog.slug}`}
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                
                {/* Main Card */}
                <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-200/50 dark:border-gray-700/50 h-full backdrop-blur-sm">
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Cover Image with enhanced effects */}
                  {blog.cover_image_url && (
                    <div className="relative h-40 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />
                      <OptimizedImage
                        src={blog.cover_image_url}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                      {/* Shimmer effect on hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                    </div>
                  )}

                  {/* Content with enhanced styling */}
                  <div className="p-4 relative z-20">
                    {/* Category with enhanced styling */}
                    {blog.category && (
                      <motion.div 
                        className="mb-3"
                        whileHover={{ scale: 1.05 }}
                      >
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 rounded-full border border-blue-200 dark:border-blue-800">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                          {blog.category}
                        </span>
                      </motion.div>
                    )}

                    {/* Title with enhanced typography */}
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 leading-tight">
                      {blog.title}
                    </h3>

                    {/* Description with enhanced styling */}
                    {blog.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2 leading-relaxed">
                        {blog.description}
                      </p>
                    )}

                    {/* Enhanced Meta Information */}
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        {blog.author_name && (
                          <span className="font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                            {blog.author_name}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <motion.div 
                          className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full"
                          whileHover={{ scale: 1.05 }}
                        >
                          <Clock className="w-3 h-3" />
                          <span>{blog.reading_time || calculateReadingTime(blog.description || '')} min</span>
                        </motion.div>
                        {blog.created_at && (
                          <motion.div 
                            className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full"
                            whileHover={{ scale: 1.05 }}
                          >
                            <BookOpen className="w-3 h-3" />
                            <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                          </motion.div>
                        )}
                      </div>
                    </div>

                    {/* Read More Button */}
                    <motion.div 
                      className="mt-3 flex items-center justify-between"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                        Read More
                      </span>
                      <motion.div
                        className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center"
                        whileHover={{ scale: 1.2, rotate: 15 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <ArrowRight className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                      </motion.div>
                    </motion.div>
                  </div>

                  {/* Floating particles effect */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce mt-2" style={{ animationDelay: '150ms' }} />
                    <div className="w-1 h-1 bg-pink-400 rounded-full animate-bounce mt-2" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
        
        {/* Gradient fade effect to show next card */}
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white dark:from-gray-900 to-transparent pointer-events-none" />
      </div>
    </motion.div>
  );
}; 
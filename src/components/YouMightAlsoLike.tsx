import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { BlogService } from '../services/blogService';
import { OptimizedImage } from './OptimizedImage';
import { Clock, BookOpen, ArrowRight, Sparkles, Heart, Eye, AlertTriangle } from 'lucide-react';

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

  // Modern Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const headerVariants = {
    hidden: { 
      opacity: 0, 
      y: -30,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 60, 
      scale: 0.8,
      rotateX: -10
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      rotateX: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    },
    hover: {
      y: -8,
      scale: 1.03,
      rotateY: 2,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const imageVariants = {
    hover: {
      scale: 1.1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const contentVariants = {
    hover: {
      y: -5,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: {
        duration: 0.2,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const shimmerVariants = {
    hover: {
      x: ["-100%", "100%"],
      transition: {
        duration: 1.2,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse"
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
          variants={headerVariants}
          className="mb-12 text-center"
        >
          <div className="inline-flex items-center gap-3 mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-8 h-8 text-blue-500" />
            </motion.div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              You Might Also Like
            </h2>
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-8 h-8 text-purple-500" />
            </motion.div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Loading amazing content for you...
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              className="relative group"
            >
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 h-80">
                <div className="h-48 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-600 rounded-xl mb-4 animate-pulse"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-600 rounded w-1/3 animate-pulse"></div>
                  <div className="h-6 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-600 rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-600 rounded w-2/3 animate-pulse"></div>
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
        <div className="text-center py-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </motion.div>
          <p className="text-gray-500 dark:text-gray-400 text-lg">{error}</p>
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
        <div className="text-center py-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <BookOpen className="w-8 h-8 text-blue-500" />
          </motion.div>
          <p className="text-gray-500 dark:text-gray-400 text-lg">No related content found</p>
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
      {/* Enhanced Header with Modern Animation */}
      <motion.div 
        variants={headerVariants}
        className="mb-16 text-center"
      >
        <div className="inline-flex items-center gap-4 mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-8 h-8 text-blue-500" />
          </motion.div>
          <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            You Might Also Like
          </h2>
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-8 h-8 text-purple-500" />
          </motion.div>
        </div>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-gray-600 dark:text-gray-400 text-xl max-w-3xl mx-auto"
        >
          Discover more insights and tutorials that will expand your knowledge
        </motion.p>
      </motion.div>

      {/* Modern Cards Container */}
      <div className="relative">
        <div 
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide pb-8 px-4"
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
                style={{ minWidth: '320px', maxWidth: '380px' }}
                onClick={() => window.location.href = `/blog/${blog.slug}`}
              >
                {/* Enhanced Glow Effect */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10"
                  initial={{ scale: 0.8 }}
                  whileHover={{ scale: 1.2 }}
                  transition={{ duration: 0.5 }}
                />
                
                {/* Main Card with Modern Design */}
                <div className="relative bg-white/80 dark:bg-gray-800/80 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-200/50 dark:border-gray-700/50 h-full backdrop-blur-sm group-hover:bg-white dark:group-hover:bg-gray-800">
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-purple-50/30 dark:from-blue-900/10 dark:to-purple-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Cover Image with Modern Effects */}
                  {blog.cover_image_url && (
                    <div className="relative h-48 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent z-10" />
                      <motion.div
                        variants={imageVariants}
                        className="w-full h-full"
                      >
                        <OptimizedImage
                          src={blog.cover_image_url}
                          alt={blog.title}
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                      {/* Modern Shimmer Effect */}
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full"
                        variants={shimmerVariants}
                      />
                      
                      {/* Floating Action Icons */}
                      <motion.div 
                        className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        initial={{ y: -10, opacity: 0 }}
                        whileHover={{ y: 0, opacity: 1 }}
                      >
                        <motion.div
                          className="w-8 h-8 bg-white/90 dark:bg-gray-800/90 rounded-full flex items-center justify-center shadow-lg"
                          whileHover={{ scale: 1.1 }}
                        >
                          <Heart className="w-4 h-4 text-red-500" />
                        </motion.div>
                        <motion.div
                          className="w-8 h-8 bg-white/90 dark:bg-gray-800/90 rounded-full flex items-center justify-center shadow-lg"
                          whileHover={{ scale: 1.1 }}
                        >
                          <Eye className="w-4 h-4 text-blue-500" />
                        </motion.div>
                      </motion.div>
                    </div>
                  )}

                  {/* Content with Modern Styling */}
                  <motion.div 
                    className="p-6 relative z-20"
                    variants={contentVariants}
                  >
                    {/* Category Badge */}
                    {blog.category && (
                      <motion.div 
                        className="mb-4"
                        whileHover={{ scale: 1.05 }}
                      >
                        <span className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 rounded-full border border-blue-200 dark:border-blue-800">
                          <motion.div 
                            className="w-2 h-2 bg-blue-500 rounded-full"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                          {blog.category}
                        </span>
                      </motion.div>
                    )}

                    {/* Title with Enhanced Typography */}
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 leading-tight">
                      {blog.title}
                    </h3>

                    {/* Description with Enhanced Styling */}
                    {blog.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed">
                        {blog.description}
                      </p>
                    )}

                    {/* Enhanced Meta Information */}
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                      <div className="flex items-center gap-2">
                        {blog.author_name && (
                          <motion.span 
                            className="font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-full"
                            whileHover={{ scale: 1.05 }}
                          >
                            {blog.author_name}
                          </motion.span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <motion.div 
                          className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-full"
                          whileHover={{ scale: 1.05 }}
                        >
                          <Clock className="w-3 h-3" />
                          <span>{blog.reading_time || calculateReadingTime(blog.description || '')} min</span>
                        </motion.div>
                        {blog.created_at && (
                          <motion.div 
                            className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-full"
                            whileHover={{ scale: 1.05 }}
                          >
                            <BookOpen className="w-3 h-3" />
                            <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                          </motion.div>
                        )}
                      </div>
                    </div>

                    {/* Modern Read More Button */}
                    <motion.div 
                      className="flex items-center justify-between"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                        Read More
                      </span>
                      <motion.div
                        className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center"
                        variants={buttonVariants}
                      >
                        <ArrowRight className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </motion.div>
                    </motion.div>
                  </motion.div>

                  {/* Floating Particles Effect */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <motion.div 
                      className="w-2 h-2 bg-blue-400 rounded-full"
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <motion.div 
                      className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2"
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    />
                    <motion.div 
                      className="w-1 h-1 bg-pink-400 rounded-full mt-2"
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                    />
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
        
        {/* Enhanced Gradient Fade Effect */}
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white dark:from-gray-900 to-transparent pointer-events-none" />
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white dark:from-gray-900 to-transparent pointer-events-none" />
      </div>
    </motion.div>
  );
}; 
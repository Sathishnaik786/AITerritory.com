import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  // Simple fade-in animation for the entire section
  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  if (loading) {
    return (
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="max-w-7xl mx-auto my-16 px-4"
      >
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <Sparkles className="w-8 h-8 text-blue-500" />
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              You Might Also Like
            </h2>
            <Sparkles className="w-8 h-8 text-purple-500" />
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Loading content...
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-6 h-80 animate-pulse">
              <div className="h-48 bg-gray-300 dark:bg-gray-700 rounded-xl mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="max-w-7xl mx-auto my-16 px-4"
      >
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">{error}</p>
        </div>
      </motion.div>
    );
  }

  if (allBlogs.length === 0) {
    return (
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="max-w-7xl mx-auto my-16 px-4"
      >
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">No related content found</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={sectionVariants}
      className="max-w-7xl mx-auto my-16 px-4"
    >
      {/* Simple Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-3 mb-6">
          <Sparkles className="w-8 h-8 text-blue-500" />
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            You Might Also Like
          </h2>
          <Sparkles className="w-8 h-8 text-purple-500" />
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Discover more insights and tutorials
        </p>
      </div>

      {/* Horizontal Scrollable Container */}
      <div className="relative">
        <div 
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide pb-8 px-4"
          style={{ 
            scrollBehavior: 'smooth',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {allBlogs.map((blog) => (
            <div
              key={blog.slug}
              className="group cursor-pointer flex-shrink-0 relative"
              style={{ minWidth: '320px', maxWidth: '380px' }}
              onClick={() => window.location.href = `/blog/${blog.slug}`}
            >
              {/* Simple Card Design */}
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 h-full">
                
                {/* Cover Image */}
                {blog.cover_image_url && (
                  <div className="relative h-48 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />
                    <OptimizedImage
                      src={blog.cover_image_url}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  {/* Category */}
                  {blog.category && (
                    <div className="mb-3">
                      <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                        {blog.category}
                      </span>
                    </div>
                  )}

                  {/* Title */}
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    {blog.title}
                  </h3>

                  {/* Description */}
                  {blog.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {blog.description}
                    </p>
                  )}

                  {/* Meta Information */}
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                    <div className="flex items-center gap-2">
                      {blog.author_name && (
                        <span className="font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                          {blog.author_name}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                        <Clock className="w-3 h-3" />
                        <span>{blog.reading_time || calculateReadingTime(blog.description || '')} min</span>
                      </div>
                      {blog.created_at && (
                        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                          <BookOpen className="w-3 h-3" />
                          <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Read More Button */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      Read More
                    </span>
                    <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                      <ArrowRight className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Gradient fade effects for better UX */}
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white dark:from-gray-900 to-transparent pointer-events-none" />
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white dark:from-gray-900 to-transparent pointer-events-none" />
      </div>
    </motion.div>
  );
}; 
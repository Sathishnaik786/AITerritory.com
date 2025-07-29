import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { BlogService } from '../services/blogService';
import { OptimizedImage } from './OptimizedImage';
import { Clock, BookOpen } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  description: string;
  cover_image_url: string;
  author_name: string;
  category: string;
  created_at: string;
  reading_time: number;
}

interface YouMightAlsoLikeProps {
  currentSlug: string;
  category?: string;
  tags?: string[];
}

export const YouMightAlsoLike: React.FC<YouMightAlsoLikeProps> = ({ 
  currentSlug, 
  category, 
  tags 
}) => {
  const [relatedBlogs, setRelatedBlogs] = useState<BlogPost[]>([]);
  const [recentBlogs, setRecentBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Calculate allBlogs early for the useEffect dependency
  const allBlogs = [...relatedBlogs, ...recentBlogs].slice(0, 6);

  // First useEffect - fetch data
  useEffect(() => {
    const fetchRelatedContent = async () => {
      try {
        setLoading(true);
        
        // Fetch all blogs
        const allBlogs = await BlogService.getAll();
        
        // Filter out current blog
        const otherBlogs = allBlogs.filter(blog => blog.slug !== currentSlug);
        
        // Get related blogs based on category and tags
        const related = otherBlogs
          .filter(blog => 
            (category && blog.category === category) ||
            (tags && tags.some(tag => blog.tags?.includes(tag)))
          )
          .slice(0, 3);
        
        // Get recent blogs (excluding related ones)
        const recent = otherBlogs
          .filter(blog => !related.find(r => r.slug === blog.slug))
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 3);
        
        setRelatedBlogs(related);
        setRecentBlogs(recent);
      } catch (error) {
        console.error('Error fetching related content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedContent();
  }, [currentSlug, category, tags]);

  // Second useEffect - auto-scroll animation
  useEffect(() => {
    if (!scrollContainerRef.current || allBlogs.length <= 3) return;

    const container = scrollContainerRef.current;
    const scrollWidth = container.scrollWidth;
    const clientWidth = container.clientWidth;
    const maxScroll = scrollWidth - clientWidth;

    if (maxScroll <= 0) return;

    let animationId: number;
    let scrollPosition = 0;
    const scrollSpeed = 0.5; // pixels per frame

    const animate = () => {
      if (!isHovered) {
        scrollPosition += scrollSpeed;
        if (scrollPosition >= maxScroll) {
          scrollPosition = 0;
        }
        container.scrollLeft = scrollPosition;
      }
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [allBlogs.length, isHovered]);

  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto my-12 px-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-6 w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-lg h-64"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (allBlogs.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
      className="max-w-6xl mx-auto my-12 px-4"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          You Might Also Like
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Discover more insights and tutorials
        </p>
      </div>

      {/* Single row with auto-scroll */}
      <div 
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ scrollBehavior: 'smooth' }}
      >
        {allBlogs.map((blog, index) => (
          <motion.article
            key={blog.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index, duration: 0.5 }}
            className="group cursor-pointer flex-shrink-0"
            style={{ minWidth: '300px', maxWidth: '350px' }}
            onClick={() => window.location.href = `/blog/${blog.slug}`}
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 h-full">
              {/* Cover Image */}
              {blog.cover_image_url && (
                <div className="relative h-48 overflow-hidden">
                  <OptimizedImage
                    src={blog.cover_image_url}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              {/* Content */}
              <div className="p-4">
                {/* Category */}
                {blog.category && (
                  <div className="mb-2">
                    <span className="inline-block px-2 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-full">
                      {blog.category}
                    </span>
                  </div>
                )}

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {blog.title}
                </h3>

                {/* Description */}
                {blog.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {blog.description}
                  </p>
                )}

                {/* Meta Information */}
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    {blog.author_name && (
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {blog.author_name}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{blog.reading_time || calculateReadingTime(blog.description || '')} min read</span>
                    </div>
                    {blog.created_at && (
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </motion.div>
  );
}; 
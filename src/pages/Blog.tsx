import React, { useEffect, useState } from 'react';
import { BlogCard } from '../components/BlogCard';
import { BlogService } from '../services/blogService';
import { BlogPost } from '../types/blog';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BlogCardSkeleton } from '../components/SkeletonLoader';
import { PageBreadcrumbs } from '../components/PageBreadcrumbs';

import SEO from '../components/SEO';
const CATEGORIES = [
  'All',
  'AI Tool Reviews',
  'Content Creation with AI',
  'SEO & AI-Powered Marketing',
  'Prompt Engineering',
  'Productivity & Automation Tools'
];

const Blog: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isCategoryChanging, setIsCategoryChanging] = useState(false);

  const handleCategoryChange = (category: string) => {
    if (category === selectedCategory) return;
    setIsCategoryChanging(true);
    setSelectedCategory(category);
  };

  useEffect(() => {
    setLoading(true);
    if (selectedCategory === 'All') {
      BlogService.getAll().then(data => {
        setBlogs(data);
        setLoading(false);
      });
    } else {
      BlogService.getByCategory(selectedCategory).then(data => {
        setBlogs(data);
        setLoading(false);
      });
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (blogs.length > 0) {
      setIsCategoryChanging(false);
    }
  }, [blogs]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section Skeleton */}
        <section className="w-full py-12 md:py-16 hidden sm:block">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4" />
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-6 w-3/4 mx-auto" />
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          </div>
        </section>
        
        {/* Category Filter Skeleton */}
        <div className="max-w-6xl mx-auto pt-2 pb-6">
          <div className="flex flex-nowrap gap-2 overflow-x-auto">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse flex-shrink-0" />
            ))}
          </div>
        </div>
        
        {/* Featured Blog Skeleton */}
        <section className="w-full max-w-5xl mx-auto mb-12">
          <div className="flex flex-col md:flex-row items-center gap-8 bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-2xl p-6 md:p-10 backdrop-blur-md border border-gray-200 dark:border-gray-800">
            <div className="w-full md:w-1/2 h-80 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
            <div className="flex-1 space-y-4">
              <div className="flex gap-2">
                <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
              </div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2" />
              <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          </div>
        </section>
        
        {/* Blog Cards Skeleton */}
        <section className="py-4">
          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <BlogCardSkeleton count={6} />
          </div>
        </section>
      </div>
    );
  }
  if (!Array.isArray(blogs)) {
    return <div className="py-12 text-center text-red-600">Failed to load blogs. Please try again later.</div>;
  }

  // Find featured post for hero section
  const featured = blogs.find(post => post.featured);
  const rest = blogs.filter(post => !post.featured);

  return (
    <>
      <SEO
        title="AI Territory Blog | Insights, Guides, and Tool Reviews"
        description="Explore the latest in AI, productivity, and innovation. Discover curated insights, in-depth guides, and reviews of the best AI tools."
      />
      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumbs */}
        <PageBreadcrumbs />
        
        {/* Hero Section - Hide on mobile */}
        <section className="w-full py-12 md:py-16 hidden sm:block">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <motion.h1
              className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900 dark:text-white tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              AI Territory Blog
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              Discover the latest in AI, productivity, and innovation. Curated insights, guides, and tools for the modern creator.
            </motion.p>
            <motion.div
              className="flex flex-wrap justify-center gap-4 mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <Link to="/tools/ai-chatbots" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
                Explore more AI chatbots here
              </Link>
              <span className="text-gray-400">•</span>
              <Link to="/tools/ai-text-generators" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
                Discover AI text generators
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Category Filter */}
        <div className="max-w-6xl mx-auto pt-2 pb-6">
          <div 
            className="flex flex-nowrap gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent"
            role="tablist"
            aria-label="Blog categories"
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`flex-shrink-0 px-4 py-1 rounded-full border text-sm font-medium transition-colors ${
                  selectedCategory === cat 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700'
                }`}
                onClick={() => handleCategoryChange(cat)}
                role="tab"
                aria-selected={selectedCategory === cat}
                aria-controls={`${cat.toLowerCase().replace(/\s+/g, '-')}-tab`}
                disabled={isCategoryChanging}
              >
                {isCategoryChanging && selectedCategory === cat ? 'Loading...' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {isCategoryChanging && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Content */}
        {!isCategoryChanging && (
          <>
            {/* Featured Blog Card */}
            {featured && (
              <motion.section
                className="w-full max-w-6xl mx-auto mb-12"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                id="featured-post"
                aria-labelledby="featured-post-heading"
              >
                <h2 id="featured-post-heading" className="sr-only">Featured Post</h2>
                <BlogCard 
                  post={featured} 
                  variant="featured"
                  className="hover:shadow-2xl transition-shadow duration-300"
                />
              </motion.section>
            )}

            {/* Blog Posts Grid */}
            <section 
              className="py-4"
              aria-label="Blog posts"
              role="region"
            >
              {/* Mobile: Vertical scroll snap carousel */}
              <div
                className="overflow-y-auto scroll-smooth snap-y snap-mandatory flex flex-col gap-8 py-8 hide-scrollbar sm:hidden"
                style={{ 
                  height: '80vh', 
                  scrollPaddingTop: '2rem', 
                  scrollPaddingBottom: '2rem',
                  scrollSnapType: 'y mandatory'
                }}
              >
                {rest.map((post) => (
                  <article
                    key={post.id}
                    className="snap-center mx-auto w-[90vw] max-w-md"
                    aria-labelledby={`post-${post.id}-title`}
                  >
                    <BlogCard post={post} />
                  </article>
                ))}
              </div>

              {/* Desktop/Tablet: Grid */}
              <div 
                className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 hidden sm:grid"
                role="list"
                aria-label="Blog posts"
              >
                {rest.map((post) => (
                  <article 
                    key={post.id} 
                    className="h-full"
                    aria-labelledby={`post-${post.id}-title`}
                    role="listitem"
                  >
                    <BlogCard post={post} className="h-full" />
                  </article>
                ))}
              </div>

              {rest.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">No posts found in this category. Check back later!</p>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </>
  );
};

export default Blog;
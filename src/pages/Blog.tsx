import React, { useEffect, useState } from 'react';
import { BlogCard } from '../components/BlogCard';
import { BlogService } from '../services/blogService';
import { BlogPost } from '../types/blog';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

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

  if (loading) return <div className="py-12 text-center">Loading...</div>;
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
            <span className="text-gray-400">•</span>
            <Link to="/tools/ai-image-generators" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
              Browse AI image generators
            </Link>
          </motion.div>
        </div>
      </section>
      {/* Category Filter */}
      <div className="max-w-6xl mx-auto pt-2 pb-6">
        <div className="flex flex-nowrap gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`flex-shrink-0 px-4 py-1 rounded-full border text-sm font-medium transition-colors ${selectedCategory === cat ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700'}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      {/* Featured Blog Card */}
      {featured && (
        <motion.section
          className="w-full max-w-5xl mx-auto mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row items-center gap-8 bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-2xl p-6 md:p-10 backdrop-blur-md border border-gray-200 dark:border-gray-800">
            <img src={featured.cover_image_url} alt={featured.title} className="w-full md:w-1/2 rounded-xl shadow-lg object-cover max-h-80 mb-4 md:mb-0" loading="lazy" />
            <div className="flex-1 flex flex-col items-start">
              <div className="mb-2 flex flex-wrap gap-2">
                {Array.isArray(featured.tags) && featured.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">{tag}</span>
                ))}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-3 text-gray-900 dark:text-white line-clamp-2">{featured.title}</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">{featured.description}</p>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                <span className="font-semibold">{featured.author_name}</span>
                <span>•</span>
                <span>{new Date(featured.created_at).toLocaleDateString()}</span>
              </div>
              <Link to={`/blog/${featured.slug}`} className="inline-block px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition shadow-md mt-2">Read More</Link>
            </div>
          </div>
        </motion.section>
      )}
      {/* Blog Cards - Mobile Vertical Scroll Snap */}
      <section className="py-4">
        {/* Mobile: Vertical scroll snap carousel */}
        <div
          className="overflow-y-auto scroll-smooth snap-y snap-mandatory flex flex-col gap-4 py-8 hide-scrollbar sm:hidden"
          style={{ height: '80vh', scrollPaddingTop: '2rem', scrollPaddingBottom: '2rem' }}
        >
          {rest.map((post) => (
            <div
              key={post.id}
              className="snap-center mx-auto w-[90vw] max-w-md rounded-xl bg-white dark:bg-gray-900 shadow-md p-4 mt-8 mb-8"
            >
              <BlogCard post={post} />
            </div>
          ))}
        </div>
        {/* Desktop/Tablet: Grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 hidden sm:grid">
          {rest.map((post) => (
            <div key={post.id}>
              <BlogCard post={post} />
            </div>
          ))}
        </div>
      </section>
    </div>
    </>
  );
};

export default Blog;
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Calendar, Clock, User } from 'lucide-react';
import { BlogCard } from '../components/BlogCard';
import { blogPosts, blogCategories } from '../data/blogPosts';
import { BlogPost, BlogCategory } from '../types/blog';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';

const Blog: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'readTime' | 'title'>('date');

  // Filter and sort posts
  const filteredPosts = useMemo(() => {
    let filtered = blogPosts.filter(post => post.published);

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    // Sort posts
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'readTime':
          return b.readTime - a.readTime;
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchQuery, selectedCategory, sortBy]);

  // Get featured posts
  const featuredPosts = blogPosts.filter(post => post.featured && post.published).slice(0, 2);
  
  // Get regular posts (excluding featured ones)
  const regularPosts = filteredPosts.filter(post => !post.featured);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 scroll-smooth overflow-y-auto">

      {/* Filters and Categories */}
      <section className="py-4 sm:py-6 md:py-8 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 md:gap-6 items-start lg:items-center justify-between">
            {/* Categories */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2 w-full lg:w-auto">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('all')}
                className="rounded-full text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5 transition-colors"
              >
                All ({blogPosts.filter(p => p.published).length})
              </Button>
              {blogCategories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.name ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.name)}
                  className="rounded-full text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5 transition-colors"
                >
                  {category.name} ({category.postCount})
                </Button>
              ))}
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-2 w-full lg:w-auto">
              <Filter className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'readTime' | 'title')}
                className="bg-transparent border border-gray-300 dark:border-gray-600 rounded-md px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 lg:flex-none transition-colors"
              >
                <option value="date">Sort by Date</option>
                <option value="readTime">Sort by Read Time</option>
                <option value="title">Sort by Title</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="py-8 sm:py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-6 sm:mb-8 md:mb-12"
            >
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 md:mb-4">
                Featured Articles
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
                Handpicked content from our team
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8"
            >
              {featuredPosts.map((post) => (
                <BlogCard
                  key={post.id}
                  post={post}
                  variant="featured"
                />
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* All Posts */}
      <section className="py-8 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-6 sm:mb-8 md:mb-12"
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 md:mb-4">
              {searchQuery || selectedCategory !== 'all' ? 'Search Results' : 'All Articles'}
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
              {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''} found
            </p>
          </motion.div>

          {regularPosts.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8"
            >
              {regularPosts.map((post) => (
                <BlogCard
                  key={post.id}
                  post={post}
                  variant="default"
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 sm:py-12 md:py-16"
            >
              <Card className="max-w-sm sm:max-w-md mx-auto p-4 sm:p-6 md:p-8">
                <CardContent className="text-center">
                  <Search className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-muted-foreground mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    No articles found
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground mb-4">
                    Try adjusting your search criteria or browse all articles
                  </p>
                  <Button 
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    View All Articles
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-12 sm:py-16 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              Stay Updated
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8">
              Get the latest AI insights and tutorials delivered to your inbox
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center max-w-sm sm:max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1 text-sm sm:text-base"
              />
              <Button className="w-full sm:w-auto text-sm sm:text-base">
                Subscribe
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Blog; 
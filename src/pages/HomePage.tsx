import React, { useState, useEffect, Suspense } from 'react';
import { useTools, useFeaturedTools, useTrendingTools } from '../hooks/useTools';
import { useCategories } from '../hooks/useCategories';
import { ToolGrid } from '../components/ToolGrid';
import { PaginatedToolGrid } from '../components/PaginatedToolGrid';
import { CategoryFilter } from '../components/CategoryFilter';
import SearchBar from '../components/SearchBar';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { TrendingUp, Star, Search, Filter } from 'lucide-react';
import { Tool } from '../types/tool';
import { lazy } from 'react';
import { motion } from 'framer-motion';

// Lazy-load Testimonials component
const Testimonials = lazy(() => import('../components/Testimonials'));

// Carousel component for featured/trending tools
const ToolCarousel = React.lazy(() => import('../components/ToolCarousel'));

export const HomePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch data
  const { data: tools, isLoading: toolsLoading } = useTools({
    category_id: selectedCategory,
    search: searchQuery || undefined,
  });
  
  const { data: featuredTools, isLoading: featuredLoading } = useFeaturedTools();
  const { data: trendingTools, isLoading: trendingLoading } = useTrendingTools();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
          Discover AI Tools
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          Explore our curated collection of cutting-edge AI tools that transform how you work, create, and innovate.
        </p>
        
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <SearchBar
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search AI tools..."
            className="w-full"
          />
        </div>
      </motion.div>

      {/* Featured and Trending Tools - Side by Side */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {/* Featured Tools - Left Side */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Featured Tools
            </CardTitle>
            <CardDescription>
              Hand-picked tools that stand out from the crowd
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={null}>
              <ToolCarousel
                tools={featuredTools || []}
                loading={featuredLoading}
                variant="compact"
              />
            </Suspense>
          </CardContent>
        </Card>
        </motion.div>

        {/* Trending Tools - Right Side */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
        >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              Trending Tools
            </CardTitle>
            <CardDescription>
              Popular tools that are gaining momentum
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={null}>
              <ToolCarousel
                tools={trendingTools || []}
                loading={trendingLoading}
                variant="compact"
              />
            </Suspense>
          </CardContent>
        </Card>
        </motion.div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-4 gap-8"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {/* Sidebar - Filters */}
        <motion.div
          className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <CategoryFilter
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                showCounts={true}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-4">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="w-full"
            >
              <Filter className="w-4 h-4 mr-2" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </div>

          {/* Tools Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                {selectedCategory ? 'Filtered Tools' : 'All Tools'}
              </h2>
              <p className="text-muted-foreground">
                {tools?.length || 0} tools found
              </p>
            </div>

            {/* Paginated Tool Grid */}
            <PaginatedToolGrid
              tools={tools || []}
              loading={toolsLoading}
              variant="default"
              initialCount={6}
              incrementCount={6}
              columns={3}
              showResultsCount={true}
            />
          </div>
        </div>
      </motion.div>
      {/* Testimonials Section */}
      <Suspense fallback={null}>
        <Testimonials />
      </Suspense>
    </div>
  );
};
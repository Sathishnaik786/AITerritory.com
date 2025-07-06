import React, { useState, Suspense, lazy } from 'react';
import { useTools, useFeaturedTools, useTrendingTools } from '../hooks/useTools';
import { CategoryFilter } from '../components/CategoryFilter';
import { PaginatedToolGrid } from '../components/PaginatedToolGrid';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { TrendingUp, Star, Filter, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SearchBar from '../components/SearchBar';
import { FAQ } from '../components/FAQ';
import { Button } from '../components/ui/button';

const Testimonials = lazy(() => import('../components/Testimonials'));

const ToolCarousel = React.lazy(() => import('../components/ToolCarousel'));

export const HomePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { data: tools, isLoading: toolsLoading } = useTools({
    category_id: selectedCategory,
    search: searchQuery || undefined,
  });
  const { data: featuredTools, isLoading: featuredLoading } = useFeaturedTools();
  const { data: trendingTools, isLoading: trendingLoading } = useTrendingTools();

  const handleCategoryChange = (categoryId: string | undefined) => {
    setSelectedCategory(categoryId);
    // Close sidebar on mobile after selection
    setIsSidebarOpen(false);
  };

  return (
    <div className="w-full overflow-x-hidden">
      <div className="min-h-screen w-full bg-gradient-to-br from-pink-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-10">
        {/* Hero Section */}
        <motion.div
          className="text-center mb-12 px-4"
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
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12 px-4 max-w-7xl mx-auto"
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

        {/* All Tools Section (Sidebar + Grid) */}
        <div className="max-w-7xl mx-auto px-4 mt-16">
          {/* Mobile Filter Toggle Button */}
          <div className="lg:hidden mb-6">
            <Button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              variant="outline"
              className="w-full justify-start gap-2"
            >
              <Filter className="w-4 h-4" />
              {selectedCategory ? 'Filter Active' : 'Show Filters'}
              {selectedCategory && (
                <span className="ml-auto bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full">
                  Active
                </span>
              )}
            </Button>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar - Mobile Overlay */}
            <AnimatePresence>
              {isSidebarOpen && (
                <motion.div
                  className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsSidebarOpen(false)}
                />
              )}
            </AnimatePresence>

            {/* Sidebar - Mobile Slide-in */}
            <AnimatePresence>
              {isSidebarOpen && (
                <motion.aside
                  className="fixed left-0 top-0 h-full w-80 max-w-[85vw] bg-background border-r border-border z-50 lg:hidden shadow-2xl"
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                >
                  <div className="flex items-center justify-between p-4 border-b border-border">
                    <h2 className="font-bold text-lg">Filters</h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="p-4 overflow-y-auto h-full">
                    <CategoryFilter
                      selectedCategory={selectedCategory}
                      onCategoryChange={handleCategoryChange}
                      showCounts={true}
                    />
                  </div>
                </motion.aside>
              )}
            </AnimatePresence>

            {/* Sidebar - Desktop */}
            <aside className="hidden lg:block w-[300px] flex-shrink-0">
              <div className="bg-muted/50 rounded-xl p-6 sticky top-4">
                <h2 className="font-bold text-lg mb-6">Filters</h2>
                <CategoryFilter
                  selectedCategory={selectedCategory}
                  onCategoryChange={handleCategoryChange}
                  showCounts={true}
                />
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">All Tools</h1>
                <span className="text-muted-foreground text-base">{tools?.length || 0} tools found</span>
              </div>
              <PaginatedToolGrid
                tools={tools || []}
                loading={toolsLoading}
                variant="default"
                initialCount={6}
                incrementCount={6}
                columns={3}
                showResultsCount={false}
              />
            </main>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="w-full overflow-hidden">
          <Suspense fallback={null}>
            <Testimonials />
          </Suspense>
        </div>

        {/* FAQ Section */}
        <div className="w-full overflow-hidden">
          <FAQ />
        </div>
      </div>
    </div>
  );
};
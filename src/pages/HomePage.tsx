import React, { useState, Suspense, lazy } from 'react';
import { useTools, useFeaturedTools, useTrendingTools } from '../hooks/useTools';
import { CategoryFilter } from '../components/CategoryFilter';
import { PaginatedToolGrid } from '../components/PaginatedToolGrid';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { TrendingUp, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import SearchBar from '../components/SearchBar';
import { FAQ } from '../components/FAQ';

const Testimonials = lazy(() => import('../components/Testimonials'));

const ToolCarousel = React.lazy(() => import('../components/ToolCarousel'));

export const HomePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const { data: tools, isLoading: toolsLoading } = useTools({
    category_id: selectedCategory,
    search: searchQuery || undefined,
  });
  const { data: featuredTools, isLoading: featuredLoading } = useFeaturedTools();
  const { data: trendingTools, isLoading: trendingLoading } = useTrendingTools();

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-pink-50 to-gray-100 py-10">
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
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12"
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
          <Card className="dark:bg-[#171717]">
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
          <Card className="dark:bg-[#171717]">
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
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 px-4 mt-16">
        {/* Sidebar */}
        <aside className="w-full lg:w-[300px] flex-shrink-0 mb-8 lg:mb-0">
          <div className="bg-pink-50 rounded-xl p-6 dark:bg-[#171717]">
            <h2 className="font-bold text-lg mb-6">Filters</h2>
            <CategoryFilter
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              showCounts={true}
            />
          </div>
        </aside>
        {/* Main Content */}
        <main className="flex-1">
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

      {/* Testimonials Section */}
      <Suspense fallback={null}>
        <Testimonials />
      </Suspense>

      {/* FAQ Section */}
      <FAQ />
    </div>
  );
};
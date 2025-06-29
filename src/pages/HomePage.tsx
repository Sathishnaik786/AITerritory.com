import React, { useState, useEffect } from 'react';
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
import Testimonials from '../components/Testimonials';

// Carousel component for featured/trending tools
const ToolCarousel = ({ tools, loading, variant }: { tools: Tool[]; loading: boolean; variant: 'featured' | 'compact'; }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(2);
  const interval = 5000; // 5 seconds

  // Responsive cardsToShow
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setCardsToShow(1);
      } else {
        setCardsToShow(2);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!tools || tools.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % (tools.length > cardsToShow ? tools.length : 1));
    }, interval);
    return () => clearInterval(timer);
  }, [tools, cardsToShow]);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (!tools || tools.length === 0) {
    return <div>No tools found.</div>;
  }

  // Get N tools to display, wrap around if needed
  const getDisplayedTools = () => {
    const displayed = [];
    for (let i = 0; i < cardsToShow; i++) {
      displayed.push(tools[(currentIndex + i) % tools.length]);
    }
    return displayed;
  };

  return (
    <div className="w-full flex flex-row gap-4 justify-center items-stretch">
      {getDisplayedTools().map((tool, idx) => (
        <div
          key={tool.id || idx}
          className="flex-1 min-w-0 flex-shrink-0"
        >
          <ToolGrid tools={[tool]} loading={false} variant={variant} columns={1} />
        </div>
      ))}
    </div>
  );
};

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
      <div className="text-center mb-12">
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
      </div>

      {/* Featured and Trending Tools - Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Featured Tools - Left Side */}
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
            <ToolCarousel
              tools={featuredTools || []}
              loading={featuredLoading}
              variant="compact"
            />
          </CardContent>
        </Card>

        {/* Trending Tools - Right Side */}
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
            <ToolCarousel
              tools={trendingTools || []}
              loading={trendingLoading}
              variant="compact"
            />
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar - Filters */}
        <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
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
        </div>

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
      </div>
      {/* Testimonials Section */}
      <Testimonials />
    </div>
  );
};
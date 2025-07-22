import React, { useState, Suspense, lazy, Dispatch, SetStateAction, useEffect, useMemo } from 'react';
import { useTools, useFeaturedTools, useTrendingTools } from '../hooks/useTools';
import { useCategories } from '../hooks/useCategories';
import { CategoryFilter } from '../components/CategoryFilter';
import { PaginatedToolGrid } from '../components/PaginatedToolGrid';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { TrendingUp, Star, Filter, X, Home, Newspaper, LogIn, ChevronDown, Layers, CreditCard, Users, Search, Wrench } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SearchBar from '../components/SearchBar';
import { FAQ } from '../components/FAQ';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ScrollArea } from '../components/ui/scroll-area';
import { Separator } from '../components/ui/separator';
import ThemeToggle from '../components/ThemeToggle';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { Category } from '../types/category';
import { useNavigate } from 'react-router-dom';
import MetaTags from '../components/MetaTags';
import { JsonLd } from 'react-schemaorg';
import { Organization, FAQPage } from 'schema-dts';
import { supabase } from '../services/supabaseClient'; // Adjust path if needed
import { Tool } from '../types/tool';
import { ToolCard, ToolCardStats } from '../components/ToolCard';
import { useUser } from '@clerk/clerk-react';

const Testimonials = lazy(() => import('../components/Testimonials'));

const ToolCarousel = React.lazy(() => import('../components/ToolCarousel'));

// Sidebar navigation items
const sidebarNav = [
  { label: 'Home', icon: Home, to: '/' },
  { label: 'Today Launched', icon: Wrench, to: '/tools?launched=today', badge: 3 },
  { label: 'News Today', icon: Newspaper, to: '/blog', badge: 14 },
];

// Sidebar sort/filter buttons
const sortOptions = [
  { label: 'Sort By', icon: ChevronDown },
  { label: 'Pricing', icon: CreditCard },
  { label: 'Tech Used', icon: Layers },
];

// Example category icon mapping (expand as needed)
const categoryIcons: Record<string, React.ReactNode> = {
  '3d': <Users className="w-4 h-4 text-pink-400" />, // Replace with relevant icons
  'academics': <Users className="w-4 h-4 text-purple-400" />,
  'advertising': <Users className="w-4 h-4 text-red-400" />,
  'affiliate marketing': <Users className="w-4 h-4 text-orange-400" />,
  'agent': <Users className="w-4 h-4 text-blue-400" />,
  'aggregator': <Users className="w-4 h-4 text-green-400" />,
  'analytics': <Users className="w-4 h-4 text-cyan-400" />,
  'animation': <Users className="w-4 h-4 text-yellow-400" />,
  'anime': <Users className="w-4 h-4 text-pink-500" />,
  'answers': <Users className="w-4 h-4 text-yellow-500" />,
  'api': <Users className="w-4 h-4 text-gray-400" />,
};

// Extend Category type locally to include tool_count
interface CategoryWithCount extends Category {
  tool_count?: number;
}

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
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const navigate = useNavigate();
  const { user } = useUser();

  const [stats, setStats] = useState<Record<string, ToolCardStats>>({});

  // Combine all tools into one list to fetch stats for all of them at once
  const allTools = useMemo(() => {
    const combined = [...(tools || []), ...(featuredTools || []), ...(trendingTools || [])];
    // Remove duplicates
    return combined.filter((tool, index, self) => 
      index === self.findIndex((t) => t.id === tool.id)
    );
  }, [tools, featuredTools, trendingTools]);

  useEffect(() => {
    const fetchAllStats = async () => {
      if (allTools.length === 0) return;
      
      const toolIds = allTools.map(t => t.id);
      
      // Fetch likes and bookmarks in parallel
      const [likesRes, bookmarksRes] = await Promise.all([
        supabase.from('likes').select('tool_id, user_id').in('tool_id', toolIds),
        supabase.from('user_bookmarks').select('tool_id, user_id').in('tool_id', toolIds)
      ]);

      const likes = likesRes.data || [];
      const bookmarks = bookmarksRes.data || [];
      
      // Process the data into a stats map
      const statsMap: Record<string, ToolCardStats> = {};
      allTools.forEach(tool => {
        const toolLikes = likes.filter(l => l.tool_id === tool.id);
        const toolBookmarks = bookmarks.filter(b => b.tool_id === tool.id);
        
        statsMap[tool.id] = {
          likes: toolLikes.length,
          bookmarks: toolBookmarks.length,
          userHasLiked: user ? toolLikes.some(l => l.user_id === user.id) : false,
          userHasBookmarked: user ? toolBookmarks.some(b => b.user_id === user.id) : false,
        };
      });
      
      setStats(statsMap);
    };
    
    fetchAllStats();
  }, [allTools, user]);

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => document.body.classList.remove('overflow-hidden');
  }, [isSidebarOpen]);

  const handleCategoryChange = (categoryId: string | undefined) => {
    setSelectedCategory(categoryId);
    // Close sidebar on mobile after selection
    setIsSidebarOpen(false);
  };

  // Organization schema for homepage
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "AI Territory",
    "url": "https://aiterritory.org",
    "logo": "https://aiterritory.org/logo.jpg",
    "sameAs": [
      "https://twitter.com/aiterritory",
      "https://www.facebook.com/aiterritory",
      "https://www.linkedin.com/company/aiterritory"
    ],
    "description": "AI Territory is a curated directory of AI tools, resources, and insights to help creators, businesses, and enthusiasts stay ahead in the world of artificial intelligence."
  };

  return (
    <>
      <MetaTags
        title="AITerritory | Discover the Best AI Tools & Resources"
        description="Explore the best AI tools, resources, and innovations on AITerritory. Find, compare, and review top artificial intelligence solutions for every need."
        image="https://aiterritory.org/og-default.png"
        url="https://aiterritory.org"
      />
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
                    stats={stats}
                    itemsToShow={2}
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
                    stats={stats}
                    itemsToShow={2}
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
                  className="fixed left-0 top-14 h-[calc(100vh-3.5rem)] w-full max-w-[95vw] z-50 lg:hidden p-4 flex flex-col bg-background dark:bg-gray-900"
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                >
                  <SidebarContent
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                      selectedCategory={selectedCategory}
                    handleCategoryChange={handleCategoryChange}
                    categories={categories}
                    categoriesLoading={categoriesLoading}
                    mobile
                  />
                </motion.aside>
              )}
            </AnimatePresence>

            {/* Sidebar - Desktop */}
            <motion.aside
              className="hidden lg:block w-[320px] flex-shrink-0 sticky top-4"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <SidebarContent
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                  selectedCategory={selectedCategory}
                handleCategoryChange={handleCategoryChange}
                categories={categories}
                categoriesLoading={categoriesLoading}
                />
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  {selectedCategory
                    ? (() => {
                        const cat = (categories || []).find((c: CategoryWithCount) => c.id === selectedCategory);
                        return cat ? <><span>{categoryIcons[cat.name.toLowerCase()] || <Users className="w-5 h-5 text-muted-foreground" />}</span>{cat.name}</> : 'Category';
                      })()
                    : 'All Tools'}
                </h1>
                <span className="text-muted-foreground text-base">{tools?.length || 0} tools found</span>
              </div>
              <PaginatedToolGrid
                tools={tools || []}
                loading={toolsLoading}
                variant="default"
                initialCount={9}
                incrementCount={9}
                columns={3}
                showResultsCount={false}
                stats={stats} // Pass the stats map
              />
            </main>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

function SidebarContent({ searchQuery, setSearchQuery, selectedCategory, handleCategoryChange, categories, categoriesLoading, mobile = false }: {
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  selectedCategory: string | undefined;
  handleCategoryChange: (categoryId: string | undefined) => void;
  categories: CategoryWithCount[] | undefined;
  categoriesLoading: boolean;
  mobile?: boolean;
}) {
  return (
    <Card className={`bg-muted/60 rounded-xl p-4 sm:p-6 h-full flex flex-col shadow-xl border border-border/60 w-full ${mobile ? 'overflow-y-auto h-full' : 'max-w-xs sm:max-w-none mx-auto sm:mx-0 overflow-hidden'}`}>
      {/* Top nav */}
      <nav className="mb-4">
        {sidebarNav.map((item, idx) => (
          <a
            key={item.label}
            href={item.to}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-base font-medium hover:bg-accent transition-colors mb-1 group w-full min-h-[44px]"
          >
            <item.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
            <span>{item.label}</span>
            {item.badge && (
              <Badge className="ml-2 bg-green-500 text-white font-bold px-2 py-0.5 text-xs">{item.badge}</Badge>
            )}
          </a>
        ))}
        <div className="flex items-center gap-3 px-3 py-2 mt-2">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="flex items-center gap-2 text-base font-medium text-foreground hover:bg-accent px-2 py-1 rounded-lg transition-colors">
                <LogIn className="w-5 h-5 text-yellow-500" /> Sign In
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </nav>
      {/* Search */}
      <div className="mb-4">
        <SearchBar
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search Tool with AI"
          className="w-full"
        />
      </div>
      {/* Sort/Filter Buttons */}
      <div className="flex flex-col gap-2 mb-4">
        {sortOptions.map(opt => (
          <Button key={opt.label} variant="outline" className="w-full justify-start gap-2">
            <opt.icon className="w-4 h-4" /> {opt.label}
          </Button>
        ))}
      </div>
      {/* Category List */}
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-semibold text-muted-foreground">Category</span>
        <span className="text-xs text-muted-foreground flex items-center gap-1"><Users className="w-4 h-4" /> </span>
      </div>
      <Separator className="mb-2" />
      <ScrollArea className={`flex-1 min-h-0 ${mobile ? 'h-full max-h-full' : 'max-h-[40vh] sm:max-h-[calc(100vh-2rem)]'} pr-2 overflow-y-auto`}>
        {categoriesLoading ? (
          <div className="space-y-2">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-8 bg-muted rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <ul className="space-y-1">
            {categories?.map((cat: CategoryWithCount) => (
              <li key={cat.id}>
                <button
                  className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-accent ${selectedCategory === cat.id ? 'bg-accent text-primary' : 'text-foreground'}`}
                  onClick={() => handleCategoryChange(cat.id)}
                >
                  <span>{categoryIcons[cat.name.toLowerCase()] || <Users className="w-4 h-4 text-muted-foreground" />}</span>
                  <span className="flex-1 text-left truncate">{cat.name}</span>
                  <Badge variant="secondary" className="ml-auto flex-shrink-0">{cat.tool_count || 0}</Badge>
                </button>
              </li>
            ))}
          </ul>
        )}
      </ScrollArea>
    </Card>
  );
}
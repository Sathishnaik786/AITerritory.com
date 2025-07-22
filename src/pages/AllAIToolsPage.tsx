import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PaginatedToolGrid } from '../components/PaginatedToolGrid';
import { useTags } from '../hooks/useTags';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Search, Filter } from 'lucide-react';
import { Tool } from '../types/tool';
import MetaTags from '../components/MetaTags';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '../services/supabaseClient'; // Adjust path
import { ToolCard, ToolCardStats } from '../components/ToolCard'; // Import ToolCardStats

const AllAIToolsPage = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [stats, setStats] = useState<Record<string, ToolCardStats>>({});
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [pricingType, setPricingType] = useState('');
  const [minRating, setMinRating] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const { data: tags, isLoading: tagsLoading } = useTags();
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  const fetchToolsAndStats = async () => {
    setLoading(true);
    setError(null);
    
    // 1. Build query params for fetching tools
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (pricingType) params.append('pricing_type', pricingType);
    if (minRating) params.append('min_rating', minRating);
    if (selectedTag) params.append('tag', selectedTag);
    if (sortBy) params.append('sort', sortBy);
    params.append('limit', '1000');
    
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3004/api';
    try {
      // 2. Fetch the tools
      const toolsRes = await fetch(`${apiBaseUrl}/tools?${params.toString()}`);
      if (!toolsRes.ok) throw new Error('Failed to fetch tools');
      const fetchedTools = await toolsRes.json();
      const toolsData = fetchedTools.tools || fetchedTools;
      setTools(toolsData);
      
      // 3. If tools are found, fetch their stats
      if (toolsData.length > 0) {
        const toolIds = toolsData.map(t => t.id);
        
        const [likesRes, bookmarksRes] = await Promise.all([
          supabase.from('likes').select('tool_id, user_id').in('tool_id', toolIds),
          supabase.from('user_bookmarks').select('tool_id, user_id').in('tool_id', toolIds)
        ]);
        
        const likes = likesRes.data || [];
        const bookmarks = bookmarksRes.data || [];
        
        const statsMap: Record<string, ToolCardStats> = {};
        toolsData.forEach(tool => {
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
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchToolsAndStats();
    // eslint-disable-next-line
  }, [user]); // Refetch stats when user logs in/out

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchToolsAndStats();
  };

  const clearFilters = () => {
    setSearch('');
    setPricingType('');
    setMinRating('');
    setSelectedTag('');
    setSortBy('newest');
  };

  if (error) return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center text-red-600">
        <h2 className="text-xl font-semibold mb-2">Error</h2>
        <p>{error}</p>
      </div>
    </div>
  );

  return (
    <>
      <MetaTags
        title="All AI Tools | AITerritory"
        description="Browse all AI tools on AITerritory. Discover, compare, and review the latest artificial intelligence solutions for every category and use case."
        image="https://aiterritory.org/og-default.png"
        url="https://aiterritory.org/all-ai-tools"
      />
    <div className="container mx-auto px-4 py-8 relative">
      {/* Subtle animated background for depth */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 0.18, y: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="absolute -top-24 left-0 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-purple-400 via-pink-300 to-yellow-200 blur-2xl z-0 pointer-events-none"
        aria-hidden="true"
      />
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="text-center mb-8 relative z-10"
      >
        <h1 className="text-4xl font-bold mb-4">All AI Tools</h1>
        <p className="text-lg text-muted-foreground">
          Discover and explore our comprehensive collection of AI tools
        </p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="mb-8 relative z-10"
      >
        <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Search & Filters
          </CardTitle>
          <CardDescription>
            Find the perfect AI tool for your needs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            {/* Search Bar */}
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Search tools..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button type="submit" className="px-6">
                Search
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filters
              </Button>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t"
                >
                <div>
                  <label className="text-sm font-medium mb-2 block">Pricing</label>
                  <Select value={pricingType} onValueChange={setPricingType}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Pricing" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Pricing</SelectItem>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="Freemium">Freemium</SelectItem>
                      <SelectItem value="Paid">Paid</SelectItem>
                      <SelectItem value="Unknown">Unknown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Min Rating</label>
                  <Select value={minRating} onValueChange={setMinRating}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any Rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any Rating</SelectItem>
                      <SelectItem value="1">1+</SelectItem>
                      <SelectItem value="2">2+</SelectItem>
                      <SelectItem value="3">3+</SelectItem>
                      <SelectItem value="4">4+</SelectItem>
                      <SelectItem value="4.5">4.5+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Tag</label>
                  {tagsLoading ? (
                    <Select disabled>
                      <SelectTrigger>
                        <SelectValue placeholder="Loading tags..." />
                      </SelectTrigger>
                    </Select>
                  ) : (
                    <Select value={selectedTag} onValueChange={setSelectedTag}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Tags" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Tags</SelectItem>
                        {tags && tags.map(tag => (
                          <SelectItem key={tag.id} value={tag.slug}>
                            {tag.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="highest_rating">Highest Rating</SelectItem>
                      <SelectItem value="most_reviewed">Most Reviewed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                </motion.div>
            )}

            {/* Filter Actions */}
            {showFilters && (
              <div className="flex gap-2 pt-4 border-t">
                <Button type="submit" className="px-6">
                  Apply Filters
                </Button>
                <Button type="button" variant="outline" onClick={clearFilters}>
                  Clear All
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
      </motion.div>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">
          {search || pricingType || minRating || selectedTag ? 'Filtered Results' : 'All Tools'}
        </h2>
        <p className="text-muted-foreground">
          {tools.length} tools found
        </p>
      </div>

      {/* Tools Grid with scroll reveal and staggered animations */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="relative z-10"
      >
      <PaginatedToolGrid
        tools={tools}
        loading={loading}
        stats={stats} // Pass the stats map
        variant="default"
        initialCount={9}
        incrementCount={9}
        columns={3}
        showResultsCount={true}
      />
      </motion.div>
    </div>
    </>
  );
};

export default AllAIToolsPage;
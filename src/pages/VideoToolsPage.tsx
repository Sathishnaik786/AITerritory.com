import React, { useEffect, useState } from 'react';
import { ToolGrid } from '../components/ToolGrid';
import { useTags } from '../hooks/useTags';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Search, Filter, ChevronLeft, ChevronRight, Video } from 'lucide-react';
import { Tool } from '../types/tool';
import SEO from '../components/SEO';
import { ResourcePageSkeleton } from '../components/SkeletonLoader';

const VideoToolsPage = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [pricingType, setPricingType] = useState('');
  const [minRating, setMinRating] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const { data: tags, isLoading: tagsLoading } = useTags();
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const fetchTools = () => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (pricingType) params.append('pricing_type', pricingType);
    if (minRating) params.append('min_rating', minRating);
    if (selectedTag) params.append('tag', selectedTag);
    if (sortBy) params.append('sort', sortBy);
    params.append('page', String(page));
    params.append('pageSize', String(pageSize));
    
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3004/api';
    fetch(`${apiBaseUrl}/tools/video-tools?${params.toString()}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch tools');
        return res.json();
      })
      .then(data => {
        setTools(data.tools || data);
        setTotalPages(data.totalPages || 1);
        setError(null);
      })
      .catch(err => {
        setError(err.message || 'An error occurred');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTools();
    // eslint-disable-next-line
  }, [page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchTools();
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setPricingType('');
    setMinRating('');
    setSelectedTag('');
    setSortBy('newest');
    setPage(1);
  };

  if (loading) {
    return <ResourcePageSkeleton />;
  }

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
      <SEO
        title="AI Video Tools | Create & Edit Amazing Videos"
        description="Discover the best AI-powered video tools to create and edit amazing videos, from generation and editing to animation and more."
      />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <Video className="w-8 h-8 text-red-500" />
            Video Tools
          </h1>
          <p className="text-lg text-muted-foreground">
            Create and edit amazing videos with AI-powered video tools
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Search & Filters
            </CardTitle>
            <CardDescription>
              Find the perfect video tool for your creative projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              {/* Search Bar */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Search video tools..."
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
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
                </div>
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

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            {search || pricingType || minRating || selectedTag ? 'Filtered Results' : 'Video Tools'}
          </h2>
          <p className="text-muted-foreground">
            {tools.length} tools found
          </p>
        </div>

        {/* Tools Grid */}
        <ToolGrid
          tools={tools}
          loading={loading}
          variant="default"
          columns={4}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <Button
              variant="outline"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            
            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <Button
                    key={pageNum}
                    variant={page === pageNum ? "default" : "outline"}
                    onClick={() => handlePageChange(pageNum)}
                    className="w-10 h-10 p-0"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="flex items-center gap-2"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default VideoToolsPage;

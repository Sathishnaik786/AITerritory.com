import React, { useEffect, useState } from 'react';
import { ToolGrid } from '../components/ToolGrid';
import { useTags } from '../hooks/useTags';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Search, Filter, ChevronLeft, ChevronRight, Type } from 'lucide-react';
import { Tool } from '../types/tool';

import SEO from '../components/SEO';
import FAQ from '../components/FAQ';
const TextGeneratorsPage = () => {
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
    fetch(`${apiBaseUrl}/tools/text-generators?${params.toString()}`)
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
        title="AI Text Generators - Best AI Writing Tools & Content Generators | AITerritory"
        description="Discover the top AI text generators and writing tools for creating compelling content. Generate blog posts, marketing copy, social media content, and more with advanced AI writing technology. Compare features, pricing, and reviews."
        image="/og-default.png"
        keywords="AI text generators, AI writing tools, content generators, AI writing software, text generation, AI copywriting, content creation tools, AI writing assistants"
      />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
          <Type className="w-8 h-8 text-green-500" />
          AI Text Generators
        </h1>
        <p className="text-lg text-muted-foreground">
          Generate compelling content with AI-powered text generation tools
        </p>
      </div>

      {/* Enhanced Intro Content */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 rounded-lg p-6 border border-green-200/50 dark:border-green-800/50">
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300 mb-4">
              Transform your content creation with the latest <strong>AI text generators</strong> and <strong>AI writing tools</strong>. These powerful <strong>content generators</strong> use advanced language models to help you create high-quality blog posts, marketing copy, social media content, and more in minutes instead of hours.
            </p>
            <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300 mb-4">
              Whether you need <strong>AI writing software</strong> for business content, creative writing assistance, or automated copywriting for your marketing campaigns, our curated selection of <strong>text generation</strong> tools offers something for every content creator. Each tool has been tested and reviewed to ensure it delivers on its promises.
            </p>
            <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
              From <strong>AI copywriting</strong> tools that craft compelling marketing messages to <strong>content creation tools</strong> that generate entire articles, these <strong>AI writing assistants</strong> can significantly boost your productivity and creativity. Explore our collection to find the perfect writing companion for your needs.
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Search & Filters
          </CardTitle>
          <CardDescription>
            Find the perfect text generation tool for your content needs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            {/* Search Bar */}
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Search text generators..."
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
          {search || pricingType || minRating || selectedTag ? 'Filtered Results' : 'Text Generators'}
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
    
    {/* FAQ Section */}
    <FAQ category="ai-text-generators" />
    </>
  );
};

export default TextGeneratorsPage; 
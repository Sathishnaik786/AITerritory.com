import React, { useEffect, useState } from 'react';
import { ToolGrid } from '../components/ToolGrid';
import { useTags } from '../hooks/useTags';
import { useDynamicSEO } from '../hooks/useDynamicSEO';
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
  
  // Dynamic SEO based on current filters
  const dynamicSEO = useDynamicSEO({
    baseTitle: 'AI Video Tools',
    baseDescription: 'Discover the best AI-powered video tools to create and edit amazing videos, from generation and editing to animation and more.',
    baseKeywords: 'AI video tools, video generation, video editing, AI animation, video creation',
    categoryName: 'Video'
  });

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
    
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
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
        title={dynamicSEO.title}
        description={dynamicSEO.description}
        keywords={dynamicSEO.keywords}
        canonical={dynamicSEO.canonical}
        image="https://aiterritory.org/og/categories/video-tools.png"
      />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <Video className="w-8 h-8 text-red-500" />
            AI Video Tools
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Discover the best AI-powered video tools to create, edit, and enhance amazing videos. From video generation and editing to animation and special effects, our curated collection of AI video tools will help you bring your creative visions to life.
          </p>
          
          <div className="mt-6 bg-gradient-to-r from-red-500 to-purple-600 text-white p-4 rounded-lg max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold mb-2">Why Use AI Video Tools?</h2>
            <p className="mb-3">AI video tools can significantly reduce production time, enhance creativity, and make professional-quality video creation accessible to everyone, regardless of technical expertise.</p>
            <ul className="text-left list-disc pl-5 space-y-1">
              <li>Automate time-consuming editing tasks</li>
              <li>Generate unique visual content from text descriptions</li>
              <li>Enhance video quality with AI upscaling</li>
              <li>Create professional effects without expensive equipment</li>
            </ul>
          </div>
        </div>

        {/* Introduction */}
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">Explore AI Video Tools</h2>
          <p className="text-muted-foreground mb-4">
            Our comprehensive collection of AI video tools includes everything from simple video editors to advanced generative AI platforms. 
            Whether you're a content creator, marketer, educator, or hobbyist, you'll find the perfect tools to enhance your video production workflow.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Video Generation</h3>
              <p className="text-sm text-muted-foreground">Create videos from text prompts or images with cutting-edge AI technology.</p>
            </div>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Video Editing</h3>
              <p className="text-sm text-muted-foreground">Automate editing tasks and enhance your videos with AI-powered features.</p>
            </div>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Special Effects</h3>
              <p className="text-sm text-muted-foreground">Add stunning visual effects and animations to captivate your audience.</p>
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
        
        {/* Additional Content */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">Maximizing Your AI Video Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-medium mb-3">Tips for Getting the Best Results</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Start with clear objectives for your video project</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Experiment with different AI tools to find what works best for your style</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Combine multiple AI tools for more complex projects</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Always review and refine AI-generated content before publishing</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-medium mb-3">Popular Use Cases</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Social media content creation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Marketing and promotional videos</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Educational and tutorial content</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Creative storytelling and animation</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VideoToolsPage;

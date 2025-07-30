import React, { useEffect, useState } from 'react';
import ToolCard from '../components/ToolCard';
import { useTags } from '../hooks/useTags';
import SEO from '../components/SEO';
import FAQ from '../components/FAQ';

const BestAIImageGeneratorsPage = () => {
  const [tools, setTools] = useState([]);
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

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3004/api';

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
    fetch(`${apiBaseUrl}/tools/image-generators?${params.toString()}`)
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

  if (loading) return <div>Loading...</div>;
      if (error) return <div style={{ color: 'red' }}>Error: {error.message || 'An error occurred'}</div>;

  return (
    <>
      <SEO
        title="Best AI Image Generators | AITerritory"
        description="Generate stunning images using AI-powered tools. Browse the best AI Image Generators curated by AITerritory."
        image="/og-default.png"
        keywords="AI image generators, image creation, AI art, text-to-image, image generation tools"
      />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            Best AI Image Generators
          </h1>
          <p className="text-xl text-muted-foreground">
            Generate stunning images using AI-powered tools
          </p>
        </div>
        
        <form onSubmit={handleSearch} style={{ marginBottom: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Search tools..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc', minWidth: 200 }}
          />
          <select
            value={pricingType}
            onChange={e => setPricingType(e.target.value)}
            style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
          >
            <option value="">All Pricing</option>
            <option value="free">Free</option>
            <option value="Freemium">Freemium</option>
            <option value="Paid">Paid</option>
            <option value="Unknown">Unknown</option>
          </select>
          <select
            value={minRating}
            onChange={e => setMinRating(e.target.value)}
            style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
          >
            <option value="">Any Rating</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="4.5">4.5+</option>
          </select>
          {tagsLoading ? (
            <select disabled style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc', minWidth: 120 }}>
              <option>Loading tags...</option>
            </select>
          ) : (
            <select
              value={selectedTag}
              onChange={e => setSelectedTag(e.target.value)}
              style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc', minWidth: 120 }}
            >
              <option value="">All Tags</option>
              {tags && tags.map(tag => (
                <option key={tag.id} value={tag.slug}>{tag.name}</option>
              ))}
            </select>
          )}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc', minWidth: 120 }}
          >
            <option value="newest">Newest</option>
            <option value="highest_rating">Highest Rating</option>
            <option value="most_reviewed">Most Reviewed</option>
          </select>
          <button type="submit" style={{ padding: 8, borderRadius: 4, background: '#2563eb', color: '#fff', border: 'none' }}>
            Search
          </button>
        </form>
        
        <div className="tool-list">
          {tools.length === 0 ? (
            <div>No results found.</div>
          ) : (
            tools.map(tool => <ToolCard key={tool.id} tool={tool} />)
          )}
        </div>
        
        {/* Pagination Controls */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 24 }}>
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc', background: page === 1 ? '#eee' : '#fff' }}
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              style={{
                padding: 8,
                borderRadius: 4,
                border: '1px solid #2563eb',
                background: page === i + 1 ? '#2563eb' : '#fff',
                color: page === i + 1 ? '#fff' : '#2563eb',
                fontWeight: page === i + 1 ? 'bold' : 'normal',
              }}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc', background: page === totalPages ? '#eee' : '#fff' }}
          >
            Next
          </button>
        </div>
      </div>
      
      {/* FAQ Section */}
      <FAQ category="ai-image-generators" />
    </>
  );
};

export default BestAIImageGeneratorsPage; 
// SourcesPanel.tsx
// Left-side sources/discovery list showing used sources and discovery options
// Collapsible panel with search and filtering capabilities

import { useState, memo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SourceBadge } from './SourceBadge';
import { Search, X } from 'lucide-react';

interface Source {
  id: string;
  domain: string;
  title: string;
  snippet: string;
  url: string;
  confidence?: number;
  usedInCurrentAnswer?: boolean;
}

const mockSources: Source[] = [
  {
    id: '1',
    domain: 'aiterritory.com',
    title: 'AITerritory SEO Auditor Documentation',
    snippet: 'Learn how to use our powerful SEO auditing tools to improve your website performance...',
    url: 'https://aiterritory.com/docs/seo-auditor',
    confidence: 95,
    usedInCurrentAnswer: true
  },
  {
    id: '2',
    domain: 'aiterritory.com',
    title: 'Content Generation Best Practices',
    snippet: 'Tips and techniques for creating high-quality AI-assisted content that converts...',
    url: 'https://aiterritory.com/docs/content-generation',
    confidence: 87,
    usedInCurrentAnswer: true
  },
  {
    id: '3',
    domain: 'blog.aiterritory.com',
    title: 'New Features in AITerritory v2.0',
    snippet: 'Explore the latest updates and enhancements in our platform including improved analytics...',
    url: 'https://blog.aiterritory.com/v2-features',
    confidence: 78,
    usedInCurrentAnswer: false
  },
  {
    id: '4',
    domain: 'help.aiterritory.com',
    title: 'Getting Started Guide',
    snippet: 'A comprehensive guide to setting up and using AITerritory for the first time...',
    url: 'https://help.aiterritory.com/getting-started',
    confidence: 92,
    usedInCurrentAnswer: false
  }
];

const filterOptions = [
  { id: 'all', label: 'All' },
  { id: 'docs', label: 'Docs' },
  { id: 'blogs', label: 'Blogs' },
  { id: 'tools', label: 'Tools' },
  { id: 'tutorials', label: 'Tutorials' }
];

interface SourcesPanelProps {
  debugAnalytics?: boolean;
  onSourceClick?: (url: string) => void;
}

function SourcesPanelComponent({ 
  debugAnalytics = false,
  onSourceClick
}: SourcesPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [expandedSources, setExpandedSources] = useState<Record<string, boolean>>({});

  const toggleSourceExpand = (id: string) => {
    setExpandedSources(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleSourceClick = (url: string) => {
    onSourceClick?.(url);
    
    // Analytics callback
    if (typeof window !== 'undefined') {
      if (window.dataLayer) {
        window.dataLayer.push({
          event: 'perplexity_ui_interaction',
          action: 'source_click',
          sourceUrl: url
        });
      } else if (debugAnalytics) {
        console.debug('Analytics event: perplexity_ui_interaction', {
          action: 'source_click',
          sourceUrl: url
        });
      }
    }
  };

  const filteredSources = mockSources.filter(source => {
    const matchesSearch = source.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          source.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          source.snippet.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'docs' && source.domain.includes('docs')) ||
                         (selectedFilter === 'blogs' && source.domain.includes('blog')) ||
                         (selectedFilter === 'tools' && source.title.toLowerCase().includes('tool')) ||
                         (selectedFilter === 'tutorials' && source.title.toLowerCase().includes('tutorial'));
    
    return matchesSearch && matchesFilter;
  });

  const usedSources = filteredSources.filter(source => source.usedInCurrentAnswer);
  const otherSources = filteredSources.filter(source => !source.usedInCurrentAnswer);

  return (
    <div className="flex flex-col h-full" role="region" aria-label="Sources panel">
      {/* Panel Header */}
      <div className="p-4 border-b border-border/40">
        <h2 className="text-lg font-semibold">Sources</h2>
        <p className="text-sm text-muted-foreground">Discover and explore information</p>
      </div>

      {/* Search and Filters */}
      <div className="p-4 border-b border-border/40">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search sources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10"
            aria-label="Search sources"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-5 w-5 rounded-full focus:ring-2 focus:ring-ring focus:ring-offset-2"
              aria-label="Clear search"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Source filters">
          {filterOptions.map((option) => (
            <Button
              key={option.id}
              variant={selectedFilter === option.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter(option.id)}
              className="rounded-full text-xs h-7 focus:ring-2 focus:ring-ring focus:ring-offset-2"
              aria-selected={selectedFilter === option.id}
              role="tab"
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Sources List */}
      <div className="flex-1 overflow-y-auto p-4">
        {usedSources.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-foreground mb-3 flex items-center">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-2" aria-hidden="true"></span>
              Used in current answer
            </h3>
            <div className="space-y-3">
              {usedSources.map((source) => (
                <SourceBadge
                  key={source.id}
                  source={source}
                  isExpanded={expandedSources[source.id]}
                  onToggleExpand={() => toggleSourceExpand(source.id)}
                  onClick={() => handleSourceClick(source.url)}
                  debugAnalytics={debugAnalytics}
                />
              ))}
            </div>
          </div>
        )}

        {otherSources.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3">Discover more</h3>
            <div className="space-y-3">
              {otherSources.map((source) => (
                <SourceBadge
                  key={source.id}
                  source={source}
                  isExpanded={expandedSources[source.id]}
                  onToggleExpand={() => toggleSourceExpand(source.id)}
                  onClick={() => handleSourceClick(source.url)}
                  debugAnalytics={debugAnalytics}
                />
              ))}
            </div>
          </div>
        )}

        {filteredSources.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No sources found</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Memoize the component to prevent unnecessary re-renders
export const SourcesPanel = memo(SourcesPanelComponent);

export default SourcesPanel;
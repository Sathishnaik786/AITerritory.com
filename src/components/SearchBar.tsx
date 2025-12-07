// SearchBar.tsx
// Top query/search bar component with suggestions and recent queries
// Handles user input and triggers search functionality

import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Mic, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  isLoading?: boolean;
}

export function SearchBar({ onSearch, placeholder = "Ask anything about AITerritory — try: 'SEO auditor features'", isLoading = false }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [recentQueries, setRecentQueries] = useState<string[]>([
    'What is AITerritory?',
    'How to use the SEO auditor?',
    'Features of the content generator',
    'Pricing plans'
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      // Add to recent queries (in a real app, this would be persisted)
      setRecentQueries(prev => {
        const newQueries = [query.trim(), ...prev.filter(q => q !== query.trim())];
        return newQueries.slice(0, 5); // Keep only last 5
      });
      setQuery('');
    }
  };

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    onSearch(suggestion);
  };

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)} // Delay to allow clicking suggestions
            placeholder={placeholder}
            disabled={isLoading}
            className="w-full pl-12 pr-24 py-6 text-base rounded-2xl border-border/40 bg-background/80 backdrop-blur-lg shadow-lg focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Ask a question about AITerritory"
            role="searchbox"
          />
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleClear}
              className="absolute right-16 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-full focus:ring-2 focus:ring-ring focus:ring-offset-2"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 h-10 w-10 rounded-full focus:ring-2 focus:ring-ring focus:ring-offset-2"
            aria-label="Voice search"
          >
            <Mic className="h-5 w-5" />
          </Button>
          <Button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="absolute right-28 top-1/2 transform -translate-y-1/2 h-10 rounded-xl px-4 bg-primary hover:bg-primary/90 focus:ring-2 focus:ring-ring focus:ring-offset-2"
            aria-label="Submit question"
          >
            {isLoading ? (
              <div className="h-4 w-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
            ) : (
              <span className="font-medium">Ask</span>
            )}
          </Button>
        </div>
      </form>

      {/* Suggestions and recent queries */}
      <AnimatePresence>
        {isFocused && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="mt-3 space-y-2"
            style={{ willChange: 'transform, opacity' }} // GPU acceleration for animations
          >
            {recentQueries.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Recent searches</p>
                <div className="flex flex-wrap gap-2">
                  {recentQueries.map((recentQuery, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSuggestionClick(recentQuery)}
                      className="text-xs px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 transition-colors focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      aria-label={`Search for: ${recentQuery}`}
                    >
                      {recentQuery}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SearchBar;
// SourceBadge.tsx
// Individual source display component with expandable details
// Shows domain, title, snippet, and confidence score

import { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ExternalLink } from 'lucide-react';

interface Source {
  id: string;
  domain: string;
  title: string;
  snippet: string;
  url: string;
  confidence?: number;
  usedInCurrentAnswer?: boolean;
}

interface SourceBadgeProps {
  source: Source;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onClick?: () => void;
  debugAnalytics?: boolean;
}

function SourceBadgeComponent({ 
  source, 
  isExpanded, 
  onToggleExpand,
  onClick,
  debugAnalytics = false
}: SourceBadgeProps) {
  const [faviconError, setFaviconError] = useState(false);

  const handleSourceClick = () => {
    onClick?.();
    
    // Analytics callback
    if (typeof window !== 'undefined') {
      if (window.dataLayer) {
        window.dataLayer.push({
          event: 'perplexity_ui_interaction',
          action: 'source_badge_click',
          sourceUrl: source.url
        });
      } else if (debugAnalytics) {
        console.debug('Analytics event: perplexity_ui_interaction', {
          action: 'source_badge_click',
          sourceUrl: source.url
        });
      }
    }
  };

  return (
    <motion.div
      layout
      className={`border rounded-lg p-3 cursor-pointer transition-all duration-200 hover:shadow-md ${
        source.usedInCurrentAnswer ? 'border-green-500/30 bg-green-50/50 dark:bg-green-950/20' : 'border-border/60'
      }`}
      onClick={handleSourceClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      role="button"
      tabIndex={0}
      aria-expanded={isExpanded}
      aria-label={`Source: ${source.title}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleSourceClick();
        }
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-2 min-w-0">
          {/* Favicon or fallback */}
          {!faviconError ? (
            <img
              src={`https://www.google.com/s2/favicons?domain=${source.domain}&sz=32`}
              alt=""
              className="w-5 h-5 mt-0.5 flex-shrink-0"
              onError={() => setFaviconError(true)}
            />
          ) : (
            <div className="w-5 h-5 mt-0.5 flex-shrink-0 rounded bg-muted flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                <path fillRule="evenodd" d="M19.902 4.098a3.75 3.75 0 00-5.304 0l-4.5 4.5a3.75 3.75 0 001.035 6.037.75.75 0 01-.646 1.353 5.25 5.25 0 01-1.449-8.45l4.5-4.5a5.25 5.25 0 117.424 7.424l-1.757 1.757a.75.75 0 11-1.06-1.06l1.757-1.757a3.75 3.75 0 000-5.304zm-7.389 4.267a.75.75 0 011-.353 5.25 5.25 0 011.449 8.45l-4.5 4.5a5.25 5.25 0 11-7.424-7.424l1.757-1.757a.75.75 0 111.06 1.06l-1.757 1.757a3.75 3.75 0 105.304 5.304l4.5-4.5a3.75 3.75 0 00-1.035-6.037.75.75 0 01-.353-1z" clipRule="evenodd" />
              </svg>
            </div>
          )}
          
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-2">
              <h4 className="font-medium text-sm truncate">{source.title}</h4>
              {source.confidence && (
                <Badge 
                  variant="secondary" 
                  className="text-xs px-1.5 py-0 h-5"
                  aria-label={`Confidence score: ${source.confidence}%`}
                >
                  {source.confidence}%
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground truncate">{source.domain}</p>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onToggleExpand();
            
            // Analytics callback for expand/collapse
            if (typeof window !== 'undefined') {
              if (window.dataLayer) {
                window.dataLayer.push({
                  event: 'perplexity_ui_interaction',
                  action: 'source_expand_toggle',
                  expanded: !isExpanded,
                  sourceUrl: source.url
                });
              } else if (debugAnalytics) {
                console.debug('Analytics event: perplexity_ui_interaction', {
                  action: 'source_expand_toggle',
                  expanded: !isExpanded,
                  sourceUrl: source.url
                });
              }
            }
          }}
          className="h-6 w-6 ml-2 flex-shrink-0 rounded-full focus:ring-2 focus:ring-ring focus:ring-offset-2"
          aria-label={isExpanded ? "Collapse source details" : "Expand source details"}
        >
          <ChevronDown 
            className={`h-4 w-4 transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`} 
          />
        </Button>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-3 pt-3 border-t border-border/40">
              <p className="text-sm text-muted-foreground mb-2">{source.snippet}</p>
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(source.url, '_blank');
                    
                    // Analytics callback for external link
                    if (typeof window !== 'undefined') {
                      if (window.dataLayer) {
                        window.dataLayer.push({
                          event: 'perplexity_ui_interaction',
                          action: 'source_external_link_click',
                          sourceUrl: source.url
                        });
                      } else if (debugAnalytics) {
                        console.debug('Analytics event: perplexity_ui_interaction', {
                          action: 'source_external_link_click',
                          sourceUrl: source.url
                        });
                      }
                    }
                  }}
                  className="text-xs h-7 focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  Visit <ExternalLink className="ml-1.5 h-3 w-3" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Memoize to prevent unnecessary re-renders
export const SourceBadge = memo(SourceBadgeComponent);

export default SourceBadge;
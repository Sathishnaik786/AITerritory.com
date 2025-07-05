import React, { useState } from 'react';
import { Tool } from '../types/tool';
import { ToolCard } from './ToolCard';
import { Button } from './ui/button';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PaginatedToolGridProps {
  tools: Tool[];
  loading?: boolean;
  variant?: 'default' | 'featured' | 'compact';
  initialCount?: number;
  incrementCount?: number;
  columns?: 1 | 2 | 3 | 4;
  showResultsCount?: boolean;
}

export const PaginatedToolGrid: React.FC<PaginatedToolGridProps> = ({
  tools,
  loading = false,
  variant = 'default',
  initialCount = 6,
  incrementCount = 6,
  columns = 3,
  showResultsCount = true,
}) => {
  const [displayedCount, setDisplayedCount] = useState(initialCount);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const displayedTools = tools.slice(0, displayedCount);
  const hasMoreTools = displayedCount < tools.length;

  const getGridCols = () => {
    switch (columns) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-1 sm:grid-cols-2';
      case 3: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
      case 4: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
      default: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
    }
  };

  const handleShowMore = async () => {
    setIsLoadingMore(true);
    // Simulate loading delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
    setDisplayedCount(prev => prev + incrementCount);
    setIsLoadingMore(false);
  };

  if (loading) {
    return (
      <div className={`grid ${getGridCols()} gap-3 sm:gap-4 lg:gap-5`}>
        {Array.from({ length: initialCount }).map((_, index) => (
          <div key={index} className="space-y-3 h-full">
            <div className="h-48 w-full rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
            <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
            <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (tools.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">No tools found</p>
        <p className="text-sm text-muted-foreground mt-2">
          Try adjusting your search criteria or filters
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tools Grid */}
      <AnimatePresence>
        <motion.div 
          key={displayedCount}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`grid ${getGridCols()} gap-3 sm:gap-4 lg:gap-5 auto-rows-fr`}
        >
          {displayedTools.map((tool, index) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="h-full flex"
            >
              <ToolCard tool={tool} variant={variant} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Show More Button */}
      {hasMoreTools && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center pt-6"
        >
          <Button
            onClick={handleShowMore}
            disabled={isLoadingMore}
            variant="outline"
            size="lg"
            className="group hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white transition-all duration-300 w-full sm:w-auto"
          >
            {isLoadingMore ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                Loading...
              </>
            ) : (
              <>
                Show More Tools
                <ChevronDown className="w-4 h-4 ml-2 group-hover:translate-y-1 transition-transform duration-300" />
              </>
            )}
          </Button>
        </motion.div>
      )}

      {/* Results Count */}
      {showResultsCount && (
        <div className="text-center text-sm text-muted-foreground pt-4">
          Showing {displayedTools.length} of {tools.length} tools
        </div>
      )}
    </div>
  );
}; 
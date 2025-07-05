import React from 'react';
import { Tool } from '../types/tool';
import { ToolCard } from './ToolCard';
import { Skeleton } from './ui/skeleton';

interface ToolGridProps {
  tools: Tool[];
  loading?: boolean;
  variant?: 'default' | 'featured' | 'compact';
  columns?: 1 | 2 | 3 | 4;
}

export const ToolGrid: React.FC<ToolGridProps> = ({
  tools,
  loading = false,
  variant = 'default',
  columns = 3
}) => {
  const getGridCols = () => {
    switch (columns) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-1 sm:grid-cols-2';
      case 3: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
      case 4: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
      default: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
    }
  };

  if (loading) {
    return (
      <div className={`grid ${getGridCols()} gap-3 sm:gap-4 lg:gap-5`}>
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="space-y-3 h-full">
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
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
    <div className={`grid ${getGridCols()} gap-3 sm:gap-4 lg:gap-5 auto-rows-fr`}>
      {tools.map((tool) => (
        <div key={tool.id} className="h-full flex">
          <ToolCard tool={tool} variant={variant} />
        </div>
      ))}
    </div>
  );
};
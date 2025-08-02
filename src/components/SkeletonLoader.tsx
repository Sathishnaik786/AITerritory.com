import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonLoaderProps {
  variant?: 'text' | 'rectangular' | 'circular';
  width?: string | number;
  height?: string | number;
  count?: number;
  className?: string;
  animation?: 'pulse' | 'wave' | 'none';
  spacing?: 'none' | 'sm' | 'md' | 'lg';
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  variant = 'rectangular',
  width,
  height,
  count = 1,
  className = '',
  animation = 'pulse',
  spacing = 'md'
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'text':
        return 'h-4 bg-gray-200 dark:bg-gray-700 rounded';
      case 'circular':
        return 'bg-gray-200 dark:bg-gray-700 rounded-full';
      case 'rectangular':
      default:
        return 'bg-gray-200 dark:bg-gray-700 rounded';
    }
  };

  const getAnimationClasses = () => {
    switch (animation) {
      case 'pulse':
        return 'animate-pulse';
      case 'wave':
        return 'animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700';
      case 'none':
        return '';
      default:
        return 'animate-pulse';
    }
  };

  const getSpacingClasses = () => {
    switch (spacing) {
      case 'none':
        return '';
      case 'sm':
        return 'space-y-2';
      case 'md':
        return 'space-y-3';
      case 'lg':
        return 'space-y-4';
      default:
        return 'space-y-3';
    }
  };

  const skeletonStyle = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  const SkeletonItem = () => (
    <div
      className={cn(
        getVariantClasses(),
        getAnimationClasses(),
        className
      )}
      style={skeletonStyle}
    />
  );

  if (count === 1) {
    return <SkeletonItem />;
  }

  return (
    <div className={getSpacingClasses()}>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonItem key={index} />
      ))}
    </div>
  );
};

// Specialized skeleton components for common use cases
export const BlogCardSkeleton: React.FC<{ count?: number; compact?: boolean }> = ({ 
  count = 3, 
  compact = false 
}) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden ${
            compact ? 'flex items-center gap-3 p-3' : ''
          }`}
        >
          <div className={`bg-gray-200 dark:bg-gray-700 animate-pulse ${
            compact ? 'w-16 h-16' : 'h-32'
          }`} />
          <div className={compact ? 'flex-1 space-y-2' : 'p-4 space-y-2'}>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const BlogDetailSkeleton: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Back button skeleton */}
      <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      
      {/* Category skeleton */}
      <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      
      {/* Title skeleton */}
      <div className="space-y-2">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
      </div>
      
      {/* Author info skeleton */}
      <div className="flex items-center gap-2">
        <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>
      
      {/* Meta info skeleton */}
      <div className="flex items-center gap-4">
        <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>
      
      {/* Cover image skeleton */}
      <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
      
      {/* Content skeleton */}
      <div className="space-y-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-5/6" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const CommentsSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const NavigationSkeleton: React.FC = () => {
  return (
    <div className="flex items-center justify-between gap-4 py-8">
      <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse flex-1" />
      <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse flex-1" />
    </div>
  );
};

export default SkeletonLoader; 
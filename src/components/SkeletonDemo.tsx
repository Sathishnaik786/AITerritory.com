import React from 'react';
import { SkeletonLoader, BlogCardSkeleton, BlogDetailSkeleton, CommentsSkeleton, NavigationSkeleton } from './SkeletonLoader';

const SkeletonDemo: React.FC = () => {
  return (
    <div className="p-8 space-y-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Skeleton Loader Demo</h1>
        <p className="text-gray-600 dark:text-gray-400">Showcasing all skeleton loader variants and use cases</p>
      </div>

      {/* Basic Skeleton Variants */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Basic Skeleton Variants</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Text Variant</h3>
            <div className="space-y-2">
              <SkeletonLoader variant="text" width="100%" />
              <SkeletonLoader variant="text" width="75%" />
              <SkeletonLoader variant="text" width="50%" />
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Rectangular Variant</h3>
            <div className="space-y-2">
              <SkeletonLoader variant="rectangular" width="100%" height="20px" />
              <SkeletonLoader variant="rectangular" width="200px" height="100px" />
              <SkeletonLoader variant="rectangular" width="150px" height="40px" />
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Circular Variant</h3>
            <div className="space-y-2">
              <SkeletonLoader variant="circular" width="40px" height="40px" />
              <SkeletonLoader variant="circular" width="60px" height="60px" />
              <SkeletonLoader variant="circular" width="80px" height="80px" />
            </div>
          </div>
        </div>
      </section>

      {/* Animation Variants */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Animation Variants</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Pulse Animation</h3>
            <SkeletonLoader variant="text" width="100%" animation="pulse" />
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Wave Animation</h3>
            <SkeletonLoader variant="text" width="100%" animation="wave" />
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">No Animation</h3>
            <SkeletonLoader variant="text" width="100%" animation="none" />
          </div>
        </div>
      </section>

      {/* Multiple Items */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Multiple Items</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Multiple Text Items</h3>
            <SkeletonLoader variant="text" count={5} spacing="md" />
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Multiple Circular Items</h3>
            <div className="flex gap-4">
              <SkeletonLoader variant="circular" width="40px" height="40px" count={3} />
            </div>
          </div>
        </div>
      </section>

      {/* Specialized Components */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Specialized Components</h2>
        
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-medium mb-4">Blog Card Skeleton</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <BlogCardSkeleton count={3} />
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Blog Detail Skeleton</h3>
            <BlogDetailSkeleton />
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Comments Skeleton</h3>
            <CommentsSkeleton count={3} />
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Navigation Skeleton</h3>
            <NavigationSkeleton />
          </div>
        </div>
      </section>

      {/* Usage Examples */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Usage Examples</h2>
        
        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Code Examples</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Basic Usage</h4>
              <pre className="bg-gray-900 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`// Basic skeleton
<SkeletonLoader variant="text" width="100%" />

// Multiple items
<SkeletonLoader variant="rectangular" count={3} spacing="md" />

// Custom dimensions
<SkeletonLoader variant="circular" width="40px" height="40px" />`}
              </pre>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Specialized Components</h4>
              <pre className="bg-gray-900 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`// Blog card skeleton
<BlogCardSkeleton count={3} compact={false} />

// Blog detail skeleton
<BlogDetailSkeleton />

// Comments skeleton
<CommentsSkeleton count={5} />

// Navigation skeleton
<NavigationSkeleton />`}
              </pre>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">With Loading States</h4>
              <pre className="bg-gray-900 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`// In your component
{isLoading ? (
  <BlogCardSkeleton count={6} />
) : (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {blogs.map(blog => (
      <BlogCard key={blog.id} blog={blog} />
    ))}
  </div>
)}`}
              </pre>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SkeletonDemo; 
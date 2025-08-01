import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface RelatedItem {
  id: string;
  title: string;
  description: string;
  url: string;
  image?: string;
  category?: string;
  tags?: string[];
}

interface RelatedItemsProps {
  currentPageType: 'tool' | 'blog' | 'category';
  currentPageId?: string;
  currentCategory?: string;
  currentTags?: string[];
  maxItems?: number;
}

const RelatedItems: React.FC<RelatedItemsProps> = ({
  currentPageType,
  currentPageId,
  currentCategory,
  currentTags = [],
  maxItems = 6
}) => {
  const [relatedItems, setRelatedItems] = useState<RelatedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRelatedItems = async () => {
      try {
        setLoading(true);
        setError(null);

        let apiEndpoint = '';
        let queryParams = new URLSearchParams();

        // Determine API endpoint based on page type
        switch (currentPageType) {
          case 'tool':
            apiEndpoint = '/api/tools/related';
            if (currentCategory) queryParams.append('category', currentCategory);
            if (currentPageId) queryParams.append('exclude', currentPageId);
            if (currentTags.length > 0) {
              currentTags.forEach(tag => queryParams.append('tags', tag));
            }
            break;

          case 'blog':
            apiEndpoint = '/api/blogs/related';
            if (currentPageId) queryParams.append('exclude', currentPageId);
            if (currentTags.length > 0) {
              currentTags.forEach(tag => queryParams.append('tags', tag));
            }
            break;

          case 'category':
            apiEndpoint = '/api/tools/';
            if (currentCategory) queryParams.append('category', currentCategory);
            break;

          default:
            throw new Error('Invalid page type');
        }

        queryParams.append('limit', maxItems.toString());

        const response = await fetch(`${apiEndpoint}?${queryParams.toString()}`, {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'AITerritory-RelatedItems/1.0'
          },
          signal: AbortSignal.timeout(8000) // 8 second timeout
        });

        if (!response.ok) {
          throw new Error(`API returned ${response.status}`);
        }

        const data = await response.json();
        
        // Transform data to consistent format
        const items: RelatedItem[] = Array.isArray(data) ? data : data.items || data.results || [];
        
        setRelatedItems(items.slice(0, maxItems));

      } catch (error) {
        console.error('Failed to fetch related items:', error);
        setError('Unable to load related items');
        // Don't show error to user, just don't display the widget
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedItems();
  }, [currentPageType, currentPageId, currentCategory, currentTags, maxItems]);

  // Don't render if loading or error (graceful fallback)
  if (loading || error || relatedItems.length === 0) {
    return null;
  }

  const getSectionTitle = () => {
    switch (currentPageType) {
      case 'tool':
        return 'Related AI Tools';
      case 'blog':
        return 'Related Articles';
      case 'category':
        return 'More Tools in This Category';
      default:
        return 'Related Items';
    }
  };

  const getItemUrl = (item: RelatedItem) => {
    switch (currentPageType) {
      case 'tool':
        return `/tools/${item.id}`;
      case 'blog':
        return `/blog/${item.id}`;
      case 'category':
        return `/tools/${item.id}`;
      default:
        return item.url;
    }
  };

  return (
    <section className="related-items-section bg-gray-50 dark:bg-gray-900 py-12 mt-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            {getSectionTitle()}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedItems.map((item, index) => (
              <article 
                key={item.id || index}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
              >
                <Link 
                  to={getItemUrl(item)}
                  className="block p-6 h-full"
                  aria-label={`View ${item.title}`}
                >
                  {item.image && (
                    <div className="mb-4">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-32 object-cover rounded-md"
                        loading="lazy"
                      />
                    </div>
                  )}
                  
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {item.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-3">
                    {item.description}
                  </p>
                  
                  {item.category && (
                    <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full">
                      {item.category}
                    </span>
                  )}
                </Link>
              </article>
            ))}
          </div>
          
          {/* SEO-friendly internal link to category or related section */}
          {currentCategory && currentPageType === 'tool' && (
            <div className="text-center mt-8">
              <Link
                to={`/categories/${currentCategory}`}
                className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
              >
                View all {currentCategory} tools
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default RelatedItems; 
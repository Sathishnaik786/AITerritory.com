import { QueryClient } from '@tanstack/react-query';

// Manual localStorage persistence implementation
const CACHE_KEY = 'AITerritory-QueryCache';
const CACHE_VERSION = 'v1';

// Helper functions for localStorage persistence
const getStoredCache = () => {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(CACHE_KEY);
    if (!stored) return null;
    
    const parsed = JSON.parse(stored);
    if (parsed.version !== CACHE_VERSION) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    
    return parsed.data;
  } catch (error) {
    console.warn('Failed to load cached queries:', error);
    return null;
  }
};

const setStoredCache = (data: any) => {
  if (typeof window === 'undefined') return;
  
  try {
    const cacheData = {
      version: CACHE_VERSION,
      timestamp: Date.now(),
      data
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
  } catch (error) {
    console.warn('Failed to save cached queries:', error);
  }
};

// Create the query client with persistence
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    },
    mutations: {
      retry: 1,
    },
  },
});

// Initialize persistence on client side
if (typeof window !== 'undefined') {
  // Load cached data on initialization
  const cachedData = getStoredCache();
  if (cachedData) {
    try {
      queryClient.setQueryData(cachedData);
      console.log('Loaded cached queries from localStorage');
    } catch (error) {
      console.warn('Failed to restore cached queries:', error);
    }
  }

  // Set up cache persistence
  const unsubscribe = queryClient.getQueryCache().subscribe(() => {
    const queryCache = queryClient.getQueryCache();
    const queries = queryCache.getAll();
    
    // Only persist non-stale queries
    const validQueries = queries.filter(query => {
      const isStale = query.isStale();
      const hasData = query.state.data !== undefined;
      const isRecent = Date.now() - (query.state.dataUpdatedAt || 0) < 24 * 60 * 60 * 1000; // 24 hours
      
      return !isStale && hasData && isRecent;
    });

    if (validQueries.length > 0) {
      const cacheData = validQueries.reduce((acc, query) => {
        acc[query.queryHash] = {
          data: query.state.data,
          dataUpdatedAt: query.state.dataUpdatedAt,
          queryKey: query.queryKey,
        };
        return acc;
      }, {} as any);

      setStoredCache(cacheData);
    }
  });

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    unsubscribe();
  });
}

// Utility function to clear persisted cache
export const clearPersistedCache = () => {
  if (typeof window !== 'undefined') {
    // Clear the localStorage entry
    localStorage.removeItem(CACHE_KEY);
    
    // Clear the query client cache
    queryClient.clear();
    
    console.log('Persisted cache cleared successfully');
  }
};

// Utility function to get cache size info
export const getCacheInfo = () => {
  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        const queryCount = Object.keys(parsed.data || {}).length;
        return {
          size: new Blob([cached]).size,
          queryCount,
          mutationCount: 0, // Not tracking mutations in this implementation
          timestamp: parsed.timestamp,
          version: parsed.version,
        };
      } catch (error) {
        console.warn('Failed to parse cache info:', error);
      }
    }
  }
  return { size: 0, queryCount: 0, mutationCount: 0, timestamp: 0, version: CACHE_VERSION };
};

// Utility function to check if cache is empty
export const isCacheEmpty = () => {
  const info = getCacheInfo();
  return info.queryCount === 0;
};

// Export cache version for potential updates
export { CACHE_VERSION }; 
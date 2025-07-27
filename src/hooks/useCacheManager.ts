import { useCallback } from 'react';
import { clearPersistedCache, getCacheInfo } from '../lib/queryClient';
import { toast } from 'sonner';

export const useCacheManager = () => {
  const clearCache = useCallback(async () => {
    try {
      clearPersistedCache();
      toast.success('Cache cleared successfully');
      return true;
    } catch (error) {
      console.error('Error clearing cache:', error);
      toast.error('Failed to clear cache');
      return false;
    }
  }, []);

  const getCacheStats = useCallback(() => {
    return getCacheInfo();
  }, []);

  const isCacheEmpty = useCallback(() => {
    const stats = getCacheInfo();
    return stats.queryCount === 0;
  }, []);

  return {
    clearCache,
    getCacheStats,
    isCacheEmpty,
  };
}; 
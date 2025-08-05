import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Trash2, RefreshCw, Info } from 'lucide-react';
import { clearPersistedCache, getCacheInfo } from '../lib/queryClient';
import { toast } from 'sonner';

interface CacheManagerProps {
  className?: string;
  showDetails?: boolean;
}

export const CacheManager: React.FC<CacheManagerProps> = ({ 
  className = '', 
  showDetails = false 
}) => {
  const [cacheInfo, setCacheInfo] = useState(getCacheInfo());
  const [isClearing, setIsClearing] = useState(false);

  // Refresh cache info
  const refreshCacheInfo = () => {
    setCacheInfo(getCacheInfo());
  };

  // Clear cache
  const handleClearCache = async () => {
    setIsClearing(true);
    try {
      clearPersistedCache();
      refreshCacheInfo();
      toast.success('Cache cleared successfully');
    } catch (error) {
      console.error('Error clearing cache:', error);
      toast.error('Failed to clear cache');
    } finally {
      setIsClearing(false);
    }
  };

  // Format bytes to human readable
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  useEffect(() => {
    refreshCacheInfo();
  }, []);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="w-5 h-5" />
          Query Cache Manager
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {showDetails && (
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="font-semibold text-lg">{cacheInfo.queryCount}</div>
              <div className="text-muted-foreground">Queries</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-lg">{cacheInfo.mutationCount}</div>
              <div className="text-muted-foreground">Mutations</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-lg">{formatBytes(cacheInfo.size)}</div>
              <div className="text-muted-foreground">Size</div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant={cacheInfo.queryCount > 0 ? "default" : "secondary"}>
              {cacheInfo.queryCount > 0 ? 'Cached' : 'Empty'}
            </Badge>
            {cacheInfo.queryCount > 0 && (
              <span className="text-sm text-muted-foreground">
                {cacheInfo.queryCount} queries cached
              </span>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={refreshCacheInfo}
              disabled={isClearing}
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
            
            <Button
              variant="destructive"
              size="sm"
              onClick={handleClearCache}
              disabled={isClearing || cacheInfo.queryCount === 0}
            >
              <Trash2 className="w-4 h-4" />
              {isClearing ? 'Clearing...' : 'Clear Cache'}
            </Button>
          </div>
        </div>

        {showDetails && cacheInfo.queryCount > 0 && (
          <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
            <p>Cache persists across browser sessions and page refreshes.</p>
            <p>Clearing cache will force fresh data fetches on next page load.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 
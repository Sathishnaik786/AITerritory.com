import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { startProgress, stopProgress, incrementProgress, setProgress } from '../lib/progressBar';
import { progressConfig } from '../config/progressConfig';

interface BackdropLoaderContextType {
  isBackdropLoading: boolean;
  showLoader: () => void;
  hideLoader: () => void;
  toggleLoader: () => void;
}

const BackdropLoaderContext = createContext<BackdropLoaderContextType | undefined>(undefined);

interface BackdropLoaderProviderProps {
  children: React.ReactNode;
}

export const BackdropLoaderProvider: React.FC<BackdropLoaderProviderProps> = ({ children }) => {
  const [isBackdropLoading, setIsBackdropLoading] = useState(false);
  const [manualLoading, setManualLoading] = useState(false);
  const queryClient = useQueryClient();

  // Debounce function to avoid flickering
  const debounce = useCallback((func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  }, []);

  // Manual controls
  const showLoader = useCallback(() => {
    setManualLoading(true);
    startProgress();
  }, []);

  const hideLoader = useCallback(() => {
    setManualLoading(false);
    stopProgress();
  }, []);

  const toggleLoader = useCallback(() => {
    setManualLoading(prev => !prev);
    if (!manualLoading) {
      startProgress();
    } else {
      stopProgress();
    }
  }, [manualLoading]);

  // TanStack Query integration - only for page-level operations
  useEffect(() => {
    let activeRequests = 0;
    let progressInterval: NodeJS.Timeout | null = null;
    let lastQueryCount = 0;

    const checkQueryState = debounce(() => {
      const isFetching = queryClient.isFetching();
      const isMutating = queryClient.isMutating();
      
      // Only show loader for significant operations (not likes, bookmarks, comments)
      // Check if there are any active queries that are NOT mutations (mutations are usually likes, bookmarks, etc.)
      const hasSignificantQueries = isFetching >= progressConfig.backdropLoader.minQueryCount && 
                                  (progressConfig.backdropLoader.showForMutations ? true : isMutating === 0);
      
      // Additional check: only show for new queries, not ongoing ones
      const isNewQuery = isFetching > lastQueryCount;
      lastQueryCount = isFetching;
      
      // Track active requests for progress
      if (hasSignificantQueries && isNewQuery && activeRequests === 0) {
        activeRequests = isFetching;
        startProgress();
        
        // Start progress simulation
        progressInterval = setInterval(() => {
          if (activeRequests > 0) {
            incrementProgress(5);
          }
        }, 300);
      } else if (!hasSignificantQueries && activeRequests > 0) {
        activeRequests = 0;
        if (progressInterval) {
          clearInterval(progressInterval);
          progressInterval = null;
        }
        stopProgress();
      }
      
      // Only show backdrop for significant operations or manual loading
      setIsBackdropLoading(hasSignificantQueries || manualLoading);
    }, progressConfig.backdropLoader.debounceDelay);

    // Initial check
    checkQueryState();

    // Subscribe to query cache changes
    const unsubscribe = queryClient.getQueryCache().subscribe(() => {
      checkQueryState();
    });

    // Subscribe to mutation cache changes (but don't trigger loader for mutations)
    const mutationUnsubscribe = queryClient.getMutationCache().subscribe(() => {
      // Don't trigger loader for mutations (likes, bookmarks, comments)
      // Only check for significant queries
      const isFetching = queryClient.isFetching();
      const isMutating = queryClient.isMutating();
      const hasSignificantQueries = isFetching >= progressConfig.backdropLoader.minQueryCount && 
                                  (progressConfig.backdropLoader.showForMutations ? true : isMutating === 0);
      
      if (!hasSignificantQueries && activeRequests > 0) {
        activeRequests = 0;
        if (progressInterval) {
          clearInterval(progressInterval);
          progressInterval = null;
        }
        stopProgress();
      }
      
      setIsBackdropLoading(hasSignificantQueries || manualLoading);
    });

    return () => {
      unsubscribe();
      mutationUnsubscribe();
      if (progressInterval) {
        clearInterval(progressInterval);
      }
    };
  }, [queryClient, manualLoading, debounce]);

  const value: BackdropLoaderContextType = {
    isBackdropLoading,
    showLoader,
    hideLoader,
    toggleLoader,
  };

  return (
    <BackdropLoaderContext.Provider value={value}>
      {children}
    </BackdropLoaderContext.Provider>
  );
};

export const useBackdropLoader = (): BackdropLoaderContextType => {
  const context = useContext(BackdropLoaderContext);
  if (context === undefined) {
    throw new Error('useBackdropLoader must be used within a BackdropLoaderProvider');
  }
  return context;
}; 
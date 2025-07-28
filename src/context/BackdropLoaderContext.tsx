import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { startProgress, stopProgress, incrementProgress, setProgress } from '../lib/progressBar';

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

  // TanStack Query integration with debouncing and progress tracking
  useEffect(() => {
    let activeRequests = 0;
    let progressInterval: NodeJS.Timeout | null = null;

    const checkQueryState = debounce(() => {
      const isFetching = queryClient.isFetching();
      const isMutating = queryClient.isMutating();
      const hasActiveQueries = isFetching > 0 || isMutating > 0;
      
      // Track active requests for progress
      if (hasActiveQueries && activeRequests === 0) {
        activeRequests = isFetching + isMutating;
        startProgress();
        
        // Start progress simulation
        progressInterval = setInterval(() => {
          if (activeRequests > 0) {
            incrementProgress(5);
          }
        }, 300);
      } else if (!hasActiveQueries && activeRequests > 0) {
        activeRequests = 0;
        if (progressInterval) {
          clearInterval(progressInterval);
          progressInterval = null;
        }
        stopProgress();
      }
      
      setIsBackdropLoading(hasActiveQueries || manualLoading);
    }, 300);

    // Initial check
    checkQueryState();

    // Subscribe to query cache changes
    const unsubscribe = queryClient.getQueryCache().subscribe(() => {
      checkQueryState();
    });

    // Subscribe to mutation cache changes
    const mutationUnsubscribe = queryClient.getMutationCache().subscribe(() => {
      checkQueryState();
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
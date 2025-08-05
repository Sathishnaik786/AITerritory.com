import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { startProgress, stopProgress } from '../lib/progressBar';

export const useRouteProgress = () => {
  const location = useLocation();

  useEffect(() => {
    // Start progress on route change
    startProgress();
    
    // Stop progress after a short delay to simulate route completion
    const timer = setTimeout(() => {
      stopProgress();
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [location.pathname]);
}; 
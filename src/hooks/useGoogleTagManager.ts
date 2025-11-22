import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataLayer: any[];
  }
}

export function useGoogleTagManager() {
  const location = useLocation();

  useEffect(() => {
    // Initialize dataLayer if it doesn't exist
    window.dataLayer = window.dataLayer || [];
    
    // Push page view event to GTM
    window.dataLayer.push({
      event: 'pageview',
      page: {
        url: location.pathname + location.search,
        path: location.pathname,
      },
    });
  }, [location]);
}
import { useEffect } from 'react';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataLayer: any[];
  }
}

export function GoogleTagManagerProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];
    
    // Only load GTM in production or when GTM ID is set
    const gtmId = import.meta.env.VITE_GTM_ID;
    if (!gtmId || gtmId === 'GT-MR295G72') {
      console.warn('Google Tag Manager ID not set. Skipping GTM initialization.');
      return;
    }
    
    // GTM initialization script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`;
    
    // Add error handling
    script.onerror = () => {
      console.warn('Failed to load Google Tag Manager');
    };
    
    document.head.appendChild(script);
    
    // Cleanup function
    return () => {
      // Note: We don't remove the script as it might be needed throughout the app lifecycle
      // In a real implementation, you might want to handle this differently
    };
  }, []);
  
  return <>{children}</>;
}
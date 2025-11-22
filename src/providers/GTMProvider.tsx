import { useEffect } from 'react';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataLayer: any[];
  }
}

export function GTMProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize dataLayer safely
    window.dataLayer = window.dataLayer || [];
    
    // Only load GTM when VITE_GTM_ID is properly set
    const gtmId = import.meta.env.VITE_GTM_ID;
    if (!gtmId || gtmId === 'GT-MR295G72') {
      console.log('[AITerritory] GTM Skipped - ID not configured');
      return;
    }
    
    // GTM initialization script
    const scriptId = 'gtm-script';
    
    // Check if script already exists to prevent duplicates
    if (document.getElementById(scriptId)) {
      console.log('[AITerritory] GTM Already Loaded');
      return;
    }
    
    // Create and inject GTM script
    const script = document.createElement('script');
    script.id = scriptId;
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`;
    
    // Add error handling
    script.onerror = () => {
      console.warn('[AITerritory] Failed to load Google Tag Manager');
    };
    
    document.head.appendChild(script);
    
    // Log successful loading
    script.onload = () => {
      console.log('[AITerritory] GTM Loaded:', gtmId);
    };
    
    // Cleanup function
    return () => {
      // Remove script on unmount
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);
  
  return <>{children}</>;
}
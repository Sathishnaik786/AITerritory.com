// GA4 Analytics Utility
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

// GA4 Measurement ID
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-1NJDY2B92X';

// Pageview tracking
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

// Event tracking
export const event = ({ action, category, label, value }: any) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value,
    });
  }
};

/**
 * Track a custom GA4 event
 * @param eventName - The name of the event
 * @param params - Event parameters
 */
export const trackEvent = (eventName: string, params: Record<string, any>): void => {
  try {
    // Ensure gtag is available
    if (typeof window !== 'undefined' && window.gtag) {
      // Add common parameters
      const eventParams = {
        ...params,
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent,
        screen_resolution: `${screen.width}x${screen.height}`,
        language: navigator.language,
      };

      // Send the event to GA4
      window.gtag('event', eventName, eventParams);
      
      console.log(`📊 GA4 Event tracked: ${eventName}`, eventParams);
    } else {
      console.warn('GA4 gtag not available');
    }
  } catch (error) {
    console.error('Error tracking GA4 event:', error);
  }
};

/**
 * Initialize GA4 tracking
 */
export const initGA4 = (): void => {
  if (typeof window !== 'undefined' && !window.gtag) {
    // Only show warning in development mode
    if (process.env.NODE_ENV === 'development') {
      console.warn('GA4 not initialized. Make sure the gtag script is loaded.');
    }
  }
};

// Auto-initialize when the module is imported
if (typeof window !== 'undefined') {
  initGA4();
}
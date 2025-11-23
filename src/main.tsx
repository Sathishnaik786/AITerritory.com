import React from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/context/AuthContext";
import App from "./App";
import "./index.css"; // Ensure this is imported for global styles

// Extend window interface for GA4
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataLayer: any[];
    gtag: (...args: unknown[]) => void;
  }
}

// Debug: Log all environment variables (only in development)
if (import.meta.env.DEV) {
  console.log("🔍 Environment Variables Debug:");
  console.log("VITE_SUPABASE_URL:", import.meta.env.VITE_SUPABASE_URL);
  console.log("VITE_SUPABASE_ANON_KEY:", import.meta.env.VITE_SUPABASE_ANON_KEY);
  console.log("VITE_GA_MEASUREMENT_ID:", import.meta.env.VITE_GA_MEASUREMENT_ID);
  console.log("All env vars:", import.meta.env);
}

// Initialize Google Analytics 4
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

if (GA_MEASUREMENT_ID) {
  // Create and inject the GA4 script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  
  // Add onload handler to ensure script is loaded before initializing
  script.onload = () => {
    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: unknown[]) {
      window.dataLayer.push(args);
    }
    window.gtag = gtag;
    // Configure GA4 with proper cookie settings to prevent expiration warnings
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID, {
      cookie_expires: 63072000, // 2 years in seconds
      cookie_update: true,
      cookie_flags: 'SameSite=None;Secure'
    });
    
    console.log('GA4 initialized successfully');
  };
  
  script.onerror = () => {
    console.warn('Failed to load GA4 script');
  };
  
  document.head.appendChild(script);
} else {
  console.warn('Google Analytics Measurement ID not found. Analytics will be disabled.');
}

// Check if we're using development keys in production
if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_URL.includes('placeholder') && import.meta.env.PROD) {
  console.error("❌ CRITICAL: Using placeholder Supabase keys in production!");
  console.error("This will cause authentication issues. Please update to production keys from your Supabase dashboard.");
}

// Improved error handling for Auth
const AppTree = (
  <HelmetProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
  </HelmetProvider>
);

// Render the app
const rootElement = document.getElementById("root");
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    import.meta.env.DEV ? AppTree : <React.StrictMode>{AppTree}</React.StrictMode>
  );
} else {
  console.error("❌ Failed to find the root element");
}
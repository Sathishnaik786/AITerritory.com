import React from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App";
import "./index.css"; // Ensure this is imported for global styles

// Cache-busting: Check if there's a newer version of the app
const checkForUpdates = () => {
  // In development, we don't need to check for updates
  if (import.meta.env.DEV) return;
  
  // Check for updates every 5 minutes
  setInterval(() => {
    fetch(window.location.href, { 
      cache: 'no-cache',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    }).then(response => {
      const lastModified = response.headers.get('last-modified');
      if (lastModified) {
        const lastModifiedTime = new Date(lastModified).getTime();
        const currentTime = new Date().getTime();
        // If the page was modified in the last 10 minutes, suggest a refresh
        if (currentTime - lastModifiedTime < 600000) {
          console.log('New version detected, suggesting refresh');
        }
      }
    }).catch(err => {
      console.log('Could not check for updates:', err);
    });
  }, 300000); // Check every 5 minutes
};

// Run cache-busting check
checkForUpdates();

// Debug: Log all environment variables (only in development)
if (import.meta.env.DEV) {
  console.log("🔍 Environment Variables Debug:");
  console.log("VITE_CLERK_PUBLISHABLE_KEY:", import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);
  console.log("VITE_SUPABASE_URL:", import.meta.env.VITE_SUPABASE_URL);
  console.log("VITE_SUPABASE_ANON_KEY:", import.meta.env.VITE_SUPABASE_ANON_KEY);
  console.log("All env vars:", import.meta.env);
}

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Better error handling for missing keys
if (!PUBLISHABLE_KEY) {
  console.error("Missing Clerk Publishable Key");
  if (import.meta.env.DEV) {
    throw new Error("Missing Clerk Publishable Key - Check your .env file");
  } else {
    console.error("Clerk is not properly configured for production");
  }
}

// Check if we're using development keys in production
if (PUBLISHABLE_KEY && PUBLISHABLE_KEY.includes('pk_test_') && import.meta.env.PROD) {
  console.warn("⚠️ Using Clerk development keys in production! Please update to production keys.");
}

const AppTree = (
  <HelmetProvider>
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY || ''}
      afterSignOutUrl="/"
    >
      <App />
    </ClerkProvider>
  </HelmetProvider>
);

// Improved hydration with error handling
const rootElement = document.getElementById("root");
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  
  // Check if we're hydrating or rendering fresh
  if (rootElement.hasChildNodes()) {
    // Hydrate existing markup
    root.render(AppTree);
  } else {
    // Render fresh
    root.render(
      import.meta.env.DEV ? AppTree : <React.StrictMode>{AppTree}</React.StrictMode>
    );
  }
} else {
  console.error("Failed to find the root element");
}
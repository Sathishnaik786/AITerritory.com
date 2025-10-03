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
  console.error("❌ Missing Clerk Publishable Key");
  if (import.meta.env.DEV) {
    throw new Error("Missing Clerk Publishable Key - Check your .env file");
  } else {
    console.error("Clerk is not properly configured for production. Please check your environment variables.");
  }
}

// Check if we're using development keys in production
if (PUBLISHABLE_KEY && PUBLISHABLE_KEY.includes('pk_test_') && import.meta.env.PROD) {
  console.error("❌ CRITICAL: Using Clerk development keys in production!");
  console.error("This will cause authentication issues and strict usage limits.");
  console.error("Please update to production keys from your Clerk dashboard.");
  console.error("Learn more: https://clerk.com/docs/deployments/overview");
  console.error("Current key:", PUBLISHABLE_KEY);
  
  // Show a more user-friendly alert
  if (typeof window !== 'undefined') {
    // Only show in browser environment
    setTimeout(() => {
      const alertShown = sessionStorage.getItem('clerkAlertShown');
      if (!alertShown) {
        sessionStorage.setItem('clerkAlertShown', 'true');
        if (confirm("CRITICAL SECURITY ISSUE: This site is using development authentication keys which have strict usage limits. Click OK to learn how to fix this.")) {
          window.open("https://clerk.com/docs/deployments/overview", "_blank");
        }
      }
    }, 3000);
  }
}

// Improved error handling for Clerk
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
    try {
      root.render(AppTree);
    } catch (error) {
      console.error("Hydration failed, falling back to client-side render:", error);
      rootElement.innerHTML = ''; // Clear server-rendered content
      root.render(AppTree);
    }
  } else {
    // Render fresh
    root.render(
      import.meta.env.DEV ? AppTree : <React.StrictMode>{AppTree}</React.StrictMode>
    );
  }
} else {
  console.error("❌ Failed to find the root element");
}
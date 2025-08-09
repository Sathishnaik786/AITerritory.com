import React from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App.tsx";
import "./index.css"; // Ensure this is imported for global styles

// Debug: Log all environment variables
console.log("🔍 Environment Variables Debug:");
console.log("VITE_CLERK_PUBLISHABLE_KEY:", import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);
console.log("VITE_SUPABASE_URL:", import.meta.env.VITE_SUPABASE_URL);
console.log("VITE_SUPABASE_ANON_KEY:", import.meta.env.VITE_SUPABASE_ANON_KEY);
console.log("All env vars:", import.meta.env);

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

ReactDOM.createRoot(document.getElementById("root")!).render(
  import.meta.env.DEV ? AppTree : <React.StrictMode>{AppTree}</React.StrictMode>
);

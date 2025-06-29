import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css"; // Ensure this is imported for global styles

// Check if Clerk key is available and valid
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const isClerkConfigured = PUBLISHABLE_KEY && 
  PUBLISHABLE_KEY !== 'your_clerk_publishable_key' && 
  !PUBLISHABLE_KEY.includes('REPLACE_WITH_YOUR_ACTUAL');

// Conditionally import Clerk components
let ClerkProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;

// Only use Clerk if properly configured
if (isClerkConfigured) {
  const clerk = await import('@clerk/clerk-react');
  ClerkProvider = clerk.ClerkProvider;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {isClerkConfigured ? (
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
        <App />
      </ClerkProvider>
    ) : (
      <App />
    )}
  </React.StrictMode>
);
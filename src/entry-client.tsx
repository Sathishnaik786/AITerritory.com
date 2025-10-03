import React from 'react';
import ReactDOM from 'react-dom/client';
import { hydrateRoot } from 'react-dom/client';
import App from './App';

// Improved client-side hydration with error handling
const rootElement = document.getElementById('root');

if (rootElement) {
  // Check if there's existing content to hydrate
  if (rootElement.innerHTML.trim() !== '') {
    hydrateRoot(rootElement, <App />);
  } else {
    // If no existing content, render fresh
    const root = ReactDOM.createRoot(rootElement);
    root.render(<App />);
  }
} else {
  console.error('Failed to find the root element for hydration');
}
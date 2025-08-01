import React from 'react';
import { useBackdropLoader } from '../context/BackdropLoaderContext';
import { Button } from './ui/button';

export const BackdropLoaderExample: React.FC = () => {
  const { showLoader, hideLoader } = useBackdropLoader();

  const handleManualLoader = async () => {
    showLoader();
    // Simulate an API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    hideLoader();
  };

  const handleUserInteraction = async () => {
    // Simulate a user interaction (like, bookmark, comment) - should NOT trigger backdrop
    console.log('User interaction - backdrop should NOT show');
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handlePageLoad = async () => {
    // Simulate a page-level operation - should trigger backdrop
    showLoader();
    await new Promise(resolve => setTimeout(resolve, 2000));
    hideLoader();
  };

  return (
    <div className="flex gap-2 p-4">
      <Button onClick={showLoader} variant="outline">
        Show Loader
      </Button>
      <Button onClick={hideLoader} variant="outline">
        Hide Loader
      </Button>
      <Button onClick={handleManualLoader} variant="default">
        Simulate Page Load (2s)
      </Button>
      <Button onClick={handleUserInteraction} variant="outline">
        Simulate User Action (1s)
      </Button>
      <Button onClick={handlePageLoad} variant="outline">
        Simulate Page Operation (2s)
      </Button>
    </div>
  );
}; 
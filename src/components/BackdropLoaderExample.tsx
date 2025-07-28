import React from 'react';
import { useBackdropLoader } from '../context/BackdropLoaderContext';
import { Button } from './ui/button';

export const BackdropLoaderExample: React.FC = () => {
  const { showLoader, hideLoader, toggleLoader } = useBackdropLoader();

  const handleManualLoader = async () => {
    showLoader();
    // Simulate an API call
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
      <Button onClick={toggleLoader} variant="outline">
        Toggle Loader
      </Button>
      <Button onClick={handleManualLoader} variant="default">
        Simulate API Call
      </Button>
    </div>
  );
}; 
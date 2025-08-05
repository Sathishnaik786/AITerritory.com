import React from 'react';
import { BackdropLoader } from './ui/BackdropLoader';
import { useBackdropLoader } from '../context/BackdropLoaderContext';

export const BackdropLoaderWrapper: React.FC = () => {
  const { isBackdropLoading } = useBackdropLoader();

  return <BackdropLoader isVisible={isBackdropLoading} />;
}; 
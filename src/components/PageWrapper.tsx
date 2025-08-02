import React from 'react';
import { PageBreadcrumbs } from './PageBreadcrumbs';

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({ children, className = "" }) => {
  return (
    <div className={className}>
      <PageBreadcrumbs />
      {children}
    </div>
  );
}; 
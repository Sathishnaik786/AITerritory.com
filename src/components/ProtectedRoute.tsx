import React from 'react';
import { useUser, SignIn } from '@clerk/clerk-react';
import { Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, LogIn } from 'lucide-react';
import { Button } from './ui/button';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  redirectTo = '/login' 
}) => {
  const { user, isLoaded } = useUser();
  const location = useLocation();

  // Show loading state while Clerk is initializing
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is not authenticated, show Clerk SignIn page
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <SignIn path="/sign-in" routing="path" />
      </div>
    );
  }

  // If user is authenticated, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute; 
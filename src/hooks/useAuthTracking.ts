import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { trackAuthAction } from '@/lib/analytics';

/**
 * Hook to track authentication events
 * Automatically tracks sign in, sign up, and sign out events
 */
export const useAuthTracking = () => {
  const { user } = useAuth();

  useEffect(() => {
    // Track when user signs in
    if (user) {
      // Determine if this is a new user (sign up) or existing user (sign in)
      // We'll track as sign_in for now, but you could add logic to detect new users
      trackAuthAction(
        'sign_in',
        'supabase', // auth method
        user.id
      );
    }
  }, [user]);

  // Function to manually track sign out
  const trackSignOut = () => {
    if (user) {
      trackAuthAction(
        'sign_out',
        'supabase',
        user.id
      );
    }
  };

  return { trackSignOut };
};
import { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { trackAuthAction } from '@/lib/analytics';

/**
 * Hook to track authentication events
 * Automatically tracks sign in, sign up, and sign out events
 */
export const useAuthTracking = () => {
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    // Track when user signs in
    if (isSignedIn && user) {
      // Determine if this is a new user (sign up) or existing user (sign in)
      // We'll track as sign_in for now, but you could add logic to detect new users
      trackAuthAction(
        'sign_in',
        'clerk', // auth method
        user.id
      );
    }
  }, [isSignedIn, user]);

  // Function to manually track sign out
  const trackSignOut = () => {
    if (user) {
      trackAuthAction(
        'sign_out',
        'clerk',
        user.id
      );
    }
  };

  return { trackSignOut };
}; 
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/services/supabaseClient';
import { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<{ error: Error | null }>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      console.warn('❌ Supabase client not initialized');
      setLoading(false);
      return;
    }

    console.log('AuthProvider: Initializing session');

    // Get initial session
    const getSession = async () => {
      try {
        console.log('AuthProvider: Getting session from Supabase');
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('AuthProvider: getSession result', { session, error });
        
        if (error) {
          console.error('❌ Error getting session:', error);
        }
        setSession(session);
        setUser(session?.user || null);
      } catch (err) {
        console.error('❌ Error in getSession:', err);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    console.log('AuthProvider: Setting up auth state change listener');
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('AuthProvider: Auth state changed', { _event, session });
      setSession(session);
      setUser(session?.user || null);
      setLoading(false);
    });

    return () => {
      console.log('AuthProvider: Cleaning up subscription');
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      return { error: new Error('Supabase client not initialized') };
    }

    try {
      console.log('AuthProvider: Attempting sign in', { email });
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      console.log('AuthProvider: Sign in result', { data, error });
      
      if (error) {
        console.error('❌ Sign in error:', error);
        // Provide more specific error messages
        if (error.message.includes('Invalid API key')) {
          console.error('🔑 CRITICAL: Invalid API key. Please check your VITE_SUPABASE_ANON_KEY in .env file');
          console.error('🔑 Make sure you are using the "anon" key from your Supabase dashboard, not the "service_role" key');
        }
        return { error };
      }
      
      setSession(data.session);
      setUser(data.session?.user || null);
      return { error: null };
    } catch (err) {
      console.error('❌ Sign in exception:', err);
      return { error: err as Error };
    }
  };

  const signUp = async (email: string, password: string) => {
    if (!supabase) {
      return { error: new Error('Supabase client not initialized') };
    }

    try {
      console.log('AuthProvider: Attempting sign up', { email });
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      console.log('AuthProvider: Sign up result', { data, error });
      
      if (error) {
        console.error('❌ Sign up error:', error);
        // Provide more specific error messages
        if (error.message.includes('Invalid API key')) {
          console.error('🔑 CRITICAL: Invalid API key. Please check your VITE_SUPABASE_ANON_KEY in .env file');
          console.error('🔑 Make sure you are using the "anon" key from your Supabase dashboard, not the "service_role" key');
        }
        return { error };
      }
      
      setSession(data.session);
      setUser(data.session?.user || null);
      return { error: null };
    } catch (err) {
      console.error('❌ Sign up exception:', err);
      return { error: err as Error };
    }
  };

  const signOut = async () => {
    if (!supabase) {
      return { error: new Error('Supabase client not initialized') };
    }

    try {
      console.log('AuthProvider: Attempting sign out');
      const { error } = await supabase.auth.signOut();
      
      console.log('AuthProvider: Sign out result', { error });
      
      if (error) {
        console.error('❌ Sign out error:', error);
        return { error };
      }
      
      setSession(null);
      setUser(null);
      return { error: null };
    } catch (err) {
      console.error('❌ Sign out exception:', err);
      return { error: err as Error };
    }
  };

  const resetPassword = async (email: string) => {
    if (!supabase) {
      return { error: new Error('Supabase client not initialized') };
    }

    try {
      console.log('AuthProvider: Attempting password reset', { email });
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        console.error('❌ Password reset error:', error);
        return { error };
      }
      
      return { error: null };
    } catch (err) {
      console.error('❌ Password reset exception:', err);
      return { error: err as Error };
    }
  };

  const value = {
    user,
    session,
    signIn,
    signUp,
    signOut,
    resetPassword,
    loading,
  };

  console.log('AuthProvider: Providing context value', { user: !!user, session: !!session, loading });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
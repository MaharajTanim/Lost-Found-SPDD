import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, authService, profileService } from '../services/supabase';
import { AuthState, Profile } from '../types';
import { toast } from 'react-toastify';

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const initialState: AuthState = {
  user: null,
  session: null,
  isLoading: true,
};

const AuthContext = createContext<AuthContextType>({
  ...initialState,
  signIn: async () => {},
  signUp: async () => {},
  signInWithGoogle: async () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>(initialState);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const session = await authService.getSession();
        
        if (session) {
          const { data: profile } = await profileService.getProfileByUserId(session.user.id);
          
          setState({
            session,
            user: profile || null,
            isLoading: false,
          });
        } else {
          setState({
            session: null,
            user: null,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error('Error fetching session:', error);
        setState({
          ...initialState,
          isLoading: false,
        });
      }
    };

    fetchSession();

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const { data: profile } = await profileService.getProfileByUserId(session.user.id);
        
        setState({
          session,
          user: profile || null,
          isLoading: false,
        });
      } else if (event === 'SIGNED_OUT') {
        setState({
          session: null,
          user: null,
          isLoading: false,
        });
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error, data } = await authService.signIn(email, password);
      
      if (error) throw error;
      
      toast.success('Signed in successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in');
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { error, data } = await authService.signUp(email, password);
      
      if (error) throw error;
      
      toast.success('Account created successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await authService.signInWithGoogle();
      
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in with Google');
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await authService.signOut();
      
      if (error) throw error;
      
      toast.success('Signed out successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign out');
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      ...state,
      signIn,
      signUp,
      signInWithGoogle,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
import React, { createContext, useEffect, useState } from 'react';
import { authService } from '../services/authService';
import type { AuthContextType, AuthProviderProps, AuthResponse, SignInRequest, SignUpRequest, User } from '@/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const userData = await authService.getUser();
          console.log(userData)
          setUser(userData);
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        await authService.signOut();
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const signUp = async (data: SignUpRequest): Promise<void> => {
    const response: AuthResponse = await authService.signUp(data);
    setUser(response.user);
  };

  const signIn = async (data: SignInRequest): Promise<void> => {
    const response: AuthResponse = await authService.signIn(data);
    setUser(response.user);
  };

  const signOut = async (): Promise<void> => {
    try {
      await authService.signOut();
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext };

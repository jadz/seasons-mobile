import React, { useEffect, useState } from 'react';
import { AuthService } from '../../services/auth/AuthService';
import { authStore } from './authStore';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    let subscription: any = null;

    // Initialize auth state
    const initializeAuth = async () => {
      try {
        authStore.setLoading(true);
        
        // Set up auth state listener first
        const { data } = AuthService.onAuthStateChange((user) => {
          authStore.setUser(user);
        });
        subscription = data.subscription;

        // Then get current user
        const user = await AuthService.getCurrentUser();
        authStore.setUser(user);
        setIsInitialized(true);
      } catch (error) {
        console.error('Error initializing auth:', error);
        authStore.setUser(null);
        setIsInitialized(true);
      }
    };

    initializeAuth();

    // Cleanup subscription on unmount
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  // Don't render children until auth is initialized
  if (!isInitialized) {
    return null;
  }

  return <>{children}</>;
};

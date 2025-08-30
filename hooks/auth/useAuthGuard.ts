import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useAuth } from './useAuth';

interface UseAuthGuardOptions {
  requireAuth?: boolean;
  redirectTo?: string;
}

export const useAuthGuard = ({ 
  requireAuth = true, 
  redirectTo = '/(auth)/sign-in' 
}: UseAuthGuardOptions = {}) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (requireAuth && !user) {
      router.replace(redirectTo);
    } else if (!requireAuth && user) {
      if (user.isNewUser) {
        router.replace('/onboarding');
      } else {
        router.replace('/(tabs)');
      }
    }
  }, [user, isLoading, requireAuth, redirectTo, router]);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
};

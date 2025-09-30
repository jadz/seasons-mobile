import { Redirect, router } from 'expo-router';
import { useAuth } from '../hooks/auth';
import { useOnboardingRedirect } from '../hooks/onboarding/useOnboardingRedirect';
import { Text, View, ActivityIndicator } from 'react-native';
import { useEffect, useRef } from 'react';

export default function Index() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { redirectTo, isChecking, hasCompleted } = useOnboardingRedirect(user?.id);
  const hasNavigated = useRef(false);

  console.log('[Index] Rendering with state:', {
    userId: user?.id,
    isAuthLoading,
    isChecking,
    hasCompleted,
    redirectTo,
  });

  // Handle navigation imperatively to maintain proper stack
  useEffect(() => {
    if (isAuthLoading || isChecking || hasNavigated.current) {
      return;
    }

    // Not authenticated - go to sign in
    if (!user) {
      console.log('[Index] No user, redirecting to sign-in');
      hasNavigated.current = true;
      router.replace('/(auth)/sign-in');
      return;
    }

    // User exists but hasn't completed onboarding - push to appropriate step
    // Using push() instead of replace() to maintain navigation stack
    if (!hasCompleted && redirectTo) {
      console.log('[Index] Onboarding incomplete, pushing to:', redirectTo);
      hasNavigated.current = true;
      router.push(redirectTo);
      return;
    }

    // Onboarding complete - go to main app
    if (hasCompleted) {
      console.log('[Index] Onboarding complete, redirecting to tabs');
      hasNavigated.current = true;
      router.replace('/(tabs)');
    }
  }, [user, isAuthLoading, isChecking, redirectTo, hasCompleted]);

  // Show loading while checking auth or onboarding status
  console.log('[Index] Showing loading state');
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
      <Text style={{ marginTop: 16 }}>Loading...</Text>
    </View>
  );
}

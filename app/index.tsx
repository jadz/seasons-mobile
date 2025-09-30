import { Redirect } from 'expo-router';
import { useAuth } from '../hooks/auth';
import { useOnboardingRedirect } from '../hooks/onboarding/useOnboardingRedirect';
import { Text, View, ActivityIndicator } from 'react-native';

export default function Index() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { redirectTo, isChecking, hasCompleted } = useOnboardingRedirect(user?.id);

  console.log('[Index] Rendering with state:', {
    userId: user?.id,
    isAuthLoading,
    isChecking,
    hasCompleted,
    redirectTo,
  });

  // Show loading while checking auth or onboarding status
  if (isAuthLoading || isChecking) {
    console.log('[Index] Showing loading state');
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 16 }}>Loading...</Text>
      </View>
    );
  }

  // Not authenticated - go to sign in
  if (!user) {
    console.log('[Index] No user, redirecting to sign-in');
    return <Redirect href="/(auth)/sign-in" />;
  }

  // User exists but hasn't completed onboarding - redirect to appropriate step
  if (!hasCompleted && redirectTo) {
    console.log('[Index] Onboarding incomplete, redirecting to:', redirectTo);
    return <Redirect href={redirectTo} />;
  }

  // Onboarding complete - go to main app
  console.log('[Index] Onboarding complete, redirecting to tabs');
  return <Redirect href="/(tabs)" />;
}

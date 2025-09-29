import { Redirect } from 'expo-router';
import { useAuth } from '../hooks/auth';
import { Text, View } from 'react-native';

export default function Index() {
  // return <Redirect href="/onboarding/overview" />;
  // return <Redirect href="/onboarding/season-overview" />;
  return <Redirect href="/onboarding/season-step-8-phases" />;
  // return <Redirect href="/onboarding/season-step-3-strength-numbers" />;
  // return <Redirect href="/onboarding/season-step-1-outcomes" />;
  // return <Redirect href="/onboarding/season-step-5-set-other-metrics-tab" />;

  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  if (user.isNewUser) {
    // return <Redirect href="/onboarding" />;
    return <Redirect href="/user-onboarding" />;
  }

  return <Redirect href="/(tabs)" />;
}

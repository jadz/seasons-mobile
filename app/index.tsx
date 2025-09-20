import { Redirect } from 'expo-router';
import { useAuth } from '../hooks/auth';
import { Text, View } from 'react-native';

export default function Index() {
  return <Redirect href="/playground" />;

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
    return <Redirect href="/onboarding" />;
  }

  return <Redirect href="/(tabs)" />;
}

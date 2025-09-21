import React from 'react';
import { router } from 'expo-router';
import { useAuth } from '../../hooks/auth/useAuth';
import { ThemeProvider } from '../../components/ui';
import { Box } from '../../components/ui';
import { Text } from '../../components/ui';
import { Button } from '../../components/ui';

export default function HomeScreen() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/(auth)/sign-in');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  return (
    <ThemeProvider initialThemeMode="light">
      <Box flex={1} backgroundColor="background" justifyContent="center" alignItems="center" padding="l">
        <Text variant="title" color="text" textAlign="center" marginBottom="m">
          Welcome Home
        </Text>
        <Text variant="h2" color="textSecondary" textAlign="center" marginBottom="xxl">
          Hello, {user?.firstName || 'User'}!
        </Text>

        <Button onPress={handleSignOut}>
          Sign Out
        </Button>
      </Box>
    </ThemeProvider>
  );
}



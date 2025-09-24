import React from 'react';
import { router } from 'expo-router';
import { OnboardingForm } from '../components/auth';
import { ThemeProvider, Box } from '../components/ui';

export default function OnboardingScreen() {
  const handleComplete = () => {
    router.replace('/(tabs)');
  };

  return (
    <ThemeProvider initialThemeMode="light">
      <Box flex={1} backgroundColor="background">
        <OnboardingForm onComplete={handleComplete} />
      </Box>
    </ThemeProvider>
  );
}

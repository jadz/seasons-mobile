import React from 'react';
import { router } from 'expo-router';
import { OnboardingForm } from '../components/auth';
import { ThemeProvider } from '../components/ui/ThemeProvider';
import { Box } from '../components/ui/Box';

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

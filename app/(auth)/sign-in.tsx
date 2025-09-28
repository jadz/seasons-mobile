import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SignInForm } from '../../components/auth';
import { ThemeProvider, Box, Header } from '../../components/ui';

export default function SignInScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ThemeProvider initialThemeMode="light">
      <Box flex={1} backgroundColor="bg/page">
        {/* Safe Area Top */}
        <Box style={{ paddingTop: insets.top }} />
        
        {/* Header */}
        <Header
          title="Welcome to Seasons"
          variant="transparent"
        />
        
        {/* Main Content */}
        <Box flex={1} paddingHorizontal="l">
          <SignInForm />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

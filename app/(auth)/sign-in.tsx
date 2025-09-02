import React from 'react';
import { SignInForm } from '../../components/auth';
import { ThemeProvider } from '../../components/ui/ThemeProvider';
import { Box } from '../../components/ui/Box';

export default function SignInScreen() {
  return (
    <ThemeProvider initialThemeMode="light">
      <Box flex={1} backgroundColor="background">
        <SignInForm />
      </Box>
    </ThemeProvider>
  );
}

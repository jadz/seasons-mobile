import React from 'react';
import { SignInForm } from '../../components/auth';
import { ThemeProvider, Box } from '../../components/ui';

export default function SignInScreen() {
  return (
    <ThemeProvider initialThemeMode="light">
      <Box flex={1} backgroundcolor="bg/primary">
        <SignInForm />
      </Box>
    </ThemeProvider>
  );
}

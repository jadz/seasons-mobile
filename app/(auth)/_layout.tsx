import { Stack } from 'expo-router';

/**
 * Auth Layout
 * 
 * Defines authentication-related screens.
 * Currently only sign-in, but can be extended for:
 * - Password reset
 * - Email verification
 * - Multi-factor authentication
 */
export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    >
      <Stack.Screen 
        name="sign-in"
        options={{
          title: 'Sign In',
        }}
      />
    </Stack>
  );
}


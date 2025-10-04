import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { AuthProvider } from '../store/auth/AuthProvider';
import { AppDataProvider } from '../store/appData/AppDataProvider';
import {
  Geist_300Light,
  Geist_400Regular,
  Geist_500Medium,
  Geist_600SemiBold,
  Geist_700Bold,
} from '@expo-google-fonts/geist';

SplashScreen.preventAutoHideAsync();

/**
 * Root Layout
 * 
 * Defines the top-level navigation structure for the entire app.
 * Uses Stack instead of Slot to provide proper navigation control and screen management.
 * 
 * Navigation Structure:
 * - index: Entry point that redirects based on auth/onboarding state
 * - (auth): Authentication flows (sign-in, etc.)
 * - onboarding: User and season onboarding flows
 * - (tabs): Main authenticated app experience
 * - playground: Development/testing screen
 */
export default function RootLayout() {
  const [loaded, error] = useFonts({
    Geist_300Light,
    Geist_400Regular,
    Geist_500Medium,
    Geist_600SemiBold,
    Geist_700Bold,
  });

  useEffect(() => {
    console.log('Font loading status:', { loaded, error });
    if (error) {
      console.error('Font loading error:', error);
    }
    if (loaded) {
      console.log('Fonts loaded successfully!');
    }
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <AuthProvider>
      <AppDataProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          {/* Entry point - handles auth/onboarding routing logic */}
          <Stack.Screen 
            name="index"
            options={{
              headerShown: false,
            }}
          />

          {/* Authentication flow (grouped) */}
          <Stack.Screen 
            name="(auth)"
            options={{
              headerShown: false,
            }}
          />

          {/* Onboarding flow (grouped) */}
          <Stack.Screen 
            name="onboarding"
            options={{
              headerShown: false,
            }}
          />

          {/* Main app (grouped tabs) */}
          <Stack.Screen 
            name="(tabs)"
            options={{
              headerShown: false,
            }}
          />

          {/* Development/testing screens */}
          <Stack.Screen 
            name="playground"
            options={{
              headerShown: false,
              presentation: 'modal',
            }}
          />

          {/* Legacy onboarding entry (if still needed) */}
          <Stack.Screen 
            name="user-onboarding"
            options={{
              headerShown: false,
            }}
          />
        </Stack>
      </AppDataProvider>
    </AuthProvider>
  );
}

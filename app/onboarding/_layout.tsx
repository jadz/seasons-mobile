import { Stack } from 'expo-router';
import { ThemeProvider } from '../../components/ui/foundation';

/**
 * Onboarding Layout
 * 
 * This layout defines all onboarding screens. While the flow is currently
 * static and linear, it's designed to be flexible for future dynamic flows
 * based on user choices (e.g., strength vs hypertrophy focus).
 * 
 * Future: Screens may be conditionally shown based on:
 * - User's training goals (strength, hypertrophy, endurance)
 * - Selected focus areas/pillars
 * - Previous onboarding progress
 */
export default function OnboardingLayout() {
  return (
    <ThemeProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          gestureEnabled: true,
          gestureDirection: 'horizontal',
        }}
      >
        {/* ========================================
            ENTRY POINTS
            ======================================== */}
        <Stack.Screen 
          name="overview" 
          options={{
            title: 'Welcome to Seasons',
          }}
        />

        {/* ========================================
            USER ONBOARDING (Steps 1-3)
            Basic user profile setup
            ======================================== */}
        <Stack.Screen 
          name="user-step-1-username" 
          options={{
            title: 'Choose Username',
          }}
        />
        <Stack.Screen 
          name="user-step-2-personal-info" 
          options={{
            title: 'Personal Information',
          }}
        />
        <Stack.Screen 
          name="user-step-3-unit-preferences" 
          options={{
            title: 'Unit Preferences',
          }}
        />

        {/* ========================================
            SEASON CREATION FLOW
            ======================================== */}
        <Stack.Screen 
          name="season-overview" 
          options={{
            title: 'Create Your Season',
          }}
        />

        {/* Step 1: Outcomes & Goals */}
        <Stack.Screen 
          name="season-step-1-outcomes" 
          options={{
            title: 'Choose Your Goal',
          }}
        />

        {/* Step 2: Strength Focus Selection */}
        <Stack.Screen 
          name="season-step-2-strength" 
          options={{
            title: 'Strength Focus',
          }}
        />

        {/* Step 3: Strength Numbers/Baseline */}
        <Stack.Screen 
          name="season-step-3-strength-numbers" 
          options={{
            title: 'Set Your Numbers',
          }}
        />

        {/* Step 4: Body Metrics */}
        <Stack.Screen 
          name="season-step-4-body-metrics" 
          options={{
            title: 'Body Metrics',
          }}
        />

        {/* Step 5: Other Metrics Selection */}
        <Stack.Screen 
          name="season-step-5-set-other-metrics" 
          options={{
            title: 'Other Metrics',
          }}
        />

        {/* Step 6: Training Phases */}
        <Stack.Screen 
          name="season-step-6-training-phases" 
          options={{
            title: 'Training Phases',
          }}
        />

        {/* Step 7: Season Summary & Confirmation */}
        <Stack.Screen 
          name="season-step-7-season-summary" 
          options={{
            title: 'Season Summary',
          }}
        />

        {/* ========================================
            FUTURE: Nested pillar-based screens
            will be organized under /health/* when implemented
            ======================================== */}
      </Stack>
    </ThemeProvider>
  );
}

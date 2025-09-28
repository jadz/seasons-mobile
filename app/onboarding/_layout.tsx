import { Stack } from 'expo-router';
import { ThemeProvider } from '../../components/ui/foundation';

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
        <Stack.Screen 
          name="season-step-3-strength-numbers" 
          options={{
            title: 'Set Your Numbers',
          }}
        />
        <Stack.Screen 
          name="season-step-1-outcomes" 
          options={{
            title: 'Choose Your Goal',
          }}
        />
        <Stack.Screen 
          name="season-step-2-strength" 
          options={{
            title: 'Strength Focus',
          }}
        />
        {/* <Stack.Screen 
          name="season-step-3-strength-numbers" 
          options={{
            title: 'Set Your Numbers',
          }}
        /> */}
        <Stack.Screen 
          name="season-step-4-body-metrics" 
          options={{
            title: 'Body Metrics',
          }}
        />
        <Stack.Screen 
          name="season-step-5-set-other-metrics" 
          options={{
            title: 'Other Metrics',
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}

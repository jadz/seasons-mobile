import React from 'react';
import { View, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@shopify/restyle';
import { Box, Text, Button, Header } from '../../components/ui';
import { Theme } from '../../components/ui/foundation/theme';

export default function SeasonOverviewScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme<Theme>();

  const handleBackPress = () => {
    router.back();
  };

  const handleStartSeasonCreation = () => {
    router.push('/onboarding/season-step-1-outcomes');
  };

  const handleSkipForNow = () => {
    router.replace('/(tabs)');
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors['bg/page'] }}>
      {/* Safe Area Top */}
      <View style={{ paddingTop: insets.top }} />
      
      {/* Header */}
      <Header
        title="Let's Build Your Season"
        showBackButton={true}
        onBackPress={handleBackPress}
        variant="transparent"
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <Box paddingHorizontal="l" paddingVertical="xl">
          
          {/* Completion Confirmation */}
          <Box marginBottom="xl">
            <Box
              backgroundColor="bg/surface"
              padding="l"
              borderRadius="md"
              marginBottom="l"
            >
              <Text variant="h4" color="text/primary" marginBottom="xs">
                ✓ Great! We know you now
              </Text>
              <Text variant="bodySmall" color="text/secondary">
                You've completed your profile setup. Time to focus on your outcomes.
              </Text>
            </Box>
          </Box>

          {/* What's Next Introduction */}
          <Box marginBottom="xl">
            <Text variant="h1" color="text/primary" marginBottom="md">
              Now, let's create your first season
            </Text>
            <Text variant="body" color="text/secondary">
              A season is a focused training period where you work towards a specific outcome. Think of it like a training block with a clear purpose.
            </Text>
          </Box>

          {/* What We'll Cover */}
          <Box marginBottom="xl">
            <Text variant="h3" color="text/primary" marginBottom="l">
              Here's what we'll figure out together:
            </Text>

            <Box marginBottom="l">
              <Box flexDirection="row" marginBottom="m">
                <Text variant="h2" color="text/primary" marginRight="md">1</Text>
                <Box flex={1}>
                  <Text variant="h4" color="text/primary" marginBottom="xs">
                    Your focus
                  </Text>
                  <Text variant="bodySmall" color="text/secondary">
                    What outcome do you want to achieve this season?
                  </Text>
                </Box>
              </Box>
            </Box>

            <Box marginBottom="l">
              <Box flexDirection="row" marginBottom="m">
                <Text variant="h2" color="text/primary" marginRight="md">2</Text>
                <Box flex={1}>
                  <Text variant="h4" color="text/primary" marginBottom="xs">
                    Define success
                  </Text>
                  <Text variant="bodySmall" color="text/secondary">
                    How will you know you've achieved what you set out to do?
                  </Text>
                </Box>
              </Box>
            </Box>

            <Box marginBottom="l">
              <Box flexDirection="row">
                <Text variant="h2" color="text/primary" marginRight="md">3</Text>
                <Box flex={1}>
                  <Text variant="h4" color="text/primary" marginBottom="xs">
                    Your baseline
                  </Text>
                  <Text variant="bodySmall" color="text/secondary">
                    Where are you starting from? This helps us track your progress.
                  </Text>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Motivation */}
          <Box 
            backgroundColor="bg/surface" 
            padding="l" 
            borderRadius="md" 
            marginBottom="xl"
          >
            <Text variant="h4" color="text/primary" marginBottom="sm">
              Why create a season?
            </Text>
            <Text variant="bodySmall" color="text/secondary">
              Having a clear focus keeps you motivated and helps you see real progress. Instead of switching your focus every few weeks, you'll have a plan that gets you results.
            </Text>
          </Box>

          {/* Action Buttons */}
          <Box gap="md">
            <Button
              variant="primary"
              onPress={handleStartSeasonCreation}
              fullWidth
            >
              Create My First Season
            </Button>
            
            <Button
              variant="ghost"
              onPress={handleSkipForNow}
              fullWidth
            >
              Skip and Explore App
            </Button>
          </Box>
          
          {/* Bottom Spacing */}
          <View style={{ paddingBottom: insets.bottom + 20 }} />
        </Box>
      </ScrollView>
    </View>
  );
}

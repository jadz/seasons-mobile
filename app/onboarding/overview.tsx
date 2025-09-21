import React from 'react';
import { View, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@shopify/restyle';
import { Box, Text, Button, Header } from '../../components/ui';
import { Theme } from '../../components/ui/foundation/theme';

export default function OnboardingOverviewScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme<Theme>();

  const handleGetStarted = () => {
    // Navigate to user information collection first
    router.push('/onboarding/user-step-1-username');
  };

  const handleSkipOnboarding = () => {
    // Skip to main app
    router.replace('/(tabs)');
  };

  const TimelineStep: React.FC<{
    stepNumber: number;
    title: string;
    description: string;
    isLast?: boolean;
  }> = ({ stepNumber, title, description, isLast = false }) => (
    <Box flexDirection="row" marginBottom={isLast ? "xl" : "lg"}>
      {/* Timeline Column */}
      <Box alignItems="center" marginRight="md">
        {/* Step Circle */}
        <Box
          width={32}
          height={32}
          borderRadius="round"
          backgroundColor="text/primary"
          alignItems="center"
          justifyContent="center"
        >
          <Text variant="captionMedium" color="text/inverse">
            {stepNumber}
          </Text>
        </Box>
        
        {/* Connecting Line */}
        {!isLast && (
          <Box
            width={2}
            height={40}
            backgroundColor="border/subtle"
            marginTop="sm"
          />
        )}
      </Box>
      
      {/* Content Column */}
      <Box flex={1} paddingTop="xs">
        <Text variant="h4" color="text/primary" marginBottom="xs">
          {title}
        </Text>
        <Text variant="bodySmall" color="text/secondary">
          {description}
        </Text>
      </Box>
    </Box>
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors['bg/page'] }}>
      {/* Safe Area Top */}
      <View style={{ paddingTop: insets.top }} />
      
      {/* Header */}
      <Header
        title="Welcome to Seasons"
        variant="transparent"
      />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <Box paddingHorizontal="l" paddingVertical="xl">
          {/* Introduction */}
          <Box marginBottom="xl">
            <Text variant="h1" color="text/primary" marginBottom="md">
              Here's what we're going to do together:
            </Text>
            <Text variant="body" color="text/secondary">
              A "season" is a block of time where you focus on a specific outcome. Seasons are usually grouped into training blocks and can be as short as a few weeks or as long as a few months.
            </Text>
          </Box>
          
          {/* Timeline */}
          <Box marginBottom="xl">
            <TimelineStep
              stepNumber={1}
              title="Tell us about yourself"
              description="Share some basic information to get started"
            />
            
            <TimelineStep
              stepNumber={2}
              title="What do you want to achieve?"
              description="Define a specific outcome you want to achieve for the season"
            />
            
            <TimelineStep
              stepNumber={3}
              title="Decide on a training program"
              description="We can recommend a program, or you can choose and build your own"
              isLast
            />
          </Box>
          
          {/* Value Proposition */}
          <Box 
            backgroundColor="bg/surface" 
            padding="l" 
            borderRadius="md" 
            marginBottom="xl"
          >
            <Text variant="h4" color="text/primary" marginBottom="sm">
              Why go through the setup?
            </Text>
            <Text variant="bodySmall" color="text/secondary">
              The more we know about you, the better we can tailor your training. Don't worry—you can change everything later as you grow.
            </Text>
          </Box>
          
          {/* Action Buttons */}
          <Box gap="md">
            <Button
              variant="primary"
              onPress={handleGetStarted}
              fullWidth
            >
              Get Started
            </Button>
          </Box>
          
          {/* Bottom Spacing */}
          <View style={{ paddingBottom: insets.bottom + 20 }} />
        </Box>
      </ScrollView>
    </View>
  );
}

import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@shopify/restyle';
import { Box, Text, Button, Header, WizardBar, TextInput } from '../../components/ui';
import { Theme } from '../../components/ui/foundation/theme';

export default function SeasonSummaryScreen() {
  const [seasonName, setSeasonName] = useState('');
  const insets = useSafeAreaInsets();
  const theme = useTheme<Theme>();

  const handleBackPress = () => {
    router.back();
  };

  const handleFinish = async () => {
    if (!seasonName.trim()) return;
    
    // TODO: Save season data and navigate to main app
    console.log('Season completed:', { seasonName });
    
    // For now, navigate back to main screen
    router.replace('/');
  };

  const isValidSeasonName = seasonName.trim().length >= 2;

  // TODO: In real implementation, this would come from actual onboarding state/storage
  // Based on actual data structure captured in each step:
  const seasonData = {
    // From season-step-1-outcomes.tsx: selectedFocus state
    primaryGoal: 'Strength', // Only "stronger" is currently enabled, others disabled
    
    // From season-step-2-strength.tsx: selectedLifts array + focusOverallStrength boolean  
    strengthFocus: 'Overall strength', // Or specific lifts like ['squat', 'deadlift', 'bench']
    
    // From season-step-3-strength-numbers.tsx: liftsData with current numbers
    strengthBaselines: 'Set', // User has entered their current lift numbers
    
    // From season-step-4-body-metrics.tsx: selectedMetrics array + skipTracking boolean
    bodyMetrics: ['Body Weight', 'Body Fat %'], // Or empty if skipTracking: true
    
    // From season-step-5-set-other-metrics.tsx: metricsData with current/target values
    metricsBaselines: 'Set', // User has entered baseline and target values
    
    // From season-step-6-training-phases.tsx: phases array with TrainingPhase objects
    trainingPhases: [
      {
        name: 'Phase 1',
        duration: '4 weeks',
        hasDeload: true,
        startDate: 'Sep 1, 2025',
        endDate: 'Sep 30, 2025'
      }
    ]
  };

  return (
    <Box flex={1} backgroundColor="bg/page">
      {/* Safe Area Top */}
      <View style={{ paddingTop: insets.top }} />
      
      {/* Header */}
      <Header
        title="Season Setup"
        showBackButton={true}
        onBackPress={handleBackPress}
        variant="transparent"
      />
      
      {/* Progress Indicator */}
      <Box paddingHorizontal="l" marginBottom="l">
        <WizardBar totalSteps={6} currentStep={6} />
      </Box>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Box paddingHorizontal="l" paddingVertical="xl">
          
          {/* Section Introduction */}
          <Box marginBottom="xl">
            <Text variant="h1" color="text/primary" marginBottom="md">
              Name your season
            </Text>
            <Text variant="body" color="text/secondary">
              Give your training season a memorable name and review your setup.
            </Text>
          </Box>
          
          {/* Season Name Input */}
          <Box marginBottom="xl">
            <TextInput
              label="Season Name"
              placeholder="e.g., Summer Strength, Marathon Prep 2025"
              value={seasonName}
              onChangeText={setSeasonName}
              variant="outlined"
              maxLength={50}
            />
            
            <Box marginTop="m">
              <Text variant="caption" color="text/secondary">
                • 2-50 characters
              </Text>
              <Text variant="caption" color="text/secondary">
                • Choose something meaningful to help you stay motivated
              </Text>
            </Box>
          </Box>

          {/* Season Summary */}
          <Box marginBottom="xl">
            <Text variant="h2" color="text/primary" marginBottom="l">
              Season Summary
            </Text>
            
            {/* Primary Goal */}
            <Box marginBottom="l">
              <Text variant="label" color="text/primary" marginBottom="m">
                Primary Goal
              </Text>
              <Text variant="body" color="text/secondary">
                • {seasonData.primaryGoal}
              </Text>
            </Box>

            {/* Strength Focus */}
            <Box marginBottom="l">
              <Text variant="label" color="text/primary" marginBottom="m">
                Strength Focus
              </Text>
              <Text variant="body" color="text/secondary">
                • {seasonData.strengthFocus}
              </Text>
              <Text variant="body" color="text/secondary">
                • Baseline numbers: {seasonData.strengthBaselines}
              </Text>
            </Box>

            {/* Body Metrics */}
            <Box marginBottom="l">
              <Text variant="label" color="text/primary" marginBottom="m">
                Body Metrics Tracking
              </Text>
              {seasonData.bodyMetrics.length > 0 ? (
                <>
                  {seasonData.bodyMetrics.map((metric, index) => (
                    <Box key={index} marginBottom="xs">
                      <Text variant="body" color="text/secondary">
                        • {metric}
                      </Text>
                    </Box>
                  ))}
                  <Text variant="body" color="text/secondary">
                    • Baseline values: {seasonData.metricsBaselines}
                  </Text>
                </>
              ) : (
                <Text variant="body" color="text/secondary">
                  • No body metrics tracking
                </Text>
              )}
            </Box>

            {/* Training Phases */}
            <Box marginBottom="l">
              <Text variant="label" color="text/primary" marginBottom="m">
                Training Phases ({seasonData.trainingPhases.length} phases)
              </Text>
              {seasonData.trainingPhases.map((phase, index) => (
                <Box key={index} marginBottom="s">
                  <Text variant="body" color="text/secondary">
                    • {phase.name} - {phase.duration}
                    {phase.hasDeload && ' (with deload week)'}
                  </Text>
                  <Text variant="caption" color="text/secondary" marginLeft="m">
                    {phase.startDate} to {phase.endDate}
                  </Text>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Call to Action */}
          <Box marginBottom="xl">
            <Box 
              backgroundColor="bg/raised" 
              borderRadius="md" 
              padding="l"
              marginBottom="l"
            >
              <Text variant="bodyMedium" color="text/primary" marginBottom="s">
                Ready to start your journey?
              </Text>
              <Text variant="body" color="text/secondary">
                Your season setup is complete! You can always adjust your goals, metrics, and training phases as you progress.
              </Text>
            </Box>
          </Box>

          {/* Finish Button */}
          <Button
            variant="primary"
            onPress={handleFinish}
            disabled={!isValidSeasonName}
            fullWidth
          >
            {isValidSeasonName ? 'Start My Season' : 'Enter a season name to continue'}
          </Button>
          
          {/* Bottom Spacing */}
          <View style={{ paddingBottom: insets.bottom + 20 }} />
        </Box>
      </ScrollView>
    </Box>
  );
}

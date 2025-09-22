import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Box, Text, Button, WizardBar, Header } from '../../components/ui';
import { SimpleSelectionButton } from '../../components/ui/selection/SimpleSelectionButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SeasonStrengthScreen() {
  const [selectedLifts, setSelectedLifts] = useState<string[]>([]);
  const [focusOverallStrength, setFocusOverallStrength] = useState(false);
  const insets = useSafeAreaInsets();

  const handleLiftSelection = (liftId: string) => {
    if (focusOverallStrength) {
      return; // Don't allow individual lift selection if overall strength is selected
    }
    
    setSelectedLifts(prev => {
      if (prev.includes(liftId)) {
        return prev.filter(id => id !== liftId);
      } else {
        return [...prev, liftId];
      }
    });
  };

  const handleOverallStrengthToggle = () => {
    if (!focusOverallStrength) {
      // Clear individual lift selections when selecting overall strength
      setSelectedLifts([]);
      setFocusOverallStrength(true);
    } else {
      setFocusOverallStrength(false);
    }
  };

  const handleAddAnotherLift = () => {
    // Simple mock - just show an alert for now
    console.log('Add another lift pressed');
  };

  const handleBackPress = () => {
    router.back();
  };
  

  return (
    <Box flex={1} backgroundColor="background">
      {/* Safe Area Top */}
      <Box style={{ paddingTop: insets.top }} backgroundColor="background" />
      
      {/* Standardized Header with Strength Accent */}
      <Header
        title="Let's build your season"
        showBackButton={true}
        onBackPress={handleBackPress}
        variant="transparent"
        backgroundColor="background"
      />
      
      {/* Progress Indicator with Strength Theme */}
      <Box paddingHorizontal="l" marginBottom="l">
        <WizardBar totalSteps={4} currentStep={1} />
      </Box>
      
      {/* Strength Focus Indicator */}
      <Box paddingHorizontal="l" marginBottom="l">
        <Box 
          style={{ backgroundColor: "#D67B7B" }}
          borderRadius="m" 
          paddingHorizontal="m" 
          paddingVertical="xs"
          alignSelf="flex-start"
        >
          <Text variant="small" color="white" style={{ fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 }}>
            💪 Strength Focus
          </Text>
        </Box>
      </Box>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Box paddingHorizontal="l">
          {/* Specific Lifts Section */}
          <Box marginBottom="xs">
            <Text variant="h2" color="text" marginBottom="m">
              Specific lifts I want to improve:
            </Text>
            <Box flexDirection="row" flexWrap="wrap" alignItems="flex-start" marginBottom="l">
              <SimpleSelectionButton 
                title="Bench Press"
                isSelected={selectedLifts.includes('bench')}
                onPress={() => handleLiftSelection('bench')}
                isDisabled={focusOverallStrength}
              />
              <SimpleSelectionButton 
                title="Overhead Press"
                isSelected={selectedLifts.includes('overhead')}
                onPress={() => handleLiftSelection('overhead')}
                isDisabled={focusOverallStrength}
              />
              <SimpleSelectionButton 
                title="Squat"
                isSelected={selectedLifts.includes('squat')}
                onPress={() => handleLiftSelection('squat')}
                isDisabled={focusOverallStrength}
              />
              <SimpleSelectionButton 
                title="Deadlift"
                isSelected={selectedLifts.includes('deadlift')}
                onPress={() => handleLiftSelection('deadlift')}
                isDisabled={focusOverallStrength}
              />
              <SimpleSelectionButton 
                title="Barbell Row"
                isSelected={selectedLifts.includes('row')}
                onPress={() => handleLiftSelection('row')}
                isDisabled={focusOverallStrength}
              />
              <SimpleSelectionButton 
                title="See more +"
                isSelected={false}
                onPress={handleAddAnotherLift}
                isDisabled={focusOverallStrength}
              />
            </Box>
          </Box>

          {/* Divider */}
          <Box alignItems="center" marginBottom="m">
            <Box flexDirection="row" alignItems="center" width="100%">
              <Box flex={1} height={1} backgroundColor="border" />
              <Text variant="body" color="textMuted" marginHorizontal="m">
                or
              </Text>
              <Box flex={1} height={1} backgroundColor="border" />
            </Box>
          </Box>

          {/* Overall Strength Option */}
          <Box marginBottom="l">
            <Text variant="h3" color="text" marginBottom="m">
              Keep it simple:
            </Text>
            <SimpleSelectionButton 
              title="Focus on overall strength"
              isSelected={focusOverallStrength}
              onPress={handleOverallStrengthToggle}
            />
          </Box>
          
          {/* Help Text */}
          {selectedLifts.length === 0 && !focusOverallStrength && (
            <Box marginBottom="m" alignItems="center">
              <Text variant="caption" color="textMuted" textAlign="center">
                Choose at least one option above to continue
              </Text>
            </Box>
          )}

          {/* Next Button */}
          <Box marginBottom="m">
            <Button 
              variant="primary" 
              fullWidth
              disabled={selectedLifts.length === 0 && !focusOverallStrength}
              onPress={() => router.push('/onboarding/season-step-3-strength-numbers')}
            >
              {selectedLifts.length > 0 || focusOverallStrength 
                ? `Set my numbers` 
                : "Choose your focus above"
              }
            </Button>
          </Box>
        </Box>
      </ScrollView>
    </Box>
  );
}

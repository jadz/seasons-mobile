import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Box, Text, Button, WizardBar, Header } from '../../components/ui';
import { SimpleSelectionButton } from '../../components/ui/selection/SimpleSelectionButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemeSwitcher } from '../../components/ui/forms';

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
      {/* Header Gradient Overlay - Balanced Visibility */}
      <LinearGradient
        colors={[
          'rgba(214, 123, 123, 0.35)', // More noticeable coral at top
          'rgba(214, 123, 123, 0.22)', // Medium-strong coral
          'rgba(214, 123, 123, 0.12)', // Medium coral
          'rgba(214, 123, 123, 0.05)', // Light coral
          'rgba(235, 238, 237, 0)', // Fully transparent background
        ]}
        locations={[0, 0.3, 0.6, 0.8, 1]}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 190 + insets.top, // Cover header area properly
          zIndex: 0,
        }}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />
      
      <Box flex={1} backgroundColor="transparent">
        {/* Safe Area Top */}
        <Box style={{ paddingTop: insets.top }} backgroundColor="transparent" />
        
        {/* Standardized Header with Strength Accent */}
        <Header
          title="Let's build your season"
          showBackButton={true}
          onBackPress={handleBackPress}
          variant="transparent"
          backgroundColor="transparent"
        />
        
        {/* Progress Indicator with Strength Theme */}
        <Box paddingHorizontal="l" marginBottom="l">
          <WizardBar totalSteps={4} currentStep={1} />
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
                borderRadius='md'
                fullWidth
                disabled={selectedLifts.length === 0 && !focusOverallStrength}
                // onPress={() => router.push('/onboarding/season-step-3-strength-numbers')}
                onPress={() => router.push('/onboarding/season-step-3-strength-numbers-option1-enhanced')} // Not a bad way of doing it - could actually work
                // onPress={() => router.push('/onboarding/season-step-3-strength-numbers-option3')} // Not a bad way of doing it - could actually work
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
    </Box>
  );
}

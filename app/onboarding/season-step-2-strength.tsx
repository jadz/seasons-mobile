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
        // Cap at 3 lifts maximum
        if (prev.length >= 3) {
          return prev; // Don't add more if already at limit
        }
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
    <Box flex={1} backgroundColor="bg/page">
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
      
      <Box flex={1}>
        {/* Safe Area Top */}
        <Box style={{ paddingTop: insets.top }} />
        
        {/* Standardized Header with Strength Accent */}
        <Header
          title="Let's build your season"
          showBackButton={true}
          onBackPress={handleBackPress}
          variant="transparent"
        />
        
        {/* Progress Indicator with Strength Theme */}
        <Box paddingHorizontal="l" marginBottom="l">
          <WizardBar totalSteps={6} currentStep={1} />
        </Box>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Box paddingHorizontal="l">
            {/* Specific Lifts Section */}
            <Box marginBottom="xs">
              <Text variant="h1" color="text/primary" marginBottom="m">
                For my strength focus, I want to improve:
              </Text>
              <Box flexDirection="row" flexWrap="wrap" alignItems="flex-start" marginBottom="m">
                <SimpleSelectionButton 
                  title="Bench Press"
                  isSelected={selectedLifts.includes('bench')}
                  onPress={() => handleLiftSelection('bench')}
                  isDisabled={focusOverallStrength || (selectedLifts.length >= 3 && !selectedLifts.includes('bench'))}
                />
                <SimpleSelectionButton 
                  title="Overhead Press"
                  isSelected={selectedLifts.includes('overhead')}
                  onPress={() => handleLiftSelection('overhead')}
                  isDisabled={focusOverallStrength || (selectedLifts.length >= 3 && !selectedLifts.includes('overhead'))}
                />
                <SimpleSelectionButton 
                  title="Squat"
                  isSelected={selectedLifts.includes('squat')}
                  onPress={() => handleLiftSelection('squat')}
                  isDisabled={focusOverallStrength || (selectedLifts.length >= 3 && !selectedLifts.includes('squat'))}
                />
                <SimpleSelectionButton 
                  title="Deadlift"
                  isSelected={selectedLifts.includes('deadlift')}
                  onPress={() => handleLiftSelection('deadlift')}
                  isDisabled={focusOverallStrength || (selectedLifts.length >= 3 && !selectedLifts.includes('deadlift'))}
                />
                <SimpleSelectionButton 
                  title="Barbell Row"
                  isSelected={selectedLifts.includes('row')}
                  onPress={() => handleLiftSelection('row')}
                  isDisabled={focusOverallStrength || (selectedLifts.length >= 3 && !selectedLifts.includes('row'))}
                />
              </Box>
              
              {/* Selection limit message */}
              <Box marginBottom="l">
                {selectedLifts.length >= 3 ? (
                  <Text variant="caption" color="text/secondary" textAlign="center">
                    Perfect! Focus on these 3 lifts to get started. You can add more lifts later in your season.
                  </Text>
                ) : selectedLifts.length > 0 ? (
                  <Text variant="caption" color="text/secondary" textAlign="center">
                    {selectedLifts.length} of 3 lifts selected • Pick up to 3 to get started
                  </Text>
                ) : (
                  <Text variant="caption" color="text/secondary" textAlign="center">
                    Pick up to 3 lifts to focus on this season
                  </Text>
                )}
              </Box>
            </Box>

            {/* Divider */}
            <Box alignItems="center" marginBottom="m">
              <Box flexDirection="row" alignItems="center" width="100%">
                <Box flex={1} height={1} />
                <Text variant="body" color="text/secondary" marginHorizontal="m">
                  or
                </Text>
                <Box flex={1} height={1} />
              </Box>
            </Box>

            {/* Overall Strength Option */}
            <Box marginBottom="l">
              <Text variant="h2" color="text/primary" marginBottom="m">
                Keep it simple:
              </Text>
              <SimpleSelectionButton 
                title="Overall strength (all lifts)"
                isSelected={focusOverallStrength}
                onPress={handleOverallStrengthToggle}
              />
            </Box>
            
            {/* Help Text */}
            {selectedLifts.length === 0 && !focusOverallStrength && (
              <Box marginBottom="m" alignItems="center">
                <Text variant="caption" color="text/secondary" textAlign="center">
                  Choose what you want to focus on this season
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
                  ? `Set my strength focus` 
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

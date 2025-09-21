import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { Box, Text, Button, WizardBar } from '../../components/ui';
import { SimpleSelectionButton } from '../../components/ui/selection/SimpleSelectionButton';

export default function SeasonStrengthScreen() {
  const [selectedLifts, setSelectedLifts] = useState<string[]>([]);
  const [focusOverallStrength, setFocusOverallStrength] = useState(false);

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

  return (
    <Box flex={1} backgroundColor="background">
      <ScrollView showsVerticalScrollIndicator={false}>
        <Box paddingHorizontal="l" paddingTop="xl">
          {/* Progress Indicator */}
          <WizardBar totalSteps={4} currentStep={1} />
          
          {/* Header Section */}
          <Box paddingVertical="xl" alignItems="center">
            <Text variant="title" textAlign="center" marginBottom="s">
              I want to get stronger in the following lifts...
            </Text>
          </Box>
          
          {/* Lift Selection Cards - Flowing Layout */}
          <Box marginBottom="l" flexDirection="row" flexWrap="wrap" alignItems="flex-start">
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

          {/* Overall Strength Option */}
          <Box marginBottom="xl">
            <SimpleSelectionButton 
              title="I just want to focus on overall strength"
              isSelected={focusOverallStrength}
              onPress={handleOverallStrengthToggle}
            />
          </Box>
          
          {/* Next Button */}
          <Box marginBottom="xl">
            <Button 
              variant="primary" 
              fullWidth
              disabled={selectedLifts.length === 0 && !focusOverallStrength}
            >
              Next
            </Button>
          </Box>
        </Box>
      </ScrollView>
    </Box>
  );
}

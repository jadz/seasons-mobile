import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { Box, Text, Button, WizardBar, SelectionCard } from '../../components/ui';

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
          
          {/* Lift Selection Cards - 2x2 Grid */}
          <Box marginBottom="l">
            <Box flexDirection="row" marginBottom="s">
              <Box flex={1} marginRight="s">
                <SelectionCard 
                  title="Bench Press"
                  size="small"
                  isSelected={selectedLifts.includes('bench')}
                  onPress={() => handleLiftSelection('bench')}
                  isDisabled={focusOverallStrength}
                />
              </Box>
              <Box flex={1} marginLeft="s">
                <SelectionCard 
                  title="Overhead Press"
                  size="small"
                  isSelected={selectedLifts.includes('overhead')}
                  onPress={() => handleLiftSelection('overhead')}
                  isDisabled={focusOverallStrength}
                />
              </Box>
            </Box>
            
            <Box flexDirection="row" marginBottom="l">
              <Box flex={1} marginRight="s">
                <SelectionCard 
                  title="Squat"
                  size="small"
                  isSelected={selectedLifts.includes('squat')}
                  onPress={() => handleLiftSelection('squat')}
                  isDisabled={focusOverallStrength}
                />
              </Box>
              <Box flex={1} marginLeft="s">
                <SelectionCard 
                  title="Deadlift"
                  size="small"
                  isSelected={selectedLifts.includes('deadlift')}
                  onPress={() => handleLiftSelection('deadlift')}
                  isDisabled={focusOverallStrength}
                />
              </Box>
            </Box>
          </Box>

          {/* Add Another Lift Button */}
          <Box marginBottom="l">
            <SelectionCard 
              title="+ Add another lift"
              isSelected={false}
              onPress={handleAddAnotherLift}
              isDisabled={focusOverallStrength}
            />
          </Box>

          {/* Overall Strength Option */}
          <Box marginBottom="xl">
            <SelectionCard 
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

import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Box, Text, Button, WizardBar, SelectionCard } from '../../components/ui';

export default function SeasonGoalsScreen() {
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);

  const handleContinue = () => {
    if (selectedGoal === 'stronger') {
      router.push('/onboarding/season-step-2-strength');
    }
    // For other goals, we could add different navigation paths later
  };
  return (
    <Box flex={1} backgroundColor="background">
      <ScrollView showsVerticalScrollIndicator={false}>
        <Box paddingHorizontal="l" paddingTop="xl">
          {/* Progress Indicator */}
          <WizardBar totalSteps={4} currentStep={0} />
          
          {/* Header Section */}
          <Box paddingVertical="xl" alignItems="center">
            <Text variant="title" textAlign="center" marginBottom="s">
              Let's Build Your Season
            </Text>
            <Text variant="body" textAlign="center" color="textMuted">
              At the end of this season, I want to...
            </Text>
          </Box>
          
          {/* Goal Selection Cards */}
          <Box marginBottom="xl">
            <SelectionCard 
              title="Be Stronger"
              description="Core lifts, overall strength"
              isSelected={selectedGoal === 'stronger'}
              onPress={() => setSelectedGoal('stronger')}
            />
            
            <SelectionCard 
              title="Get Faster" 
              description="Cut time in specific events"
              isSelected={selectedGoal === 'faster'}
              onPress={() => setSelectedGoal('faster')}
              isDisabled={true}
            />
            
            <SelectionCard 
              title="Get Leaner"
              description="Reduce body fat, improve body composition"
              isSelected={selectedGoal === 'leaner'}
              onPress={() => setSelectedGoal('leaner')}
              isDisabled={true}
            />
            
            <SelectionCard 
              title="+ Custom Outcome"
              isSelected={selectedGoal === 'custom'}
              onPress={() => setSelectedGoal('custom')}
              isDisabled={true}
            />
          </Box>
          
          {/* Continue Button */}
          <Box marginBottom="xl">
            <Button 
              variant="primary" 
              fullWidth
              onPress={handleContinue}
              disabled={!selectedGoal}
            >
              Continue
            </Button>
          </Box>
        </Box>
      </ScrollView>
    </Box>
  );
}

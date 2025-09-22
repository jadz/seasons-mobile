import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Box, Text, Button, WizardBar, SelectionCard, Header } from '../../components/ui';

export default function SeasonGoalsScreen() {
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const insets = useSafeAreaInsets();

  const handleGoalSelection = (goalId: string) => {
    setSelectedGoal(goalId);
    
    // Immediate navigation based on selection
    if (goalId === 'stronger') {
      // Small delay for visual feedback, then navigate
      setTimeout(() => {
        router.push('/onboarding/season-step-2-strength');
      }, 150);
    }
    // For other goals, we could add different navigation paths later
  };

  const handleBackPress = () => {
    router.back();
  };
  
  return (
    <Box flex={1} backgroundColor="background">
      {/* Safe Area Top */}
      <Box style={{ paddingTop: insets.top }} backgroundColor="background" />
      
      {/* Standardized Header */}
      <Header
        title="Let's build your season"
        showBackButton={true}
        onBackPress={handleBackPress}
        variant="transparent"
        backgroundColor="background"
      />
      
      {/* Progress Indicator */}
      <Box paddingHorizontal="l" marginBottom="l">
        <WizardBar totalSteps={4} currentStep={0} />
      </Box>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Box paddingHorizontal="l">
          
          {/* Section Introduction */}
          <Box marginBottom="l">
            <Text variant="h2" color="text" marginBottom="xs">
              At the end of this season, I want to:
            </Text>
            {/* <Text variant="body" color="textMuted">
              Choose the outcome that excites you most for this season
            </Text> */}
          </Box>
          
          {/* Goal Selection Cards */}
          <Box marginBottom="xl">
            <SelectionCard 
              title="Get Stronger"
              colorVariant="coral"
              label="STRENGTH"
              largeDescription="Lift heavier weights and build muscle"
              isSelected={selectedGoal === 'stronger'}
              onPress={() => handleGoalSelection('stronger')}
            />
            
            <Box style={{ opacity: 0.6 }}>
              <SelectionCard 
                title="Get Faster" 
                colorVariant="purple"
                label="SPEED"
                largeDescription="Run faster and improve endurance"
                isSelected={selectedGoal === 'faster'}
                onPress={() => {}}
                isDisabled={true}
              />
            </Box>
            
            <Box style={{ opacity: 0.6 }}>
              <SelectionCard 
                title="Get Leaner"
                colorVariant="navy"
                label="BODY COMPOSITION"
                largeDescription="Lose fat and tone your body"
                isSelected={selectedGoal === 'leaner'}
                onPress={() => {}}
                isDisabled={true}
              />
            </Box>
            
            <Box style={{ opacity: 0.6 }}>
              <SelectionCard 
                title="Something Else"
                colorVariant="default"
                description="More goals coming soon"
                isSelected={selectedGoal === 'custom'}
                onPress={() => {}}
                isDisabled={true}
              />
            </Box>
          </Box>
        </Box>
      </ScrollView>
    </Box>
  );
}

import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Box, Text, Button, WizardBar, SelectionCard, Header } from '../../components/ui';

export default function SeasonFocusScreen() {
  const [selectedFocus, setSelectedFocus] = useState<string | null>(null);
  const insets = useSafeAreaInsets();

  const handleFocusSelection = (focusId: string) => {
    setSelectedFocus(focusId);
    
    // Immediate navigation based on selection
    if (focusId === 'stronger') {
      // Small delay for visual feedback, then navigate
      setTimeout(() => {
        // router.push('/onboarding/season-step-5-set-other-metrics');
        router.push('/onboarding/season-step-2-strength');
      }, 15);
    }
    // For other focuses, we could add different navigation paths later
  };

  const handleBackPress = () => {
    router.back();
  };
  
  return (
    <Box flex={1} backgroundColor="bg/page">
      {/* Safe Area Top */}
      <Box style={{ paddingTop: insets.top }} backgroundColor="bg/page" />
      
      {/* Standardized Header */}
      <Header
        title="Let's build your season"
        showBackButton={true}
        onBackPress={handleBackPress}
        variant="transparent"
        backgroundColor="bg/page"
      />
      
      {/* Progress Indicator */}
      <Box paddingHorizontal="l" marginBottom="l">
        <WizardBar totalSteps={6} currentStep={0} />
      </Box>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Box paddingHorizontal="l">
          
          {/* Section Introduction */}
          <Box marginBottom="l">
            <Text variant="h1" color="text/primary" marginBottom="xs">
              This season, my focus is:
            </Text>
          </Box>
          
          {/* Focus Selection Cards */}
          <Box marginBottom="xl">
            <SelectionCard 
              title="Strength"
              colorVariant="coral"
              label="STRENGTH FOCUS"
              largeDescription="The outcome I want: Lift heavier and build muscle"
              isSelected={selectedFocus === 'stronger'}
              onPress={() => handleFocusSelection('stronger')}
            />
            
            <Box style={{ opacity: 0.6 }}>
              <SelectionCard 
                title="Speed" 
                colorVariant="purple"
                label="SPEED FOCUS"
                largeDescription="The outcome I want: Run faster with better endurance"
                isSelected={selectedFocus === 'faster'}
                onPress={() => {}}
                isDisabled={true}
              />
            </Box>
            
            <Box style={{ opacity: 0.6 }}>
              <SelectionCard 
                title="Body Composition"
                colorVariant="navy"
                label="COMPOSITION FOCUS"
                largeDescription="The outcome I want: Lose fat and get leaner"
                isSelected={selectedFocus === 'leaner'}
                onPress={() => {}}
                isDisabled={true}
              />
            </Box>
            
            <Box style={{ opacity: 0.6 }}>
              <SelectionCard 
                title="Something Else"
                colorVariant="default"
                description="More focuses coming soon"
                isSelected={selectedFocus === 'custom'}
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

import React, { useState } from 'react';
import { ScrollView, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Box, Text, Button, WizardBar, SelectionCard, Header } from '../../components/ui';
import { useSeasonFocus } from '../../hooks/onboarding/useSeasonFocus';

export default function SeasonFocusScreen() {
  const [selectedFocus, setSelectedFocus] = useState<string | null>(null);
  const insets = useSafeAreaInsets();
  const { pillars, isLoading, error } = useSeasonFocus();

  const handleFocusSelection = (areaOfFocusId: string) => {
    setSelectedFocus(areaOfFocusId);
    
    // Small delay for visual feedback, then navigate
    setTimeout(() => {
      router.push('/onboarding/season-step-2-strength');
    }, 150);
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
          
          {/* Loading State */}
          {isLoading && (
            <Box paddingVertical="xl" alignItems="center">
              <ActivityIndicator size="large" />
              <Text variant="body" color="text/secondary" marginTop="m">
                Loading focus options...
              </Text>
            </Box>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <Box paddingVertical="xl" alignItems="center">
              <Text variant="body" color="state/error" textAlign="center">
                {error}
              </Text>
              <Text variant="caption" color="text/secondary" marginTop="s" textAlign="center">
                Please check your connection and try again
              </Text>
            </Box>
          )}
          
          {/* Focus Selection Cards */}
          {!isLoading && !error && (
            <Box marginBottom="xl">
              {pillars.map((pillar) => (
                pillar.areasOfFocus?.map((area) => (
                  <SelectionCard 
                    key={area.id}
                    title={area.name}
                    customColor={area.colorHex}
                    // label={pillar.displayName.toUpperCase()}
                    label={area.name.toUpperCase()}
                    largeDescription={area.description || `Focus on ${area.name.toLowerCase()}`}
                    isSelected={selectedFocus === area.id}
                    onPress={() => handleFocusSelection(area.id)}
                  />
                ))
              ))}
            </Box>
          )}
        </Box>
      </ScrollView>
    </Box>
  );
}

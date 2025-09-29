import React, { useState, useCallback } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Box, Text, Button, Header, WizardBar } from '../../components/ui';
import { TrainingPhaseDefinitionCard, TrainingPhase } from '../../components/training-phase';
import { DateRange } from '../../components/ui/selection/DateRangePicker';
import { useAppTheme } from '../../components/ui/foundation';

export default function SeasonTrainingPhasesScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useAppTheme();

  // Initialize with one empty phase
  const [phases, setPhases] = useState<TrainingPhase[]>([
    {
      id: '1',
      name: '',
      hasDeload: false
    }
  ]);

  const handlePhaseUpdate = useCallback((updatedPhase: TrainingPhase) => {
    setPhases(prev => prev.map(phase => 
      phase.id === updatedPhase.id ? updatedPhase : phase
    ));
  }, []);

  const handleAddPhase = useCallback(() => {
    const newPhase: TrainingPhase = {
      id: Date.now().toString(),
      name: '',
      hasDeload: false
    };
    setPhases(prev => [...prev, newPhase]);
  }, []);

  const handleRemovePhase = useCallback((phaseId: string) => {
    if (phases.length > 1) {
      setPhases(prev => prev.filter(phase => phase.id !== phaseId));
    }
  }, [phases.length]);

  const handleNext = useCallback(() => {
    console.log('Training phases:', phases);
    // For now, just go back - in real implementation this would continue onboarding
    router.back();
  }, [phases]);

  const handleBackPress = useCallback(() => {
    router.back();
  }, []);

  // Generate existing date ranges for date picker validation
  const getExistingRangesForPhase = useCallback((currentPhaseId: string): DateRange[] => {
    return phases
      .filter(phase => phase.id !== currentPhaseId && phase.startDate && phase.endDate)
      .map(phase => ({
        startDate: phase.startDate!,
        endDate: phase.endDate!,
        color: theme.colors['state/warn'] // Use warning color for existing ranges
      }));
  }, [phases, theme.colors]);

  // Check if user has completed at least one phase
  const hasCompletedPhases = phases.some(phase => 
    phase.name.trim() !== '' && phase.startDate && phase.endDate
  );

  return (
    <Box flex={1} backgroundColor="bg/page">
      <Box style={{ paddingTop: insets.top }} backgroundColor="bg/page" />
      
      {/* Header Gradient Overlay */}
      <LinearGradient
        colors={[
          'rgba(214, 123, 123, 0.35)', // Coral gradient to match existing screens
          'rgba(214, 123, 123, 0.22)',
          'rgba(214, 123, 123, 0.12)',
          'rgba(214, 123, 123, 0.05)',
          'rgba(235, 238, 237, 0)',
        ]}
        locations={[0, 0.3, 0.6, 0.8, 1]}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 190 + insets.top,
          zIndex: 0,
        }}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />
      
      <Header
        title="Training phases"
        showBackButton={true}
        onBackPress={handleBackPress}
        variant="transparent"
        backgroundColor="bg/page"
      />
      
      <Box paddingHorizontal="l">
        <WizardBar totalSteps={6} currentStep={6} />
      </Box>
      
      {/* Header Section */}
      <Box paddingHorizontal="l" paddingVertical="xl">
        <Text variant="h1" color="text/primary" marginBottom="m">
          Build your training phases
        </Text>
        <Text variant="body" color="text/secondary">
          Break your season into focused training periods with optional deload weeks
        </Text>
      </Box>
      
      {/* Phases List */}
      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ 
          paddingHorizontal: 24, 
          paddingBottom: 200 
        }}
        showsVerticalScrollIndicator={false}
      >
        {phases.map((phase, index) => (
          <Box key={phase.id} marginBottom="m">
            {/* Phase Header with Remove Button */}
            {phases.length > 1 && (
              <Box 
                flexDirection="row" 
                justifyContent="space-between" 
                alignItems="center"
                marginBottom="s"
              >
                <Text variant="h3" color="text/primary">
                  Phase {index + 1}
                </Text>
                <TouchableOpacity onPress={() => handleRemovePhase(phase.id)}>
                  <Box
                    backgroundColor="state/error"
                    borderRadius="sm"
                    paddingHorizontal="s"
                    paddingVertical="xs"
                  >
                    <Text variant="caption" color="text/inverse">
                      Remove
                    </Text>
                  </Box>
                </TouchableOpacity>
              </Box>
            )}
            
            <TrainingPhaseDefinitionCard
              phase={phase}
              onPhaseUpdate={handlePhaseUpdate}
              existingRanges={getExistingRangesForPhase(phase.id)}
            />
          </Box>
        ))}
        
        {/* Add Another Phase Button */}
        <TouchableOpacity onPress={handleAddPhase}>
          <Box
            backgroundColor="bg/surface"
            borderColor="border/subtle"
            borderWidth={1}
            borderRadius="md"
            paddingVertical="l"
            marginBottom="xl"
            alignItems="center"
            borderStyle="dashed"
          >
            <Box
              backgroundColor="brand/primary"
              borderRadius="round"
              width={32}
              height={32}
              alignItems="center"
              justifyContent="center"
              marginBottom="s"
            >
              <Text variant="h3" color="brand/onPrimary">+</Text>
            </Box>
            <Text variant="bodyMedium" color="brand/primary">
              Add another phase
            </Text>
          </Box>
        </TouchableOpacity>

        {/* Help Text */}
        <Box marginBottom="l" alignItems="center">
          <Text variant="caption" color="text/secondary" textAlign="center">
            You can always adjust your phases later as your season progresses
          </Text>
        </Box>

        {/* Action Buttons */}
        <Box>
          <Button 
            variant="primary" 
            fullWidth
            onPress={handleNext}
            disabled={!hasCompletedPhases}
            style={{ marginBottom: 12 }}
          >
            {hasCompletedPhases ? "Continue with these phases" : "Complete at least one phase to continue"}
          </Button>
          
          <Button 
            variant="ghost" 
            fullWidth
            onPress={handleBackPress}
          >
            <Text color="text/secondary">
              Back to previous step
            </Text>
          </Button>
        </Box>
      </ScrollView>
    </Box>
  );
}

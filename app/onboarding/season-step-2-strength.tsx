import React, { useState, useRef } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Box, Text, Button, WizardBar, Header } from '../../components/ui';
import { SimpleSelectionButton } from '../../components/ui/selection/SimpleSelectionButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemeSwitcher } from '../../components/ui/forms';
import { ExerciseLibraryModal, ExerciseLibraryModalRef } from '../../components/exercise';
import { Exercise } from '../../domain/models/exercise';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function SeasonStrengthScreen() {
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [focusOverallStrength, setFocusOverallStrength] = useState(false);
  const [shouldRenderSheet, setShouldRenderSheet] = useState(false);
  const insets = useSafeAreaInsets();
  const exerciseLibraryModalRef = useRef<ExerciseLibraryModalRef>(null);

  const handleExerciseSelection = (exercises: Exercise[]) => {
    setSelectedExercises(exercises);
    if (exercises.length > 0) {
      setFocusOverallStrength(false);
    }
  };

  const handleOverallStrengthToggle = () => {
    if (!focusOverallStrength) {
      // Clear individual exercise selections when selecting overall strength
      setSelectedExercises([]);
      setFocusOverallStrength(true);
    } else {
      setFocusOverallStrength(false);
    }
  };

  const handleAddExercisesPress = () => {
    if (!focusOverallStrength) {
      // Lazy render the sheet component on first open
      if (!shouldRenderSheet) {
        setShouldRenderSheet(true);
        // Wait for next frame to ensure component is mounted before opening
        setTimeout(() => {
          exerciseLibraryModalRef.current?.open();
        }, 100);
      } else {
        exerciseLibraryModalRef.current?.open();
      }
    }
  };

  const handleRemoveExercise = (exerciseId: string) => {
    setSelectedExercises(prev => prev.filter(ex => ex.id !== exerciseId));
  };

  const handleBackPress = () => {
    router.back();
  };
  

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
            {/* Specific Exercises Section */}
            <Box marginBottom="xs">
              <Text variant="h1" color="text/primary" marginBottom="m">
                For my strength focus, I want to improve:
              </Text>
              
              {/* Selected Exercises */}
              {selectedExercises.length > 0 && (
                <Box marginBottom="m">
                  {selectedExercises.map((exercise) => (
                    <TouchableOpacity
                      key={exercise.id}
                      onPress={() => handleRemoveExercise(exercise.id)}
                      activeOpacity={0.7}
                    >
                      <Box
                        backgroundColor="brand/primary"
                        borderRadius="md"
                        paddingHorizontal="m"
                        paddingVertical="m"
                        marginBottom="s"
                        flexDirection="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Box flex={1} marginRight="s">
                          <Text variant="body" color="brand/onPrimary" style={{ fontWeight: '600' }}>
                            {exercise.name}
                          </Text>
                          <Text variant="small" color="brand/onPrimary" style={{ opacity: 0.8 }}>
                            {exercise.primaryMuscleGroup.charAt(0).toUpperCase() + exercise.primaryMuscleGroup.slice(1)}
                          </Text>
                        </Box>
                        <Text variant="body" color="brand/onPrimary">
                          ✕
                        </Text>
                      </Box>
                    </TouchableOpacity>
                  ))}
                </Box>
              )}
              
              {/* Add Exercise Button */}
              <Box marginBottom="m">
                <Button 
                  variant={selectedExercises.length === 0 ? "primary" : "secondary"}
                  fullWidth
                  disabled={focusOverallStrength || selectedExercises.length >= 3}
                  onPress={handleAddExercisesPress}
                >
                  {selectedExercises.length === 0 
                    ? "Select exercises" 
                    : selectedExercises.length >= 3
                    ? "Maximum 3 exercises selected"
                    : `Add more exercises (${selectedExercises.length}/3)`
                  }
                </Button>
              </Box>
              
              {/* Selection limit message */}
              <Box marginBottom="l">
                {selectedExercises.length >= 3 ? (
                  <Text variant="caption" color="text/secondary" textAlign="center">
                    Perfect! Focus on these 3 exercises to get started. You can add more later in your season.
                  </Text>
                ) : selectedExercises.length > 0 ? (
                  <Text variant="caption" color="text/secondary" textAlign="center">
                    {selectedExercises.length} of 3 exercises selected • Pick up to 3 to get started
                  </Text>
                ) : (
                  <Text variant="caption" color="text/secondary" textAlign="center">
                    Pick up to 3 exercises to focus on this season
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
            {selectedExercises.length === 0 && !focusOverallStrength && (
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
                disabled={selectedExercises.length === 0 && !focusOverallStrength}
                onPress={() => router.push('/onboarding/season-step-3-strength-numbers')}
              >
                {selectedExercises.length > 0 || focusOverallStrength 
                  ? `Set my strength focus` 
                  : "Choose your focus above"
                }
              </Button>
            </Box>
          </Box>
        </ScrollView>
      </Box>
      
      {/* Exercise Library Modal - Lazy loaded for performance */}
      {shouldRenderSheet && (
        <ExerciseLibraryModal
          ref={exerciseLibraryModalRef}
          maxSelection={3}
          preselectedExerciseIds={selectedExercises.map(ex => ex.id)}
          onApply={handleExerciseSelection}
        />
      )}
    </Box>
    </GestureHandlerRootView>
  );
}

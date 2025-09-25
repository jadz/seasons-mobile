import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Box, Text, Button, WizardBar, TextInput, Header, SegmentedControl } from '../../components/ui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface LiftData {
  id: string;
  name: string;
  currentReps: string;
  currentWeight: string;
  targetReps: string;
  targetWeight: string;
  mode: '1rm' | 'reps'; // 1RM or rep range mode
}

export default function SeasonStrengthNumbersScreen() {
  // Mock selected lifts - in real app this would come from previous screen
  const selectedLifts = ['bench', 'squat', 'deadlift'];

  const insets = useSafeAreaInsets();
  
  const liftNames = {
    bench: 'Bench Press',
    squat: 'Squat',
    deadlift: 'Deadlift',
    overhead: 'Overhead Press',
    row: 'Barbell Row',
  };

  const [liftsData, setLiftsData] = useState<LiftData[]>(
    selectedLifts.map(liftId => ({
      id: liftId,
      name: liftNames[liftId as keyof typeof liftNames],
      currentReps: '1',
      currentWeight: '',
      targetReps: '1',
      targetWeight: '',
      mode: '1rm',
    }))
  );

  const updateLiftData = (liftId: string, field: keyof LiftData, value: string) => {
    setLiftsData(prev => prev.map(lift => 
      lift.id === liftId ? { ...lift, [field]: value } : lift
    ));
  };

  const toggleMode = (liftId: string) => {
    setLiftsData(prev => prev.map(lift => 
      lift.id === liftId 
        ? { 
            ...lift, 
            mode: lift.mode === '1rm' ? 'reps' : '1rm',
            currentReps: lift.mode === '1rm' ? '5' : '1',
            targetReps: lift.mode === '1rm' ? '5' : '1',
          }
        : lift
    ));
  };

  const handleNext = () => {
    // Navigate to body metrics screen
    console.log('Lift data:', liftsData);
    router.push('/onboarding/season-step-4-body-metrics');
  };

  const handleBackPress = () => {
    router.back();
  };

  const isFormValid = liftsData.every(lift => 
    lift.currentWeight && lift.targetWeight
  );

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
      <Box paddingHorizontal="l">
        <WizardBar totalSteps={4} currentStep={2} />
      </Box>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <Box paddingHorizontal="l">
          {/* Header Section */}
          <Box paddingVertical="xl">
            <Text variant="h2" color="text" marginBottom="m">
              What can you lift now?
            </Text>
            <Text variant="body" color="textMuted">
              Don't worry if you're not sure - we'll help you figure it out
            </Text>
          </Box>
          
          {/* Lift Input Cards */}
          <Box marginBottom="xl">
            {liftsData.map((lift, index) => (
              <Box key={lift.id} marginBottom="l">
                <Box
                  backgroundColor="background"
                  borderRadius="l"
                  padding="l"
                  marginBottom="s"
                >
                  {/* Lift Name and Mode Selection */}
                  <Box marginBottom="l">
                    <Box flexDirection="row" alignItems="center" justifyContent="space-between" marginBottom="m">
                      <Text variant="h3" color="text">
                        {lift.name}
                      </Text>
                      <SegmentedControl
                        options={[
                          { value: '1rm', label: 'Max weight' },
                          { value: 'reps', label: 'Reps & weight' }
                        ]}
                        selectedValue={lift.mode}
                        onValueChange={(value) => {
                          if (value !== lift.mode) {
                            toggleMode(lift.id);
                          }
                        }}
                        size="small"
                      />
                    </Box>
                  </Box>

                  {/* Current Performance */}
                  <Box marginBottom="m">
                    <Text variant="label" color="textMuted" marginBottom="xs">
                      {lift.mode === '1rm' ? 'I can lift (max weight)' : 'I can do'}
                    </Text>
                    <Box flexDirection="row" alignItems="center">
                      {lift.mode === 'reps' && (
                        <>
                          <Box flex={1} marginRight="s">
                            <TextInput
                              placeholder="5"
                              value={lift.currentReps}
                              onChangeText={(value) => updateLiftData(lift.id, 'currentReps', value)}
                              keyboardType="numeric"
                            />
                          </Box>
                          <Text variant="body" color="text" marginRight="s">reps at</Text>
                        </>
                      )}
                      <Box flex={2} marginRight="s">
                        <TextInput
                          placeholder={lift.mode === '1rm' ? '80' : '60'}
                          value={lift.currentWeight}
                          onChangeText={(value) => updateLiftData(lift.id, 'currentWeight', value)}
                          keyboardType="numeric"
                        />
                      </Box>
                      <Text variant="body" color="text">kg</Text>
                    </Box>
                  </Box>

                  {/* Goal */}
                  <Box>
                    <Text variant="label" color="textMuted" marginBottom="xs">
                      {lift.mode === '1rm' ? 'I want to lift' : 'I want to do'}
                    </Text>
                    <Box flexDirection="row" alignItems="center">
                      {lift.mode === 'reps' && (
                        <>
                          <Box flex={1} marginRight="s">
                            <TextInput
                              placeholder="8"
                              value={lift.targetReps}
                              onChangeText={(value) => updateLiftData(lift.id, 'targetReps', value)}
                              keyboardType="numeric"
                            />
                          </Box>
                          <Text variant="body" color="text" marginRight="s">reps at</Text>
                        </>
                      )}
                      <Box flex={2} marginRight="s">
                        <TextInput
                          placeholder={lift.mode === '1rm' ? '100' : '70'}
                          value={lift.targetWeight}
                          onChangeText={(value) => updateLiftData(lift.id, 'targetWeight', value)}
                          keyboardType="numeric"
                        />
                      </Box>
                      <Text variant="body" color="text">kg</Text>
                    </Box>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
          
          {/* Help Text */}
          <Box marginBottom="m" alignItems="center">
            <Text variant="caption" color="textMuted" textAlign="center">
              Don't know your numbers yet? No problem!
            </Text>
          </Box>

          {/* Action Buttons */}
          <Box marginBottom="xl">
            <Button 
              variant="primary" 
              fullWidth
              onPress={handleNext}
              disabled={!isFormValid}
              style={{ marginBottom: 12 }}
            >
              {isFormValid ? 'Create My Season' : 'Fill in your numbers above'}
            </Button>
            
            <Button 
              variant="ghost" 
              fullWidth
              onPress={() => {
                // Skip and use default values or continue without numbers
                console.log('Skipping numbers for now');
                handleNext();
              }}
            >
              <Text color="textMuted">
                Skip for now - I'll add them later
              </Text>
            </Button>
          </Box>
        </Box>
      </ScrollView>
    </Box>
  );
}

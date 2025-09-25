import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Box, Text, Button, WizardBar, TextInput, Header } from '../../components/ui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface LiftData {
  id: string;
  name: string;
  emoji: string;
  currentWeight: string;
  targetWeight: string;
}

export default function SeasonStrengthNumbersOption2() {
  const selectedLifts = ['bench', 'squat', 'deadlift'];
  const insets = useSafeAreaInsets();
  
  const liftConfig = {
    bench: { name: 'Bench Press', emoji: '🏋️‍♂️' },
    squat: { name: 'Squat', emoji: '🦵' },
    deadlift: { name: 'Deadlift', emoji: '💪' },
    overhead: { name: 'Overhead Press', emoji: '🙌' },
    row: { name: 'Barbell Row', emoji: '🚣‍♂️' },
  };

  const [liftsData, setLiftsData] = useState<LiftData[]>(
    selectedLifts.map(liftId => ({
      id: liftId,
      name: liftConfig[liftId as keyof typeof liftConfig].name,
      emoji: liftConfig[liftId as keyof typeof liftConfig].emoji,
      currentWeight: '',
      targetWeight: '',
    }))
  );

  const updateLiftData = (liftId: string, field: keyof LiftData, value: string) => {
    setLiftsData(prev => prev.map(lift => 
      lift.id === liftId ? { ...lift, [field]: value } : lift
    ));
  };

  const handleNext = () => {
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
      <Box style={{ paddingTop: insets.top }} backgroundColor="background" />
      
      <Header
        title="Let's build your season"
        showBackButton={true}
        onBackPress={handleBackPress}
        variant="transparent"
        backgroundColor="background"
      />
      
      <Box paddingHorizontal="l">
        <WizardBar totalSteps={4} currentStep={2} />
      </Box>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <Box paddingHorizontal="l">
          {/* Header Section */}
          <Box paddingVertical="xl">
            <Text variant="h2" color="text" marginBottom="m">
              Your strength goals
            </Text>
            <Text variant="body" color="textMuted">
              Just two numbers per lift - current max and your season goal
            </Text>
          </Box>
          
          {/* Simplified Lift Cards */}
          <Box marginBottom="xl">
            {liftsData.map((lift) => (
              <Box key={lift.id} marginBottom="m">
                <Box
                  backgroundColor="white"
                  borderRadius="l"
                  padding="l"
                  style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.05,
                    shadowRadius: 4,
                    elevation: 2,
                  }}
                >
                  {/* Lift Header */}
                  <Box flexDirection="row" alignItems="center" marginBottom="m">
                    <Text style={{ fontSize: 24 }} marginRight="m">
                      {lift.emoji}
                    </Text>
                    <Text variant="h3" color="text">
                      {lift.name}
                    </Text>
                  </Box>

                  {/* Input Row */}
                  <Box flexDirection="row" alignItems="center" justifyContent="space-between">
                    {/* Current Weight */}
                    <Box flex={1} marginRight="m">
                      <Text variant="caption" color="textMuted" marginBottom="xs">
                        Current max
                      </Text>
                      <Box flexDirection="row" alignItems="center">
                        <Box flex={1} marginRight="xs">
                          <TextInput
                            placeholder="80"
                            value={lift.currentWeight}
                            onChangeText={(value) => updateLiftData(lift.id, 'currentWeight', value)}
                            keyboardType="numeric"
                            style={{ textAlign: 'center' }}
                          />
                        </Box>
                        <Text variant="body" color="textMuted">kg</Text>
                      </Box>
                    </Box>

                    {/* Arrow */}
                    <Box marginHorizontal="s" alignItems="center">
                      <Text variant="h3" color="textMuted">→</Text>
                    </Box>

                    {/* Target Weight */}
                    <Box flex={1} marginLeft="m">
                      <Text variant="caption" color="textMuted" marginBottom="xs">
                        Season goal
                      </Text>
                      <Box flexDirection="row" alignItems="center">
                        <Box flex={1} marginRight="xs">
                          <TextInput
                            placeholder="100"
                            value={lift.targetWeight}
                            onChangeText={(value) => updateLiftData(lift.id, 'targetWeight', value)}
                            keyboardType="numeric"
                            style={{ textAlign: 'center' }}
                          />
                        </Box>
                        <Text variant="body" color="textMuted">kg</Text>
                      </Box>
                    </Box>
                  </Box>

                  {/* Progress Indicator */}
                  {lift.currentWeight && lift.targetWeight && (
                    <Box marginTop="m">
                      <Box
                        backgroundColor="border"
                        borderRadius="s"
                        style={{ height: 4 }}
                      >
                        <Box
                          backgroundColor="primary"
                          borderRadius="s"
                          style={{ 
                            height: 4, 
                            width: `${Math.min((parseFloat(lift.currentWeight) / parseFloat(lift.targetWeight)) * 100, 100)}%` 
                          }}
                        />
                      </Box>
                      <Text variant="caption" color="textMuted" marginTop="xs" textAlign="center">
                        {lift.currentWeight && lift.targetWeight 
                          ? `+${Math.max(0, parseFloat(lift.targetWeight) - parseFloat(lift.currentWeight))}kg to go`
                          : ''
                        }
                      </Text>
                    </Box>
                  )}
                </Box>
              </Box>
            ))}
          </Box>
          
          {/* Help Text */}
          <Box marginBottom="m" alignItems="center">
            <Text variant="caption" color="textMuted" textAlign="center">
              💡 Don't know your max? Try 85% of what you can lift for 3-5 reps
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

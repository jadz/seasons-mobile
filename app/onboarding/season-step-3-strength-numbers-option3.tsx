import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Box, Text, Button, WizardBar, TextInput, Header, SegmentedControl } from '../../components/ui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface LiftData {
  id: string;
  name: string;
  currentWeight: string;
  targetWeight: string;
  hasNumbers: boolean;
}

export default function SeasonStrengthNumbersOption3() {
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
      currentWeight: '',
      targetWeight: '',
      hasNumbers: false,
    }))
  );

  const [experienceLevel, setExperienceLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');

  const updateLiftData = (liftId: string, field: keyof LiftData, value: string | boolean) => {
    setLiftsData(prev => prev.map(lift => 
      lift.id === liftId ? { ...lift, [field]: value } : lift
    ));
  };

  const toggleLiftNumbers = (liftId: string) => {
    setLiftsData(prev => prev.map(lift => 
      lift.id === liftId 
        ? { 
            ...lift, 
            hasNumbers: !lift.hasNumbers,
            currentWeight: !lift.hasNumbers ? lift.currentWeight : '',
            targetWeight: !lift.hasNumbers ? lift.targetWeight : '',
          }
        : lift
    ));
  };

  const handleNext = () => {
    console.log('Lift data:', liftsData);
    console.log('Experience level:', experienceLevel);
    router.push('/onboarding/season-step-4-body-metrics');
  };

  const handleBackPress = () => {
    router.back();
  };

  const liftsWithNumbers = liftsData.filter(lift => lift.hasNumbers);
  const isFormValid = liftsWithNumbers.length === 0 || liftsWithNumbers.every(lift => 
    lift.currentWeight && lift.targetWeight
  );

  const getDefaultWeights = (liftId: string) => {
    const defaults = {
      beginner: { bench: { current: '40', target: '60' }, squat: { current: '60', target: '80' }, deadlift: { current: '80', target: '100' } },
      intermediate: { bench: { current: '80', target: '100' }, squat: { current: '100', target: '120' }, deadlift: { current: '120', target: '140' } },
      advanced: { bench: { current: '120', target: '140' }, squat: { current: '140', target: '160' }, deadlift: { current: '160', target: '180' } },
    };
    return defaults[experienceLevel][liftId as keyof typeof defaults[typeof experienceLevel]] || { current: '80', target: '100' };
  };

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
              Let's set your strength goals
            </Text>
            <Text variant="body" color="textMuted">
              We can start with estimates and refine them later
            </Text>
          </Box>

          {/* Experience Level Selection */}
          <Box marginBottom="xl">
            <Text variant="h3" color="text" marginBottom="m">
              How would you describe your lifting experience?
            </Text>
            <SegmentedControl
              options={[
                { value: 'beginner', label: 'Beginner' },
                { value: 'intermediate', label: 'Intermediate' },
                { value: 'advanced', label: 'Advanced' }
              ]}
              selectedValue={experienceLevel}
              onValueChange={(value) => setExperienceLevel(value as typeof experienceLevel)}
            />
          </Box>
          
          {/* Lift Cards with Progressive Disclosure */}
          <Box marginBottom="xl">
            {liftsData.map((lift) => {
              const defaults = getDefaultWeights(lift.id);
              return (
                <Box key={lift.id} marginBottom="l">
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
                    {/* Lift Header with Toggle */}
                    <Box flexDirection="row" alignItems="center" justifyContent="space-between" marginBottom="m">
                      <Text variant="h3" color="text">
                        {lift.name}
                      </Text>
                      <Button
                        variant={lift.hasNumbers ? "primary" : "ghost"}
                        onPress={() => toggleLiftNumbers(lift.id)}
                      >
                        {lift.hasNumbers ? 'Using my numbers' : 'Add my numbers'}
                      </Button>
                    </Box>

                    {!lift.hasNumbers ? (
                      /* Default/Estimated Values */
                      <Box>
                        <Text variant="body" color="textMuted" marginBottom="s">
                          We'll use typical {experienceLevel} targets:
                        </Text>
                        <Box flexDirection="row" alignItems="center" justifyContent="space-between">
                          <Box alignItems="center">
                            <Text variant="caption" color="textMuted">Current</Text>
                            <Text variant="h3" color="text">{defaults.current}kg</Text>
                          </Box>
                          <Text variant="h3" color="textMuted">→</Text>
                          <Box alignItems="center">
                            <Text variant="caption" color="textMuted">Goal</Text>
                            <Text variant="h3" color="primary">{defaults.target}kg</Text>
                          </Box>
                        </Box>
                      </Box>
                    ) : (
                      /* Custom Input Fields */
                      <Box>
                        <Text variant="body" color="textMuted" marginBottom="m">
                          Enter your specific numbers:
                        </Text>
                        <Box flexDirection="row" alignItems="center" justifyContent="space-between">
                          {/* Current Weight */}
                          <Box flex={1} marginRight="m">
                            <Text variant="caption" color="textMuted" marginBottom="xs">
                              Current max
                            </Text>
                            <Box flexDirection="row" alignItems="center">
                              <Box flex={1} marginRight="xs">
                                <TextInput
                                  placeholder={defaults.current}
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
                                  placeholder={defaults.target}
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
                      </Box>
                    )}
                  </Box>
                </Box>
              );
            })}
          </Box>
          
          {/* Help Text */}
          <Box marginBottom="m" alignItems="center">
            <Text variant="caption" color="textMuted" textAlign="center">
              💡 Don't worry about being exact - you can always adjust these later
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
              Create My Season
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

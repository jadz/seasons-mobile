import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Box, Text, Button, WizardBar, TextInput, Header } from '../../components/ui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface LiftData {
  id: string;
  name: string;
  currentWeight: string;
  targetWeight: string;
}

export default function SeasonStrengthNumbersOption1() {
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
    }))
  );

  const [currentLiftIndex, setCurrentLiftIndex] = useState(0);
  const currentLift = liftsData[currentLiftIndex];

  const updateCurrentLift = (field: keyof LiftData, value: string) => {
    setLiftsData(prev => prev.map((lift, index) => 
      index === currentLiftIndex ? { ...lift, [field]: value } : lift
    ));
  };

  const handleNext = () => {
    if (currentLiftIndex < liftsData.length - 1) {
      setCurrentLiftIndex(currentLiftIndex + 1);
    } else {
      console.log('Lift data:', liftsData);
      router.push('/onboarding/season-step-4-body-metrics');
    }
  };

  const handlePrevious = () => {
    if (currentLiftIndex > 0) {
      setCurrentLiftIndex(currentLiftIndex - 1);
    }
  };

  const handleBackPress = () => {
    router.back();
  };

  const isCurrentLiftValid = currentLift.currentWeight && currentLift.targetWeight;

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
      
      <Box flex={1} paddingHorizontal="l">
        {/* Progress through lifts */}
        <Box paddingVertical="xl">
          <Box flexDirection="row" alignItems="center" marginBottom="s">
            <Text variant="caption" color="textMuted">
              {currentLiftIndex + 1} of {liftsData.length}
            </Text>
          </Box>
          <Text variant="h1" color="text" marginBottom="m">
            {currentLift.name}
          </Text>
          <Text variant="body" color="textMuted">
            Let's set your current max and target for this lift
          </Text>
        </Box>

        {/* Large, focused input cards */}
        <Box flex={1}>
          <Box marginBottom="xl">
            <Box
              backgroundColor="white"
              borderRadius="xl"
              padding="xl"
              marginBottom="l"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <Text variant="h3" color="text" marginBottom="s">
                Current Max
              </Text>
              <Text variant="body" color="textMuted" marginBottom="l">
                What's the heaviest you can lift right now?
              </Text>
              <Box flexDirection="row" alignItems="center">
                <Box flex={1} marginRight="m">
                  <TextInput
                    placeholder="80"
                    value={currentLift.currentWeight}
                    onChangeText={(value) => updateCurrentLift('currentWeight', value)}
                    keyboardType="numeric"
                    style={{ fontSize: 24, textAlign: 'center' }}
                  />
                </Box>
                <Text variant="h3" color="text">kg</Text>
              </Box>
            </Box>

            <Box
              backgroundColor="white"
              borderRadius="xl"
              padding="xl"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <Text variant="h3" color="text" marginBottom="s">
                Season Goal
              </Text>
              <Text variant="body" color="textMuted" marginBottom="l">
                Where do you want to be by the end of your season?
              </Text>
              <Box flexDirection="row" alignItems="center">
                <Box flex={1} marginRight="m">
                  <TextInput
                    placeholder="100"
                    value={currentLift.targetWeight}
                    onChangeText={(value) => updateCurrentLift('targetWeight', value)}
                    keyboardType="numeric"
                    style={{ fontSize: 24, textAlign: 'center' }}
                  />
                </Box>
                <Text variant="h3" color="text">kg</Text>
              </Box>
            </Box>
          </Box>

          {/* Navigation dots */}
          <Box flexDirection="row" justifyContent="center" marginBottom="xl">
            {liftsData.map((_, index) => (
              <Box
                key={index}
                backgroundColor={index === currentLiftIndex ? "primary" : "border"}
                marginHorizontal="xs"
                style={{ width: 8, height: 8, borderRadius: 4 }}
              />
            ))}
          </Box>
        </Box>

        {/* Action buttons */}
        <Box marginBottom="xl">
          <Button 
            variant="primary" 
            fullWidth
            onPress={handleNext}
            disabled={!isCurrentLiftValid}
            style={{ marginBottom: 12 }}
          >
            {currentLiftIndex < liftsData.length - 1 ? 'Next Lift' : 'Create My Season'}
          </Button>
          
          {currentLiftIndex > 0 && (
            <Button 
              variant="ghost" 
              fullWidth
              onPress={handlePrevious}
            >
              Previous Lift
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
}

import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Box, Text, Button, WizardBar, TextInput, UnitInput, Header, SegmentedControl } from '../../components/ui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

interface LiftData {
  id: string;
  name: string;
  currentReps: string;
  currentWeight: string;
  targetReps: string;
  targetWeight: string;
  mode: '1rm' | 'reps';
}

export default function SeasonStrengthNumbersOption1Enhanced() {
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

  const [currentLiftIndex, setCurrentLiftIndex] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const currentLift = liftsData[currentLiftIndex];

  const updateCurrentLift = (field: keyof LiftData, value: string) => {
    setLiftsData(prev => prev.map((lift, index) => 
      index === currentLiftIndex ? { ...lift, [field]: value } : lift
    ));
  };

  const toggleMode = () => {
    const newMode = currentLift.mode === '1rm' ? 'reps' : '1rm';
    setLiftsData(prev => prev.map((lift, index) => 
      index === currentLiftIndex 
        ? { 
            ...lift, 
            mode: newMode,
            currentReps: newMode === '1rm' ? '1' : '5',
            targetReps: newMode === '1rm' ? '1' : '5',
          }
        : lift
    ));
  };

  const handleNext = () => {
    if (currentLiftIndex < liftsData.length - 1) {
      setCurrentLiftIndex(currentLiftIndex + 1);
    } else {
      setShowSummary(true);
    }
  };

  const handlePrevious = () => {
    if (showSummary) {
      setShowSummary(false);
      setCurrentLiftIndex(liftsData.length - 1);
    } else if (currentLiftIndex > 0) {
      setCurrentLiftIndex(currentLiftIndex - 1);
    }
  };

  const handleBackPress = () => {
    if (showSummary || currentLiftIndex > 0) {
      handlePrevious();
    } else {
      router.back();
    }
  };

  const handleComplete = () => {
    console.log('Lift data:', liftsData);
    router.push('/onboarding/season-step-4-body-metrics');
  };

  const editLift = (liftIndex: number) => {
    setShowSummary(false);
    setCurrentLiftIndex(liftIndex);
  };

  const isCurrentLiftValid = currentLift.currentWeight && currentLift.targetWeight;

  if (showSummary) {
    return (
      <Box flex={1} backgroundColor="background">
        <Box style={{ paddingTop: insets.top }} backgroundColor="background" />
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
            {/* Summary Header */}
            <Box paddingVertical="xl">
              <Text variant="h2" color="text" marginBottom="m">
                Your strength goals
              </Text>
              <Text variant="body" color="textMuted">
                Review and edit your targets before creating your season
              </Text>
            </Box>
            
            {/* Summary Cards */}
            <Box marginBottom="xl">
              {liftsData.map((lift, index) => (
                <Box key={lift.id} marginBottom="l">
                  <Box
                    backgroundColor="background"
                    borderRadius="14"
                    padding="l"
                    style={{
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 8,
                      elevation: 4,
                    }}
                  >
                    {/* Lift Header */}
                    <Box flexDirection="row" alignItems="center" justifyContent="space-between" marginBottom="m">
                      <Text variant="h3" color="text">
                        {lift.name}
                      </Text>
                      <Button
                        variant="ghost"
                        onPress={() => editLift(index)}
                      >
                        Edit
                      </Button>
                    </Box>

                    {/* Current vs Target */}
                    <Box flexDirection="row" alignItems="center" justifyContent="space-between" marginBottom="m">
                      <Box alignItems="center">
                        <Text variant="caption" color="textMuted" marginBottom="xs">
                          Current
                        </Text>
                        <Text variant="h3" color="text">
                          {lift.mode === 'reps' && lift.currentReps !== '1' 
                            ? `${lift.currentReps} reps @ ` 
                            : ''
                          }{lift.currentWeight}kg
                        </Text>
                      </Box>
                      
                      <Text variant="h3" color="textMuted">→</Text>
                      
                      <Box alignItems="center">
                        <Text variant="caption" color="textMuted" marginBottom="xs">
                          Goal
                        </Text>
                        <Text variant="h3" color="primary">
                          {lift.mode === 'reps' && lift.targetReps !== '1' 
                            ? `${lift.targetReps} reps @ ` 
                            : ''
                          }{lift.targetWeight}kg
                        </Text>
                      </Box>
                    </Box>

                    {/* Progress Calculation */}
                    {lift.currentWeight && lift.targetWeight && (
                      <Box>
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
                          +{Math.max(0, parseFloat(lift.targetWeight) - parseFloat(lift.currentWeight))}kg improvement goal
                        </Text>
                      </Box>
                    )}
                  </Box>
                </Box>
              ))}
            </Box>

            {/* Action Buttons */}
            <Box marginBottom="xl">
              <Button 
                variant="primary" 
                fullWidth
                onPress={handleComplete}
                style={{ marginBottom: 12 }}
              >
                Create My Season
              </Button>
              
              <Button 
                variant="ghost" 
                fullWidth
                onPress={handlePrevious}
              >
                Back to Edit
              </Button>
            </Box>
          </Box>
        </ScrollView>
      </Box>
    );
  }

  return (
    <Box flex={1} backgroundColor="background">
      <Box style={{ paddingTop: insets.top }} backgroundColor="background" />
      
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
        {/* Clear header with context */}
        <Box paddingVertical="l" alignItems="center">
          <Text variant="caption" color="textMuted" marginBottom="xs">
            {currentLiftIndex + 1} of {liftsData.length}
          </Text>
          <Text variant="h1" color="text" marginBottom="s">
            {currentLift.name}
          </Text>
          <Text variant="body" color="textMuted" textAlign="center">
            Set your current ability and season goal
          </Text>
        </Box>

        {/* Simple mode toggle */}
        <Box marginBottom="l" alignItems="center">
          <SegmentedControl
            borderRadius="xl"
            options={[
              { value: '1rm', label: 'Max' },
              { value: 'reps', label: 'Reps' }
            ]}
            selectedValue={currentLift.mode}
            onValueChange={(value) => {
              if (value !== currentLift.mode) {
                toggleMode();
              }
            }}
          />
        </Box>

        {/* Clean input interface matching screenshot style */}
        <Box flex={1} justifyContent="center" paddingHorizontal="l">
          <Box marginBottom="xl">
            {/* Current row */}
            <Box marginBottom="xl">
              <Box flexDirection="row" alignItems="center" marginBottom="s">
                <Text variant="body" color="textMuted" style={{ fontSize: 16, minWidth: 50 }}>
                  {currentLift.mode === '1rm' ? '1RM' : ''}
                </Text>
                {currentLift.mode === 'reps' && (
                  <Box 
                    backgroundColor="white" 
                    borderRadius="s" 
                    marginHorizontal="s"
                    style={{
                      borderWidth: 1,
                      borderColor: '#D1D1D6',
                      paddingHorizontal: 20,
                      paddingVertical: 16,
                      minWidth: 70,
                    }}
                  >
                    <TextInput
                      placeholder="5"
                      value={currentLift.currentReps}
                      onChangeText={(value) => updateCurrentLift('currentReps', value)}
                      keyboardType="numeric"
                      style={{ 
                        fontSize: 18, 
                        textAlign: 'center', 
                        fontWeight: '600',
                        color: '#000000'
                      }}
                    />
                  </Box>
                )}
                <Text variant="body" color="textMuted" style={{ fontSize: 18, marginHorizontal: 12 }}>
                  ×
                </Text>
                <UnitInput
                  value={currentLift.currentWeight}
                  onChangeText={(value) => updateCurrentLift('currentWeight', value)}
                  placeholder={currentLift.mode === '1rm' ? '80' : '60'}
                  unit="kg"
                  style={{ flex: 1, marginRight: 16 }}
                />
                <Text variant="body" color="textMuted" style={{ fontSize: 16, minWidth: 60 }}>
                  Current
                </Text>
              </Box>
            </Box>

            {/* Target row */}
            <Box>
              <Box flexDirection="row" alignItems="center" marginBottom="s">
                <Text variant="body" color="textMuted" style={{ fontSize: 16, minWidth: 50 }}>
                  {currentLift.mode === '1rm' ? '1RM' : ''}
                </Text>
                {currentLift.mode === 'reps' && (
                  <Box 
                    backgroundColor="background" 
                    borderRadius="s" 
                    marginHorizontal="s"
                    style={{
                      borderWidth: 1,
                      borderColor: '#D1D1D6',
                      paddingHorizontal: 20,
                      paddingVertical: 16,
                      minWidth: 70,
                    }}
                  >
                    <TextInput
                      placeholder="8"
                      value={currentLift.targetReps}
                      onChangeText={(value) => updateCurrentLift('targetReps', value)}
                      keyboardType="numeric"
                      style={{ 
                        fontSize: 18, 
                        textAlign: 'center', 
                        fontWeight: '600',
                        color: '#000000'
                      }}
                    />
                  </Box>
                )}
                <Text variant="body" color="textMuted" style={{ fontSize: 18, marginHorizontal: 12 }}>
                  ×
                </Text>
                <UnitInput
                  value={currentLift.targetWeight}
                  onChangeText={(value) => updateCurrentLift('targetWeight', value)}
                  placeholder={currentLift.mode === '1rm' ? '100' : '75'}
                  unit="kg"
                  style={{ flex: 1, marginRight: 16 }}
                />
                <Text variant="body" color="textMuted" style={{ fontSize: 16, minWidth: 60 }}>
                  Target
                </Text>
              </Box>
            </Box>
          </Box>

          {/* Help text */}
          <Box marginBottom="xl" alignItems="center">
            <Text variant="caption" color="textMuted" textAlign="center" style={{ fontSize: 14 }}>
              Don't know exact numbers? Use your best estimate
            </Text>
          </Box>

          {/* Navigation dots */}
          <Box flexDirection="row" justifyContent="center" marginBottom="l">
            {liftsData.map((_, index) => (
              <Box
                key={index}
                backgroundColor={index === currentLiftIndex ? "primary" : "border"}
                marginHorizontal="s"
                style={{ width: 10, height: 10, borderRadius: 5 }}
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
            {currentLiftIndex < liftsData.length - 1 ? 'Next Lift' : 'Review Goals'}
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

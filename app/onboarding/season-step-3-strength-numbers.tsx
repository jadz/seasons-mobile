import React, { useState, useRef } from 'react';
import { View, ScrollView, TouchableWithoutFeedback, Keyboard, InputAccessoryView, Platform } from 'react-native';
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
  // const selectedLifts = ['bench', 'squat', 'deadlift'];
  const selectedLifts = ['bench'];
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
  const [activeInputField, setActiveInputField] = useState<string | null>(null);
  const currentLift = liftsData[currentLiftIndex];
  
  // Refs for input fields
  const currentRepsRef = useRef<any>(null);
  const currentWeightRef = useRef<any>(null);
  const targetRepsRef = useRef<any>(null);
  const targetWeightRef = useRef<any>(null);
  
  // Handle tap outside to dismiss keyboard
  const handleTapOutside = () => {
    Keyboard.dismiss();
    setActiveInputField(null);
  };

  const updateCurrentLift = (field: keyof LiftData, value: string) => {
    setLiftsData(prev => prev.map((lift, index) => 
      index === currentLiftIndex ? { ...lift, [field]: value } : lift
    ));
  };

  // Stable keyboard toolbar components to prevent re-rendering flashes
  const keyboardToolbarCurrent = React.useMemo(() => (
    <InputAccessoryView nativeID="keyboardToolbar">
      <Box 
        flexDirection="row" 
        justifyContent="space-between" 
        alignItems="center" 
        paddingHorizontal="l" 
        paddingVertical="m"
        backgroundColor="bg/surface"
        style={{ borderTopWidth: 1, borderTopColor: '#E5E7EB' }}
      >
        <Button
          variant="ghost"
          onPress={() => {
            if (activeInputField) {
              updateCurrentLift(activeInputField as keyof LiftData, '');
            }
          }}
        >
          Clear
        </Button>
        <Button
          variant="ghost"
          onPress={() => {
            Keyboard.dismiss();
            setActiveInputField(null);
          }}
        >
          Done
        </Button>
      </Box>
    </InputAccessoryView>
  ), [activeInputField]);

  const keyboardToolbarTarget = React.useMemo(() => (
    <InputAccessoryView nativeID="keyboardToolbarTarget">
      <Box 
        flexDirection="row" 
        justifyContent="space-between" 
        alignItems="center" 
        paddingHorizontal="l" 
        paddingVertical="m"
        backgroundColor="bg/surface"
        style={{ borderTopWidth: 1, borderTopColor: '#E5E7EB' }}
      >
        <Button
          variant="ghost"
          onPress={() => {
            if (activeInputField) {
              updateCurrentLift(activeInputField as keyof LiftData, '');
            }
          }}
        >
          Clear
        </Button>
        <Button
          variant="ghost"
          onPress={() => {
            Keyboard.dismiss();
            setActiveInputField(null);
          }}
        >
          Done
        </Button>
      </Box>
    </InputAccessoryView>
  ), [activeInputField]);

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
      <View style={{ flex: 1 }}>
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
        
        <Header
          title="Let's build your season"
          showBackButton={true}
          onBackPress={handleBackPress}
          variant="transparent"
          backgroundColor="bg/page"
        />
        
        <Box paddingHorizontal="l">
          <WizardBar totalSteps={4} currentStep={2} />
        </Box>
        
        <ScrollView showsVerticalScrollIndicator={false}>
          <Box paddingHorizontal="l">
            {/* Simple Header */}
            <Box paddingVertical="l">
              <Text variant="h2" color="text/primary" marginBottom="s">
                Review your strength targets
              </Text>
            </Box>
            
            {/* Progress Row Layout - Inspired by Recovery Impact Analysis */}
            <Box marginBottom="xl">
              {liftsData.map((lift, index) => {
                const currentWeight = parseFloat(lift.currentWeight) || 0;
                const targetWeight = parseFloat(lift.targetWeight) || 0;
                const hasValidGoal = currentWeight > 0 && targetWeight > 0;
                
                // Calculate relative improvement percentage
                const relativeImprovement = hasValidGoal && currentWeight > 0 
                  ? Math.round(((targetWeight - currentWeight) / currentWeight) * 100)
                  : 0;
                
                // Calculate current progress toward goal (for circle position)
                const currentProgress = hasValidGoal && targetWeight > 0
                  ? Math.min((currentWeight / targetWeight) * 100, 100)
                  : 0;
                
                const isComplete = hasValidGoal && currentWeight >= targetWeight;
                const improvementColor = relativeImprovement > 0 ? "state/success" : relativeImprovement < 0 ? "state/error" : "text/secondary";
                
                return (
                  <Box key={lift.id} marginBottom="l">
                    <Box 
                      backgroundColor="bg/surface"
                      borderRadius={8}
                      paddingHorizontal="l"
                      paddingVertical="s"
                    >
                      {hasValidGoal ? (
                        <>
                          {/* Clean Header Row */}
                          <Box flexDirection="row" alignItems="center" justifyContent="space-between" marginBottom="s">
                            <Text variant="h2" color="text/primary" style={{ fontSize: 22, fontWeight: '700', letterSpacing: -0.5 }}>
                              {lift.name}
                            </Text>
                            <Button
                              variant="ghost"
                              onPress={() => editLift(index)}
                              style={{ paddingHorizontal: 12, paddingVertical: 8 }}
                            >
                              <Text color="brand/primary" style={{ fontSize: 14, fontWeight: '600' }}>
                                Edit
                              </Text>
                            </Button>
                          </Box>

                          {/* Current → Target Display */}
                          <Box flexDirection="row" alignItems="center" justifyContent="space-between">
                            <Box alignItems="center" flex={1}>
                              <Text variant="caption" color="text/secondary" style={{ fontSize: 10, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>
                                CURRENT
                              </Text>
                              <Text variant="h1" color="text/primary" style={{ fontSize: 26, fontWeight: '700', lineHeight: 30 }}>
                                {lift.mode === 'reps' && lift.currentReps !== '1' 
                                  ? `${lift.currentReps}×${lift.currentWeight}` 
                                  : lift.currentWeight
                                }
                              </Text>
                              <Text variant="caption" color="text/secondary" style={{ fontSize: 11, fontWeight: '500', marginTop: 1 }}>
                                kg
                              </Text>
                            </Box>
                            
                            <Box alignItems="center" paddingHorizontal="l">
                              <Text variant="h2" color="text/secondary" style={{ fontSize: 20, fontWeight: '300' }}>
                                →
                              </Text>
                              <Text variant="caption" color={improvementColor} style={{ fontSize: 12, fontWeight: '700', marginTop: 4 }}>
                                {relativeImprovement > 0 ? '+' : ''}{relativeImprovement}%
                              </Text>
                            </Box>
                            
                            <Box alignItems="center" flex={1}>
                              <Text variant="caption" color="text/secondary" style={{ fontSize: 10, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>
                                TARGET
                              </Text>
                              <Text variant="h1" color={isComplete ? "state/success" : "brand/primary"} style={{ fontSize: 26, fontWeight: '700', lineHeight: 30 }}>
                                {lift.mode === 'reps' && lift.targetReps !== '1' 
                                  ? `${lift.targetReps}×${lift.targetWeight}` 
                                  : lift.targetWeight
                                }
                              </Text>
                              <Text variant="caption" color="text/secondary" style={{ fontSize: 11, fontWeight: '500', marginTop: 1 }}>
                                kg
                              </Text>
                            </Box>
                          </Box>
                        </>
                      ) : (
                        /* Empty State */
                        <Box flexDirection="row" alignItems="center" justifyContent="space-between">
                          <Text variant="body" color="text/primary" style={{ fontSize: 16, fontWeight: '600' }}>
                            {lift.name}
                          </Text>
                          <Button
                            variant="ghost"
                            onPress={() => editLift(index)}
                            style={{ paddingHorizontal: 12, paddingVertical: 6 }}
                          >
                            <Text color="brand/primary" style={{ fontSize: 14 }}>
                              Set Goal
                            </Text>
                          </Button>
                        </Box>
                      )}
                    </Box>
                  </Box>
                );
              })}
            </Box>

            {/* Action Buttons */}
            <Box marginBottom="xl">
              <Button 
                variant="primary" 
                fullWidth
                onPress={handleComplete}
                style={{ marginBottom: 12 }}
              >
                Continue Season Setup
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
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={handleTapOutside}>
        <Box flex={1} backgroundColor="bg/page">
        <Box style={{ paddingTop: insets.top }} backgroundColor="bg/page" />
      
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
        backgroundColor="bg/page"
      />
      
      <Box paddingHorizontal="l">
        <WizardBar totalSteps={4} currentStep={2} />
      </Box>
      
      <Box flex={1} paddingHorizontal="l">
        {/* Clear header with context */}
        <Box paddingVertical="m">
          <Text variant="caption" color="text/secondary" marginBottom="xs">
            {currentLiftIndex + 1} of {liftsData.length}
          </Text>
          <Text variant="h1" color="text/primary" marginBottom="s">
            {currentLift.name}
          </Text>
          <Text variant="body" color="text/secondary">
            Set your current ability and season goal
          </Text>
        </Box>

        {/* Simple mode toggle */}
        <Box marginBottom="m" alignSelf="flex-start">
          <SegmentedControl
            options={[
              { value: '1rm', label: '1RM' },
              { value: 'reps', label: 'REPS' }
            ]}
            selectedValue={currentLift.mode}
            onValueChange={(value) => {
              if (value !== currentLift.mode) {
                toggleMode();
              }
            }}
            fullWidth={false}
          />
        </Box>

        {/* Clean input interface with left alignment */}
        <Box paddingVertical="l">
          <Box width="100%">
            {/* Current section */}
            <Box marginBottom="l">
              <Text variant="label" color="text/secondary" marginBottom="s" style={{ fontSize: 13, fontWeight: '500' }}>
                Current
              </Text>
              <Box flexDirection="row" alignItems="center">
                {currentLift.mode === 'reps' && (
                  <>
                    <UnitInput
                      value={currentLift.currentReps}
                      onChangeText={(value) => updateCurrentLift('currentReps', value)}
                      unit="reps"
                      width={100}
                      style={{ marginRight: 12 }}
                      inputAccessoryViewID="keyboardToolbar"
                      onFocus={() => setActiveInputField('currentReps')}
                      onBlur={() => setActiveInputField(null)}
                    />
                    <Text variant="body" color="text/secondary" style={{ fontSize: 20, marginRight: 12 }}>
                      ×
                    </Text>
                  </>
                )}
                {currentLift.mode === '1rm' && (
                  <>
                    <Text variant="body" color="text/secondary" style={{ fontSize: 16, marginRight: 12 }}>
                      1RM ×
                    </Text>
                  </>
                )}
                <UnitInput
                  value={currentLift.currentWeight}
                  onChangeText={(value) => updateCurrentLift('currentWeight', value)}
                  unit="kg"
                  width={120}
                  inputAccessoryViewID="keyboardToolbar"
                  onFocus={() => setActiveInputField('currentWeight')}
                  onBlur={() => setActiveInputField(null)}
                />
              </Box>
            </Box>

            {/* Target section */}
            <Box marginBottom="l">
              <Text variant="label" color="text/secondary" marginBottom="s" style={{ fontSize: 13, fontWeight: '500' }}>
                Target
              </Text>
              <Box flexDirection="row" alignItems="center">
                {currentLift.mode === 'reps' && (
                  <>
                    <UnitInput
                      value={currentLift.targetReps}
                      onChangeText={(value) => updateCurrentLift('targetReps', value)}
                      unit="reps"
                      width={100}
                      style={{ marginRight: 12 }}
                      inputAccessoryViewID="keyboardToolbarTarget"
                      onFocus={() => setActiveInputField('targetReps')}
                      onBlur={() => setActiveInputField(null)}
                    />
                    <Text variant="body" color="text/secondary" style={{ fontSize: 20, marginRight: 12 }}>
                      ×
                    </Text>
                  </>
                )}
                {currentLift.mode === '1rm' && (
                  <>
                    <Text variant="body" color="text/secondary" style={{ fontSize: 16, marginRight: 12 }}>
                      1RM ×
                    </Text>
                  </>
                )}
                <UnitInput
                  value={currentLift.targetWeight}
                  onChangeText={(value) => updateCurrentLift('targetWeight', value)}
                  unit="kg"
                  width={120}
                  inputAccessoryViewID="keyboardToolbarTarget"
                  onFocus={() => setActiveInputField('targetWeight')}
                  onBlur={() => setActiveInputField(null)}
                />
              </Box>
            </Box>
          </Box>

          {/* Help text */}
          <Box marginBottom="xl">
            <Text variant="caption" color="text/secondary" style={{ fontSize: 14 }}>
              Don't know exact numbers? Use your best estimate
            </Text>
          </Box>

          {/* Navigation dots */}
          <Box flexDirection="row" justifyContent="center" marginBottom="l">
            {liftsData.map((_, index) => (
              <Box
                key={index}
                backgroundColor={index === currentLiftIndex ? "brand/primary" : "bg/raised"}
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
            {currentLiftIndex < liftsData.length - 1 ? 'Next Lift' : 'Review Your Lifts'}
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
      </TouchableWithoutFeedback>
      
      {/* Keyboard Toolbars */}
      {Platform.OS === 'ios' && (
        <>
          {keyboardToolbarCurrent}
          {keyboardToolbarTarget}
        </>
      )}
    </View>
  );
}

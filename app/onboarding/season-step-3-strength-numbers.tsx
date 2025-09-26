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
  const selectedLifts = ['bench']
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
        
        <ScrollView showsVerticalScrollIndicator={false}>
          <Box paddingHorizontal="l">
            {/* Enhanced Summary Header */}
            <Box paddingVertical="xl">
              <Text variant="h2" color="text/primary" marginBottom="s" style={{ fontSize: 24, fontWeight: '700' }}>
                Your strength goals
              </Text>
              <Text variant="body" color="text/secondary" style={{ fontSize: 16, lineHeight: 22 }}>
                Review your targets and make any final adjustments before we create your personalized training season
              </Text>
            </Box>
            
            {/* Enhanced Summary Cards */}
            <Box marginBottom="xl">
              {liftsData.map((lift, index) => {
                const currentWeight = parseFloat(lift.currentWeight) || 0;
                const targetWeight = parseFloat(lift.targetWeight) || 0;
                const improvement = Math.max(0, targetWeight - currentWeight);
                const hasValidGoal = currentWeight > 0 && targetWeight > 0 && targetWeight !== currentWeight;
                
                return (
                  <Box key={lift.id} marginBottom="l">
                    <Box
                      backgroundColor="bg/surface"
                      borderRadius="16"
                      padding="l"
                      style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.05,
                        shadowRadius: 4,
                        elevation: 2,
                        borderWidth: 1,
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      {/* Lift Header with Edit */}
                      <Box flexDirection="row" alignItems="center" justifyContent="space-between" marginBottom="l">
                        <Text variant="h3" color="text/primary" style={{ fontSize: 18, fontWeight: '600' }}>
                          {lift.name}
                        </Text>
                        <Button
                          variant="ghost"
                          onPress={() => editLift(index)}
                        >
                          <Text color="brand/primary" style={{ fontSize: 14, fontWeight: '500' }}>
                            Edit
                          </Text>
                        </Button>
                      </Box>

                      {hasValidGoal ? (
                        <>
                          {/* Progress Overview */}
                          <Box marginBottom="m">
                            <Box flexDirection="row" alignItems="baseline" marginBottom="xs">
                              <Text variant="body" color="text/secondary" style={{ fontSize: 14 }}>
                                Current: 
                              </Text>
                              <Text variant="h3" color="text/primary" style={{ fontSize: 16, fontWeight: '600', marginLeft: 4 }}>
                                {lift.mode === 'reps' && lift.currentReps !== '1' 
                                  ? `${lift.currentReps} reps @ ` 
                                  : ''
                                }{lift.currentWeight}kg
                              </Text>
                            </Box>
                            <Box flexDirection="row" alignItems="baseline">
                              <Text variant="body" color="text/secondary" style={{ fontSize: 14 }}>
                                Goal: 
                              </Text>
                              <Text variant="h3" color="brand/primary" style={{ fontSize: 16, fontWeight: '600', marginLeft: 4 }}>
                                {lift.mode === 'reps' && lift.targetReps !== '1' 
                                  ? `${lift.targetReps} reps @ ` 
                                  : ''
                                }{lift.targetWeight}kg
                              </Text>
                            </Box>
                          </Box>

                          {/* Improvement Highlight */}
                          {improvement > 0 && (
                            <Box 
                              backgroundColor="state/success" 
                              borderRadius={8} 
                              padding="m" 
                              marginBottom="m"
                            >
                              <Box flexDirection="row" alignItems="center">
                                <Text style={{ fontSize: 16, marginRight: 6 }}>🎯</Text>
                                <Text variant="body" color="text/primary" style={{ fontSize: 14, fontWeight: '500' }}>
                                  +{improvement}kg improvement goal
                                </Text>
                              </Box>
                            </Box>
                          )}

                          {/* Visual Progress Bar */}
                          <Box>
                            <Box flexDirection="row" justifyContent="space-between" marginBottom="xs">
                              <Text variant="caption" color="text/secondary" style={{ fontSize: 12 }}>
                                Progress
                              </Text>
                              <Text variant="caption" color="brand/primary" style={{ fontSize: 12, fontWeight: '500' }}>
                                {Math.round((currentWeight / targetWeight) * 100)}%
                              </Text>
                            </Box>
                            <Box
                              backgroundColor="bg/raised"
                              borderRadius={4}
                              style={{ height: 6 }}
                            >
                              <Box
                                backgroundColor="brand/primary"
                                borderRadius={4}
                                style={{ 
                                  height: 6, 
                                  width: `${Math.min((currentWeight / targetWeight) * 100, 100)}%`,
                                  minWidth: currentWeight > 0 ? 8 : 0,
                                }}
                              />
                            </Box>
                          </Box>
                        </>
                      ) : (
                        /* No Goal Set State */
                        <Box alignItems="center" paddingVertical="l">
                          <Text style={{ fontSize: 24, marginBottom: 8 }}>⚠️</Text>
                          <Text variant="body" color="text/secondary" textAlign="center" marginBottom="xs">
                            No goal set yet
                          </Text>
                          <Text variant="caption" color="text/secondary" textAlign="center">
                            Tap Edit to set your strength targets
                          </Text>
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

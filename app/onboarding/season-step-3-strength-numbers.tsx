import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, ScrollView, TouchableWithoutFeedback, Keyboard, InputAccessoryView, Platform, useWindowDimensions } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { router } from 'expo-router';
import { Box, Text, Button, WizardBar, TextInput, UnitInput, Header, SegmentedControl } from '../../components/ui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../../components/ui/foundation';
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
  const selectedLifts = ['bench', 'squat', 'deadlift'];
  const insets = useSafeAreaInsets();
  const layout = useWindowDimensions();
  const { theme } = useAppTheme();
  
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
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const currentLift = liftsData[currentLiftIndex];
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Tab state for TabView
  const [index, setIndex] = useState(0);
  const [routes] = useState(
    selectedLifts.map(liftId => ({
      key: liftId,
      title: liftNames[liftId as keyof typeof liftNames].split(' ')[0] // Just first word for tabs
    }))
  );
  
  // Refs for input fields
  const currentRepsRef = useRef<any>(null);
  const currentWeightRef = useRef<any>(null);
  const targetRepsRef = useRef<any>(null);
  const targetWeightRef = useRef<any>(null);
  
  // Handle keyboard events
  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (event) => {
        setKeyboardHeight(event.endCoordinates.height);
      }
    );
    
    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  // Handle tap outside to dismiss keyboard
  const handleTapOutside = () => {
    Keyboard.dismiss();
    setActiveInputField(null);
  };

  const updateCurrentLift = useCallback((field: keyof LiftData, value: string) => {
    setLiftsData(prev => prev.map((lift, index) => 
      index === currentLiftIndex ? { ...lift, [field]: value } : lift
    ));
  }, [currentLiftIndex]);


  const toggleMode = useCallback(() => {
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
  }, [currentLift.mode, currentLiftIndex]);

  const handleNext = useCallback(() => {
    setShowSummary(true);
  }, []);

  const handlePrevious = useCallback(() => {
    if (showSummary) {
      setShowSummary(false);
      setCurrentLiftIndex(liftsData.length - 1);
    } else if (currentLiftIndex > 0) {
      setCurrentLiftIndex(currentLiftIndex - 1);
    }
  }, [showSummary, currentLiftIndex, liftsData.length]);

  const handleBackPress = useCallback(() => {
    if (showSummary || currentLiftIndex > 0) {
      handlePrevious();
    } else {
      router.back();
    }
  }, [showSummary, currentLiftIndex, handlePrevious]);

  const handleComplete = useCallback(() => {
    console.log('Lift data:', liftsData);
    router.push('/onboarding/season-step-4-body-metrics');
  }, [liftsData]);

  const editLift = useCallback((liftIndex: number) => {
    setShowSummary(false);
    setCurrentLiftIndex(liftIndex);
  }, []);

  const isCurrentLiftValid = currentLift.currentWeight && currentLift.targetWeight;
  const areAllLiftsValid = liftsData.every(lift => lift.currentWeight && lift.targetWeight);

  // Render individual lift form for TabView
  const renderLiftForm = useCallback((liftData: LiftData, liftIndex: number) => {
    const paddingBottom = keyboardHeight > 0 
      ? keyboardHeight + 20 // Just a little extra breathing room
      : 150;

    return (
      <ScrollView 
        ref={scrollViewRef}
        style={{ flex: 1 }} 
        contentContainerStyle={{ 
          padding: 24, 
          paddingBottom: paddingBottom
        }} 
        showsVerticalScrollIndicator={false}
        bounces={true}
        scrollEventThrottle={16}
        keyboardShouldPersistTaps="handled"
        removeClippedSubviews={false}
      >
        {/* Clear header with context */}
        <Box paddingVertical="m">
          <Text variant="h3" color="text/primary" marginBottom="s">
            {liftData.name}
          </Text>
          <Text variant="body" color="text/secondary">
            Set where you are now and the outcome you want
          </Text>
        </Box>

        {/* Simple mode toggle */}
        <Box marginBottom="m" alignSelf="flex-start">
          <SegmentedControl
            options={[
              { value: '1rm', label: '1RM' },
              { value: 'reps', label: 'REPS' }
            ]}
            selectedValue={liftData.mode}
            onValueChange={(value) => {
              if (value !== liftData.mode && liftIndex === currentLiftIndex) {
                toggleMode();
              }
            }}
            fullWidth={false}
          />
        </Box>

        {/* Clean input interface */}
        <Box paddingVertical="l">
          <Box width="100%">
            {/* Current section */}
            <Box marginBottom="l">
              <Text variant="label" color="text/secondary" marginBottom="s">
                Current
              </Text>
              <Box flexDirection="row" alignItems="center">
                {liftData.mode === 'reps' && (
                  <>
                    <UnitInput
                      value={liftData.currentReps}
                      onChangeText={(value) => {
                        if (liftIndex === currentLiftIndex) {
                          updateCurrentLift('currentReps', value);
                        }
                      }}
                      unit="reps"
                      width={100}
                      style={{ marginRight: 12 }}
                      onFocus={() => setActiveInputField('currentReps')}
                      onBlur={() => setActiveInputField(null)}
                    />
                    <Text variant="body" color="text/secondary" style={{ fontSize: 20, marginRight: 12 }}>
                      ×
                    </Text>
                  </>
                )}
                {liftData.mode === '1rm' && (
                  <>
                    <Text variant="body" color="text/secondary" style={{ fontSize: 16, marginRight: 12 }}>
                      1RM ×
                    </Text>
                  </>
                )}
                <UnitInput
                  value={liftData.currentWeight}
                  onChangeText={(value) => {
                    if (liftIndex === currentLiftIndex) {
                      updateCurrentLift('currentWeight', value);
                    }
                  }}
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
              <Text variant="label" color="text/secondary" marginBottom="s">
                Target (the outcome I want)
              </Text>
              <Box flexDirection="row" alignItems="center">
                {liftData.mode === 'reps' && (
                  <>
                    <UnitInput
                      value={liftData.targetReps}
                      onChangeText={(value) => {
                        if (liftIndex === currentLiftIndex) {
                          updateCurrentLift('targetReps', value);
                        }
                      }}
                      unit="reps"
                      width={100}
                      style={{ marginRight: 12 }}
                      onFocus={() => setActiveInputField('targetReps')}
                      onBlur={() => setActiveInputField(null)}
                    />
                    <Text variant="body" color="text/secondary" style={{ fontSize: 20, marginRight: 12 }}>
                      ×
                    </Text>
                  </>
                )}
                {liftData.mode === '1rm' && (
                  <>
                    <Text variant="body" color="text/secondary" style={{ fontSize: 16, marginRight: 12 }}>
                      1RM ×
                    </Text>
                  </>
                )}
                <UnitInput
                  value={liftData.targetWeight}
                  onChangeText={(value) => {
                    if (liftIndex === currentLiftIndex) {
                      updateCurrentLift('targetWeight', value);
                    }
                  }}
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
            <Text variant="caption" color="text/secondary">
              Don't know exact numbers? Use your best estimate
            </Text>
          </Box>
        </Box>

        {/* Action Button */}
        <Box>
          <Button 
            variant="primary" 
            fullWidth
            onPress={handleNext}
            disabled={!areAllLiftsValid}
          >
            Review My Focus
          </Button>
        </Box>
      </ScrollView>
    );
  }, [currentLiftIndex, updateCurrentLift, toggleMode, activeInputField, areAllLiftsValid, handleNext, keyboardHeight]);

  const renderScene = useCallback(({ route }: { route: { key: string } }) => {
    const liftIndex = selectedLifts.indexOf(route.key);
    const liftData = liftsData[liftIndex];
    
    if (!liftData) return null;

    return renderLiftForm(liftData, liftIndex);
  }, [selectedLifts, liftsData, renderLiftForm]);

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
        />
        
        <Box paddingHorizontal="l">
          <WizardBar totalSteps={4} currentStep={2} />
        </Box>
        
        <ScrollView showsVerticalScrollIndicator={false}>
          <Box paddingHorizontal="l">
            {/* Simple Header */}
            <Box paddingVertical="l">
              <Text variant="h1" color="text/primary" marginBottom="s">
                Review your strength focus
              </Text>
            </Box>
            
            {/* Progress Row Layout - Inspired by Recovery Impact Analysis */}
            <Box marginBottom="xl">
              {liftsData.map((lift, index) => {
                const currentWeight = parseFloat(lift.currentWeight) || 0;
                const targetWeight = parseFloat(lift.targetWeight) || 0;
                const hasValidTarget = currentWeight > 0 && targetWeight > 0;
                
                // Calculate relative improvement percentage
                const relativeImprovement = hasValidTarget && currentWeight > 0 
                  ? Math.round(((targetWeight - currentWeight) / currentWeight) * 100)
                  : 0;
                
                // Calculate current progress toward target (for circle position)
                const currentProgress = hasValidTarget && targetWeight > 0
                  ? Math.min((currentWeight / targetWeight) * 100, 100)
                  : 0;
                
                const isComplete = hasValidTarget && currentWeight >= targetWeight;
                const improvementColor = relativeImprovement > 0 ? "state/success" : relativeImprovement < 0 ? "state/error" : "text/secondary";
                
                return (
                  <Box key={lift.id} marginBottom="l">
                    <Box 
                      backgroundColor="bg/surface"
                      borderRadius="md"
                      paddingHorizontal="l"
                      paddingVertical="s"
                    >
                      {hasValidTarget ? (
                        <>
                          {/* Clean Header Row */}
                          <Box flexDirection="row" alignItems="center" justifyContent="space-between" marginBottom="s">
                            <Text variant="h3" color="text/primary">
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
                              <Text variant="caption" color="text/secondary" style={{ textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>
                                CURRENT
                              </Text>
                              <Text variant="h2" color="text/primary">
                                {lift.mode === 'reps' && lift.currentReps !== '1' 
                                  ? `${lift.currentReps}×${lift.currentWeight}` 
                                  : lift.currentWeight
                                }
                              </Text>
                              <Text variant="caption" color="text/secondary">
                                kg
                              </Text>
                            </Box>
                            
                            <Box alignItems="center" paddingHorizontal="l">
                              <Text variant="h3" color="text/secondary">
                                →
                              </Text>
                              <Text variant="caption" color={improvementColor} style={{ fontWeight: '600', marginTop: 4 }}>
                                {relativeImprovement > 0 ? '+' : ''}{relativeImprovement}%
                              </Text>
                            </Box>
                            
                            <Box alignItems="center" flex={1}>
                              <Text variant="caption" color="text/secondary" style={{ textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>
                                TARGET
                              </Text>
                              <Text variant="h2" color={isComplete ? "state/success" : "brand/primary"}>
                                {lift.mode === 'reps' && lift.targetReps !== '1' 
                                  ? `${lift.targetReps}×${lift.targetWeight}` 
                                  : lift.targetWeight
                                }
                              </Text>
                              <Text variant="caption" color="text/secondary">
                                kg
                              </Text>
                            </Box>
                          </Box>
                        </>
                      ) : (
                        /* Empty State */
                        <Box flexDirection="row" alignItems="center" justifyContent="space-between">
                          <Text variant="h3" color="text/primary">
                            {lift.name}
                          </Text>
                          <Button
                            variant="ghost"
                            onPress={() => editLift(index)}
                            style={{ paddingHorizontal: 12, paddingVertical: 6 }}
                          >
                            <Text variant="caption" color="brand/primary">
                              Set Focus
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
                Continue with my focus
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

  // Update currentLiftIndex when tab changes
  const handleTabChange = useCallback((newIndex: number) => {
    setIndex(newIndex);
    setCurrentLiftIndex(newIndex);
  }, []);

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
        />
        
        <Box paddingHorizontal="l">
          <WizardBar totalSteps={4} currentStep={2} />
        </Box>
        
        {/* Header Section */}
        <Box paddingHorizontal="l" paddingVertical="xl">
          <Text variant="h1" color="text/primary" marginBottom="m">
            Set your strength focus
          </Text>
          <Text variant="body" color="text/secondary">
            Set where you are now and the outcome you want for each lift
          </Text>
        </Box>
        
        {/* TabView */}
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={handleTabChange}
          initialLayout={{ width: layout.width }}
          renderTabBar={(props) => (
            <TabBar
              {...props}
              indicatorStyle={{ 
                backgroundColor: theme.colors['brand/primary'],
                height: 3,
              }}
              style={{ 
                backgroundColor: theme.colors['bg/page'],
                elevation: 0,
                shadowOpacity: 0,
                borderBottomWidth: 1,
                borderBottomColor: theme.colors['border/subtle'],
              }}
              activeColor={theme.colors['brand/primary']}
              inactiveColor={theme.colors['text/secondary']}
            />
          )}
        />
      </Box>
      
    </View>
  );
}

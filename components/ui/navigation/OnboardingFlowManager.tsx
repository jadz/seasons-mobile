import React, { useState, useCallback } from 'react';
import { Dimensions } from 'react-native';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Box } from '../primitives';
import { ScreenTransition } from './ScreenTransition';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface OnboardingStep {
  id: string;
  component: React.ComponentType<any>;
  route: string;
}

interface OnboardingFlowManagerProps {
  steps: OnboardingStep[];
  currentStepId: string;
  onStepChange?: (stepId: string, direction: 'forward' | 'backward') => void;
}

export const OnboardingFlowManager: React.FC<OnboardingFlowManagerProps> = ({
  steps,
  currentStepId,
  onStepChange,
}) => {
  const [activeStepId, setActiveStepId] = useState(currentStepId);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const currentStepIndex = steps.findIndex(step => step.id === activeStepId);
  const currentStep = steps[currentStepIndex];

  const navigateToStep = useCallback((stepId: string, navDirection: 'forward' | 'backward') => {
    if (isTransitioning || stepId === activeStepId) return;

    setIsTransitioning(true);
    setDirection(navDirection);
    
    // Start transition
    setTimeout(() => {
      setActiveStepId(stepId);
      onStepChange?.(stepId, navDirection);
    }, 50);
  }, [activeStepId, isTransitioning, onStepChange]);

  const handleNext = useCallback(() => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      const nextStep = steps[nextIndex];
      navigateToStep(nextStep.id, 'forward');
      router.push(nextStep.route);
    }
  }, [currentStepIndex, steps, navigateToStep]);

  const handleBack = useCallback(() => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      const prevStep = steps[prevIndex];
      navigateToStep(prevStep.id, 'backward');
      router.push(prevStep.route);
    } else {
      router.back();
    }
  }, [currentStepIndex, steps, navigateToStep]);

  const handleSwipeBack = useCallback(() => {
    handleBack();
  }, [handleBack]);

  const handleTransitionComplete = useCallback(() => {
    setIsTransitioning(false);
  }, []);

  if (!currentStep) {
    return null;
  }

  const CurrentStepComponent = currentStep.component;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Box flex={1}>
        <ScreenTransition
          isActive={!isTransitioning}
          direction={direction}
          onTransitionComplete={handleTransitionComplete}
          enableGestures={currentStepIndex > 0}
          onSwipeBack={handleSwipeBack}
        >
          <CurrentStepComponent
            onNext={handleNext}
            onBack={handleBack}
            stepIndex={currentStepIndex}
            totalSteps={steps.length}
          />
        </ScreenTransition>
      </Box>
    </GestureHandlerRootView>
  );
};

export default OnboardingFlowManager;

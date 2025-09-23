import React, { useEffect } from 'react';
import { Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Box } from '../primitives';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ScreenTransitionProps {
  children: React.ReactNode;
  isActive: boolean;
  direction?: 'forward' | 'backward';
  onTransitionComplete?: () => void;
  enableGestures?: boolean;
  onSwipeBack?: () => void;
}

export const ScreenTransition: React.FC<ScreenTransitionProps> = ({
  children,
  isActive,
  direction = 'forward',
  onTransitionComplete,
  enableGestures = true,
  onSwipeBack,
}) => {
  const translateX = useSharedValue(direction === 'forward' ? SCREEN_WIDTH : -SCREEN_WIDTH);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.95);
  const gestureTranslateX = useSharedValue(0);
  const gestureActive = useSharedValue(false);

  // Spring configuration for smooth 60fps animations
  const springConfig = {
    damping: 20,
    stiffness: 300,
    mass: 0.8,
    overshootClamping: false,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  };

  // Timing configuration for opacity
  const timingConfig = {
    duration: 400,
  };

  useEffect(() => {
    if (isActive) {
      // Animate in
      translateX.value = withSpring(0, springConfig, (finished) => {
        if (finished && onTransitionComplete) {
          runOnJS(onTransitionComplete)();
        }
      });
      opacity.value = withTiming(1, timingConfig);
      scale.value = withSpring(1, springConfig);
    } else {
      // Animate out
      const targetX = direction === 'forward' ? -SCREEN_WIDTH : SCREEN_WIDTH;
      translateX.value = withSpring(targetX, springConfig);
      opacity.value = withTiming(0, timingConfig);
      scale.value = withSpring(0.95, springConfig);
    }
  }, [isActive, direction]);

  // Gesture handling for swipe back
  const panGesture = Gesture.Pan()
    .enabled(enableGestures && isActive)
    .onStart(() => {
      gestureActive.value = true;
    })
    .onUpdate((event) => {
      // Only allow right swipe (back gesture)
      if (event.translationX > 0) {
        gestureTranslateX.value = event.translationX;
      }
    })
    .onEnd((event) => {
      gestureActive.value = false;
      
      const shouldGoBack = event.translationX > SCREEN_WIDTH * 0.3 || event.velocityX > 500;
      
      if (shouldGoBack && onSwipeBack) {
        // Animate out and trigger back navigation
        gestureTranslateX.value = withSpring(SCREEN_WIDTH, springConfig, (finished) => {
          if (finished) {
            runOnJS(onSwipeBack)();
          }
        });
      } else {
        // Snap back to original position
        gestureTranslateX.value = withSpring(0, springConfig);
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    const finalTranslateX = translateX.value + gestureTranslateX.value;
    
    // Add subtle parallax effect during gesture
    const gestureOpacity = gestureActive.value 
      ? interpolate(
          gestureTranslateX.value,
          [0, SCREEN_WIDTH * 0.5],
          [1, 0.7],
          Extrapolation.CLAMP
        )
      : opacity.value;

    const gestureScale = gestureActive.value
      ? interpolate(
          gestureTranslateX.value,
          [0, SCREEN_WIDTH * 0.5],
          [1, 0.95],
          Extrapolation.CLAMP
        )
      : scale.value;

    return {
      transform: [
        { translateX: finalTranslateX },
        { scale: gestureScale },
      ] as any,
      opacity: gestureOpacity,
    };
  });

  const containerStyle = useAnimatedStyle(() => {
    // Add shadow during gesture for depth
    const shadowOpacity = gestureActive.value && gestureTranslateX.value > 0 
      ? interpolate(
          gestureTranslateX.value,
          [0, SCREEN_WIDTH * 0.2],
          [0, 0.3],
          Extrapolation.CLAMP
        )
      : 0;

    return {
      shadowOpacity,
      shadowRadius: 10,
      shadowOffset: { width: -5, height: 0 },
      shadowColor: '#000',
      elevation: shadowOpacity * 10,
    };
  });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[{ flex: 1 }, containerStyle]}>
        <Animated.View style={[{ flex: 1 }, animatedStyle]}>
          <Box flex={1}>
            {children}
          </Box>
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
};

export default ScreenTransition;

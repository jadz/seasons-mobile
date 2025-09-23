import React, { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { Box } from '../primitives';

interface SharedElementProps {
  children: React.ReactNode;
  sharedId: string;
  isActive: boolean;
  animationType?: 'scale' | 'fade' | 'slide' | 'morph';
  delay?: number;
}

export const SharedElement: React.FC<SharedElementProps> = ({
  children,
  sharedId,
  isActive,
  animationType = 'scale',
  delay = 0,
}) => {
  const progress = useSharedValue(0);
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  // High-performance spring configuration
  const springConfig = {
    damping: 25,
    stiffness: 400,
    mass: 0.7,
    overshootClamping: false,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  };

  useEffect(() => {
    const animate = () => {
      if (isActive) {
        progress.value = withSpring(1, springConfig);
        scale.value = withSpring(1, springConfig);
        opacity.value = withTiming(1, { duration: 300 });
        translateY.value = withSpring(0, springConfig);
      } else {
        progress.value = withSpring(0, springConfig);
        scale.value = withSpring(0.8, springConfig);
        opacity.value = withTiming(0, { duration: 200 });
        translateY.value = withSpring(20, springConfig);
      }
    };

    if (delay > 0) {
      setTimeout(animate, delay);
    } else {
      animate();
    }
  }, [isActive, delay]);

  const animatedStyle = useAnimatedStyle(() => {
    switch (animationType) {
      case 'scale':
        return {
          transform: [{ scale: scale.value }] as any,
          opacity: opacity.value,
        };
      
      case 'fade':
        return {
          opacity: opacity.value,
        };
      
      case 'slide':
        return {
          transform: [{ translateY: translateY.value }] as any,
          opacity: opacity.value,
        };
      
      case 'morph':
        const morphScale = interpolate(
          progress.value,
          [0, 0.5, 1],
          [0.8, 1.1, 1],
          Extrapolation.CLAMP
        );
        return {
          transform: [
            { scale: morphScale },
            { translateY: translateY.value },
          ] as any,
          opacity: opacity.value,
        };
      
      default:
        return {
          transform: [{ scale: scale.value }] as any,
          opacity: opacity.value,
        };
    }
  });

  return (
    <Animated.View style={animatedStyle}>
      {children}
    </Animated.View>
  );
};

export default SharedElement;

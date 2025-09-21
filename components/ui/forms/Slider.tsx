import React, { useState } from 'react';
import { TouchableOpacity, PanResponder, Dimensions } from 'react-native';
import { Box } from '../primitives/Box';
import { Text } from '../primitives/Text';
import { Theme } from '../foundation/theme';

export interface SliderProps {
  value?: number;
  onValueChange?: (value: number) => void;
  minimumValue?: number;
  maximumValue?: number;
  step?: number;
  disabled?: boolean;
  trackColor?: keyof Theme['colors'];
  activeTrackColor?: keyof Theme['colors'];
  thumbColor?: keyof Theme['colors'];
  showValue?: boolean;
  formatValue?: (value: number) => string;
  width?: number;
}

export const Slider: React.FC<SliderProps> = ({
  value = 0,
  onValueChange,
  minimumValue = 0,
  maximumValue = 100,
  step = 1,
  disabled = false,
  trackColor = 'border',
  activeTrackColor = 'primary',
  thumbColor = 'primary',
  showValue = true,
  formatValue = (val) => val.toString(),
  width = 280,
}) => {
  const [currentValue, setCurrentValue] = useState(value);
  const [thumbPosition, setThumbPosition] = useState(0);
  
  const trackWidth = width - 24; // Account for thumb size
  const thumbSize = 24;

  // Calculate thumb position based on value
  React.useEffect(() => {
    const normalizedValue = (value - minimumValue) / (maximumValue - minimumValue);
    setThumbPosition(normalizedValue * trackWidth);
    setCurrentValue(value);
  }, [value, minimumValue, maximumValue, trackWidth]);

  const updateValueFromPosition = (position: number) => {
    const normalizedPosition = Math.max(0, Math.min(1, position / trackWidth));
    const rawValue = minimumValue + normalizedPosition * (maximumValue - minimumValue);
    const steppedValue = Math.round(rawValue / step) * step;
    const clampedValue = Math.max(minimumValue, Math.min(maximumValue, steppedValue));
    
    setCurrentValue(clampedValue);
    onValueChange?.(clampedValue);
    
    // Update thumb position to match the stepped value
    const normalizedValue = (clampedValue - minimumValue) / (maximumValue - minimumValue);
    setThumbPosition(normalizedValue * trackWidth);
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => !disabled,
    onMoveShouldSetPanResponder: () => !disabled,
    onPanResponderMove: (event, gestureState) => {
      const newPosition = thumbPosition + gestureState.dx;
      updateValueFromPosition(newPosition);
    },
    onPanResponderRelease: () => {
      // Snap to final position
      const normalizedValue = (currentValue - minimumValue) / (maximumValue - minimumValue);
      setThumbPosition(normalizedValue * trackWidth);
    },
  });

  const activeTrackWidth = thumbPosition + thumbSize / 2;

  return (
    <Box width={width}>
      {showValue && (
        <Box marginBottom="s" alignItems="center">
          <Text variant="caption" color={disabled ? "textMuted" : "text"}>
            {formatValue(currentValue)}
          </Text>
        </Box>
      )}
      
      <Box height={thumbSize} justifyContent="center">
        {/* Track background */}
        <Box
          height={4}
          backgroundColor={trackColor}
          borderRadius="s"
          width={trackWidth}
          style={{ marginLeft: thumbSize / 2 }}
        />
        
        {/* Active track */}
        <Box
          position="absolute"
          height={4}
          backgroundColor={disabled ? "textMuted" : activeTrackColor}
          borderRadius="s"
          width={activeTrackWidth}
          style={{ marginLeft: thumbSize / 2 }}
        />
        
        {/* Thumb */}
        <Box
          position="absolute"
          width={thumbSize}
          height={thumbSize}
          backgroundColor={disabled ? "textMuted" : thumbColor}
          borderRadius="round"
          shadowColor="black"
          shadowOffset={{ width: 0, height: 2 }}
          shadowOpacity={disabled ? 0 : 0.2}
          shadowRadius={4}
          elevation={disabled ? 0 : 4}
          style={{
            left: thumbPosition,
          }}
          {...(disabled ? {} : panResponder.panHandlers)}
        />
      </Box>
    </Box>
  );
};

export default Slider;

import React from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { Box, StyledBoxProps } from '../primitives/Box';
import { Theme } from '../foundation/theme';

export interface CardProps extends StyledBoxProps {
  children?: React.ReactNode;
  onPress?: TouchableOpacityProps['onPress'];
  disabled?: boolean;
  variant?: 'default' | 'elevated' | 'outlined';
}

export const Card: React.FC<CardProps> = ({
  children,
  onPress,
  disabled = false,
  variant = 'default',
  backgroundColor = 'surface',
  borderRadius = 'm',
  padding = 'm',
  ...boxProps
}) => {
  const getVariantProps = () => {
    switch (variant) {
      case 'elevated':
        return {
          shadowColor: 'black' as keyof Theme['colors'],
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2,
          borderWidth: 0,
        };
      case 'outlined':
        return {
          borderWidth: 1,
          borderColor: 'border' as keyof Theme['colors'],
          shadowColor: 'transparent' as keyof Theme['colors'],
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0,
          shadowRadius: 0,
          elevation: 0,
        };
      default:
        return {
          shadowColor: 'black' as keyof Theme['colors'],
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 2,
          elevation: 1,
          borderWidth: 0,
        };
    }
  };

  const variantProps = getVariantProps();

  const cardContent = (
    <Box
      backgroundColor={backgroundColor}
      borderRadius={borderRadius}
      padding={padding}
      {...variantProps}
      {...boxProps}
    >
      {children}
    </Box>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.7}
      >
        {cardContent}
      </TouchableOpacity>
    );
  }

  return cardContent;
};

export default Card;

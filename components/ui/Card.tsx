import React from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { Box, StyledBoxProps } from './Box';
import { Theme } from './theme';

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
          shadow: 'md' as keyof Theme['shadows'],
          borderWidth: 0,
        };
      case 'outlined':
        return {
          borderWidth: 1,
          borderColor: 'border' as keyof Theme['colors'],
          shadow: 'none' as keyof Theme['shadows'],
        };
      default:
        return {
          shadow: 'sm' as keyof Theme['shadows'],
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


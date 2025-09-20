import React from 'react';
import { Box } from './Box';
import { Text } from './Text';
import { Theme } from './theme';

export interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'outline';
  size?: 'small' | 'medium' | 'large';
  shape?: 'rounded' | 'pill' | 'square';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'medium',
  shape = 'rounded',
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return {
          backgroundColor: 'successBackground' as keyof Theme['colors'],
          textColor: 'success' as keyof Theme['colors'],
          borderColor: 'success' as keyof Theme['colors'],
        };
      case 'warning':
        return {
          backgroundColor: 'warningBackground' as keyof Theme['colors'],
          textColor: 'warning' as keyof Theme['colors'],
          borderColor: 'warning' as keyof Theme['colors'],
        };
      case 'error':
        return {
          backgroundColor: 'errorBackground' as keyof Theme['colors'],
          textColor: 'error' as keyof Theme['colors'],
          borderColor: 'error' as keyof Theme['colors'],
        };
      case 'info':
        return {
          backgroundColor: 'infoBackground' as keyof Theme['colors'],
          textColor: 'info' as keyof Theme['colors'],
          borderColor: 'info' as keyof Theme['colors'],
        };
      case 'outline':
        return {
          backgroundColor: 'transparent' as keyof Theme['colors'],
          textColor: 'text' as keyof Theme['colors'],
          borderColor: 'border' as keyof Theme['colors'],
        };
      default:
        return {
          backgroundColor: 'surface' as keyof Theme['colors'],
          textColor: 'text' as keyof Theme['colors'],
          borderColor: 'border' as keyof Theme['colors'],
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: 'xs' as keyof Theme['spacing'],
          paddingHorizontal: 's' as keyof Theme['spacing'],
          textVariant: 'small' as keyof Theme['textVariants'],
        };
      case 'large':
        return {
          paddingVertical: 's' as keyof Theme['spacing'],
          paddingHorizontal: 'm' as keyof Theme['spacing'],
          textVariant: 'body' as keyof Theme['textVariants'],
        };
      default:
        return {
          paddingVertical: 'xs' as keyof Theme['spacing'],
          paddingHorizontal: 's' as keyof Theme['spacing'],
          textVariant: 'caption' as keyof Theme['textVariants'],
        };
    }
  };

  const getShapeStyles = () => {
    switch (shape) {
      case 'pill':
        return {
          borderRadius: 'round' as keyof Theme['borderRadii'],
        };
      case 'square':
        return {
          borderRadius: 'xs' as keyof Theme['borderRadii'],
        };
      default:
        return {
          borderRadius: 's' as keyof Theme['borderRadii'],
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();
  const shapeStyles = getShapeStyles();

  return (
    <Box
      backgroundColor={variantStyles.backgroundColor}
      borderColor={variantStyles.borderColor}
      borderWidth={variant === 'outline' ? 1 : 0}
      borderRadius={shapeStyles.borderRadius}
      paddingVertical={sizeStyles.paddingVertical}
      paddingHorizontal={sizeStyles.paddingHorizontal}
      alignSelf="flex-start"
    >
      <Text
        variant={sizeStyles.textVariant}
        color={variantStyles.textColor}
        textAlign="center"
      >
        {children}
      </Text>
    </Box>
  );
};

export default Badge;

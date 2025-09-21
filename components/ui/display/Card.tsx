import React from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { createRestyleComponent, createVariant, VariantProps } from '@shopify/restyle';
import { Box, StyledBoxProps } from '../primitives/Box';
import { Theme } from '../foundation/theme';

const cardVariant = createVariant({ themeKey: 'cardVariants' });

const CardBox = createRestyleComponent<
  VariantProps<Theme, 'cardVariants'> & React.ComponentProps<typeof Box>,
  Theme
>([cardVariant], Box);

export interface CardProps extends StyledBoxProps {
  children?: React.ReactNode;
  onPress?: TouchableOpacityProps['onPress'];
  disabled?: boolean;
  variant?: keyof Theme['cardVariants'];
}

export const Card: React.FC<CardProps> = ({
  children,
  onPress,
  disabled = false,
  variant = 'default',
  backgroundColor = 'bg/surface',
  borderRadius = 'm',
  padding = 'm',
  ...boxProps
}) => {
  const cardContent = (
    <CardBox
      variant={variant}
      backgroundColor={backgroundColor}
      borderRadius={borderRadius}
      padding={padding}
      {...boxProps}
    >
      {children}
    </CardBox>
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

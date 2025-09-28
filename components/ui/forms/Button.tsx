import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, ActivityIndicator } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Box } from '../primitives/Box';
import { Text } from '../primitives/Text';
import { Theme, ThemeColors, ThemeSpacing, ThemeRadii } from '../foundation/theme';

export interface ButtonProps extends TouchableOpacityProps {
  children?: React.ReactNode;
  variant?: keyof Theme['buttonVariants'];
  size?: keyof Theme['buttonSizes'];
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  ...touchableProps
}) => {
  const theme = useTheme<Theme>();
  const isDisabled = disabled || loading;
  
  const variantStyles = theme.buttonVariants[variant];
  const sizeStyles = theme.buttonSizes[size];

  return (
    <TouchableOpacity
      {...touchableProps}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      <Box
        backgroundColor={variantStyles.backgroundColor as ThemeColors}
        borderColor={variantStyles.borderColor as ThemeColors}
        borderWidth={variantStyles.borderWidth}
        paddingVertical={sizeStyles.paddingVertical as ThemeSpacing}
        paddingHorizontal={sizeStyles.paddingHorizontal as ThemeSpacing}
        borderRadius={sizeStyles.borderRadius as ThemeRadii}
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
        width={fullWidth ? '100%' : undefined}
        opacity={isDisabled ? 0.6 : 1}
      >
        {loading ? (
          <ActivityIndicator size="small" color={variantStyles.textColor} />
        ) : (
          <>
            {leftIcon && <Box marginRight="s">{leftIcon}</Box>}
            <Text variant="button" color={variantStyles.textColor as ThemeColors}>{children}</Text>
            {rightIcon && <Box marginLeft="s">{rightIcon}</Box>}
          </>
        )}
      </Box>
    </TouchableOpacity>
  );
};

export default Button;
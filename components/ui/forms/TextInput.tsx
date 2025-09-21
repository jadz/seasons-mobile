import React, { forwardRef } from 'react';
import { TextInput as RNTextInput, TextInputProps as RNTextInputProps } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Box } from '../primitives/Box';
import { Text } from '../primitives/Text';
import { Theme, ThemeColors } from '../foundation/theme';

export interface TextInputProps extends RNTextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'outlined' | 'filled';
  size?: 'small' | 'medium' | 'large';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerProps?: React.ComponentProps<typeof Box>;
}

export const TextInput = forwardRef<RNTextInput, TextInputProps>(({
  label,
  error,
  helperText,
  variant = 'outlined',
  size = 'medium',
  leftIcon,
  rightIcon,
  containerProps,
  style,
  ...textInputProps
}, ref) => {
  const theme = useTheme<Theme>();
  const hasError = !!error;

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          height: 40,
          fontSize: 14,
          paddingHorizontal: theme.spacing.s,
        };
      case 'large':
        return {
          height: 56,
          fontSize: 18,
          paddingHorizontal: theme.spacing.l,
        };
      default:
        return {
          height: 48,
          fontSize: 16,
          paddingHorizontal: theme.spacing.m,
        };
    }
  };

  const getVariantStyles = () => {
    const baseStyles = {
      borderWidth: 1,
      borderRadius: theme.borderRadii.s,
    };

    switch (variant) {
      case 'filled':
        return {
          ...baseStyles,
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        };
      case 'outlined':
      default:
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
          borderColor: hasError ? theme.colors.error : theme.colors.border,
        };
    }
  };

  const sizeStyles = getSizeStyles();
  const variantStyles = getVariantStyles();

  return (
    <Box {...containerProps}>
      {label && (
        <Text
          variant="label"
          color={hasError ? 'error' : 'text'}
          marginBottom="s"
        >
          {label}
        </Text>
      )}
      
      <Box
        flexDirection="row"
        alignItems="center"
        style={variantStyles}
        height={sizeStyles.height}
      >
        {leftIcon && (
          <Box marginLeft="s" marginRight="xs">
            {leftIcon}
          </Box>
        )}
        
        <RNTextInput
          ref={ref}
          style={[
            {
              flex: 1,
              fontSize: sizeStyles.fontSize,
              color: theme.colors.text,
              paddingHorizontal: leftIcon || rightIcon ? 0 : sizeStyles.paddingHorizontal,
              paddingVertical: 0,
            },
            style,
          ]}
          placeholderTextColor={theme.colors.textMuted}
          {...textInputProps}
        />
        
        {rightIcon && (
          <Box marginLeft="xs" marginRight="s">
            {rightIcon}
          </Box>
        )}
      </Box>
      
      {(error || helperText) && (
        <Text
          variant="small"
          color={hasError ? 'error' : 'textSecondary'}
          marginTop="xs"
        >
          {error || helperText}
        </Text>
      )}
    </Box>
  );
});

TextInput.displayName = 'TextInput';

export default TextInput;

import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, ActivityIndicator } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Box } from '../primitives/Box';
import { Text } from '../primitives/Text';
import { Theme, ThemeColors } from '../foundation/theme';

export interface ButtonProps extends TouchableOpacityProps {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  borderRadius?: keyof Theme['radii'];
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
  borderRadius,
  ...touchableProps
}) => {
  const theme = useTheme<Theme>();
  const isDisabled = disabled || loading;

  const getVariantStyles = () => {
    const styles = {
      backgroundColor: 'accent/brand' as ThemeColors,
      textColor: 'accent/onBrand' as ThemeColors,
      borderColor: 'accent/brand' as ThemeColors,
      borderWidth: 1,
    };

    switch (variant) {
      case 'secondary':
        styles.backgroundColor = 'bg/surface';
        styles.textColor = 'text/primary';
        styles.borderColor = 'border/subtle';
        styles.borderWidth = 1;
        break;
      case 'outline':
        styles.backgroundColor = 'transparent';
        styles.textColor = 'accent/brand';
        styles.borderColor = 'accent/brand';
        styles.borderWidth = 1;
        break;
      case 'ghost':
        styles.backgroundColor = 'transparent';
        styles.textColor = 'accent/brand';
        styles.borderWidth = 0;
        break;
      case 'danger':
        styles.backgroundColor = 'state/error';
        styles.textColor = 'text/inverse';
        styles.borderColor = 'state/error';
        styles.borderWidth = 1;
        break;
    }

    if (isDisabled) {
      styles.backgroundColor = 'buttonPrimaryDisabled';
      styles.textColor = 'text/secondary';
      styles.borderColor = 'buttonPrimaryDisabled';
      styles.borderWidth = 1;
    }

    return styles;
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: 's' as keyof Theme['spacing'],
          paddingHorizontal: 'm' as keyof Theme['spacing'],
          borderRadius: 'md' as keyof Theme['radii'],
          fontSize: 14,
        };
      case 'large':
        return {
          paddingVertical: 'l' as keyof Theme['spacing'],
          paddingHorizontal: 'xl' as keyof Theme['spacing'],
          borderRadius: 'lg' as keyof Theme['radii'],
          fontSize: 18,
        };
      default:
        return {
          paddingVertical: 'm' as keyof Theme['spacing'],
          paddingHorizontal: 'l' as keyof Theme['spacing'],
          borderRadius: 'md' as keyof Theme['radii'],
          fontSize: 16,
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();
  
  // Use the custom borderRadius or fall back to size-based radius
  const radiusKey = borderRadius || sizeStyles.borderRadius;
  const finalBorderRadius = theme.radii[radiusKey];
  
  // Debug logging
  console.log('Button borderRadius:', { borderRadius, sizeStyles: sizeStyles.borderRadius, radiusKey, final: finalBorderRadius });

  return (
    <TouchableOpacity
      {...touchableProps}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      <Box
        backgroundColor={variantStyles.backgroundColor}
        borderColor={variantStyles.borderColor}
        borderWidth={variantStyles.borderWidth}
        paddingVertical={sizeStyles.paddingVertical as keyof Theme['spacing']}
        paddingHorizontal={sizeStyles.paddingHorizontal as keyof Theme['spacing']}
        borderRadius={finalBorderRadius}
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
        width={fullWidth ? '100%' : undefined}
        opacity={isDisabled ? 0.6 : 1}
      >
        {loading ? (
          <ActivityIndicator
            size="small"
            color={variantStyles.textColor}
          />
        ) : (
          <>
            {leftIcon && (
              <Box marginRight="s">
                {leftIcon}
              </Box>
            )}
            
            <Text
              variant="button"
              color={variantStyles.textColor}
              fontSize={sizeStyles.fontSize}
            >
              {children}
            </Text>
            
            {rightIcon && (
              <Box marginLeft="s">
                {rightIcon}
              </Box>
            )}
          </>
        )}
      </Box>
    </TouchableOpacity>
  );
};

export default Button;

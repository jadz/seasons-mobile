import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, ActivityIndicator } from 'react-native';
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
  const isDisabled = disabled || loading;

  const getVariantStyles = () => {
    const styles = {
      backgroundColor: 'primaryDark' as ThemeColors,
      textColor: 'white' as ThemeColors,
      borderColor: 'primary' as ThemeColors,
      borderWidth: 1,
    };

    switch (variant) {
      case 'secondary':
        styles.backgroundColor = 'surface';
        styles.textColor = 'text';
        styles.borderColor = 'border';
        styles.borderWidth = 1;
        break;
      case 'outline':
        styles.backgroundColor = 'transparent';
        styles.textColor = 'primary';
        styles.borderColor = 'primary';
        styles.borderWidth = 1;
        break;
      case 'ghost':
        styles.backgroundColor = 'transparent';
        styles.textColor = 'primary';
        styles.borderWidth = 0;
        break;
      case 'danger':
        styles.backgroundColor = 'primaryDark';
        styles.textColor = 'white';
        styles.borderColor = 'error';
        styles.borderWidth = 1;
        break;
    }

    if (isDisabled) {
      styles.backgroundColor = 'buttonPrimaryDisabled';
      styles.textColor = 'textMuted';
      styles.borderColor = 'buttonPrimaryDisabled';
      styles.borderWidth = 1;
    }

    return styles;
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: 's',
          paddingHorizontal: 'm',
          borderRadius: 'l',
          fontSize: 14,
        };
      case 'large':
        return {
          paddingVertical: 'l',
          paddingHorizontal: 'xl',
          borderRadius: 'l',
          fontSize: 18,
        };
      default:
        return {
          paddingVertical: 'm',
          paddingHorizontal: 'l',
          borderRadius: 'l',
          fontSize: 16,
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

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
        borderRadius={sizeStyles.borderRadius as keyof Theme['borderRadii']}
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

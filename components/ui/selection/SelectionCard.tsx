import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, Text as RNText } from 'react-native';
import { Box } from '../primitives/Box';
import { Text } from '../primitives/Text';

export interface SelectionCardProps extends Omit<TouchableOpacityProps, 'onPress'> {
  title: string;
  description?: string;
  isSelected?: boolean;
  isDisabled?: boolean;
  onPress?: () => void;
  icon?: React.ReactNode;
  selectionType?: 'radio' | 'checkbox';
  size?: 'small' | 'medium' | 'large';
  colorVariant?: 'default' | 'coral' | 'purple' | 'navy';
  label?: string; // Small label in top left
  largeDescription?: string; // Larger descriptive text
}

export const SelectionCard: React.FC<SelectionCardProps> = ({
  title,
  description,
  isSelected = false,
  isDisabled = false,
  onPress,
  icon,
  selectionType = 'radio',
  size = 'medium',
  colorVariant = 'default',
  label,
  largeDescription,
  ...touchableProps
}) => {
  const handlePress = () => {
    if (!isDisabled && onPress) {
      onPress();
    }
  };

  const getColorStyles = () => {
    switch (colorVariant) {
      case 'coral':
        return {
          backgroundColor: '#D67B7B',
          textColor: '#FFFFFF',
          descriptionColor: '#FFFFFF',
        };
      case 'purple':
        return {
          backgroundColor: '#9B7BA7',
          textColor: '#FFFFFF',
          descriptionColor: '#FFFFFF',
        };
      case 'navy':
        return {
          backgroundColor: '#3A4A5C',
          textColor: '#FFFFFF',
          descriptionColor: '#FFFFFF',
        };
      default:
        return {
          backgroundColor: isSelected ? '#263137' : '#FFFFFF',
          textColor: isSelected ? '#FFFFFF' : '#263137',
          descriptionColor: isSelected ? '#FFFFFF' : '#7A9C81',
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingHorizontal: 'm',
          paddingVertical: 'm',
          marginRight: 's',
          marginBottom: 's',
          textVariant: 'body',
          borderRadius: 'm',
        };
      case 'large':
        return {
          paddingHorizontal: 'xxl',
          paddingVertical: 'xl',
          marginBottom: 'xl',
          textVariant: 'h3',
          borderRadius: 'l',
        };
      default: // medium
        return {
          paddingHorizontal: 'xl',
          paddingVertical: 'l',
          marginBottom: 'l',
          textVariant: 'body',
          borderRadius: 'l',
        };
    }
  };

  const colorStyles = getColorStyles();
  const sizeStyles = getSizeStyles();

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={isDisabled}
      activeOpacity={0.6}
      {...touchableProps}
    >
      <Box
        style={{
          backgroundColor: colorStyles.backgroundColor,
          borderRadius: 16,
          borderWidth: colorVariant !== 'default' ? 0 : 1,
          borderColor: colorVariant !== 'default' ? 'transparent' : (isSelected ? '#4E7166' : '#C9D0C3'),
        }}
        paddingHorizontal={sizeStyles.paddingHorizontal as any}
        paddingVertical={sizeStyles.paddingVertical as any}
        marginBottom={sizeStyles.marginBottom as any}
        marginRight={sizeStyles.marginRight as any}
        opacity={isDisabled ? 0.4 : 1}
      >
        {/* New layout for label + large description style */}
        {label && largeDescription ? (
          <Box>
            {/* Small label in top left */}
            <RNText
              style={{
                color: colorStyles.textColor,
                fontSize: 12,
                fontWeight: '500',
                opacity: 0.8,
                marginBottom: 16,
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}
            >
              {label}
            </RNText>
            
            {/* Large descriptive text */}
            <RNText
              style={{
                color: colorStyles.textColor,
                fontSize: 18,
                fontWeight: '600',
                lineHeight: 24,
              }}
            >
              {largeDescription}
            </RNText>
          </Box>
        ) : (
          /* Original layout for backwards compatibility */
          <Box flexDirection="row" alignItems="center" justifyContent="center">
            {icon && (
              <Box marginRight="m">
                {icon}
              </Box>
            )}
            
            <Box flex={1} alignItems={size === 'small' ? 'center' : 'flex-start'}>
              <RNText
                style={{
                  color: colorStyles.textColor,
                  textAlign: size === 'small' ? 'center' : 'left',
                  fontSize: size === 'large' ? 20 : 16,
                  fontWeight: colorVariant !== 'default' ? '600' : (isSelected ? '600' : '400'),
                }}
              >
                {title}
              </RNText>
              {description && (
                <RNText
                  style={{
                    color: colorStyles.descriptionColor,
                    textAlign: size === 'small' ? 'center' : 'left',
                    fontSize: 14,
                    marginTop: 4,
                    opacity: 0.9,
                  }}
                  numberOfLines={2}
                >
                  {description}
                </RNText>
              )}
            </Box>
          </Box>
        )}
      </Box>
    </TouchableOpacity>
  );
};

export default SelectionCard;

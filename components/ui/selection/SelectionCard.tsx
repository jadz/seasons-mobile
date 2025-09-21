import React from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
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
  ...touchableProps
}) => {
  const handlePress = () => {
    if (!isDisabled && onPress) {
      onPress();
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingHorizontal: 'm',
          paddingVertical: 'm',
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

  const sizeStyles = getSizeStyles();

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={isDisabled}
      activeOpacity={0.6}
      {...touchableProps}
    >
      <Box
        backgroundColor={isSelected ? 'primaryDark' : 'surface'}
        borderRadius={sizeStyles.borderRadius as any}
        borderWidth={1}
        borderColor={isSelected ? 'primary' : 'border'}
        paddingHorizontal={sizeStyles.paddingHorizontal as any}
        paddingVertical={sizeStyles.paddingVertical as any}
        marginBottom={sizeStyles.marginBottom as any}
        opacity={isDisabled ? 0.4 : 1}
      >
        <Box flexDirection="row" alignItems="center" justifyContent="center">
          {icon && (
            <Box marginRight="m">
              {icon}
            </Box>
          )}
          
          <Box flex={1} alignItems={size === 'small' ? 'center' : 'flex-start'}>
            <Text
              variant={isSelected ? 'bodySemiBold' : sizeStyles.textVariant as any}
              color={isSelected ? 'white' : 'text'}
              textAlign={size === 'small' ? 'center' : 'left'}
              marginBottom={description ? 'xs' : undefined}
            >
              {title}
            </Text>
            {description && (
              <Text
                variant="body"
                color={isSelected ? 'textInverse' : 'textMuted'}
                numberOfLines={2}
                textAlign={size === 'small' ? 'center' : 'left'}
              >
                {description}
              </Text>
            )}
          </Box>
        </Box>
      </Box>
    </TouchableOpacity>
  );
};

export default SelectionCard;

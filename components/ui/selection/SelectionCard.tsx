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
}

export const SelectionCard: React.FC<SelectionCardProps> = ({
  title,
  description,
  isSelected = false,
  isDisabled = false,
  onPress,
  icon,
  selectionType = 'radio',
  ...touchableProps
}) => {
  const handlePress = () => {
    if (!isDisabled && onPress) {
      onPress();
    }
  };

  const renderSelectionIndicator = () => {
    if (isSelected) {
      return (
        <Box
          width={32}
          height={32}
          borderRadius="round"
          backgroundColor="text"
          alignItems="center"
          justifyContent="center"
        >
          <Text variant="body" color="white" fontSize={16}>
            ✓
          </Text>
        </Box>
      );
    } else {
      return (
        <Box
          width={32}
          height={32}
          borderRadius="round"
          backgroundColor="border"
          alignItems="center"
          justifyContent="center"
        >
          <Text variant="body" color="textMuted" fontSize={12}>
            ⋯
          </Text>
        </Box>
      );
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={isDisabled}
      activeOpacity={0.6}
      {...touchableProps}
    >
      <Box
        backgroundColor="surface"
        borderRadius="m"
        borderWidth={2}
        borderColor={isSelected ? 'primary' : 'border'}
        paddingHorizontal="l"
        paddingVertical="l"
        marginBottom="s"
        opacity={isDisabled ? 0.4 : 1}
      >
        <Box flexDirection="row" alignItems="center" justifyContent="space-between">
          {/* Left side content */}
          <Box flex={1} flexDirection="row" alignItems="center">
            {icon && (
              <Box marginRight="m">
                {icon}
              </Box>
            )}
            
            <Box flex={1}>
              <Text
                variant="h3"
                color="text"
                marginBottom={description ? 'xs' : undefined}
              >
                {title}
              </Text>
              {description && (
                <Text
                  variant="body"
                  color="textMuted"
                  numberOfLines={2}
                >
                  {description}
                </Text>
              )}
            </Box>
          </Box>

          {/* Right side selection indicator */}
          <Box marginLeft="m">
            {renderSelectionIndicator()}
          </Box>
        </Box>
      </Box>
    </TouchableOpacity>
  );
};

export default SelectionCard;

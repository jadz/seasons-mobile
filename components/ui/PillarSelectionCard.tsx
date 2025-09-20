import React from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { Box } from './Box';
import { Text } from './Text';

export interface PillarSelectionCardProps extends Omit<TouchableOpacityProps, 'onPress'> {
  title: string;
  isSelected?: boolean;
  isDisabled?: boolean;
  onPress?: () => void;
  icon?: React.ReactNode;
  gradientColors?: string[];
  description?: string;
}

export const PillarSelectionCard: React.FC<PillarSelectionCardProps> = ({
  title,
  isSelected = false,
  isDisabled = false,
  onPress,
  description,
  ...touchableProps
}) => {
  const handlePress = () => {
    if (!isDisabled && onPress) {
      onPress();
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
        flexDirection="row"
        alignItems="center"
        paddingHorizontal="l"
        paddingVertical="xl"
        backgroundColor={isSelected ? 'surface' : 'background'}
        borderRadius="s"
        borderWidth={1}
        borderColor={isSelected ? 'primary' : 'transparent'}
        opacity={isDisabled ? 0.4 : 1}
        marginBottom="s"
      >
        {/* Simple dot indicator */}
        <Box
          width={6}
          height={6}
          borderRadius="round"
          backgroundColor={isSelected ? 'primary' : 'border'}
          marginRight="l"
        />
        
        {/* Minimal content */}
        <Box flex={1}>
          <Text
            variant="body"
            color={isSelected ? 'text' : 'text'}
            marginBottom={description ? 'xs' : undefined}
          >
            {title}
          </Text>
          {description && (
            <Text
              variant="caption"
              color="textMuted"
              numberOfLines={2}
            >
              {description}
            </Text>
          )}
        </Box>

        {/* Minimal selection indicator */}
        {isSelected && (
          <Box
            width={16}
            height={16}
            borderRadius="round"
            backgroundColor="primary"
            alignItems="center"
            justifyContent="center"
          >
            <Box
              width={6}
              height={6}
              borderRadius="round"
              backgroundColor="white"
            />
          </Box>
        )}
      </Box>
    </TouchableOpacity>
  );
};

export default PillarSelectionCard;

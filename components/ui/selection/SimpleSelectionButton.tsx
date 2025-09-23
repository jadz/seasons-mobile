import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Box, Text } from '../primitives';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../foundation/theme';

interface SimpleSelectionButtonProps {
  title: string;
  isSelected?: boolean;
  onPress?: () => void;
  isDisabled?: boolean;
}

export const SimpleSelectionButton: React.FC<SimpleSelectionButtonProps> = ({
  title,
  isSelected = false,
  onPress,
  isDisabled = false,
}) => {
  const theme = useTheme<Theme>();

  // Resolve borderRadius to numeric value
  const borderRadius = theme.radii.md;

  const getBackgroundColor = () => {
    if (isDisabled) return 'bg/surface';
    if (isSelected) return 'accent/brand';
    return 'bg/surface';
  };

  const getBorderColor = () => {
    if (isDisabled) return 'border/subtle';
    if (isSelected) return 'accent/brand';
    return 'border/subtle';
  };

  const getTextColor = () => {
    if (isDisabled) return 'text/secondary';
    if (isSelected) return 'accent/onBrand';
    return 'text/primary';
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      <Box
        backgroundColor={getBackgroundColor()}
        borderWidth={1}
        borderColor={getBorderColor()}
        borderRadius={borderRadius}
        paddingHorizontal="lg"
        paddingVertical="lg"
        marginRight="sm"
        marginBottom="sm"
        style={{ minHeight: 50 }}
        justifyContent="center"
        alignItems="center"
        opacity={isDisabled ? 0.4 : 1}
      >
        <Text
          variant="body"
          color={getTextColor()}
          textAlign="center"
          style={{
            fontWeight: isSelected ? '600' : '400',
          }}
        >
          {title}
        </Text>
      </Box>
    </TouchableOpacity>
  );
};

export default SimpleSelectionButton;

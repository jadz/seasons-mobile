import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Box, Text } from '../primitives';
import { useAppTheme } from '../foundation';

interface SegmentedControlOption {
  value: string;
  label: string;
}

interface SegmentedControlProps {
  options: SegmentedControlOption[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  options,
  selectedValue,
  onValueChange,
  size = 'medium',
  fullWidth = false,
}) => {
  const theme = useAppTheme();
  
  const sizeConfig = {
    small: {
      height: 32,
      paddingHorizontal: 12,
      textVariant: 'caption' as const,
    },
    medium: {
      height: 40,
      paddingHorizontal: 16,
      textVariant: 'body' as const,
    },
    large: {
      height: 48,
      paddingHorizontal: 20,
      textVariant: 'body' as const,
    },
  };

  const config = sizeConfig[size];

  return (
    <Box
      flexDirection="row"
      backgroundColor="border/subtle"
      padding="xs"
      style={[
        {
          borderRadius: theme.theme.radii.md
        },
        fullWidth ? { flex: 1 } : undefined
      ]}
    >
      {options.map((option, index) => {
        const isSelected = option.value === selectedValue;
        const isFirst = index === 0;
        const isLast = index === options.length - 1;
        
        return (
          <TouchableOpacity
            key={option.value}
            onPress={() => onValueChange(option.value)}
            style={{ flex: fullWidth ? 1 : undefined }}
          >
            <Box
              backgroundColor={isSelected ? 'bg/surface' : 'transparent'}
              paddingHorizontal="sm"
              paddingVertical="sm"
              alignItems="center"
              justifyContent="center"
              style={{
                height: config.height,
                minWidth: fullWidth ? undefined : 80,
                borderRadius: theme.theme.radii.sm,
              }}
            >
              <Text
                variant={config.textVariant}
                color={isSelected ? 'text/primary' : 'text/secondary'}
                style={{
                  fontWeight: isSelected ? '600' : '400',
                  textAlign: 'center',
                }}
              >
                {option.label}
              </Text>
            </Box>
          </TouchableOpacity>
        );
      })}
    </Box>
  );
};

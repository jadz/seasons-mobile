import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Box } from '../primitives/Box';
import { Text } from '../primitives/Text';
import { Theme } from '../foundation/theme';

export interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightElement?: React.ReactNode;
  backgroundColor?: keyof Theme['colors'];
  variant?: 'default' | 'transparent' | 'elevated';
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBackButton = false,
  onBackPress,
  rightElement,
  backgroundColor = 'surface',
  variant = 'default',
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'transparent':
        return {
          backgroundColor: 'transparent' as keyof Theme['colors'],
          shadowColor: 'transparent' as keyof Theme['colors'],
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0,
          shadowRadius: 0,
          elevation: 0,
        };
      case 'elevated':
        return {
          backgroundColor: backgroundColor,
          shadowColor: 'black' as keyof Theme['colors'],
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2,
        };
      default:
        return {
          backgroundColor: backgroundColor,
          shadowColor: 'black' as keyof Theme['colors'],
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 2,
          elevation: 1,
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <Box
      backgroundColor={variantStyles.backgroundColor}
      shadowColor={variantStyles.shadowColor}
      shadowOffset={variantStyles.shadowOffset}
      shadowOpacity={variantStyles.shadowOpacity}
      shadowRadius={variantStyles.shadowRadius}
      elevation={variantStyles.elevation}
      paddingHorizontal="m"
      paddingVertical="m"
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      minHeight={60}
    >
      {/* Left side - Back button or spacer */}
      <Box width={40} alignItems="flex-start">
        {showBackButton && (
          <TouchableOpacity onPress={onBackPress} activeOpacity={0.7}>
            <Box
              width={32}
              height={32}
              borderRadius="s"
              alignItems="center"
              justifyContent="center"
            >
              <Text variant="h2" color="text">
                ←
              </Text>
            </Box>
          </TouchableOpacity>
        )}
      </Box>

      {/* Center - Title and subtitle */}
      <Box flex={1} alignItems="center" paddingHorizontal="s">
        {title && (
          <Text
            variant="h3"
            color="text"
            textAlign="center"
            numberOfLines={1}
          >
            {title}
          </Text>
        )}
        {subtitle && (
          <Text
            variant="small"
            color="textSecondary"
            textAlign="center"
            numberOfLines={1}
            marginTop="xs"
          >
            {subtitle}
          </Text>
        )}
      </Box>

      {/* Right side - Custom element or spacer */}
      <Box width={40} alignItems="flex-end">
        {rightElement}
      </Box>
    </Box>
  );
};

export default Header;

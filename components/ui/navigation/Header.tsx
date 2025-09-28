import React from 'react';
import { TouchableOpacity } from 'react-native';
import { createRestyleComponent, createVariant, VariantProps } from '@shopify/restyle';
import { Box } from '../primitives/Box';
import { Text } from '../primitives/Text';
import { Theme } from '../foundation/theme';

const headerVariant = createVariant({ themeKey: 'headerVariants' });

const HeaderBox = createRestyleComponent<
  VariantProps<Theme, 'headerVariants'> & React.ComponentProps<typeof Box>,
  Theme
>([headerVariant], Box);

export interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightElement?: React.ReactNode;
  variant?: keyof Theme['headerVariants'];
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBackButton = false,
  onBackPress,
  rightElement,
  variant = 'default',
}) => {
  return (
    <HeaderBox
      variant={variant}
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
              <Text variant="h2" color="text/primary">
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
            color="text/primary"
            textAlign="center"
            numberOfLines={1}
          >
            {title}
          </Text>
        )}
        {subtitle && (
          <Text
            variant="small"
            color="text/secondary"
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
    </HeaderBox>
  );
};

export default Header;

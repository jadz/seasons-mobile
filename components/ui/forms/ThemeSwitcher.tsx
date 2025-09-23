import React from 'react';
import { Box, Text } from '../primitives';
import { Button } from './Button';
import { useAppTheme } from '../foundation/ThemeProvider';

export const ThemeSwitcher: React.FC = () => {
  const { themeMode, setThemeMode, isDark } = useAppTheme();

  return (
    <Box padding="m" backgroundColor="surface" borderRadius="m" marginVertical="s">
      <Text variant="label" marginBottom="s" color="text">
        Theme Settings
      </Text>
      <Text variant="caption" marginBottom="m" color="textMuted">
        Current: {themeMode} {isDark ? '(Dark)' : '(Light)'}
      </Text>
      
      <Box flexDirection="row" flexWrap="wrap" gap="s">
        <Button
          variant={themeMode === 'system' ? 'primary' : 'outline'}
          size="small"
          onPress={() => setThemeMode('system')}
        >
          System
        </Button>
        <Button
          variant={themeMode === 'light' ? 'primary' : 'outline'}
          size="small"
          onPress={() => setThemeMode('light')}
        >
          Light
        </Button>
        <Button
          variant={themeMode === 'dark' ? 'primary' : 'outline'}
          size="small"
          onPress={() => setThemeMode('dark')}
        >
          Dark
        </Button>
      </Box>
    </Box>
  );
};

export default ThemeSwitcher;

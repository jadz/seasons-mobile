import React from 'react';
import { ScrollView } from 'react-native';
import {
  Box,
  Text,
  Card,
  Button,
  TextInput,
  useAppTheme,
  HeroText,
  TitleText,
  H1Text,
  H2Text,
  BodyText,
  CaptionText,
} from '../index';

export const ExampleScreen: React.FC = () => {
  const { isDark, setThemeMode } = useAppTheme();

  return (
    <ScrollView>
      <Box flex={1} backgroundColor="background" padding="l">
        {/* Header */}
        <Box marginBottom="xl">
          <HeroText marginBottom="s">Design System Demo</HeroText>
          <CaptionText>
            This demonstrates the new theme system built with Shopify Restyle
          </CaptionText>
        </Box>

        {/* Theme Toggle */}
        <Card marginBottom="l" variant="elevated">
          <H2Text marginBottom="m">Theme Controls</H2Text>
          <Box flexDirection="row" gap="s">
            <Button
              size="small"
              variant="outline"
              onPress={() => setThemeMode('light')}
            >
              Light
            </Button>
            <Button
              size="small"
              variant="outline"
              onPress={() => setThemeMode('dark')}
            >
              Dark
            </Button>
            <Button
              size="small"
              variant="outline"
              onPress={() => setThemeMode('system')}
            >
              System
            </Button>
          </Box>
          <CaptionText marginTop="s">
            Current theme: {isDark ? 'Dark' : 'Light'}
          </CaptionText>
        </Card>

        {/* Typography Examples */}
        <Card marginBottom="l">
          <H2Text marginBottom="m">Typography</H2Text>
          <Box gap="s">
            <HeroText>Hero Text</HeroText>
            <TitleText>Title Text</TitleText>
            <H1Text>Heading 1</H1Text>
            <H2Text>Heading 2</H2Text>
            <BodyText>Body text for regular content and descriptions</BodyText>
            <CaptionText>Caption text for secondary information</CaptionText>
          </Box>
        </Card>

        {/* Button Examples */}
        <Card marginBottom="l">
          <H2Text marginBottom="m">Buttons</H2Text>
          <Box gap="s">
            <Button>Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="outline">Outline Button</Button>
            <Button variant="ghost">Ghost Button</Button>
            <Button variant="danger">Danger Button</Button>
            
            <Box flexDirection="row" gap="s" marginTop="m">
              <Button size="small">Small</Button>
              <Button size="medium">Medium</Button>
              <Button size="large">Large</Button>
            </Box>
            
            <Button loading>Loading Button</Button>
            <Button disabled>Disabled Button</Button>
          </Box>
        </Card>

        {/* Card Examples */}
        <Card marginBottom="l">
          <H2Text marginBottom="m">Cards</H2Text>
          <Box gap="s">
            <Card variant="default">
              <BodyText>Default Card</BodyText>
            </Card>
            
            <Card variant="elevated">
              <BodyText>Elevated Card</BodyText>
            </Card>
            
            <Card variant="outlined">
              <BodyText>Outlined Card</BodyText>
            </Card>
            
            <Card variant="elevated" onPress={() => console.log('Card pressed')}>
              <BodyText>Pressable Card</BodyText>
              <CaptionText marginTop="xs">Tap me!</CaptionText>
            </Card>
          </Box>
        </Card>

        {/* Form Examples */}
        <Card marginBottom="l">
          <H2Text marginBottom="m">Form Elements</H2Text>
          <Box gap="m">
            <TextInput
              label="Name"
              placeholder="Enter your name"
              variant="outlined"
            />
            
            <TextInput
              label="Email"
              placeholder="Enter your email"
              variant="filled"
              helperText="We'll never share your email"
            />
            
            <TextInput
              label="Password"
              placeholder="Enter password"
              secureTextEntry
              error="Password must be at least 8 characters"
            />
            
            <Box flexDirection="row" gap="s">
              <TextInput
                label="First Name"
                placeholder="First"
                size="small"
                containerProps={{ flex: 1 }}
              />
              <TextInput
                label="Last Name"
                placeholder="Last"
                size="small"
                containerProps={{ flex: 1 }}
              />
            </Box>
          </Box>
        </Card>

        {/* Layout Examples */}
        <Card marginBottom="l">
          <H2Text marginBottom="m">Layout & Spacing</H2Text>
          <Box gap="s">
            <Box flexDirection="row" gap="s">
              <Box flex={1} backgroundColor="primary" padding="m" borderRadius="s">
                <Text color="textInverse">Flex 1</Text>
              </Box>
              <Box flex={2} backgroundColor="secondary" padding="m" borderRadius="s">
                <Text color="textInverse">Flex 2</Text>
              </Box>
            </Box>
            
            <Box backgroundColor="surface" padding="m" borderRadius="m" borderWidth={1} borderColor="border">
              <BodyText>Box with border and custom styling</BodyText>
            </Box>
          </Box>
        </Card>

        {/* Color Examples */}
        <Card marginBottom="xl">
          <H2Text marginBottom="m">Colors</H2Text>
          <Box gap="s">
            <Box flexDirection="row" gap="s">
              <Box flex={1} backgroundColor="primary" padding="s" borderRadius="s">
                <Text color="textInverse" variant="small">Primary</Text>
              </Box>
              <Box flex={1} backgroundColor="secondary" padding="s" borderRadius="s">
                <Text color="textInverse" variant="small">Secondary</Text>
              </Box>
              <Box flex={1} backgroundColor="success" padding="s" borderRadius="s">
                <Text color="textInverse" variant="small">Success</Text>
              </Box>
            </Box>
            
            <Box flexDirection="row" gap="s">
              <Box flex={1} backgroundColor="warning" padding="s" borderRadius="s">
                <Text color="textInverse" variant="small">Warning</Text>
              </Box>
              <Box flex={1} backgroundColor="error" padding="s" borderRadius="s">
                <Text color="textInverse" variant="small">Error</Text>
              </Box>
              <Box flex={1} backgroundColor="info" padding="s" borderRadius="s">
                <Text color="textInverse" variant="small">Info</Text>
              </Box>
            </Box>
          </Box>
        </Card>
      </Box>
    </ScrollView>
  );
};

export default ExampleScreen;


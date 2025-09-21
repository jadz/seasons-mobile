import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import {
  Badge,
  Box,
  Button,
  Card,
  Divider,
  Header,
  Slider,
  Text,
  TextInput,
  ThemeProvider,
} from '../components/ui';

export default function PlaygroundScreen() {
  const [sliderValue, setSliderValue] = useState(50);
  const [textInputValue, setTextInputValue] = useState('');

  return (
    <ThemeProvider>
      <Box flex={1} backgroundColor="background">
        <Header
          title="Component Playground"
          subtitle="All UI Components"
          showBackButton={true}
          onBackPress={() => {
            // Navigation back would go here
            console.log('Back pressed');
          }}
        />
        
        <ScrollView style={{ flex: 1 }}>
          <Box padding="m">
            {/* Typography Section */}
            <Card>
              <Box padding="m">
                <Text variant="h2" marginBottom="m">Typography</Text>
                <Box gap="s">
                  <Text variant="hero">Hero Text</Text>
                  <Text variant="title">Title Text</Text>
                  <Text variant="h1">Heading 1</Text>
                  <Text variant="h2">Heading 2</Text>
                  <Text variant="h3">Heading 3</Text>
                  <Text variant="body">Body text for regular content</Text>
                  <Text variant="bodyMedium">Body Medium text</Text>
                  <Text variant="bodySemiBold">Body SemiBold text</Text>
                  <Text variant="caption">Caption text</Text>
                  <Text variant="small">Small text</Text>
                  <Text variant="label">Label text</Text>
                </Box>
              </Box>
            </Card>
            
            <Divider />
            
            {/* Button Section */}
            <Card>
              <Box padding="m">
                <Text variant="h2" marginBottom="m">Buttons</Text>
                  <Box gap="m">
                    <Box gap="s">
                      <Text variant="label">Primary Buttons</Text>
                      <Box flexDirection="row" gap="s" flexWrap="wrap">
                        <Button variant="primary" size="small">Small</Button>
                        <Button variant="primary" size="medium">Medium</Button>
                        <Button variant="primary" size="large">Large</Button>
                      </Box>
                    </Box>
                    
                    <Box gap="s">
                      <Text variant="label">Button Variants</Text>
                      <Box gap="s">
                        <Button variant="primary">Primary</Button>
                        <Button variant="secondary">Secondary</Button>
                        <Button variant="outline">Outline</Button>
                        <Button variant="ghost">Ghost</Button>
                        <Button variant="danger">Danger</Button>
                      </Box>
                    </Box>
                    
                    <Box gap="s">
                      <Text variant="label">Button States</Text>
                      <Box gap="s">
                        <Button variant="primary" loading>Loading</Button>
                        <Button variant="primary" disabled>Disabled</Button>
                        <Button variant="primary" fullWidth>Full Width</Button>
                      </Box>
                    </Box>
                  </Box>
                </Box>
            </Card>
            
            <Divider />
            
            {/* Badge Section */}
            <Card padding="m">
              <Text variant="h2" marginBottom="m">Badges</Text>
              <Box gap="m">
                <Box gap="s">
                  <Text variant="label">Badge Variants</Text>
                  <Box flexDirection="row" gap="s" flexWrap="wrap">
                    <Badge variant="default">Default</Badge>
                    <Badge variant="success">Success</Badge>
                    <Badge variant="warning">Warning</Badge>
                    <Badge variant="error">Error</Badge>
                    <Badge variant="info">Info</Badge>
                    <Badge variant="outline">Outline</Badge>
                  </Box>
                </Box>
                
                <Box gap="s">
                  <Text variant="label">Badge Sizes</Text>
                  <Box flexDirection="row" gap="s" flexWrap="wrap" alignItems="center">
                    <Badge size="small">Small</Badge>
                    <Badge size="medium">Medium</Badge>
                    <Badge size="large">Large</Badge>
                  </Box>
                </Box>

                <Box gap="s">
                  <Text variant="label">Badge Shapes</Text>
                  <Box flexDirection="row" gap="s" flexWrap="wrap">
                    <Badge shape="square">Square</Badge>
                    <Badge shape="rounded">Rounded</Badge>
                    <Badge shape="pill">Pill</Badge>
                  </Box>
                </Box>
              </Box>
            </Card>
            
            <Divider />

            {/* Form Components Section */}
            <Card padding="m">
              <Text variant="h2" marginBottom="m">Form Components</Text>
              <Box gap="m">
                <Box gap="s">
                  <Text variant="label">Text Inputs</Text>
                  <TextInput
                    label="Default Input"
                    placeholder="Enter text here"
                    value={textInputValue}
                    onChangeText={setTextInputValue}
                  />
                  <TextInput
                    label="Input with Error"
                    placeholder="Enter text here"
                    error="This field is required"
                  />
                  <TextInput
                    label="Input with Helper Text"
                    placeholder="Enter text here"
                    helperText="This is helper text"
                  />
                  <TextInput
                    label="Disabled Input"
                    placeholder="Disabled"
                    editable={false}
                  />
                </Box>

                <Box gap="s">
                  <Text variant="label">Slider</Text>
                  <Slider
                    value={sliderValue}
                    onValueChange={setSliderValue}
                    minimumValue={0}
                    maximumValue={100}
                    step={1}
                    showValue={true}
                    formatValue={(val) => `${val}%`}
                  />
                  <Slider
                    value={25}
                    minimumValue={0}
                    maximumValue={100}
                    disabled={true}
                    showValue={true}
                    formatValue={(val) => `${val}% (Disabled)`}
                  />
                </Box>
              </Box>
            </Card>

            <Divider />

            {/* Card Section */}
            <Card padding="m">
              <Text variant="h2" marginBottom="m">Cards</Text>
              <Box gap="m">
                <Box gap="s">
                  <Text variant="label">Card Variants</Text>
                  <Card variant="default" padding="m">
                    <Text>Default Card</Text>
                  </Card>
                  <Card variant="elevated" padding="m">
                    <Text>Elevated Card</Text>
                  </Card>
                  <Card variant="outlined" padding="m">
                    <Text>Outlined Card</Text>
                  </Card>
                </Box>

                <Box gap="s">
                  <Text variant="label">Interactive Card</Text>
                  <Card 
                    variant="elevated" 
                    padding="m"
                    onPress={() => console.log('Card pressed')}
                  >
                    <Text variant="h3">Pressable Card</Text>
                    <Text variant="caption" marginTop="xs">Tap me!</Text>
                  </Card>
                </Box>
              </Box>
            </Card>

            <Divider />
            {/* Layout Section */}
            <Card padding="m">
              <Text variant="h2" marginBottom="m">Layout Components</Text>
              <Box gap="m">
                <Box gap="s">
                  <Text variant="label">Dividers</Text>
                  <Text>Content above</Text>
                  <Divider />
                  <Text>Content below</Text>
                  <Divider color="primary" thickness={2} />
                  <Text>Thick colored divider above</Text>
                </Box>

                <Box gap="s">
                  <Text variant="label">Box Layout</Text>
                  <Box 
                    backgroundColor="primary" 
                    padding="m" 
                    borderRadius="l"
                    alignItems="center"
                  >
                    <Text color="textInverse">Styled Box Component</Text>
                  </Box>
                </Box>
              </Box>
            </Card>
          </Box>
        </ScrollView>
      </Box>
    </ThemeProvider>
  );
}

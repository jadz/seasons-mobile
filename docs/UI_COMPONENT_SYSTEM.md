# UI Component System Documentation

## Overview

This document provides comprehensive guidance for using and extending the base UI component system built with Shopify Restyle. This system ensures consistent design patterns, reusable components, and maintainable code across the application.

## Table of Contents

1. [Architecture](#architecture)
2. [Theme System](#theme-system)
3. [Base Components](#base-components)
4. [Component Playground](#component-playground)
5. [Development Guidelines](#development-guidelines)
6. [Troubleshooting](#troubleshooting)
7. [Best Practices](#best-practices)

## Architecture

### Technology Stack
- **Shopify Restyle**: Theme-based styling system
- **React Native**: Mobile framework
- **TypeScript**: Type safety and developer experience
- **Expo Router**: File-based routing

### File Structure
```
components/ui/
├── theme.ts              # Theme configuration and types
├── ThemeProvider.tsx     # Theme context provider
├── index.ts             # Component exports
├── Box.tsx              # Layout primitive
├── Text.tsx             # Typography component
├── Button.tsx           # Button component
├── Card.tsx             # Container component
├── Header.tsx           # Navigation header
├── Divider.tsx          # Visual separator
├── Badge.tsx            # Status indicator
├── Slider.tsx           # Range input
├── TextInput.tsx        # Form input
└── playground/          # Component showcase
```

## Theme System

### Core Concepts

The theme system is built on Shopify Restyle and provides:
- **Consistent spacing** using a scale-based system
- **Typography variants** for different text styles
- **Color palette** with semantic naming
- **Component variants** for different use cases

### Theme Configuration

```typescript
// components/ui/theme.ts
const textVariants = {
  defaults: {           // Required by Shopify Restyle
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: -0.2,
    lineHeight: 22,
  },
  hero: { fontSize: 32, fontWeight: '300' },
  title: { fontSize: 28, fontWeight: '400' },
  h1: { fontSize: 24, fontWeight: '400' },
  h2: { fontSize: 20, fontWeight: '400' },
  h3: { fontSize: 18, fontWeight: '400' },
  body: { fontSize: 16, fontWeight: '400' },
  caption: { fontSize: 15, fontWeight: '400' },
  small: { fontSize: 13, fontWeight: '400' },
  label: { fontSize: 14, fontWeight: '500' },
  button: { fontSize: 16, fontWeight: '600' },
};
```

### Important Theme Rules

1. **Always include `defaults` in textVariants** - Required by Shopify Restyle
2. **Exclude `defaults` from public types** - Use `ThemeTextVariants` type
3. **Use semantic color names** - `primary`, `surface`, `text`, not hex values
4. **Follow spacing scale** - `xs`, `s`, `m`, `l`, `xl`, `xxl`, `xxxl`

### Type Safety

```typescript
export type ThemeTextVariants = Exclude<keyof Theme['textVariants'], 'defaults'>;
export type ThemeColors = keyof Theme['colors'];
export type ThemeSpacing = keyof Theme['spacing'];
```

## Base Components

### Box Component

**Purpose**: Layout primitive for spacing, positioning, and basic styling.

```typescript
import { Box } from '../components/ui';

// Basic usage
<Box padding="m" backgroundColor="surface">
  <Text>Content</Text>
</Box>

// Advanced layout
<Box 
  flexDirection="row" 
  justifyContent="space-between"
  alignItems="center"
  paddingHorizontal="l"
  marginVertical="s"
>
  <Text>Left content</Text>
  <Text>Right content</Text>
</Box>
```

**Key Props**:
- Layout: `flex`, `flexDirection`, `justifyContent`, `alignItems`
- Spacing: `padding`, `margin` (with directional variants)
- Styling: `backgroundColor`, `borderRadius`, `borderWidth`
- Positioning: `position`, `top`, `left`, `right`, `bottom`

### Text Component

**Purpose**: Typography with consistent styling and semantic variants.

```typescript
import { Text } from '../components/ui';

// Using variants
<Text variant="hero">Hero Text</Text>
<Text variant="h1">Heading</Text>
<Text variant="body">Body text</Text>
<Text variant="caption" color="textSecondary">Caption</Text>

// Custom styling
<Text variant="body" color="primary" textAlign="center">
  Centered primary text
</Text>
```

**Available Variants**:
- `hero` - Large display text (32px)
- `title` - Page titles (28px)
- `h1`, `h2`, `h3` - Headings (24px, 20px, 18px)
- `body` - Regular content (16px)
- `caption` - Secondary text (15px)
- `small` - Fine print (13px)
- `label` - Form labels (14px)
- `button` - Button text (16px, semibold)

### Button Component

**Purpose**: Interactive elements with consistent styling and states.

```typescript
import { Button } from '../components/ui';

// Basic usage
<Button variant="primary" onPress={handlePress}>
  Primary Action
</Button>

// With variants and sizes
<Button variant="secondary" size="large">Secondary</Button>
<Button variant="outline" size="small">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Delete</Button>

// With states
<Button loading>Loading...</Button>
<Button disabled>Disabled</Button>
<Button fullWidth>Full Width</Button>

// With icons
<Button leftIcon={<Icon name="plus" />}>Add Item</Button>
```

**Variants**:
- `primary` - Main actions (filled, primary color)
- `secondary` - Secondary actions (filled, surface color)
- `outline` - Outlined buttons
- `ghost` - Text-only buttons
- `danger` - Destructive actions

**Sizes**: `small`, `medium`, `large`

### Card Component

**Purpose**: Container for grouping related content with consistent styling.

```typescript
import { Card } from '../components/ui';

// Basic usage
<Card padding="l">
  <Text variant="h3">Card Title</Text>
  <Text variant="body">Card content</Text>
</Card>

// Interactive card
<Card variant="elevated" onPress={handlePress}>
  <Text>Pressable card</Text>
</Card>

// Different variants
<Card variant="default">Default card</Card>
<Card variant="elevated">Elevated with shadow</Card>
<Card variant="outlined">Outlined card</Card>
```

**Variants**:
- `default` - Basic card with subtle shadow
- `elevated` - Card with prominent shadow
- `outlined` - Card with border, no shadow

### Header Component

**Purpose**: Navigation headers with consistent layout and functionality.

```typescript
import { Header } from '../components/ui';

// Basic usage
<Header 
  title="Screen Title"
  subtitle="Step 1 of 5"
  showBackButton
  onBackPress={() => router.back()}
/>

// With custom right element
<Header 
  title="Settings"
  rightElement={
    <Button variant="ghost" size="small">
      Save
    </Button>
  }
/>

// Different variants
<Header variant="transparent" title="Overlay Header" />
<Header variant="elevated" title="Prominent Header" />
```

**Props**:
- `title` - Main header text
- `subtitle` - Secondary text below title
- `showBackButton` - Show/hide back button
- `onBackPress` - Back button handler
- `rightElement` - Custom right-side content
- `variant` - `default`, `transparent`, `elevated`

### Badge Component

**Purpose**: Status indicators and labels with semantic colors.

```typescript
import { Badge } from '../components/ui';

// Status badges
<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="error">Failed</Badge>
<Badge variant="info">New</Badge>

// Different sizes and shapes
<Badge size="small">Small</Badge>
<Badge size="large" shape="pill">Large Pill</Badge>
<Badge shape="square">Square</Badge>
```

**Variants**: `default`, `success`, `warning`, `error`, `info`, `outline`
**Sizes**: `small`, `medium`, `large`
**Shapes**: `rounded`, `pill`, `square`

### Divider Component

**Purpose**: Visual separation between content sections.

```typescript
import { Divider } from '../components/ui';

// Basic usage
<Divider />

// Customized
<Divider color="primary" thickness={2} />
<Divider orientation="vertical" length={100} />
```

**Props**:
- `orientation` - `horizontal` (default) or `vertical`
- `thickness` - Line thickness in pixels
- `color` - Theme color key
- `length` - Length (width for horizontal, height for vertical)

### Slider Component

**Purpose**: Range input for selecting numeric values.

```typescript
import { Slider } from '../components/ui';

const [value, setValue] = useState(50);

<Slider
  value={value}
  onValueChange={setValue}
  minimumValue={0}
  maximumValue={100}
  step={1}
  showValue
  formatValue={(val) => `${val}%`}
/>

// Disabled state
<Slider value={25} disabled showValue />
```

**Props**:
- `value` - Current value
- `onValueChange` - Value change handler
- `minimumValue`, `maximumValue` - Range limits
- `step` - Value increment
- `showValue` - Display current value
- `formatValue` - Custom value formatting
- `disabled` - Disable interaction

### TextInput Component

**Purpose**: Form input with consistent styling and validation states.

```typescript
import { TextInput } from '../components/ui';

// Basic usage
<TextInput
  label="Email"
  placeholder="Enter your email"
  value={email}
  onChangeText={setEmail}
/>

// With validation
<TextInput
  label="Password"
  error="Password is required"
  secureTextEntry
/>

// With helper text
<TextInput
  label="Username"
  helperText="Must be unique"
  leftIcon={<Icon name="user" />}
/>
```

**Props**:
- `label` - Input label
- `error` - Error message (shows error state)
- `helperText` - Helper text below input
- `variant` - `default`, `outlined`, `filled`
- `leftIcon`, `rightIcon` - Icon elements

## Component Playground

### Accessing the Playground

Navigate to `/playground` in your app to see all components in action.

### Playground Features

- **Live examples** of all components
- **Interactive elements** you can test
- **All variants and states** displayed
- **Organized by category** for easy browsing

### Using the Playground

1. **Development**: Test components during development
2. **Design review**: Show stakeholders component options
3. **Documentation**: Reference for available components
4. **Debugging**: Isolate component issues

## Development Guidelines

### Creating New Components

1. **Follow the pattern**:
```typescript
import React from 'react';
import { Box } from './Box';
import { Text } from './Text';
import { Theme } from './theme';

export interface MyComponentProps {
  // Define props with clear types
}

export const MyComponent: React.FC<MyComponentProps> = ({
  // Destructure props with defaults
}) => {
  // Component logic
  
  return (
    <Box>
      {/* Component JSX */}
    </Box>
  );
};

export default MyComponent;
```

2. **Add to exports**:
```typescript
// components/ui/index.ts
export { default as MyComponent } from './MyComponent';
```

3. **Add to playground**:
```typescript
// app/playground.tsx
import { MyComponent } from '../components/ui';

// Add examples in appropriate section
<MyComponent variant="default">Example</MyComponent>
```

### Theme Integration

1. **Use theme types**:
```typescript
import { Theme, ThemeColors, ThemeSpacing } from './theme';

// For colors
backgroundColor: 'primary' as ThemeColors

// For spacing  
padding: 'm' as keyof Theme['spacing']

// For text variants (exclude defaults)
variant: 'body' as ThemeTextVariants
```

2. **Avoid hardcoded values**:
```typescript
// ❌ Don't do this
<Box style={{ backgroundColor: '#334C4E', padding: 16 }}>

// ✅ Do this
<Box backgroundColor="primary" padding="m">
```

### Component Variants

1. **Use discriminated unions**:
```typescript
interface ComponentProps {
  variant?: 'default' | 'primary' | 'secondary';
}
```

2. **Implement variant logic**:
```typescript
const getVariantStyles = () => {
  switch (variant) {
    case 'primary':
      return { backgroundColor: 'primary', textColor: 'textInverse' };
    case 'secondary':
      return { backgroundColor: 'secondary', textColor: 'text' };
    default:
      return { backgroundColor: 'surface', textColor: 'text' };
  }
};
```

## Troubleshooting

### Common Issues

#### 1. "Value 'defaults' does not exist in theme['textVariants']"

**Cause**: Missing `defaults` in textVariants or using `defaults` as a variant.

**Solution**:
```typescript
// ✅ Include defaults in theme
const textVariants = {
  defaults: { fontSize: 16, fontWeight: '400' },
  // ... other variants
};

// ✅ Use ThemeTextVariants type (excludes defaults)
textVariant: 'body' as ThemeTextVariants
```

#### 2. Shadow props not working

**Cause**: Using `shadow` as single prop instead of individual properties.

**Solution**:
```typescript
// ❌ Don't do this
<Box shadow="md">

// ✅ Do this
<Box
  shadowColor="black"
  shadowOffset={{ width: 0, height: 2 }}
  shadowOpacity={0.1}
  shadowRadius={4}
  elevation={2}
>
```

#### 3. Invalid theme color references

**Cause**: Using colors not defined in theme.

**Solution**:
```typescript
// ❌ Don't do this
<Box backgroundColor="selected">

// ✅ Do this
<Box backgroundColor="surface">
```

#### 4. TypeScript errors with theme types

**Cause**: Using wrong theme types or missing type imports.

**Solution**:
```typescript
// ✅ Import correct types
import { Theme, ThemeColors, ThemeTextVariants } from './theme';

// ✅ Use correct type assertions
backgroundColor: 'primary' as ThemeColors
variant: 'body' as ThemeTextVariants
```

### Debugging Steps

1. **Check theme configuration** - Ensure all required properties exist
2. **Verify imports** - Make sure components are imported correctly
3. **Use playground** - Test components in isolation
4. **Check TypeScript errors** - Fix type issues first
5. **Restart development server** - Clear any cached issues

## Best Practices

### Design System

1. **Consistency first** - Use existing components before creating new ones
2. **Semantic naming** - Use meaningful prop and variant names
3. **Composability** - Build complex UIs from simple components
4. **Accessibility** - Include proper labels and interaction states

### Code Quality

1. **Type safety** - Use TypeScript interfaces for all props
2. **Default values** - Provide sensible defaults for optional props
3. **Error handling** - Handle edge cases gracefully
4. **Performance** - Avoid unnecessary re-renders

### Component Design

1. **Single responsibility** - Each component should have one clear purpose
2. **Flexible props** - Allow customization without breaking consistency
3. **Variant system** - Use variants for different styles, not separate components
4. **Composition over inheritance** - Build complex components from simple ones

### Testing

1. **Use playground** - Test all variants and states
2. **Edge cases** - Test with empty, long, and edge case content
3. **Responsive design** - Test on different screen sizes
4. **Accessibility** - Test with screen readers and keyboard navigation

### Documentation

1. **Clear examples** - Show common use cases
2. **Prop documentation** - Explain what each prop does
3. **Variant showcase** - Show all available variants
4. **Migration guides** - Help when making breaking changes

## Conclusion

This component system provides a solid foundation for building consistent, maintainable UIs. By following these guidelines and using the playground for testing, you can create high-quality components that work well together and provide a great user experience.

For questions or contributions, refer to the playground examples and follow the established patterns. When in doubt, prioritize consistency with existing components over novel approaches.

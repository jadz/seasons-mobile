# Theme System & UI Components

This is a comprehensive theme system built with [Shopify Restyle](https://github.com/Shopify/restyle) that provides a consistent, maintainable, and flexible foundation for building React Native UIs.

## Features

- 🎨 **Comprehensive Theme System**: Colors, typography, spacing, shadows, and more
- 🌙 **Dark Mode Support**: Automatic light/dark theme switching
- 📱 **Responsive Design**: Built-in breakpoints and responsive utilities  
- 🧩 **Reusable Components**: Pre-built components following design system patterns
- 💪 **Type Safety**: Full TypeScript support with theme-aware props
- 🎯 **Performance Optimized**: Minimal re-renders with optimized theme context

## Quick Start

### 1. Wrap your app with ThemeProvider

```tsx
import { ThemeProvider } from './components/ui';

export default function App() {
  return (
    <ThemeProvider>
      {/* Your app components */}
    </ThemeProvider>
  );
}
```

### 2. Use the pre-built components

```tsx
import { Box, Text, Button, Card } from './components/ui';

export const MyScreen = () => (
  <Box flex={1} backgroundColor="background" padding="l">
    <Card>
      <Text variant="h1" marginBottom="m">Welcome!</Text>
      <Text variant="body" color="textSecondary">
        This is built with our design system
      </Text>
      <Button marginTop="l">Get Started</Button>
    </Card>
  </Box>
);
```

## Core Components

### Box
The foundational layout component with comprehensive styling props:

```tsx
<Box 
  backgroundColor="surface"
  padding="m"
  borderRadius="l"
  shadow="md"
  flexDirection="row"
  alignItems="center"
>
  {/* Content */}
</Box>
```

**Available Props:**
- Layout: `flex`, `flexDirection`, `alignItems`, `justifyContent`, `width`, `height`, etc.
- Spacing: `margin`, `padding`, `marginTop`, `paddingHorizontal`, etc.
- Colors: `backgroundColor`, `borderColor`
- Borders: `borderWidth`, `borderRadius`, `borderTopWidth`, etc.
- Shadows: `shadow` (sm, md, lg, xl)
- Position: `position`, `top`, `left`, `zIndex`, etc.

### Text
Typography component with built-in variants:

```tsx
<Text variant="h1" color="text">Heading</Text>
<Text variant="body" color="textSecondary">Body text</Text>

{/* Convenience components */}
<HeroText>Hero Text</HeroText>
<TitleText>Title Text</TitleText>
<BodyText>Regular body text</BodyText>
<CaptionText>Caption text</CaptionText>
```

**Typography Variants:**
- `hero` - Large display text (32px)
- `title` - Page titles (28px)  
- `h1`, `h2`, `h3` - Section headings (24px, 20px, 18px)
- `body` - Regular content (16px)
- `caption` - Secondary text (15px)
- `small` - Small text (13px)
- `label` - Form labels (14px)
- `button` - Button text (16px, semibold)

### Button
Flexible button component with multiple variants and sizes:

```tsx
<Button variant="primary">Primary Button</Button>
<Button variant="secondary">Secondary Button</Button>
<Button variant="outline">Outline Button</Button>
<Button variant="ghost">Ghost Button</Button>
<Button variant="danger">Danger Button</Button>

{/* Sizes */}
<Button size="small">Small</Button>
<Button size="large">Large Button</Button>

{/* States */}
<Button loading>Loading...</Button>
<Button disabled>Disabled</Button>
<Button fullWidth>Full Width</Button>
```

### Card
Container component with elevation and border variants:

```tsx
<Card variant="default">Default card</Card>
<Card variant="elevated">Elevated card with shadow</Card>
<Card variant="outlined">Outlined card with border</Card>

{/* Pressable card */}
<Card onPress={() => handlePress()}>
  <Text>Tap me!</Text>
</Card>
```

### TextInput
Form input component with labels, validation, and icons:

```tsx
<TextInput
  label="Email"
  placeholder="Enter your email"
  variant="outlined"
  helperText="We'll never share your email"
/>

<TextInput
  label="Password"
  placeholder="Enter password"
  secureTextEntry
  error="Password is required"
/>

{/* With icons */}
<TextInput
  label="Search"
  placeholder="Search..."
  leftIcon={<SearchIcon />}
  rightIcon={<ClearIcon />}
/>
```

## Theme Structure

### Colors
The theme includes semantic color names that automatically adapt to light/dark modes:

```tsx
// Primary colors
backgroundColor="primary"      // Main brand color
backgroundColor="secondary"    // Secondary brand color

// Text colors
color="text"                  // Primary text
color="textSecondary"         // Secondary text
color="textMuted"             // Muted/disabled text
color="textInverse"           // Text on dark backgrounds

// Surfaces
backgroundColor="background"   // Main app background
backgroundColor="surface"      // Card/modal backgrounds
backgroundColor="card"         // Card backgrounds

// Semantic colors
backgroundColor="success"      // Success states
backgroundColor="warning"      // Warning states
backgroundColor="error"        // Error states
backgroundColor="info"         // Info states

// Borders
borderColor="border"          // Default borders
borderColor="borderLight"     // Light borders
borderColor="borderDark"      // Dark borders
```

### Spacing
Consistent spacing scale using t-shirt sizes:

```tsx
padding="xs"    // 4px
padding="s"     // 8px  
padding="m"     // 16px
padding="l"     // 24px
padding="xl"    // 32px
padding="xxl"   // 40px
padding="xxxl"  // 48px
```

### Border Radius
Consistent border radius scale:

```tsx
borderRadius="xs"    // 4px
borderRadius="s"     // 8px
borderRadius="m"     // 12px
borderRadius="l"     // 16px
borderRadius="xl"    // 20px
borderRadius="round" // 50px (fully rounded)
```

### Shadows
Pre-defined shadow variants:

```tsx
shadow="sm"    // Subtle shadow
shadow="md"    // Medium shadow (default for cards)
shadow="lg"    // Large shadow
shadow="xl"    // Extra large shadow
shadow="none"  // No shadow
```

## Advanced Usage

### Theme Context
Access theme values and controls:

```tsx
import { useAppTheme } from './components/ui';

const MyComponent = () => {
  const { theme, isDark, setThemeMode } = useAppTheme();
  
  return (
    <Button onPress={() => setThemeMode(isDark ? 'light' : 'dark')}>
      Toggle Theme
    </Button>
  );
};
```

### Custom Components
Create theme-aware custom components:

```tsx
import { createRestyleComponent, LayoutProps, SpacingProps } from '@shopify/restyle';
import { Theme } from './theme';

type CustomComponentProps = LayoutProps<Theme> & SpacingProps<Theme> & {
  children: React.ReactNode;
};

const CustomComponent = createRestyleComponent<CustomComponentProps, Theme>([
  'layout',
  'spacing',
]);
```

### Responsive Design
Use breakpoints for responsive behavior:

```tsx
<Box 
  width={{ phone: '100%', tablet: '50%' }}
  padding={{ phone: 'm', tablet: 'l' }}
>
  Responsive content
</Box>
```

## Migration Guide

### From StyleSheet to Theme System

**Before:**
```tsx
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
});
```

**After:**
```tsx
<Card shadow="md">
  <Text variant="h1" marginBottom="m">
    Title
  </Text>
</Card>
```

### Benefits of Migration
- ✅ **Consistent spacing**: No more arbitrary pixel values
- ✅ **Automatic dark mode**: Colors adapt automatically
- ✅ **Better maintainability**: Change theme once, update everywhere
- ✅ **Type safety**: Catch design token errors at compile time
- ✅ **Smaller bundle**: Shared theme objects vs individual StyleSheets

## Best Practices

1. **Use semantic color names**: Prefer `color="text"` over `color="midnight"`
2. **Follow spacing scale**: Use theme spacing values instead of arbitrary numbers
3. **Leverage variants**: Use text and component variants for consistency
4. **Compose with Box**: Build complex layouts by composing Box components
5. **Theme-first approach**: Define styles in theme, not in components
6. **Test both themes**: Always verify components work in light and dark modes

## Examples

See `components/ui/examples/ExampleScreen.tsx` for a comprehensive demonstration of all components and patterns.


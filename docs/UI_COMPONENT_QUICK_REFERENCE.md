# UI Component Quick Reference

## Import Statement
```typescript
import { 
  Box, Text, Button, Card, Header, Badge, 
  Divider, Slider, TextInput, ThemeProvider 
} from '../components/ui';
```

## Theme Types
```typescript
import { Theme, ThemeColors, ThemeTextVariants, ThemeSpacing } from '../components/ui/theme';
```

## Common Patterns

### Layout with Box
```typescript
<Box padding="m" backgroundColor="bg/surface" borderRadius="s">
  <Box flexDirection="row" justifyContent="space-between" alignItems="center">
    <Text variant="h3">Title</Text>
    <Badge variant="success">Active</Badge>
  </Box>
  <Divider marginVertical="s" />
  <Text variant="body">Content goes here</Text>
</Box>
```

### Form Section
```typescript
<Card padding="l">
  <Text variant="h2" marginBottom="m">Form Title</Text>
  <TextInput
    label="Email"
    placeholder="Enter email"
    value={email}
    onChangeText={setEmail}
    error={emailError}
  />
  <Box marginTop="l">
    <Button variant="primary" fullWidth onPress={handleSubmit}>
      Submit
    </Button>
  </Box>
</Card>
```

### Screen Header
```typescript
<Header
  title="Screen Title"
  subtitle="Step 1 of 5"
  showBackButton
  onBackPress={() => router.back()}
  rightElement={<Button variant="ghost">Skip</Button>}
/>
```

## Component Props Quick Reference

### Box
- **Layout**: `flex`, `flexDirection`, `justifyContent`, `alignItems`
- **Spacing**: `padding`, `margin`, `paddingHorizontal`, `marginVertical`
- **Styling**: `backgroundColor`, `borderRadius`, `borderWidth`, `borderColor`

### Text
- **Variants**: `hero`, `title`, `h1`, `h2`, `h3`, `body`, `caption`, `small`, `label`, `button`
- **Colors**: `text`, `textSecondary`, `textMuted`, `textInverse`, `primary`, `error`
- **Alignment**: `textAlign="center|left|right"`

### Button
- **Variants**: `primary`, `secondary`, `outline`, `ghost`, `danger`
- **Sizes**: `small`, `medium`, `large`
- **States**: `loading`, `disabled`, `fullWidth`
- **Icons**: `leftIcon`, `rightIcon`

### Card
- **Variants**: `default`, `elevated`, `outlined`
- **Interactive**: `onPress` (makes it pressable)
- **Styling**: All Box props available

### Badge
- **Variants**: `default`, `success`, `warning`, `error`, `info`, `outline`
- **Sizes**: `small`, `medium`, `large`
- **Shapes**: `rounded`, `pill`, `square`

### Header
- **Content**: `title`, `subtitle`, `rightElement`
- **Navigation**: `showBackButton`, `onBackPress`
- **Variants**: `default`, `transparent`, `elevated`

### Slider
- **Value**: `value`, `onValueChange`
- **Range**: `minimumValue`, `maximumValue`, `step`
- **Display**: `showValue`, `formatValue`
- **State**: `disabled`

### TextInput
- **Content**: `label`, `placeholder`, `value`, `onChangeText`
- **Validation**: `error`, `helperText`
- **Variants**: `default`, `outlined`, `filled`
- **Icons**: `leftIcon`, `rightIcon`

## Theme Values

### Colors
```typescript
// Primary colors
'primary', 'primaryLight', 'primaryDark'

// Background colors  
'background', 'surface', 'card'

// Text colors
'text', 'textSecondary', 'textMuted', 'textInverse'

// Semantic colors
'success', 'warning', 'error', 'info'
'successBackground', 'warningBackground', 'errorBackground', 'infoBackground'

// Utility
'transparent', 'white', 'black', 'border'
```

### Spacing
```typescript
'xs'    // 4px
's'     // 8px  
'm'     // 16px
'l'     // 24px
'xl'    // 32px
'xxl'   // 40px
'xxxl'  // 48px
```

### Text Variants
```typescript
'hero'        // 32px, light
'title'       // 28px
'h1'          // 24px
'h2'          // 20px  
'h3'          // 18px
'body'        // 16px
'caption'     // 15px
'small'       // 13px
'label'       // 14px, medium
'button'      // 16px, semibold
```

### Border Radius
```typescript
'xs'     // 4px
's'      // 8px
'm'      // 12px
'l'      // 16px
'xl'     // 20px
'round'  // 50px (circular)
```

## Common Mistakes to Avoid

### ❌ Don't Do This
```typescript
// Hardcoded values
<Box style={{ backgroundColor: '#334C4E', padding: 16 }}>

// Using 'defaults' as variant
<Text variant="defaults">Text</Text>

// Wrong theme color
<Box backgroundColor="selected">

// Single shadow prop
<Box shadow="md">
```

### ✅ Do This Instead
```typescript
// Use theme values
<Box backgroundcolor="brand/primary" padding="m">

// Use proper text variant
<Text variant="body">Text</Text>

// Use valid theme color
<Box backgroundColor="bg/surface">

// Use individual shadow props
<Box
  shadowcolor="bg/raised"
  shadowOffset={{ width: 0, height: 2 }}
  shadowOpacity={0.1}
  shadowRadius={4}
  elevation={2}
>
```

## Playground Access

Navigate to `/playground` to see all components with live examples.

## Need Help?

1. Check the playground for examples
2. Refer to `docs/UI_COMPONENT_SYSTEM.md` for detailed documentation
3. Look at existing component usage in the codebase
4. Follow the established patterns and conventions

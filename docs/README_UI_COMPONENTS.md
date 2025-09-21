# UI Component System

A comprehensive, theme-based component system built with Shopify Restyle for consistent, maintainable React Native applications.

## 🚀 Quick Start

### 1. Import Components
```typescript
import { 
  Box, Text, Button, Card, Header, Badge, 
  Divider, Slider, TextInput, WizardBar, SelectionCard 
} from '../components/ui';
```

### 2. Use Components
```typescript
<Card>
  <Box padding="l">
    <Header title="Welcome" showBackButton />
    <Text variant="body">Hello World!</Text>
    <Button variant="primary" onPress={handlePress}>
      Get Started
    </Button>
  </Box>
</Card>
```

### 3. View Examples
Navigate to `/playground` in your app to see all components in action.

## 📚 Documentation

| Document | Purpose | Audience |
|----------|---------|----------|
| **[UI_COMPONENT_SYSTEM.md](./UI_COMPONENT_SYSTEM.md)** | Complete documentation with examples | All developers |
| **[UI_COMPONENT_QUICK_REFERENCE.md](./UI_COMPONENT_QUICK_REFERENCE.md)** | Cheat sheet for common patterns | Daily development |
| **[UI_COMPONENT_TROUBLESHOOTING.md](./UI_COMPONENT_TROUBLESHOOTING.md)** | Error solutions and debugging | LLMs & junior developers |

## 🎨 Component Architecture

The UI components are organized into logical categories for better maintainability and discoverability:

```
components/ui/
├── foundation/           # Core theming and foundational elements
│   ├── theme.ts         # Theme configuration
│   ├── ThemeProvider.tsx # Theme context
│   └── index.ts         # Foundation exports
├── primitives/          # Basic building blocks
│   ├── Box.tsx          # Layout primitive
│   ├── Text.tsx         # Typography
│   ├── Divider.tsx      # Visual separators
│   └── index.ts         # Primitive exports
├── forms/               # Interactive form elements
│   ├── Button.tsx       # Action buttons
│   ├── TextInput.tsx    # Text inputs
│   ├── Slider.tsx       # Range inputs
│   └── index.ts         # Form exports
├── display/             # Data display components
│   ├── Badge.tsx        # Status indicators
│   ├── Card.tsx         # Content containers
│   └── index.ts         # Display exports
├── navigation/          # Navigation and progress
│   ├── Header.tsx       # Navigation headers
│   ├── WizardBar.tsx    # Progress bars
│   ├── WizardDots.tsx   # Progress dots
│   └── index.ts         # Navigation exports
├── selection/           # Selection and list components
│   ├── SelectionCard.tsx     # Generic selection cards
│   ├── SelectionList.tsx     # Selection lists
│   ├── PillarSelectionCard.tsx # Legacy (deprecated)
│   └── index.ts         # Selection exports
├── domain/              # Business-specific components
│   ├── MetricGoalCard.tsx # Domain-specific cards
│   └── index.ts         # Domain exports
├── examples/            # Documentation and examples
│   ├── ExampleScreen.tsx
│   └── OnboardingFormRefactored.tsx
└── index.ts            # Main export file
```

## 🎯 Component Categories

### Foundation Layer
Core theming and foundational elements that everything else builds upon.
- **Theme Configuration**: Colors, spacing, typography, shadows
- **Theme Provider**: Context and theme switching capabilities

### Primitives
Basic building blocks - layout primitives and typography that form the base of other components.
- **Box**: Layout primitive with spacing and styling
- **Text**: Typography with semantic variants
- **Divider**: Visual separation between sections

### Forms
Interactive form elements and input controls.
- **Button**: Actions with multiple variants and states
- **TextInput**: Form inputs with validation states
- **Slider**: Range input for numeric values

### Display
Components for displaying information and data.
- **Badge**: Status indicators and labels
- **Card**: Container for grouping content

### Navigation
Navigation elements and progress indicators.
- **Header**: Navigation headers with back buttons
- **WizardBar**: Rectangular progress indicators
- **WizardDots**: Circular progress indicators

### Selection
Components for making selections and displaying lists.
- **SelectionCard**: Generic selection cards (radio/checkbox style)
- **SelectionList**: Lists with selection capabilities
- **PillarSelectionCard**: Legacy component (use SelectionCard instead)

### Domain
Business logic specific components that combine primitives for specific use cases.
- **MetricGoalCard**: Specialized cards for metric goals

## 🛠️ Import Patterns

### Individual Category Imports
```typescript
// Import from specific categories
import { Box, Text } from '../components/ui/primitives';
import { Button, TextInput } from '../components/ui/forms';
import { Badge, Card } from '../components/ui/display';
```

### Main Index Import (Recommended)
```typescript
// Import from main index (recommended for most use cases)
import { 
  Box, Text, Button, Card, Header, Badge,
  WizardBar, SelectionCard, MetricGoalCard 
} from '../components/ui';
```

## 🎮 Component Playground

The playground (`/playground`) provides:
- **Live examples** of all components
- **Interactive testing** of component behavior
- **All variants and states** in one place
- **Copy-paste ready** code examples

Perfect for:
- 🔍 **Exploring** available components
- 🧪 **Testing** component behavior
- 📖 **Learning** component APIs
- 🐛 **Debugging** component issues

## 🚨 Migration from Flat Structure

If you're migrating from the previous flat structure:

### Old Import Pattern
```typescript
// ❌ Old flat structure imports
import { Box } from '../components/ui/Box';
import { Text } from '../components/ui/Text';
import { Button } from '../components/ui/Button';
```

### New Import Pattern
```typescript
// ✅ New organized structure imports
import { Box, Text, Button } from '../components/ui';
// OR category-specific imports
import { Box, Text } from '../components/ui/primitives';
import { Button } from '../components/ui/forms';
```

## 🎨 Theme Values Reference

### Colors
```typescript
'primary', 'primaryLight', 'primaryDark'     // Brand colors
'background', 'surface', 'card'              // Backgrounds
'text', 'textSecondary', 'textMuted'         // Text colors
'success', 'warning', 'error', 'info'        // Semantic colors
```

### Spacing
```typescript
'xs'(4px), 's'(8px), 'm'(16px), 'l'(24px), 'xl'(32px)
```

### Typography
```typescript
'hero'(32px), 'title'(28px), 'h1'(24px), 'h2'(20px), 'h3'(18px)
'body'(16px), 'caption'(15px), 'small'(13px), 'label'(14px)
```

## 🤝 Contributing

1. **Follow the organized structure** - place components in appropriate categories
2. **Use the playground** to test new components
3. **Update documentation** when adding features
4. **Maintain consistency** with the design system
5. **Test thoroughly** across different screen sizes

### Adding New Components

1. **Determine the appropriate category** (primitives, forms, display, etc.)
2. **Create the component** in the correct subdirectory
3. **Add to the category's index.ts** file
4. **Update the main index.ts** if needed
5. **Add examples** to the playground
6. **Test imports** work correctly

## 📞 Support

- **Check the playground** for working examples
- **Review troubleshooting guide** for common issues
- **Follow established patterns** in existing components
- **Refer to documentation** for detailed guidance

## 🔧 Common Patterns

### Card Usage
Cards are containers that don't accept padding directly. Use Box for internal spacing:

```typescript
// ✅ Correct - Use Box for padding inside Card
<Card variant="elevated">
  <Box padding="l">
    <Text variant="h3">Card Title</Text>
    <Text variant="body">Card content goes here</Text>
  </Box>
</Card>

// ❌ Incorrect - Card doesn't accept padding prop
<Card padding="l">
  <Text variant="h3">Card Title</Text>
</Card>
```

### Component Composition
Build complex UIs by composing simple components:

```typescript
<Card variant="elevated">
  <Box padding="l">
    <Box flexDirection="row" alignItems="center" marginBottom="m">
      <Badge variant="success" size="small">Active</Badge>
      <Text variant="h3" marginLeft="s">Status Card</Text>
    </Box>
    <Divider marginVertical="s" />
    <Text variant="body" color="textMuted">
      This demonstrates component composition
    </Text>
    <Button variant="primary" marginTop="m" fullWidth>
      Take Action
    </Button>
  </Box>
</Card>
```

### Selection Components
Use SelectionCard for single selections, SelectionList for multiple items:

```typescript
// Single selection
<SelectionCard
  title="Option 1"
  description="Description of option"
  isSelected={selectedOption === 'option1'}
  onPress={() => setSelectedOption('option1')}
/>

// Multiple selections
<SelectionList
  items={selectionItems}
  onItemPress={handleItemPress}
  multiSelect={true}
  title="Choose Multiple Options"
/>
```

## 🎯 Best Practices

### Do ✅
- Use semantic theme values
- Follow component composition patterns
- Test in the playground
- Maintain TypeScript strict mode
- Document component usage
- Place components in appropriate categories
- Use the main index for imports
- Wrap Card content in Box for proper spacing
- Compose components rather than creating monolithic ones

### Don't ❌
- Hardcode colors or spacing values
- Ignore TypeScript errors
- Skip testing in playground
- Create one-off components without reusability
- Break established naming conventions
- Import directly from component files (use index exports)
- Add padding directly to Card components
- Create overly complex single components

---

**Remember**: The component system is designed to grow with your application. The organized structure makes it easy to find, maintain, and extend components. Start with existing components, compose them creatively, and only create new components when necessary. The playground is your best friend for exploration and testing!

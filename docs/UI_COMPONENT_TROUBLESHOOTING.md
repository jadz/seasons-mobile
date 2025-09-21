# UI Component System Troubleshooting Guide

## For LLMs and Developers

This guide provides step-by-step solutions for common issues when working with the UI component system.

## Quick Diagnostic Checklist

When encountering errors, check these items in order:

1. ✅ **Theme Configuration**: Does `textVariants` include `defaults`?
2. ✅ **Type Imports**: Are you importing `ThemeTextVariants` instead of using `keyof Theme['textVariants']`?
3. ✅ **Color References**: Are all colors defined in the theme?
4. ✅ **Shadow Props**: Are you using individual shadow properties?
5. ✅ **Component Exports**: Is the component exported from `components/ui/index.ts`?

## Common Error Messages & Solutions

### 1. "Value 'defaults' does not exist in theme['textVariants']"

**Root Cause**: Shopify Restyle requires a `defaults` property in `textVariants`.

**Solution**:
```typescript
// ✅ In components/ui/theme.ts
const textVariants = {
  defaults: {           // REQUIRED by Shopify Restyle
    fontSize: 16,
    fontWeight: '400' as const,
    letterSpacing: -0.2,
    lineHeight: 22,
  },
  // ... other variants
};

// ✅ Exclude defaults from public types
export type ThemeTextVariants = Exclude<keyof Theme['textVariants'], 'defaults'>;

// ✅ In components, use ThemeTextVariants
import { ThemeTextVariants } from './theme';
textVariant: 'body' as ThemeTextVariants
```

### 2. "Property 'shadow' does not exist"

**Root Cause**: Using `shadow` as single prop instead of individual shadow properties.

**Solution**:
```typescript
// ❌ Don't do this
<Box shadow="md">

// ✅ Do this instead
<Box
  shadowColor="black"
  shadowOffset={{ width: 0, height: 2 }}
  shadowOpacity={0.1}
  shadowRadius={4}
  elevation={2}
>
```

### 3. "Type 'selected' is not assignable to type..."

**Root Cause**: Using theme colors that don't exist.

**Solution**:
```typescript
// ❌ Invalid theme colors
backgroundColor="selected"
borderColor="selectedBorder" 
color="textPrimary"

// ✅ Valid theme colors
backgroundColor="surface"
borderColor="primary"
color="text"
```

**Valid Theme Colors**:
- Primary: `primary`, `primaryLight`, `primaryDark`
- Background: `background`, `surface`, `card`
- Text: `text`, `textSecondary`, `textMuted`, `textInverse`
- Semantic: `success`, `warning`, `error`, `info`
- Utility: `transparent`, `white`, `black`, `border`

### 4. "Cannot find module" or Import Errors

**Root Cause**: Component not exported or incorrect import path.

**Solution**:
```typescript
// ✅ Check components/ui/index.ts includes:
export { default as YourComponent } from './YourComponent';

// ✅ Use correct import
import { YourComponent } from '../components/ui';
// NOT: import YourComponent from '../components/ui/YourComponent';
```

### 5. TypeScript Errors with Text Variants

**Root Cause**: Using `keyof Theme['textVariants']` which includes `defaults`.

**Solution**:
```typescript
// ❌ Don't do this
import { Theme } from './theme';
textVariant: 'body' as keyof Theme['textVariants']

// ✅ Do this instead
import { ThemeTextVariants } from './theme';
textVariant: 'body' as ThemeTextVariants
```

## Step-by-Step Debugging Process

### Step 1: Identify the Error Type

Look at the error message and categorize:
- **Theme-related**: Contains "theme", "textVariants", "defaults"
- **Type-related**: Contains "not assignable to type"
- **Import-related**: Contains "Cannot find module"
- **Props-related**: Contains "does not exist on type"

### Step 2: Apply Specific Solution

**For Theme Errors**:
1. Check `components/ui/theme.ts` has `defaults` in `textVariants`
2. Verify `ThemeTextVariants` type excludes `defaults`
3. Update component to use `ThemeTextVariants`

**For Type Errors**:
1. Check if using valid theme color names
2. Verify correct type imports
3. Use proper type assertions

**For Import Errors**:
1. Check component is exported in `components/ui/index.ts`
2. Verify import path is correct
3. Restart TypeScript server

**For Props Errors**:
1. Check component interface matches usage
2. Verify prop names are correct
3. Check if using individual shadow props

### Step 3: Test the Fix

1. Save all files
2. Check TypeScript errors are resolved
3. Test in playground (`/playground`)
4. Verify component renders correctly

## Component-Specific Issues

### Box Component
- **Issue**: Layout not working
- **Check**: `flexDirection`, `justifyContent`, `alignItems` props
- **Solution**: Use proper flex properties

### Text Component  
- **Issue**: Variant not applying
- **Check**: Using valid `ThemeTextVariants`
- **Solution**: Import and use correct type

### Button Component
- **Issue**: Styling not applied
- **Check**: Valid variant names
- **Solution**: Use `primary`, `secondary`, `outline`, `ghost`, `danger`

### Card Component
- **Issue**: Shadow not showing
- **Check**: Individual shadow props used
- **Solution**: Apply all shadow properties separately

### Header Component
- **Issue**: Back button not working
- **Check**: `showBackButton` and `onBackPress` props
- **Solution**: Provide both props for back functionality

## Prevention Strategies

### For LLMs
1. **Always check theme configuration first** when encountering errors
2. **Use the quick reference guide** for correct prop names and values
3. **Follow established patterns** from existing components
4. **Test in playground** before considering complete

### For Developers
1. **Use TypeScript strictly** - don't ignore type errors
2. **Import types correctly** - use `ThemeTextVariants`, not raw theme types
3. **Follow naming conventions** - use semantic color names
4. **Test incrementally** - verify each component works before moving on

## Emergency Fixes

If you need to quickly resolve issues:

### Quick Theme Fix
```typescript
// Add to components/ui/theme.ts if missing
const textVariants = {
  defaults: { fontSize: 16, fontWeight: '400', lineHeight: 22 },
  // ... existing variants
};

export type ThemeTextVariants = Exclude<keyof Theme['textVariants'], 'defaults'>;
```

### Quick Component Fix
```typescript
// Replace invalid theme references
// Find: backgroundColor="selected"
// Replace: backgroundColor="surface"

// Find: color="textPrimary" 
// Replace: color="text"

// Find: borderColor="selectedBorder"
// Replace: borderColor="primary"
```

### Quick Shadow Fix
```typescript
// Replace shadow prop with individual properties
// Find: shadow="md"
// Replace with:
shadowColor="black"
shadowOffset={{ width: 0, height: 2 }}
shadowOpacity={0.1}
shadowRadius={4}
elevation={2}
```

## When to Seek Help

Contact the development team if:
1. **Multiple components failing** - May indicate theme system issue
2. **New error patterns** - Not covered in this guide
3. **Performance issues** - Components rendering slowly
4. **Accessibility concerns** - Screen reader or keyboard navigation problems

## Resources

- **Component Playground**: `/playground` - Live examples
- **Full Documentation**: `docs/UI_COMPONENT_SYSTEM.md`
- **Quick Reference**: `docs/UI_COMPONENT_QUICK_REFERENCE.md`
- **Theme Configuration**: `components/ui/theme.ts`
- **Component Exports**: `components/ui/index.ts`

Remember: When in doubt, check the playground for working examples and follow the established patterns.

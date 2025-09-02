import { createTheme } from '@shopify/restyle';

// Base color palette from your original theme
const palette = {
  mist: '#C9D0C3',
  sage: '#7A9C81',
  pine: '#4E7166',
  forest: '#334C4E',
  midnight: '#263137',
  white: '#FFFFFF',
  black: '#000000',
  transparentPine: 'rgba(78, 113, 102, 0.95)',
  transparentForest: 'rgba(51, 76, 78, 0.92)',
  subtleDark: '#EBEEED',
  
  // Semantic colors
  success: '#4CAF50',
  warning: '#FFA500',
  error: '#F44336',
  info: '#2196F3',
  
  // Background variants
  successBackground: '#E8F5E9',
  warningBackground: '#FFF3E0',
  errorBackground: '#FFEBEE',
  infoBackground: '#E3F2FD',
};

// Enhanced spacing system
const spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 40,
  xxxl: 48,
};

// Typography variants with better organization
const textVariants = {
  hero: {
    fontSize: 32,
    fontWeight: '300' as const,
    letterSpacing: -0.5,
    lineHeight: 38,
  },
  title: {
    fontSize: 28,
    fontWeight: '400' as const,
    letterSpacing: -0.5,
    lineHeight: 34,
  },
  h1: {
    fontSize: 24,
    fontWeight: '400' as const,
    letterSpacing: -0.3,
    lineHeight: 32,
  },
  h2: {
    fontSize: 20,
    fontWeight: '400' as const,
    letterSpacing: -0.3,
    lineHeight: 28,
  },
  h3: {
    fontSize: 18,
    fontWeight: '400' as const,
    letterSpacing: -0.2,
    lineHeight: 24,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    letterSpacing: -0.2,
    lineHeight: 22,
  },
  bodyMedium: {
    fontSize: 16,
    fontWeight: '500' as const,
    letterSpacing: -0.2,
    lineHeight: 22,
  },
  bodySemiBold: {
    fontSize: 16,
    fontWeight: '600' as const,
    letterSpacing: -0.2,
    lineHeight: 22,
  },
  caption: {
    fontSize: 15,
    fontWeight: '400' as const,
    letterSpacing: -0.1,
    lineHeight: 20,
    opacity: 0.7,
  },
  small: {
    fontSize: 13,
    fontWeight: '400' as const,
    letterSpacing: -0.1,
    lineHeight: 18,
    opacity: 0.6,
  },
  mono: {
    fontSize: 16,
    fontFamily: 'RobotoMono_400Regular',
    lineHeight: 22,
  },
  label: {
    fontSize: 14,
    fontWeight: '500' as const,
    letterSpacing: -0.1,
    lineHeight: 18,
  },
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    letterSpacing: -0.2,
  },
};

// Border radius system
const borderRadii = {
  xs: 4,
  s: 8,
  m: 12,
  l: 16,
  xl: 20,
  round: 50,
};

// Box shadow variants
const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

// Light theme
export const lightTheme = createTheme({
  colors: {
    // Primary colors
    primary: palette.forest,
    primaryLight: palette.pine,
    primaryDark: palette.midnight,
    
    // Secondary colors
    secondary: palette.sage,
    secondaryLight: palette.mist,
    
    // Background colors
    background: palette.subtleDark,
    surface: palette.white,
    card: palette.white,
    
    // Text colors
    text: palette.midnight,
    textSecondary: palette.pine,
    textMuted: palette.sage,
    textInverse: palette.white,
    
    // Border colors
    border: palette.mist,
    borderLight: '#E8E8E8',
    borderDark: palette.sage,
    
    // Semantic colors
    success: palette.success,
    warning: palette.warning,
    error: palette.error,
    info: palette.info,
    
    // Semantic backgrounds
    successBackground: palette.successBackground,
    warningBackground: palette.warningBackground,
    errorBackground: palette.errorBackground,
    infoBackground: palette.infoBackground,
    
    // Interactive states
    buttonPrimary: palette.forest,
    buttonPrimaryDisabled: '#CCCCCC',
    buttonSecondary: palette.white,
    buttonSecondaryBorder: palette.forest,
    
    // Overlays
    overlay: 'rgba(0, 0, 0, 0.5)',
    headerBackground: palette.transparentPine,
    
    // Utility
    transparent: 'transparent',
    white: palette.white,
    black: palette.black,
  },
  spacing,
  borderRadii,
  textVariants,
  shadows,
  breakpoints: {
    phone: 0,
    tablet: 768,
  },
});

// Dark theme
export const darkTheme = createTheme({
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    
    // Background colors
    background: '#1A1F22',
    surface: palette.midnight,
    card: palette.midnight,
    
    // Text colors
    text: palette.white,
    textSecondary: palette.mist,
    textMuted: palette.sage,
    textInverse: palette.midnight,
    
    // Border colors
    border: palette.forest,
    borderLight: palette.pine,
    borderDark: palette.midnight,
    
    // Interactive states
    buttonPrimary: palette.sage,
    buttonSecondary: palette.midnight,
    buttonSecondaryBorder: palette.sage,
    
    // Overlays
    headerBackground: palette.transparentForest,
  },
});

export type Theme = typeof lightTheme;
export type ThemeColors = keyof Theme['colors'];
export type ThemeSpacing = keyof Theme['spacing'];
export type ThemeTextVariants = keyof Theme['textVariants'];
export type ThemeBorderRadii = keyof Theme['borderRadii'];
export type ThemeShadows = keyof Theme['shadows'];

export const theme = lightTheme;


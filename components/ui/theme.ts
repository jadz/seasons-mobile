import { createTheme } from '@shopify/restyle';

// Minimalistic color palette inspired by clean design
const palette = {
  // Pure minimalist colors
  white: '#FFFFFF',
  black: '#000000',
  
  // Subtle grays for minimal hierarchy
  gray50: '#FEFEFE',
  gray100: '#FAFAFA',
  gray150: '#F7F7F7',
  gray200: '#F0F0F0',
  gray300: '#E8E8E8',
  gray400: '#D1D1D1',
  gray500: '#9A9A9A',
  gray600: '#6B6B6B',
  gray700: '#4A4A4A',
  gray800: '#2A2A2A',
  gray900: '#1A1A1A',
  
  // Minimal accent - very subtle
  accent: '#4A90E2',
  accentLight: 'rgba(74, 144, 226, 0.1)',
  accentSubtle: 'rgba(74, 144, 226, 0.05)',
  
  // Minimal semantic colors - very subtle
  success: '#22C55E',
  successBackground: 'rgba(34, 197, 94, 0.03)',
  warning: '#F59E0B',
  warningBackground: 'rgba(245, 158, 11, 0.03)',
  error: '#EF4444',
  errorBackground: 'rgba(239, 68, 68, 0.03)',
  
  // Minimal selection state
  selected: 'rgba(74, 144, 226, 0.08)',
  selectedBorder: '#4A90E2',
  
  // Transparent overlays
  overlay: 'rgba(0, 0, 0, 0.05)',
  divider: 'rgba(0, 0, 0, 0.06)',
};

// Minimal spacing system with generous white space
const spacing = {
  xs: 4,
  s: 8,
  m: 12,
  l: 20,
  xl: 32,
  xxl: 48,
  xxxl: 64,
  xxxxl: 80,
};

// Minimal typography variants - clean and simple
const textVariants = {
  hero: {
    fontSize: 28,
    fontWeight: '300' as const,
    letterSpacing: -0.3,
    lineHeight: 36,
  },
  title: {
    fontSize: 24,
    fontWeight: '400' as const,
    letterSpacing: -0.2,
    lineHeight: 32,
  },
  h1: {
    fontSize: 20,
    fontWeight: '500' as const,
    letterSpacing: -0.1,
    lineHeight: 28,
  },
  h2: {
    fontSize: 18,
    fontWeight: '500' as const,
    letterSpacing: 0,
    lineHeight: 26,
  },
  h3: {
    fontSize: 16,
    fontWeight: '500' as const,
    letterSpacing: 0,
    lineHeight: 24,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 24,
  },
  bodyMedium: {
    fontSize: 16,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 20,
  },
  small: {
    fontSize: 12,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 20,
  },
  button: {
    fontSize: 16,
    fontWeight: '400' as const,
    letterSpacing: 0,
  },
};

// Minimal border radius system
const borderRadii = {
  xs: 4,
  s: 6,
  m: 8,
  l: 12,
  xl: 16,
  xxl: 20,
  round: 50,
};

// Minimal shadow system - barely visible
const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  minimal: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
  },
  subtle: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
};

// Minimal light theme with clean hierarchy
export const lightTheme = createTheme({
  colors: {
    // Primary - minimal accent
    primary: palette.accent,
    primaryLight: palette.accentLight,
    primarySubtle: palette.accentSubtle,
    primarySoft: palette.accentSubtle,
    
    // Backgrounds - clean and minimal
    background: palette.white,
    surface: palette.gray50,
    surfaceElevated: palette.white,
    card: palette.white,
    glass: palette.gray50,
    
    // Text hierarchy - clean and simple
    text: palette.gray900,
    textPrimary: palette.gray900,
    textSecondary: palette.gray600,
    textMuted: palette.gray500,
    textInverse: palette.white,
    
    // Minimal borders
    border: palette.gray200,
    borderLight: palette.gray150,
    borderSubtle: palette.gray300,
    borderFocus: palette.accent,
    glassBorder: palette.gray200,
    divider: palette.divider,
    
    // Semantic colors - subtle
    success: palette.success,
    warning: palette.warning,
    error: palette.error,
    accent: palette.accent,
    
    // Semantic backgrounds - barely visible
    successBackground: palette.successBackground,
    warningBackground: palette.warningBackground,
    errorBackground: palette.errorBackground,
    
    // Minimal interactive states
    buttonPrimary: palette.accent,
    buttonPrimaryDisabled: palette.gray300,
    buttonSecondary: palette.white,
    buttonSecondaryBorder: palette.gray300,
    
    // Selection states - subtle
    selected: palette.selected,
    selectedBorder: palette.selectedBorder,
    selectedBackground: palette.selected,
    
    // Minimal overlays
    overlay: palette.overlay,
    
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

// Minimal dark theme
export const darkTheme = createTheme({
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    
    // Dark backgrounds
    background: palette.gray900,
    surface: palette.gray800,
    surfaceElevated: palette.gray700,
    card: palette.gray800,
    
    // Dark text colors
    text: palette.white,
    textPrimary: palette.white,
    textSecondary: palette.gray400,
    textMuted: palette.gray500,
    textInverse: palette.gray900,
    
    // Dark borders
    border: palette.gray700,
    borderLight: palette.gray600,
    borderSubtle: palette.gray600,
    
    // Dark interactive states
    buttonPrimary: palette.accent,
    buttonSecondary: palette.gray800,
    buttonSecondaryBorder: palette.gray600,
  },
});

export type Theme = typeof lightTheme;
export type ThemeColors = keyof Theme['colors'];
export type ThemeSpacing = keyof Theme['spacing'];
export type ThemeTextVariants = keyof Theme['textVariants'];
export type ThemeBorderRadii = keyof Theme['borderRadii'];
export type ThemeShadows = keyof Theme['shadows'];

export const theme = lightTheme;


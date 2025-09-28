import { createTheme } from '@shopify/restyle';

// Base tokens - lean, scalable, semantic
const base = {
  spacing: { 
    // New semantic spacing
    xs: 4, 
    sm: 8, 
    md: 12, 
    lg: 16, 
    xl: 24,
    // Legacy spacing for backward compatibility
    s: 8,
    m: 16,
    l: 24,
    xxl: 40,
    xxxl: 48,
  },
  borderRadii: { 
    12: 12,
    xs: 4,
    sm: 8, 
    md: 12, 
    lg: 16, 
    xl: 24,
    // Legacy radii for backward compatibility
    s: 8,
    m: 12,
    l: 16,
    round: 50,
  },
  radii: { 
    sm: 8, 
    md: 12, 
    lg: 16, 
    xl: 24,
    // Legacy radii for backward compatibility
    s: 8,
    m: 12,
    l: 16,
    round: 50,
  },
  textVariants: {
    defaults: {
      fontFamily: 'Geist_400Regular',
    },
    // Primary hierarchy - optimized for mobile with refined Geist weights
    h1: { 
      fontSize: 28, 
      lineHeight: 34, 
      fontFamily: 'Geist_600SemiBold',
      letterSpacing: -0.5,
    },
    h2: { 
      fontSize: 22, 
      lineHeight: 28, 
      fontFamily: 'Geist_500Medium',
      letterSpacing: -0.25,
    },
    h3: { 
      fontSize: 18, 
      lineHeight: 24, 
      fontFamily: 'Geist_500Medium',
      letterSpacing: -0.15,
    },
    h4: {
      fontSize: 16,
      lineHeight: 22,
      fontFamily: 'Geist_500Medium',
    },
    // Body text hierarchy
    body: { 
      fontSize: 16, 
      lineHeight: 24, 
      fontFamily: 'Geist_400Regular',
    },
    bodyMedium: {
      fontSize: 16,
      lineHeight: 24,
      fontFamily: 'Geist_500Medium',
    },
    bodySmall: {
      fontSize: 14,
      lineHeight: 20,
      fontFamily: 'Geist_400Regular',
    },
    // Supporting text
    caption: { 
      fontSize: 12, 
      lineHeight: 16, 
      fontFamily: 'Geist_400Regular',
    },
    captionMedium: {
      fontSize: 12,
      lineHeight: 16,
      fontFamily: 'Geist_500Medium',
    },
    overline: {
      fontSize: 11,
      lineHeight: 16,
      fontFamily: 'Geist_500Medium',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    // Legacy text variants for backward compatibility
    title: { 
      fontSize: 24, 
      lineHeight: 30, 
      fontFamily: 'Geist_500Medium',
      letterSpacing: -0.25,
    },
    label: { 
      fontSize: 14, 
      lineHeight: 20, 
      fontFamily: 'Geist_500Medium',
    },
    small: { 
      fontSize: 12, 
      lineHeight: 16, 
      fontFamily: 'Geist_400Regular',
    },
    button: { 
      fontSize: 16, 
      lineHeight: 24, 
      fontFamily: 'Geist_500Medium',
      letterSpacing: 0.1,
    },
  },
  // Shadow tokens for consistency in RN/web parity
  shadows: {
    'elev/1': {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 2,
      elevation: 1,
    },
    'elev/2': {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
      elevation: 4,
    },
  },
  breakpoints: {
    phone: 0,
    tablet: 768,
  },
  buttonVariants: {
    primary: {
      backgroundColor: 'brand/primary',
      borderColor: 'brand/primary',
      borderWidth: 1,
      textColor: 'brand/onPrimary',
    },
    secondary: {
      backgroundColor: 'bg/surface',
      borderColor: 'border/subtle',
      borderWidth: 1,
      textColor: 'text/primary',
    },
    outline: {
      backgroundColor: 'transparent',
      borderColor: 'brand/primary',
      borderWidth: 1,
      textColor: 'brand/primary',
    },
    ghost: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      borderWidth: 0,
      textColor: 'brand/primary',
    },
    danger: {
      backgroundColor: 'state/error',
      borderColor: 'state/error',
      borderWidth: 1,
      textColor: 'text/inverse',
    },
  },
  buttonSizes: {
    small: {
      paddingVertical: 's',
      paddingHorizontal: 'm',
      borderRadius: 'md',
    },
    medium: {
      paddingVertical: 'm',
      paddingHorizontal: 'l',
      borderRadius: 'md',
    },
    large: {
      paddingVertical: 'l',
      paddingHorizontal: 'xl',
      borderRadius: 'lg',
    },
  },
};

export const lightTheme = createTheme({
  ...base,
  colors: {
    'bg/page': '#FFFFFF',
    'bg/surface': '#F5F6F8',
    'bg/raised': '#e5ecfcff',
    'text/primary': '#0E1116',
    'text/secondary': '#4B5563',
    'text/inverse': '#FFFFFF',
    'input/placeholder': '#D1D5DB',
    'brand/primary': '#2563EB',
    'brand/onPrimary': '#FFFFFF',
    'border/subtle': '#E5E7EB',
    'border/strong': '#D1D5DB',
    'state/success': '#10B981',
    'state/warn': '#F59E0B',
    'state/error': '#EF4444',
    'state/on': '#0B0F14',
    'focus/ring': '#3B82F6',
    'overlay/scrim': 'rgba(0,0,0,0.45)',
    transparent: 'transparent'
  },
});

export const darkTheme = createTheme({
  ...base,
  colors: {
    'bg/page': '#0B0F14',
    'bg/surface': '#2C2A2D',
    'bg/raised': '#141A21',
    'text/primary': '#E5E7EB',
    'text/secondary': '#9CA3AF',
    'text/inverse': '#0B0F14',
    'input/placeholder': '#3F3F46',
    'brand/primary': '#F5CA47',
    'brand/onPrimary': '#0B0F14',
    'border/subtle': '#1F2937',
    'border/strong': '#374151',
    'state/success': '#34D399',
    'state/warn': '#FBBF24',
    'state/error': '#F87171',
    'state/on': '#0B0F14',
    'focus/ring': '#60A5FA',
    'overlay/scrim': 'rgba(0,0,0,0.6)',
    transparent: 'transparent'
  },
});

export type Theme = typeof lightTheme;
export type ThemeColors = keyof Theme['colors'];
export type ThemeSpacing = keyof Theme['spacing'];
export type ThemeTextVariants = Exclude<keyof Theme['textVariants'], 'defaults'>;
export type ThemeRadii = keyof Theme['radii'];
export type ThemeShadows = keyof Theme['shadows'];

export const theme = lightTheme;

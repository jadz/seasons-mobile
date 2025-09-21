import React from 'react';
import {
  createText,
  TypographyProps,
  SpacingProps,
  ColorProps,
  LayoutProps,
} from '@shopify/restyle';
import { TextProps as RNTextProps } from 'react-native';
import { Theme } from '../foundation/theme';

// Base text component
export const Text = createText<Theme>();

// Enhanced text component with additional styling props
export type StyledTextProps = TypographyProps<Theme> &
  SpacingProps<Theme> &
  ColorProps<Theme> &
  LayoutProps<Theme> &
  RNTextProps & {
    children?: React.ReactNode;
  };

// Convenience text components for common variants
interface TextComponentProps {
  children?: React.ReactNode;
  [key: string]: any;
}

export const HeroText: React.FC<TextComponentProps> = ({ children, ...props }) => (
  <Text variant="hero" color="text/primary" {...props}>
    {children}
  </Text>
);

export const TitleText: React.FC<TextComponentProps> = ({ children, ...props }) => (
  <Text variant="title" color="text/primary" {...props}>
    {children}
  </Text>
);

export const H1Text: React.FC<TextComponentProps> = ({ children, ...props }) => (
  <Text variant="h1" color="text/primary" {...props}>
    {children}
  </Text>
);

export const H2Text: React.FC<TextComponentProps> = ({ children, ...props }) => (
  <Text variant="h2" color="text/primary" {...props}>
    {children}
  </Text>
);

export const H3Text: React.FC<TextComponentProps> = ({ children, ...props }) => (
  <Text variant="h3" color="text/primary" {...props}>
    {children}
  </Text>
);

export const BodyText: React.FC<TextComponentProps> = ({ children, ...props }) => (
  <Text variant="body" color="text/primary" {...props}>
    {children}
  </Text>
);

export const CaptionText: React.FC<TextComponentProps> = ({ children, ...props }) => (
  <Text variant="caption" color="textSecondary" {...props}>
    {children}
  </Text>
);

export const LabelText: React.FC<TextComponentProps> = ({ children, ...props }) => (
  <Text variant="label" color="text/primary" {...props}>
    {children}
  </Text>
);

export default Text;

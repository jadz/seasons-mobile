import {
  createBox,
  LayoutProps,
  SpacingProps,
  BorderProps,
  BackgroundColorProps,
  ShadowProps,
  PositionProps,
  OpacityProps,
} from '@shopify/restyle';
import { Theme } from './theme';

// Box component with comprehensive layout, spacing, and styling props
export const Box = createBox<Theme>();

// Enhanced box with additional props
export type StyledBoxProps = LayoutProps<Theme> &
  SpacingProps<Theme> &
  BorderProps<Theme> &
  BackgroundColorProps<Theme> &
  ShadowProps<Theme> &
  PositionProps<Theme> &
  OpacityProps<Theme> & {
    children?: React.ReactNode;
  };

export default Box;

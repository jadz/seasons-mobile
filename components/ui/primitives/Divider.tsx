import React from 'react';
import { Box } from './Box';
import { Theme } from '../foundation/theme';

export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  thickness?: number;
  color?: keyof Theme['colors'];
  length?: number;
  margin?: keyof Theme['spacing'];
  marginVertical?: keyof Theme['spacing'];
  marginHorizontal?: keyof Theme['spacing'];
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  thickness = 1,
  color = 'border',
  length,
  margin,
  marginVertical,
  marginHorizontal,
}) => {
  const isHorizontal = orientation === 'horizontal';

  return (
    <Box
      backgroundColor={color}
      width={isHorizontal ? (length || '100%') : thickness}
      height={isHorizontal ? thickness : (length || 100)}
      margin={margin}
      marginVertical={marginVertical}
      marginHorizontal={marginHorizontal}
      style={{
        width: isHorizontal ? (length ? length : '100%') : thickness,
        height: isHorizontal ? thickness : (length ? length : 100),
      }}
    />
  );
};

export default Divider;

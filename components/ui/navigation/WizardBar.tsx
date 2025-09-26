import React from 'react';
import { Box } from '../primitives/Box';
import { Theme } from '../foundation/theme';

export interface WizardBarProps {
  totalSteps: number;
  currentStep: number;
  barHeight?: number;
  spacing?: keyof Theme['spacing'];
  activeColor?: keyof Theme['colors'];
  inactiveColor?: keyof Theme['colors'];
  completedColor?: keyof Theme['colors'];
}

export const WizardBar: React.FC<WizardBarProps> = ({
  totalSteps,
  currentStep,
  barHeight = 4,
  spacing = 'xs',
  activeColor = 'brand/primary',
  inactiveColor = 'border/strong',
  completedColor = 'brand/primary',
}) => {
  return (
    <Box 
      flexDirection="row" 
      alignItems="center" 
      justifyContent="center"
      paddingVertical="l"
    >
      {Array.from({ length: totalSteps }, (_, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;
        
        return (
          <Box key={index} flex={1} marginHorizontal={spacing}>
            <Box
              height={barHeight}
              borderRadius="xs"
              backgroundColor={
                isActive ? activeColor : 
                isCompleted ? completedColor : 
                inactiveColor
              }
              opacity={
                isActive ? 1.0 :
                isCompleted ? 0.8 :
                0.3
              }
            />
          </Box>
        );
      })}
    </Box>
  );
};

export default WizardBar;

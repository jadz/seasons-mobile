import React from 'react';
import { Box } from '../primitives/Box';
import { Theme } from '../foundation/theme';

export interface WizardDotsProps {
  totalSteps: number;
  currentStep: number;
  dotSize?: number;
  spacing?: keyof Theme['spacing'];
  activeColor?: keyof Theme['colors'];
  inactiveColor?: keyof Theme['colors'];
}

export const WizardDots: React.FC<WizardDotsProps> = ({
  totalSteps,
  currentStep,
  dotSize = 6,
  spacing = 's',
  activeColor = 'primary',
  inactiveColor = 'border',
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
          <Box key={index} marginHorizontal={spacing}>
            <Box
              width={isActive ? dotSize + 2 : dotSize}
              height={isActive ? dotSize + 2 : dotSize}
              borderRadius="round"
              backgroundColor={
                isActive ? activeColor : 
                isCompleted ? 'textMuted' : 
                inactiveColor
              }
              opacity={
                isActive ? 1.0 :
                isCompleted ? 0.6 :
                0.3
              }
            />
          </Box>
        );
      })}
    </Box>
  );
};

export default WizardDots;

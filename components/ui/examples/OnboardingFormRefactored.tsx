import React, { useState } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '../../../hooks/auth/useAuth';
import { useUserPreferences } from '../../../hooks/userPreferences/useUserPreferences';
import { 
  BodyWeightUnit, 
  StrengthTrainingUnit, 
  BodyMeasurementUnit, 
  DistanceUnit 
} from '../../../domain/models/userPreferences';
import {
  Box,
  Text,
  Button,
  TextInput,
  Card,
  H1Text,
  BodyText,
} from '../index';

interface OnboardingFormRefactoredProps {
  onComplete: () => void;
}

interface PreferenceSelectorProps {
  title: string;
  options: { label: string; value: any }[];
  selectedValue: any;
  onSelect: (value: any) => void;
  disabled?: boolean;
}

const PreferenceSelector: React.FC<PreferenceSelectorProps> = ({ 
  title, 
  options, 
  selectedValue, 
  onSelect,
  disabled = false
}) => (
  <Box marginBottom="l">
    <Text variant="label" color="text/primary" marginBottom="s">
      {title}
    </Text>
    <Box flexDirection="row" gap="s">
      {options.map((option) => (
        <Button
          key={option.value}
          variant={selectedValue === option.value ? 'primary' : 'outline'}
          size="medium"
          onPress={() => onSelect(option.value)}
          disabled={disabled}
          style={{ flex: 1 }}
        >
          {option.label}
        </Button>
      ))}
    </Box>
  </Box>
);

const OnboardingFormRefactored: React.FC<OnboardingFormRefactoredProps> = ({ onComplete }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<'name' | 'preferences'>('name');
  const { user, completeOnboarding } = useAuth();
  const { createUserPreferences } = useUserPreferences();

  // User info
  const [firstName, setFirstName] = useState('');

  // Individual preference states (defaulting to metric)
  const [bodyWeightUnit, setBodyWeightUnit] = useState<BodyWeightUnit>(BodyWeightUnit.KILOGRAMS);
  const [strengthTrainingUnit, setStrengthTrainingUnit] = useState<StrengthTrainingUnit>(StrengthTrainingUnit.KILOGRAMS);
  const [bodyMeasurementUnit, setBodyMeasurementUnit] = useState<BodyMeasurementUnit>(BodyMeasurementUnit.CENTIMETERS);
  const [distanceUnit, setDistanceUnit] = useState<DistanceUnit>(DistanceUnit.KILOMETERS);

  const handleNextStep = () => {
    if (currentStep === 'name') {
      if (!firstName.trim()) {
        Alert.alert('Error', 'Please enter your first name.');
        return;
      }
      setCurrentStep('preferences');
    }
  };

  const handleComplete = async () => {
    if (!user) {
      Alert.alert('Error', 'User not found. Please sign in again.');
      return;
    }

    setIsLoading(true);
    try {
      await createUserPreferences(user.id, {
        bodyWeightUnit,
        strengthTrainingUnit,
        bodyMeasurementUnit,
        distanceUnit,
      });
      
      await completeOnboarding({ 
        firstName: firstName.trim()
      });
      
      onComplete();
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Failed to complete setup. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (currentStep === 'name') {
    return (
      <Box flex={1} backgroundcolor="bg/primary" padding="l" justifyContent="center">
        <Card variant="elevated" padding="xl">
          <H1Text textAlign="center" marginBottom="xl">
            What's your name?
          </H1Text>
          
          <Box marginBottom="xl">
            <TextInput
              label="First Name"
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Enter your first name"
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="next"
              onSubmitEditing={handleNextStep}
              variant="outlined"
            />
          </Box>

          <Button
            onPress={handleNextStep}
            disabled={!firstName.trim()}
            fullWidth
          >
            Continue
          </Button>
        </Card>
      </Box>
    );
  }

  return (
    <Box flex={1} backgroundcolor="bg/primary" padding="l" justifyContent="center">
      <Card variant="elevated" padding="xl">
        <H1Text textAlign="center" marginBottom="m">
          Set your preferences
        </H1Text>
        
        <BodyText 
          textAlign="center" 
          color="textSecondary" 
          marginBottom="xl"
        >
          Choose your preferred units for tracking
        </BodyText>
        
        <PreferenceSelector
          title="Body Weight"
          options={[
            { label: 'kg', value: BodyWeightUnit.KILOGRAMS },
            { label: 'lbs', value: BodyWeightUnit.POUNDS },
          ]}
          selectedValue={bodyWeightUnit}
          onSelect={setBodyWeightUnit}
          disabled={isLoading}
        />

        <PreferenceSelector
          title="Strength Training"
          options={[
            { label: 'kg', value: StrengthTrainingUnit.KILOGRAMS },
            { label: 'lbs', value: StrengthTrainingUnit.POUNDS },
          ]}
          selectedValue={strengthTrainingUnit}
          onSelect={setStrengthTrainingUnit}
          disabled={isLoading}
        />

        <PreferenceSelector
          title="Body Measurements"
          options={[
            { label: 'cm', value: BodyMeasurementUnit.CENTIMETERS },
            { label: 'in', value: BodyMeasurementUnit.INCHES },
          ]}
          selectedValue={bodyMeasurementUnit}
          onSelect={setBodyMeasurementUnit}
          disabled={isLoading}
        />

        <PreferenceSelector
          title="Distance"
          options={[
            { label: 'km', value: DistanceUnit.KILOMETERS },
            { label: 'mi', value: DistanceUnit.MILES },
          ]}
          selectedValue={distanceUnit}
          onSelect={setDistanceUnit}
          disabled={isLoading}
        />

        <Button
          onPress={handleComplete}
          loading={isLoading}
          fullWidth
          style={{ marginTop: 8 }}
        >
          Complete Setup
        </Button>
      </Card>
    </Box>
  );
};

export { OnboardingFormRefactored };


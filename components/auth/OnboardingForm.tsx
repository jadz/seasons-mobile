import React, { useState } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '../../hooks/auth/useAuth';
import { useUserPreferences } from '../../hooks/userPreferences/useUserPreferences';
import { 
  BodyWeightUnit, 
  StrengthTrainingUnit, 
  BodyMeasurementUnit, 
  DistanceUnit 
} from '../../domain/models/userPreferences';
import { Box } from '../ui';
import { Text } from '../ui';
import { Button } from '../ui';
import { TextInput } from '../ui';

interface OnboardingFormProps {
  onComplete: () => void;
}

const OnboardingForm: React.FC<OnboardingFormProps> = ({ onComplete }) => {
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

  const PreferenceSelector: React.FC<{
    title: string;
    options: { label: string; value: any }[];
    selectedValue: any;
    onSelect: (value: any) => void;
  }> = ({ title, options, selectedValue, onSelect }) => (
    <Box marginBottom="l">
      <Text variant="label" color="text/primary" marginBottom="m">{title}</Text>
      <Box flexDirection="row" gap="m">
        {options.map((option) => (
          <Button
            key={option.value}
            variant={selectedValue === option.value ? "primary" : "secondary"}
            onPress={() => onSelect(option.value)}
            disabled={isLoading}
            style={{ flex: 1 }}
          >
            {option.label}
          </Button>
        ))}
      </Box>
    </Box>
  );

  if (currentStep === 'name') {
    return (
      <Box flex={1} padding="l" justifyContent="center">
        <Text variant="h1" color="text/primary" textAlign="center" marginBottom="xl">
          What's your name?

        </Text>
        
        <Box marginBottom="xxl">
          <Text variant="label" color="text/primary" marginBottom="m">First Name</Text>
          <TextInput
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Enter your first name"
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="next"
            onSubmitEditing={handleNextStep}
          />
        </Box>

        <Button
          onPress={handleNextStep}
          disabled={!firstName.trim()}
        >
          Continue
        </Button>
      </Box>
    );
  }

  return (
    <Box flex={1} padding="l" justifyContent="center">
      <Text variant="h1" color="text/primary" textAlign="center" marginBottom="xl">
        Set your preferences
      </Text>
      
      <PreferenceSelector
        title="Body Weight"
        options={[
          { label: 'kg', value: BodyWeightUnit.KILOGRAMS },
          { label: 'lbs', value: BodyWeightUnit.POUNDS },
        ]}
        selectedValue={bodyWeightUnit}
        onSelect={setBodyWeightUnit}
      />

      <PreferenceSelector
        title="Strength Training"
        options={[
          { label: 'kg', value: StrengthTrainingUnit.KILOGRAMS },
          { label: 'lbs', value: StrengthTrainingUnit.POUNDS },
        ]}
        selectedValue={strengthTrainingUnit}
        onSelect={setStrengthTrainingUnit}
      />

      <PreferenceSelector
        title="Body Measurements"
        options={[
          { label: 'cm', value: BodyMeasurementUnit.CENTIMETERS },
          { label: 'in', value: BodyMeasurementUnit.INCHES },
        ]}
        selectedValue={bodyMeasurementUnit}
        onSelect={setBodyMeasurementUnit}
      />

      <PreferenceSelector
        title="Distance"
        options={[
          { label: 'km', value: DistanceUnit.KILOMETERS },
          { label: 'mi', value: DistanceUnit.MILES },
        ]}
        selectedValue={distanceUnit}
        onSelect={setDistanceUnit}
      />

      <Button
        onPress={handleComplete}
        disabled={isLoading}
        style={{ marginTop: 24 }}
      >
        {isLoading ? 'Setting up...' : 'Complete Setup'}
      </Button>
    </Box>
  );
};



export { OnboardingForm };

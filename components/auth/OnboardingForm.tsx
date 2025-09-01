import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
} from 'react-native';
import { useAuth } from '../../hooks/auth/useAuth';
import { useUserPreferences } from '../../hooks/userPreferences/useUserPreferences';
import { 
  BodyWeightUnit, 
  StrengthTrainingUnit, 
  BodyMeasurementUnit, 
  DistanceUnit 
} from '../../domain/models/userPreferences';

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
    <View style={styles.preferenceSection}>
      <Text style={styles.preferenceTitle}>{title}</Text>
      <View style={styles.preferenceOptions}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.preferenceOption,
              selectedValue === option.value && styles.preferenceOptionSelected,
            ]}
            onPress={() => onSelect(option.value)}
            disabled={isLoading}
          >
            <Text
              style={[
                styles.preferenceOptionText,
                selectedValue === option.value && styles.preferenceOptionTextSelected,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  if (currentStep === 'name') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>What's your name?</Text>
        
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>First Name</Text>
          <TextInput
            style={styles.textInput}
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Enter your first name"
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="next"
            onSubmitEditing={handleNextStep}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, !firstName.trim() && styles.buttonDisabled]}
          onPress={handleNextStep}
          disabled={!firstName.trim()}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set your preferences</Text>
      
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

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleComplete}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Setting up...' : 'Complete Setup'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  inputSection: {
    marginBottom: 40,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  textInput: {
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  preferenceSection: {
    marginBottom: 24,
  },
  preferenceTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  preferenceOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  preferenceOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ddd',
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
  },
  preferenceOptionSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#e7f3ff',
  },
  preferenceOptionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  preferenceOptionTextSelected: {
    color: '#007AFF',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export { OnboardingForm };

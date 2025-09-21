import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@shopify/restyle';
import { Box, Text, Button, Header, WizardBar } from '../../components/ui';
import { Theme } from '../../components/ui/foundation/theme';
import { 
  BodyWeightUnit, 
  StrengthTrainingUnit, 
  BodyMeasurementUnit, 
  DistanceUnit 
} from '../../domain/models/userPreferences';

export default function UserUnitPreferencesScreen() {
  const [bodyWeightUnit, setBodyWeightUnit] = useState<BodyWeightUnit>(BodyWeightUnit.KILOGRAMS);
  const [strengthTrainingUnit, setStrengthTrainingUnit] = useState<StrengthTrainingUnit>(StrengthTrainingUnit.KILOGRAMS);
  const [bodyMeasurementUnit, setBodyMeasurementUnit] = useState<BodyMeasurementUnit>(BodyMeasurementUnit.CENTIMETERS);
  const [distanceUnit, setDistanceUnit] = useState<DistanceUnit>(DistanceUnit.KILOMETERS);
  const insets = useSafeAreaInsets();
  const theme = useTheme<Theme>();

  const handleBackPress = () => {
    router.back();
  };

  const handleContinue = () => {
    // TODO: Save unit preferences
    // Navigate to season creation overview
    router.push('/onboarding/season-overview');
  };

  const PreferenceSelector: React.FC<{
    title: string;
    description?: string;
    options: { label: string; value: any }[];
    selectedValue: any;
    onSelect: (value: any) => void;
  }> = ({ title, description, options, selectedValue, onSelect }) => (
    <Box marginBottom="l">
      <Text variant="h4" color="text/primary" marginBottom="xs">{title}</Text>
      {description && (
        <Text variant="bodySmall" color="text/secondary" marginBottom="m">{description}</Text>
      )}
      <Box flexDirection="row" gap="m">
        {options.map((option) => (
          <Button
            key={option.value}
            variant={selectedValue === option.value ? "primary" : "secondary"}
            onPress={() => onSelect(option.value)}
            style={{ flex: 1 }}
          >
            {option.label}
          </Button>
        ))}
      </Box>
    </Box>
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors['bg/page'] }}>
      {/* Safe Area Top */}
      <View style={{ paddingTop: insets.top }} />
      
      {/* Header */}
      <Header
        title="Lets Get You Onboard"
        showBackButton={true}
        onBackPress={handleBackPress}
        variant="transparent"
      />
      
      {/* Progress Indicator */}
      <Box paddingHorizontal="l" marginBottom="l">
        <WizardBar totalSteps={7} currentStep={2} />
      </Box>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Box paddingHorizontal="l" paddingVertical="xl">
          
          {/* Section Introduction */}
          <Box marginBottom="xl">
            <Text variant="h1" color="text/primary" marginBottom="md">
              Set your unit preferences
            </Text>
            <Text variant="body" color="text/secondary">
              Choose the units you're most comfortable with. You can change these anytime in settings.
            </Text>
          </Box>
          
          {/* Unit Preferences */}
          <Box marginBottom="xl">
            <PreferenceSelector
              title="Body Weight"
              description="How you want to see your body weight displayed"
              options={[
                { label: 'Kilograms (kg)', value: BodyWeightUnit.KILOGRAMS },
                { label: 'Pounds (lbs)', value: BodyWeightUnit.POUNDS },
              ]}
              selectedValue={bodyWeightUnit}
              onSelect={setBodyWeightUnit}
            />

            <PreferenceSelector
              title="Strength Training"
              description="Units for weights when lifting"
              options={[
                { label: 'Kilograms (kg)', value: StrengthTrainingUnit.KILOGRAMS },
                { label: 'Pounds (lbs)', value: StrengthTrainingUnit.POUNDS },
              ]}
              selectedValue={strengthTrainingUnit}
              onSelect={setStrengthTrainingUnit}
            />

            <PreferenceSelector
              title="Body Measurements"
              description="For height, waist, chest, etc."
              options={[
                { label: 'Centimeters (cm)', value: BodyMeasurementUnit.CENTIMETERS },
                { label: 'Inches (in)', value: BodyMeasurementUnit.INCHES },
              ]}
              selectedValue={bodyMeasurementUnit}
              onSelect={setBodyMeasurementUnit}
            />

            <PreferenceSelector
              title="Distance"
              description="For running, cycling, and cardio"
              options={[
                { label: 'Kilometers (km)', value: DistanceUnit.KILOMETERS },
                { label: 'Miles (mi)', value: DistanceUnit.MILES },
              ]}
              selectedValue={distanceUnit}
              onSelect={setDistanceUnit}
            />
          </Box>

          {/* Continue Button */}
          <Button
            variant="primary"
            onPress={handleContinue}
            fullWidth
          >
            Continue
          </Button>
          
          {/* Bottom Spacing */}
          <View style={{ paddingBottom: insets.bottom + 20 }} />
        </Box>
      </ScrollView>
    </View>
  );
}

import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@shopify/restyle';
import { Box, Text, Button, Header, WizardBar, TextInput } from '../../components/ui';
import { SimpleSelectionButton } from '../../components/ui/selection/SimpleSelectionButton';
import { Theme } from '../../components/ui/foundation/theme';

export default function UserPersonalInfoScreen() {
  const [firstName, setFirstName] = useState('');
  const [selectedSex, setSelectedSex] = useState<string | null>(null);
  const [birthYear, setBirthYear] = useState('');
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const insets = useSafeAreaInsets();
  const theme = useTheme<Theme>();

  const handleBackPress = () => {
    router.back();
  };

  const handleContinue = () => {
    if (!selectedSex || !birthYear) {
      Alert.alert('Required Fields', 'Please select your sex and enter your birth year.');
      return;
    }
    
    router.push('/onboarding/user-step-3-unit-preferences');
  };

  const handleSexSelection = (sex: string) => {
    setSelectedSex(sex);
  };

  const handleBirthYearChange = (text: string) => {
    // Only allow digits and limit to 4 characters
    const cleaned = text.replace(/\D/g, '').slice(0, 4);
    setBirthYear(cleaned);
  };

  const isValidYear = birthYear.length === 4 && parseInt(birthYear) >= 1900 && parseInt(birthYear) <= new Date().getFullYear();
  const canContinue = selectedSex && isValidYear;

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors['bg/page'] }}>
      {/* Safe Area Top */}
      <View style={{ paddingTop: insets.top }} />
      
      {/* Header */}
      <Header
        title="All About You"
        showBackButton={true}
        onBackPress={handleBackPress}
        variant="transparent"
      />
      
      {/* Progress Indicator */}
      <Box paddingHorizontal="l" marginBottom="l">
        <WizardBar totalSteps={7} currentStep={1} />
      </Box>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Box paddingHorizontal="l" paddingVertical="xl">
          
          {/* Section Introduction */}
          <Box marginBottom="xl">
            <Box flexDirection="row" alignItems="center" marginBottom="md">
              <Text variant="h1" color="text/primary" flex={1}>
                Tell us about yourself
              </Text>
              <TouchableOpacity 
                onPress={() => setShowPrivacyModal(true)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Box
                  width={24}
                  height={24}
                  borderRadius="round"
                  backgroundColor="border/subtle"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text variant="caption" color="text/secondary">?</Text>
                </Box>
              </TouchableOpacity>
            </Box>
            <Text variant="body" color="text/secondary">
              This helps us personalize your experience and provide better recommendations.
            </Text>
          </Box>
          
          {/* First Name (Optional) */}
          <Box marginBottom="l">
            <Text variant="label" color="text/primary" marginBottom="m">
              First Name (Optional)
            </Text>
            <TextInput
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Enter your first name"
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="next"
            />
          </Box>

          {/* Sex Selection */}
          <Box marginBottom="l">
            <Text variant="label" color="text/primary" marginBottom="m">
              Sex *
            </Text>
            <Box flexDirection="row" flexWrap="wrap" alignItems="flex-start">
              <SimpleSelectionButton 
                title="Male"
                isSelected={selectedSex === 'male'}
                onPress={() => handleSexSelection('male')}
              />
              <SimpleSelectionButton 
                title="Female"
                isSelected={selectedSex === 'female'}
                onPress={() => handleSexSelection('female')}
              />
              <SimpleSelectionButton 
                title="Other"
                isSelected={selectedSex === 'other'}
                onPress={() => handleSexSelection('other')}
              />
            </Box>
          </Box>

          {/* Birth Year */}
          <Box marginBottom="xl">
            <Text variant="label" color="text/primary" marginBottom="m">
              Birth Year *
            </Text>
            <TextInput
              value={birthYear}
              onChangeText={handleBirthYearChange}
              placeholder="1990"
              keyboardType="numeric"
              returnKeyType="done"
              maxLength={4}
            />
            <Text variant="caption" color="text/secondary" marginTop="s">
              We use this to provide age-appropriate recommendations
            </Text>
          </Box>

          {/* Continue Button */}
          <Button
            variant="primary"
            onPress={handleContinue}
            disabled={!canContinue}
            fullWidth
          >
            Continue
          </Button>
          
          {/* Bottom Spacing */}
          <View style={{ paddingBottom: insets.bottom + 20 }} />
        </Box>
      </ScrollView>

      {/* Privacy Modal */}
      <Modal
        visible={showPrivacyModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPrivacyModal(false)}
      >
        <Box 
          flex={1} 
          backgroundColor="overlay/scrim" 
          justifyContent="center" 
          paddingHorizontal="l"
        >
          <Box 
            backgroundColor="bg/page" 
            borderRadius="lg" 
            padding="l"
          >
            <Text variant="h3" color="text/primary" marginBottom="md">
              About Your Data
            </Text>
            <Text variant="body" color="text/secondary" marginBottom="l">
              Your personal information will not be displayed on your public profile. Seasons uses this data to personalize features for your specific needs and goals.
            </Text>
            <Text variant="body" color="text/secondary" marginBottom="xl">
              We're also building features that let you compare your progress with other athletes. Having your age and sex will allow you to see how you stack up against people in your demographic.
            </Text>
            <Button
              variant="primary"
              onPress={() => setShowPrivacyModal(false)}
              fullWidth
            >
              Got it
            </Button>
          </Box>
        </Box>
      </Modal>
    </View>
  );
}

import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@shopify/restyle';
import { Box, Text, Button, Header, WizardBar, TextInput } from '../../components/ui';
import { Theme } from '../../components/ui/foundation/theme';

export default function UserUsernameScreen() {
  const [username, setUsername] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const insets = useSafeAreaInsets();
  const theme = useTheme<Theme>();

  const handleBackPress = () => {
    router.back();
  };

  const handleContinue = async () => {
    if (!username.trim()) return;
    
    // TODO: Add username validation/checking logic here
    setIsChecking(true);
    
    // Simulate API check
    setTimeout(() => {
      setIsChecking(false);
      router.push('/onboarding/user-step-2-personal-info');
    }, 500);
  };

  const isValidUsername = username.trim().length >= 3;

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
        <WizardBar totalSteps={6} currentStep={0} />
      </Box>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Box paddingHorizontal="l" paddingVertical="xl">
          
          {/* Section Introduction */}
          <Box marginBottom="xl">
            <Text variant="h1" color="text/primary" marginBottom="md">
              Choose your username
            </Text>
            <Text variant="body" color="text/secondary">
              This will be your unique identifier on Seasons. You can't change it later.
            </Text>
          </Box>
          
          {/* Username Input */}
          <Box marginBottom="xl">
            <Text variant="label" color="text/primary" marginBottom="m">
              Username
            </Text>
            <TextInput
              value={username}
              onChangeText={setUsername}
              placeholder="Enter your username"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={handleContinue}
              maxLength={30}
            />
            
            {/* Username Guidelines */}
            <Box marginTop="m">
              <Text variant="caption" color="text/secondary">
                • 3-30 characters
              </Text>
              <Text variant="caption" color="text/secondary">
                • Letters, numbers, and underscores only
              </Text>
              <Text variant="caption" color="text/secondary">
                • No spaces or special characters
              </Text>
            </Box>
          </Box>

          {/* Continue Button */}
          <Button
            variant="primary"
            onPress={handleContinue}
            disabled={!isValidUsername || isChecking}
            fullWidth
          >
            {isChecking ? 'Checking availability...' : 'Continue'}
          </Button>
          
          {/* Bottom Spacing */}
          <View style={{ paddingBottom: insets.bottom + 20 }} />
        </Box>
      </ScrollView>
    </View>
  );
}

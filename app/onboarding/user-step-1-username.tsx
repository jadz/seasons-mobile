import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@shopify/restyle';
import { Box, Text, Button, Header, WizardBar, TextInput } from '../../components/ui';
import { Theme } from '../../components/ui/foundation/theme';
import { useAuth } from '../../hooks/auth/useAuth';
import { useOnboarding } from '../../hooks/onboarding/useOnboarding';
import { onboardingLogger } from '../../utils/logger';

export default function UserUsernameScreen() {
  const [username, setUsername] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [availabilityMessage, setAvailabilityMessage] = useState<string>('');
  const [isLoadingCurrentUsername, setIsLoadingCurrentUsername] = useState(false);
  const insets = useSafeAreaInsets();
  const theme = useTheme<Theme>();
  
  const { user } = useAuth();
  const { checkUsernameAvailability, completeUsernameStep, getCurrentUsername, isLoading, error } = useOnboarding();

  const handleBackPress = () => {
    router.back();
  };

  // Load current username when component mounts (for users returning to this step)
  useEffect(() => {
    const loadCurrentUsername = async () => {
      if (!user?.id) return;
      
      onboardingLogger.debug('Username step: Loading current username on mount');
      setIsLoadingCurrentUsername(true);
      
      try {
        const currentUsername = await getCurrentUsername(user.id);
        if (currentUsername) {
          onboardingLogger.info('Username step: Found existing username, populating field', {
            username: currentUsername,
          });
          setUsername(currentUsername);
          setIsAvailable(true); // User's own username is always "available" to them
          setAvailabilityMessage('✓ Your current username');
        } else {
          onboardingLogger.debug('Username step: No existing username found');
        }
      } catch (error) {
        onboardingLogger.error('Username step: Error loading current username', { error });
      } finally {
        setIsLoadingCurrentUsername(false);
      }
    };

    loadCurrentUsername();
  }, [user?.id, getCurrentUsername]);

  // Debounced username availability check
  useEffect(() => {
    const trimmedUsername = username.trim();
    
    // Reset state if username is too short
    if (trimmedUsername.length < 3) {
      setIsAvailable(null);
      setAvailabilityMessage('');
      return;
    }

    // Don't check availability if we're still loading the current username
    if (isLoadingCurrentUsername) {
      return;
    }

    // Debounce the check
    const timeoutId = setTimeout(async () => {
      setIsChecking(true);
      setAvailabilityMessage('');
      
      try {
        // First check if this is the user's current username
        if (user?.id) {
          const currentUsername = await getCurrentUsername(user.id);
          if (currentUsername === trimmedUsername) {
            onboardingLogger.debug('Username step: User re-entered their current username');
            setIsAvailable(true);
            setAvailabilityMessage('✓ Your current username');
            setIsChecking(false);
            return;
          }
        }

        // Check availability for new/different username
        onboardingLogger.debug('Username step: Checking availability for new username', {
          username: trimmedUsername,
        });
        const available = await checkUsernameAvailability(trimmedUsername);
        setIsAvailable(available);
        setAvailabilityMessage(
          available ? '✓ Username is available' : '✗ Username is already taken'
        );
      } catch (err) {
        onboardingLogger.error('Username step: Error checking username availability', { error: err });
        setIsAvailable(null);
        setAvailabilityMessage('');
      } finally {
        setIsChecking(false);
      }
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timeoutId);
  }, [username, checkUsernameAvailability, getCurrentUsername, user?.id, isLoadingCurrentUsername]);

  const handleContinue = async () => {
    onboardingLogger.debug('Username step: handleContinue called', {
      username: username.trim(),
      userId: user?.id,
      isAvailable,
    });

    if (!username.trim() || !user || !isAvailable) {
      onboardingLogger.error('Username step: Invalid state for continue', {
        hasUsername: !!username.trim(),
        hasUser: !!user,
        isAvailable,
      });
      return;
    }
    
    onboardingLogger.debug('Username step: Calling completeUsernameStep');
    const success = await completeUsernameStep(user.id, username);
    
    onboardingLogger.debug('Username step: Result from completeUsernameStep', { success });
    
    if (success) {
      onboardingLogger.info('Username step: Success! Navigating to personal info step');
      router.push('/onboarding/user-step-2-personal-info');
    } else {
      onboardingLogger.error('Username step: Failed to complete username step');
    }
  };

  const isValidUsername = username.trim().length >= 3;
  const canContinue = isValidUsername && isAvailable === true && !isLoading && !isChecking && !isLoadingCurrentUsername;

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
        <WizardBar totalSteps={7} currentStep={0} />
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
              editable={!isLoading && !isLoadingCurrentUsername}
            />
            
            {/* Availability Status */}
            {(isChecking || isLoadingCurrentUsername) && (
              <Box marginTop="m">
                <Text variant="caption" color="text/secondary">
                  {isLoadingCurrentUsername ? 'Loading current username...' : 'Checking availability...'}
                </Text>
              </Box>
            )}
            
            {!isChecking && !isLoadingCurrentUsername && availabilityMessage && (
              <Box marginTop="m">
                <Text 
                  variant="caption" 
                  color={isAvailable ? "text/primary" : "text/secondary"}
                >
                  {availabilityMessage}
                </Text>
              </Box>
            )}
            
            {/* Error Message */}
            {error && (
              <Box marginTop="m" backgroundColor="state/error" padding="m" borderRadius="sm">
                <Text variant="caption" color="text/inverse">
                  {error}
                </Text>
              </Box>
            )}
            
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
            disabled={!canContinue || !user}
            fullWidth
          >
            {isLoading ? 'Saving...' : 'Continue'}
          </Button>
          
          {/* Bottom Spacing */}
          <View style={{ paddingBottom: insets.bottom + 20 }} />
        </Box>
      </ScrollView>
    </View>
  );
}

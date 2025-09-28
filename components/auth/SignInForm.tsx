import React, { useState } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../hooks/auth/useAuth';
import { Box, Text, Button, TextInput } from '../ui';

const SignInForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const { signInWithMagicLink, verifyOtp } = useAuth();

  const handleSignIn = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    setIsLoading(true);
    try {
      await signInWithMagicLink({ email: email.trim() });
      setEmailSent(true);
      setShowOtpInput(true);
    } catch (error) {
      Alert.alert(
        'Sign In Failed',
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      Alert.alert('Error', 'Please enter the verification code');
      return;
    }

    setIsLoading(true);
    try {
      await verifyOtp({ email: email.trim(), otp: otp.trim() });
      // OTP verified successfully - redirect directly
      router.replace('/');
    } catch (error) {
      Alert.alert(
        'Verification Failed',
        error instanceof Error ? error.message : 'Invalid verification code'
      );
      setIsLoading(false);
    }
  };

  if (emailSent && showOtpInput) {
    return (
      <Box flex={1} justifyContent="center">
        {/* Title Section */}
        <Box marginBottom="xl">
          <Text variant="h1" color="text/primary" textAlign="center" marginBottom="md">
            Check your email
          </Text>
          <Text variant="body" color="text/secondary" textAlign="center">
            We've sent a verification code to
          </Text>
          <Text variant="bodyMedium" color="text/primary" textAlign="center" marginTop="xs">
            {email}
          </Text>
        </Box>

        {/* Instructions */}
        <Box marginBottom="xl">
          <Text variant="bodySmall" color="text/secondary" textAlign="center">
            Enter the 6-digit code below or click the magic link in your email to continue.
          </Text>
        </Box>

        {/* Input Section */}
        <Box marginBottom="xl">
          <TextInput
            label="Verification Code"
            placeholder="123456"
            value={otp}
            onChangeText={setOtp}
            keyboardType="number-pad"
            maxLength={6}
            autoComplete="one-time-code"
            textContentType="oneTimeCode"
            editable={!isLoading}
            variant="outlined"
          />
        </Box>

        {/* Action Buttons */}
        <Box gap="md">
          <Button
            variant="primary"
            onPress={handleVerifyOtp}
            disabled={isLoading || !otp.trim()}
            fullWidth
            loading={isLoading}
          >
            {isLoading ? 'Verifying...' : 'Verify Code'}
          </Button>

          <Button
            variant="ghost"
            onPress={() => {
              setEmailSent(false);
              setShowOtpInput(false);
              setOtp('');
              setEmail('');
            }}
            fullWidth
          >
            Try Different Email
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box flex={1} justifyContent="center">
      {/* Welcome Section */}
      <Box marginBottom="xl">
        <Text variant="h1" color="text/primary" textAlign="center" marginBottom="md">
          Sign in to your account
        </Text>
        <Text variant="body" color="text/secondary" textAlign="center">
          Enter your email address and we'll send you a secure magic link to sign in.
        </Text>
      </Box>

      {/* Input Section */}
      <Box marginBottom="xl">
        <TextInput
          label="Email Address"
          placeholder="your@email.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          editable={!isLoading}
          variant="outlined"
          autoCorrect={false}
        />
      </Box>

      {/* Action Button */}
      <Button
        variant="primary"
        onPress={handleSignIn}
        disabled={isLoading || !email.trim()}
        fullWidth
        loading={isLoading}
      >
        {isLoading ? 'Sending...' : 'Send Magic Link'}
      </Button>

      {/* Helper Text */}
      <Box marginTop="xl">
        <Text variant="bodySmall" color="text/secondary" textAlign="center">
          New to Seasons? No worries! We'll create your account automatically when you sign in.
        </Text>
      </Box>
    </Box>
  );
};



export { SignInForm };

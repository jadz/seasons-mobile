import React, { useState } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../hooks/auth/useAuth';
import { Box } from '../ui/Box';
import { Text } from '../ui/Text';
import { Button } from '../ui/Button';
import { TextInput } from '../ui/TextInput';

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
      <Box flex={1} justifyContent="center" padding="l">
        <Text variant="title" color="text" textAlign="center" marginBottom="m">
          Enter Verification Code
        </Text>
        <Text variant="body" color="textSecondary" textAlign="center" marginBottom="xl">
          We've sent a verification code to {email}. Enter the code below or click the magic link in your email.
        </Text>

        <TextInput
          placeholder="Enter 6-digit code"
          value={otp}
          onChangeText={setOtp}
          keyboardType="number-pad"
          maxLength={6}
          autoComplete="one-time-code"
          textContentType="oneTimeCode"
          editable={!isLoading}
          style={{ marginBottom: 20 }}
        />

        <Button
          onPress={handleVerifyOtp}
          disabled={isLoading}
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
          style={{ marginTop: 20 }}
        >
          Try Different Email
        </Button>
      </Box>
    );
  }

  return (
    <Box flex={1} justifyContent="center" padding="l">
      <Text variant="title" color="text" textAlign="center" marginBottom="m">
        Welcome to Seasons
      </Text>
      <Text variant="body" color="textSecondary" textAlign="center" marginBottom="xl">
        Enter your email to get started. We'll send you a magic link to sign in.
      </Text>

      <TextInput
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        editable={!isLoading}
        style={{ marginBottom: 20 }}
      />

      <Button
        onPress={handleSignIn}
        disabled={isLoading}
      >
        {isLoading ? 'Sending...' : 'Send Magic Link'}
      </Button>
    </Box>
  );
};



export { SignInForm };

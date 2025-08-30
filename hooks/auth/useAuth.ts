import { useObservable } from '@legendapp/state/react';
import { authStore } from '../../store/auth/authStore';
import { AuthService } from '../../domain/services/auth/AuthService';
import { SignInRequest, VerifyOtpRequest, OnboardingData } from '../../domain/models/auth';

export const useAuth = () => {
  const authState = useObservable(authStore);

  const signInWithMagicLink = async (request: SignInRequest) => {
    try {
      await AuthService.signInWithMagicLink(request);
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const verifyOtp = async (request: VerifyOtpRequest) => {
    try {
      await AuthService.verifyOtp(request);
    } catch (error) {
      console.error('OTP verification error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await AuthService.signOut();
      authStore.reset();
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const completeOnboarding = async (onboardingData?: OnboardingData) => {
    try {
      if (onboardingData) {
        const updatedUser = await AuthService.completeOnboarding(onboardingData);
        authStore.setUser(updatedUser);
      } else {
        await AuthService.markOnboardingComplete();
        // Refresh user data
        const user = await AuthService.getCurrentUser();
        authStore.setUser(user);
      }
    } catch (error) {
      console.error('Onboarding error:', error);
      throw error;
    }
  };

  return {
    user: authState.user.get(),
    isLoading: authState.isLoading.get(),
    isAuthenticated: authState.isAuthenticated.get(),
    signInWithMagicLink,
    verifyOtp,
    signOut,
    completeOnboarding,
  };
};

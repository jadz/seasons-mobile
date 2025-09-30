import { useState, useCallback } from 'react';
import { onboardingService } from '../../domain/services/onboarding/OnboardingService';
import { UserOnboardingProgress } from '../../domain/models/userOnboarding';
import { UserPreferencesOnboardingData } from '../../domain/views/userPreferencesViews';
import { onboardingLogger } from '../../utils/logger';

/**
 * Hook for managing user onboarding flow
 * 
 * Provides methods to complete onboarding steps and check progress.
 * Follows architecture pattern: UI -> Hook -> Service -> Repository -> DB
 */
export const useOnboarding = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Check if username is available
   */
  const checkUsernameAvailability = useCallback(async (username: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      return await onboardingService.checkUsernameAvailability(username);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to check username';
      setError(errorMessage);
      console.error('Error checking username:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Complete the username step
   */
  const completeUsernameStep = useCallback(async (userId: string, username: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      await onboardingService.completeUsernameStep(userId, username);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save username';
      setError(errorMessage);
      console.error('Error completing username step:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Complete the personal info step
   */
  const completePersonalInfoStep = useCallback(async (
    userId: string, 
    personalInfo: {
      firstName?: string;
      sex: 'male' | 'female' | 'other';
      birthYear: number;
    }
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      await onboardingService.completePersonalInfoStep(userId, personalInfo);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save personal info';
      setError(errorMessage);
      console.error('Error completing personal info step:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Complete the unit preferences step
   */
  const completeUnitPreferencesStep = useCallback(async (
    userId: string, 
    preferencesData: UserPreferencesOnboardingData
  ): Promise<boolean> => {
    onboardingLogger.debug('useOnboarding.completeUnitPreferencesStep called', {
      userId,
      preferencesData,
    });

    setIsLoading(true);
    setError(null);

    try {
      onboardingLogger.debug('useOnboarding: Calling onboardingService.completeUnitPreferencesStep');
      await onboardingService.completeUnitPreferencesStep(userId, preferencesData);
      
      onboardingLogger.info('useOnboarding: Unit preferences step completed successfully');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save preferences';
      onboardingLogger.error('useOnboarding: Error completing unit preferences step', {
        error: err,
        errorMessage,
      });
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
      onboardingLogger.debug('useOnboarding: Loading state set to false');
    }
  }, []);

  /**
   * Get user's current onboarding progress
   */
  const getProgress = useCallback(async (userId: string): Promise<UserOnboardingProgress | null> => {
    setIsLoading(true);
    setError(null);

    try {
      return await onboardingService.getOnboardingProgress(userId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get progress';
      setError(errorMessage);
      console.error('Error getting onboarding progress:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Check if user has completed onboarding
   */
  const checkCompletion = useCallback(async (userId: string): Promise<boolean> => {
    try {
      return await onboardingService.hasCompletedOnboarding(userId);
    } catch (err) {
      console.error('Error checking onboarding completion:', err);
      return false;
    }
  }, []);

  return {
    checkUsernameAvailability,
    completeUsernameStep,
    completePersonalInfoStep,
    completeUnitPreferencesStep,
    getProgress,
    checkCompletion,
    isLoading,
    error,
  };
};

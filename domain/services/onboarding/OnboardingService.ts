import { IUserOnboardingRepository, userOnboardingRepository } from '../../../db/repositories/UserOnboardingRepository';
import { IUserRepository, userRepository } from '../../../db/repositories/UserRepository';
import { UserOnboardingProgress } from '../../models/userOnboarding';

/**
 * Service for managing user onboarding flow
 * 
 * This service orchestrates the onboarding journey using a simple
 * ONE record per user approach that gets updated as they progress.
 */
export class OnboardingService {
  constructor(
    private readonly onboardingRepository: IUserOnboardingRepository,
    private readonly userRepository: IUserRepository
  ) {}

  /**
   * Check if a username is available
   * @param username The username to check
   * @returns True if available, false if taken
   */
  async checkUsernameAvailability(username: string): Promise<boolean> {
    if (!username || username.trim().length === 0) {
      throw new Error('Username is required');
    }

    try {
      return await this.userRepository.isUsernameAvailable(username.trim());
    } catch (error) {
      console.error('Error checking username availability:', error);
      throw error;
    }
  }

  /**
   * Complete the username step
   * @param userId The user ID
   * @param username The chosen username
   * @throws Error if username is empty, taken, or update fails
   */
  async completeUsernameStep(userId: string, username: string): Promise<void> {
    if (!username || username.trim().length === 0) {
      throw new Error('Username is required');
    }

    try {
      // Check if username is available before saving
      const isAvailable = await this.userRepository.isUsernameAvailable(username.trim());
      if (!isAvailable) {
        throw new Error('Username is already taken');
      }

      // Check if profile exists, create if not
      await this.ensureUserProfile(userId);

      // Save username to user profile
      await this.userRepository.updateProfile(userId, { username: username.trim() });

      // Update onboarding progress (upsert - creates or updates)
      await this.onboardingRepository.upsert({
        userId,
        currentStepName: 'username',
        currentStepNumber: '1',
      });
    } catch (error) {
      console.error('Error completing username step:', error);
      throw error;
    }
  }

  /**
   * Complete the personal info step
   * @param userId The user ID
   * @param personalInfo The personal information data
   * @throws Error if required fields are missing or update fails
   */
  async completePersonalInfoStep(
    userId: string, 
    personalInfo: {
      firstName?: string;
      sex: 'male' | 'female' | 'other';
      birthYear: number;
    }
  ): Promise<void> {
    if (!personalInfo.sex) {
      throw new Error('Sex is required');
    }

    if (!personalInfo.birthYear || personalInfo.birthYear < 1900 || personalInfo.birthYear > new Date().getFullYear()) {
      throw new Error('Valid birth year is required');
    }

    try {
      // Check if profile exists, create if not
      await this.ensureUserProfile(userId);

      // Prepare profile update data
      const profileUpdate: any = {
        sex: personalInfo.sex,
        birthYear: personalInfo.birthYear,
      };

      // Add first name if provided
      if (personalInfo.firstName && personalInfo.firstName.trim().length > 0) {
        profileUpdate.firstName = personalInfo.firstName.trim();
      }

      // Save personal info to user profile
      await this.userRepository.updateProfile(userId, profileUpdate);

      // Update onboarding progress
      await this.onboardingRepository.upsert({
        userId,
        currentStepName: 'personal_info',
        currentStepNumber: '2',
      });
    } catch (error) {
      console.error('Error completing personal info step:', error);
      throw error;
    }
  }

  /**
   * Complete the unit preferences step
   * @param userId The user ID
   * @throws Error if update fails
   */
  async completeUnitPreferencesStep(userId: string): Promise<void> {
    try {
      // Update onboarding progress
      await this.onboardingRepository.upsert({
        userId,
        currentStepName: 'unit_preferences',
        currentStepNumber: '3',
      });
    } catch (error) {
      console.error('Error completing unit preferences step:', error);
      throw error;
    }
  }

  /**
   * Get user's current onboarding progress
   * @param userId The user ID
   * @returns Progress or null if user hasn't started onboarding
   */
  async getOnboardingProgress(userId: string): Promise<UserOnboardingProgress | null> {
    try {
      return await this.onboardingRepository.findByUserId(userId);
    } catch (error) {
      console.error('Error getting onboarding progress:', error);
      throw error;
    }
  }

  /**
   * Check if user has completed all onboarding steps
   * @param userId The user ID
   * @returns True if onboarding is complete, false otherwise
   */
  async hasCompletedOnboarding(userId: string): Promise<boolean> {
    try {
      return await this.onboardingRepository.hasCompletedOnboarding(userId);
    } catch (error) {
      console.error('Error checking onboarding completion:', error);
      throw error;
    }
  }

  /**
   * Ensure user profile exists, create if it doesn't
   * @param userId The user ID
   * @private
   */
  private async ensureUserProfile(userId: string): Promise<void> {
    try {
      const existingProfile = await this.userRepository.findProfileByUserId(userId);
      
      if (!existingProfile) {
        // Create a minimal profile - fields will be updated in subsequent steps
        await this.userRepository.createProfile(userId, {});
      }
    } catch (error) {
      console.error('Error ensuring user profile exists:', error);
      throw error;
    }
  }
}

// Export singleton instance for easy consumption
export const onboardingService = new OnboardingService(
  userOnboardingRepository,
  userRepository
);
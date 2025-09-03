import { IUserPreferencesRepository } from '../../db/repositories/UserPreferencesRepository';
import {
  UserPreferences,
  DEFAULT_USER_PREFERENCES
} from '../models/userPreferences';
import {
  UserPreferencesData,
  UserPreferencesUpdate,
  UserPreferencesView,
  UserPreferencesOnboardingData
} from '../views/userPreferencesViews';

/**
 * Service for managing user preferences including advanced logging toggle and unit preferences
 * 
 * This service provides business logic for user preferences management with offline-first approach.
 * It coordinates between the repository layer and provides meaningful error handling.
 */
export class UserPreferencesService {
  constructor(
    private readonly userPreferencesRepository: IUserPreferencesRepository
  ) {}

  /**
   * Get user preferences. Returns default preferences if none exist.
   * @param userId The user ID
   * @returns User preferences (existing or default)
   */
  async getUserPreferences(userId: string): Promise<UserPreferencesView> {
    try {
      const existing = await this.userPreferencesRepository.findByUserId(userId);
      
      if (existing) {
        return existing;
      }

      // Return default preferences if none exist
      const defaultPrefs = UserPreferences.createDefault(userId);
      return {
        id: '', // No ID for non-persisted defaults
        userId,
        ...defaultPrefs,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    } catch (error) {
      console.error('Error getting user preferences:', error);
      throw new Error('Failed to get user preferences');
    }
  }

  /**
   * Create new user preferences during onboarding
   * @param userId The user ID
   * @param onboardingData The preferences data from onboarding
   * @returns The created preferences
   * @throws Error if user already has preferences or data is invalid
   */
  async createUserPreferences(userId: string, onboardingData: UserPreferencesOnboardingData): Promise<UserPreferencesView> {
    try {
      // Validate the onboarding data
      if (!UserPreferences.validate(onboardingData)) {
        throw new Error('Invalid preferences data');
      }

      const preferencesData: UserPreferencesData = {
        userId,
        ...onboardingData,
        advancedLoggingEnabled: false, // Default for new users
      };

      const preferencesId = await this.userPreferencesRepository.create(preferencesData);
      const created = await this.userPreferencesRepository.findById(preferencesId);
      
      if (!created) {
        throw new Error('Failed to retrieve created preferences');
      }

      return created;
    } catch (error) {
      console.error('Error creating user preferences:', error);
      if (error instanceof Error && error.message.includes('already exist')) {
        throw new Error('User already has preferences');
      }
      throw error;
    }
  }

  /**
   * Update user preferences. Creates new preferences if none exist.
   * @param userId The user ID
   * @param updateData The data to update
   * @returns The updated preferences
   */
  async updateUserPreferences(userId: string, updateData: UserPreferencesUpdate): Promise<UserPreferencesView> {
    try {
      // Validate the update data
      if (!UserPreferences.validate(updateData)) {
        throw new Error('Invalid preferences data');
      }

      const existing = await this.userPreferencesRepository.findByUserId(userId);
      
      if (existing) {
        // Update existing preferences
        await this.userPreferencesRepository.update(existing.id, updateData);
        const updated = await this.userPreferencesRepository.findById(existing.id);
        
        if (!updated) {
          throw new Error('Failed to retrieve updated preferences');
        }
        
        return updated;
      } else {
        // Create new preferences with defaults + updates
        const defaultPrefs = UserPreferences.createDefault(userId);
        const newPreferencesData: UserPreferencesData = {
          ...defaultPrefs,
          ...updateData,
        };
        
        return await this.userPreferencesRepository.createOrUpdate(userId, newPreferencesData);
      }
    } catch (error) {
      console.error('Error updating user preferences:', error);
      throw error;
    }
  }

  /**
   * Delete user preferences
   * @param userId The user ID
   * @throws Error if user has no preferences
   */
  async deleteUserPreferences(userId: string): Promise<void> {
    try {
      const existing = await this.userPreferencesRepository.findByUserId(userId);
      
      if (!existing) {
        throw new Error('User preferences not found');
      }

      await this.userPreferencesRepository.delete(existing.id);
    } catch (error) {
      console.error('Error deleting user preferences:', error);
      throw error;
    }
  }

  /**
   * Check if advanced logging is enabled for user
   * @param userId The user ID
   * @returns True if advanced logging is enabled, false otherwise (including when no preferences exist)
   */
  async isAdvancedLoggingEnabled(userId: string): Promise<boolean> {
    try {
      const preferences = await this.userPreferencesRepository.findByUserId(userId);
      return preferences?.advancedLoggingEnabled || false;
    } catch (error) {
      console.error('Error checking advanced logging status:', error);
      return false; // Default to false on error
    }
  }
}

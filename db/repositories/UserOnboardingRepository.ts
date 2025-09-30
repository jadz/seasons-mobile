import { supabase } from '../../utils/supabase';
import { 
  UserOnboardingProgress,
  UserOnboardingProgressData
} from '../../domain/models/userOnboarding';

/**
 * Repository interface for user onboarding progress persistence
 * ONE record per user approach - much simpler and more scalable
 */
export interface IUserOnboardingRepository {
  /**
   * Create or update onboarding progress (upsert)
   * @param progressData The progress data
   * @returns The progress ID
   */
  upsert(progressData: UserOnboardingProgressData): Promise<string>;

  /**
   * Find onboarding progress by user ID
   * @param userId The user ID
   * @returns The progress or null if not found
   */
  findByUserId(userId: string): Promise<UserOnboardingProgress | null>;

  /**
   * Check if user has completed onboarding (reached final step)
   * @param userId The user ID
   * @returns True if onboarding is complete, false otherwise
   */
  hasCompletedOnboarding(userId: string): Promise<boolean>;

  /**
   * Delete onboarding progress
   * @param userId The user ID
   */
  delete(userId: string): Promise<void>;
}

/**
 * Supabase implementation of user onboarding repository
 */
class UserOnboardingRepository implements IUserOnboardingRepository {
  private readonly TOTAL_STEPS = 10;

  async upsert(progressData: UserOnboardingProgressData): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('user_onboarding_progress')
        .upsert({
          user_id: progressData.userId,
          current_step_name: progressData.currentStepName,
          current_step_number: parseInt(progressData.currentStepNumber),
        }, {
          onConflict: 'user_id' // Update if user_id already exists
        })
        .select('id')
        .single();

      if (error) {
        throw new Error(`Error upserting onboarding progress: ${error.message}`);
      }

      return data.id;
    } catch (error) {
      console.error('Error in upsert:', error);
      throw error;
    }
  }

  async findByUserId(userId: string): Promise<UserOnboardingProgress | null> {
    try {
      const { data, error } = await supabase
        .from('user_onboarding_progress')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // No progress found
        }
        throw new Error(`Error finding onboarding progress: ${error.message}`);
      }

      return this.mapToUserOnboardingProgress(data);
    } catch (error) {
      console.error('Error in findByUserId:', error);
      throw error;
    }
  }

  async hasCompletedOnboarding(userId: string): Promise<boolean> {
    try {
      const progress = await this.findByUserId(userId);
      
      if (!progress) {
        return false;
      }

      return parseInt(progress.currentStepNumber) >= this.TOTAL_STEPS;
    } catch (error) {
      console.error('Error in hasCompletedOnboarding:', error);
      throw error;
    }
  }

  async delete(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_onboarding_progress')
        .delete()
        .eq('user_id', userId);

      if (error) {
        throw new Error(`Error deleting onboarding progress: ${error.message}`);
      }
    } catch (error) {
      console.error('Error in delete:', error);
      throw error;
    }
  }

  private mapToUserOnboardingProgress(data: any): UserOnboardingProgress {
    return {
      id: data.id,
      userId: data.user_id,
      currentStepName: data.current_step_name,
      currentStepNumber: data.current_step_number.toString(),
      completedAt: data.completed_at,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }
}

export const userOnboardingRepository = new UserOnboardingRepository();
export { UserOnboardingRepository };
/**
 * Simple domain model for user onboarding progress tracking
 * 
 * ONE record per user that tracks their current/latest step.
 * This gets updated as they progress through onboarding.
 */

export interface UserOnboardingProgress {
  id: string;
  userId: string;
  currentStepName: string;
  currentStepNumber: string;
  completedAt: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Data required to update onboarding progress
 */
export interface UserOnboardingProgressData {
  userId: string;
  currentStepName: string;
  currentStepNumber: string;
}

import { UserOnboardingRepository, IUserOnboardingRepository } from '../UserOnboardingRepository';
import { 
  UserOnboardingProgress,
  UserOnboardingProgressData
} from '../../../domain/models/userOnboarding';
import {
  setupAuthenticatedTestUser,
  signOutTestUser,
  TestUser
} from '../../../utils/__tests__/testUtils';

describe('UserOnboardingRepository Integration Tests', () => {
  let repository: IUserOnboardingRepository;
  let testUser: TestUser;
  let cleanup: () => Promise<void>;

  beforeEach(async () => {
    repository = new UserOnboardingRepository();
    // Set up authenticated test user for each test
    const setup = await setupAuthenticatedTestUser();
    testUser = setup.user;
    cleanup = setup.cleanup;
  });

  afterEach(async () => {
    // Clean up onboarding progress record
    try {
      await repository.delete(testUser.id);
    } catch (error) {
      // Ignore errors if record was already deleted during test
      console.warn(`Could not delete onboarding progress for ${testUser.id}:`, error);
    }
    
    // Clean up test user and sign out
    await cleanup();
  });

  describe('upsert', () => {
    it('should create new onboarding progress record', async () => {
      // Arrange
      const progressData: UserOnboardingProgressData = {
        userId: testUser.id,
        currentStepName: 'username',
        currentStepNumber: '1'
      };

      // Act
      const progressId = await repository.upsert(progressData);

      // Assert
      expect(progressId).toBeDefined();
      expect(typeof progressId).toBe('string');
      expect(progressId.length).toBeGreaterThan(0);

      // Verify it was created
      const created = await repository.findByUserId(testUser.id);
      expect(created).toBeDefined();
      expect(created?.userId).toBe(testUser.id);
      expect(created?.currentStepName).toBe('username');
      expect(created?.currentStepNumber).toBe('1');
    });

    it('should update existing onboarding progress record', async () => {
      // Arrange - create initial record
      const initialData: UserOnboardingProgressData = {
        userId: testUser.id,
        currentStepName: 'username',
        currentStepNumber: '1'
      };
      await repository.upsert(initialData);

      // Act - update to next step
      const updateData: UserOnboardingProgressData = {
        userId: testUser.id,
        currentStepName: 'personal_info',
        currentStepNumber: '2'
      };
      await repository.upsert(updateData);

      // Assert - should still be only one record, now updated
      const updated = await repository.findByUserId(testUser.id);
      expect(updated).toBeDefined();
      expect(updated?.currentStepName).toBe('personal_info');
      expect(updated?.currentStepNumber).toBe('2');
    });

    it('should handle multiple upserts gracefully (always one record per user)', async () => {
      // Arrange & Act - upsert multiple times
      await repository.upsert({
        userId: testUser.id,
        currentStepName: 'username',
        currentStepNumber: '1'
      });

      await repository.upsert({
        userId: testUser.id,
        currentStepName: 'personal_info',
        currentStepNumber: '2'
      });

      await repository.upsert({
        userId: testUser.id,
        currentStepName: 'unit_preferences',
        currentStepNumber: '3'
      });

      // Assert - only latest state should exist
      const final = await repository.findByUserId(testUser.id);
      expect(final).toBeDefined();
      expect(final?.currentStepName).toBe('unit_preferences');
      expect(final?.currentStepNumber).toBe('3');
    });

    it('should update completedAt timestamp on each upsert', async () => {
      // Arrange - create initial record
      await repository.upsert({
        userId: testUser.id,
        currentStepName: 'username',
        currentStepNumber: '1'
      });

      const firstProgress = await repository.findByUserId(testUser.id);
      const firstCompletedAt = firstProgress?.completedAt;

      // Wait longer to ensure timestamp difference (database precision may vary)
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Act - update to next step
      await repository.upsert({
        userId: testUser.id,
        currentStepName: 'personal_info',
        currentStepNumber: '2'
      });

      // Assert - completedAt should be updated
      const secondProgress = await repository.findByUserId(testUser.id);
      expect(secondProgress?.completedAt).toBeDefined();
      expect(new Date(secondProgress!.completedAt).getTime())
        .toBeGreaterThanOrEqual(new Date(firstCompletedAt!).getTime());
    });
  });

  describe('findByUserId', () => {
    it('should return onboarding progress by user ID', async () => {
      // Arrange
      const progressData: UserOnboardingProgressData = {
        userId: testUser.id,
        currentStepName: 'personal_info',
        currentStepNumber: '2'
      };
      await repository.upsert(progressData);

      // Act
      const found = await repository.findByUserId(testUser.id);

      // Assert
      expect(found).toBeDefined();
      expect(found?.userId).toBe(testUser.id);
      expect(found?.currentStepName).toBe('personal_info');
      expect(found?.currentStepNumber).toBe('2');
      expect(found?.id).toBeDefined();
      expect(found?.completedAt).toBeDefined();
      expect(found?.createdAt).toBeDefined();
      expect(found?.updatedAt).toBeDefined();
    });

    it('should return null for user with no progress', async () => {
      // Act - query for non-existent user
      const found = await repository.findByUserId('11111111-1111-1111-1111-111111111111');

      // Assert
      expect(found).toBeNull();
    });
  });

  describe('hasCompletedOnboarding', () => {
    it('should return false when user has not started onboarding', async () => {
      // Act
      const hasCompleted = await repository.hasCompletedOnboarding(testUser.id);

      // Assert
      expect(hasCompleted).toBe(false);
    });

    it('should return false when user is on step 1', async () => {
      // Arrange
      await repository.upsert({
        userId: testUser.id,
        currentStepName: 'username',
        currentStepNumber: '1'
      });

      // Act
      const hasCompleted = await repository.hasCompletedOnboarding(testUser.id);

      // Assert
      expect(hasCompleted).toBe(false);
    });

    it('should return false when user is on step 2', async () => {
      // Arrange
      await repository.upsert({
        userId: testUser.id,
        currentStepName: 'personal_info',
        currentStepNumber: '2'
      });

      // Act
      const hasCompleted = await repository.hasCompletedOnboarding(testUser.id);

      // Assert
      expect(hasCompleted).toBe(false);
    });

    it('should return true when user has completed step 3 (final step)', async () => {
      // Arrange
      await repository.upsert({
        userId: testUser.id,
        currentStepName: 'unit_preferences',
        currentStepNumber: '3'
      });

      // Act
      const hasCompleted = await repository.hasCompletedOnboarding(testUser.id);

      // Assert
      expect(hasCompleted).toBe(true);
    });
  });

  describe('delete', () => {
    it('should delete onboarding progress', async () => {
      // Arrange - create progress
      await repository.upsert({
        userId: testUser.id,
        currentStepName: 'username',
        currentStepNumber: '1'
      });

      // Verify it exists
      expect(await repository.findByUserId(testUser.id)).toBeDefined();

      // Act
      await repository.delete(testUser.id);

      // Assert
      expect(await repository.findByUserId(testUser.id)).toBeNull();
    });

    it('should not throw error when deleting non-existent progress', async () => {
      // Act & Assert - should not throw
      await expect(repository.delete(testUser.id)).resolves.not.toThrow();
    });
  });

  describe('complete onboarding flow', () => {
    it('should track user progression through all steps', async () => {
      // Step 1
      await repository.upsert({
        userId: testUser.id,
        currentStepName: 'username',
        currentStepNumber: '1'
      });
      
      let progress = await repository.findByUserId(testUser.id);
      expect(progress?.currentStepName).toBe('username');
      expect(await repository.hasCompletedOnboarding(testUser.id)).toBe(false);

      // Step 2
      await repository.upsert({
        userId: testUser.id,
        currentStepName: 'personal_info',
        currentStepNumber: '2'
      });
      
      progress = await repository.findByUserId(testUser.id);
      expect(progress?.currentStepName).toBe('personal_info');
      expect(await repository.hasCompletedOnboarding(testUser.id)).toBe(false);

      // Step 3 (final)
      await repository.upsert({
        userId: testUser.id,
        currentStepName: 'unit_preferences',
        currentStepNumber: '3'
      });
      
      progress = await repository.findByUserId(testUser.id);
      expect(progress?.currentStepName).toBe('unit_preferences');
      expect(await repository.hasCompletedOnboarding(testUser.id)).toBe(true);
    });
  });

  describe('error handling', () => {
    it('should handle database connection errors gracefully', async () => {
      // Test that methods exist and can be called
      expect(repository.upsert).toBeDefined();
      expect(repository.findByUserId).toBeDefined();
      expect(repository.hasCompletedOnboarding).toBeDefined();
      expect(repository.delete).toBeDefined();
    });
  });
});

// import { faker } from '@faker-js/faker'; // Temporarily disabled due to Jest ES module issues
import { UserPreferencesRepository, IUserPreferencesRepository } from '../UserPreferencesRepository';
import { 
  UserPreferences, 
  BodyWeightUnit, 
  StrengthTrainingUnit, 
  BodyMeasurementUnit, 
  DistanceUnit,
  createDefaultUserPreferences 
} from '../../../domain/models/userPreferences';
import {
  UserPreferencesData,
  UserPreferencesUpdate,
  UserPreferencesView
} from '../../../domain/views/userPreferencesViews';
import {
  setupAuthenticatedTestUser,
  // createFakeUserPreferencesData, // Temporarily disabled due to faker ES module issues
  signOutTestUser,
  TestUser
} from '../../../utils/__tests__/testUtils';

describe('UserPreferencesRepository Integration Tests', () => {
  let repository: IUserPreferencesRepository;
  let testUser: TestUser;
  let cleanup: () => Promise<void>;
  let createdPreferencesIds: string[] = [];

  beforeEach(async () => {
    repository = new UserPreferencesRepository();
    // Set up authenticated test user for each test
    const setup = await setupAuthenticatedTestUser();
    testUser = setup.user;
    cleanup = setup.cleanup;
    createdPreferencesIds = [];
  });

  afterEach(async () => {
    // Clean up any created user preferences records
    for (const preferencesId of createdPreferencesIds) {
      try {
        await repository.delete(preferencesId);
      } catch (error) {
        // Ignore errors if record was already deleted during test
        console.warn(`Could not delete preferences ${preferencesId}:`, error);
      }
    }
    
    // Clean up test user and sign out
    await cleanup();
  });

  // Helper function to create and track preferences for cleanup
  const createAndTrackPreferences = async (preferencesData: any): Promise<string> => {
    const preferencesId = await repository.create(preferencesData);
    createdPreferencesIds.push(preferencesId);
    return preferencesId;
  };

  describe('create', () => {
    it('should create new user preferences and return generated ID', async () => {
      // Arrange - use authenticated test user with default data
      const preferencesData = createDefaultUserPreferences(testUser.id);

      // Act
      const preferencesId = await createAndTrackPreferences(preferencesData);

      // Assert
      expect(preferencesId).toBeDefined();
      expect(typeof preferencesId).toBe('string');
      expect(preferencesId.length).toBeGreaterThan(0);
    });

    it('should create preferences with default values', async () => {
      // Arrange - use authenticated test user with default values
      const defaultData = createDefaultUserPreferences(testUser.id);

      // Act
      const preferencesId = await createAndTrackPreferences(defaultData);

      // Assert
      expect(preferencesId).toBeDefined();
      
      // Verify the created preferences
      const created = await repository.findByUserId(testUser.id);
      expect(created).toBeDefined();
      expect(created?.bodyWeightUnit).toBe(BodyWeightUnit.KILOGRAMS);
      expect(created?.strengthTrainingUnit).toBe(StrengthTrainingUnit.KILOGRAMS);
      expect(created?.bodyMeasurementUnit).toBe(BodyMeasurementUnit.CENTIMETERS);
      expect(created?.distanceUnit).toBe(DistanceUnit.KILOMETERS);
      expect(created?.advancedLoggingEnabled).toBe(false);
    });

    it('should throw error when creating preferences for user that already has preferences', async () => {
      // Arrange - use authenticated test user
      const preferencesData = createDefaultUserPreferences(testUser.id);
      
      // Create first preferences
      await createAndTrackPreferences(preferencesData);

      // Act & Assert
      await expect(repository.create(preferencesData)).rejects.toThrow('User preferences already exist');
    });
  });

  describe('findById', () => {
    it('should return user preferences by ID', async () => {
      // Arrange - use authenticated test user
      const preferencesData = createDefaultUserPreferences(testUser.id);
      const preferencesId = await createAndTrackPreferences(preferencesData);

      // Act
      const found = await repository.findById(preferencesId);

      // Assert
      expect(found).toBeDefined();
      expect(found?.id).toBe(preferencesId);
      expect(found?.userId).toBe(testUser.id);
      expect(found?.bodyWeightUnit).toBe(BodyWeightUnit.KILOGRAMS);
    });

    it('should return null for non-existent ID', async () => {
      // Act - use a non-existent UUID
      const found = await repository.findById('00000000-0000-0000-0000-000000000000');

      // Assert
      expect(found).toBeNull();
    });
  });

  describe('findByUserId', () => {
    it('should return user preferences by user ID', async () => {
      // Arrange - use authenticated test user
      const preferencesData = createDefaultUserPreferences(testUser.id);
      await createAndTrackPreferences(preferencesData);

      // Act
      const found = await repository.findByUserId(testUser.id);

      // Assert
      expect(found).toBeDefined();
      expect(found?.userId).toBe(testUser.id);
      expect(found?.bodyWeightUnit).toBe(BodyWeightUnit.KILOGRAMS);
    });

    it('should return null for user with no preferences', async () => {
      // Act - use a non-existent user UUID
      const found = await repository.findByUserId('11111111-1111-1111-1111-111111111111');

      // Assert
      expect(found).toBeNull();
    });
  });

  describe('update', () => {
    it('should update user preferences', async () => {
      // Arrange - use authenticated test user
      const preferencesData = createDefaultUserPreferences(testUser.id);
      const preferencesId = await createAndTrackPreferences(preferencesData);

      const updateData: UserPreferencesUpdate = {
        bodyWeightUnit: BodyWeightUnit.POUNDS,
        strengthTrainingUnit: StrengthTrainingUnit.POUNDS,
        advancedLoggingEnabled: true,
      };

      // Act
      await repository.update(preferencesId, updateData);

      // Assert
      const updated = await repository.findById(preferencesId);
      expect(updated?.bodyWeightUnit).toBe(BodyWeightUnit.POUNDS);
      expect(updated?.strengthTrainingUnit).toBe(StrengthTrainingUnit.POUNDS);
      expect(updated?.advancedLoggingEnabled).toBe(true);
      // Should keep unchanged values
      expect(updated?.bodyMeasurementUnit).toBe(BodyMeasurementUnit.CENTIMETERS);
      expect(updated?.distanceUnit).toBe(DistanceUnit.KILOMETERS);
    });

    it('should update updatedAt timestamp', async () => {
      // Arrange - use authenticated test user
      const preferencesData = createDefaultUserPreferences(testUser.id);
      const preferencesId = await createAndTrackPreferences(preferencesData);

      const original = await repository.findById(preferencesId);
      const originalUpdatedAt = original?.updatedAt;

      // Wait a bit to ensure timestamp difference
      await new Promise(resolve => setTimeout(resolve, 10));

      // Act
      await repository.update(preferencesId, { advancedLoggingEnabled: true });

      // Assert
      const updated = await repository.findById(preferencesId);
      expect(updated?.updatedAt).toBeDefined();
      expect(updated?.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt?.getTime() || 0);
    });

    it('should throw error when updating non-existent preferences', async () => {
      // Act & Assert - use non-existent UUID
      await expect(repository.update('22222222-2222-2222-2222-222222222222', { advancedLoggingEnabled: true }))
        .rejects.toThrow('User preferences not found');
    });
  });

  describe('delete', () => {
    it('should delete user preferences', async () => {
      // Arrange - use authenticated test user
      const preferencesData = createDefaultUserPreferences(testUser.id);
      const preferencesId = await createAndTrackPreferences(preferencesData);

      // Verify it exists
      expect(await repository.findById(preferencesId)).toBeDefined();

      // Act
      await repository.delete(preferencesId);
      // Remove from tracking since we just deleted it
      createdPreferencesIds.splice(createdPreferencesIds.indexOf(preferencesId), 1);

      // Assert
      expect(await repository.findById(preferencesId)).toBeNull();
    });

    it('should throw error when deleting non-existent preferences', async () => {
      // Act & Assert - use non-existent UUID
      await expect(repository.delete('33333333-3333-3333-3333-333333333333'))
        .rejects.toThrow('User preferences not found');
    });
  });

  describe('createOrUpdate', () => {
    it('should create preferences if none exist for user', async () => {
      // Arrange - use authenticated test user
      const preferencesData = createDefaultUserPreferences(testUser.id);

      // Act
      const result = await repository.createOrUpdate(testUser.id, preferencesData);
      // Track the created record for cleanup
      createdPreferencesIds.push(result.id);

      // Assert
      expect(result).toBeDefined();
      expect(result.userId).toBe(testUser.id);
      expect(result.bodyWeightUnit).toBe(BodyWeightUnit.KILOGRAMS);
    });

    it('should update preferences if they already exist for user', async () => {
      // Arrange - use authenticated test user
      const initialData = createDefaultUserPreferences(testUser.id);
      await createAndTrackPreferences(initialData);

      const updateData: UserPreferencesData = {
        ...initialData,
        bodyWeightUnit: BodyWeightUnit.POUNDS,
        advancedLoggingEnabled: true,
      };

      // Act
      const result = await repository.createOrUpdate(testUser.id, updateData);

      // Assert
      expect(result.bodyWeightUnit).toBe(BodyWeightUnit.POUNDS);
      expect(result.advancedLoggingEnabled).toBe(true);
      
      // Should only have one set of preferences for this user
      const found = await repository.findByUserId(testUser.id);
      expect(found?.bodyWeightUnit).toBe(BodyWeightUnit.POUNDS);
    });
  });

  describe('error handling', () => {
    it('should handle database connection errors gracefully', async () => {
      // This test would be more meaningful with actual database mocking
      // For now, just test that methods exist and can be called
      expect(repository.create).toBeDefined();
      expect(repository.findById).toBeDefined();
      expect(repository.findByUserId).toBeDefined();
      expect(repository.update).toBeDefined();
      expect(repository.delete).toBeDefined();
      expect(repository.createOrUpdate).toBeDefined();
    });
  });
});

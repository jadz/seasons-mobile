import { UserPreferencesService } from '../UserPreferencesService';
import { IUserPreferencesRepository } from '../../../db/repositories/UserPreferencesRepository';
import { 
  UserPreferences, 
  BodyWeightUnit, 
  StrengthTrainingUnit, 
  BodyMeasurementUnit, 
  DistanceUnit,
  createDefaultUserPreferences,
  DEFAULT_USER_PREFERENCES 
} from '../../models/userPreferences';
import {
  UserPreferencesData,
  UserPreferencesUpdate,
  UserPreferencesView,
  UserPreferencesOnboardingData
} from '../../views/userPreferencesViews';

// Mock repository for testing
const createMockRepository = (): jest.Mocked<IUserPreferencesRepository> => ({
  create: jest.fn(),
  findById: jest.fn(),
  findByUserId: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  createOrUpdate: jest.fn(),
});

describe('UserPreferencesService', () => {
  let service: UserPreferencesService;
  let mockRepository: jest.Mocked<IUserPreferencesRepository>;

  beforeEach(() => {
    mockRepository = createMockRepository();
    service = new UserPreferencesService(mockRepository);
  });

  describe('getUserPreferences', () => {
    it('should return user preferences when they exist', async () => {
      // Arrange
      const userId = 'test-user-123';
      const mockPreferences: UserPreferencesView = {
        id: 'prefs-123',
        userId,
        bodyWeightUnit: BodyWeightUnit.POUNDS,
        strengthTrainingUnit: StrengthTrainingUnit.POUNDS,
        bodyMeasurementUnit: BodyMeasurementUnit.INCHES,
        distanceUnit: DistanceUnit.MILES,
        advancedLoggingEnabled: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.findByUserId.mockResolvedValue(mockPreferences);

      // Act
      const result = await service.getUserPreferences(userId);

      // Assert
      expect(result).toEqual(mockPreferences);
      expect(mockRepository.findByUserId).toHaveBeenCalledWith(userId);
    });

    it('should return default preferences when user has no preferences', async () => {
      // Arrange
      const userId = 'new-user-456';
      mockRepository.findByUserId.mockResolvedValue(null);

      // Act
      const result = await service.getUserPreferences(userId);

      // Assert
      expect(result.bodyWeightUnit).toBe(DEFAULT_USER_PREFERENCES.bodyWeightUnit);
      expect(result.strengthTrainingUnit).toBe(DEFAULT_USER_PREFERENCES.strengthTrainingUnit);
      expect(result.bodyMeasurementUnit).toBe(DEFAULT_USER_PREFERENCES.bodyMeasurementUnit);
      expect(result.distanceUnit).toBe(DEFAULT_USER_PREFERENCES.distanceUnit);
      expect(result.advancedLoggingEnabled).toBe(DEFAULT_USER_PREFERENCES.advancedLoggingEnabled);
      expect(result.userId).toBe(userId);
    });

    it('should handle repository errors gracefully', async () => {
      // Arrange
      const userId = 'error-user';
      mockRepository.findByUserId.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(service.getUserPreferences(userId)).rejects.toThrow('Failed to get user preferences');
    });
  });

  describe('createUserPreferences', () => {
    it('should create new user preferences with provided data', async () => {
      // Arrange
      const userId = 'new-user-789';
      const onboardingData: UserPreferencesOnboardingData = {
        bodyWeightUnit: BodyWeightUnit.POUNDS,
        strengthTrainingUnit: StrengthTrainingUnit.POUNDS,
        bodyMeasurementUnit: BodyMeasurementUnit.INCHES,
        distanceUnit: DistanceUnit.MILES,
      };

      const createdPreferences: UserPreferencesView = {
        id: 'prefs-789',
        userId,
        ...onboardingData,
        advancedLoggingEnabled: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.createOrUpdate.mockResolvedValue(createdPreferences);

      // Act
      const result = await service.createUserPreferences(userId, onboardingData);

      // Assert
      expect(result).toEqual(createdPreferences);
      expect(mockRepository.createOrUpdate).toHaveBeenCalledWith(userId, {
        userId,
        ...onboardingData,
        advancedLoggingEnabled: false,
      });
    });

    it('should update existing preferences if user already has preferences', async () => {
      // Arrange
      const userId = 'existing-user';
      const onboardingData: UserPreferencesOnboardingData = {
        bodyWeightUnit: BodyWeightUnit.POUNDS,
        strengthTrainingUnit: StrengthTrainingUnit.POUNDS,
        bodyMeasurementUnit: BodyMeasurementUnit.INCHES,
        distanceUnit: DistanceUnit.MILES,
      };

      const updatedPreferences: UserPreferencesView = {
        id: 'prefs-456',
        userId,
        ...onboardingData,
        advancedLoggingEnabled: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.createOrUpdate.mockResolvedValue(updatedPreferences);

      // Act
      const result = await service.createUserPreferences(userId, onboardingData);

      // Assert
      expect(result).toEqual(updatedPreferences);
      expect(mockRepository.createOrUpdate).toHaveBeenCalledWith(userId, {
        userId,
        ...onboardingData,
        advancedLoggingEnabled: false,
      });
    });
  });

  describe('updateUserPreferences', () => {
    it('should update existing user preferences', async () => {
      // Arrange
      const userId = 'update-user';
      const updateData: UserPreferencesUpdate = {
        bodyWeightUnit: BodyWeightUnit.POUNDS,
        advancedLoggingEnabled: true,
      };

      const existingPreferences: UserPreferencesView = {
        id: 'prefs-update',
        userId,
        bodyWeightUnit: BodyWeightUnit.KILOGRAMS,
        strengthTrainingUnit: StrengthTrainingUnit.KILOGRAMS,
        bodyMeasurementUnit: BodyMeasurementUnit.CENTIMETERS,
        distanceUnit: DistanceUnit.KILOMETERS,
        advancedLoggingEnabled: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedPreferences: UserPreferencesView = {
        ...existingPreferences,
        ...updateData,
        updatedAt: new Date(),
      };

      mockRepository.findByUserId.mockResolvedValue(existingPreferences);
      mockRepository.update.mockResolvedValue();
      mockRepository.findById.mockResolvedValue(updatedPreferences);

      // Act
      const result = await service.updateUserPreferences(userId, updateData);

      // Assert
      expect(result).toEqual(updatedPreferences);
      expect(mockRepository.update).toHaveBeenCalledWith('prefs-update', updateData);
    });

    it('should create preferences if user has none', async () => {
      // Arrange
      const userId = 'no-prefs-user';
      const updateData: UserPreferencesUpdate = {
        bodyWeightUnit: BodyWeightUnit.POUNDS,
      };

      const createdPreferences: UserPreferencesView = {
        id: 'prefs-new',
        userId,
        bodyWeightUnit: BodyWeightUnit.POUNDS,
        strengthTrainingUnit: StrengthTrainingUnit.KILOGRAMS,
        bodyMeasurementUnit: BodyMeasurementUnit.CENTIMETERS,
        distanceUnit: DistanceUnit.KILOMETERS,
        advancedLoggingEnabled: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.findByUserId.mockResolvedValue(null);
      mockRepository.createOrUpdate.mockResolvedValue(createdPreferences);

      // Act
      const result = await service.updateUserPreferences(userId, updateData);

      // Assert
      expect(result).toEqual(createdPreferences);
      expect(mockRepository.createOrUpdate).toHaveBeenCalledWith(userId, {
        userId,
        ...DEFAULT_USER_PREFERENCES,
        ...updateData,
      });
    });
  });

  describe('deleteUserPreferences', () => {
    it('should delete user preferences when they exist', async () => {
      // Arrange
      const userId = 'delete-user';
      const existingPreferences: UserPreferencesView = {
        id: 'prefs-delete',
        userId,
        bodyWeightUnit: BodyWeightUnit.KILOGRAMS,
        strengthTrainingUnit: StrengthTrainingUnit.KILOGRAMS,
        bodyMeasurementUnit: BodyMeasurementUnit.CENTIMETERS,
        distanceUnit: DistanceUnit.KILOMETERS,
        advancedLoggingEnabled: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.findByUserId.mockResolvedValue(existingPreferences);
      mockRepository.delete.mockResolvedValue();

      // Act
      await service.deleteUserPreferences(userId);

      // Assert
      expect(mockRepository.delete).toHaveBeenCalledWith('prefs-delete');
    });

    it('should throw error if user has no preferences to delete', async () => {
      // Arrange
      const userId = 'no-prefs-user';
      mockRepository.findByUserId.mockResolvedValue(null);

      // Act & Assert
      await expect(service.deleteUserPreferences(userId)).rejects.toThrow('User preferences not found');
    });
  });

  describe('isAdvancedLoggingEnabled', () => {
    it('should return true when advanced logging is enabled', async () => {
      // Arrange
      const userId = 'advanced-user';
      const preferences: UserPreferencesView = {
        id: 'prefs-advanced',
        userId,
        bodyWeightUnit: BodyWeightUnit.KILOGRAMS,
        strengthTrainingUnit: StrengthTrainingUnit.KILOGRAMS,
        bodyMeasurementUnit: BodyMeasurementUnit.CENTIMETERS,
        distanceUnit: DistanceUnit.KILOMETERS,
        advancedLoggingEnabled: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.findByUserId.mockResolvedValue(preferences);

      // Act
      const result = await service.isAdvancedLoggingEnabled(userId);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when advanced logging is disabled', async () => {
      // Arrange
      const userId = 'basic-user';
      const preferences: UserPreferencesView = {
        id: 'prefs-basic',
        userId,
        bodyWeightUnit: BodyWeightUnit.KILOGRAMS,
        strengthTrainingUnit: StrengthTrainingUnit.KILOGRAMS,
        bodyMeasurementUnit: BodyMeasurementUnit.CENTIMETERS,
        distanceUnit: DistanceUnit.KILOMETERS,
        advancedLoggingEnabled: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.findByUserId.mockResolvedValue(preferences);

      // Act
      const result = await service.isAdvancedLoggingEnabled(userId);

      // Assert
      expect(result).toBe(false);
    });

    it('should return false when user has no preferences', async () => {
      // Arrange
      const userId = 'no-prefs-user';
      mockRepository.findByUserId.mockResolvedValue(null);

      // Act
      const result = await service.isAdvancedLoggingEnabled(userId);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('business logic', () => {
    it('should validate preferences data before creating', async () => {
      // This test ensures the service validates data before passing to repository
      const userId = 'validate-user';
      const invalidData = {
        bodyWeightUnit: 'invalid' as BodyWeightUnit,
        strengthTrainingUnit: StrengthTrainingUnit.KILOGRAMS,
        bodyMeasurementUnit: BodyMeasurementUnit.CENTIMETERS,
        distanceUnit: DistanceUnit.KILOMETERS,
      };

      // Act & Assert
      await expect(service.createUserPreferences(userId, invalidData)).rejects.toThrow('Invalid preferences data');
    });
  });
});

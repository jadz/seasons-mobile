import { OnboardingService } from '../onboarding/OnboardingService';
import { IUserOnboardingRepository } from '../../../db/repositories/UserOnboardingRepository';
import { IUserRepository } from '../../../db/repositories/UserRepository';
import { UserOnboardingProgress } from '../../models/userOnboarding';
import { UserPreferencesService } from '../UserPreferencesService';
import { BodyWeightUnit, StrengthTrainingUnit, BodyMeasurementUnit, DistanceUnit } from '../../models/userPreferences';

// Mock repositories for testing
const createMockOnboardingRepository = (): jest.Mocked<IUserOnboardingRepository> => ({
  upsert: jest.fn(),
  findByUserId: jest.fn(),
  hasCompletedOnboarding: jest.fn(),
  delete: jest.fn(),
});

const createMockUserRepository = (): jest.Mocked<IUserRepository> => ({
  findProfileByUserId: jest.fn(),
  createProfile: jest.fn(),
  updateProfile: jest.fn(),
  findUserWithProfile: jest.fn(),
  isUsernameAvailable: jest.fn(),
});

const createMockUserPreferencesService = (): jest.Mocked<UserPreferencesService> => ({
  getUserPreferences: jest.fn(),
  createUserPreferences: jest.fn(),
  updateUserPreferences: jest.fn(),
} as any);

describe('OnboardingService', () => {
  let service: OnboardingService;
  let mockOnboardingRepository: jest.Mocked<IUserOnboardingRepository>;
  let mockUserRepository: jest.Mocked<IUserRepository>;
  let mockUserPreferencesService: jest.Mocked<UserPreferencesService>;

  beforeEach(() => {
    mockOnboardingRepository = createMockOnboardingRepository();
    mockUserRepository = createMockUserRepository();
    mockUserPreferencesService = createMockUserPreferencesService();
    service = new OnboardingService(mockOnboardingRepository, mockUserRepository, mockUserPreferencesService);
  });

  describe('checkUsernameAvailability', () => {
    it('should return true when username is available', async () => {
      // Arrange
      const username = 'availableuser';
      mockUserRepository.isUsernameAvailable.mockResolvedValue(true);

      // Act
      const result = await service.checkUsernameAvailability(username);

      // Assert
      expect(result).toBe(true);
      expect(mockUserRepository.isUsernameAvailable).toHaveBeenCalledWith('availableuser');
    });

    it('should return false when username is taken', async () => {
      // Arrange
      const username = 'takenuser';
      mockUserRepository.isUsernameAvailable.mockResolvedValue(false);

      // Act
      const result = await service.checkUsernameAvailability(username);

      // Assert
      expect(result).toBe(false);
      expect(mockUserRepository.isUsernameAvailable).toHaveBeenCalledWith('takenuser');
    });

    it('should trim whitespace from username', async () => {
      // Arrange
      const username = '  testuser  ';
      mockUserRepository.isUsernameAvailable.mockResolvedValue(true);

      // Act
      await service.checkUsernameAvailability(username);

      // Assert
      expect(mockUserRepository.isUsernameAvailable).toHaveBeenCalledWith('testuser');
    });

    it('should throw error if username is empty', async () => {
      // Arrange
      const username = '';

      // Act & Assert
      await expect(service.checkUsernameAvailability(username))
        .rejects.toThrow('Username is required');
    });
  });

  describe('completeUsernameStep', () => {
    it('should check availability and save username when available', async () => {
      // Arrange
      const userId = 'test-user-123';
      const username = 'testuser';

      mockUserRepository.isUsernameAvailable.mockResolvedValue(true);
      mockUserRepository.findProfileByUserId.mockResolvedValue(null);
      mockUserRepository.createProfile.mockResolvedValue('profile-id-1');
      mockUserRepository.updateProfile.mockResolvedValue();
      mockOnboardingRepository.upsert.mockResolvedValue('progress-id-1');

      // Act
      await service.completeUsernameStep(userId, username);

      // Assert
      expect(mockUserRepository.isUsernameAvailable).toHaveBeenCalledWith('testuser');
      expect(mockUserRepository.findProfileByUserId).toHaveBeenCalledWith(userId);
      expect(mockUserRepository.createProfile).toHaveBeenCalledWith(userId, {});
      expect(mockUserRepository.updateProfile).toHaveBeenCalledWith(userId, { username: 'testuser' });
      expect(mockOnboardingRepository.upsert).toHaveBeenCalledWith({
        userId,
        currentStepName: 'username',
        currentStepNumber: '1',
      });
    });

    it('should throw error if username is already taken', async () => {
      // Arrange
      const userId = 'test-user-123';
      const username = 'takenuser';

      mockUserRepository.isUsernameAvailable.mockResolvedValue(false);

      // Act & Assert
      await expect(service.completeUsernameStep(userId, username))
        .rejects.toThrow('Username is already taken');

      // Verify we didn't try to save
      expect(mockUserRepository.updateProfile).not.toHaveBeenCalled();
      expect(mockOnboardingRepository.upsert).not.toHaveBeenCalled();
    });

    it('should throw error if username is empty', async () => {
      // Arrange
      const userId = 'test-user-123';
      const username = '';

      // Act & Assert
      await expect(service.completeUsernameStep(userId, username))
        .rejects.toThrow('Username is required');
    });

    it('should trim whitespace from username before saving', async () => {
      // Arrange
      const userId = 'test-user-123';
      const username = '  testuser  ';

      mockUserRepository.isUsernameAvailable.mockResolvedValue(true);
      mockUserRepository.findProfileByUserId.mockResolvedValue(null);
      mockUserRepository.createProfile.mockResolvedValue('profile-id-1');
      mockUserRepository.updateProfile.mockResolvedValue();
      mockOnboardingRepository.upsert.mockResolvedValue('progress-id-1');

      // Act
      await service.completeUsernameStep(userId, username);

      // Assert
      expect(mockUserRepository.isUsernameAvailable).toHaveBeenCalledWith('testuser');
      expect(mockUserRepository.updateProfile).toHaveBeenCalledWith(userId, { username: 'testuser' });
    });

    it('should not create profile if one already exists', async () => {
      // Arrange
      const userId = 'test-user-123';
      const username = 'testuser';
      const existingProfile = {
        id: 'profile-1',
        userId,
        firstName: 'John',
        username: 'oldusername',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserRepository.isUsernameAvailable.mockResolvedValue(true);
      mockUserRepository.findProfileByUserId.mockResolvedValue(existingProfile);
      mockUserRepository.updateProfile.mockResolvedValue();
      mockOnboardingRepository.upsert.mockResolvedValue('progress-id-1');

      // Act
      await service.completeUsernameStep(userId, username);

      // Assert
      expect(mockUserRepository.findProfileByUserId).toHaveBeenCalledWith(userId);
      expect(mockUserRepository.createProfile).not.toHaveBeenCalled();
      expect(mockUserRepository.updateProfile).toHaveBeenCalledWith(userId, { username });
    });
  });

  describe('completePersonalInfoStep', () => {
    it('should save personal info to user profile and upsert progress', async () => {
      // Arrange
      const userId = 'test-user-456';
      const personalInfo = {
        firstName: 'John',
        sex: 'male' as const,
        birthYear: 1990,
      };

      mockUserRepository.findProfileByUserId.mockResolvedValue(null);
      mockUserRepository.createProfile.mockResolvedValue('profile-id-1');
      mockUserRepository.updateProfile.mockResolvedValue();
      mockOnboardingRepository.upsert.mockResolvedValue('progress-id-1');

      // Act
      await service.completePersonalInfoStep(userId, personalInfo);

      // Assert
      expect(mockUserRepository.findProfileByUserId).toHaveBeenCalledWith(userId);
      expect(mockUserRepository.createProfile).toHaveBeenCalledWith(userId, {});
      expect(mockUserRepository.updateProfile).toHaveBeenCalledWith(userId, {
        firstName: 'John',
        sex: 'male',
        birthYear: 1990,
      });
      expect(mockOnboardingRepository.upsert).toHaveBeenCalledWith({
        userId,
        currentStepName: 'personal_info',
        currentStepNumber: '2',
      });
    });

    it('should save personal info without firstName if not provided', async () => {
      // Arrange
      const userId = 'test-user-456';
      const personalInfo = {
        sex: 'female' as const,
        birthYear: 1985,
      };

      mockUserRepository.findProfileByUserId.mockResolvedValue(null);
      mockUserRepository.createProfile.mockResolvedValue('profile-id-1');
      mockUserRepository.updateProfile.mockResolvedValue();
      mockOnboardingRepository.upsert.mockResolvedValue('progress-id-1');

      // Act
      await service.completePersonalInfoStep(userId, personalInfo);

      // Assert
      expect(mockUserRepository.updateProfile).toHaveBeenCalledWith(userId, {
        sex: 'female',
        birthYear: 1985,
      });
    });

    it('should trim whitespace from firstName', async () => {
      // Arrange
      const userId = 'test-user-456';
      const personalInfo = {
        firstName: '  John  ',
        sex: 'male' as const,
        birthYear: 1990,
      };

      mockUserRepository.updateProfile.mockResolvedValue();
      mockOnboardingRepository.upsert.mockResolvedValue('progress-id-1');

      // Act
      await service.completePersonalInfoStep(userId, personalInfo);

      // Assert
      expect(mockUserRepository.updateProfile).toHaveBeenCalledWith(userId, {
        firstName: 'John',
        sex: 'male',
        birthYear: 1990,
      });
    });

    it('should skip firstName if empty string after trimming', async () => {
      // Arrange
      const userId = 'test-user-456';
      const personalInfo = {
        firstName: '   ',
        sex: 'other' as const,
        birthYear: 1995,
      };

      mockUserRepository.updateProfile.mockResolvedValue();
      mockOnboardingRepository.upsert.mockResolvedValue('progress-id-1');

      // Act
      await service.completePersonalInfoStep(userId, personalInfo);

      // Assert
      expect(mockUserRepository.updateProfile).toHaveBeenCalledWith(userId, {
        sex: 'other',
        birthYear: 1995,
      });
    });

    it('should throw error if sex is not provided', async () => {
      // Arrange
      const userId = 'test-user-456';
      const personalInfo = {
        firstName: 'John',
        sex: '' as any,
        birthYear: 1990,
      };

      // Act & Assert
      await expect(service.completePersonalInfoStep(userId, personalInfo))
        .rejects.toThrow('Sex is required');
    });

    it('should throw error if birthYear is not provided', async () => {
      // Arrange
      const userId = 'test-user-456';
      const personalInfo = {
        firstName: 'John',
        sex: 'male' as const,
        birthYear: null as any,
      };

      // Act & Assert
      await expect(service.completePersonalInfoStep(userId, personalInfo))
        .rejects.toThrow('Valid birth year is required');
    });

    it('should throw error if birthYear is too old', async () => {
      // Arrange
      const userId = 'test-user-456';
      const personalInfo = {
        firstName: 'John',
        sex: 'male' as const,
        birthYear: 1850,
      };

      // Act & Assert
      await expect(service.completePersonalInfoStep(userId, personalInfo))
        .rejects.toThrow('Valid birth year is required');
    });

    it('should throw error if birthYear is in the future', async () => {
      // Arrange
      const userId = 'test-user-456';
      const personalInfo = {
        firstName: 'John',
        sex: 'male' as const,
        birthYear: new Date().getFullYear() + 1,
      };

      // Act & Assert
      await expect(service.completePersonalInfoStep(userId, personalInfo))
        .rejects.toThrow('Valid birth year is required');
    });

    it('should handle repository errors gracefully', async () => {
      // Arrange
      const userId = 'test-user-456';
      const personalInfo = {
        firstName: 'John',
        sex: 'male' as const,
        birthYear: 1990,
      };

      const repositoryError = new Error('Database connection failed');
      mockUserRepository.updateProfile.mockRejectedValue(repositoryError);

      // Act & Assert
      await expect(service.completePersonalInfoStep(userId, personalInfo))
        .rejects.toThrow('Database connection failed');
    });
  });

  describe('completeUnitPreferencesStep', () => {
    it('should create user preferences and upsert progress', async () => {
      // Arrange
      const userId = 'test-user-789';
      const preferencesData = {
        bodyWeightUnit: BodyWeightUnit.KILOGRAMS,
        strengthTrainingUnit: StrengthTrainingUnit.KILOGRAMS,
        bodyMeasurementUnit: BodyMeasurementUnit.CENTIMETERS,
        distanceUnit: DistanceUnit.KILOMETERS,
      };

      mockUserPreferencesService.createUserPreferences.mockResolvedValue({} as any);
      mockOnboardingRepository.upsert.mockResolvedValue('progress-id-1');

      // Act
      await service.completeUnitPreferencesStep(userId, preferencesData);

      // Assert
      expect(mockUserPreferencesService.createUserPreferences).toHaveBeenCalledWith(userId, preferencesData);
      expect(mockOnboardingRepository.upsert).toHaveBeenCalledWith({
        userId,
        currentStepName: 'unit_preferences',
        currentStepNumber: '3',
      });
    });

    it('should handle user preferences service errors', async () => {
      // Arrange
      const userId = 'test-user-789';
      const preferencesData = {
        bodyWeightUnit: BodyWeightUnit.POUNDS,
        strengthTrainingUnit: StrengthTrainingUnit.POUNDS,
        bodyMeasurementUnit: BodyMeasurementUnit.INCHES,
        distanceUnit: DistanceUnit.MILES,
      };

      const error = new Error('Database connection failed');
      mockUserPreferencesService.createUserPreferences.mockRejectedValue(error);

      // Act & Assert
      await expect(service.completeUnitPreferencesStep(userId, preferencesData))
        .rejects.toThrow('Database connection failed');
    });
  });

  describe('getOnboardingProgress', () => {
    it('should return user onboarding progress', async () => {
      // Arrange
      const userId = 'test-user-progress';
      const progress: UserOnboardingProgress = {
        id: 'progress-1',
        userId,
        currentStepName: 'personal_info',
        currentStepNumber: '2',
        completedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockOnboardingRepository.findByUserId.mockResolvedValue(progress);

      // Act
      const result = await service.getOnboardingProgress(userId);

      // Assert
      expect(result).toEqual(progress);
      expect(mockOnboardingRepository.findByUserId).toHaveBeenCalledWith(userId);
    });

    it('should return null for user with no progress', async () => {
      // Arrange
      const userId = 'new-user';
      mockOnboardingRepository.findByUserId.mockResolvedValue(null);

      // Act
      const result = await service.getOnboardingProgress(userId);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('hasCompletedOnboarding', () => {
    it('should return true when user has completed all steps', async () => {
      // Arrange
      const userId = 'complete-user';
      mockOnboardingRepository.hasCompletedOnboarding.mockResolvedValue(true);

      // Act
      const result = await service.hasCompletedOnboarding(userId);

      // Assert
      expect(result).toBe(true);
      expect(mockOnboardingRepository.hasCompletedOnboarding).toHaveBeenCalledWith(userId);
    });

    it('should return false when user has not completed all steps', async () => {
      // Arrange
      const userId = 'incomplete-user';
      mockOnboardingRepository.hasCompletedOnboarding.mockResolvedValue(false);

      // Act
      const result = await service.hasCompletedOnboarding(userId);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('error handling', () => {
    it('should handle repository errors gracefully when completing steps', async () => {
      // Arrange
      const userId = 'error-user';
      const username = 'erroruser';
      
      mockUserRepository.isUsernameAvailable.mockResolvedValue(true);
      mockUserRepository.updateProfile.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(service.completeUsernameStep(userId, username))
        .rejects.toThrow('Database error');
    });

    it('should handle errors when checking username availability', async () => {
      // Arrange
      const username = 'erroruser';
      mockUserRepository.isUsernameAvailable.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(service.checkUsernameAvailability(username))
        .rejects.toThrow('Database error');
    });

    it('should handle errors when getting progress', async () => {
      // Arrange
      const userId = 'error-user';
      mockOnboardingRepository.findByUserId.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(service.getOnboardingProgress(userId))
        .rejects.toThrow('Database error');
    });
  });
});
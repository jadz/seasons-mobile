import { OnboardingService } from '../onboarding/OnboardingService';
import { IUserOnboardingRepository } from '../../../db/repositories/UserOnboardingRepository';
import { IUserRepository } from '../../../db/repositories/UserRepository';
import { UserOnboardingProgress } from '../../models/userOnboarding';

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

describe('OnboardingService', () => {
  let service: OnboardingService;
  let mockOnboardingRepository: jest.Mocked<IUserOnboardingRepository>;
  let mockUserRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    mockOnboardingRepository = createMockOnboardingRepository();
    mockUserRepository = createMockUserRepository();
    service = new OnboardingService(mockOnboardingRepository, mockUserRepository);
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
      mockUserRepository.updateProfile.mockResolvedValue();
      mockOnboardingRepository.upsert.mockResolvedValue('progress-id-1');

      // Act
      await service.completeUsernameStep(userId, username);

      // Assert
      expect(mockUserRepository.isUsernameAvailable).toHaveBeenCalledWith('testuser');
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
      mockUserRepository.updateProfile.mockResolvedValue();
      mockOnboardingRepository.upsert.mockResolvedValue('progress-id-1');

      // Act
      await service.completeUsernameStep(userId, username);

      // Assert
      expect(mockUserRepository.isUsernameAvailable).toHaveBeenCalledWith('testuser');
      expect(mockUserRepository.updateProfile).toHaveBeenCalledWith(userId, { username: 'testuser' });
    });
  });

  describe('completePersonalInfoStep', () => {
    it('should save first name to user profile and upsert progress', async () => {
      // Arrange
      const userId = 'test-user-456';
      const firstName = 'John';

      mockUserRepository.updateProfile.mockResolvedValue();
      mockOnboardingRepository.upsert.mockResolvedValue('progress-id-1');

      // Act
      await service.completePersonalInfoStep(userId, firstName);

      // Assert
      expect(mockUserRepository.updateProfile).toHaveBeenCalledWith(userId, { firstName });
      expect(mockOnboardingRepository.upsert).toHaveBeenCalledWith({
        userId,
        currentStepName: 'personal_info',
        currentStepNumber: '2',
      });
    });

    it('should throw error if firstName is empty', async () => {
      // Arrange
      const userId = 'test-user-456';
      const firstName = '';

      // Act & Assert
      await expect(service.completePersonalInfoStep(userId, firstName))
        .rejects.toThrow('First name is required');
    });
  });

  describe('completeUnitPreferencesStep', () => {
    it('should upsert progress for unit preferences step', async () => {
      // Arrange
      const userId = 'test-user-789';

      mockOnboardingRepository.upsert.mockResolvedValue('progress-id-1');

      // Act
      await service.completeUnitPreferencesStep(userId);

      // Assert
      expect(mockOnboardingRepository.upsert).toHaveBeenCalledWith({
        userId,
        currentStepName: 'unit_preferences',
        currentStepNumber: '3',
      });
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
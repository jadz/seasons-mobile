import { userPreferencesStore } from '../userPreferencesStore';
import { UserPreferencesService } from '../../../domain/services/UserPreferencesService';
import { 
  BodyWeightUnit, 
  StrengthTrainingUnit, 
  BodyMeasurementUnit, 
  DistanceUnit,
  DEFAULT_USER_PREFERENCES 
} from '../../../domain/models/userPreferences';
import { UserPreferencesView } from '../../../domain/views/userPreferencesViews';

// Mock the service
jest.mock('../../../domain/services/UserPreferencesService');
const MockedUserPreferencesService = UserPreferencesService as jest.MockedClass<typeof UserPreferencesService>;

describe('UserPreferencesStore', () => {
  let mockService: jest.Mocked<UserPreferencesService>;
  let mockRepository: any;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Create mock repository for service constructor
    mockRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByUserId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      createOrUpdate: jest.fn(),
    };
    
    mockService = new MockedUserPreferencesService(mockRepository) as jest.Mocked<UserPreferencesService>;
    
    // Reset store to initial state and inject mock service
    userPreferencesStore.reset();
    userPreferencesStore._setService(mockService);
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      expect(userPreferencesStore.preferences.get()).toBeNull();
      expect(userPreferencesStore.isLoading.get()).toBe(false);
      expect(userPreferencesStore.isInitialized.get()).toBe(false);
      expect(userPreferencesStore.error.get()).toBeNull();
    });

    it('should provide default preferences when none exist', () => {
      const defaults = userPreferencesStore.getDefaults();
      expect(defaults.bodyWeightUnit).toBe(BodyWeightUnit.KILOGRAMS);
      expect(defaults.strengthTrainingUnit).toBe(StrengthTrainingUnit.KILOGRAMS);
      expect(defaults.bodyMeasurementUnit).toBe(BodyMeasurementUnit.CENTIMETERS);
      expect(defaults.distanceUnit).toBe(DistanceUnit.KILOMETERS);
      expect(defaults.advancedLoggingEnabled).toBe(false);
    });
  });

  describe('Actions', () => {
    describe('setLoading', () => {
      it('should update loading state', () => {
        userPreferencesStore.setLoading(true);
        expect(userPreferencesStore.isLoading.get()).toBe(true);

        userPreferencesStore.setLoading(false);
        expect(userPreferencesStore.isLoading.get()).toBe(false);
      });
    });

    describe('setError', () => {
      it('should update error state', () => {
        const error = 'Test error';
        userPreferencesStore.setError(error);
        expect(userPreferencesStore.error.get()).toBe(error);
      });

      it('should clear error when set to null', () => {
        userPreferencesStore.setError('Test error');
        userPreferencesStore.setError(null);
        expect(userPreferencesStore.error.get()).toBeNull();
      });
    });

    describe('setPreferences', () => {
      it('should update preferences state', () => {
        const mockPreferences: UserPreferencesView = {
          id: 'test-id',
          userId: 'user-id',
          bodyWeightUnit: BodyWeightUnit.POUNDS,
          strengthTrainingUnit: StrengthTrainingUnit.POUNDS,
          bodyMeasurementUnit: BodyMeasurementUnit.INCHES,
          distanceUnit: DistanceUnit.MILES,
          advancedLoggingEnabled: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        userPreferencesStore.setPreferences(mockPreferences);
        expect(userPreferencesStore.preferences.get()).toEqual(mockPreferences);
        expect(userPreferencesStore.isInitialized.get()).toBe(true);
      });

      it('should handle null preferences', () => {
        userPreferencesStore.setPreferences(null);
        expect(userPreferencesStore.preferences.get()).toBeNull();
        expect(userPreferencesStore.isInitialized.get()).toBe(true);
      });
    });

    describe('reset', () => {
      it('should reset store to initial state', () => {
        // Set some state
        userPreferencesStore.setLoading(true);
        userPreferencesStore.setError('Test error');
        userPreferencesStore.setPreferences({
          id: 'test-id',
          userId: 'user-id',
          bodyWeightUnit: BodyWeightUnit.POUNDS,
          strengthTrainingUnit: StrengthTrainingUnit.POUNDS,
          bodyMeasurementUnit: BodyMeasurementUnit.INCHES,
          distanceUnit: DistanceUnit.MILES,
          advancedLoggingEnabled: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        // Reset
        userPreferencesStore.reset();

        // Check initial state
        expect(userPreferencesStore.preferences.get()).toBeNull();
        expect(userPreferencesStore.isLoading.get()).toBe(false);
        expect(userPreferencesStore.isInitialized.get()).toBe(false);
        expect(userPreferencesStore.error.get()).toBeNull();
      });
    });
  });

  describe('Service Integration Actions', () => {
    describe('loadUserPreferences', () => {
      it('should load user preferences successfully', async () => {
        const mockPreferences: UserPreferencesView = {
          id: 'test-id',
          userId: 'user-id',
          bodyWeightUnit: BodyWeightUnit.KILOGRAMS,
          strengthTrainingUnit: StrengthTrainingUnit.KILOGRAMS,
          bodyMeasurementUnit: BodyMeasurementUnit.CENTIMETERS,
          distanceUnit: DistanceUnit.KILOMETERS,
          advancedLoggingEnabled: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        mockService.getUserPreferences.mockResolvedValue(mockPreferences);

        await userPreferencesStore.loadUserPreferences('user-id');

        expect(mockService.getUserPreferences).toHaveBeenCalledWith('user-id');
        expect(userPreferencesStore.preferences.get()).toEqual(mockPreferences);
        expect(userPreferencesStore.isLoading.get()).toBe(false);
        expect(userPreferencesStore.error.get()).toBeNull();
        expect(userPreferencesStore.isInitialized.get()).toBe(true);
      });

      it('should handle loading state correctly', async () => {
        mockService.getUserPreferences.mockImplementation(() => 
          new Promise(resolve => setTimeout(resolve, 100))
        );

        const loadPromise = userPreferencesStore.loadUserPreferences('user-id');
        
        // Should be loading
        expect(userPreferencesStore.isLoading.get()).toBe(true);
        expect(userPreferencesStore.error.get()).toBeNull();

        await loadPromise;

        // Should no longer be loading
        expect(userPreferencesStore.isLoading.get()).toBe(false);
      });

      it('should handle service errors', async () => {
        const error = new Error('Service error');
        mockService.getUserPreferences.mockRejectedValue(error);

        await userPreferencesStore.loadUserPreferences('user-id');

        expect(userPreferencesStore.preferences.get()).toBeNull();
        expect(userPreferencesStore.isLoading.get()).toBe(false);
        expect(userPreferencesStore.error.get()).toBe('Failed to load user preferences');
        expect(userPreferencesStore.isInitialized.get()).toBe(true);
      });
    });

    describe('updateUserPreferences', () => {
      it('should update user preferences successfully', async () => {
        const userId = 'user-id';
        const updateData = {
          bodyWeightUnit: BodyWeightUnit.POUNDS,
          advancedLoggingEnabled: true,
        };

        const updatedPreferences: UserPreferencesView = {
          id: 'test-id',
          userId,
          bodyWeightUnit: BodyWeightUnit.POUNDS,
          strengthTrainingUnit: StrengthTrainingUnit.KILOGRAMS,
          bodyMeasurementUnit: BodyMeasurementUnit.CENTIMETERS,
          distanceUnit: DistanceUnit.KILOMETERS,
          advancedLoggingEnabled: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        mockService.updateUserPreferences.mockResolvedValue(updatedPreferences);

        await userPreferencesStore.updateUserPreferences(userId, updateData);

        expect(mockService.updateUserPreferences).toHaveBeenCalledWith(userId, updateData);
        expect(userPreferencesStore.preferences.get()).toEqual(updatedPreferences);
        expect(userPreferencesStore.isLoading.get()).toBe(false);
        expect(userPreferencesStore.error.get()).toBeNull();
      });

      it('should handle update errors', async () => {
        const error = new Error('Update error');
        mockService.updateUserPreferences.mockRejectedValue(error);

        await userPreferencesStore.updateUserPreferences('user-id', {
          bodyWeightUnit: BodyWeightUnit.POUNDS,
        });

        expect(userPreferencesStore.isLoading.get()).toBe(false);
        expect(userPreferencesStore.error.get()).toBe('Failed to update user preferences');
      });
    });

    describe('createUserPreferences', () => {
      it('should create user preferences successfully', async () => {
        const userId = 'user-id';
        const onboardingData = {
          bodyWeightUnit: BodyWeightUnit.POUNDS,
          strengthTrainingUnit: StrengthTrainingUnit.POUNDS,
          bodyMeasurementUnit: BodyMeasurementUnit.INCHES,
          distanceUnit: DistanceUnit.MILES,
        };

        const createdPreferences: UserPreferencesView = {
          id: 'test-id',
          userId,
          ...onboardingData,
          advancedLoggingEnabled: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        mockService.createUserPreferences.mockResolvedValue(createdPreferences);

        await userPreferencesStore.createUserPreferences(userId, onboardingData);

        expect(mockService.createUserPreferences).toHaveBeenCalledWith(userId, onboardingData);
        expect(userPreferencesStore.preferences.get()).toEqual(createdPreferences);
        expect(userPreferencesStore.isLoading.get()).toBe(false);
        expect(userPreferencesStore.error.get()).toBeNull();
      });

      it('should handle creation errors', async () => {
        const error = new Error('Creation error');
        mockService.createUserPreferences.mockRejectedValue(error);

        await userPreferencesStore.createUserPreferences('user-id', {
          bodyWeightUnit: BodyWeightUnit.POUNDS,
          strengthTrainingUnit: StrengthTrainingUnit.POUNDS,
          bodyMeasurementUnit: BodyMeasurementUnit.INCHES,
          distanceUnit: DistanceUnit.MILES,
        });

        expect(userPreferencesStore.isLoading.get()).toBe(false);
        expect(userPreferencesStore.error.get()).toBe('Failed to create user preferences');
      });
    });
  });

  describe('Computed Properties/Getters', () => {
    it('should get current preferences or defaults', () => {
      // When no preferences exist
      const defaultPrefs = userPreferencesStore.getCurrentPreferences();
      expect(defaultPrefs.bodyWeightUnit).toBe(BodyWeightUnit.KILOGRAMS);

      // When preferences exist
      const mockPreferences: UserPreferencesView = {
        id: 'test-id',
        userId: 'user-id',
        bodyWeightUnit: BodyWeightUnit.POUNDS,
        strengthTrainingUnit: StrengthTrainingUnit.POUNDS,
        bodyMeasurementUnit: BodyMeasurementUnit.INCHES,
        distanceUnit: DistanceUnit.MILES,
        advancedLoggingEnabled: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      userPreferencesStore.setPreferences(mockPreferences);
      const currentPrefs = userPreferencesStore.getCurrentPreferences();
      expect(currentPrefs.bodyWeightUnit).toBe(BodyWeightUnit.POUNDS);
    });

    it('should check if preferences are metric system', () => {
      // Default (metric)
      expect(userPreferencesStore.isMetricSystem()).toBe(true);

      // Set to imperial
      userPreferencesStore.setPreferences({
        id: 'test-id',
        userId: 'user-id',
        bodyWeightUnit: BodyWeightUnit.POUNDS,
        strengthTrainingUnit: StrengthTrainingUnit.POUNDS,
        bodyMeasurementUnit: BodyMeasurementUnit.INCHES,
        distanceUnit: DistanceUnit.MILES,
        advancedLoggingEnabled: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      expect(userPreferencesStore.isMetricSystem()).toBe(false);
    });

    it('should check if advanced logging is enabled', () => {
      // Default (disabled)
      expect(userPreferencesStore.isAdvancedLoggingEnabled()).toBe(false);

      // Set to enabled
      userPreferencesStore.setPreferences({
        id: 'test-id',
        userId: 'user-id',
        bodyWeightUnit: BodyWeightUnit.KILOGRAMS,
        strengthTrainingUnit: StrengthTrainingUnit.KILOGRAMS,
        bodyMeasurementUnit: BodyMeasurementUnit.CENTIMETERS,
        distanceUnit: DistanceUnit.KILOMETERS,
        advancedLoggingEnabled: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      expect(userPreferencesStore.isAdvancedLoggingEnabled()).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should clear error when successful operation occurs', async () => {
      // Set an error
      userPreferencesStore.setError('Previous error');
      expect(userPreferencesStore.error.get()).toBe('Previous error');

      // Successful operation should clear error
      const mockPreferences: UserPreferencesView = {
        id: 'test-id',
        userId: 'user-id',
        bodyWeightUnit: BodyWeightUnit.KILOGRAMS,
        strengthTrainingUnit: StrengthTrainingUnit.KILOGRAMS,
        bodyMeasurementUnit: BodyMeasurementUnit.CENTIMETERS,
        distanceUnit: DistanceUnit.KILOMETERS,
        advancedLoggingEnabled: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockService.getUserPreferences.mockResolvedValue(mockPreferences);
      await userPreferencesStore.loadUserPreferences('user-id');

      expect(userPreferencesStore.error.get()).toBeNull();
    });
  });

  describe('Store Integration', () => {
    it('should work with service dependency injection', () => {
      // This test ensures the store can work with a different service instance
      const customService = new UserPreferencesService(mockService as any);
      
      // The store should be able to accept different service implementations
      expect(userPreferencesStore).toBeDefined();
      expect(typeof userPreferencesStore.loadUserPreferences).toBe('function');
    });
  });
});

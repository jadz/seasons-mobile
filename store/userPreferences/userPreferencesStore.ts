import { observable } from '@legendapp/state';
import { UserPreferencesService } from '../../domain/services/UserPreferencesService';
import { userPreferencesRepository } from '../../db/repositories/UserPreferencesRepository';
import { 
  UserPreferences, 
  DEFAULT_USER_PREFERENCES
} from '../../domain/models/userPreferences';
import { 
  UserPreferencesView, 
  UserPreferencesUpdate, 
  UserPreferencesOnboardingData 
} from '../../domain/views/userPreferencesViews';

interface UserPreferencesState {
  preferences: UserPreferencesView | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  
  // Actions
  setPreferences: (preferences: UserPreferencesView | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
  
  // Service integration actions
  loadUserPreferences: (userId: string) => Promise<void>;
  updateUserPreferences: (userId: string, updateData: UserPreferencesUpdate) => Promise<void>;
  createUserPreferences: (userId: string, onboardingData: UserPreferencesOnboardingData) => Promise<void>;
  
  // Computed properties/getters
  getDefaults: () => typeof DEFAULT_USER_PREFERENCES;
  getCurrentPreferences: () => UserPreferences;
  isMetricSystem: () => boolean;
  isAdvancedLoggingEnabled: () => boolean;
  
  // Internal method to set service (for testing)
  _setService: (service: UserPreferencesService) => void;
}

const createInitialState = () => ({
  preferences: null,
  isLoading: false,
  isInitialized: false,
  error: null,
});

// Create service instance (can be overridden for testing)
let userPreferencesService = new UserPreferencesService(userPreferencesRepository);

export const userPreferencesStore = observable<UserPreferencesState>({
  ...createInitialState(),

  // Actions
  setPreferences: (preferences: UserPreferencesView | null) => {
    userPreferencesStore.preferences.set(preferences);
    userPreferencesStore.isInitialized.set(true);
  },

  setLoading: (loading: boolean) => {
    userPreferencesStore.isLoading.set(loading);
  },

  setError: (error: string | null) => {
    userPreferencesStore.error.set(error);
  },

  reset: () => {
    const initialState = createInitialState();
    userPreferencesStore.preferences.set(initialState.preferences);
    userPreferencesStore.isLoading.set(initialState.isLoading);
    userPreferencesStore.isInitialized.set(initialState.isInitialized);
    userPreferencesStore.error.set(initialState.error);
  },

  // Service integration actions
  loadUserPreferences: async (userId: string) => {
    try {
      userPreferencesStore.setLoading(true);
      userPreferencesStore.setError(null);
      
      const preferences = await userPreferencesService.getUserPreferences(userId);
      userPreferencesStore.setPreferences(preferences);
    } catch (error) {
      console.error('Error loading user preferences:', error);
      userPreferencesStore.setError('Failed to load user preferences');
      userPreferencesStore.setPreferences(null);
    } finally {
      userPreferencesStore.setLoading(false);
      userPreferencesStore.isInitialized.set(true);
    }
  },

  updateUserPreferences: async (userId: string, updateData: UserPreferencesUpdate) => {
    try {
      userPreferencesStore.setLoading(true);
      userPreferencesStore.setError(null);
      
      const updatedPreferences = await userPreferencesService.updateUserPreferences(userId, updateData);
      userPreferencesStore.setPreferences(updatedPreferences);
    } catch (error) {
      console.error('Error updating user preferences:', error);
      userPreferencesStore.setError('Failed to update user preferences');
    } finally {
      userPreferencesStore.setLoading(false);
    }
  },

  createUserPreferences: async (userId: string, onboardingData: UserPreferencesOnboardingData) => {
    try {
      userPreferencesStore.setLoading(true);
      userPreferencesStore.setError(null);
      
      const createdPreferences = await userPreferencesService.createUserPreferences(userId, onboardingData);
      userPreferencesStore.setPreferences(createdPreferences);
    } catch (error) {
      console.error('Error creating user preferences:', error);
      userPreferencesStore.setError('Failed to create user preferences');
    } finally {
      userPreferencesStore.setLoading(false);
    }
  },

  // Computed properties/getters
  getDefaults: () => {
    return DEFAULT_USER_PREFERENCES;
  },

  getCurrentPreferences: () => {
    const current = userPreferencesStore.preferences.get();
    if (current) {
      return current;
    }
    
    // Return defaults with placeholder IDs when no preferences exist
    return {
      id: '',
      userId: '',
      ...DEFAULT_USER_PREFERENCES,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  },

  isMetricSystem: () => {
    const preferences = userPreferencesStore.getCurrentPreferences();
    return preferences.bodyWeightUnit === 'kg' &&
           preferences.strengthTrainingUnit === 'kg' &&
           preferences.bodyMeasurementUnit === 'cm' &&
           preferences.distanceUnit === 'km';
  },

  isAdvancedLoggingEnabled: () => {
    const preferences = userPreferencesStore.getCurrentPreferences();
    return preferences.advancedLoggingEnabled;
  },

  // Internal method to set service (for testing)
  _setService: (service: UserPreferencesService) => {
    userPreferencesService = service;
  },
});

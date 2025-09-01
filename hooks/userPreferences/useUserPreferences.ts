import { useObservable } from '@legendapp/state/react';
import { userPreferencesStore } from '../../store/userPreferences/userPreferencesStore';
import { UserPreferencesUpdate, UserPreferencesOnboardingData } from '../../domain/views/userPreferencesViews';

export const useUserPreferences = () => {
  const storeState = useObservable(userPreferencesStore);

  const loadUserPreferences = async (userId: string) => {
    return await userPreferencesStore.loadUserPreferences(userId);
  };

  const createUserPreferences = async (userId: string, onboardingData: UserPreferencesOnboardingData) => {
    return await userPreferencesStore.createUserPreferences(userId, onboardingData);
  };

  const updateUserPreferences = async (userId: string, updateData: UserPreferencesUpdate) => {
    return await userPreferencesStore.updateUserPreferences(userId, updateData);
  };

  const getCurrentPreferences = () => {
    return userPreferencesStore.getCurrentPreferences();
  };

  const isMetricSystem = () => {
    return userPreferencesStore.isMetricSystem();
  };

  const isAdvancedLoggingEnabled = () => {
    return userPreferencesStore.isAdvancedLoggingEnabled();
  };

  return {
    preferences: storeState.preferences.get(),
    isLoading: storeState.isLoading.get(),
    error: storeState.error.get(),
    isInitialized: storeState.isInitialized.get(),
    loadUserPreferences,
    createUserPreferences,
    updateUserPreferences,
    getCurrentPreferences,
    isMetricSystem,
    isAdvancedLoggingEnabled,
  };
};

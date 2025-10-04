import { useEffect } from 'react';
import { useSelector } from '@legendapp/state/react';
import { seasonFocusStore } from '../../store/seasonFocus/seasonFocusStore';
import { PillarWithAreas } from '../../domain/views/pillarViews';

/**
 * Custom hook for accessing season focus options (pillars and areas)
 * Used during season creation onboarding
 * 
 * Data is prefetched by AppDataProvider and cached in seasonFocusStore.
 * This hook provides a simple interface to access the cached data.
 */
export const useSeasonFocus = () => {
  // Subscribe to store state
  const pillars = useSelector(seasonFocusStore.pillarsWithAreas);
  const isLoading = useSelector(seasonFocusStore.isLoading);
  const error = useSelector(seasonFocusStore.error);
  const isInitialized = useSelector(seasonFocusStore.isInitialized);

  // Lazy load if not already initialized (fallback for edge cases)
  useEffect(() => {
    if (!isInitialized && !isLoading) {
      seasonFocusStore.loadPillarsWithAreas();
    }
  }, [isInitialized, isLoading]);

  return {
    pillars,
    isLoading,
    error,
  };
};

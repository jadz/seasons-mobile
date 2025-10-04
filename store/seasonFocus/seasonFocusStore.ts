import { observable } from '@legendapp/state';
import { SeasonFocusService } from '../../domain/services/SeasonFocusService';
import { pillarRepository } from '../../db/repositories/PillarRepository';
import { areaOfFocusRepository } from '../../db/repositories/AreaOfFocusRepository';
import { PillarWithAreas } from '../../domain/views/pillarViews';
import { createDomainLogger } from '../../utils/logger';

const seasonFocusLogger = createDomainLogger('SEASON_FOCUS');

/**
 * State interface for season focus reference data (pillars and areas of focus)
 * This is system-controlled reference data that's prefetched and cached
 */
interface SeasonFocusState {
  pillarsWithAreas: PillarWithAreas[];
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  
  // Actions
  setPillarsWithAreas: (pillars: PillarWithAreas[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
  
  // Service integration actions
  loadPillarsWithAreas: () => Promise<void>;
  
  // Getters
  getPillarsWithAreas: () => PillarWithAreas[];
  
  // Internal method to set service (for testing)
  _setService: (service: SeasonFocusService) => void;
}

const createInitialState = () => ({
  pillarsWithAreas: [],
  isLoading: false,
  isInitialized: false,
  error: null,
});

// Create service instance (can be overridden for testing)
let seasonFocusService = new SeasonFocusService(pillarRepository, areaOfFocusRepository);

export const seasonFocusStore = observable<SeasonFocusState>({
  ...createInitialState(),

  // Actions
  setPillarsWithAreas: (pillars: PillarWithAreas[]) => {
    seasonFocusStore.pillarsWithAreas.set(pillars);
    seasonFocusStore.isInitialized.set(true);
  },

  setLoading: (loading: boolean) => {
    seasonFocusStore.isLoading.set(loading);
  },

  setError: (error: string | null) => {
    seasonFocusStore.error.set(error);
  },

  reset: () => {
    const initialState = createInitialState();
    seasonFocusStore.pillarsWithAreas.set(initialState.pillarsWithAreas);
    seasonFocusStore.isLoading.set(initialState.isLoading);
    seasonFocusStore.isInitialized.set(initialState.isInitialized);
    seasonFocusStore.error.set(initialState.error);
  },

  // Service integration actions
  loadPillarsWithAreas: async () => {
    // Skip if already loaded to prevent unnecessary refetches
    if (seasonFocusStore.isInitialized.get()) {
      seasonFocusLogger.debug('Data already loaded, skipping fetch');
      return;
    }

    try {
      seasonFocusStore.setLoading(true);
      seasonFocusStore.setError(null);

      seasonFocusLogger.info('Fetching pillars with areas...');
      const pillars = await seasonFocusService.getPillarsWithAreas();

      seasonFocusStore.setPillarsWithAreas(pillars);
      seasonFocusLogger.info(`Loaded ${pillars.length} pillars with areas`);
    } catch (error) {
      seasonFocusLogger.error('Error loading pillars with areas:', error);
      seasonFocusStore.setError('Failed to load focus options');
      seasonFocusStore.setPillarsWithAreas([]);
    } finally {
      seasonFocusStore.setLoading(false);
      seasonFocusStore.isInitialized.set(true);
    }
  },

  // Getters
  getPillarsWithAreas: () => {
    return seasonFocusStore.pillarsWithAreas.get();
  },

  // Internal method to set service (for testing)
  _setService: (service: SeasonFocusService) => {
    seasonFocusService = service;
  },
});

import { observable } from '@legendapp/state';
import { ExerciseService } from '../../domain/services/ExerciseService';
import { exerciseRepository } from '../../db/repositories/ExerciseRepository';
import { Exercise } from '../../domain/models/exercise';
import { createDomainLogger } from '../../utils/logger';

const exerciseLogger = createDomainLogger('EXERCISE');

/**
 * State interface for exercise reference data
 * This is system-controlled reference data that's prefetched and cached
 */
interface ExerciseState {
  exercises: Exercise[];
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  
  // Actions
  setExercises: (exercises: Exercise[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
  
  // Service integration actions
  loadExercises: () => Promise<void>;
  
  // Getters
  getAllExercises: () => Exercise[];
  getExerciseById: (id: string) => Exercise | undefined;
  
  // Internal method to set service (for testing)
  _setService: (service: ExerciseService) => void;
}

const createInitialState = () => ({
  exercises: [],
  isLoading: false,
  isInitialized: false,
  error: null,
});

// Create service instance (can be overridden for testing)
let exerciseService = new ExerciseService(exerciseRepository);

export const exerciseStore = observable<ExerciseState>({
  ...createInitialState(),

  // Actions
  setExercises: (exercises: Exercise[]) => {
    exerciseStore.exercises.set(exercises);
    exerciseStore.isInitialized.set(true);
  },

  setLoading: (loading: boolean) => {
    exerciseStore.isLoading.set(loading);
  },

  setError: (error: string | null) => {
    exerciseStore.error.set(error);
  },

  reset: () => {
    const initialState = createInitialState();
    exerciseStore.exercises.set(initialState.exercises);
    exerciseStore.isLoading.set(initialState.isLoading);
    exerciseStore.isInitialized.set(initialState.isInitialized);
    exerciseStore.error.set(initialState.error);
  },

  // Service integration actions
  loadExercises: async () => {
    // Skip if already loaded to prevent unnecessary refetches
    if (exerciseStore.isInitialized.get()) {
      exerciseLogger.debug('Data already loaded, skipping fetch');
      return;
    }

    try {
      exerciseStore.setLoading(true);
      exerciseStore.setError(null);

      exerciseLogger.info('Loading exercises from reference data...');
      const exercises = await exerciseService.getAllExercises();

      exerciseStore.setExercises(exercises);
      exerciseLogger.info(`Loaded ${exercises.length} exercises`);
    } catch (error) {
      exerciseLogger.error('Error loading exercises:', error);
      exerciseStore.setError('Failed to load exercises');
      exerciseStore.setExercises([]);
    } finally {
      exerciseStore.setLoading(false);
      exerciseStore.isInitialized.set(true);
    }
  },

  // Getters
  getAllExercises: () => {
    return exerciseStore.exercises.get();
  },

  getExerciseById: (id: string) => {
    return exerciseStore.exercises.get().find((ex) => ex.id === id);
  },

  // Internal method to set service (for testing)
  _setService: (service: ExerciseService) => {
    exerciseService = service;
  },
});


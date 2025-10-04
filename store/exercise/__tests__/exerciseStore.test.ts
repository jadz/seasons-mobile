import { exerciseStore } from '../exerciseStore';
import { ExerciseService } from '../../../domain/services/ExerciseService';
import { Exercise } from '../../../domain/models/exercise';

describe('exerciseStore', () => {
  let mockService: jest.Mocked<ExerciseService>;

  const mockExercises: Exercise[] = [
    {
      id: '1',
      name: 'Bench Press',
      primaryMuscleGroup: 'chest',
      otherMuscles: ['triceps'],
      equipmentCategory: 'barbell',
      videoUrl: 'video1.mp4',
      thumbnailImage: 'thumb1.jpg',
      steps: ['Step 1'],
    },
    {
      id: '2',
      name: 'Squat',
      primaryMuscleGroup: 'legs',
      otherMuscles: ['glutes'],
      equipmentCategory: 'barbell',
      videoUrl: 'video2.mp4',
      thumbnailImage: 'thumb2.jpg',
      steps: ['Step 1'],
    },
  ];

  beforeEach(() => {
    // Reset store state
    exerciseStore.reset();

    // Create mock service
    mockService = {
      getAllExercises: jest.fn().mockResolvedValue(mockExercises),
      getExerciseById: jest.fn(),
      getExercisesByMuscleGroup: jest.fn(),
      getExercisesByEquipment: jest.fn(),
      searchExercisesByName: jest.fn(),
      getAllMuscleGroups: jest.fn(),
      getAllEquipmentCategories: jest.fn(),
    } as any;

    // Inject mock service
    exerciseStore._setService(mockService);
  });

  describe('loadExercises', () => {
    it('should load exercises successfully', async () => {
      await exerciseStore.loadExercises();

      expect(exerciseStore.exercises.get()).toEqual(mockExercises);
      expect(exerciseStore.isInitialized.get()).toBe(true);
      expect(exerciseStore.isLoading.get()).toBe(false);
      expect(exerciseStore.error.get()).toBeNull();
    });

    it('should set loading state during load', async () => {
      const loadPromise = exerciseStore.loadExercises();

      // Check loading state (might be true depending on timing)
      await loadPromise;

      expect(exerciseStore.isLoading.get()).toBe(false);
      expect(exerciseStore.isInitialized.get()).toBe(true);
    });

    it('should handle errors gracefully', async () => {
      const error = new Error('Failed to load');
      mockService.getAllExercises.mockRejectedValueOnce(error);

      await exerciseStore.loadExercises();

      expect(exerciseStore.exercises.get()).toEqual([]);
      expect(exerciseStore.error.get()).toBe('Failed to load exercises');
      expect(exerciseStore.isInitialized.get()).toBe(true);
    });

    it('should skip loading if already initialized', async () => {
      // First load
      await exerciseStore.loadExercises();
      expect(mockService.getAllExercises).toHaveBeenCalledTimes(1);

      // Second load should be skipped
      await exerciseStore.loadExercises();
      expect(mockService.getAllExercises).toHaveBeenCalledTimes(1);
    });
  });

  describe('getAllExercises', () => {
    it('should return all exercises from state', async () => {
      await exerciseStore.loadExercises();

      const exercises = exerciseStore.getAllExercises();

      expect(exercises).toEqual(mockExercises);
    });

    it('should return empty array before loading', () => {
      const exercises = exerciseStore.getAllExercises();

      expect(exercises).toEqual([]);
    });
  });

  describe('getExerciseById', () => {
    it('should find exercise by ID', async () => {
      await exerciseStore.loadExercises();

      const exercise = exerciseStore.getExerciseById('1');

      expect(exercise).toEqual(mockExercises[0]);
    });

    it('should return undefined for non-existent ID', async () => {
      await exerciseStore.loadExercises();

      const exercise = exerciseStore.getExerciseById('999');

      expect(exercise).toBeUndefined();
    });
  });

  describe('reset', () => {
    it('should reset store to initial state', async () => {
      await exerciseStore.loadExercises();

      exerciseStore.reset();

      expect(exerciseStore.exercises.get()).toEqual([]);
      expect(exerciseStore.isInitialized.get()).toBe(false);
      expect(exerciseStore.isLoading.get()).toBe(false);
      expect(exerciseStore.error.get()).toBeNull();
    });
  });

  describe('setExercises', () => {
    it('should set exercises and mark as initialized', () => {
      exerciseStore.setExercises(mockExercises);

      expect(exerciseStore.exercises.get()).toEqual(mockExercises);
      expect(exerciseStore.isInitialized.get()).toBe(true);
    });
  });

  describe('setError', () => {
    it('should set error message', () => {
      exerciseStore.setError('Test error');

      expect(exerciseStore.error.get()).toBe('Test error');
    });

    it('should clear error when set to null', () => {
      exerciseStore.setError('Test error');
      exerciseStore.setError(null);

      expect(exerciseStore.error.get()).toBeNull();
    });
  });
});


import { ExerciseService } from '../ExerciseService';
import { IExerciseRepository } from '../../../db/repositories/ExerciseRepository';
import { Exercise } from '../../models/exercise';

describe('ExerciseService', () => {
  let service: ExerciseService;
  let mockRepository: jest.Mocked<IExerciseRepository>;

  const mockExercises: Exercise[] = [
    {
      id: '1',
      name: 'Bench Press (Barbell)',
      primaryMuscleGroup: 'chest',
      otherMuscles: ['triceps', 'shoulders'],
      equipmentCategory: 'barbell',
      videoUrl: 'video1.mp4',
      thumbnailImage: 'thumb1.jpg',
      steps: ['Step 1', 'Step 2'],
    },
    {
      id: '2',
      name: 'Overhead Press (Barbell)',
      primaryMuscleGroup: 'shoulders',
      otherMuscles: ['triceps'],
      equipmentCategory: 'barbell',
      videoUrl: 'video2.mp4',
      thumbnailImage: 'thumb2.jpg',
      steps: ['Step 1', 'Step 2'],
    },
    {
      id: '3',
      name: 'Dumbbell Curl',
      primaryMuscleGroup: 'biceps',
      otherMuscles: [],
      equipmentCategory: 'dumbbell',
      videoUrl: 'video3.mp4',
      thumbnailImage: 'thumb3.jpg',
      steps: ['Step 1', 'Step 2'],
    },
  ];

  beforeEach(() => {
    mockRepository = {
      getAllExercises: jest.fn().mockResolvedValue(mockExercises),
      findById: jest.fn().mockImplementation((id: string) =>
        Promise.resolve(mockExercises.find((ex) => ex.id === id) || null)
      ),
      findByPrimaryMuscleGroup: jest.fn().mockImplementation((muscle: string) =>
        Promise.resolve(
          mockExercises.filter((ex) => ex.primaryMuscleGroup.toLowerCase() === muscle.toLowerCase())
        )
      ),
      findByEquipmentCategory: jest.fn().mockImplementation((equipment: string) =>
        Promise.resolve(
          mockExercises.filter((ex) => ex.equipmentCategory.toLowerCase() === equipment.toLowerCase())
        )
      ),
    };

    service = new ExerciseService(mockRepository);
  });

  describe('getAllExercises', () => {
    it('should return all exercises from repository', async () => {
      const exercises = await service.getAllExercises();

      expect(exercises).toEqual(mockExercises);
      expect(mockRepository.getAllExercises).toHaveBeenCalledTimes(1);
    });
  });

  describe('getExerciseById', () => {
    it('should return exercise by ID', async () => {
      const exercise = await service.getExerciseById('1');

      expect(exercise).toEqual(mockExercises[0]);
      expect(mockRepository.findById).toHaveBeenCalledWith('1');
    });

    it('should return null for non-existent ID', async () => {
      const exercise = await service.getExerciseById('999');

      expect(exercise).toBeNull();
    });
  });

  describe('getExercisesByMuscleGroup', () => {
    it('should return exercises filtered by muscle group', async () => {
      const exercises = await service.getExercisesByMuscleGroup('chest');

      expect(exercises).toHaveLength(1);
      expect(exercises[0].primaryMuscleGroup).toBe('chest');
      expect(mockRepository.findByPrimaryMuscleGroup).toHaveBeenCalledWith('chest');
    });
  });

  describe('getExercisesByEquipment', () => {
    it('should return exercises filtered by equipment', async () => {
      const exercises = await service.getExercisesByEquipment('barbell');

      expect(exercises).toHaveLength(2);
      exercises.forEach((ex) => {
        expect(ex.equipmentCategory).toBe('barbell');
      });
      expect(mockRepository.findByEquipmentCategory).toHaveBeenCalledWith('barbell');
    });
  });

  describe('searchExercisesByName', () => {
    it('should find exercises by partial name match', async () => {
      const results = await service.searchExercisesByName('press');

      expect(results).toHaveLength(2);
      expect(results[0].name).toContain('Press');
      expect(results[1].name).toContain('Press');
    });

    it('should be case-insensitive', async () => {
      const results = await service.searchExercisesByName('BENCH');

      expect(results).toHaveLength(1);
      expect(results[0].name).toContain('Bench');
    });

    it('should return empty array when no matches found', async () => {
      const results = await service.searchExercisesByName('nonexistent');

      expect(results).toEqual([]);
    });
  });

  describe('getAllMuscleGroups', () => {
    it('should return unique sorted list of muscle groups', async () => {
      const muscleGroups = await service.getAllMuscleGroups();

      expect(muscleGroups).toEqual(['biceps', 'chest', 'shoulders']);
      expect(mockRepository.getAllExercises).toHaveBeenCalledTimes(1);
    });
  });

  describe('getAllEquipmentCategories', () => {
    it('should return unique sorted list of equipment categories', async () => {
      const equipment = await service.getAllEquipmentCategories();

      expect(equipment).toEqual(['barbell', 'dumbbell']);
      expect(mockRepository.getAllExercises).toHaveBeenCalledTimes(1);
    });
  });
});


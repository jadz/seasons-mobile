import { ExerciseRepository } from '../ExerciseRepository';

describe('ExerciseRepository', () => {
  let repository: ExerciseRepository;

  beforeEach(() => {
    repository = new ExerciseRepository();
  });

  describe('getAllExercises', () => {
    it('should load all exercises from JSON', async () => {
      const exercises = await repository.getAllExercises();

      expect(exercises).toBeDefined();
      expect(exercises.length).toBeGreaterThan(0);
      expect(exercises[0]).toHaveProperty('id');
      expect(exercises[0]).toHaveProperty('name');
      expect(exercises[0]).toHaveProperty('primaryMuscleGroup');
    });

    it('should transform JSON snake_case to camelCase', async () => {
      const exercises = await repository.getAllExercises();
      const exercise = exercises[0];

      expect(exercise.primaryMuscleGroup).toBeDefined();
      expect(exercise.equipmentCategory).toBeDefined();
      expect(exercise.otherMuscles).toBeDefined();
      expect(exercise.videoUrl).toBeDefined();
      expect(exercise.thumbnailImage).toBeDefined();
    });

    it('should cache exercises after first load', async () => {
      const firstCall = await repository.getAllExercises();
      const secondCall = await repository.getAllExercises();

      expect(firstCall).toBe(secondCall); // Same reference
    });
  });

  describe('findById', () => {
    it('should find exercise by ID', async () => {
      const exercise = await repository.findById('00251201');

      expect(exercise).toBeDefined();
      expect(exercise?.id).toBe('00251201');
      expect(exercise?.name).toContain('Bench Press');
    });

    it('should return null for non-existent ID', async () => {
      const exercise = await repository.findById('non-existent-id');

      expect(exercise).toBeNull();
    });
  });

  describe('findByPrimaryMuscleGroup', () => {
    it('should find exercises by muscle group', async () => {
      const chestExercises = await repository.findByPrimaryMuscleGroup('chest');

      expect(chestExercises.length).toBeGreaterThan(0);
      chestExercises.forEach((exercise) => {
        expect(exercise.primaryMuscleGroup.toLowerCase()).toBe('chest');
      });
    });

    it('should be case-insensitive', async () => {
      const lowerCase = await repository.findByPrimaryMuscleGroup('chest');
      const upperCase = await repository.findByPrimaryMuscleGroup('CHEST');
      const mixedCase = await repository.findByPrimaryMuscleGroup('ChEsT');

      expect(lowerCase.length).toBe(upperCase.length);
      expect(lowerCase.length).toBe(mixedCase.length);
    });

    it('should return empty array for non-existent muscle group', async () => {
      const exercises = await repository.findByPrimaryMuscleGroup('non-existent');

      expect(exercises).toEqual([]);
    });
  });

  describe('findByEquipmentCategory', () => {
    it('should find exercises by equipment', async () => {
      const barbellExercises = await repository.findByEquipmentCategory('barbell');

      expect(barbellExercises.length).toBeGreaterThan(0);
      barbellExercises.forEach((exercise) => {
        expect(exercise.equipmentCategory.toLowerCase()).toBe('barbell');
      });
    });

    it('should be case-insensitive', async () => {
      const lowerCase = await repository.findByEquipmentCategory('barbell');
      const upperCase = await repository.findByEquipmentCategory('BARBELL');

      expect(lowerCase.length).toBe(upperCase.length);
    });

    it('should return empty array for non-existent equipment', async () => {
      const exercises = await repository.findByEquipmentCategory('non-existent');

      expect(exercises).toEqual([]);
    });
  });
});


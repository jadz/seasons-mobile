import { Exercise } from '../../domain/models/exercise';
import exercisesData from '../../data/exercises_v1.0.json';
import { createDomainLogger } from '../../utils/logger';

const logger = createDomainLogger('EXERCISE_REPO');

/**
 * Repository for Exercise reference data
 * Data source: exercises_v1.0.json (static reference file)
 */
export interface IExerciseRepository {
  /**
   * Get all exercises from the reference data
   */
  getAllExercises(): Promise<Exercise[]>;
  
  /**
   * Find exercise by ID
   */
  findById(exerciseId: string): Promise<Exercise | null>;
  
  /**
   * Find exercises by primary muscle group
   */
  findByPrimaryMuscleGroup(muscleGroup: string): Promise<Exercise[]>;
  
  /**
   * Find exercises by equipment category
   */
  findByEquipmentCategory(equipment: string): Promise<Exercise[]>;
}

export class ExerciseRepository implements IExerciseRepository {
  private exercises: Exercise[] = [];
  private isLoaded = false;

  /**
   * Load and transform exercises from JSON to domain model
   */
  private loadExercises(): void {
    if (this.isLoaded) {
      logger.debug('Exercises already loaded, skipping');
      return;
    }

    const startTime = performance.now();
    logger.info(`Loading ${exercisesData.length} exercises from JSON...`);

    this.exercises = exercisesData.map((exercise) => ({
      id: exercise.exerciseId,
      name: exercise.name,
      primaryMuscleGroup: exercise.primary_muscle_group,
      otherMuscles: exercise.other_muscles || [],
      equipmentCategory: exercise.equipment_category,
      videoUrl: exercise.video_url,
      thumbnailImage: exercise.thumbnail_image,
      steps: exercise.steps || [],
    }));

    this.isLoaded = true;
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    logger.info(`✓ Loaded ${this.exercises.length} exercises in ${duration.toFixed(2)}ms`);
  }

  async getAllExercises(): Promise<Exercise[]> {
    const methodStart = performance.now();
    this.loadExercises();
    const methodEnd = performance.now();
    logger.debug(`getAllExercises() completed in ${(methodEnd - methodStart).toFixed(2)}ms`);
    return this.exercises;
  }

  async findById(exerciseId: string): Promise<Exercise | null> {
    const methodStart = performance.now();
    this.loadExercises();
    const result = this.exercises.find((ex) => ex.id === exerciseId) || null;
    const methodEnd = performance.now();
    logger.debug(`findById() completed in ${(methodEnd - methodStart).toFixed(2)}ms`);
    return result;
  }

  async findByPrimaryMuscleGroup(muscleGroup: string): Promise<Exercise[]> {
    const methodStart = performance.now();
    this.loadExercises();
    const result = this.exercises.filter(
      (ex) => ex.primaryMuscleGroup.toLowerCase() === muscleGroup.toLowerCase()
    );
    const methodEnd = performance.now();
    logger.debug(`findByPrimaryMuscleGroup() completed in ${(methodEnd - methodStart).toFixed(2)}ms, found ${result.length} exercises`);
    return result;
  }

  async findByEquipmentCategory(equipment: string): Promise<Exercise[]> {
    const methodStart = performance.now();
    this.loadExercises();
    const result = this.exercises.filter(
      (ex) => ex.equipmentCategory.toLowerCase() === equipment.toLowerCase()
    );
    const methodEnd = performance.now();
    logger.debug(`findByEquipmentCategory() completed in ${(methodEnd - methodStart).toFixed(2)}ms, found ${result.length} exercises`);
    return result;
  }
}

// Export singleton instance
export const exerciseRepository = new ExerciseRepository();


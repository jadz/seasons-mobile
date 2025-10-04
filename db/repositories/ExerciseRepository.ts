import { Exercise } from '../../domain/models/exercise';
import exercisesData from '../../data/exercises_v1.0.json';

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
    if (this.isLoaded) return;

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
  }

  async getAllExercises(): Promise<Exercise[]> {
    this.loadExercises();
    return this.exercises;
  }

  async findById(exerciseId: string): Promise<Exercise | null> {
    this.loadExercises();
    return this.exercises.find((ex) => ex.id === exerciseId) || null;
  }

  async findByPrimaryMuscleGroup(muscleGroup: string): Promise<Exercise[]> {
    this.loadExercises();
    return this.exercises.filter(
      (ex) => ex.primaryMuscleGroup.toLowerCase() === muscleGroup.toLowerCase()
    );
  }

  async findByEquipmentCategory(equipment: string): Promise<Exercise[]> {
    this.loadExercises();
    return this.exercises.filter(
      (ex) => ex.equipmentCategory.toLowerCase() === equipment.toLowerCase()
    );
  }
}

// Export singleton instance
export const exerciseRepository = new ExerciseRepository();


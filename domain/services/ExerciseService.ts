import { Exercise } from '../models/exercise';
import { IExerciseRepository } from '../../db/repositories/ExerciseRepository';

/**
 * Service for managing exercise reference data
 * 
 * Provides business logic and coordination for exercise-related operations.
 * Since exercises are read-only reference data, this service primarily
 * provides query methods with potential filtering and sorting logic.
 */
export class ExerciseService {
  constructor(private readonly exerciseRepository: IExerciseRepository) {}

  /**
   * Get all exercises from the reference data
   */
  async getAllExercises(): Promise<Exercise[]> {
    return await this.exerciseRepository.getAllExercises();
  }

  /**
   * Find exercise by ID
   */
  async getExerciseById(exerciseId: string): Promise<Exercise | null> {
    return await this.exerciseRepository.findById(exerciseId);
  }

  /**
   * Get exercises filtered by primary muscle group
   */
  async getExercisesByMuscleGroup(muscleGroup: string): Promise<Exercise[]> {
    return await this.exerciseRepository.findByPrimaryMuscleGroup(muscleGroup);
  }

  /**
   * Get exercises filtered by equipment category
   */
  async getExercisesByEquipment(equipment: string): Promise<Exercise[]> {
    return await this.exerciseRepository.findByEquipmentCategory(equipment);
  }

  /**
   * Search exercises by name (case-insensitive partial match)
   */
  async searchExercisesByName(searchTerm: string): Promise<Exercise[]> {
    const allExercises = await this.exerciseRepository.getAllExercises();
    const lowerSearchTerm = searchTerm.toLowerCase();
    
    return allExercises.filter((exercise) =>
      exercise.name.toLowerCase().includes(lowerSearchTerm)
    );
  }

  /**
   * Get unique list of all muscle groups
   */
  async getAllMuscleGroups(): Promise<string[]> {
    const exercises = await this.exerciseRepository.getAllExercises();
    const muscleGroups = new Set(exercises.map((ex) => ex.primaryMuscleGroup));
    return Array.from(muscleGroups).sort();
  }

  /**
   * Get unique list of all equipment categories
   */
  async getAllEquipmentCategories(): Promise<string[]> {
    const exercises = await this.exerciseRepository.getAllExercises();
    const equipment = new Set(exercises.map((ex) => ex.equipmentCategory));
    return Array.from(equipment).sort();
  }
}


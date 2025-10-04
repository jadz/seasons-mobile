/**
 * Domain model for Exercise
 * 
 * Exercises are reference data loaded from exercises_v1.0.json
 * This is read-only system data that provides the exercise library.
 */

export interface Exercise {
  id: string; // Maps to exerciseId from JSON
  name: string;
  primaryMuscleGroup: string;
  otherMuscles: string[];
  equipmentCategory: string;
  videoUrl: string;
  thumbnailImage: string;
  steps: string[];
}


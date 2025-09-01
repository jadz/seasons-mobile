/**
 * Domain models for user measurement and training preferences
 * 
 * These models represent the user's preferred units and settings for:
 * - Body weight tracking and display
 * - Strength training load measurements
 * - Body measurement recording (height, circumferences, etc.)
 * - Distance tracking for cardio and movement
 * - Advanced logging features for detailed workout analysis
 */

/**
 * Units for measuring and displaying body weight
 */
export enum BodyWeightUnit {
  KILOGRAMS = 'kg',
  POUNDS = 'lbs'
}

/**
 * Units for measuring and displaying strength training loads (weights, resistance)
 */
export enum StrengthTrainingUnit {
  KILOGRAMS = 'kg',
  POUNDS = 'lbs'
}

/**
 * Units for measuring and displaying body measurements (height, circumferences, etc.)
 */
export enum BodyMeasurementUnit {
  CENTIMETERS = 'cm',
  INCHES = 'in'
}

/**
 * Units for measuring and displaying distances (running, walking, cycling)
 */
export enum DistanceUnit {
  KILOMETERS = 'km',
  MILES = 'mi'
}

/**
 * Core user preferences for measurements and training features
 */
export interface UserPreferences {
  id: string;
  userId: string;
  bodyWeightUnit: BodyWeightUnit;
  strengthTrainingUnit: StrengthTrainingUnit;
  bodyMeasurementUnit: BodyMeasurementUnit;
  distanceUnit: DistanceUnit;
  advancedLoggingEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Default user preferences following metric system standards
 */
export const DEFAULT_USER_PREFERENCES = {
  bodyWeightUnit: BodyWeightUnit.KILOGRAMS,
  strengthTrainingUnit: StrengthTrainingUnit.KILOGRAMS,
  bodyMeasurementUnit: BodyMeasurementUnit.CENTIMETERS,
  distanceUnit: DistanceUnit.KILOMETERS,
  advancedLoggingEnabled: false,
} as const;

/**
 * Create default user preferences for a new user
 */
export function createDefaultUserPreferences(userId: string): Omit<UserPreferences, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    userId,
    ...DEFAULT_USER_PREFERENCES,
  };
}

/**
 * Validate that all enum values are valid
 */
export function validateUserPreferences(preferences: Partial<UserPreferences>): boolean {
  if (preferences.bodyWeightUnit && !Object.values(BodyWeightUnit).includes(preferences.bodyWeightUnit)) {
    return false;
  }
  
  if (preferences.strengthTrainingUnit && !Object.values(StrengthTrainingUnit).includes(preferences.strengthTrainingUnit)) {
    return false;
  }
  
  if (preferences.bodyMeasurementUnit && !Object.values(BodyMeasurementUnit).includes(preferences.bodyMeasurementUnit)) {
    return false;
  }
  
  if (preferences.distanceUnit && !Object.values(DistanceUnit).includes(preferences.distanceUnit)) {
    return false;
  }
  
  return true;
}

/**
 * Check if preferences use the metric system
 */
export function isMetricSystem(preferences: UserPreferences): boolean {
  return preferences.bodyWeightUnit === BodyWeightUnit.KILOGRAMS &&
         preferences.strengthTrainingUnit === StrengthTrainingUnit.KILOGRAMS &&
         preferences.bodyMeasurementUnit === BodyMeasurementUnit.CENTIMETERS &&
         preferences.distanceUnit === DistanceUnit.KILOMETERS;
}

/**
 * Check if preferences use the imperial system
 */
export function isImperialSystem(preferences: UserPreferences): boolean {
  return preferences.bodyWeightUnit === BodyWeightUnit.POUNDS &&
         preferences.strengthTrainingUnit === StrengthTrainingUnit.POUNDS &&
         preferences.bodyMeasurementUnit === BodyMeasurementUnit.INCHES &&
         preferences.distanceUnit === DistanceUnit.MILES;
}

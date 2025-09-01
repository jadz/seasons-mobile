import { UserPreferences, BodyWeightUnit, StrengthTrainingUnit, BodyMeasurementUnit, DistanceUnit } from '../models/userPreferences';

/**
 * View type for user preferences queries - includes all fields with optional relationships
 */
export type UserPreferencesView = UserPreferences;

/**
 * Data type for creating new user preferences (excludes generated fields)
 */
export interface UserPreferencesData {
  userId: string;
  bodyWeightUnit: BodyWeightUnit;
  strengthTrainingUnit: StrengthTrainingUnit;
  bodyMeasurementUnit: BodyMeasurementUnit;
  distanceUnit: DistanceUnit;
  advancedLoggingEnabled: boolean;
}

/**
 * Data type for updating user preferences (all fields optional except user reference)
 */
export interface UserPreferencesUpdate {
  bodyWeightUnit?: BodyWeightUnit;
  strengthTrainingUnit?: StrengthTrainingUnit;
  bodyMeasurementUnit?: BodyMeasurementUnit;
  distanceUnit?: DistanceUnit;
  advancedLoggingEnabled?: boolean;
}

/**
 * Onboarding data for user preferences (subset of required fields during signup)
 */
export interface UserPreferencesOnboardingData {
  bodyWeightUnit: BodyWeightUnit;
  strengthTrainingUnit: StrengthTrainingUnit;
  bodyMeasurementUnit: BodyMeasurementUnit;
  distanceUnit: DistanceUnit;
}

import {
  UserPreferencesView,
  UserPreferencesData,
  UserPreferencesUpdate,
  UserPreferencesOnboardingData,
} from '../userPreferencesViews';
import {
  UserPreferences,
  BodyWeightUnit,
  StrengthTrainingUnit,
  BodyMeasurementUnit,
  DistanceUnit,
} from '../../models/userPreferences';

describe('UserPreferences View Types', () => {
  describe('Type Compatibility', () => {
    test('UserPreferencesView should be compatible with UserPreferences', () => {
      const userPreferences: UserPreferences = {
        id: 'test-id',
        userId: 'test-user',
        bodyWeightUnit: BodyWeightUnit.KILOGRAMS,
        strengthTrainingUnit: StrengthTrainingUnit.KILOGRAMS,
        bodyMeasurementUnit: BodyMeasurementUnit.CENTIMETERS,
        distanceUnit: DistanceUnit.KILOMETERS,
        advancedLoggingEnabled: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // This should compile without issues
      const view: UserPreferencesView = userPreferences;
      expect(view).toBeDefined();
    });

    test('UserPreferencesData should contain required fields for creation', () => {
      const preferencesData: UserPreferencesData = {
        userId: 'test-user',
        bodyWeightUnit: BodyWeightUnit.POUNDS,
        strengthTrainingUnit: StrengthTrainingUnit.POUNDS,
        bodyMeasurementUnit: BodyMeasurementUnit.INCHES,
        distanceUnit: DistanceUnit.MILES,
        advancedLoggingEnabled: true,
      };

      expect(preferencesData.userId).toBe('test-user');
      expect(preferencesData.bodyWeightUnit).toBe(BodyWeightUnit.POUNDS);
      expect(preferencesData.advancedLoggingEnabled).toBe(true);
    });

    test('UserPreferencesUpdate should allow partial updates', () => {
      const partialUpdate: UserPreferencesUpdate = {
        bodyWeightUnit: BodyWeightUnit.POUNDS,
        advancedLoggingEnabled: true,
        // Other fields are optional
      };

      expect(partialUpdate.bodyWeightUnit).toBe(BodyWeightUnit.POUNDS);
      expect(partialUpdate.advancedLoggingEnabled).toBe(true);
      expect(partialUpdate.strengthTrainingUnit).toBeUndefined();
    });

    test('UserPreferencesUpdate should allow empty object', () => {
      const emptyUpdate: UserPreferencesUpdate = {};
      expect(Object.keys(emptyUpdate)).toHaveLength(0);
    });

    test('UserPreferencesOnboardingData should contain core unit preferences', () => {
      const onboardingData: UserPreferencesOnboardingData = {
        bodyWeightUnit: BodyWeightUnit.KILOGRAMS,
        strengthTrainingUnit: StrengthTrainingUnit.KILOGRAMS,
        bodyMeasurementUnit: BodyMeasurementUnit.CENTIMETERS,
        distanceUnit: DistanceUnit.KILOMETERS,
      };

      expect(onboardingData.bodyWeightUnit).toBe(BodyWeightUnit.KILOGRAMS);
      expect(onboardingData.strengthTrainingUnit).toBe(StrengthTrainingUnit.KILOGRAMS);
      expect(onboardingData.bodyMeasurementUnit).toBe(BodyMeasurementUnit.CENTIMETERS);
      expect(onboardingData.distanceUnit).toBe(DistanceUnit.KILOMETERS);
    });
  });

  describe('Type Structure Validation', () => {
    test('UserPreferencesData should not include id, createdAt, or updatedAt', () => {
      const preferencesData: UserPreferencesData = {
        userId: 'test-user',
        bodyWeightUnit: BodyWeightUnit.KILOGRAMS,
        strengthTrainingUnit: StrengthTrainingUnit.KILOGRAMS,
        bodyMeasurementUnit: BodyMeasurementUnit.CENTIMETERS,
        distanceUnit: DistanceUnit.KILOMETERS,
        advancedLoggingEnabled: false,
      };

      // TypeScript compilation will fail if these properties exist
      expect(preferencesData).not.toHaveProperty('id');
      expect(preferencesData).not.toHaveProperty('createdAt');
      expect(preferencesData).not.toHaveProperty('updatedAt');
    });

    test('UserPreferencesOnboardingData should not include userId or advancedLoggingEnabled', () => {
      const onboardingData: UserPreferencesOnboardingData = {
        bodyWeightUnit: BodyWeightUnit.KILOGRAMS,
        strengthTrainingUnit: StrengthTrainingUnit.KILOGRAMS,
        bodyMeasurementUnit: BodyMeasurementUnit.CENTIMETERS,
        distanceUnit: DistanceUnit.KILOMETERS,
      };

      // These are not part of onboarding flow
      expect(onboardingData).not.toHaveProperty('userId');
      expect(onboardingData).not.toHaveProperty('advancedLoggingEnabled');
    });
  });
});

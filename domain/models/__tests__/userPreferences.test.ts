import {
  UserPreferences,
  BodyWeightUnit,
  StrengthTrainingUnit,
  BodyMeasurementUnit,
  DistanceUnit,
  DEFAULT_USER_PREFERENCES,
  createDefaultUserPreferences,
  validateUserPreferences,
  isMetricSystem,
  isImperialSystem,
} from '../userPreferences';

describe('UserPreferences Domain Models', () => {
  describe('Enums', () => {
    test('BodyWeightUnit should have correct values', () => {
      expect(BodyWeightUnit.KILOGRAMS).toBe('kg');
      expect(BodyWeightUnit.POUNDS).toBe('lbs');
      expect(Object.values(BodyWeightUnit)).toHaveLength(2);
    });

    test('StrengthTrainingUnit should have correct values', () => {
      expect(StrengthTrainingUnit.KILOGRAMS).toBe('kg');
      expect(StrengthTrainingUnit.POUNDS).toBe('lbs');
      expect(Object.values(StrengthTrainingUnit)).toHaveLength(2);
    });

    test('BodyMeasurementUnit should have correct values', () => {
      expect(BodyMeasurementUnit.CENTIMETERS).toBe('cm');
      expect(BodyMeasurementUnit.INCHES).toBe('in');
      expect(Object.values(BodyMeasurementUnit)).toHaveLength(2);
    });

    test('DistanceUnit should have correct values', () => {
      expect(DistanceUnit.KILOMETERS).toBe('km');
      expect(DistanceUnit.MILES).toBe('mi');
      expect(Object.values(DistanceUnit)).toHaveLength(2);
    });
  });

  describe('DEFAULT_USER_PREFERENCES', () => {
    test('should use metric system as default', () => {
      expect(DEFAULT_USER_PREFERENCES.bodyWeightUnit).toBe(BodyWeightUnit.KILOGRAMS);
      expect(DEFAULT_USER_PREFERENCES.strengthTrainingUnit).toBe(StrengthTrainingUnit.KILOGRAMS);
      expect(DEFAULT_USER_PREFERENCES.bodyMeasurementUnit).toBe(BodyMeasurementUnit.CENTIMETERS);
      expect(DEFAULT_USER_PREFERENCES.distanceUnit).toBe(DistanceUnit.KILOMETERS);
    });

    test('should have advanced logging disabled by default', () => {
      expect(DEFAULT_USER_PREFERENCES.advancedLoggingEnabled).toBe(false);
    });
  });

  describe('createDefaultUserPreferences', () => {
    test('should create preferences with provided userId and defaults', () => {
      const userId = 'test-user-123';
      const preferences = createDefaultUserPreferences(userId);

      expect(preferences.userId).toBe(userId);
      expect(preferences.bodyWeightUnit).toBe(DEFAULT_USER_PREFERENCES.bodyWeightUnit);
      expect(preferences.strengthTrainingUnit).toBe(DEFAULT_USER_PREFERENCES.strengthTrainingUnit);
      expect(preferences.bodyMeasurementUnit).toBe(DEFAULT_USER_PREFERENCES.bodyMeasurementUnit);
      expect(preferences.distanceUnit).toBe(DEFAULT_USER_PREFERENCES.distanceUnit);
      expect(preferences.advancedLoggingEnabled).toBe(DEFAULT_USER_PREFERENCES.advancedLoggingEnabled);
    });

    test('should not include id, createdAt, or updatedAt fields', () => {
      const preferences = createDefaultUserPreferences('test-user');
      
      expect(preferences).not.toHaveProperty('id');
      expect(preferences).not.toHaveProperty('createdAt');
      expect(preferences).not.toHaveProperty('updatedAt');
    });
  });

  describe('validateUserPreferences', () => {
    test('should return true for valid preferences', () => {
      const validPreferences: Partial<UserPreferences> = {
        bodyWeightUnit: BodyWeightUnit.KILOGRAMS,
        strengthTrainingUnit: StrengthTrainingUnit.POUNDS,
        bodyMeasurementUnit: BodyMeasurementUnit.CENTIMETERS,
        distanceUnit: DistanceUnit.MILES,
      };

      expect(validateUserPreferences(validPreferences)).toBe(true);
    });

    test('should return true for empty preferences object', () => {
      expect(validateUserPreferences({})).toBe(true);
    });

    test('should return false for invalid bodyWeightUnit', () => {
      const invalidPreferences = {
        bodyWeightUnit: 'invalid' as BodyWeightUnit,
      };

      expect(validateUserPreferences(invalidPreferences)).toBe(false);
    });

    test('should return false for invalid strengthTrainingUnit', () => {
      const invalidPreferences = {
        strengthTrainingUnit: 'invalid' as StrengthTrainingUnit,
      };

      expect(validateUserPreferences(invalidPreferences)).toBe(false);
    });

    test('should return false for invalid bodyMeasurementUnit', () => {
      const invalidPreferences = {
        bodyMeasurementUnit: 'invalid' as BodyMeasurementUnit,
      };

      expect(validateUserPreferences(invalidPreferences)).toBe(false);
    });

    test('should return false for invalid distanceUnit', () => {
      const invalidPreferences = {
        distanceUnit: 'invalid' as DistanceUnit,
      };

      expect(validateUserPreferences(invalidPreferences)).toBe(false);
    });
  });

  describe('isMetricSystem', () => {
    test('should return true for full metric preferences', () => {
      const metricPreferences: UserPreferences = {
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

      expect(isMetricSystem(metricPreferences)).toBe(true);
    });

    test('should return false for mixed unit preferences', () => {
      const mixedPreferences: UserPreferences = {
        id: 'test-id',
        userId: 'test-user',
        bodyWeightUnit: BodyWeightUnit.KILOGRAMS,
        strengthTrainingUnit: StrengthTrainingUnit.POUNDS, // Imperial
        bodyMeasurementUnit: BodyMeasurementUnit.CENTIMETERS,
        distanceUnit: DistanceUnit.KILOMETERS,
        advancedLoggingEnabled: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(isMetricSystem(mixedPreferences)).toBe(false);
    });

    test('should return false for imperial preferences', () => {
      const imperialPreferences: UserPreferences = {
        id: 'test-id',
        userId: 'test-user',
        bodyWeightUnit: BodyWeightUnit.POUNDS,
        strengthTrainingUnit: StrengthTrainingUnit.POUNDS,
        bodyMeasurementUnit: BodyMeasurementUnit.INCHES,
        distanceUnit: DistanceUnit.MILES,
        advancedLoggingEnabled: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(isMetricSystem(imperialPreferences)).toBe(false);
    });
  });

  describe('isImperialSystem', () => {
    test('should return true for full imperial preferences', () => {
      const imperialPreferences: UserPreferences = {
        id: 'test-id',
        userId: 'test-user',
        bodyWeightUnit: BodyWeightUnit.POUNDS,
        strengthTrainingUnit: StrengthTrainingUnit.POUNDS,
        bodyMeasurementUnit: BodyMeasurementUnit.INCHES,
        distanceUnit: DistanceUnit.MILES,
        advancedLoggingEnabled: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(isImperialSystem(imperialPreferences)).toBe(true);
    });

    test('should return false for mixed unit preferences', () => {
      const mixedPreferences: UserPreferences = {
        id: 'test-id',
        userId: 'test-user',
        bodyWeightUnit: BodyWeightUnit.POUNDS,
        strengthTrainingUnit: StrengthTrainingUnit.KILOGRAMS, // Metric
        bodyMeasurementUnit: BodyMeasurementUnit.INCHES,
        distanceUnit: DistanceUnit.MILES,
        advancedLoggingEnabled: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(isImperialSystem(mixedPreferences)).toBe(false);
    });

    test('should return false for metric preferences', () => {
      const metricPreferences: UserPreferences = {
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

      expect(isImperialSystem(metricPreferences)).toBe(false);
    });
  });
});

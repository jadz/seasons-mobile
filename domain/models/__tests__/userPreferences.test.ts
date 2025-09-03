import {
  UserPreferences,
  BodyWeightUnit,
  StrengthTrainingUnit,
  BodyMeasurementUnit,
  DistanceUnit,
  DEFAULT_USER_PREFERENCES,
  IUserPreferences,
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

  describe('UserPreferences.createDefault', () => {
    test('should create preferences with provided userId and defaults', () => {
      const userId = 'test-user-123';
      const preferences = UserPreferences.createDefault(userId);

      expect(preferences.userId).toBe(userId);
      expect(preferences.bodyWeightUnit).toBe(DEFAULT_USER_PREFERENCES.bodyWeightUnit);
      expect(preferences.strengthTrainingUnit).toBe(DEFAULT_USER_PREFERENCES.strengthTrainingUnit);
      expect(preferences.bodyMeasurementUnit).toBe(DEFAULT_USER_PREFERENCES.bodyMeasurementUnit);
      expect(preferences.distanceUnit).toBe(DEFAULT_USER_PREFERENCES.distanceUnit);
      expect(preferences.advancedLoggingEnabled).toBe(DEFAULT_USER_PREFERENCES.advancedLoggingEnabled);
    });

    test('should not include id, createdAt, or updatedAt fields', () => {
      const preferences = UserPreferences.createDefault('test-user');
      
      expect(preferences).not.toHaveProperty('id');
      expect(preferences).not.toHaveProperty('createdAt');
      expect(preferences).not.toHaveProperty('updatedAt');
    });
  });

  describe('UserPreferences.validate', () => {
    test('should return true for valid preferences', () => {
      const validPreferences: Partial<IUserPreferences> = {
        bodyWeightUnit: BodyWeightUnit.KILOGRAMS,
        strengthTrainingUnit: StrengthTrainingUnit.POUNDS,
        bodyMeasurementUnit: BodyMeasurementUnit.CENTIMETERS,
        distanceUnit: DistanceUnit.MILES,
      };

      expect(UserPreferences.validate(validPreferences)).toBe(true);
    });

    test('should return true for empty preferences object', () => {
      expect(UserPreferences.validate({})).toBe(true);
    });

    test('should return false for invalid bodyWeightUnit', () => {
      const invalidPreferences = {
        bodyWeightUnit: 'invalid' as BodyWeightUnit,
      };

      expect(UserPreferences.validate(invalidPreferences)).toBe(false);
    });

    test('should return false for invalid strengthTrainingUnit', () => {
      const invalidPreferences = {
        strengthTrainingUnit: 'invalid' as StrengthTrainingUnit,
      };

      expect(UserPreferences.validate(invalidPreferences)).toBe(false);
    });

    test('should return false for invalid bodyMeasurementUnit', () => {
      const invalidPreferences = {
        bodyMeasurementUnit: 'invalid' as BodyMeasurementUnit,
      };

      expect(UserPreferences.validate(invalidPreferences)).toBe(false);
    });

    test('should return false for invalid distanceUnit', () => {
      const invalidPreferences = {
        distanceUnit: 'invalid' as DistanceUnit,
      };

      expect(UserPreferences.validate(invalidPreferences)).toBe(false);
    });
  });

  describe('UserPreferences instance methods', () => {
    test('isMetricSystem should return true for full metric preferences', () => {
      const metricPreferences = UserPreferences.fromData({
        id: 'test-id',
        userId: 'test-user',
        bodyWeightUnit: 'kg',
        strengthTrainingUnit: 'kg',
        bodyMeasurementUnit: 'cm',
        distanceUnit: 'km',
        advancedLoggingEnabled: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      expect(metricPreferences.isMetricSystem()).toBe(true);
    });

    test('isMetricSystem should return false for mixed unit preferences', () => {
      const mixedPreferences = UserPreferences.fromData({
        id: 'test-id',
        userId: 'test-user',
        bodyWeightUnit: 'kg',
        strengthTrainingUnit: 'lbs', // Imperial
        bodyMeasurementUnit: 'cm',
        distanceUnit: 'km',
        advancedLoggingEnabled: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      expect(mixedPreferences.isMetricSystem()).toBe(false);
    });

    test('isMetricSystem should return false for imperial preferences', () => {
      const imperialPreferences = UserPreferences.fromData({
        id: 'test-id',
        userId: 'test-user',
        bodyWeightUnit: 'lbs',
        strengthTrainingUnit: 'lbs',
        bodyMeasurementUnit: 'in',
        distanceUnit: 'mi',
        advancedLoggingEnabled: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      expect(imperialPreferences.isMetricSystem()).toBe(false);
    });

    test('isImperialSystem should return true for full imperial preferences', () => {
      const imperialPreferences = UserPreferences.fromData({
        id: 'test-id',
        userId: 'test-user',
        bodyWeightUnit: 'lbs',
        strengthTrainingUnit: 'lbs',
        bodyMeasurementUnit: 'in',
        distanceUnit: 'mi',
        advancedLoggingEnabled: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      expect(imperialPreferences.isImperialSystem()).toBe(true);
    });

    test('isImperialSystem should return false for mixed unit preferences', () => {
      const mixedPreferences = UserPreferences.fromData({
        id: 'test-id',
        userId: 'test-user',
        bodyWeightUnit: 'lbs',
        strengthTrainingUnit: 'kg', // Metric
        bodyMeasurementUnit: 'in',
        distanceUnit: 'mi',
        advancedLoggingEnabled: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      expect(mixedPreferences.isImperialSystem()).toBe(false);
    });

    test('isImperialSystem should return false for metric preferences', () => {
      const metricPreferences = UserPreferences.fromData({
        id: 'test-id',
        userId: 'test-user',
        bodyWeightUnit: 'kg',
        strengthTrainingUnit: 'kg',
        bodyMeasurementUnit: 'cm',
        distanceUnit: 'km',
        advancedLoggingEnabled: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      expect(metricPreferences.isImperialSystem()).toBe(false);
    });
  });
});

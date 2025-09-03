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
 * Interface for user preferences data structure (for backward compatibility)
 */
export interface IUserPreferences {
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
 * Core user preferences for measurements and training features
 */
export class UserPreferencesEntity {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly bodyWeightUnit: BodyWeightUnit,
    public readonly strengthTrainingUnit: StrengthTrainingUnit,
    public readonly bodyMeasurementUnit: BodyMeasurementUnit,
    public readonly distanceUnit: DistanceUnit,
    public readonly advancedLoggingEnabled: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {
    this.validateInvariants();
  }

  /**
   * Create default user preferences for a new user
   */
  static createDefault(userId: string): {
    userId: string;
    bodyWeightUnit: BodyWeightUnit;
    strengthTrainingUnit: StrengthTrainingUnit;
    bodyMeasurementUnit: BodyMeasurementUnit;
    distanceUnit: DistanceUnit;
    advancedLoggingEnabled: boolean;
  } {
    UserPreferencesEntity.validateUserId(userId);

    return {
      userId,
      ...DEFAULT_USER_PREFERENCES,
    };
  }

  /**
   * Reconstruct from database data
   */
  static fromData(data: {
    id: string;
    userId: string;
    bodyWeightUnit: string;
    strengthTrainingUnit: string;
    bodyMeasurementUnit: string;
    distanceUnit: string;
    advancedLoggingEnabled: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): UserPreferencesEntity {
    const bodyWeightUnit = this.parseBodyWeightUnit(data.bodyWeightUnit);
    const strengthTrainingUnit = this.parseStrengthTrainingUnit(data.strengthTrainingUnit);
    const bodyMeasurementUnit = this.parseBodyMeasurementUnit(data.bodyMeasurementUnit);
    const distanceUnit = this.parseDistanceUnit(data.distanceUnit);

    return new UserPreferencesEntity(
      data.id,
      data.userId,
      bodyWeightUnit,
      strengthTrainingUnit,
      bodyMeasurementUnit,
      distanceUnit,
      data.advancedLoggingEnabled,
      data.createdAt,
      data.updatedAt
    );
  }

  /**
   * Validate that all enum values are valid
   */
  static validate(preferences: Partial<IUserPreferences>): boolean {
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
  isMetricSystem(): boolean {
    return this.bodyWeightUnit === BodyWeightUnit.KILOGRAMS &&
           this.strengthTrainingUnit === StrengthTrainingUnit.KILOGRAMS &&
           this.bodyMeasurementUnit === BodyMeasurementUnit.CENTIMETERS &&
           this.distanceUnit === DistanceUnit.KILOMETERS;
  }

  /**
   * Check if preferences use the imperial system
   */
  isImperialSystem(): boolean {
    return this.bodyWeightUnit === BodyWeightUnit.POUNDS &&
           this.strengthTrainingUnit === StrengthTrainingUnit.POUNDS &&
           this.bodyMeasurementUnit === BodyMeasurementUnit.INCHES &&
           this.distanceUnit === DistanceUnit.MILES;
  }

  /**
   * Check if preferences belong to a specific user
   */
  belongsToUser(userId: string): boolean {
    return this.userId === userId;
  }

  /**
   * Update user preferences
   */
  updatePreferences(
    updates: {
      bodyWeightUnit?: BodyWeightUnit;
      strengthTrainingUnit?: StrengthTrainingUnit;
      bodyMeasurementUnit?: BodyMeasurementUnit;
      distanceUnit?: DistanceUnit;
      advancedLoggingEnabled?: boolean;
    },
    userId?: string
  ): UserPreferencesEntity {
    if (userId && !this.belongsToUser(userId)) {
      throw new Error('Cannot update preferences: user does not own these preferences');
    }

    return new UserPreferencesEntity(
      this.id,
      this.userId,
      updates.bodyWeightUnit ?? this.bodyWeightUnit,
      updates.strengthTrainingUnit ?? this.strengthTrainingUnit,
      updates.bodyMeasurementUnit ?? this.bodyMeasurementUnit,
      updates.distanceUnit ?? this.distanceUnit,
      updates.advancedLoggingEnabled ?? this.advancedLoggingEnabled,
      this.createdAt,
      new Date()
    );
  }

  /**
   * Convert to metric system
   */
  convertToMetric(): UserPreferencesEntity {
    return new UserPreferencesEntity(
      this.id,
      this.userId,
      BodyWeightUnit.KILOGRAMS,
      StrengthTrainingUnit.KILOGRAMS,
      BodyMeasurementUnit.CENTIMETERS,
      DistanceUnit.KILOMETERS,
      this.advancedLoggingEnabled,
      this.createdAt,
      new Date()
    );
  }

  /**
   * Convert to imperial system
   */
  convertToImperial(): UserPreferencesEntity {
    return new UserPreferencesEntity(
      this.id,
      this.userId,
      BodyWeightUnit.POUNDS,
      StrengthTrainingUnit.POUNDS,
      BodyMeasurementUnit.INCHES,
      DistanceUnit.MILES,
      this.advancedLoggingEnabled,
      this.createdAt,
      new Date()
    );
  }

  private validateInvariants(): void {
    UserPreferencesEntity.validateUserId(this.userId);
  }

  private static validateUserId(userId: string): void {
    if (!userId?.trim()) {
      throw new Error('User ID cannot be empty');
    }
  }

  private static parseBodyWeightUnit(value: string): BodyWeightUnit {
    const unit = value as BodyWeightUnit;
    if (!Object.values(BodyWeightUnit).includes(unit)) {
      throw new Error(`Invalid body weight unit: ${value}`);
    }
    return unit;
  }

  private static parseStrengthTrainingUnit(value: string): StrengthTrainingUnit {
    const unit = value as StrengthTrainingUnit;
    if (!Object.values(StrengthTrainingUnit).includes(unit)) {
      throw new Error(`Invalid strength training unit: ${value}`);
    }
    return unit;
  }

  private static parseBodyMeasurementUnit(value: string): BodyMeasurementUnit {
    const unit = value as BodyMeasurementUnit;
    if (!Object.values(BodyMeasurementUnit).includes(unit)) {
      throw new Error(`Invalid body measurement unit: ${value}`);
    }
    return unit;
  }

  private static parseDistanceUnit(value: string): DistanceUnit {
    const unit = value as DistanceUnit;
    if (!Object.values(DistanceUnit).includes(unit)) {
      throw new Error(`Invalid distance unit: ${value}`);
    }
    return unit;
  }
}

// Export the class as the main entity
export { UserPreferencesEntity as UserPreferences };

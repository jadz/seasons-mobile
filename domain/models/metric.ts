/**
 * Domain model for metrics used to track progress
 * 
 * Metrics can be:
 * - Predefined: System-provided metrics available to all users
 * - User-created: Custom metrics defined by individual users  
 * - App-calculated: Metrics computed by the app based on user activity
 */

export enum MetricType {
  PREDEFINED = 'predefined',
  USER_CREATED = 'user_created',
  APP_CALCULATED = 'app_calculated'
}

export enum MetricUnitType {
  WEIGHT = 'weight',
  DISTANCE = 'distance',
  TIME = 'time',
  REPS = 'reps',
  PERCENTAGE = 'percentage',
  OTHER = 'other'
}

export enum MetricUnit {
  // Weight units
  KILOGRAMS = 'kg',
  POUNDS = 'lbs',
  
  // Distance units
  CENTIMETERS = 'cm',
  INCHES = 'inches',
  METERS = 'meters',
  KILOMETERS = 'km',
  MILES = 'miles',
  
  // Time units
  SECONDS = 'seconds',
  MINUTES = 'minutes',
  HOURS = 'hours',
  
  // Count/other units
  COUNT = 'count',
  PERCENT_VALUE = 'percent_value',
  CUSTOM_UNIT = 'custom_unit'
}

export enum MetricDataType {
  DECIMAL = 'decimal',
  INTEGER = 'integer'
}

export class Metric {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly unitType: MetricUnitType,
    public readonly defaultUnit: MetricUnit,
    public readonly alternativeUnits: MetricUnit[],
    public readonly dataType: MetricDataType,
    public readonly type: MetricType,
    public readonly userId: string | null, // null for predefined/app-calculated, user ID for user-created
    public readonly calculationMethod: string | null, // only for app-calculated metrics
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {
    this.validateInvariants();
  }

  /**
   * Create a predefined metric (system operation)
   */
  static createPredefined(
    name: string,
    description: string,
    unitType: MetricUnitType,
    defaultUnit: MetricUnit,
    alternativeUnits: MetricUnit[],
    dataType: MetricDataType
  ): {
    name: string;
    description: string;
    unitType: MetricUnitType;
    defaultUnit: MetricUnit;
    alternativeUnits: MetricUnit[];
    dataType: MetricDataType;
    type: MetricType;
    userId: null;
    calculationMethod: null;
    isActive: boolean;
  } {
    this.validateName(name);
    this.validateUnitCompatibility(unitType, defaultUnit, alternativeUnits);
    
    return {
      name,
      description,
      unitType,
      defaultUnit,
      alternativeUnits,
      dataType,
      type: MetricType.PREDEFINED,
      userId: null,
      calculationMethod: null,
      isActive: true
    };
  }

  /**
   * Create a user-defined metric
   */
  static createUserDefined(
    name: string,
    description: string,
    unitType: MetricUnitType,
    defaultUnit: MetricUnit,
    alternativeUnits: MetricUnit[],
    dataType: MetricDataType,
    userId: string
  ): {
    name: string;
    description: string;
    unitType: MetricUnitType;
    defaultUnit: MetricUnit;
    alternativeUnits: MetricUnit[];
    dataType: MetricDataType;
    type: MetricType;
    userId: string;
    calculationMethod: null;
    isActive: boolean;
  } {
    this.validateName(name);
    this.validateUserId(userId);
    this.validateUnitCompatibility(unitType, defaultUnit, alternativeUnits);
    
    return {
      name,
      description,
      unitType,
      defaultUnit,
      alternativeUnits,
      dataType,
      type: MetricType.USER_CREATED,
      userId,
      calculationMethod: null,
      isActive: true
    };
  }

  /**
   * Create an app-calculated metric (system operation)
   */
  static createAppCalculated(
    name: string,
    description: string,
    unitType: MetricUnitType,
    defaultUnit: MetricUnit,
    alternativeUnits: MetricUnit[],
    dataType: MetricDataType,
    calculationMethod: string
  ): {
    name: string;
    description: string;
    unitType: MetricUnitType;
    defaultUnit: MetricUnit;
    alternativeUnits: MetricUnit[];
    dataType: MetricDataType;
    type: MetricType;
    userId: null;
    calculationMethod: string;
    isActive: boolean;
  } {
    this.validateName(name);
    this.validateCalculationMethod(calculationMethod);
    this.validateUnitCompatibility(unitType, defaultUnit, alternativeUnits);
    
    return {
      name,
      description,
      unitType,
      defaultUnit,
      alternativeUnits,
      dataType,
      type: MetricType.APP_CALCULATED,
      userId: null,
      calculationMethod,
      isActive: true
    };
  }

  /**
   * Reconstruct from database data
   */
  static fromData(data: {
    id: string;
    name: string;
    description: string;
    unitType: string;
    defaultUnit: string;
    alternativeUnits: string[]; // JSON array from DB
    dataType: string;
    metricType: string;
    userId: string | null;
    calculationMethod: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): Metric {
    const unitType = this.parseMetricUnitType(data.unitType);
    const defaultUnit = this.parseMetricUnit(data.defaultUnit);
    const alternativeUnits = data.alternativeUnits.map(unit => this.parseMetricUnit(unit));
    const dataType = this.parseMetricDataType(data.dataType);
    const type = this.parseMetricType(data.metricType);
    
    return new Metric(
      data.id,
      data.name,
      data.description,
      unitType,
      defaultUnit,
      alternativeUnits,
      dataType,
      type,
      data.userId,
      data.calculationMethod,
      data.isActive,
      data.createdAt,
      data.updatedAt
    );
  }

  /**
   * Check if this is a predefined metric
   */
  isPredefined(): boolean {
    return this.type === MetricType.PREDEFINED && this.userId === null;
  }

  /**
   * Check if this is user-created metric
   */
  isUserCreated(): boolean {
    return this.type === MetricType.USER_CREATED && this.userId !== null;
  }

  /**
   * Check if this is app-calculated metric
   */
  isAppCalculated(): boolean {
    return this.type === MetricType.APP_CALCULATED && this.calculationMethod !== null;
  }

  /**
   * Check if this metric belongs to a specific user
   */
  belongsToUser(userId: string): boolean {
    return this.isUserCreated() && this.userId === userId;
  }

  /**
   * Check if this metric is accessible to a user
   */
  isAccessibleToUser(userId: string): boolean {
    return this.isPredefined() || this.isAppCalculated() || this.belongsToUser(userId);
  }

  /**
   * Check if a unit is valid for this metric
   */
  isValidUnit(unit: MetricUnit): boolean {
    return unit === this.defaultUnit || this.alternativeUnits.includes(unit);
  }

  /**
   * Convert a value from one unit to the metric's default unit
   */
  convertToDefaultUnit(value: number, fromUnit: MetricUnit): number {
    if (!this.isValidUnit(fromUnit)) {
      throw new Error(`Unit ${fromUnit} is not valid for metric ${this.name}`);
    }

    if (fromUnit === this.defaultUnit) {
      return value;
    }

    // Conversion logic based on unit types
    return this.performUnitConversion(value, fromUnit, this.defaultUnit);
  }

  /**
   * Update metric metadata (only for user-created metrics)
   */
  updateMetadata(
    name: string,
    description: string,
    userId: string
  ): Metric {
    if (!this.belongsToUser(userId)) {
      throw new Error('Cannot update metric: user does not own this metric');
    }

    Metric.validateName(name);

    return new Metric(
      this.id,
      name,
      description,
      this.unitType,
      this.defaultUnit,
      this.alternativeUnits,
      this.dataType,
      this.type,
      this.userId,
      this.calculationMethod,
      this.isActive,
      this.createdAt,
      new Date()
    );
  }

  /**
   * Deactivate this metric
   */
  deactivate(userId?: string): Metric {
    // For user-created metrics, verify ownership
    if (this.isUserCreated() && userId && !this.belongsToUser(userId)) {
      throw new Error('Cannot deactivate metric: user does not own this metric');
    }

    return new Metric(
      this.id,
      this.name,
      this.description,
      this.unitType,
      this.defaultUnit,
      this.alternativeUnits,
      this.dataType,
      this.type,
      this.userId,
      this.calculationMethod,
      false,
      this.createdAt,
      new Date()
    );
  }

  private validateInvariants(): void {
    Metric.validateName(this.name);
    Metric.validateUnitCompatibility(this.unitType, this.defaultUnit, this.alternativeUnits);

    // Type-specific validations
    if (this.type === MetricType.PREDEFINED && this.userId !== null) {
      throw new Error('Predefined metrics cannot have a user ID');
    }

    if (this.type === MetricType.USER_CREATED && this.userId === null) {
      throw new Error('User-created metrics must have a user ID');
    }

    if (this.type === MetricType.APP_CALCULATED && this.calculationMethod === null) {
      throw new Error('App-calculated metrics must have a calculation method');
    }

    if (this.type !== MetricType.APP_CALCULATED && this.calculationMethod !== null) {
      throw new Error('Only app-calculated metrics can have a calculation method');
    }

    if (this.userId !== null) {
      Metric.validateUserId(this.userId);
    }
  }

  private performUnitConversion(value: number, fromUnit: MetricUnit, toUnit: MetricUnit): number {
    // Weight conversions
    if (fromUnit === MetricUnit.KILOGRAMS && toUnit === MetricUnit.POUNDS) {
      return value * 2.20462;
    }
    if (fromUnit === MetricUnit.POUNDS && toUnit === MetricUnit.KILOGRAMS) {
      return value / 2.20462;
    }

    // Distance conversions
    if (fromUnit === MetricUnit.KILOMETERS && toUnit === MetricUnit.MILES) {
      return value * 0.621371;
    }
    if (fromUnit === MetricUnit.MILES && toUnit === MetricUnit.KILOMETERS) {
      return value / 0.621371;
    }
    if (fromUnit === MetricUnit.CENTIMETERS && toUnit === MetricUnit.INCHES) {
      return value * 0.393701;
    }
    if (fromUnit === MetricUnit.INCHES && toUnit === MetricUnit.CENTIMETERS) {
      return value / 0.393701;
    }

    // Time conversions
    if (fromUnit === MetricUnit.MINUTES && toUnit === MetricUnit.SECONDS) {
      return value * 60;
    }
    if (fromUnit === MetricUnit.SECONDS && toUnit === MetricUnit.MINUTES) {
      return value / 60;
    }
    if (fromUnit === MetricUnit.HOURS && toUnit === MetricUnit.MINUTES) {
      return value * 60;
    }
    if (fromUnit === MetricUnit.MINUTES && toUnit === MetricUnit.HOURS) {
      return value / 60;
    }

    // If no conversion rule found, return original value
    return value;
  }

  private static validateName(name: string): void {
    if (!name?.trim()) {
      throw new Error('Metric name cannot be empty');
    }

    if (name.length > 100) {
      throw new Error('Metric name cannot exceed 100 characters');
    }

    // Prevent names that might conflict with system operations
    const reservedNames = ['system', 'admin', 'default'];
    if (reservedNames.includes(name.toLowerCase())) {
      throw new Error(`Metric name "${name}" is reserved`);
    }
  }

  private static validateUserId(userId: string): void {
    if (!userId?.trim()) {
      throw new Error('User ID cannot be empty');
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(userId)) {
      throw new Error('User ID must be a valid UUID');
    }
  }

  private static validateCalculationMethod(calculationMethod: string): void {
    if (!calculationMethod?.trim()) {
      throw new Error('Calculation method cannot be empty for app-calculated metrics');
    }

    if (calculationMethod.length > 200) {
      throw new Error('Calculation method cannot exceed 200 characters');
    }
  }

  private static validateUnitCompatibility(
    unitType: MetricUnitType,
    defaultUnit: MetricUnit,
    alternativeUnits: MetricUnit[]
  ): void {
    // Validate that default unit matches unit type
    const compatibleUnits = this.getCompatibleUnitsForType(unitType);
    
    if (!compatibleUnits.includes(defaultUnit)) {
      throw new Error(`Default unit ${defaultUnit} is not compatible with unit type ${unitType}`);
    }

    // Validate that all alternative units are compatible
    for (const unit of alternativeUnits) {
      if (!compatibleUnits.includes(unit)) {
        throw new Error(`Alternative unit ${unit} is not compatible with unit type ${unitType}`);
      }
    }

    // Ensure default unit is not in alternatives
    if (alternativeUnits.includes(defaultUnit)) {
      throw new Error('Default unit cannot be included in alternative units');
    }
  }

  private static getCompatibleUnitsForType(unitType: MetricUnitType): MetricUnit[] {
    switch (unitType) {
      case MetricUnitType.WEIGHT:
        return [MetricUnit.KILOGRAMS, MetricUnit.POUNDS];
      case MetricUnitType.DISTANCE:
        return [MetricUnit.CENTIMETERS, MetricUnit.INCHES, MetricUnit.METERS, MetricUnit.KILOMETERS, MetricUnit.MILES];
      case MetricUnitType.TIME:
        return [MetricUnit.SECONDS, MetricUnit.MINUTES, MetricUnit.HOURS];
      case MetricUnitType.REPS:
        return [MetricUnit.COUNT];
      case MetricUnitType.PERCENTAGE:
        return [MetricUnit.PERCENT_VALUE];
      case MetricUnitType.OTHER:
        return [MetricUnit.COUNT, MetricUnit.CUSTOM_UNIT];
      default:
        throw new Error(`Unknown unit type: ${unitType}`);
    }
  }

  private static parseMetricUnitType(value: string): MetricUnitType {
    const unitType = value as MetricUnitType;
    if (!Object.values(MetricUnitType).includes(unitType)) {
      throw new Error(`Invalid metric unit type: ${value}`);
    }
    return unitType;
  }

  private static parseMetricUnit(value: string): MetricUnit {
    const unit = value as MetricUnit;
    if (!Object.values(MetricUnit).includes(unit)) {
      throw new Error(`Invalid metric unit: ${value}`);
    }
    return unit;
  }

  private static parseMetricDataType(value: string): MetricDataType {
    const dataType = value as MetricDataType;
    if (!Object.values(MetricDataType).includes(dataType)) {
      throw new Error(`Invalid metric data type: ${value}`);
    }
    return dataType;
  }

  private static parseMetricType(value: string): MetricType {
    const type = value as MetricType;
    if (!Object.values(MetricType).includes(type)) {
      throw new Error(`Invalid metric type: ${value}`);
    }
    return type;
  }
}

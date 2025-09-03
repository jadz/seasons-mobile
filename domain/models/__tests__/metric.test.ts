import { 
  Metric, 
  MetricType, 
  MetricUnitType, 
  MetricUnit, 
  MetricDataType 
} from '../metric';

describe('Metric Domain Model', () => {
  const mockUserId = '987fcdeb-51a2-43d1-b789-123456789abc';

  describe('Constructor and Validation', () => {
    it('should create a valid predefined metric instance', () => {
      const metric = new Metric(
        'test-id',
        'Body Weight',
        'Total body weight measurement',
        MetricUnitType.WEIGHT,
        MetricUnit.KILOGRAMS,
        [MetricUnit.POUNDS],
        MetricDataType.DECIMAL,
        MetricType.PREDEFINED,
        null,
        null,
        true,
        new Date('2024-01-01'),
        new Date('2024-01-01')
      );

      expect(metric.id).toBe('test-id');
      expect(metric.name).toBe('Body Weight');
      expect(metric.description).toBe('Total body weight measurement');
      expect(metric.unitType).toBe(MetricUnitType.WEIGHT);
      expect(metric.defaultUnit).toBe(MetricUnit.KILOGRAMS);
      expect(metric.alternativeUnits).toEqual([MetricUnit.POUNDS]);
      expect(metric.dataType).toBe(MetricDataType.DECIMAL);
      expect(metric.type).toBe(MetricType.PREDEFINED);
      expect(metric.userId).toBeNull();
      expect(metric.calculationMethod).toBeNull();
      expect(metric.isActive).toBe(true);
    });

    it('should create a valid user-created metric instance', () => {
      const metric = new Metric(
        'test-id',
        'Custom Metric',
        'My personal tracking metric',
        MetricUnitType.OTHER,
        MetricUnit.COUNT,
        [],
        MetricDataType.INTEGER,
        MetricType.USER_CREATED,
        mockUserId,
        null,
        true,
        new Date('2024-01-01'),
        new Date('2024-01-01')
      );

      expect(metric.type).toBe(MetricType.USER_CREATED);
      expect(metric.userId).toBe(mockUserId);
      expect(metric.calculationMethod).toBeNull();
    });

    it('should create a valid app-calculated metric instance', () => {
      const metric = new Metric(
        'test-id',
        'Bench Press 1RM',
        'Calculated one rep max for bench press',
        MetricUnitType.WEIGHT,
        MetricUnit.KILOGRAMS,
        [MetricUnit.POUNDS],
        MetricDataType.DECIMAL,
        MetricType.APP_CALCULATED,
        null,
        'bench_press_1rm_formula',
        true,
        new Date('2024-01-01'),
        new Date('2024-01-01')
      );

      expect(metric.type).toBe(MetricType.APP_CALCULATED);
      expect(metric.userId).toBeNull();
      expect(metric.calculationMethod).toBe('bench_press_1rm_formula');
    });

    it('should validate type-specific constraints for predefined metrics', () => {
      expect(() => {
        new Metric(
          'test-id',
          'Test Metric',
          'Description',
          MetricUnitType.WEIGHT,
          MetricUnit.KILOGRAMS,
          [],
          MetricDataType.DECIMAL,
          MetricType.PREDEFINED,
          mockUserId, // Should be null for predefined
          null,
          true,
          new Date(),
          new Date()
        );
      }).toThrow('Predefined metrics cannot have a user ID');
    });

    it('should validate type-specific constraints for user-created metrics', () => {
      expect(() => {
        new Metric(
          'test-id',
          'Test Metric',
          'Description',
          MetricUnitType.WEIGHT,
          MetricUnit.KILOGRAMS,
          [],
          MetricDataType.DECIMAL,
          MetricType.USER_CREATED,
          null, // Should have user ID
          null,
          true,
          new Date(),
          new Date()
        );
      }).toThrow('User-created metrics must have a user ID');
    });

    it('should validate type-specific constraints for app-calculated metrics', () => {
      expect(() => {
        new Metric(
          'test-id',
          'Test Metric',
          'Description',
          MetricUnitType.WEIGHT,
          MetricUnit.KILOGRAMS,
          [],
          MetricDataType.DECIMAL,
          MetricType.APP_CALCULATED,
          null,
          null, // Should have calculation method
          true,
          new Date(),
          new Date()
        );
      }).toThrow('App-calculated metrics must have a calculation method');
    });

    it('should validate unit compatibility', () => {
      expect(() => {
        new Metric(
          'test-id',
          'Test Metric',
          'Description',
          MetricUnitType.WEIGHT,
          MetricUnit.KILOMETERS, // Incompatible with weight type
          [],
          MetricDataType.DECIMAL,
          MetricType.PREDEFINED,
          null,
          null,
          true,
          new Date(),
          new Date()
        );
      }).toThrow('Default unit km is not compatible with unit type weight');
    });

    it('should validate alternative units compatibility', () => {
      expect(() => {
        new Metric(
          'test-id',
          'Test Metric',
          'Description',
          MetricUnitType.WEIGHT,
          MetricUnit.KILOGRAMS,
          [MetricUnit.MILES], // Incompatible alternative unit
          MetricDataType.DECIMAL,
          MetricType.PREDEFINED,
          null,
          null,
          true,
          new Date(),
          new Date()
        );
      }).toThrow('Alternative unit miles is not compatible with unit type weight');
    });

    it('should prevent default unit in alternatives', () => {
      expect(() => {
        new Metric(
          'test-id',
          'Test Metric',
          'Description',
          MetricUnitType.WEIGHT,
          MetricUnit.KILOGRAMS,
          [MetricUnit.KILOGRAMS], // Default unit in alternatives
          MetricDataType.DECIMAL,
          MetricType.PREDEFINED,
          null,
          null,
          true,
          new Date(),
          new Date()
        );
      }).toThrow('Default unit cannot be included in alternative units');
    });

    it('should validate name constraints', () => {
      expect(() => {
        new Metric(
          'test-id',
          '', // Empty name
          'Description',
          MetricUnitType.WEIGHT,
          MetricUnit.KILOGRAMS,
          [],
          MetricDataType.DECIMAL,
          MetricType.PREDEFINED,
          null,
          null,
          true,
          new Date(),
          new Date()
        );
      }).toThrow('Metric name cannot be empty');
    });

    it('should validate reserved names', () => {
      expect(() => {
        new Metric(
          'test-id',
          'system', // Reserved name
          'Description',
          MetricUnitType.WEIGHT,
          MetricUnit.KILOGRAMS,
          [],
          MetricDataType.DECIMAL,
          MetricType.PREDEFINED,
          null,
          null,
          true,
          new Date(),
          new Date()
        );
      }).toThrow('Metric name "system" is reserved');
    });
  });

  describe('Static Factory Methods', () => {
    describe('createPredefined', () => {
      it('should create predefined metric data successfully', () => {
        const metricData = Metric.createPredefined(
          'Body Fat Percentage',
          'Percentage of body weight that is fat',
          MetricUnitType.PERCENTAGE,
          MetricUnit.PERCENT_VALUE,
          [],
          MetricDataType.DECIMAL
        );

        expect(metricData.name).toBe('Body Fat Percentage');
        expect(metricData.description).toBe('Percentage of body weight that is fat');
        expect(metricData.unitType).toBe(MetricUnitType.PERCENTAGE);
        expect(metricData.defaultUnit).toBe(MetricUnit.PERCENT_VALUE);
        expect(metricData.alternativeUnits).toEqual([]);
        expect(metricData.dataType).toBe(MetricDataType.DECIMAL);
        expect(metricData.type).toBe(MetricType.PREDEFINED);
        expect(metricData.userId).toBeNull();
        expect(metricData.calculationMethod).toBeNull();
        expect(metricData.isActive).toBe(true);
      });

      it('should validate unit compatibility for predefined metrics', () => {
        expect(() => {
          Metric.createPredefined(
            'Invalid Metric',
            'Description',
            MetricUnitType.TIME,
            MetricUnit.KILOGRAMS, // Wrong unit for time type
            [],
            MetricDataType.DECIMAL
          );
        }).toThrow('Default unit kg is not compatible with unit type time');
      });
    });

    describe('createUserDefined', () => {
      it('should create user-defined metric data successfully', () => {
        const metricData = Metric.createUserDefined(
          'My Custom Metric',
          'Personal tracking metric',
          MetricUnitType.OTHER,
          MetricUnit.COUNT,
          [],
          MetricDataType.INTEGER,
          mockUserId
        );

        expect(metricData.name).toBe('My Custom Metric');
        expect(metricData.type).toBe(MetricType.USER_CREATED);
        expect(metricData.userId).toBe(mockUserId);
        expect(metricData.calculationMethod).toBeNull();
        expect(metricData.isActive).toBe(true);
      });

      it('should validate user ID for user-defined metrics', () => {
        expect(() => {
          Metric.createUserDefined(
            'Valid Name',
            'Description',
            MetricUnitType.OTHER,
            MetricUnit.COUNT,
            [],
            MetricDataType.INTEGER,
            'invalid-user-id'
          );
        }).toThrow('User ID must be a valid UUID');
      });
    });

    describe('createAppCalculated', () => {
      it('should create app-calculated metric data successfully', () => {
        const metricData = Metric.createAppCalculated(
          'Progressive Overload Score',
          'Calculated progression score',
          MetricUnitType.OTHER,
          MetricUnit.COUNT,
          [],
          MetricDataType.INTEGER,
          'progressive_overload_calculation'
        );

        expect(metricData.name).toBe('Progressive Overload Score');
        expect(metricData.type).toBe(MetricType.APP_CALCULATED);
        expect(metricData.userId).toBeNull();
        expect(metricData.calculationMethod).toBe('progressive_overload_calculation');
        expect(metricData.isActive).toBe(true);
      });

      it('should validate calculation method', () => {
        expect(() => {
          Metric.createAppCalculated(
            'Valid Name',
            'Description',
            MetricUnitType.OTHER,
            MetricUnit.COUNT,
            [],
            MetricDataType.INTEGER,
            '' // Empty calculation method
          );
        }).toThrow('Calculation method cannot be empty for app-calculated metrics');
      });
    });

    describe('fromData', () => {
      it('should reconstruct predefined metric from database data', () => {
        const dbData = {
          id: 'test-id',
          name: 'Steps Per Day',
          description: 'Daily step count',
          unitType: 'other',
          defaultUnit: 'count',
          alternativeUnits: [],
          dataType: 'integer',
          metricType: 'predefined',
          userId: null,
          calculationMethod: null,
          isActive: true,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-02')
        };

        const metric = Metric.fromData(dbData);

        expect(metric.id).toBe('test-id');
        expect(metric.name).toBe('Steps Per Day');
        expect(metric.unitType).toBe(MetricUnitType.OTHER);
        expect(metric.defaultUnit).toBe(MetricUnit.COUNT);
        expect(metric.dataType).toBe(MetricDataType.INTEGER);
        expect(metric.type).toBe(MetricType.PREDEFINED);
        expect(metric.createdAt).toEqual(dbData.createdAt);
        expect(metric.updatedAt).toEqual(dbData.updatedAt);
      });

      it('should handle alternative units array from database', () => {
        const dbData = {
          id: 'test-id',
          name: 'Distance',
          description: 'Running distance',
          unitType: 'distance',
          defaultUnit: 'km',
          alternativeUnits: ['miles', 'meters'],
          dataType: 'decimal',
          metricType: 'predefined',
          userId: null,
          calculationMethod: null,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const metric = Metric.fromData(dbData);

        expect(metric.alternativeUnits).toEqual([MetricUnit.MILES, MetricUnit.METERS]);
      });

      it('should throw error for invalid unit type from database', () => {
        const dbData = {
          id: 'test-id',
          name: 'Invalid Metric',
          description: 'Description',
          unitType: 'invalid_unit_type',
          defaultUnit: 'count',
          alternativeUnits: [],
          dataType: 'integer',
          metricType: 'predefined',
          userId: null,
          calculationMethod: null,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        expect(() => {
          Metric.fromData(dbData);
        }).toThrow('Invalid metric unit type: invalid_unit_type');
      });
    });
  });

  describe('Business Logic Methods', () => {
    let predefinedMetric: Metric;
    let userCreatedMetric: Metric;
    let appCalculatedMetric: Metric;

    beforeEach(() => {
      predefinedMetric = new Metric(
        'predefined-id',
        'Body Weight',
        'Total body weight',
        MetricUnitType.WEIGHT,
        MetricUnit.KILOGRAMS,
        [MetricUnit.POUNDS],
        MetricDataType.DECIMAL,
        MetricType.PREDEFINED,
        null,
        null,
        true,
        new Date('2024-01-01'),
        new Date('2024-01-01')
      );

      userCreatedMetric = new Metric(
        'user-created-id',
        'Custom Metric',
        'User defined metric',
        MetricUnitType.OTHER,
        MetricUnit.COUNT,
        [],
        MetricDataType.INTEGER,
        MetricType.USER_CREATED,
        mockUserId,
        null,
        true,
        new Date('2024-01-01'),
        new Date('2024-01-01')
      );

      appCalculatedMetric = new Metric(
        'app-calculated-id',
        'Strength Score',
        'Calculated strength progression',
        MetricUnitType.OTHER,
        MetricUnit.COUNT,
        [],
        MetricDataType.INTEGER,
        MetricType.APP_CALCULATED,
        null,
        'strength_calculation',
        true,
        new Date('2024-01-01'),
        new Date('2024-01-01')
      );
    });

    describe('Type Checking Methods', () => {
      it('should correctly identify metric types', () => {
        expect(predefinedMetric.isPredefined()).toBe(true);
        expect(predefinedMetric.isUserCreated()).toBe(false);
        expect(predefinedMetric.isAppCalculated()).toBe(false);

        expect(userCreatedMetric.isPredefined()).toBe(false);
        expect(userCreatedMetric.isUserCreated()).toBe(true);
        expect(userCreatedMetric.isAppCalculated()).toBe(false);

        expect(appCalculatedMetric.isPredefined()).toBe(false);
        expect(appCalculatedMetric.isUserCreated()).toBe(false);
        expect(appCalculatedMetric.isAppCalculated()).toBe(true);
      });
    });

    describe('Ownership and Access Methods', () => {
      it('should correctly identify metric ownership', () => {
        expect(predefinedMetric.belongsToUser(mockUserId)).toBe(false);
        expect(userCreatedMetric.belongsToUser(mockUserId)).toBe(true);
        expect(userCreatedMetric.belongsToUser('different-user-id')).toBe(false);
        expect(appCalculatedMetric.belongsToUser(mockUserId)).toBe(false);
      });

      it('should correctly determine user access', () => {
        expect(predefinedMetric.isAccessibleToUser(mockUserId)).toBe(true);
        expect(predefinedMetric.isAccessibleToUser('any-user-id')).toBe(true);
        
        expect(userCreatedMetric.isAccessibleToUser(mockUserId)).toBe(true);
        expect(userCreatedMetric.isAccessibleToUser('different-user-id')).toBe(false);
        
        expect(appCalculatedMetric.isAccessibleToUser(mockUserId)).toBe(true);
        expect(appCalculatedMetric.isAccessibleToUser('any-user-id')).toBe(true);
      });
    });

    describe('Unit Validation and Conversion', () => {
      it('should validate units correctly', () => {
        expect(predefinedMetric.isValidUnit(MetricUnit.KILOGRAMS)).toBe(true);
        expect(predefinedMetric.isValidUnit(MetricUnit.POUNDS)).toBe(true);
        expect(predefinedMetric.isValidUnit(MetricUnit.KILOMETERS)).toBe(false);
      });

      it('should convert weight units correctly', () => {
        // kg to lbs
        const kgToLbs = predefinedMetric.convertToDefaultUnit(10, MetricUnit.POUNDS);
        expect(kgToLbs).toBeCloseTo(4.536, 2); // 10 lbs ≈ 4.536 kg

        // Default unit should return same value
        const sameUnit = predefinedMetric.convertToDefaultUnit(10, MetricUnit.KILOGRAMS);
        expect(sameUnit).toBe(10);
      });

      it('should convert distance units correctly', () => {
        const distanceMetric = new Metric(
          'distance-id',
          'Running Distance',
          'Distance covered',
          MetricUnitType.DISTANCE,
          MetricUnit.KILOMETERS,
          [MetricUnit.MILES],
          MetricDataType.DECIMAL,
          MetricType.PREDEFINED,
          null,
          null,
          true,
          new Date(),
          new Date()
        );

        // miles to km
        const milesToKm = distanceMetric.convertToDefaultUnit(1, MetricUnit.MILES);
        expect(milesToKm).toBeCloseTo(1.609, 2); // 1 mile ≈ 1.609 km
      });

      it('should convert time units correctly', () => {
        const timeMetric = new Metric(
          'time-id',
          'Workout Duration',
          'Time spent exercising',
          MetricUnitType.TIME,
          MetricUnit.MINUTES,
          [MetricUnit.SECONDS, MetricUnit.HOURS],
          MetricDataType.INTEGER,
          MetricType.PREDEFINED,
          null,
          null,
          true,
          new Date(),
          new Date()
        );

        // seconds to minutes
        const secondsToMinutes = timeMetric.convertToDefaultUnit(120, MetricUnit.SECONDS);
        expect(secondsToMinutes).toBe(2);

        // hours to minutes
        const hoursToMinutes = timeMetric.convertToDefaultUnit(1.5, MetricUnit.HOURS);
        expect(hoursToMinutes).toBe(90);
      });

      it('should throw error for invalid unit conversion', () => {
        expect(() => {
          predefinedMetric.convertToDefaultUnit(10, MetricUnit.KILOMETERS);
        }).toThrow('Unit km is not valid for metric Body Weight');
      });
    });

    describe('updateMetadata', () => {
      it('should update user-created metric metadata successfully', () => {
        const updatedMetric = userCreatedMetric.updateMetadata(
          'Updated Custom Metric',
          'Updated description',
          mockUserId
        );

        expect(updatedMetric.name).toBe('Updated Custom Metric');
        expect(updatedMetric.description).toBe('Updated description');
        expect(updatedMetric.id).toBe(userCreatedMetric.id);
        expect(updatedMetric.unitType).toBe(userCreatedMetric.unitType);
        expect(updatedMetric.type).toBe(userCreatedMetric.type);
        expect(updatedMetric.userId).toBe(userCreatedMetric.userId);
        expect(updatedMetric.createdAt).toBe(userCreatedMetric.createdAt);
        expect(updatedMetric.updatedAt).not.toBe(userCreatedMetric.updatedAt);
      });

      it('should prevent non-owners from updating user-created metrics', () => {
        expect(() => {
          userCreatedMetric.updateMetadata(
            'Hacked Name',
            'Malicious description',
            'different-user-id'
          );
        }).toThrow('Cannot update metric: user does not own this metric');
      });

      it('should validate name during update', () => {
        expect(() => {
          userCreatedMetric.updateMetadata(
            '', // Empty name
            'Valid description',
            mockUserId
          );
        }).toThrow('Metric name cannot be empty');
      });

      it('should return new instance (immutability)', () => {
        const updatedMetric = userCreatedMetric.updateMetadata(
          'New Name',
          'New Description',
          mockUserId
        );

        expect(updatedMetric).not.toBe(userCreatedMetric);
        expect(userCreatedMetric.name).toBe('Custom Metric'); // Original unchanged
      });
    });

    describe('deactivate', () => {
      it('should deactivate user-created metric with ownership verification', () => {
        const deactivatedMetric = userCreatedMetric.deactivate(mockUserId);

        expect(deactivatedMetric.isActive).toBe(false);
        expect(deactivatedMetric.id).toBe(userCreatedMetric.id);
        expect(deactivatedMetric.name).toBe(userCreatedMetric.name);
        expect(deactivatedMetric.updatedAt).not.toBe(userCreatedMetric.updatedAt);
      });

      it('should prevent non-owners from deactivating user-created metrics', () => {
        expect(() => {
          userCreatedMetric.deactivate('different-user-id');
        }).toThrow('Cannot deactivate metric: user does not own this metric');
      });

      it('should deactivate predefined metric without user check', () => {
        const deactivatedMetric = predefinedMetric.deactivate();

        expect(deactivatedMetric.isActive).toBe(false);
        expect(deactivatedMetric.type).toBe(MetricType.PREDEFINED);
      });

      it('should return new instance (immutability)', () => {
        const deactivatedMetric = predefinedMetric.deactivate();

        expect(deactivatedMetric).not.toBe(predefinedMetric);
        expect(predefinedMetric.isActive).toBe(true); // Original unchanged
      });
    });
  });

  describe('Unit Compatibility Validation', () => {
    it('should validate weight unit compatibility', () => {
      const validWeightUnits = [MetricUnit.KILOGRAMS, MetricUnit.POUNDS];
      validWeightUnits.forEach(unit => {
        expect(() => {
          Metric.createPredefined(
            'Weight Metric',
            'Description',
            MetricUnitType.WEIGHT,
            unit,
            [],
            MetricDataType.DECIMAL
          );
        }).not.toThrow();
      });
    });

    it('should validate distance unit compatibility', () => {
      const validDistanceUnits = [
        MetricUnit.CENTIMETERS,
        MetricUnit.INCHES,
        MetricUnit.METERS,
        MetricUnit.KILOMETERS,
        MetricUnit.MILES
      ];
      validDistanceUnits.forEach(unit => {
        expect(() => {
          Metric.createPredefined(
            'Distance Metric',
            'Description',
            MetricUnitType.DISTANCE,
            unit,
            [],
            MetricDataType.DECIMAL
          );
        }).not.toThrow();
      });
    });

    it('should validate time unit compatibility', () => {
      const validTimeUnits = [MetricUnit.SECONDS, MetricUnit.MINUTES, MetricUnit.HOURS];
      validTimeUnits.forEach(unit => {
        expect(() => {
          Metric.createPredefined(
            'Time Metric',
            'Description',
            MetricUnitType.TIME,
            unit,
            [],
            MetricDataType.DECIMAL
          );
        }).not.toThrow();
      });
    });

    it('should validate percentage unit compatibility', () => {
      expect(() => {
        Metric.createPredefined(
          'Percentage Metric',
          'Description',
          MetricUnitType.PERCENTAGE,
          MetricUnit.PERCENT_VALUE,
          [],
          MetricDataType.DECIMAL
        );
      }).not.toThrow();
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle whitespace-only names', () => {
      expect(() => {
        Metric.createPredefined(
          '   ', // Whitespace only
          'Description',
          MetricUnitType.OTHER,
          MetricUnit.COUNT,
          [],
          MetricDataType.INTEGER
        );
      }).toThrow('Metric name cannot be empty');
    });

    it('should validate all reserved names case-insensitively', () => {
      const reservedNames = ['SYSTEM', 'Admin', 'DEFAULT'];
      
      reservedNames.forEach(name => {
        expect(() => {
          Metric.createUserDefined(
            name,
            'Description',
            MetricUnitType.OTHER,
            MetricUnit.COUNT,
            [],
            MetricDataType.INTEGER,
            mockUserId
          );
        }).toThrow(`Metric name "${name}" is reserved`);
      });
    });

    it('should handle name length validation', () => {
      const longName = 'a'.repeat(101); // 101 characters
      expect(() => {
        Metric.createPredefined(
          longName,
          'Description',
          MetricUnitType.OTHER,
          MetricUnit.COUNT,
          [],
          MetricDataType.INTEGER
        );
      }).toThrow('Metric name cannot exceed 100 characters');
    });

    it('should handle calculation method length validation', () => {
      const longMethod = 'a'.repeat(201); // 201 characters
      expect(() => {
        Metric.createAppCalculated(
          'Valid Name',
          'Description',
          MetricUnitType.OTHER,
          MetricUnit.COUNT,
          [],
          MetricDataType.INTEGER,
          longMethod
        );
      }).toThrow('Calculation method cannot exceed 200 characters');
    });

    it('should preserve all properties during state changes', () => {
      const originalDate = new Date('2024-01-01');
      const metric = new Metric(
        'test-id',
        'Test Metric',
        'Test Description',
        MetricUnitType.WEIGHT,
        MetricUnit.KILOGRAMS,
        [MetricUnit.POUNDS],
        MetricDataType.DECIMAL,
        MetricType.USER_CREATED,
        mockUserId,
        null,
        true,
        originalDate,
        originalDate
      );

      const deactivated = metric.deactivate(mockUserId);
      const updated = metric.updateMetadata('New Name', 'New Description', mockUserId);

      // Check that unrelated properties are preserved
      expect(deactivated.name).toBe('Test Metric');
      expect(deactivated.unitType).toBe(MetricUnitType.WEIGHT);
      expect(updated.isActive).toBe(true);
      expect(updated.defaultUnit).toBe(MetricUnit.KILOGRAMS);
    });

    it('should handle unit conversion edge cases', () => {
      // Create a weight metric for zero value testing
      const weightMetric = new Metric(
        'weight-id',
        'Body Weight',
        'Total body weight',
        MetricUnitType.WEIGHT,
        MetricUnit.KILOGRAMS,
        [MetricUnit.POUNDS],
        MetricDataType.DECIMAL,
        MetricType.PREDEFINED,
        null,
        null,
        true,
        new Date(),
        new Date()
      );

      // Test with zero values
      const zeroConversion = weightMetric.convertToDefaultUnit(0, MetricUnit.POUNDS);
      expect(zeroConversion).toBe(0);

      // Test when no conversion rule exists (should return original value)
      const timeMetric = new Metric(
        'time-id',
        'Duration',
        'Time duration',
        MetricUnitType.TIME,
        MetricUnit.MINUTES,
        [MetricUnit.SECONDS],
        MetricDataType.INTEGER,
        MetricType.PREDEFINED,
        null,
        null,
        true,
        new Date(),
        new Date()
      );

      // This should just return the original value since there's no specific conversion
      const noConversion = timeMetric.convertToDefaultUnit(60, MetricUnit.MINUTES);
      expect(noConversion).toBe(60);
    });
  });
});

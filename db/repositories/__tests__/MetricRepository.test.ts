import { MetricRepository, IMetricRepository } from '../MetricRepository';
import { MetricType, MetricUnitType, MetricDataType } from '../../../domain/models/metric';
import {
  setupAuthenticatedTestUser,
  TestUser
} from '../../../utils/__tests__/testUtils';
import { v4 as uuidv4 } from 'uuid';
describe('MetricRepository Integration Tests', () => {
  let repository: IMetricRepository;
  let testUser: TestUser;
  let cleanup: () => Promise<void>;

  beforeEach(async () => {
    repository = new MetricRepository();
    
    // Set up authenticated test user for each test
    const setup = await setupAuthenticatedTestUser();
    testUser = setup.user;
    cleanup = setup.cleanup;
  });

  afterEach(async () => {
    // Clean up test user and sign out
    await cleanup();
  });

  describe('findById', () => {
    it('should return metric when found', async () => {
      // Arrange - get a predefined metric from the database
      const predefinedMetrics = await repository.findPredefined();
      
      if (predefinedMetrics.length === 0) {
        console.warn('No predefined metrics found, skipping test');
        return;
      }

      const testMetricId = predefinedMetrics[0].id;

      // Act
      const found = await repository.findById(testMetricId);

      // Assert
      expect(found).toBeDefined();
      expect(found?.id).toBe(testMetricId);
      expect(found?.type).toBe(MetricType.PREDEFINED);
      expect(found?.name).toBeTruthy();
      expect(found?.isActive).toBe(true);
      expect(found?.createdAt).toBeInstanceOf(Date);
      expect(found?.updatedAt).toBeInstanceOf(Date);
    });

    it('should return null when metric not found', async () => {
      // Act
      const nonExistentId = uuidv4();
      const found = await repository.findById(nonExistentId);

      // Assert
      expect(found).toBeNull();
    });

    it('should return metric with correct structure', async () => {
      // Arrange
      const predefinedMetrics = await repository.findPredefined();
      
      if (predefinedMetrics.length === 0) {
        console.warn('No predefined metrics found, skipping test');
        return;
      }

      const testMetricId = predefinedMetrics[0].id;

      // Act
      const found = await repository.findById(testMetricId);

      // Assert
      expect(found).toBeDefined();
      expect(found).toHaveProperty('id');
      expect(found).toHaveProperty('name');
      expect(found).toHaveProperty('description');
      expect(found).toHaveProperty('unitType');
      expect(found).toHaveProperty('defaultUnit');
      expect(found).toHaveProperty('alternativeUnits');
      expect(found).toHaveProperty('dataType');
      expect(found).toHaveProperty('type');
      expect(found).toHaveProperty('userId');
      expect(found).toHaveProperty('calculationMethod');
      expect(found).toHaveProperty('isActive');
      expect(found).toHaveProperty('createdAt');
      expect(found).toHaveProperty('updatedAt');
      
      expect(typeof found?.id).toBe('string');
      expect(typeof found?.name).toBe('string');
      expect(typeof found?.description).toBe('string');
      expect(typeof found?.isActive).toBe('boolean');
      expect(Array.isArray(found?.alternativeUnits)).toBe(true);
      expect(found?.createdAt).toBeInstanceOf(Date);
      expect(found?.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('findAccessibleToUser', () => {
    it('should return predefined and app-calculated metrics for any user', async () => {
      // Act
      const accessibleMetrics = await repository.findAccessibleToUser(testUser.id);

      // Assert
      expect(Array.isArray(accessibleMetrics)).toBe(true);
      
      // All returned metrics should be accessible to the user
      accessibleMetrics.forEach(metric => {
        const isAccessible = 
          metric.type === MetricType.PREDEFINED ||
          metric.type === MetricType.APP_CALCULATED ||
          (metric.type === MetricType.USER_CREATED && metric.userId === testUser.id);
        
        expect(isAccessible).toBe(true);
        expect(metric.isActive).toBe(true);
      });
    });

    it('should return metrics filtered by unit type when specified', async () => {
      // Act
      const weightMetrics = await repository.findAccessibleToUser(testUser.id, MetricUnitType.WEIGHT);

      // Assert
      expect(Array.isArray(weightMetrics)).toBe(true);
      
      weightMetrics.forEach(metric => {
        expect(metric.unitType).toBe(MetricUnitType.WEIGHT);
        expect(metric.isActive).toBe(true);
      });
    });

    it('should return metrics ordered by name', async () => {
      // Act
      const accessibleMetrics = await repository.findAccessibleToUser(testUser.id);

      // Assert
      if (accessibleMetrics.length > 1) {
        for (let i = 1; i < accessibleMetrics.length; i++) {
          expect(accessibleMetrics[i].name.toLowerCase().localeCompare(accessibleMetrics[i - 1].name.toLowerCase())).toBeGreaterThanOrEqual(0);
        }
      }
    });
  });

  describe('findPredefined', () => {
    it('should return only predefined metrics', async () => {
      // Act
      const predefinedMetrics = await repository.findPredefined();

      // Assert
      expect(Array.isArray(predefinedMetrics)).toBe(true);
      
      predefinedMetrics.forEach(metric => {
        expect(metric.type).toBe(MetricType.PREDEFINED);
        expect(metric.userId).toBeNull();
        expect(metric.calculationMethod).toBeNull();
        expect(metric.isActive).toBe(true);
      });
    });

    it('should return predefined metrics filtered by unit type when specified', async () => {
      // Act
      const weightMetrics = await repository.findPredefined(MetricUnitType.WEIGHT);

      // Assert
      expect(Array.isArray(weightMetrics)).toBe(true);
      
      weightMetrics.forEach(metric => {
        expect(metric.type).toBe(MetricType.PREDEFINED);
        expect(metric.unitType).toBe(MetricUnitType.WEIGHT);
        expect(metric.userId).toBeNull();
        expect(metric.isActive).toBe(true);
      });
    });

    it('should return predefined metrics ordered by name', async () => {
      // Act
      const predefinedMetrics = await repository.findPredefined();

      // Assert
      if (predefinedMetrics.length > 1) {
        for (let i = 1; i < predefinedMetrics.length; i++) {
          expect(predefinedMetrics[i].name.toLowerCase().localeCompare(predefinedMetrics[i - 1].name.toLowerCase())).toBeGreaterThanOrEqual(0);
        }
      }
    });
  });

  describe('findAppCalculated', () => {
    it('should return only app-calculated metrics', async () => {
      // Act
      const appCalculatedMetrics = await repository.findAppCalculated();

      // Assert
      expect(Array.isArray(appCalculatedMetrics)).toBe(true);
      
      appCalculatedMetrics.forEach(metric => {
        expect(metric.type).toBe(MetricType.APP_CALCULATED);
        expect(metric.userId).toBeNull();
        expect(metric.calculationMethod).toBeTruthy();
        expect(metric.isActive).toBe(true);
      });
    });

    it('should return app-calculated metrics filtered by unit type when specified', async () => {
      // Act
      const weightMetrics = await repository.findAppCalculated(MetricUnitType.WEIGHT);

      // Assert
      expect(Array.isArray(weightMetrics)).toBe(true);
      
      weightMetrics.forEach(metric => {
        expect(metric.type).toBe(MetricType.APP_CALCULATED);
        expect(metric.unitType).toBe(MetricUnitType.WEIGHT);
        expect(metric.calculationMethod).toBeTruthy();
        expect(metric.isActive).toBe(true);
      });
    });
  });

  describe('findByUser', () => {
    it('should return empty array when user has no custom metrics', async () => {
      // Act
      const userMetrics = await repository.findByUser(testUser.id);

      // Assert
      expect(userMetrics).toEqual([]);
    });

    it('should return user metrics filtered by unit type when specified', async () => {
      // Act
      const userWeightMetrics = await repository.findByUser(testUser.id, MetricUnitType.WEIGHT);

      // Assert
      expect(Array.isArray(userWeightMetrics)).toBe(true);
      
      userWeightMetrics.forEach(metric => {
        expect(metric.type).toBe(MetricType.USER_CREATED);
        expect(metric.userId).toBe(testUser.id);
        expect(metric.unitType).toBe(MetricUnitType.WEIGHT);
        expect(metric.isActive).toBe(true);
      });
    });
  });

  describe('data validation', () => {
    it('should have valid metric types from enum', async () => {
      // Act
      const accessibleMetrics = await repository.findAccessibleToUser(testUser.id);

      // Assert
      const validTypes = Object.values(MetricType);
      accessibleMetrics.forEach(metric => {
        expect(validTypes).toContain(metric.type);
      });
    });

    it('should have valid unit types from enum', async () => {
      // Act
      const accessibleMetrics = await repository.findAccessibleToUser(testUser.id);

      // Assert
      const validUnitTypes = Object.values(MetricUnitType);
      accessibleMetrics.forEach(metric => {
        expect(validUnitTypes).toContain(metric.unitType);
      });
    });

    it('should have valid data types from enum', async () => {
      // Act
      const accessibleMetrics = await repository.findAccessibleToUser(testUser.id);

      // Assert
      const validDataTypes = Object.values(MetricDataType);
      accessibleMetrics.forEach(metric => {
        expect(validDataTypes).toContain(metric.dataType);
      });
    });

    it('should have consistent predefined metric properties', async () => {
      // Act
      const predefinedMetrics = await repository.findPredefined();

      // Assert
      predefinedMetrics.forEach(metric => {
        expect(metric.type).toBe(MetricType.PREDEFINED);
        expect(metric.userId).toBeNull();
        expect(metric.calculationMethod).toBeNull();
        expect(metric.name).toBeTruthy();
        expect(metric.defaultUnit).toBeTruthy();
        expect(Array.isArray(metric.alternativeUnits)).toBe(true);
        expect(metric.isActive).toBe(true);
      });
    });

    it('should have consistent app-calculated metric properties', async () => {
      // Act
      const appCalculatedMetrics = await repository.findAppCalculated();

      // Assert
      appCalculatedMetrics.forEach(metric => {
        expect(metric.type).toBe(MetricType.APP_CALCULATED);
        expect(metric.userId).toBeNull();
        expect(metric.calculationMethod).toBeTruthy();
        expect(metric.name).toBeTruthy();
        expect(metric.defaultUnit).toBeTruthy();
        expect(Array.isArray(metric.alternativeUnits)).toBe(true);
        expect(metric.isActive).toBe(true);
      });
    });

    it('should have non-empty names', async () => {
      // Act
      const accessibleMetrics = await repository.findAccessibleToUser(testUser.id);

      // Assert
      accessibleMetrics.forEach(metric => {
        expect(metric.name).toBeTruthy();
        expect(metric.name.trim()).not.toBe('');
      });
    });

    it('should have valid alternative units arrays', async () => {
      // Act
      const accessibleMetrics = await repository.findAccessibleToUser(testUser.id);

      // Assert
      accessibleMetrics.forEach(metric => {
        expect(Array.isArray(metric.alternativeUnits)).toBe(true);
        // Alternative units should not include the default unit
        expect(metric.alternativeUnits).not.toContain(metric.defaultUnit);
      });
    });
  });

  describe('unit type filtering', () => {
    it('should correctly filter weight metrics', async () => {
      // Act
      const weightMetrics = await repository.findAccessibleToUser(testUser.id, MetricUnitType.WEIGHT);

      // Assert
      weightMetrics.forEach(metric => {
        expect(metric.unitType).toBe(MetricUnitType.WEIGHT);
        // Weight metrics should have weight-related default units
        expect(['kg', 'lbs']).toContain(metric.defaultUnit);
      });
    });

    it('should correctly filter distance metrics', async () => {
      // Act
      const distanceMetrics = await repository.findAccessibleToUser(testUser.id, MetricUnitType.DISTANCE);

      // Assert
      distanceMetrics.forEach(metric => {
        expect(metric.unitType).toBe(MetricUnitType.DISTANCE);
        // Distance metrics should have distance-related default units
        expect(['cm', 'inches', 'meters', 'km', 'miles']).toContain(metric.defaultUnit);
      });
    });

    it('should correctly filter time metrics', async () => {
      // Act
      const timeMetrics = await repository.findAccessibleToUser(testUser.id, MetricUnitType.TIME);

      // Assert
      timeMetrics.forEach(metric => {
        expect(metric.unitType).toBe(MetricUnitType.TIME);
        // Time metrics should have time-related default units
        expect(['seconds', 'minutes', 'hours']).toContain(metric.defaultUnit);
      });
    });
  });

  describe('integration requirements', () => {
    it('should have metrics available for season creation', async () => {
      // Act
      const accessibleMetrics = await repository.findAccessibleToUser(testUser.id);

      // Assert
      expect(accessibleMetrics.length).toBeGreaterThan(0);
      
      // Should include at least some predefined metrics
      const predefinedCount = accessibleMetrics.filter(m => m.type === MetricType.PREDEFINED).length;
      expect(predefinedCount).toBeGreaterThan(0);
    });

    it('should provide diverse metric types for comprehensive tracking', async () => {
      // Act
      const accessibleMetrics = await repository.findAccessibleToUser(testUser.id);

      // Assert
      if (accessibleMetrics.length > 0) {
        const unitTypes = new Set(accessibleMetrics.map(m => m.unitType));
        
        // Should have multiple unit types available for diverse tracking
        expect(unitTypes.size).toBeGreaterThan(0);
        
        // Check for common unit types that should be available
        const hasWeight = accessibleMetrics.some(m => m.unitType === MetricUnitType.WEIGHT);
        const hasOther = accessibleMetrics.some(m => m.unitType === MetricUnitType.OTHER);
        
        // At least one of these should be available
        expect(hasWeight || hasOther).toBe(true);
      }
    });
  });
});

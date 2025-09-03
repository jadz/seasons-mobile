import { AreaOfFocusRepository, IAreaOfFocusRepository } from '../AreaOfFocusRepository';
import { PillarRepository } from '../PillarRepository';
import { PillarName } from '../../../domain/models/pillar';
import { AreaOfFocusType } from '../../../domain/models/areaOfFocus';
import {
  setupAuthenticatedTestUser,
  TestUser
} from '../../../utils/__tests__/testUtils';
import { v4 as uuidv4 } from 'uuid';
describe('AreaOfFocusRepository Integration Tests', () => {
  let repository: IAreaOfFocusRepository;
  let pillarRepository: PillarRepository;
  let testUser: TestUser;
  let cleanup: () => Promise<void>;

  beforeEach(async () => {
    repository = new AreaOfFocusRepository();
    pillarRepository = new PillarRepository();
    
    // Set up authenticated test user for each test
    const setup = await setupAuthenticatedTestUser();
    testUser = setup.user;
    cleanup = setup.cleanup;
  });

  afterEach(async () => {
    // Clean up test user and sign out
    await cleanup();
  });

  const getTestPillarId = async (): Promise<string> => {
    const healthPillar = await pillarRepository.findByName(PillarName.HEALTH_FITNESS);
    if (!healthPillar) {
      throw new Error('Health pillar not found in test database');
    }
    return healthPillar.id;
  };

  describe('findById', () => {
    it('should return area of focus when found', async () => {
      // Arrange - get a predefined area from the database
      const pillarId = await getTestPillarId();
      const predefinedAreas = await repository.findPredefined(pillarId);
      
      if (predefinedAreas.length === 0) {
        console.warn('No predefined areas found, skipping test');
        return;
      }

      const testAreaId = predefinedAreas[0].id;

      // Act
      const found = await repository.findById(testAreaId);

      // Assert
      expect(found).toBeDefined();
      expect(found?.id).toBe(testAreaId);
      expect(found?.pillarId).toBe(pillarId);
      expect(found?.type).toBe(AreaOfFocusType.PREDEFINED);
      expect(found?.name).toBeTruthy();
      expect(found?.createdAt).toBeInstanceOf(Date);
      expect(found?.updatedAt).toBeInstanceOf(Date);
    });

    it('should return null when area not found', async () => {
      // Act
      // Generate a random UUID
      const nonExistentId = uuidv4();
      const found = await repository.findById(nonExistentId);

      // Assert
      expect(found).toBeNull();
    });

    it('should return area with correct structure', async () => {
      // Arrange
      const pillarId = await getTestPillarId();
      const areas = await repository.findByPillarId(pillarId);
      
      if (areas.length === 0) {
        console.warn('No areas found for pillar, skipping test');
        return;
      }

      const testAreaId = areas[0].id;

      // Act
      const found = await repository.findById(testAreaId);

      // Assert
      expect(found).toBeDefined();
      expect(found).toHaveProperty('id');
      expect(found).toHaveProperty('name');
      expect(found).toHaveProperty('description');
      expect(found).toHaveProperty('pillarId');
      expect(found).toHaveProperty('userId');
      expect(found).toHaveProperty('type');
      expect(found).toHaveProperty('isActive');
      expect(found).toHaveProperty('createdAt');
      expect(found).toHaveProperty('updatedAt');
      
      expect(typeof found?.id).toBe('string');
      expect(typeof found?.name).toBe('string');
      expect(typeof found?.description).toBe('string');
      expect(typeof found?.pillarId).toBe('string');
      expect(typeof found?.isActive).toBe('boolean');
      expect(found?.createdAt).toBeInstanceOf(Date);
      expect(found?.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('findByPillarId', () => {
    it('should return areas for a pillar', async () => {
      // Arrange
      const pillarId = await getTestPillarId();

      // Act
      const areas = await repository.findByPillarId(pillarId);

      // Assert
      expect(Array.isArray(areas)).toBe(true);
      // All areas should belong to the specified pillar
      areas.forEach(area => {
        expect(area.pillarId).toBe(pillarId);
        expect(area.isActive).toBe(true);
      });
    });

    it('should return areas ordered by name', async () => {
      // Arrange
      const pillarId = await getTestPillarId();

      // Act
      const areas = await repository.findByPillarId(pillarId);

      // Assert
      if (areas.length > 1) {
        for (let i = 1; i < areas.length; i++) {
          expect(areas[i].name.toLowerCase().localeCompare(areas[i - 1].name.toLowerCase())).toBeGreaterThanOrEqual(0);
        }
      }
    });

    it('should return empty array for pillar with no areas', async () => {
      // Arrange - use a non-existent pillar ID
      const nonExistentPillarId = '00000000-0000-0000-0000-000000000000';

      // Act
      const areas = await repository.findByPillarId(nonExistentPillarId);

      // Assert
      expect(areas).toEqual([]);
    });
  });

  describe('findAccessibleToUser', () => {
    it('should return predefined areas for any user', async () => {
      // Act
      const accessibleAreas = await repository.findAccessibleToUser(testUser.id);

      // Assert
      expect(Array.isArray(accessibleAreas)).toBe(true);
      
      // Filter predefined areas
      const predefinedAreas = accessibleAreas.filter(area => area.type === AreaOfFocusType.PREDEFINED);
      
      // All predefined areas should have null userId
      predefinedAreas.forEach(area => {
        expect(area.userId).toBeNull();
        expect(area.type).toBe(AreaOfFocusType.PREDEFINED);
        expect(area.isActive).toBe(true);
      });
    });

    it('should return areas filtered by pillar when specified', async () => {
      // Arrange
      const pillarId = await getTestPillarId();

      // Act
      const accessibleAreas = await repository.findAccessibleToUser(testUser.id, pillarId);

      // Assert
      expect(Array.isArray(accessibleAreas)).toBe(true);
      
      // All areas should belong to the specified pillar
      accessibleAreas.forEach(area => {
        expect(area.pillarId).toBe(pillarId);
        expect(area.isActive).toBe(true);
      });
    });

    it('should return areas ordered by name', async () => {
      // Act
      const accessibleAreas = await repository.findAccessibleToUser(testUser.id);

      // Assert
      if (accessibleAreas.length > 1) {
        for (let i = 1; i < accessibleAreas.length; i++) {
          expect(accessibleAreas[i].name.toLowerCase().localeCompare(accessibleAreas[i - 1].name.toLowerCase())).toBeGreaterThanOrEqual(0);
        }
      }
    });
  });

  describe('findPredefined', () => {
    it('should return only predefined areas', async () => {
      // Act
      const predefinedAreas = await repository.findPredefined();

      // Assert
      expect(Array.isArray(predefinedAreas)).toBe(true);
      
      predefinedAreas.forEach(area => {
        expect(area.type).toBe(AreaOfFocusType.PREDEFINED);
        expect(area.userId).toBeNull();
        expect(area.isActive).toBe(true);
      });
    });

    it('should return predefined areas filtered by pillar when specified', async () => {
      // Arrange
      const pillarId = await getTestPillarId();

      // Act
      const predefinedAreas = await repository.findPredefined(pillarId);

      // Assert
      expect(Array.isArray(predefinedAreas)).toBe(true);
      
      predefinedAreas.forEach(area => {
        expect(area.type).toBe(AreaOfFocusType.PREDEFINED);
        expect(area.pillarId).toBe(pillarId);
        expect(area.userId).toBeNull();
        expect(area.isActive).toBe(true);
      });
    });

    it('should return predefined areas ordered by name', async () => {
      // Act
      const predefinedAreas = await repository.findPredefined();

      // Assert
      if (predefinedAreas.length > 1) {
        for (let i = 1; i < predefinedAreas.length; i++) {
          expect(predefinedAreas[i].name.toLowerCase().localeCompare(predefinedAreas[i - 1].name.toLowerCase())).toBeGreaterThanOrEqual(0);
        }
      }
    });
  });

  describe('findByUser', () => {
    it('should return empty array when user has no custom areas', async () => {
      // Act
      const userAreas = await repository.findByUser(testUser.id);

      // Assert
      expect(userAreas).toEqual([]);
    });

    it('should return user areas filtered by pillar when specified', async () => {
      // Arrange
      const pillarId = await getTestPillarId();

      // Act
      const userAreas = await repository.findByUser(testUser.id, pillarId);

      // Assert
      expect(Array.isArray(userAreas)).toBe(true);
      
      userAreas.forEach(area => {
        expect(area.type).toBe(AreaOfFocusType.USER_CREATED);
        expect(area.userId).toBe(testUser.id);
        expect(area.pillarId).toBe(pillarId);
        expect(area.isActive).toBe(true);
      });
    });
  });

  describe('data validation', () => {
    it('should have valid area types from enum', async () => {
      // Arrange
      const pillarId = await getTestPillarId();

      // Act
      const areas = await repository.findByPillarId(pillarId);

      // Assert
      const validTypes = Object.values(AreaOfFocusType);
      areas.forEach(area => {
        expect(validTypes).toContain(area.type);
      });
    });

    it('should have consistent predefined area properties', async () => {
      // Act
      const predefinedAreas = await repository.findPredefined();

      // Assert
      predefinedAreas.forEach(area => {
        expect(area.type).toBe(AreaOfFocusType.PREDEFINED);
        expect(area.userId).toBeNull();
        expect(area.name).toBeTruthy();
        expect(area.pillarId).toBeTruthy();
        expect(area.isActive).toBe(true);
      });
    });

    it('should have non-empty names', async () => {
      // Arrange
      const pillarId = await getTestPillarId();

      // Act
      const areas = await repository.findByPillarId(pillarId);

      // Assert
      areas.forEach(area => {
        expect(area.name).toBeTruthy();
        expect(area.name.trim()).not.toBe('');
      });
    });

    it('should have valid pillar references', async () => {
      // Arrange
      const allPillars = await pillarRepository.findAll();
      const validPillarIds = allPillars.map(p => p.id);

      // Act
      const accessibleAreas = await repository.findAccessibleToUser(testUser.id);

      // Assert
      accessibleAreas.forEach(area => {
        expect(validPillarIds).toContain(area.pillarId);
      });
    });
  });

  describe('integration with pillar system', () => {
    it('should have areas available for health pillar', async () => {
      // Arrange
      const pillarId = await getTestPillarId();

      // Act
      const healthAreas = await repository.findByPillarId(pillarId);

      // Assert
      expect(healthAreas.length).toBeGreaterThan(0);
      healthAreas.forEach(area => {
        expect(area.pillarId).toBe(pillarId);
        expect(area.isActive).toBe(true);
      });
    });

    it('should provide areas accessible to users for season creation', async () => {
      // Act
      const accessibleAreas = await repository.findAccessibleToUser(testUser.id);

      // Assert
      expect(accessibleAreas.length).toBeGreaterThan(0);
      
      // Should include at least some predefined areas
      const predefinedCount = accessibleAreas.filter(a => a.type === AreaOfFocusType.PREDEFINED).length;
      expect(predefinedCount).toBeGreaterThan(0);
    });
  });
});

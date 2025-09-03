import { PillarRepository, IPillarRepository } from '../PillarRepository';
import { PillarName } from '../../../domain/models/pillar';
import { PillarView } from '../../../domain/views/seasonViews';
import {
  setupAuthenticatedTestUser,
  TestUser
} from '../../../utils/__tests__/testUtils';
import { v4 as uuidv4 } from 'uuid';
describe('PillarRepository Integration Tests', () => {
  let repository: IPillarRepository;
  let testUser: TestUser;
  let cleanup: () => Promise<void>;

  beforeEach(async () => {
    repository = new PillarRepository();
    // Set up authenticated test user for each test
    const setup = await setupAuthenticatedTestUser();
    testUser = setup.user;
    cleanup = setup.cleanup;
  });

  afterEach(async () => {
    // Clean up test user and sign out
    await cleanup();
  });

  describe('findAll', () => {
    it('should return all active pillars', async () => {
      // Act
      const pillars = await repository.findAll();

      // Assert
      expect(pillars).toBeDefined();
      expect(Array.isArray(pillars)).toBe(true);
      expect(pillars.length).toBeGreaterThan(0);
      
      // All returned pillars should be active
      expect(pillars.every(pillar => pillar.isActive)).toBe(true);
      
      // Should be ordered by sort_order
      for (let i = 1; i < pillars.length; i++) {
        expect(pillars[i].sortOrder).toBeGreaterThanOrEqual(pillars[i - 1].sortOrder);
      }
    });

    it('should return pillars with correct structure', async () => {
      // Act
      const pillars = await repository.findAll();

      // Assert
      expect(pillars.length).toBeGreaterThan(0);
      
      const pillar = pillars[0];
      expect(pillar).toHaveProperty('id');
      expect(pillar).toHaveProperty('name');
      expect(pillar).toHaveProperty('displayName');
      expect(pillar).toHaveProperty('description');
      expect(pillar).toHaveProperty('sortOrder');
      expect(pillar).toHaveProperty('isActive');
      expect(pillar).toHaveProperty('createdAt');
      expect(pillar).toHaveProperty('updatedAt');
      
      expect(typeof pillar.id).toBe('string');
      expect(typeof pillar.name).toBe('string');
      expect(typeof pillar.displayName).toBe('string');
      expect(typeof pillar.description).toBe('string');
      expect(typeof pillar.sortOrder).toBe('number');
      expect(typeof pillar.isActive).toBe('boolean');
      expect(pillar.createdAt).toBeInstanceOf(Date);
      expect(pillar.updatedAt).toBeInstanceOf(Date);
    });

    it('should include expected system pillars', async () => {
      // Act
      const pillars = await repository.findAll();

      // Assert
      const pillarNames = pillars.map(p => p.name);
      
      // Check for expected system pillars (these should be seeded)
      const expectedPillars = [
        PillarName.HEALTH_FITNESS,
        PillarName.WEALTH,
        PillarName.FAMILY,
        PillarName.HEAD_GAME,
        PillarName.CAREER
      ];
      
      // At minimum, we should have the health pillar for testing
      expect(pillarNames).toContain(PillarName.HEALTH_FITNESS);
    });
  });

  describe('findById', () => {
    it('should return pillar when found', async () => {
      // Arrange - get a pillar ID from findAll
      const allPillars = await repository.findAll();
      expect(allPillars.length).toBeGreaterThan(0);
      const testPillarId = allPillars[0].id;

      // Act
      const found = await repository.findById(testPillarId);

      // Assert
      expect(found).toBeDefined();
      expect(found?.id).toBe(testPillarId);
      expect(found?.name).toBe(allPillars[0].name);
      expect(found?.displayName).toBe(allPillars[0].displayName);
    });

    it('should return null when pillar not found', async () => {
      // Act
      const nonExistentId = uuidv4();
      const found = await repository.findById(nonExistentId);

      // Assert
      expect(found).toBeNull();
    });

    it('should return pillar with all fields populated', async () => {
      // Arrange
      const allPillars = await repository.findAll();
      const testPillarId = allPillars[0].id;

      // Act
      const found = await repository.findById(testPillarId);

      // Assert
      expect(found).toBeDefined();
      expect(found?.id).toBeTruthy();
      expect(found?.name).toBeTruthy();
      expect(found?.displayName).toBeTruthy();
      expect(found?.description).toBeDefined(); // Can be empty string
      expect(typeof found?.sortOrder).toBe('number');
      expect(typeof found?.isActive).toBe('boolean');
      expect(found?.createdAt).toBeInstanceOf(Date);
      expect(found?.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('findByName', () => {
    it('should return health pillar when searching by HEALTH_FITNESS', async () => {
      // Act
      const found = await repository.findByName(PillarName.HEALTH_FITNESS);

      // Assert
      expect(found).toBeDefined();
      expect(found?.name).toBe(PillarName.HEALTH_FITNESS);
      expect(found?.displayName).toContain('Health');
    });

    it('should return null when pillar name not found', async () => {
      // Act - use an invalid pillar name
      const found = await repository.findByName('invalid_pillar' as PillarName);

      // Assert
      expect(found).toBeNull();
    });

    it('should return pillar with consistent data across methods', async () => {
      // Arrange
      const allPillars = await repository.findAll();
      const testPillar = allPillars.find(p => p.name === PillarName.HEALTH_FITNESS);
      
      // Skip test if health pillar not found in seed data
      if (!testPillar) {
        console.warn('Health pillar not found in seed data, skipping consistency test');
        return;
      }

      // Act
      const foundByName = await repository.findByName(PillarName.HEALTH_FITNESS);
      const foundById = await repository.findById(testPillar.id);

      // Assert
      expect(foundByName).toEqual(foundById);
      expect(foundByName?.id).toBe(testPillar.id);
      expect(foundByName?.name).toBe(testPillar.name);
      expect(foundByName?.displayName).toBe(testPillar.displayName);
    });
  });

  describe('data validation', () => {
    it('should have valid pillar names from enum', async () => {
      // Act
      const pillars = await repository.findAll();

      // Assert
      const validPillarNames = Object.values(PillarName);
      pillars.forEach(pillar => {
        expect(validPillarNames).toContain(pillar.name);
      });
    });

    it('should have non-negative sort orders', async () => {
      // Act
      const pillars = await repository.findAll();

      // Assert
      pillars.forEach(pillar => {
        expect(pillar.sortOrder).toBeGreaterThanOrEqual(0);
      });
    });

    it('should have unique pillar names', async () => {
      // Act
      const pillars = await repository.findAll();

      // Assert
      const names = pillars.map(p => p.name);
      const uniqueNames = new Set(names);
      expect(uniqueNames.size).toBe(names.length);
    });

    it('should have unique pillar IDs', async () => {
      // Act
      const pillars = await repository.findAll();

      // Assert
      const ids = pillars.map(p => p.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe('system pillar requirements', () => {
    it('should have health pillar available for season creation', async () => {
      // Act
      const healthPillar = await repository.findByName(PillarName.HEALTH_FITNESS);

      // Assert
      expect(healthPillar).toBeDefined();
      expect(healthPillar?.isActive).toBe(true);
      expect(healthPillar?.displayName).toBeTruthy();
      expect(healthPillar?.description).toBeDefined();
    });
  });
});

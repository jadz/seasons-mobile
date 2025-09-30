import { PillarRepository, IPillarRepository } from '../PillarRepository';

/**
 * Integration tests for PillarRepository [[memory:7719801]]
 * 
 * Pillars are system-controlled (read-only for users).
 * These tests verify reading pillar data from the database.
 */

describe('PillarRepository Integration Tests', () => {
  let repository: IPillarRepository;

  beforeAll(async () => {
    repository = new PillarRepository();
  });

  describe('findAll', () => {
    it('should return all pillars ordered by sort_order', async () => {
      // Act
      const pillars = await repository.findAll();

      // Assert
      expect(pillars).toBeDefined();
      expect(Array.isArray(pillars)).toBe(true);
      expect(pillars.length).toBeGreaterThan(0);

      // Verify structure of first pillar
      const firstPillar = pillars[0];
      expect(firstPillar.id).toBeDefined();
      expect(firstPillar.name).toBeDefined();
      expect(firstPillar.displayName).toBeDefined();
      expect(firstPillar.sortOrder).toBeDefined();
      expect(firstPillar.isActive).toBeDefined();
      expect(firstPillar.createdAt).toBeInstanceOf(Date);
      expect(firstPillar.updatedAt).toBeInstanceOf(Date);

      // Verify sort order
      for (let i = 1; i < pillars.length; i++) {
        expect(pillars[i].sortOrder).toBeGreaterThanOrEqual(pillars[i - 1].sortOrder);
      }
    });

    it('should return pillars with all required properties', async () => {
      // Act
      const pillars = await repository.findAll();

      // Assert
      pillars.forEach(pillar => {
        expect(pillar).toHaveProperty('id');
        expect(pillar).toHaveProperty('name');
        expect(pillar).toHaveProperty('displayName');
        expect(pillar).toHaveProperty('sortOrder');
        expect(pillar).toHaveProperty('isActive');
        expect(pillar).toHaveProperty('createdAt');
        expect(pillar).toHaveProperty('updatedAt');
      });
    });
  });

  describe('findActiveOnly', () => {
    it('should return only active pillars', async () => {
      // Act
      const pillars = await repository.findActiveOnly();

      // Assert
      expect(pillars).toBeDefined();
      expect(Array.isArray(pillars)).toBe(true);

      // Verify all returned pillars are active
      pillars.forEach(pillar => {
        expect(pillar.isActive).toBe(true);
      });

      // Verify sort order
      for (let i = 1; i < pillars.length; i++) {
        expect(pillars[i].sortOrder).toBeGreaterThanOrEqual(pillars[i - 1].sortOrder);
      }
    });

    it('should return fewer or equal pillars than findAll', async () => {
      // Act
      const allPillars = await repository.findAll();
      const activePillars = await repository.findActiveOnly();

      // Assert
      expect(activePillars.length).toBeLessThanOrEqual(allPillars.length);
    });
  });

  describe('findById', () => {
    it('should return pillar by id', async () => {
      // Arrange - get a pillar to test with
      const allPillars = await repository.findAll();
      expect(allPillars.length).toBeGreaterThan(0);
      const testId = allPillars[0].id;

      // Act
      const pillar = await repository.findById(testId);

      // Assert
      expect(pillar).toBeDefined();
      expect(pillar?.id).toBe(testId);
      expect(pillar?.name).toBe(allPillars[0].name);
      expect(pillar?.displayName).toBe(allPillars[0].displayName);
    });

    it('should return null for non-existent pillar id', async () => {
      // Act
      const pillar = await repository.findById('00000000-0000-0000-0000-000000000000');

      // Assert
      expect(pillar).toBeNull();
    });

    it('should return pillar with correct date types', async () => {
      // Arrange
      const allPillars = await repository.findAll();
      const testId = allPillars[0].id;

      // Act
      const pillar = await repository.findById(testId);

      // Assert
      expect(pillar).toBeDefined();
      expect(pillar?.createdAt).toBeInstanceOf(Date);
      expect(pillar?.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('findWithAreas', () => {
    it('should return pillar with areas of focus array', async () => {
      // Arrange - get first pillar
      const pillars = await repository.findAll();
      expect(pillars.length).toBeGreaterThan(0);
      const testPillar = pillars[0];

      // Act
      const pillar = await repository.findWithAreas(testPillar.id);

      // Assert
      expect(pillar).toBeDefined();
      expect(pillar?.id).toBe(testPillar.id);
      expect(pillar?.areasOfFocus).toBeDefined();
      expect(Array.isArray(pillar?.areasOfFocus)).toBe(true);
      
      if (pillar?.areasOfFocus && pillar.areasOfFocus.length > 0) {
        const area = pillar.areasOfFocus[0];
        expect(area.id).toBeDefined();
        expect(area.name).toBeDefined();
        expect(area.pillarId).toBe(testPillar.id);
        expect(area.createdAt).toBeInstanceOf(Date);
        expect(area.updatedAt).toBeInstanceOf(Date);
      }
    });

    it('should return null for non-existent pillar id', async () => {
      // Act
      const pillar = await repository.findWithAreas('00000000-0000-0000-0000-000000000000');

      // Assert
      expect(pillar).toBeNull();
    });

    it('should only return active areas of focus', async () => {
      // Arrange
      const pillars = await repository.findAll();
      const testPillar = pillars[0];

      // Act
      const pillar = await repository.findWithAreas(testPillar.id);

      // Assert
      expect(pillar).toBeDefined();
      if (pillar?.areasOfFocus) {
        pillar.areasOfFocus.forEach(area => {
          expect(area.isActive).toBe(true);
        });
      }
    });
  });
});
import { SeasonFocusService } from '../SeasonFocusService';
import { PillarRepository } from '../../../db/repositories/PillarRepository';
import { AreaOfFocusRepository } from '../../../db/repositories/AreaOfFocusRepository';

/**
 * Integration tests for SeasonFocusService [[memory:7719801]]
 * 
 * These tests use real repositories connecting to the test database.
 * No mocking of repositories - only external services would be mocked.
 */

describe('SeasonFocusService Integration Tests', () => {
  let service: SeasonFocusService;
  let pillarRepository: PillarRepository;
  let areaOfFocusRepository: AreaOfFocusRepository;

  beforeAll(async () => {
    // Use real repository instances with test database
    pillarRepository = new PillarRepository();
    areaOfFocusRepository = new AreaOfFocusRepository();
    
    // Inject real dependencies into service
    service = new SeasonFocusService(pillarRepository, areaOfFocusRepository);
  });

  describe('getActivePillars', () => {
    it('should return all active pillars', async () => {
      // Act
      const pillars = await service.getActivePillars();

      // Assert
      expect(pillars).toBeDefined();
      expect(Array.isArray(pillars)).toBe(true);
      expect(pillars.length).toBeGreaterThan(0);

      // Verify all are active
      pillars.forEach(pillar => {
        expect(pillar.isActive).toBe(true);
        expect(pillar.id).toBeDefined();
        expect(pillar.name).toBeDefined();
        expect(pillar.displayName).toBeDefined();
      });
    });

    it('should return pillars ordered by sort_order', async () => {
      // Act
      const pillars = await service.getActivePillars();

      // Assert
      for (let i = 1; i < pillars.length; i++) {
        expect(pillars[i].sortOrder).toBeGreaterThanOrEqual(pillars[i - 1].sortOrder);
      }
    });
  });

  describe('getPillarsWithAreas', () => {
    it('should return all active pillars with their predefined areas', async () => {
      // Act
      const pillarsWithAreas = await service.getPillarsWithAreas();

      // Assert
      expect(pillarsWithAreas).toBeDefined();
      expect(Array.isArray(pillarsWithAreas)).toBe(true);
      expect(pillarsWithAreas.length).toBeGreaterThan(0);

      // Verify structure
      pillarsWithAreas.forEach(pillar => {
        expect(pillar.id).toBeDefined();
        expect(pillar.name).toBeDefined();
        expect(pillar.areasOfFocus).toBeDefined();
        expect(Array.isArray(pillar.areasOfFocus)).toBe(true);

        // Verify areas are predefined and belong to this pillar
        pillar.areasOfFocus?.forEach(area => {
          expect(area.pillarId).toBe(pillar.id);
          expect(area.isPredefined).toBe(true);
          expect(area.isActive).toBe(true);
        });
      });
    });

    it('should include pillars even if they have no predefined areas', async () => {
      // Act
      const pillarsWithAreas = await service.getPillarsWithAreas();

      // Assert
      expect(pillarsWithAreas).toBeDefined();
      
      // All pillars should be included, even those with empty areas arrays
      pillarsWithAreas.forEach(pillar => {
        expect(pillar.areasOfFocus).toBeDefined();
        expect(Array.isArray(pillar.areasOfFocus)).toBe(true);
      });
    });
  });

  describe('getPillarWithAreas', () => {
    it('should return a specific pillar with its predefined areas', async () => {
      // Arrange - get a pillar to test with
      const pillars = await service.getActivePillars();
      expect(pillars.length).toBeGreaterThan(0);
      const testPillarId = pillars[0].id;

      // Act
      const pillarWithAreas = await service.getPillarWithAreas(testPillarId);

      // Assert
      expect(pillarWithAreas).toBeDefined();
      expect(pillarWithAreas?.id).toBe(testPillarId);
      expect(pillarWithAreas?.areasOfFocus).toBeDefined();
      expect(Array.isArray(pillarWithAreas?.areasOfFocus)).toBe(true);

      // Verify areas are predefined
      pillarWithAreas?.areasOfFocus?.forEach(area => {
        expect(area.pillarId).toBe(testPillarId);
        expect(area.isPredefined).toBe(true);
      });
    });

    it('should return null for non-existent pillar', async () => {
      // Act
      const pillarWithAreas = await service.getPillarWithAreas('00000000-0000-0000-0000-000000000000');

      // Assert
      expect(pillarWithAreas).toBeNull();
    });
  });

  describe('getPredefinedAreasForPillar', () => {
    it('should return predefined areas for a pillar', async () => {
      // Arrange - get a pillar that has predefined areas
      const pillarsWithAreas = await service.getPillarsWithAreas();
      const pillarWithAreas = pillarsWithAreas.find(p => p.areasOfFocus && p.areasOfFocus.length > 0);
      
      if (!pillarWithAreas) {
        console.warn('No pillars with predefined areas found - skipping test');
        return;
      }

      // Act
      const areas = await service.getPredefinedAreasForPillar(pillarWithAreas.id);

      // Assert
      expect(areas).toBeDefined();
      expect(Array.isArray(areas)).toBe(true);
      expect(areas.length).toBeGreaterThan(0);

      // Verify all are predefined and belong to the pillar
      areas.forEach(area => {
        expect(area.pillarId).toBe(pillarWithAreas.id);
        expect(area.isPredefined).toBe(true);
        expect(area.isActive).toBe(true);
      });
    });

    it('should return empty array for pillar with no predefined areas', async () => {
      // Act - use a non-existent pillar ID
      const areas = await service.getPredefinedAreasForPillar('00000000-0000-0000-0000-000000000000');

      // Assert
      expect(areas).toBeDefined();
      expect(Array.isArray(areas)).toBe(true);
      expect(areas.length).toBe(0);
    });
  });

  describe('getAreaOfFocusWithPillar', () => {
    it('should return area of focus with its pillar information', async () => {
      // Arrange - get an area to test with
      const allAreas = await service.getAllActiveAreas();
      if (allAreas.length === 0) {
        console.warn('No areas of focus found - skipping test');
        return;
      }
      const testArea = allAreas[0];

      // Act
      const areaWithPillar = await service.getAreaOfFocusWithPillar(testArea.id);

      // Assert
      expect(areaWithPillar).toBeDefined();
      expect(areaWithPillar?.id).toBe(testArea.id);
      expect(areaWithPillar?.pillar).toBeDefined();
      expect(areaWithPillar?.pillar.id).toBe(testArea.pillarId);
      expect(areaWithPillar?.pillar.name).toBeDefined();
      expect(areaWithPillar?.pillar.displayName).toBeDefined();
    });

    it('should return null for non-existent area', async () => {
      // Act
      const areaWithPillar = await service.getAreaOfFocusWithPillar('00000000-0000-0000-0000-000000000000');

      // Assert
      expect(areaWithPillar).toBeNull();
    });
  });

  describe('getAllActiveAreas', () => {
    it('should return all active areas of focus', async () => {
      // Act
      const areas = await service.getAllActiveAreas();

      // Assert
      expect(areas).toBeDefined();
      expect(Array.isArray(areas)).toBe(true);

      // Verify all are active
      areas.forEach(area => {
        expect(area.isActive).toBe(true);
        expect(area.id).toBeDefined();
        expect(area.name).toBeDefined();
        expect(area.pillarId).toBeDefined();
      });
    });
  });

  describe('error handling', () => {
    it('should handle errors gracefully when getting active pillars', async () => {
      // Create a service with broken repository
      const brokenPillarRepo = {
        findActiveOnly: jest.fn().mockRejectedValue(new Error('Database error')),
        findAll: jest.fn(),
        findById: jest.fn(),
        findWithAreas: jest.fn(),
      };
      
      const brokenService = new SeasonFocusService(
        brokenPillarRepo as any,
        areaOfFocusRepository
      );

      // Act & Assert
      await expect(brokenService.getActivePillars()).rejects.toThrow('Failed to get active pillars');
    });

    it('should handle errors gracefully when getting pillars with areas', async () => {
      // Create a service with broken repository
      const brokenPillarRepo = {
        findActiveOnly: jest.fn().mockRejectedValue(new Error('Database error')),
        findAll: jest.fn(),
        findById: jest.fn(),
        findWithAreas: jest.fn(),
      };
      
      const brokenService = new SeasonFocusService(
        brokenPillarRepo as any,
        areaOfFocusRepository
      );

      // Act & Assert
      await expect(brokenService.getPillarsWithAreas()).rejects.toThrow('Failed to get pillars with areas');
    });
  });
});

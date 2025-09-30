import { AreaOfFocusRepository, IAreaOfFocusRepository } from '../AreaOfFocusRepository';

/**
 * Integration tests for AreaOfFocusRepository [[memory:7719801]]
 * 
 * Areas of focus are predefined (system-controlled) and read-only for users.
 * These tests verify reading area of focus data from the database.
 */

describe('AreaOfFocusRepository Integration Tests', () => {
  let repository: IAreaOfFocusRepository;

  beforeAll(async () => {
    repository = new AreaOfFocusRepository();
  });

  describe('findAll', () => {
    it('should return all active areas of focus', async () => {
      // Act
      const areas = await repository.findAll();

      // Assert
      expect(areas).toBeDefined();
      expect(Array.isArray(areas)).toBe(true);

      // Verify all are active
      areas.forEach(area => {
        expect(area.isActive).toBe(true);
        expect(area.id).toBeDefined();
        expect(area.name).toBeDefined();
        expect(area.pillarId).toBeDefined();
        expect(area.colorHex).toBeDefined();
        expect(area.colorHex).toMatch(/^#[0-9A-Fa-f]{6}$/); // Valid hex color
        expect(area.createdAt).toBeInstanceOf(Date);
        expect(area.updatedAt).toBeInstanceOf(Date);
      });
    });
  });

  describe('findById', () => {
    it('should return area of focus by id', async () => {
      // Arrange - get an area to test with
      const allAreas = await repository.findAll();
      if (allAreas.length === 0) {
        console.warn('No areas of focus found in database - skipping test');
        return;
      }
      const testArea = allAreas[0];

      // Act
      const found = await repository.findById(testArea.id);

      // Assert
      expect(found).toBeDefined();
      expect(found?.id).toBe(testArea.id);
      expect(found?.name).toBe(testArea.name);
      expect(found?.colorHex).toBeDefined();
      expect(found?.colorHex).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(found?.createdAt).toBeInstanceOf(Date);
      expect(found?.updatedAt).toBeInstanceOf(Date);
    });

    it('should return null for non-existent area id', async () => {
      // Act
      const found = await repository.findById('00000000-0000-0000-0000-000000000000');

      // Assert
      expect(found).toBeNull();
    });
  });

  describe('findWithPillar', () => {
    it('should return area of focus with pillar data', async () => {
      // Arrange - get an area to test with
      const allAreas = await repository.findAll();
      if (allAreas.length === 0) {
        console.warn('No areas of focus found in database - skipping test');
        return;
      }
      const testArea = allAreas[0];

      // Act
      const found = await repository.findWithPillar(testArea.id);

      // Assert
      expect(found).toBeDefined();
      expect(found?.id).toBe(testArea.id);
      expect(found?.colorHex).toBeDefined();
      expect(found?.pillar).toBeDefined();
      expect(found?.pillar.id).toBe(testArea.pillarId);
      expect(found?.pillar.name).toBeDefined();
      expect(found?.pillar.displayName).toBeDefined();
      expect(found?.pillar.createdAt).toBeInstanceOf(Date);
    });

    it('should return null for non-existent area id', async () => {
      // Act
      const found = await repository.findWithPillar('00000000-0000-0000-0000-000000000000');

      // Assert
      expect(found).toBeNull();
    });
  });

  describe('findByPillarId', () => {
    it('should return all active areas for a pillar', async () => {
      // Arrange - get a pillar that has areas
      const allAreas = await repository.findAll();
      if (allAreas.length === 0) {
        console.warn('No areas of focus found in database - skipping test');
        return;
      }
      const pillarId = allAreas[0].pillarId;

      // Act
      const areas = await repository.findByPillarId(pillarId);

      // Assert
      expect(areas).toBeDefined();
      expect(Array.isArray(areas)).toBe(true);
      expect(areas.length).toBeGreaterThan(0);
      
      // Verify all areas belong to the pillar
      areas.forEach(area => {
        expect(area.pillarId).toBe(pillarId);
        expect(area.isActive).toBe(true);
        expect(area.colorHex).toBeDefined();
      });
    });

    it('should return empty array for pillar with no areas', async () => {
      // Act - use a non-existent pillar ID
      const areas = await repository.findByPillarId('00000000-0000-0000-0000-000000000000');

      // Assert
      expect(areas).toBeDefined();
      expect(Array.isArray(areas)).toBe(true);
      expect(areas.length).toBe(0);
    });
  });

  describe('findPredefinedByPillarId', () => {
    it('should return only predefined areas for a pillar', async () => {
      // Arrange - get a pillar that has predefined areas
      const allAreas = await repository.findAll();
      const predefinedAreas = allAreas.filter(a => a.isPredefined);
      
      if (predefinedAreas.length === 0) {
        console.warn('No predefined areas found in database - skipping test');
        return;
      }
      
      const pillarId = predefinedAreas[0].pillarId;

      // Act
      const areas = await repository.findPredefinedByPillarId(pillarId);

      // Assert
      expect(areas).toBeDefined();
      expect(Array.isArray(areas)).toBe(true);
      
      // Verify all returned areas are predefined
      areas.forEach(area => {
        expect(area.isPredefined).toBe(true);
        expect(area.pillarId).toBe(pillarId);
        expect(area.isActive).toBe(true);
        expect(area.colorHex).toBeDefined();
      });
    });

    it('should return empty array for pillar with no predefined areas', async () => {
      // Act
      const areas = await repository.findPredefinedByPillarId('00000000-0000-0000-0000-000000000000');

      // Assert
      expect(areas).toBeDefined();
      expect(Array.isArray(areas)).toBe(true);
      expect(areas.length).toBe(0);
    });
  });
});
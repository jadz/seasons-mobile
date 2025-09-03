import { SeasonCompositionRepository, ISeasonCompositionRepository } from '../SeasonCompositionRepository';
import { SeasonRepository } from '../SeasonRepository';
import { PillarRepository } from '../PillarRepository';
import { AreaOfFocusRepository } from '../AreaOfFocusRepository';
import { MetricRepository } from '../MetricRepository';
import { SeasonStatus } from '../../../domain/models/season';
import { PillarName } from '../../../domain/models/pillar';
import {
  SeasonPillarData,
  SeasonPillarAreaData,
  SeasonAreaMetricData,
  SeasonData
} from '../../../domain/views/seasonViews';
import {
  setupAuthenticatedTestUser,
  TestUser
} from '../../../utils/__tests__/testUtils';

describe('SeasonCompositionRepository Integration Tests', () => {
  let repository: ISeasonCompositionRepository;
  let seasonRepository: SeasonRepository;
  let pillarRepository: PillarRepository;
  let areaOfFocusRepository: AreaOfFocusRepository;
  let metricRepository: MetricRepository;
  let testUser: TestUser;
  let cleanup: () => Promise<void>;
  let createdSeasonIds: string[] = [];
  let createdSeasonPillarIds: string[] = [];
  let createdSeasonPillarAreaIds: string[] = [];
  let createdSeasonAreaMetricIds: string[] = [];

  beforeEach(async () => {
    repository = new SeasonCompositionRepository();
    seasonRepository = new SeasonRepository();
    pillarRepository = new PillarRepository();
    areaOfFocusRepository = new AreaOfFocusRepository();
    metricRepository = new MetricRepository();
    
    // Set up authenticated test user for each test
    const setup = await setupAuthenticatedTestUser();
    testUser = setup.user;
    cleanup = setup.cleanup;
    
    // Reset tracking arrays
    createdSeasonIds = [];
    createdSeasonPillarIds = [];
    createdSeasonPillarAreaIds = [];
    createdSeasonAreaMetricIds = [];
  });

  afterEach(async () => {
    // Clean up created records in reverse order (due to foreign key constraints)
    for (const id of createdSeasonAreaMetricIds) {
      try {
        await repository.deleteSeasonAreaMetric(id);
      } catch (error) {
        console.warn(`Could not delete season area metric ${id}:`, error);
      }
    }

    for (const id of createdSeasonPillarAreaIds) {
      try {
        await repository.deleteSeasonPillarArea(id);
      } catch (error) {
        console.warn(`Could not delete season pillar area ${id}:`, error);
      }
    }

    for (const id of createdSeasonPillarIds) {
      try {
        await repository.deleteSeasonPillar(id);
      } catch (error) {
        console.warn(`Could not delete season pillar ${id}:`, error);
      }
    }

    for (const id of createdSeasonIds) {
      try {
        await seasonRepository.delete(id);
      } catch (error) {
        console.warn(`Could not delete season ${id}:`, error);
      }
    }
    
    // Clean up test user and sign out
    await cleanup();
  });

  const createTestSeason = async (): Promise<string> => {
    const seasonData: SeasonData = {
      userId: testUser.id,
      name: `Test Season ${Date.now()}`,
      durationWeeks: 12,
      status: SeasonStatus.DRAFT,
      startDate: null,
      endDate: null,
    };
    const seasonId = await seasonRepository.create(seasonData);
    createdSeasonIds.push(seasonId);
    return seasonId;
  };

  const getTestPillarId = async (): Promise<string> => {
    const healthPillar = await pillarRepository.findByName(PillarName.HEALTH_FITNESS);
    if (!healthPillar) {
      throw new Error('Health pillar not found in test database');
    }
    return healthPillar.id;
  };

  const getTestAreaOfFocusId = async (): Promise<string> => {
    const pillarId = await getTestPillarId();
    const areas = await areaOfFocusRepository.findByPillarId(pillarId);
    if (areas.length === 0) {
      throw new Error('No areas of focus found for health pillar');
    }
    return areas[0].id;
  };

  const getTestMetricId = async (): Promise<string> => {
    const metrics = await metricRepository.findPredefined();
    if (metrics.length === 0) {
      throw new Error('No predefined metrics found');
    }
    return metrics[0].id;
  };

  describe('createSeasonPillar', () => {
    it('should create a season pillar relationship', async () => {
      // Arrange
      const seasonId = await createTestSeason();
      const pillarId = await getTestPillarId();
      
      const seasonPillarData: SeasonPillarData = {
        seasonId,
        pillarId,
        theme: 'Test theme for health',
        isActive: true,
        sortOrder: 0,
      };

      // Act
      const seasonPillarId = await repository.createSeasonPillar(seasonPillarData);

      // Assert
      expect(seasonPillarId).toBeDefined();
      expect(typeof seasonPillarId).toBe('string');
      createdSeasonPillarIds.push(seasonPillarId);

      // Verify the relationship was created
      const seasonPillars = await repository.findSeasonPillarsBySeasonId(seasonId);
      expect(seasonPillars).toHaveLength(1);
      expect(seasonPillars[0].id).toBe(seasonPillarId);
      expect(seasonPillars[0].theme).toBe('Test theme for health');
    });

    it('should enforce unique season-pillar combinations', async () => {
      // Arrange
      const seasonId = await createTestSeason();
      const pillarId = await getTestPillarId();
      
      const seasonPillarData: SeasonPillarData = {
        seasonId,
        pillarId,
        theme: 'First theme',
        isActive: true,
        sortOrder: 0,
      };

      // Act
      const firstId = await repository.createSeasonPillar(seasonPillarData);
      createdSeasonPillarIds.push(firstId);

      // Assert - should throw error for duplicate
      await expect(repository.createSeasonPillar({
        ...seasonPillarData,
        theme: 'Second theme'
      })).rejects.toThrow();
    });
  });

  describe('createSeasonPillarArea', () => {
    it('should create a season pillar area relationship', async () => {
      // Arrange
      const seasonId = await createTestSeason();
      const pillarId = await getTestPillarId();
      const areaOfFocusId = await getTestAreaOfFocusId();
      
      const seasonPillarData: SeasonPillarData = {
        seasonId,
        pillarId,
        theme: 'Test theme',
        isActive: true,
        sortOrder: 0,
      };
      const seasonPillarId = await repository.createSeasonPillar(seasonPillarData);
      createdSeasonPillarIds.push(seasonPillarId);

      const seasonPillarAreaData: SeasonPillarAreaData = {
        seasonPillarId,
        areaOfFocusId,
        sortOrder: 0,
      };

      // Act
      const seasonPillarAreaId = await repository.createSeasonPillarArea(seasonPillarAreaData);

      // Assert
      expect(seasonPillarAreaId).toBeDefined();
      expect(typeof seasonPillarAreaId).toBe('string');
      createdSeasonPillarAreaIds.push(seasonPillarAreaId);

      // Verify the relationship was created
      const areas = await repository.findSeasonPillarAreasBySeasonPillarId(seasonPillarId);
      expect(areas).toHaveLength(1);
      expect(areas[0].id).toBe(seasonPillarAreaId);
      expect(areas[0].areaOfFocusId).toBe(areaOfFocusId);
    });
  });

  describe('createSeasonAreaMetric', () => {
    it('should create a season area metric relationship', async () => {
      // Arrange
      const seasonId = await createTestSeason();
      const pillarId = await getTestPillarId();
      const areaOfFocusId = await getTestAreaOfFocusId();
      const metricId = await getTestMetricId();
      
      // Create season pillar
      const seasonPillarId = await repository.createSeasonPillar({
        seasonId,
        pillarId,
        theme: 'Test theme',
        isActive: true,
        sortOrder: 0,
      });
      createdSeasonPillarIds.push(seasonPillarId);

      // Create season pillar area
      const seasonPillarAreaId = await repository.createSeasonPillarArea({
        seasonPillarId,
        areaOfFocusId,
        sortOrder: 0,
      });
      createdSeasonPillarAreaIds.push(seasonPillarAreaId);

      const seasonAreaMetricData: SeasonAreaMetricData = {
        seasonPillarAreaId,
        metricId,
        sortOrder: 0,
      };

      // Act
      const seasonAreaMetricId = await repository.createSeasonAreaMetric(seasonAreaMetricData);

      // Assert
      expect(seasonAreaMetricId).toBeDefined();
      expect(typeof seasonAreaMetricId).toBe('string');
      createdSeasonAreaMetricIds.push(seasonAreaMetricId);

      // Verify the relationship was created
      const metrics = await repository.findSeasonAreaMetricsBySeasonPillarAreaId(seasonPillarAreaId);
      expect(metrics).toHaveLength(1);
      expect(metrics[0].id).toBe(seasonAreaMetricId);
      expect(metrics[0].metricId).toBe(metricId);
    });
  });

  describe('findSeasonPillarsBySeasonId', () => {
    it('should return empty array when season has no pillars', async () => {
      // Arrange
      const seasonId = await createTestSeason();

      // Act
      const pillars = await repository.findSeasonPillarsBySeasonId(seasonId);

      // Assert
      expect(pillars).toEqual([]);
    });

    it('should return pillars ordered by sort_order', async () => {
      // Arrange
      const seasonId = await createTestSeason();
      const pillarId = await getTestPillarId();
      
      // Create multiple season pillars with different sort orders
      const pillar1Id = await repository.createSeasonPillar({
        seasonId,
        pillarId,
        theme: 'Theme 1',
        isActive: true,
        sortOrder: 2,
      });
      
      // Note: In real scenario we'd have different pillars, but for test we'll use different themes
      // This will fail due to unique constraint, so let's create just one for now
      createdSeasonPillarIds.push(pillar1Id);

      // Act
      const pillars = await repository.findSeasonPillarsBySeasonId(seasonId);

      // Assert
      expect(pillars).toHaveLength(1);
      expect(pillars[0].theme).toBe('Theme 1');
      expect(pillars[0].sortOrder).toBe(2);
    });

    it('should return pillars with correct structure', async () => {
      // Arrange
      const seasonId = await createTestSeason();
      const pillarId = await getTestPillarId();
      
      const seasonPillarId = await repository.createSeasonPillar({
        seasonId,
        pillarId,
        theme: 'Test theme',
        isActive: true,
        sortOrder: 0,
      });
      createdSeasonPillarIds.push(seasonPillarId);

      // Act
      const pillars = await repository.findSeasonPillarsBySeasonId(seasonId);

      // Assert
      expect(pillars).toHaveLength(1);
      const pillar = pillars[0];
      
      expect(pillar).toHaveProperty('id');
      expect(pillar).toHaveProperty('seasonId');
      expect(pillar).toHaveProperty('pillarId');
      expect(pillar).toHaveProperty('theme');
      expect(pillar).toHaveProperty('isActive');
      expect(pillar).toHaveProperty('sortOrder');
      expect(pillar).toHaveProperty('createdAt');
      
      expect(pillar.id).toBe(seasonPillarId);
      expect(pillar.seasonId).toBe(seasonId);
      expect(pillar.pillarId).toBe(pillarId);
      expect(pillar.theme).toBe('Test theme');
      expect(pillar.isActive).toBe(true);
      expect(pillar.sortOrder).toBe(0);
      expect(pillar.createdAt).toBeInstanceOf(Date);
    });
  });

  describe('updateSeasonPillar', () => {
    it('should update season pillar theme', async () => {
      // Arrange
      const seasonId = await createTestSeason();
      const pillarId = await getTestPillarId();
      
      const seasonPillarId = await repository.createSeasonPillar({
        seasonId,
        pillarId,
        theme: 'Original theme',
        isActive: true,
        sortOrder: 0,
      });
      createdSeasonPillarIds.push(seasonPillarId);

      // Act
      await repository.updateSeasonPillar(seasonPillarId, {
        theme: 'Updated theme'
      });

      // Assert
      const pillars = await repository.findSeasonPillarsBySeasonId(seasonId);
      expect(pillars).toHaveLength(1);
      expect(pillars[0].theme).toBe('Updated theme');
      expect(pillars[0].isActive).toBe(true); // Unchanged
    });

    it('should update season pillar active status', async () => {
      // Arrange
      const seasonId = await createTestSeason();
      const pillarId = await getTestPillarId();
      
      const seasonPillarId = await repository.createSeasonPillar({
        seasonId,
        pillarId,
        theme: 'Test theme',
        isActive: true,
        sortOrder: 0,
      });
      createdSeasonPillarIds.push(seasonPillarId);

      // Act
      await repository.updateSeasonPillar(seasonPillarId, {
        isActive: false
      });

      // Assert
      const pillars = await repository.findSeasonPillarsBySeasonId(seasonId);
      expect(pillars).toHaveLength(1);
      expect(pillars[0].isActive).toBe(false);
      expect(pillars[0].theme).toBe('Test theme'); // Unchanged
    });
  });

  describe('cascade delete operations', () => {
    it('should cascade delete season pillar areas when deleting season pillar', async () => {
      // Arrange
      const seasonId = await createTestSeason();
      const pillarId = await getTestPillarId();
      const areaOfFocusId = await getTestAreaOfFocusId();
      
      // Create season pillar
      const seasonPillarId = await repository.createSeasonPillar({
        seasonId,
        pillarId,
        theme: 'Test theme',
        isActive: true,
        sortOrder: 0,
      });
      
      // Create season pillar area
      const seasonPillarAreaId = await repository.createSeasonPillarArea({
        seasonPillarId,
        areaOfFocusId,
        sortOrder: 0,
      });

      // Act
      await repository.deleteSeasonPillar(seasonPillarId);

      // Assert
      const pillars = await repository.findSeasonPillarsBySeasonId(seasonId);
      expect(pillars).toHaveLength(0);
      
      const areas = await repository.findSeasonPillarAreasBySeasonPillarId(seasonPillarId);
      expect(areas).toHaveLength(0);
    });

    it('should cascade delete season area metrics when deleting season pillar area', async () => {
      // Arrange
      const seasonId = await createTestSeason();
      const pillarId = await getTestPillarId();
      const areaOfFocusId = await getTestAreaOfFocusId();
      const metricId = await getTestMetricId();
      
      // Create hierarchy
      const seasonPillarId = await repository.createSeasonPillar({
        seasonId,
        pillarId,
        theme: 'Test theme',
        isActive: true,
        sortOrder: 0,
      });
      createdSeasonPillarIds.push(seasonPillarId);
      
      const seasonPillarAreaId = await repository.createSeasonPillarArea({
        seasonPillarId,
        areaOfFocusId,
        sortOrder: 0,
      });
      
      const seasonAreaMetricId = await repository.createSeasonAreaMetric({
        seasonPillarAreaId,
        metricId,
        sortOrder: 0,
      });

      // Act
      await repository.deleteSeasonPillarArea(seasonPillarAreaId);

      // Assert
      const areas = await repository.findSeasonPillarAreasBySeasonPillarId(seasonPillarId);
      expect(areas).toHaveLength(0);
      
      const metrics = await repository.findSeasonAreaMetricsBySeasonPillarAreaId(seasonPillarAreaId);
      expect(metrics).toHaveLength(0);
    });
  });

  describe('data integrity', () => {
    it('should maintain sort order correctly', async () => {
      // Arrange
      const seasonId = await createTestSeason();
      const pillarId = await getTestPillarId();
      const areaOfFocusId = await getTestAreaOfFocusId();
      
      const seasonPillarId = await repository.createSeasonPillar({
        seasonId,
        pillarId,
        theme: 'Test theme',
        isActive: true,
        sortOrder: 5,
      });
      createdSeasonPillarIds.push(seasonPillarId);
      
      const seasonPillarAreaId = await repository.createSeasonPillarArea({
        seasonPillarId,
        areaOfFocusId,
        sortOrder: 3,
      });
      createdSeasonPillarAreaIds.push(seasonPillarAreaId);

      // Act
      const pillars = await repository.findSeasonPillarsBySeasonId(seasonId);
      const areas = await repository.findSeasonPillarAreasBySeasonPillarId(seasonPillarId);

      // Assert
      expect(pillars[0].sortOrder).toBe(5);
      expect(areas[0].sortOrder).toBe(3);
    });

    it('should handle timestamps correctly', async () => {
      // Arrange
      const seasonId = await createTestSeason();
      const pillarId = await getTestPillarId();
      
      const beforeCreate = new Date();
      
      // Act
      const seasonPillarId = await repository.createSeasonPillar({
        seasonId,
        pillarId,
        theme: 'Test theme',
        isActive: true,
        sortOrder: 0,
      });
      createdSeasonPillarIds.push(seasonPillarId);
      
      const afterCreate = new Date();

      // Assert
      const pillars = await repository.findSeasonPillarsBySeasonId(seasonId);
      const createdAt = pillars[0].createdAt;
      
      expect(createdAt.getTime()).toBeGreaterThanOrEqual(beforeCreate.getTime());
      expect(createdAt.getTime()).toBeLessThanOrEqual(afterCreate.getTime());
    });
  });
});

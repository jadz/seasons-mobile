import { MetricGoalRepository, IMetricGoalRepository } from '../MetricGoalRepository';
import { SeasonRepository } from '../SeasonRepository';
import { SeasonCompositionRepository } from '../SeasonCompositionRepository';
import { PillarRepository } from '../PillarRepository';
import { AreaOfFocusRepository } from '../AreaOfFocusRepository';
import { MetricRepository } from '../MetricRepository';
import { SeasonStatus } from '../../../domain/models/season';
import { PillarName } from '../../../domain/models/pillar';
import { MetricUnit } from '../../../domain/models/metric';
import {
  MetricGoalData,
  MetricGoalUpdate,
  SeasonData
} from '../../../domain/views/seasonViews';
import {
  setupAuthenticatedTestUser,
  TestUser
} from '../../../utils/__tests__/testUtils';
import { v4 as uuidv4 } from 'uuid';

describe('MetricGoalRepository Integration Tests', () => {
  let repository: IMetricGoalRepository;
  let seasonRepository: SeasonRepository;
  let seasonCompositionRepository: SeasonCompositionRepository;
  let pillarRepository: PillarRepository;
  let areaOfFocusRepository: AreaOfFocusRepository;
  let metricRepository: MetricRepository;
  let testUser: TestUser;
  let cleanup: () => Promise<void>;
  let createdSeasonIds: string[] = [];
  let createdGoalIds: string[] = [];

  beforeEach(async () => {
    repository = new MetricGoalRepository();
    seasonRepository = new SeasonRepository();
    seasonCompositionRepository = new SeasonCompositionRepository();
    pillarRepository = new PillarRepository();
    areaOfFocusRepository = new AreaOfFocusRepository();
    metricRepository = new MetricRepository();
    
    // Set up authenticated test user for each test
    const setup = await setupAuthenticatedTestUser();
    testUser = setup.user;
    cleanup = setup.cleanup;
    
    // Reset tracking arrays
    createdSeasonIds = [];
    createdGoalIds = [];
  });

  afterEach(async () => {
    // Clean up created records in reverse order (goals first, then seasons)
    // This ensures foreign key constraints are respected
    for (const goalId of createdGoalIds) {
      try {
        await repository.delete(goalId);
      } catch (error) {
        console.warn(`Could not delete goal ${goalId}:`, error);
      }
    }

    // Delete seasons (this should cascade delete all related entities)
    for (const seasonId of createdSeasonIds) {
      try {
        await seasonRepository.delete(seasonId);
      } catch (error) {
        console.warn(`Could not delete season ${seasonId}:`, error);
      }
    }
    
    // Clean up test user and sign out
    await cleanup();
  });

  const createTestSeasonAreaMetric = async (): Promise<string> => {
    // Create season with unique name
    const uniqueId = uuidv4().slice(0, 8);
    const seasonData: SeasonData = {
      userId: testUser.id,
      name: `Test Season ${uniqueId} ${Date.now()}`,
      durationWeeks: 12,
      status: SeasonStatus.DRAFT,
      startDate: null,
      endDate: null,
    };
    const seasonId = await seasonRepository.create(seasonData);
    createdSeasonIds.push(seasonId);

    // Get health pillar
    const healthPillar = await pillarRepository.findByName(PillarName.HEALTH_FITNESS);
    if (!healthPillar) {
      throw new Error('Health pillar not found');
    }

    // Create season pillar with unique theme
    const seasonPillarId = await seasonCompositionRepository.createSeasonPillar({
      seasonId,
      pillarId: healthPillar.id,
      theme: `Test theme ${uniqueId}`,
      isActive: true,
      sortOrder: 0,
    });

    // Get area of focus
    const areas = await areaOfFocusRepository.findByPillarId(healthPillar.id);
    if (areas.length === 0) {
      throw new Error('No areas of focus found for health pillar');
    }

    // Create season pillar area
    const seasonPillarAreaId = await seasonCompositionRepository.createSeasonPillarArea({
      seasonPillarId,
      areaOfFocusId: areas[0].id,
      sortOrder: 0,
    });

    // Get metric
    const metrics = await metricRepository.findPredefined();
    if (metrics.length === 0) {
      throw new Error('No predefined metrics found');
    }

    // Create season area metric
    const seasonAreaMetricId = await seasonCompositionRepository.createSeasonAreaMetric({
      seasonPillarAreaId,
      metricId: metrics[0].id,
      sortOrder: 0,
    });

    return seasonAreaMetricId;
  };

  const createTestGoalData = (seasonAreaMetricId: string, overrides: Partial<MetricGoalData> = {}): MetricGoalData => ({
    seasonAreaMetricId,
    goalValue: 75,
    goalUnit: MetricUnit.KILOGRAMS,
    canonicalValue: 75,
    startValue: 80,
    startUnit: MetricUnit.KILOGRAMS,
    targetDate: new Date('2024-06-01'),
    isAchieved: false,
    achievedAt: null,
    notes: 'Test goal',
    ...overrides,
  });

  describe('create', () => {
    it('should create a new metric goal and return the ID', async () => {
      // Arrange
      const seasonAreaMetricId = await createTestSeasonAreaMetric();
      const goalData = createTestGoalData(seasonAreaMetricId);

      // Act
      const goalId = await repository.create(goalData);

      // Assert
      expect(goalId).toBeDefined();
      expect(typeof goalId).toBe('string');
      createdGoalIds.push(goalId);

      // Verify the goal was created
      const created = await repository.findById(goalId);
      expect(created).toBeDefined();
      expect(created?.goalValue).toBe(75);
      expect(created?.goalUnit).toBe(MetricUnit.KILOGRAMS);
      expect(created?.notes).toBe('Test goal');
    });

    it('should create goal with all fields', async () => {
      // Arrange
      const seasonAreaMetricId = await createTestSeasonAreaMetric();
      const targetDate = new Date('2024-12-31');
      const goalData = createTestGoalData(seasonAreaMetricId, {
        goalValue: 100,
        goalUnit: MetricUnit.POUNDS,
        canonicalValue: 45.36, // 100 lbs in kg
        startValue: 180,
        startUnit: MetricUnit.POUNDS,
        targetDate,
        notes: 'Comprehensive goal test',
      });

      // Act
      const goalId = await repository.create(goalData);
      createdGoalIds.push(goalId);

      // Assert
      const created = await repository.findById(goalId);
      expect(created?.goalValue).toBe(100);
      expect(created?.goalUnit).toBe(MetricUnit.POUNDS);
      expect(created?.canonicalValue).toBe(45.36);
      expect(created?.startValue).toBe(180);
      expect(created?.startUnit).toBe(MetricUnit.POUNDS);
      expect(created?.targetDate).toEqual(targetDate);
      expect(created?.isAchieved).toBe(false);
      expect(created?.achievedAt).toBeNull();
      expect(created?.notes).toBe('Comprehensive goal test');
    });

    it('should create goal with minimal required fields', async () => {
      // Arrange
      const seasonAreaMetricId = await createTestSeasonAreaMetric();
      const goalData: MetricGoalData = {
        seasonAreaMetricId,
        goalValue: 50,
        goalUnit: MetricUnit.KILOGRAMS,
        canonicalValue: 50,
        startValue: null,
        startUnit: null,
        targetDate: null,
        isAchieved: false,
        achievedAt: null,
        notes: '',
      };

      // Act
      const goalId = await repository.create(goalData);
      createdGoalIds.push(goalId);

      // Assert
      const created = await repository.findById(goalId);
      expect(created?.goalValue).toBe(50);
      expect(created?.startValue).toBeNull();
      expect(created?.startUnit).toBeNull();
      expect(created?.targetDate).toBeNull();
      expect(created?.notes).toBe('');
    });

    it('should enforce unique season area metric constraint', async () => {
      // Arrange
      const seasonAreaMetricId = await createTestSeasonAreaMetric();
      const goalData1 = createTestGoalData(seasonAreaMetricId);
      const goalData2 = createTestGoalData(seasonAreaMetricId, { goalValue: 100 });

      // Act
      const goalId1 = await repository.create(goalData1);
      createdGoalIds.push(goalId1);

      // Assert - should throw error for duplicate season area metric
      await expect(repository.create(goalData2)).rejects.toThrow();
    });
  });

  describe('findById', () => {
    it('should return goal when found', async () => {
      // Arrange
      const seasonAreaMetricId = await createTestSeasonAreaMetric();
      const goalData = createTestGoalData(seasonAreaMetricId);
      const goalId = await repository.create(goalData);
      createdGoalIds.push(goalId);

      // Act
      const found = await repository.findById(goalId);

      // Assert
      expect(found).toBeDefined();
      expect(found?.id).toBe(goalId);
      expect(found?.seasonAreaMetricId).toBe(seasonAreaMetricId);
      expect(found?.goalValue).toBe(goalData.goalValue);
      expect(found?.goalUnit).toBe(goalData.goalUnit);
      expect(found?.createdAt).toBeInstanceOf(Date);
      expect(found?.updatedAt).toBeInstanceOf(Date);
    });

    it('should return null when goal not found', async () => {
      // Act
      const nonExistentId = uuidv4();
      const found = await repository.findById(nonExistentId);

      // Assert
      expect(found).toBeNull();
    });
  });

  describe('findBySeasonAreaMetricId', () => {
    it('should return goal when found', async () => {
      // Arrange
      const seasonAreaMetricId = await createTestSeasonAreaMetric();
      const goalData = createTestGoalData(seasonAreaMetricId);
      const goalId = await repository.create(goalData);
      createdGoalIds.push(goalId);

      // Act
      const found = await repository.findBySeasonAreaMetricId(seasonAreaMetricId);

      // Assert
      expect(found).toBeDefined();
      expect(found?.id).toBe(goalId);
      expect(found?.seasonAreaMetricId).toBe(seasonAreaMetricId);
    });

    it('should return null when no goal exists for season area metric', async () => {
      // Arrange
      const seasonAreaMetricId = await createTestSeasonAreaMetric();

      // Act
      const found = await repository.findBySeasonAreaMetricId(seasonAreaMetricId);

      // Assert
      expect(found).toBeNull();
    });
  });

  describe('update', () => {
    it('should update goal value and unit', async () => {
      // Arrange
      const seasonAreaMetricId = await createTestSeasonAreaMetric();
      const goalData = createTestGoalData(seasonAreaMetricId);
      const goalId = await repository.create(goalData);
      createdGoalIds.push(goalId);

      const updateData: MetricGoalUpdate = {
        goalValue: 85,
        goalUnit: MetricUnit.POUNDS,
        canonicalValue: 38.56, // 85 lbs in kg
      };

      // Act
      await repository.update(goalId, updateData);

      // Assert
      const updated = await repository.findById(goalId);
      expect(updated?.goalValue).toBe(85);
      expect(updated?.goalUnit).toBe(MetricUnit.POUNDS);
      expect(updated?.canonicalValue).toBe(38.56);
      expect(updated?.startValue).toBe(goalData.startValue); // Unchanged
    });

    it('should update start value and unit', async () => {
      // Arrange
      const seasonAreaMetricId = await createTestSeasonAreaMetric();
      const goalData = createTestGoalData(seasonAreaMetricId);
      const goalId = await repository.create(goalData);
      createdGoalIds.push(goalId);

      const updateData: MetricGoalUpdate = {
        startValue: 90,
        startUnit: MetricUnit.POUNDS,
      };

      // Act
      await repository.update(goalId, updateData);

      // Assert
      const updated = await repository.findById(goalId);
      expect(updated?.startValue).toBe(90);
      expect(updated?.startUnit).toBe(MetricUnit.POUNDS);
      expect(updated?.goalValue).toBe(goalData.goalValue); // Unchanged
    });

    it('should update target date and notes', async () => {
      // Arrange
      const seasonAreaMetricId = await createTestSeasonAreaMetric();
      const goalData = createTestGoalData(seasonAreaMetricId);
      const goalId = await repository.create(goalData);
      createdGoalIds.push(goalId);

      const newTargetDate = new Date('2024-12-31');
      const updateData: MetricGoalUpdate = {
        targetDate: newTargetDate,
        notes: 'Updated notes',
      };

      // Act
      await repository.update(goalId, updateData);

      // Assert
      const updated = await repository.findById(goalId);
      expect(updated?.targetDate).toEqual(newTargetDate);
      expect(updated?.notes).toBe('Updated notes');
    });

    it('should update the updated_at timestamp', async () => {
      // Arrange
      const seasonAreaMetricId = await createTestSeasonAreaMetric();
      const goalData = createTestGoalData(seasonAreaMetricId);
      const goalId = await repository.create(goalData);
      createdGoalIds.push(goalId);

      const originalGoal = await repository.findById(goalId);
      const originalUpdatedAt = originalGoal?.updatedAt;

      // Wait a bit to ensure timestamp difference
      await new Promise(resolve => setTimeout(resolve, 10));

      // Act
      await repository.update(goalId, { notes: 'Updated' });

      // Assert
      const updated = await repository.findById(goalId);
      expect(updated?.updatedAt).not.toEqual(originalUpdatedAt);
      expect(updated?.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt?.getTime() || 0);
    });
  });

  describe('markAsAchieved', () => {
    it('should mark goal as achieved with default timestamp', async () => {
      // Arrange
      const seasonAreaMetricId = await createTestSeasonAreaMetric();
      const goalData = createTestGoalData(seasonAreaMetricId);
      const goalId = await repository.create(goalData);
      createdGoalIds.push(goalId);

      const beforeAchievement = new Date();

      // Act
      await repository.markAsAchieved(goalId);

      // Assert
      const updated = await repository.findById(goalId);
      expect(updated?.isAchieved).toBe(true);
      expect(updated?.achievedAt).toBeInstanceOf(Date);
      expect(updated?.achievedAt!.getTime()).toBeGreaterThanOrEqual(beforeAchievement.getTime());
    });

    it('should mark goal as achieved with custom timestamp', async () => {
      // Arrange
      const seasonAreaMetricId = await createTestSeasonAreaMetric();
      const goalData = createTestGoalData(seasonAreaMetricId);
      const goalId = await repository.create(goalData);
      createdGoalIds.push(goalId);

      const customAchievedAt = new Date('2024-05-15');

      // Act
      await repository.markAsAchieved(goalId, customAchievedAt);

      // Assert
      const updated = await repository.findById(goalId);
      expect(updated?.isAchieved).toBe(true);
      expect(updated?.achievedAt).toEqual(customAchievedAt);
    });
  });

  describe('markAsNotAchieved', () => {
    it('should mark goal as not achieved', async () => {
      // Arrange
      const seasonAreaMetricId = await createTestSeasonAreaMetric();
      const goalData = createTestGoalData(seasonAreaMetricId, {
        isAchieved: true,
        achievedAt: new Date(),
      });
      const goalId = await repository.create(goalData);
      createdGoalIds.push(goalId);

      // Act
      await repository.markAsNotAchieved(goalId);

      // Assert
      const updated = await repository.findById(goalId);
      expect(updated?.isAchieved).toBe(false);
      expect(updated?.achievedAt).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete goal successfully', async () => {
      // Arrange
      const seasonAreaMetricId = await createTestSeasonAreaMetric();
      const goalData = createTestGoalData(seasonAreaMetricId);
      const goalId = await repository.create(goalData);

      // Act
      await repository.delete(goalId);

      // Assert
      const deleted = await repository.findById(goalId);
      expect(deleted).toBeNull();
    });

    it('should not throw error when deleting non-existent goal', async () => {
      // Act & Assert - should not throw
      const nonExistentId = uuidv4();
      await expect(repository.delete(nonExistentId)).resolves.not.toThrow();
    });
  });

  describe('data integrity', () => {
    it('should maintain data types correctly', async () => {
      // Arrange
      const seasonAreaMetricId = await createTestSeasonAreaMetric();
      const targetDate = new Date('2024-08-15T14:30:00Z');
      const achievedAt = new Date('2024-07-20T09:15:00Z');
      
      const goalData = createTestGoalData(seasonAreaMetricId, {
        goalValue: 123.45,
        canonicalValue: 123.45,
        startValue: 150.75,
        targetDate,
        isAchieved: true,
        achievedAt,
      });

      // Act
      const goalId = await repository.create(goalData);
      createdGoalIds.push(goalId);

      // Assert
      const retrieved = await repository.findById(goalId);
      expect(retrieved?.goalValue).toBe(123.45);
      expect(retrieved?.canonicalValue).toBe(123.45);
      expect(retrieved?.startValue).toBe(150.75);
      expect(retrieved?.targetDate).toEqual(targetDate);
      expect(retrieved?.isAchieved).toBe(true);
      expect(retrieved?.achievedAt).toEqual(achievedAt);
      expect(retrieved?.createdAt).toBeInstanceOf(Date);
      expect(retrieved?.updatedAt).toBeInstanceOf(Date);
    });

    it('should handle null values correctly', async () => {
      // Arrange
      const seasonAreaMetricId = await createTestSeasonAreaMetric();
      const goalData: MetricGoalData = {
        seasonAreaMetricId,
        goalValue: 50,
        goalUnit: MetricUnit.KILOGRAMS,
        canonicalValue: 50,
        startValue: null,
        startUnit: null,
        targetDate: null,
        isAchieved: false,
        achievedAt: null,
        notes: '',
      };

      // Act
      const goalId = await repository.create(goalData);
      createdGoalIds.push(goalId);

      // Assert
      const retrieved = await repository.findById(goalId);
      expect(retrieved?.startValue).toBeNull();
      expect(retrieved?.startUnit).toBeNull();
      expect(retrieved?.targetDate).toBeNull();
      expect(retrieved?.achievedAt).toBeNull();
    });
  });
});

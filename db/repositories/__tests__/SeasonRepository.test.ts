import { SeasonRepository, ISeasonRepository } from '../SeasonRepository';
import { SeasonStatus } from '../../../domain/models/season';
import {
  SeasonView,
  SeasonData,
  SeasonUpdate
} from '../../../domain/views/seasonViews';
import {
  setupAuthenticatedTestUser,
  signOutTestUser,
  TestUser
} from '../../../utils/__tests__/testUtils';
import { v4 as uuidv4 } from 'uuid';

describe('SeasonRepository Integration Tests', () => {
  let repository: ISeasonRepository;
  let testUser: TestUser;
  let cleanup: () => Promise<void>;
  let createdSeasonIds: string[] = [];

  beforeEach(async () => {
    repository = new SeasonRepository();
    // Set up authenticated test user for each test
    const setup = await setupAuthenticatedTestUser();
    testUser = setup.user;
    cleanup = setup.cleanup;
    createdSeasonIds = [];
  });

  afterEach(async () => {
    // Clean up any created season records
    for (const seasonId of createdSeasonIds) {
      try {
        await repository.delete(seasonId);
      } catch (error) {
        // Ignore errors if record was already deleted during test
        console.warn(`Could not delete season ${seasonId}:`, error);
      }
    }
    
    // Clean up test user and sign out
    await cleanup();
  });

  const createTestSeasonData = (overrides: Partial<SeasonData> = {}): SeasonData => ({
    userId: testUser.id,
    name: `Test Season ${Date.now()}`,
    durationWeeks: 12,
    status: SeasonStatus.DRAFT,
    startDate: null,
    endDate: null,
    ...overrides,
  });

  describe('create', () => {
    it('should create a new season and return the ID', async () => {
      // Arrange
      const seasonData = createTestSeasonData();

      // Act
      const seasonId = await repository.create(seasonData);

      // Assert
      expect(seasonId).toBeDefined();
      expect(typeof seasonId).toBe('string');
      createdSeasonIds.push(seasonId);

      // Verify the season was created
      const created = await repository.findById(seasonId);
      expect(created).toBeDefined();
      expect(created?.name).toBe(seasonData.name);
      expect(created?.userId).toBe(testUser.id);
      expect(created?.status).toBe(SeasonStatus.DRAFT);
    });

    it('should create season with all optional fields', async () => {
      // Arrange
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-03-31');
      const seasonData = createTestSeasonData({
        durationWeeks: 16,
        status: SeasonStatus.ACTIVE,
        startDate,
        endDate,
      });

      // Act
      const seasonId = await repository.create(seasonData);
      createdSeasonIds.push(seasonId);

      // Assert
      const created = await repository.findById(seasonId);
      expect(created?.durationWeeks).toBe(16);
      expect(created?.status).toBe(SeasonStatus.ACTIVE);
      expect(created?.startDate).toEqual(startDate);
      expect(created?.endDate).toEqual(endDate);
    });

    it('should enforce unique season names per user', async () => {
      // Arrange
      const seasonName = `Unique Season ${Date.now()}`;
      const seasonData1 = createTestSeasonData({ name: seasonName });
      const seasonData2 = createTestSeasonData({ name: seasonName });

      // Act
      const seasonId1 = await repository.create(seasonData1);
      createdSeasonIds.push(seasonId1);

      // Assert - should throw error for duplicate name
      await expect(repository.create(seasonData2)).rejects.toThrow();
    });
  });

  describe('findById', () => {
    it('should return season when found', async () => {
      // Arrange
      const seasonData = createTestSeasonData();
      const seasonId = await repository.create(seasonData);
      createdSeasonIds.push(seasonId);

      // Act
      const found = await repository.findById(seasonId);

      // Assert
      expect(found).toBeDefined();
      expect(found?.id).toBe(seasonId);
      expect(found?.name).toBe(seasonData.name);
      expect(found?.userId).toBe(testUser.id);
      expect(found?.createdAt).toBeInstanceOf(Date);
      expect(found?.updatedAt).toBeInstanceOf(Date);
    });

    it('should return null when season not found', async () => {
      // Act
      const nonExistentId = uuidv4();
      const found = await repository.findById(nonExistentId);

      // Assert
      expect(found).toBeNull();
    });
  });

  describe('findByUserId', () => {
    it('should return all seasons for a user', async () => {
      // Arrange
      const seasonData1 = createTestSeasonData({ name: 'Season 1' });
      const seasonData2 = createTestSeasonData({ name: 'Season 2' });
      
      const seasonId1 = await repository.create(seasonData1);
      const seasonId2 = await repository.create(seasonData2);
      createdSeasonIds.push(seasonId1, seasonId2);

      // Act
      const seasons = await repository.findByUserId(testUser.id);

      // Assert
      expect(seasons).toHaveLength(2);
      expect(seasons.map(s => s.name)).toContain('Season 1');
      expect(seasons.map(s => s.name)).toContain('Season 2');
      expect(seasons.every(s => s.userId === testUser.id)).toBe(true);
    });

    it('should return empty array when user has no seasons', async () => {
      // Act
      const seasons = await repository.findByUserId(testUser.id);

      // Assert
      expect(seasons).toEqual([]);
    });

    it('should return seasons ordered by creation date (newest first)', async () => {
      // Arrange
      const seasonData1 = createTestSeasonData({ name: 'First Season' });
      const seasonData2 = createTestSeasonData({ name: 'Second Season' });
      
      const seasonId1 = await repository.create(seasonData1);
      await new Promise(resolve => setTimeout(resolve, 10)); // Small delay
      const seasonId2 = await repository.create(seasonData2);
      createdSeasonIds.push(seasonId1, seasonId2);

      // Act
      const seasons = await repository.findByUserId(testUser.id);

      // Assert
      expect(seasons).toHaveLength(2);
      expect(seasons[0].name).toBe('Second Season'); // Newest first
      expect(seasons[1].name).toBe('First Season');
    });
  });

  describe('findActiveByUserId', () => {
    it('should return active season when user has one', async () => {
      // Arrange
      const draftSeasonData = createTestSeasonData({ 
        name: 'Draft Season',
        status: SeasonStatus.DRAFT 
      });
      const activeSeasonData = createTestSeasonData({ 
        name: 'Active Season',
        status: SeasonStatus.ACTIVE 
      });
      
      const draftId = await repository.create(draftSeasonData);
      const activeId = await repository.create(activeSeasonData);
      createdSeasonIds.push(draftId, activeId);

      // Act
      const activeSeason = await repository.findActiveByUserId(testUser.id);

      // Assert
      expect(activeSeason).toBeDefined();
      expect(activeSeason?.name).toBe('Active Season');
      expect(activeSeason?.status).toBe(SeasonStatus.ACTIVE);
    });

    it('should return null when user has no active season', async () => {
      // Arrange
      const draftSeasonData = createTestSeasonData({ status: SeasonStatus.DRAFT });
      const seasonId = await repository.create(draftSeasonData);
      createdSeasonIds.push(seasonId);

      // Act
      const activeSeason = await repository.findActiveByUserId(testUser.id);

      // Assert
      expect(activeSeason).toBeNull();
    });
  });

  describe('update', () => {
    it('should update season name', async () => {
      // Arrange
      const seasonData = createTestSeasonData();
      const seasonId = await repository.create(seasonData);
      createdSeasonIds.push(seasonId);

      const updateData: SeasonUpdate = {
        name: 'Updated Season Name'
      };

      // Act
      await repository.update(seasonId, updateData);

      // Assert
      const updated = await repository.findById(seasonId);
      expect(updated?.name).toBe('Updated Season Name');
      expect(updated?.durationWeeks).toBe(seasonData.durationWeeks); // Unchanged
    });

    it('should update duration weeks', async () => {
      // Arrange
      const seasonData = createTestSeasonData({ durationWeeks: 12 });
      const seasonId = await repository.create(seasonData);
      createdSeasonIds.push(seasonId);

      const updateData: SeasonUpdate = {
        durationWeeks: 16
      };

      // Act
      await repository.update(seasonId, updateData);

      // Assert
      const updated = await repository.findById(seasonId);
      expect(updated?.durationWeeks).toBe(16);
      expect(updated?.name).toBe(seasonData.name); // Unchanged
    });

    it('should update both name and duration', async () => {
      // Arrange
      const seasonData = createTestSeasonData();
      const seasonId = await repository.create(seasonData);
      createdSeasonIds.push(seasonId);

      const updateData: SeasonUpdate = {
        name: 'New Name',
        durationWeeks: 20
      };

      // Act
      await repository.update(seasonId, updateData);

      // Assert
      const updated = await repository.findById(seasonId);
      expect(updated?.name).toBe('New Name');
      expect(updated?.durationWeeks).toBe(20);
    });

    it('should update the updated_at timestamp', async () => {
      // Arrange
      const seasonData = createTestSeasonData();
      const seasonId = await repository.create(seasonData);
      createdSeasonIds.push(seasonId);

      const originalSeason = await repository.findById(seasonId);
      const originalUpdatedAt = originalSeason?.updatedAt;

      // Wait a bit to ensure timestamp difference
      await new Promise(resolve => setTimeout(resolve, 10));

      // Act
      await repository.update(seasonId, { name: 'Updated' });

      // Assert
      const updated = await repository.findById(seasonId);
      expect(updated?.updatedAt).not.toEqual(originalUpdatedAt);
      expect(updated?.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt?.getTime() || 0);
    });
  });

  describe('delete', () => {
    it('should delete season successfully', async () => {
      // Arrange
      const seasonData = createTestSeasonData();
      const seasonId = await repository.create(seasonData);

      // Act
      await repository.delete(seasonId);

      // Assert
      const deleted = await repository.findById(seasonId);
      expect(deleted).toBeNull();
    });

    it('should not throw error when deleting non-existent season', async () => {
      // Act & Assert - should not throw
      const nonExistentId = uuidv4();
      await expect(repository.delete(nonExistentId)).resolves.not.toThrow();
    });
  });

  describe('data integrity', () => {
    it('should maintain data types correctly', async () => {
      // Arrange
      const startDate = new Date('2024-01-15T10:30:00Z');
      const endDate = new Date('2024-04-15T18:45:00Z');
      const seasonData = createTestSeasonData({
        durationWeeks: 14,
        startDate,
        endDate,
      });

      // Act
      const seasonId = await repository.create(seasonData);
      createdSeasonIds.push(seasonId);

      // Assert
      const retrieved = await repository.findById(seasonId);
      expect(retrieved?.durationWeeks).toBe(14);
      expect(retrieved?.startDate).toEqual(startDate);
      expect(retrieved?.endDate).toEqual(endDate);
      expect(retrieved?.createdAt).toBeInstanceOf(Date);
      expect(retrieved?.updatedAt).toBeInstanceOf(Date);
    });

    it('should handle null values correctly', async () => {
      // Arrange
      const seasonData = createTestSeasonData({
        durationWeeks: null,
        startDate: null,
        endDate: null,
      });

      // Act
      const seasonId = await repository.create(seasonData);
      createdSeasonIds.push(seasonId);

      // Assert
      const retrieved = await repository.findById(seasonId);
      expect(retrieved?.durationWeeks).toBeNull();
      expect(retrieved?.startDate).toBeNull();
      expect(retrieved?.endDate).toBeNull();
    });
  });
});

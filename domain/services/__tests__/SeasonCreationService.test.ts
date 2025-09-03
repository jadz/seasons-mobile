import { SeasonCreationService } from '../SeasonCreationService';
import { SeasonStatus } from '../../models/season';
import { PillarName } from '../../models/pillar';
import { AreaOfFocusType } from '../../models/areaOfFocus';
import { MetricType, MetricUnitType, MetricUnit, MetricDataType } from '../../models/metric';
import {
  SeasonView,
  SeasonCreationView,
  CreateSeasonRequest,
  AddPillarToSeasonRequest,
  AddAreaToSeasonPillarRequest,
  AddMetricToSeasonAreaRequest
} from '../../views/seasonViews';

// Mock repository interfaces
interface MockSeasonRepository {
  create: jest.Mock;
  findById: jest.Mock;
  findByUserId: jest.Mock;
  findActiveByUserId: jest.Mock;
  update: jest.Mock;
  delete: jest.Mock;
}

interface MockSeasonCompositionRepository {
  createSeasonPillar: jest.Mock;
  createSeasonPillarArea: jest.Mock;
  createSeasonAreaMetric: jest.Mock;
  findSeasonPillarsBySeasonId: jest.Mock;
  findSeasonPillarAreasBySeasonPillarId: jest.Mock;
  findSeasonAreaMetricsBySeasonPillarAreaId: jest.Mock;
  updateSeasonPillar: jest.Mock;
  deleteSeasonPillar: jest.Mock;
  deleteSeasonPillarArea: jest.Mock;
  deleteSeasonAreaMetric: jest.Mock;
}

interface MockPillarRepository {
  findAll: jest.Mock;
  findById: jest.Mock;
  findByName: jest.Mock;
}

interface MockAreaOfFocusRepository {
  findById: jest.Mock;
  findByPillarId: jest.Mock;
  findAccessibleToUser: jest.Mock;
}

interface MockMetricRepository {
  findById: jest.Mock;
  findAccessibleToUser: jest.Mock;
}

interface MockMetricGoalRepository {
  create: jest.Mock;
  findById: jest.Mock;
  findBySeasonAreaMetricId: jest.Mock;
  update: jest.Mock;
  delete: jest.Mock;
}

// Helper to create mock repositories
const createMockRepositories = () => ({
  seasonRepository: {
    create: jest.fn(),
    findById: jest.fn(),
    findByUserId: jest.fn(),
    findActiveByUserId: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  } as MockSeasonRepository,
  seasonCompositionRepository: {
    createSeasonPillar: jest.fn(),
    createSeasonPillarArea: jest.fn(),
    createSeasonAreaMetric: jest.fn(),
    findSeasonPillarsBySeasonId: jest.fn(),
    findSeasonPillarAreasBySeasonPillarId: jest.fn(),
    findSeasonAreaMetricsBySeasonPillarAreaId: jest.fn(),
    updateSeasonPillar: jest.fn(),
    deleteSeasonPillar: jest.fn(),
    deleteSeasonPillarArea: jest.fn(),
    deleteSeasonAreaMetric: jest.fn(),
  } as MockSeasonCompositionRepository,
  pillarRepository: {
    findAll: jest.fn(),
    findById: jest.fn(),
    findByName: jest.fn(),
  } as MockPillarRepository,
  areaOfFocusRepository: {
    findById: jest.fn(),
    findByPillarId: jest.fn(),
    findAccessibleToUser: jest.fn(),
  } as MockAreaOfFocusRepository,
  metricRepository: {
    findById: jest.fn(),
    findAccessibleToUser: jest.fn(),
  } as MockMetricRepository,
  metricGoalRepository: {
    create: jest.fn(),
    findById: jest.fn(),
    findBySeasonAreaMetricId: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  } as MockMetricGoalRepository,
});

// Test data helpers
const createTestSeasonView = (): SeasonView => ({
  id: 'season-123',
  userId: 'user-123',
  name: 'My Fitness Season',
  durationWeeks: 12,
  status: SeasonStatus.DRAFT,
  startDate: null,
  endDate: null,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
});

const createTestPillarView = () => ({
  id: 'pillar-health',
  name: PillarName.HEALTH_FITNESS,
  displayName: 'Health & Fitness',
  description: 'Physical health, fitness, nutrition, and body composition goals',
  sortOrder: 1,
  isActive: true,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
});

const createTestAreaOfFocusView = () => ({
  id: 'area-strength',
  name: 'Increase Strength',
  description: 'Focus on building overall strength',
  pillarId: 'pillar-health',
  userId: null,
  type: AreaOfFocusType.PREDEFINED,
  isActive: true,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
});

const createTestMetricView = () => ({
  id: 'metric-weight',
  name: 'Body Weight',
  description: 'Track body weight changes',
  unitType: MetricUnitType.WEIGHT,
  defaultUnit: MetricUnit.KILOGRAMS,
  alternativeUnits: [MetricUnit.POUNDS],
  dataType: MetricDataType.DECIMAL,
  type: MetricType.PREDEFINED,
  userId: null,
  calculationMethod: null,
  isActive: true,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
});

describe('SeasonCreationService', () => {
  let service: SeasonCreationService;
  let mockRepos: ReturnType<typeof createMockRepositories>;

  beforeEach(() => {
    mockRepos = createMockRepositories();
    service = new SeasonCreationService(
      mockRepos.seasonRepository as any,
      mockRepos.seasonCompositionRepository as any,
      mockRepos.pillarRepository as any,
      mockRepos.areaOfFocusRepository as any,
      mockRepos.metricRepository as any,
      mockRepos.metricGoalRepository as any
    );
  });

  describe('createDraftSeason', () => {
    it('should create a new draft season with health pillar by default', async () => {
      // Arrange
      const request: CreateSeasonRequest = {
        userId: 'user-123',
        name: 'My Fitness Season',
        durationWeeks: 12,
      };

      const mockSeason = createTestSeasonView();
      const mockHealthPillar = createTestPillarView();

      mockRepos.seasonRepository.findActiveByUserId.mockResolvedValue(null);
      mockRepos.seasonRepository.create.mockResolvedValue('season-123');
      mockRepos.seasonRepository.findById.mockResolvedValue(mockSeason);
      mockRepos.pillarRepository.findByName.mockResolvedValue(mockHealthPillar);
      mockRepos.seasonCompositionRepository.createSeasonPillar.mockResolvedValue('season-pillar-123');
      mockRepos.seasonCompositionRepository.findSeasonPillarsBySeasonId.mockResolvedValue([{
        id: 'season-pillar-123',
        seasonId: 'season-123',
        pillarId: 'pillar-health',
        theme: '',
        isActive: true,
        sortOrder: 0,
        createdAt: new Date(),
      }]);
      mockRepos.pillarRepository.findById.mockResolvedValue(mockHealthPillar);
      mockRepos.seasonCompositionRepository.findSeasonPillarAreasBySeasonPillarId.mockResolvedValue([]);
      mockRepos.areaOfFocusRepository.findById.mockResolvedValue(null);
      mockRepos.seasonCompositionRepository.findSeasonAreaMetricsBySeasonPillarAreaId.mockResolvedValue([]);
      mockRepos.metricRepository.findById.mockResolvedValue(null);
      mockRepos.metricGoalRepository.findBySeasonAreaMetricId.mockResolvedValue(null);

      // Act
      const result = await service.createDraftSeason(request);

      // Assert
      expect(result.season).toEqual(mockSeason);
      expect(mockRepos.seasonRepository.findActiveByUserId).toHaveBeenCalledWith('user-123');
      expect(mockRepos.seasonRepository.create).toHaveBeenCalledWith({
        userId: 'user-123',
        name: 'My Fitness Season',
        durationWeeks: 12,
        status: SeasonStatus.DRAFT,
        startDate: null,
        endDate: null,
      });
      expect(mockRepos.pillarRepository.findByName).toHaveBeenCalledWith(PillarName.HEALTH_FITNESS);
      expect(mockRepos.seasonCompositionRepository.createSeasonPillar).toHaveBeenCalledWith({
        seasonId: 'season-123',
        pillarId: 'pillar-health',
        theme: '',
        isActive: true,
        sortOrder: 0,
      });
    });

    it('should throw error if user already has an active season', async () => {
      // Arrange
      const request: CreateSeasonRequest = {
        userId: 'user-123',
        name: 'My Fitness Season',
      };

      const existingActiveSeason = createTestSeasonView();
      existingActiveSeason.status = SeasonStatus.ACTIVE;

      mockRepos.seasonRepository.findActiveByUserId.mockResolvedValue(existingActiveSeason);

      // Act & Assert
      await expect(service.createDraftSeason(request)).rejects.toThrow(
        'User already has an active season. Complete or cancel the current season before creating a new one.'
      );

      expect(mockRepos.seasonRepository.create).not.toHaveBeenCalled();
    });

    it('should validate season name is not empty', async () => {
      // Arrange
      const request: CreateSeasonRequest = {
        userId: 'user-123',
        name: '',
      };

      // Act & Assert
      await expect(service.createDraftSeason(request)).rejects.toThrow(
        'Season name cannot be empty'
      );

      expect(mockRepos.seasonRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('setPillarTheme', () => {
    it('should set theme for season pillar', async () => {
      // Arrange
      const request: AddPillarToSeasonRequest = {
        seasonId: 'season-123',
        pillarId: 'pillar-health',
        theme: 'Reverse diet and get stronger',
      };

      const mockSeasonPillar = {
        id: 'season-pillar-123',
        seasonId: 'season-123',
        pillarId: 'pillar-health',
        theme: 'Reverse diet and get stronger',
        isActive: true,
        sortOrder: 0,
        createdAt: new Date(),
      };

      mockRepos.seasonCompositionRepository.findSeasonPillarsBySeasonId.mockResolvedValue([mockSeasonPillar]);
      mockRepos.seasonCompositionRepository.updateSeasonPillar.mockResolvedValue(undefined);

      // Act
      const result = await service.setPillarTheme('season-123', 'pillar-health', 'Reverse diet and get stronger');

      // Assert
      expect(result).toEqual(mockSeasonPillar);
    });

    it('should throw error if theme is empty', async () => {
      // Act & Assert
      await expect(service.setPillarTheme('season-123', 'pillar-health', '')).rejects.toThrow(
        'Season pillar theme cannot be empty'
      );
    });
  });

  describe('addAreaOfFocusToSeasonPillar', () => {
    it('should add area of focus to season pillar', async () => {
      // Arrange
      const request: AddAreaToSeasonPillarRequest = {
        seasonPillarId: 'season-pillar-123',
        areaOfFocusId: 'area-strength',
      };

      const mockAreaOfFocus = createTestAreaOfFocusView();
      const mockSeasonPillarArea = {
        id: 'season-pillar-area-123',
        seasonPillarId: 'season-pillar-123',
        areaOfFocusId: 'area-strength',
        sortOrder: 0,
        createdAt: new Date(),
      };

      mockRepos.areaOfFocusRepository.findById.mockResolvedValue(mockAreaOfFocus);
      mockRepos.seasonCompositionRepository.findSeasonPillarAreasBySeasonPillarId.mockResolvedValue([]);
      mockRepos.seasonCompositionRepository.createSeasonPillarArea.mockResolvedValue('season-pillar-area-123');

      // Act
      const result = await service.addAreaOfFocusToSeasonPillar(request);

      // Assert
      expect(result).toBe('season-pillar-area-123');
      expect(mockRepos.areaOfFocusRepository.findById).toHaveBeenCalledWith('area-strength');
      expect(mockRepos.seasonCompositionRepository.createSeasonPillarArea).toHaveBeenCalledWith({
        seasonPillarId: 'season-pillar-123',
        areaOfFocusId: 'area-strength',
        sortOrder: 0,
      });
    });

    it('should throw error if area of focus not found', async () => {
      // Arrange
      const request: AddAreaToSeasonPillarRequest = {
        seasonPillarId: 'season-pillar-123',
        areaOfFocusId: 'non-existent-area',
      };

      mockRepos.areaOfFocusRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(service.addAreaOfFocusToSeasonPillar(request)).rejects.toThrow(
        'Area of focus not found: non-existent-area'
      );
    });

    it('should throw error if area already exists in season pillar', async () => {
      // Arrange
      const request: AddAreaToSeasonPillarRequest = {
        seasonPillarId: 'season-pillar-123',
        areaOfFocusId: 'area-strength',
      };

      const mockAreaOfFocus = createTestAreaOfFocusView();
      const existingSeasonPillarArea = {
        id: 'existing-area',
        seasonPillarId: 'season-pillar-123',
        areaOfFocusId: 'area-strength',
        sortOrder: 0,
        createdAt: new Date(),
      };

      mockRepos.areaOfFocusRepository.findById.mockResolvedValue(mockAreaOfFocus);
      mockRepos.seasonCompositionRepository.findSeasonPillarAreasBySeasonPillarId.mockResolvedValue([existingSeasonPillarArea]);

      // Act & Assert
      await expect(service.addAreaOfFocusToSeasonPillar(request)).rejects.toThrow(
        'Area of focus is already added to this season pillar'
      );
    });
  });

  describe('addMetricToSeasonArea', () => {
    it('should add metric with goal to season area', async () => {
      // Arrange
      const request: AddMetricToSeasonAreaRequest = {
        seasonPillarAreaId: 'season-area-123',
        metricId: 'metric-weight',
        baseline: {
          value: 80,
          unit: MetricUnit.KILOGRAMS,
        },
        target: {
          value: 75,
          unit: MetricUnit.KILOGRAMS,
          targetDate: new Date('2024-06-01'),
        },
        notes: 'Lose 5kg gradually',
      };

      const mockMetric = createTestMetricView();
      const mockSeasonAreaMetric = {
        id: 'season-area-metric-123',
        seasonPillarAreaId: 'season-area-123',
        metricId: 'metric-weight',
        sortOrder: 0,
        createdAt: new Date(),
      };

      mockRepos.metricRepository.findById.mockResolvedValue(mockMetric);
      mockRepos.seasonCompositionRepository.findSeasonAreaMetricsBySeasonPillarAreaId.mockResolvedValue([]);
      mockRepos.seasonCompositionRepository.createSeasonAreaMetric.mockResolvedValue('season-area-metric-123');
      mockRepos.metricGoalRepository.create.mockResolvedValue('metric-goal-123');

      // Act
      const result = await service.addMetricToSeasonArea(request);

      // Assert
      expect(result).toBe('season-area-metric-123');
      expect(mockRepos.metricRepository.findById).toHaveBeenCalledWith('metric-weight');
      expect(mockRepos.seasonCompositionRepository.createSeasonAreaMetric).toHaveBeenCalledWith({
        seasonPillarAreaId: 'season-area-123',
        metricId: 'metric-weight',
        sortOrder: 0,
      });
      expect(mockRepos.metricGoalRepository.create).toHaveBeenCalledWith({
        seasonAreaMetricId: 'season-area-metric-123',
        goalValue: 75,
        goalUnit: MetricUnit.KILOGRAMS,
        canonicalValue: 75, // Same as goal since it's in default unit
        startValue: 80,
        startUnit: MetricUnit.KILOGRAMS,
        targetDate: new Date('2024-06-01'),
        isAchieved: false,
        achievedAt: null,
        notes: 'Lose 5kg gradually',
      });
    });

    it('should add metric without goal if no baseline/target provided', async () => {
      // Arrange
      const request: AddMetricToSeasonAreaRequest = {
        seasonPillarAreaId: 'season-area-123',
        metricId: 'metric-weight',
      };

      const mockMetric = createTestMetricView();

      mockRepos.metricRepository.findById.mockResolvedValue(mockMetric);
      mockRepos.seasonCompositionRepository.findSeasonAreaMetricsBySeasonPillarAreaId.mockResolvedValue([]);
      mockRepos.seasonCompositionRepository.createSeasonAreaMetric.mockResolvedValue('season-area-metric-123');

      // Act
      const result = await service.addMetricToSeasonArea(request);

      // Assert
      expect(result).toBe('season-area-metric-123');
      expect(mockRepos.metricGoalRepository.create).not.toHaveBeenCalled();
    });

    it('should throw error if metric not found', async () => {
      // Arrange
      const request: AddMetricToSeasonAreaRequest = {
        seasonPillarAreaId: 'season-area-123',
        metricId: 'non-existent-metric',
      };

      mockRepos.metricRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(service.addMetricToSeasonArea(request)).rejects.toThrow(
        'Metric not found: non-existent-metric'
      );
    });
  });

  describe('getSeasonCreationView', () => {
    it('should return comprehensive season creation view', async () => {
      // Arrange
      const seasonId = 'season-123';
      const mockSeason = createTestSeasonView();
      const mockPillar = createTestPillarView();
      const mockAreaOfFocus = createTestAreaOfFocusView();
      const mockMetric = createTestMetricView();

      const mockSeasonPillar = {
        id: 'season-pillar-123',
        seasonId: 'season-123',
        pillarId: 'pillar-health',
        theme: 'Reverse diet and get stronger',
        isActive: true,
        sortOrder: 0,
        createdAt: new Date(),
      };

      const mockSeasonPillarArea = {
        id: 'season-pillar-area-123',
        seasonPillarId: 'season-pillar-123',
        areaOfFocusId: 'area-strength',
        sortOrder: 0,
        createdAt: new Date(),
      };

      const mockSeasonAreaMetric = {
        id: 'season-area-metric-123',
        seasonPillarAreaId: 'season-pillar-area-123',
        metricId: 'metric-weight',
        sortOrder: 0,
        createdAt: new Date(),
      };

      const mockMetricGoal = {
        id: 'metric-goal-123',
        seasonAreaMetricId: 'season-area-metric-123',
        goalValue: 75,
        goalUnit: MetricUnit.KILOGRAMS,
        canonicalValue: 75,
        startValue: 80,
        startUnit: MetricUnit.KILOGRAMS,
        targetDate: new Date('2024-06-01'),
        isAchieved: false,
        achievedAt: null,
        notes: 'Lose 5kg gradually',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepos.seasonRepository.findById.mockResolvedValue(mockSeason);
      mockRepos.seasonCompositionRepository.findSeasonPillarsBySeasonId.mockResolvedValue([mockSeasonPillar]);
      mockRepos.pillarRepository.findById.mockResolvedValue(mockPillar);
      mockRepos.seasonCompositionRepository.findSeasonPillarAreasBySeasonPillarId.mockResolvedValue([mockSeasonPillarArea]);
      mockRepos.areaOfFocusRepository.findById.mockResolvedValue(mockAreaOfFocus);
      mockRepos.seasonCompositionRepository.findSeasonAreaMetricsBySeasonPillarAreaId.mockResolvedValue([mockSeasonAreaMetric]);
      mockRepos.metricRepository.findById.mockResolvedValue(mockMetric);
      mockRepos.metricGoalRepository.findBySeasonAreaMetricId.mockResolvedValue(mockMetricGoal);

      // Act
      const result = await service.getSeasonCreationView(seasonId);

      // Assert
      expect(result).toEqual({
        season: mockSeason,
        pillars: [{
          ...mockSeasonPillar,
          pillar: mockPillar,
          areas: [{
            ...mockSeasonPillarArea,
            areaOfFocus: mockAreaOfFocus,
            metrics: [{
              ...mockSeasonAreaMetric,
              metric: mockMetric,
              goal: mockMetricGoal,
            }],
          }],
        }],
      });
    });

    it('should throw error if season not found', async () => {
      // Arrange
      mockRepos.seasonRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(service.getSeasonCreationView('non-existent-season')).rejects.toThrow(
        'Season not found: non-existent-season'
      );
    });
  });

  describe('validateSeasonCanStart', () => {
    it('should return true when season has training phases (placeholder)', async () => {
      // This is a placeholder test since training phases aren't implemented yet
      const result = await service.validateSeasonCanStart('season-123');
      expect(result).toBe(false); // Currently always false until training phases are implemented
    });
  });
});

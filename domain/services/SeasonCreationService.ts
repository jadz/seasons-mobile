import {
  SeasonView,
  SeasonCreationView,
  CreateSeasonRequest,
  AddPillarToSeasonRequest,
  AddAreaToSeasonPillarRequest,
  AddMetricToSeasonAreaRequest,
  SeasonPillarView,
  SeasonData,
  SeasonPillarData,
  SeasonPillarAreaData,
  SeasonAreaMetricData,
  MetricGoalData,
  PillarView,
  AreaOfFocusView,
  MetricView,
  MetricGoalView,
  SeasonPillarWithAreasView,
  SeasonPillarAreaWithMetricsView,
  SeasonAreaMetricWithGoalView
} from '../views/seasonViews';
import { SeasonStatus } from '../models/season';
import { PillarName } from '../models/pillar';
import { MetricUnit } from '../models/metric';
import { SeasonCompositionHelpers } from '../models/seasonComposition';

// Import repository interfaces
import { ISeasonRepository } from '../../db/repositories/SeasonRepository';
import { ISeasonCompositionRepository } from '../../db/repositories/SeasonCompositionRepository';
import { IPillarRepository } from '../../db/repositories/PillarRepository';
import { IAreaOfFocusRepository } from '../../db/repositories/AreaOfFocusRepository';
import { IMetricRepository } from '../../db/repositories/MetricRepository';
import { IMetricGoalRepository } from '../../db/repositories/MetricGoalRepository';

/**
 * Service for managing season creation and composition
 * 
 * This service coordinates the complex process of creating seasons with their
 * hierarchical structure of pillars -> areas -> metrics -> goals.
 * It enforces business rules and maintains data consistency across entities.
 */
export class SeasonCreationService {
  constructor(
    private readonly seasonRepository: ISeasonRepository,
    private readonly seasonCompositionRepository: ISeasonCompositionRepository,
    private readonly pillarRepository: IPillarRepository,
    private readonly areaOfFocusRepository: IAreaOfFocusRepository,
    private readonly metricRepository: IMetricRepository,
    private readonly metricGoalRepository: IMetricGoalRepository
  ) {}

  /**
   * Create a new draft season with health pillar by default
   * @param request The season creation request
   * @returns The created season with health pillar
   * @throws Error if user already has active season or validation fails
   */
  async createDraftSeason(request: CreateSeasonRequest): Promise<SeasonCreationView> {
    try {
      // Validate input
      if (!request.name?.trim()) {
        throw new Error('Season name cannot be empty');
      }

      // Check if user already has an active season
      const existingActiveSeason = await this.seasonRepository.findActiveByUserId(request.userId);
      if (existingActiveSeason) {
        throw new Error('User already has an active season. Complete or cancel the current season before creating a new one.');
      }

      // Create the draft season
      const seasonData: SeasonData = {
        userId: request.userId,
        name: request.name,
        durationWeeks: request.durationWeeks ?? null,
        status: SeasonStatus.DRAFT,
        startDate: null,
        endDate: null,
      };

      const seasonId = await this.seasonRepository.create(seasonData);

      // Get the health pillar
      const healthPillar = await this.pillarRepository.findByName(PillarName.HEALTH_FITNESS);
      if (!healthPillar) {
        throw new Error('Health pillar not found in system');
      }

      // Add health pillar to the season with empty theme
      const seasonPillarData: SeasonPillarData = {
        seasonId,
        pillarId: healthPillar.id,
        theme: '',
        isActive: true,
        sortOrder: 0,
      };

      await this.seasonCompositionRepository.createSeasonPillar(seasonPillarData);

      // Return the complete season creation view
      return await this.getSeasonCreationView(seasonId);
    } catch (error) {
      console.error('Error creating draft season:', error);
      throw error;
    }
  }

  /**
   * Set theme for a season pillar
   * @param seasonId The season ID
   * @param pillarId The pillar ID
   * @param theme The theme text
   * @returns The updated season pillar
   * @throws Error if validation fails
   */
  async setPillarTheme(seasonId: string, pillarId: string, theme: string): Promise<SeasonPillarView> {
    try {
      // Validate theme
      if (!theme?.trim()) {
        throw new Error('Season pillar theme cannot be empty');
      }

      // Find the season pillar
      const seasonPillars = await this.seasonCompositionRepository.findSeasonPillarsBySeasonId(seasonId);
      const seasonPillar = seasonPillars.find(sp => sp.pillarId === pillarId);

      if (!seasonPillar) {
        throw new Error(`Season pillar not found for season ${seasonId} and pillar ${pillarId}`);
      }

      // Update the theme
      await this.seasonCompositionRepository.updateSeasonPillar(seasonPillar.id, { theme });

      // Return the updated season pillar
      const updatedSeasonPillars = await this.seasonCompositionRepository.findSeasonPillarsBySeasonId(seasonId);
      const updatedSeasonPillar = updatedSeasonPillars.find(sp => sp.pillarId === pillarId);

      if (!updatedSeasonPillar) {
        throw new Error('Failed to retrieve updated season pillar');
      }

      return updatedSeasonPillar;
    } catch (error) {
      console.error('Error setting pillar theme:', error);
      throw error;
    }
  }

  /**
   * Add an area of focus to a season pillar
   * @param request The area addition request
   * @returns The created season pillar area ID
   * @throws Error if area not found or already exists
   */
  async addAreaOfFocusToSeasonPillar(request: AddAreaToSeasonPillarRequest): Promise<string> {
    try {
      // Validate area of focus exists
      const areaOfFocus = await this.areaOfFocusRepository.findById(request.areaOfFocusId);
      if (!areaOfFocus) {
        throw new Error(`Area of focus not found: ${request.areaOfFocusId}`);
      }

      // Check if area is already added to this season pillar
      const existingAreas = await this.seasonCompositionRepository.findSeasonPillarAreasBySeasonPillarId(request.seasonPillarId);
      const existingAreaIds = existingAreas.map(area => area.areaOfFocusId);

      SeasonCompositionHelpers.validateNoDuplicateAreas(existingAreaIds, request.areaOfFocusId);

      // Calculate next sort order
      const existingSortOrders = existingAreas.map(area => area.sortOrder);
      const nextSortOrder = SeasonCompositionHelpers.calculateNextSortOrder(existingSortOrders);

      // Create the season pillar area
      const seasonPillarAreaData: SeasonPillarAreaData = {
        seasonPillarId: request.seasonPillarId,
        areaOfFocusId: request.areaOfFocusId,
        sortOrder: nextSortOrder,
      };

      return await this.seasonCompositionRepository.createSeasonPillarArea(seasonPillarAreaData);
    } catch (error) {
      console.error('Error adding area of focus to season pillar:', error);
      throw error;
    }
  }

  /**
   * Add a metric with optional goal to a season area
   * @param request The metric addition request
   * @returns The created season area metric ID
   * @throws Error if metric not found or validation fails
   */
  async addMetricToSeasonArea(request: AddMetricToSeasonAreaRequest): Promise<string> {
    try {
      // Validate metric exists
      const metric = await this.metricRepository.findById(request.metricId);
      if (!metric) {
        throw new Error(`Metric not found: ${request.metricId}`);
      }

      // Check if metric is already added to this season area
      const existingMetrics = await this.seasonCompositionRepository.findSeasonAreaMetricsBySeasonPillarAreaId(request.seasonPillarAreaId);
      const existingMetricIds = existingMetrics.map(m => m.metricId);

      SeasonCompositionHelpers.validateNoDuplicateMetrics(existingMetricIds, request.metricId);

      // Calculate next sort order
      const existingSortOrders = existingMetrics.map(m => m.sortOrder);
      const nextSortOrder = SeasonCompositionHelpers.calculateNextSortOrder(existingSortOrders);

      // Create the season area metric
      const seasonAreaMetricData: SeasonAreaMetricData = {
        seasonPillarAreaId: request.seasonPillarAreaId,
        metricId: request.metricId,
        sortOrder: nextSortOrder,
      };

      const seasonAreaMetricId = await this.seasonCompositionRepository.createSeasonAreaMetric(seasonAreaMetricData);

      // Create goal if baseline or target provided
      if (request.baseline || request.target) {
        const goalData: MetricGoalData = {
          seasonAreaMetricId,
          goalValue: request.target?.value ?? request.baseline?.value ?? 0,
          goalUnit: request.target?.unit ?? request.baseline?.unit ?? metric.defaultUnit,
          canonicalValue: request.target?.value ?? request.baseline?.value ?? 0, // TODO: Convert to canonical unit
          startValue: request.baseline?.value ?? null,
          startUnit: request.baseline?.unit ?? null,
          targetDate: request.target?.targetDate ?? null,
          isAchieved: false,
          achievedAt: null,
          notes: request.notes ?? '',
        };

        await this.metricGoalRepository.create(goalData);
      }

      return seasonAreaMetricId;
    } catch (error) {
      console.error('Error adding metric to season area:', error);
      throw error;
    }
  }

  /**
   * Get comprehensive view of season creation data
   * @param seasonId The season ID
   * @returns Complete season creation view with all related data
   * @throws Error if season not found
   */
  async getSeasonCreationView(seasonId: string): Promise<SeasonCreationView> {
    try {
      // Get the season
      const season = await this.seasonRepository.findById(seasonId);
      if (!season) {
        throw new Error(`Season not found: ${seasonId}`);
      }

      // Get all season pillars
      const seasonPillars = await this.seasonCompositionRepository.findSeasonPillarsBySeasonId(seasonId);

      // Build the comprehensive view
      const pillarsWithAreas: SeasonPillarWithAreasView[] = [];

      for (const seasonPillar of seasonPillars) {
        // Get pillar details
        const pillar = await this.pillarRepository.findById(seasonPillar.pillarId);
        if (!pillar) {
          console.warn(`Pillar not found: ${seasonPillar.pillarId}`);
          continue;
        }

        // Get areas for this season pillar
        const seasonPillarAreas = await this.seasonCompositionRepository.findSeasonPillarAreasBySeasonPillarId(seasonPillar.id);

        const areasWithMetrics: SeasonPillarAreaWithMetricsView[] = [];

        for (const seasonPillarArea of seasonPillarAreas) {
          // Get area of focus details
          const areaOfFocus = await this.areaOfFocusRepository.findById(seasonPillarArea.areaOfFocusId);
          if (!areaOfFocus) {
            console.warn(`Area of focus not found: ${seasonPillarArea.areaOfFocusId}`);
            continue;
          }

          // Get metrics for this area
          const seasonAreaMetrics = await this.seasonCompositionRepository.findSeasonAreaMetricsBySeasonPillarAreaId(seasonPillarArea.id);

          const metricsWithGoals: SeasonAreaMetricWithGoalView[] = [];

          for (const seasonAreaMetric of seasonAreaMetrics) {
            // Get metric details
            const metric = await this.metricRepository.findById(seasonAreaMetric.metricId);
            if (!metric) {
              console.warn(`Metric not found: ${seasonAreaMetric.metricId}`);
              continue;
            }

            // Get goal if it exists
            const goal = await this.metricGoalRepository.findBySeasonAreaMetricId(seasonAreaMetric.id);

            metricsWithGoals.push({
              ...seasonAreaMetric,
              metric,
              goal: goal ?? undefined,
            });
          }

          areasWithMetrics.push({
            ...seasonPillarArea,
            areaOfFocus,
            metrics: metricsWithGoals,
          });
        }

        pillarsWithAreas.push({
          ...seasonPillar,
          pillar,
          areas: areasWithMetrics,
        });
      }

      return {
        season,
        pillars: pillarsWithAreas,
      };
    } catch (error) {
      console.error('Error getting season creation view:', error);
      throw error;
    }
  }

  /**
   * Validate if season can be started
   * @param seasonId The season ID
   * @returns True if season has required training phases
   */
  async validateSeasonCanStart(seasonId: string): Promise<boolean> {
    // Placeholder - will return false until training phases are implemented
    return false;
  }

  /**
   * Remove an area of focus from a season pillar
   * @param seasonPillarAreaId The season pillar area ID to remove
   * @throws Error if not found or has dependent metrics
   */
  async removeAreaOfFocusFromSeasonPillar(seasonPillarAreaId: string): Promise<void> {
    // Implementation will be added later
    throw new Error('Not implemented yet');
  }

  /**
   * Remove a metric from a season area
   * @param seasonAreaMetricId The season area metric ID to remove
   * @throws Error if not found
   */
  async removeMetricFromSeasonArea(seasonAreaMetricId: string): Promise<void> {
    // Implementation will be added later
    throw new Error('Not implemented yet');
  }

  /**
   * Update metric goal for a season area metric
   * @param seasonAreaMetricId The season area metric ID
   * @param goalData The goal data to update
   * @returns The updated goal ID
   * @throws Error if metric not found or validation fails
   */
  async updateMetricGoal(seasonAreaMetricId: string, goalData: any): Promise<string> {
    // Implementation will be added later
    throw new Error('Not implemented yet');
  }
}

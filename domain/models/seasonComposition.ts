/**
 * Domain models for season composition entities
 * 
 * These models represent the relationships between seasons and their components:
 * - SeasonPillar: Which pillars are active in a season
 * - SeasonPillarArea: Which areas of focus are active for each pillar
 * - SeasonAreaMetric: Which metrics track each area of focus
 * 
 * These entities are part of the Season aggregate and enforce the composition rules.
 */

export class SeasonPillar {
  constructor(
    public readonly id: string,
    public readonly seasonId: string,
    public readonly pillarId: string,
    public readonly isActive: boolean,
    public readonly sortOrder: number,
    public readonly createdAt: Date
  ) {
    this.validateInvariants();
  }

  /**
   * Add a pillar to a season
   */
  static addToSeason(
    seasonId: string,
    pillarId: string,
    sortOrder?: number
  ): {
    seasonId: string;
    pillarId: string;
    isActive: boolean;
    sortOrder: number;
  } {
    this.validateSeasonId(seasonId);
    this.validatePillarId(pillarId);
    this.validateSortOrder(sortOrder ?? 0);

    return {
      seasonId,
      pillarId,
      isActive: true,
      sortOrder: sortOrder ?? 0
    };
  }

  /**
   * Reconstruct from database data
   */
  static fromData(data: {
    id: string;
    seasonId: string;
    pillarId: string;
    isActive: boolean;
    sortOrder: number;
    createdAt: Date;
  }): SeasonPillar {
    return new SeasonPillar(
      data.id,
      data.seasonId,
      data.pillarId,
      data.isActive,
      data.sortOrder,
      data.createdAt
    );
  }

  /**
   * Check if this pillar is active in the season
   */
  isActivePillar(): boolean {
    return this.isActive;
  }

  /**
   * Activate this pillar in the season
   */
  activate(): SeasonPillar {
    if (this.isActive) {
      return this; // Already active
    }

    return new SeasonPillar(
      this.id,
      this.seasonId,
      this.pillarId,
      true,
      this.sortOrder,
      this.createdAt
    );
  }

  /**
   * Deactivate this pillar in the season
   */
  deactivate(): SeasonPillar {
    if (!this.isActive) {
      return this; // Already inactive
    }

    return new SeasonPillar(
      this.id,
      this.seasonId,
      this.pillarId,
      false,
      this.sortOrder,
      this.createdAt
    );
  }

  /**
   * Update sort order
   */
  updateSortOrder(sortOrder: number): SeasonPillar {
    SeasonPillar.validateSortOrder(sortOrder);

    return new SeasonPillar(
      this.id,
      this.seasonId,
      this.pillarId,
      this.isActive,
      sortOrder,
      this.createdAt
    );
  }

  private validateInvariants(): void {
    SeasonPillar.validateSeasonId(this.seasonId);
    SeasonPillar.validatePillarId(this.pillarId);
    SeasonPillar.validateSortOrder(this.sortOrder);
  }

  private static validateSeasonId(seasonId: string): void {
    if (!seasonId?.trim()) {
      throw new Error('Season ID cannot be empty');
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(seasonId)) {
      throw new Error('Season ID must be a valid UUID');
    }
  }

  private static validatePillarId(pillarId: string): void {
    if (!pillarId?.trim()) {
      throw new Error('Pillar ID cannot be empty');
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(pillarId)) {
      throw new Error('Pillar ID must be a valid UUID');
    }
  }

  private static validateSortOrder(sortOrder: number): void {
    if (!Number.isInteger(sortOrder) || sortOrder < 0) {
      throw new Error('Sort order must be a non-negative integer');
    }
  }
}

export class SeasonPillarArea {
  constructor(
    public readonly id: string,
    public readonly seasonPillarId: string,
    public readonly areaOfFocusId: string,
    public readonly sortOrder: number,
    public readonly createdAt: Date
  ) {
    this.validateInvariants();
  }

  /**
   * Add an area of focus to a season pillar
   */
  static addToSeasonPillar(
    seasonPillarId: string,
    areaOfFocusId: string,
    sortOrder?: number
  ): {
    seasonPillarId: string;
    areaOfFocusId: string;
    sortOrder: number;
  } {
    this.validateSeasonPillarId(seasonPillarId);
    this.validateAreaOfFocusId(areaOfFocusId);
    this.validateSortOrder(sortOrder ?? 0);

    return {
      seasonPillarId,
      areaOfFocusId,
      sortOrder: sortOrder ?? 0
    };
  }

  /**
   * Reconstruct from database data
   */
  static fromData(data: {
    id: string;
    seasonPillarId: string;
    areaOfFocusId: string;
    sortOrder: number;
    createdAt: Date;
  }): SeasonPillarArea {
    return new SeasonPillarArea(
      data.id,
      data.seasonPillarId,
      data.areaOfFocusId,
      data.sortOrder,
      data.createdAt
    );
  }

  /**
   * Update sort order
   */
  updateSortOrder(sortOrder: number): SeasonPillarArea {
    SeasonPillarArea.validateSortOrder(sortOrder);

    return new SeasonPillarArea(
      this.id,
      this.seasonPillarId,
      this.areaOfFocusId,
      sortOrder,
      this.createdAt
    );
  }

  private validateInvariants(): void {
    SeasonPillarArea.validateSeasonPillarId(this.seasonPillarId);
    SeasonPillarArea.validateAreaOfFocusId(this.areaOfFocusId);
    SeasonPillarArea.validateSortOrder(this.sortOrder);
  }

  private static validateSeasonPillarId(seasonPillarId: string): void {
    if (!seasonPillarId?.trim()) {
      throw new Error('Season pillar ID cannot be empty');
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(seasonPillarId)) {
      throw new Error('Season pillar ID must be a valid UUID');
    }
  }

  private static validateAreaOfFocusId(areaOfFocusId: string): void {
    if (!areaOfFocusId?.trim()) {
      throw new Error('Area of focus ID cannot be empty');
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(areaOfFocusId)) {
      throw new Error('Area of focus ID must be a valid UUID');
    }
  }

  private static validateSortOrder(sortOrder: number): void {
    if (!Number.isInteger(sortOrder) || sortOrder < 0) {
      throw new Error('Sort order must be a non-negative integer');
    }
  }
}

export class SeasonAreaMetric {
  constructor(
    public readonly id: string,
    public readonly seasonPillarAreaId: string,
    public readonly metricId: string,
    public readonly sortOrder: number,
    public readonly createdAt: Date
  ) {
    this.validateInvariants();
  }

  /**
   * Add a metric to track a season area of focus
   */
  static addToSeasonArea(
    seasonPillarAreaId: string,
    metricId: string,
    sortOrder?: number
  ): {
    seasonPillarAreaId: string;
    metricId: string;
    sortOrder: number;
  } {
    this.validateSeasonPillarAreaId(seasonPillarAreaId);
    this.validateMetricId(metricId);
    this.validateSortOrder(sortOrder ?? 0);

    return {
      seasonPillarAreaId,
      metricId,
      sortOrder: sortOrder ?? 0
    };
  }

  /**
   * Reconstruct from database data
   */
  static fromData(data: {
    id: string;
    seasonPillarAreaId: string;
    metricId: string;
    sortOrder: number;
    createdAt: Date;
  }): SeasonAreaMetric {
    return new SeasonAreaMetric(
      data.id,
      data.seasonPillarAreaId,
      data.metricId,
      data.sortOrder,
      data.createdAt
    );
  }

  /**
   * Update sort order
   */
  updateSortOrder(sortOrder: number): SeasonAreaMetric {
    SeasonAreaMetric.validateSortOrder(sortOrder);

    return new SeasonAreaMetric(
      this.id,
      this.seasonPillarAreaId,
      this.metricId,
      sortOrder,
      this.createdAt
    );
  }

  private validateInvariants(): void {
    SeasonAreaMetric.validateSeasonPillarAreaId(this.seasonPillarAreaId);
    SeasonAreaMetric.validateMetricId(this.metricId);
    SeasonAreaMetric.validateSortOrder(this.sortOrder);
  }

  private static validateSeasonPillarAreaId(seasonPillarAreaId: string): void {
    if (!seasonPillarAreaId?.trim()) {
      throw new Error('Season pillar area ID cannot be empty');
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(seasonPillarAreaId)) {
      throw new Error('Season pillar area ID must be a valid UUID');
    }
  }

  private static validateMetricId(metricId: string): void {
    if (!metricId?.trim()) {
      throw new Error('Metric ID cannot be empty');
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(metricId)) {
      throw new Error('Metric ID must be a valid UUID');
    }
  }

  private static validateSortOrder(sortOrder: number): void {
    if (!Number.isInteger(sortOrder) || sortOrder < 0) {
      throw new Error('Sort order must be a non-negative integer');
    }
  }
}

/**
 * Helper functions for working with season composition
 */
export class SeasonCompositionHelpers {
  /**
   * Validate that an area of focus belongs to the correct pillar
   */
  static validateAreaBelongsToPillar(
    areaOfFocusPillarId: string,
    expectedPillarId: string
  ): void {
    if (areaOfFocusPillarId !== expectedPillarId) {
      throw new Error('Area of focus does not belong to the specified pillar');
    }
  }

  /**
   * Validate that no duplicate pillars are added to a season
   */
  static validateNoDuplicatePillars(
    existingPillarIds: string[],
    newPillarId: string
  ): void {
    if (existingPillarIds.includes(newPillarId)) {
      throw new Error('Pillar is already added to this season');
    }
  }

  /**
   * Validate that no duplicate areas are added to a season pillar
   */
  static validateNoDuplicateAreas(
    existingAreaIds: string[],
    newAreaId: string
  ): void {
    if (existingAreaIds.includes(newAreaId)) {
      throw new Error('Area of focus is already added to this season pillar');
    }
  }

  /**
   * Validate that no duplicate metrics are added to a season area
   */
  static validateNoDuplicateMetrics(
    existingMetricIds: string[],
    newMetricId: string
  ): void {
    if (existingMetricIds.includes(newMetricId)) {
      throw new Error('Metric is already tracking this area of focus');
    }
  }

  /**
   * Calculate next sort order for a collection
   */
  static calculateNextSortOrder(existingSortOrders: number[]): number {
    if (existingSortOrders.length === 0) {
      return 0;
    }

    return Math.max(...existingSortOrders) + 1;
  }

  /**
   * Reorder items by updating sort orders
   */
  static reorderItems<T extends { sortOrder: number; updateSortOrder(order: number): T }>(
    items: T[],
    fromIndex: number,
    toIndex: number
  ): T[] {
    if (fromIndex === toIndex) {
      return items;
    }

    const reorderedItems = [...items];
    const [movedItem] = reorderedItems.splice(fromIndex, 1);
    reorderedItems.splice(toIndex, 0, movedItem);

    // Update sort orders based on new positions
    return reorderedItems.map((item, index) => item.updateSortOrder(index));
  }
}

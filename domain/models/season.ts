/**
 * Domain model for seasons - the main aggregate root
 * 
 * Season represents a time-bounded period where a user focuses on specific goals
 * across different life pillars. It serves as the aggregate root that coordinates
 * all season-related entities and enforces business rules.
 */

// SeasonPriority moved to seasonComposition.ts as PillarTheme

export enum SeasonStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  ARCHIVED = 'archived',
  PAUSED = 'paused',
  CANCELLED = 'cancelled'
}

export class Season {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly name: string,
    public readonly durationWeeks: number | null,
    public readonly status: SeasonStatus,
    public readonly startDate: Date | null,
    public readonly endDate: Date | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {
    this.validateInvariants();
  }

  /**
   * Create a new draft season
   */
  static createDraft(
    userId: string,
    name: string,
    durationWeeks?: number
  ): {
    userId: string;
    name: string;
    durationWeeks: number | null;
    status: SeasonStatus;
    startDate: null;
    endDate: null;
  } {
    this.validateUserId(userId);
    this.validateName(name);
    
    if (durationWeeks !== undefined) {
      this.validateDurationWeeks(durationWeeks);
    }

    return {
      userId,
      name,
      durationWeeks: durationWeeks ?? null,
      status: SeasonStatus.DRAFT,
      startDate: null,
      endDate: null
    };
  }

  /**
   * Reconstruct from database data
   */
  static fromData(data: {
    id: string;
    userId: string;
    name: string;
    durationWeeks: number | null;
    status: string;
    startDate: Date | null;
    endDate: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }): Season {
    const status = this.parseStatus(data.status);

    return new Season(
      data.id,
      data.userId,
      data.name,
      data.durationWeeks,
      status,
      data.startDate,
      data.endDate,
      data.createdAt,
      data.updatedAt
    );
  }

  /**
   * Check if season is in draft status
   */
  isDraft(): boolean {
    return this.status === SeasonStatus.DRAFT;
  }

  /**
   * Check if season is active
   */
  isActive(): boolean {
    return this.status === SeasonStatus.ACTIVE;
  }

  /**
   * Check if season is completed
   */
  isCompleted(): boolean {
    return this.status === SeasonStatus.COMPLETED;
  }

  /**
   * Check if season is paused
   */
  isPaused(): boolean {
    return this.status === SeasonStatus.PAUSED;
  }

  /**
   * Check if season can be started (is draft and user has no other active seasons)
   */
  canBeStarted(): boolean {
    return this.isDraft();
  }

  /**
   * Check if season can be paused (is active)
   */
  canBePaused(): boolean {
    return this.isActive();
  }

  /**
   * Check if season can be resumed (is paused)
   */
  canBeResumed(): boolean {
    return this.isPaused();
  }

  /**
   * Check if season can be completed (is active or paused)
   */
  canBeCompleted(): boolean {
    return this.isActive() || this.isPaused();
  }

  /**
   * Check if season belongs to a specific user
   */
  belongsToUser(userId: string): boolean {
    return this.userId === userId;
  }

  /**
   * Check if season has a defined duration
   */
  hasDuration(): boolean {
    return this.durationWeeks !== null;
  }

  /**
   * Check if season has started
   */
  hasStarted(): boolean {
    return this.startDate !== null;
  }

  /**
   * Check if season has an end date
   */
  hasEndDate(): boolean {
    return this.endDate !== null;
  }

  /**
   * Calculate planned end date based on start date and duration
   */
  getPlannedEndDate(): Date | null {
    if (!this.hasStarted() || !this.hasDuration()) {
      return null;
    }

    const plannedEndDate = new Date(this.startDate!);
    plannedEndDate.setDate(plannedEndDate.getDate() + (this.durationWeeks! * 7));
    return plannedEndDate;
  }

  /**
   * Check if season is overdue (past planned end date but still active/paused)
   */
  isOverdue(): boolean {
    if (this.isCompleted() || !this.hasStarted()) {
      return false;
    }

    const plannedEndDate = this.getPlannedEndDate();
    if (!plannedEndDate) {
      return false;
    }

    return new Date() > plannedEndDate;
  }

  /**
   * Calculate remaining weeks in season
   */
  getRemainingWeeks(): number | null {
    const plannedEndDate = this.getPlannedEndDate();
    if (!plannedEndDate) {
      return null;
    }

    const now = new Date();
    const remainingMs = plannedEndDate.getTime() - now.getTime();
    const remainingDays = Math.ceil(remainingMs / (1000 * 60 * 60 * 24));
    return Math.max(0, Math.ceil(remainingDays / 7));
  }

  /**
   * Start the season
   */
  start(startDate?: Date): Season {
    if (!this.canBeStarted()) {
      throw new Error(`Cannot start season: current status is ${this.status}`);
    }

    const actualStartDate = startDate ?? new Date();
    let calculatedEndDate = null;

    if (this.hasDuration()) {
      calculatedEndDate = new Date(actualStartDate);
      calculatedEndDate.setDate(calculatedEndDate.getDate() + (this.durationWeeks! * 7));
    }

    return new Season(
      this.id,
      this.userId,
      this.name,
      this.durationWeeks,
      SeasonStatus.ACTIVE,
      actualStartDate,
      calculatedEndDate,
      this.createdAt,
      new Date()
    );
  }

  /**
   * Pause the season
   */
  pause(): Season {
    if (!this.canBePaused()) {
      throw new Error(`Cannot pause season: current status is ${this.status}`);
    }

    return new Season(
      this.id,
      this.userId,
      this.name,
      this.durationWeeks,
      SeasonStatus.PAUSED,
      this.startDate,
      this.endDate,
      this.createdAt,
      new Date()
    );
  }

  /**
   * Resume the season
   */
  resume(): Season {
    if (!this.canBeResumed()) {
      throw new Error(`Cannot resume season: current status is ${this.status}`);
    }

    return new Season(
      this.id,
      this.userId,
      this.name,
      this.durationWeeks,
      SeasonStatus.ACTIVE,
      this.startDate,
      this.endDate,
      this.createdAt,
      new Date()
    );
  }

  /**
   * Complete the season
   */
  complete(completionDate?: Date): Season {
    if (!this.canBeCompleted()) {
      throw new Error(`Cannot complete season: current status is ${this.status}`);
    }

    const actualCompletionDate = completionDate ?? new Date();

    return new Season(
      this.id,
      this.userId,
      this.name,
      this.durationWeeks,
      SeasonStatus.COMPLETED,
      this.startDate,
      actualCompletionDate,
      this.createdAt,
      new Date()
    );
  }

  /**
   * Cancel the season
   */
  cancel(): Season {
    if (this.isCompleted()) {
      throw new Error('Cannot cancel a completed season');
    }

    return new Season(
      this.id,
      this.userId,
      this.name,
      this.durationWeeks,
      SeasonStatus.CANCELLED,
      this.startDate,
      this.endDate,
      this.createdAt,
      new Date()
    );
  }

  /**
   * Archive the season
   */
  archive(): Season {
    if (!this.isCompleted() && this.status !== SeasonStatus.CANCELLED) {
      throw new Error('Cannot archive season: must be completed or cancelled first');
    }

    return new Season(
      this.id,
      this.userId,
      this.name,
      this.durationWeeks,
      SeasonStatus.ARCHIVED,
      this.startDate,
      this.endDate,
      this.createdAt,
      new Date()
    );
  }

  /**
   * Update season metadata
   */
  updateMetadata(
    name: string,
    durationWeeks?: number,
    userId?: string
  ): Season {
    if (userId && !this.belongsToUser(userId)) {
      throw new Error('Cannot update season: user does not own this season');
    }

    if (!this.isDraft()) {
      throw new Error('Can only update metadata for draft seasons');
    }

    Season.validateName(name);
    
    if (durationWeeks !== undefined) {
      Season.validateDurationWeeks(durationWeeks);
    }

    return new Season(
      this.id,
      this.userId,
      name,
      durationWeeks ?? this.durationWeeks,
      this.status,
      this.startDate,
      this.endDate,
      this.createdAt,
      new Date()
    );
  }

  private validateInvariants(): void {
    Season.validateSeasonId(this.id);
    Season.validateUserId(this.userId);
    Season.validateName(this.name);
    
    if (this.durationWeeks !== null) {
      Season.validateDurationWeeks(this.durationWeeks);
    }

    // Status-specific validations
    if (this.status === SeasonStatus.ACTIVE && this.startDate === null) {
      throw new Error('Active seasons must have a start date');
    }

    if (this.status === SeasonStatus.COMPLETED && this.endDate === null) {
      throw new Error('Completed seasons must have an end date');
    }

    if (this.startDate !== null && this.endDate !== null && this.startDate >= this.endDate) {
      throw new Error('Start date must be before end date');
    }
  }

  private static validateUserId(userId: string): void {
    if (!userId?.trim()) {
      throw new Error('User ID cannot be empty');
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(userId)) {
      throw new Error('User ID must be a valid UUID');
    }
  }

  private static validateName(name: string): void {
    if (!name?.trim()) {
      throw new Error('Season name cannot be empty');
    }

    if (name.length > 100) {
      throw new Error('Season name cannot exceed 100 characters');
    }

    // Prevent names that might conflict with system operations
    const reservedNames = ['system', 'admin', 'default'];
    if (reservedNames.includes(name.toLowerCase())) {
      throw new Error(`Season name "${name}" is reserved`);
    }
  }

  private static validateDurationWeeks(durationWeeks: number): void {
    if (!Number.isInteger(durationWeeks) || durationWeeks <= 0) {
      throw new Error('Duration must be a positive integer number of weeks');
    }

    if (durationWeeks > 52) {
      throw new Error('Season duration cannot exceed 52 weeks');
    }
  }

  // parsePriority method removed - priority now managed at pillar level

  private static validateSeasonId(seasonId: string): void {
    if (!seasonId?.trim()) {
      throw new Error('Season ID cannot be empty');
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(seasonId)) {
      throw new Error('Season ID must be a valid UUID');
    }
  }

  private static parseStatus(value: string): SeasonStatus {
    const status = value as SeasonStatus;
    if (!Object.values(SeasonStatus).includes(status)) {
      throw new Error(`Invalid season status: ${value}`);
    }
    return status;
  }

}

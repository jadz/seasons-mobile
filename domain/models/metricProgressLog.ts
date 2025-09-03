/**
 * Domain model for metric progress logs - time-series tracking of metric values
 * 
 * MetricProgressLog represents a single measurement/entry for a metric at a specific point in time.
 * Entries can be manual (user-entered), app-calculated, or imported from external sources.
 */

import { MetricUnit } from './metric';

export enum ProgressLogEntryType {
  MANUAL = 'manual',
  APP_CALCULATED = 'app_calculated',
  IMPORTED = 'imported'
}

export class MetricProgressLog {
  constructor(
    public readonly id: string,
    public readonly seasonId: string,
    public readonly metricId: string,
    public readonly userId: string,
    public readonly value: number,
    public readonly unit: MetricUnit,
    public readonly canonicalValue: number, // Value converted to metric's default unit
    public readonly loggedAt: Date,
    public readonly entryType: ProgressLogEntryType,
    public readonly sourceReference: string | null, // Reference to source data (e.g., workout_session_id)
    public readonly notes: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {
    this.validateInvariants();
  }

  /**
   * Create a manual progress log entry
   */
  static createManual(
    seasonId: string,
    metricId: string,
    userId: string,
    value: number,
    unit: MetricUnit,
    canonicalValue: number,
    loggedAt?: Date,
    notes?: string
  ): {
    seasonId: string;
    metricId: string;
    userId: string;
    value: number;
    unit: MetricUnit;
    canonicalValue: number;
    loggedAt: Date;
    entryType: ProgressLogEntryType;
    sourceReference: null;
    notes: string;
  } {
    this.validateSeasonId(seasonId);
    this.validateMetricId(metricId);
    this.validateUserId(userId);
    this.validateValue(value);
    this.validateCanonicalValue(canonicalValue);

    return {
      seasonId,
      metricId,
      userId,
      value,
      unit,
      canonicalValue,
      loggedAt: loggedAt ?? new Date(),
      entryType: ProgressLogEntryType.MANUAL,
      sourceReference: null,
      notes: notes ?? ''
    };
  }

  /**
   * Create an app-calculated progress log entry
   */
  static createAppCalculated(
    seasonId: string,
    metricId: string,
    userId: string,
    value: number,
    unit: MetricUnit,
    canonicalValue: number,
    sourceReference: string,
    loggedAt?: Date,
    notes?: string
  ): {
    seasonId: string;
    metricId: string;
    userId: string;
    value: number;
    unit: MetricUnit;
    canonicalValue: number;
    loggedAt: Date;
    entryType: ProgressLogEntryType;
    sourceReference: string;
    notes: string;
  } {
    this.validateSeasonId(seasonId);
    this.validateMetricId(metricId);
    this.validateUserId(userId);
    this.validateValue(value);
    this.validateCanonicalValue(canonicalValue);
    this.validateSourceReference(sourceReference);

    return {
      seasonId,
      metricId,
      userId,
      value,
      unit,
      canonicalValue,
      loggedAt: loggedAt ?? new Date(),
      entryType: ProgressLogEntryType.APP_CALCULATED,
      sourceReference,
      notes: notes ?? ''
    };
  }

  /**
   * Create an imported progress log entry
   */
  static createImported(
    seasonId: string,
    metricId: string,
    userId: string,
    value: number,
    unit: MetricUnit,
    canonicalValue: number,
    loggedAt: Date,
    sourceReference?: string,
    notes?: string
  ): {
    seasonId: string;
    metricId: string;
    userId: string;
    value: number;
    unit: MetricUnit;
    canonicalValue: number;
    loggedAt: Date;
    entryType: ProgressLogEntryType;
    sourceReference: string | null;
    notes: string;
  } {
    this.validateSeasonId(seasonId);
    this.validateMetricId(metricId);
    this.validateUserId(userId);
    this.validateValue(value);
    this.validateCanonicalValue(canonicalValue);

    return {
      seasonId,
      metricId,
      userId,
      value,
      unit,
      canonicalValue,
      loggedAt,
      entryType: ProgressLogEntryType.IMPORTED,
      sourceReference: sourceReference ?? null,
      notes: notes ?? ''
    };
  }

  /**
   * Reconstruct from database data
   */
  static fromData(data: {
    id: string;
    seasonId: string;
    metricId: string;
    userId: string;
    value: number;
    unit: string;
    canonicalValue: number;
    loggedAt: Date;
    entryType: string;
    sourceReference: string | null;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
  }): MetricProgressLog {
    const unit = this.parseMetricUnit(data.unit);
    const entryType = this.parseEntryType(data.entryType);

    return new MetricProgressLog(
      data.id,
      data.seasonId,
      data.metricId,
      data.userId,
      data.value,
      unit,
      data.canonicalValue,
      data.loggedAt,
      entryType,
      data.sourceReference,
      data.notes,
      data.createdAt,
      data.updatedAt
    );
  }

  /**
   * Check if this is a manual entry
   */
  isManual(): boolean {
    return this.entryType === ProgressLogEntryType.MANUAL;
  }

  /**
   * Check if this is an app-calculated entry
   */
  isAppCalculated(): boolean {
    return this.entryType === ProgressLogEntryType.APP_CALCULATED;
  }

  /**
   * Check if this is an imported entry
   */
  isImported(): boolean {
    return this.entryType === ProgressLogEntryType.IMPORTED;
  }

  /**
   * Check if this entry belongs to a specific user
   */
  belongsToUser(userId: string): boolean {
    return this.userId === userId;
  }

  /**
   * Check if this entry belongs to a specific season
   */
  belongsToSeason(seasonId: string): boolean {
    return this.seasonId === seasonId;
  }

  /**
   * Check if this entry has a source reference
   */
  hasSourceReference(): boolean {
    return this.sourceReference !== null;
  }

  /**
   * Check if this entry was logged today
   */
  isLoggedToday(): boolean {
    const today = new Date();
    const loggedDate = new Date(this.loggedAt);
    
    return loggedDate.toDateString() === today.toDateString();
  }

  /**
   * Check if this entry was logged within the last N days
   */
  isLoggedWithinDays(days: number): boolean {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return this.loggedAt >= cutoffDate;
  }

  /**
   * Update the entry value (only for manual entries)
   */
  updateValue(
    value: number,
    unit: MetricUnit,
    canonicalValue: number,
    userId: string
  ): MetricProgressLog {
    if (!this.belongsToUser(userId)) {
      throw new Error('Cannot update progress log: user does not own this entry');
    }

    if (!this.isManual()) {
      throw new Error('Cannot update value: only manual entries can be modified');
    }

    MetricProgressLog.validateValue(value);
    MetricProgressLog.validateCanonicalValue(canonicalValue);

    return new MetricProgressLog(
      this.id,
      this.seasonId,
      this.metricId,
      this.userId,
      value,
      unit,
      canonicalValue,
      this.loggedAt,
      this.entryType,
      this.sourceReference,
      this.notes,
      this.createdAt,
      new Date()
    );
  }

  /**
   * Update the logged timestamp (only for manual entries)
   */
  updateLoggedAt(loggedAt: Date, userId: string): MetricProgressLog {
    if (!this.belongsToUser(userId)) {
      throw new Error('Cannot update progress log: user does not own this entry');
    }

    if (!this.isManual()) {
      throw new Error('Cannot update logged time: only manual entries can be modified');
    }

    return new MetricProgressLog(
      this.id,
      this.seasonId,
      this.metricId,
      this.userId,
      this.value,
      this.unit,
      this.canonicalValue,
      loggedAt,
      this.entryType,
      this.sourceReference,
      this.notes,
      this.createdAt,
      new Date()
    );
  }

  /**
   * Update notes
   */
  updateNotes(notes: string, userId: string): MetricProgressLog {
    if (!this.belongsToUser(userId)) {
      throw new Error('Cannot update progress log: user does not own this entry');
    }

    if (notes.length > 500) {
      throw new Error('Notes cannot exceed 500 characters');
    }

    return new MetricProgressLog(
      this.id,
      this.seasonId,
      this.metricId,
      this.userId,
      this.value,
      this.unit,
      this.canonicalValue,
      this.loggedAt,
      this.entryType,
      this.sourceReference,
      notes,
      this.createdAt,
      new Date()
    );
  }

  /**
   * Create a copy of this entry with a different logged date (for corrections)
   */
  copyWithNewDate(loggedAt: Date, userId: string): {
    seasonId: string;
    metricId: string;
    userId: string;
    value: number;
    unit: MetricUnit;
    canonicalValue: number;
    loggedAt: Date;
    entryType: ProgressLogEntryType;
    sourceReference: string | null;
    notes: string;
  } {
    if (!this.belongsToUser(userId)) {
      throw new Error('Cannot copy progress log: user does not own this entry');
    }

    return {
      seasonId: this.seasonId,
      metricId: this.metricId,
      userId: this.userId,
      value: this.value,
      unit: this.unit,
      canonicalValue: this.canonicalValue,
      loggedAt,
      entryType: this.entryType,
      sourceReference: this.sourceReference,
      notes: this.notes
    };
  }

  private validateInvariants(): void {
    MetricProgressLog.validateSeasonId(this.seasonId);
    MetricProgressLog.validateMetricId(this.metricId);
    MetricProgressLog.validateUserId(this.userId);
    MetricProgressLog.validateValue(this.value);
    MetricProgressLog.validateCanonicalValue(this.canonicalValue);

    if (this.notes.length > 500) {
      throw new Error('Notes cannot exceed 500 characters');
    }

    // App-calculated entries should have a source reference
    if (this.entryType === ProgressLogEntryType.APP_CALCULATED && !this.sourceReference) {
      throw new Error('App-calculated entries must have a source reference');
    }

    // Logged date cannot be in the future
    if (this.loggedAt > new Date()) {
      throw new Error('Logged date cannot be in the future');
    }
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

  private static validateMetricId(metricId: string): void {
    if (!metricId?.trim()) {
      throw new Error('Metric ID cannot be empty');
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(metricId)) {
      throw new Error('Metric ID must be a valid UUID');
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

  private static validateValue(value: number): void {
    if (!Number.isFinite(value)) {
      throw new Error('Value must be a finite number');
    }

    if (value < 0) {
      throw new Error('Value cannot be negative');
    }
  }

  private static validateCanonicalValue(canonicalValue: number): void {
    if (!Number.isFinite(canonicalValue)) {
      throw new Error('Canonical value must be a finite number');
    }

    if (canonicalValue < 0) {
      throw new Error('Canonical value cannot be negative');
    }
  }

  private static validateSourceReference(sourceReference: string): void {
    if (!sourceReference?.trim()) {
      throw new Error('Source reference cannot be empty for app-calculated entries');
    }

    if (sourceReference.length > 200) {
      throw new Error('Source reference cannot exceed 200 characters');
    }
  }

  private static parseMetricUnit(value: string): MetricUnit {
    const unit = value as MetricUnit;
    if (!Object.values(MetricUnit).includes(unit)) {
      throw new Error(`Invalid metric unit: ${value}`);
    }
    return unit;
  }

  private static parseEntryType(value: string): ProgressLogEntryType {
    const entryType = value as ProgressLogEntryType;
    if (!Object.values(ProgressLogEntryType).includes(entryType)) {
      throw new Error(`Invalid entry type: ${value}`);
    }
    return entryType;
  }
}

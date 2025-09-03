/**
 * Domain model for metric goals - specific targets for metrics within seasons
 * 
 * MetricGoal is a value object representing a target value for a specific metric.
 * It includes both the user's preferred unit and a canonical value for comparison.
 */

import { MetricUnit } from './metric';

export class MetricGoal {
  constructor(
    public readonly id: string,
    public readonly seasonAreaMetricId: string,
    public readonly goalValue: number,
    public readonly goalUnit: MetricUnit,
    public readonly canonicalValue: number, // Value converted to metric's default unit
    public readonly startValue: number | null,
    public readonly startUnit: MetricUnit | null,
    public readonly targetDate: Date | null,
    public readonly isAchieved: boolean,
    public readonly achievedAt: Date | null,
    public readonly notes: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {
    this.validateInvariants();
  }

  /**
   * Create a new metric goal
   */
  static create(
    seasonAreaMetricId: string,
    goalValue: number,
    goalUnit: MetricUnit,
    canonicalValue: number,
    startValue?: number,
    startUnit?: MetricUnit,
    targetDate?: Date,
    notes?: string
  ): {
    seasonAreaMetricId: string;
    goalValue: number;
    goalUnit: MetricUnit;
    canonicalValue: number;
    startValue: number | null;
    startUnit: MetricUnit | null;
    targetDate: Date | null;
    isAchieved: boolean;
    achievedAt: null;
    notes: string;
  } {
    this.validateSeasonAreaMetricId(seasonAreaMetricId);
    this.validateGoalValue(goalValue);
    this.validateCanonicalValue(canonicalValue);
    
    if (startValue !== undefined) {
      this.validateStartValue(startValue);
    }

    if (startValue !== undefined && startUnit === undefined) {
      throw new Error('Start unit must be provided when start value is specified');
    }

    if (startValue === undefined && startUnit !== undefined) {
      throw new Error('Start value must be provided when start unit is specified');
    }

    return {
      seasonAreaMetricId,
      goalValue,
      goalUnit,
      canonicalValue,
      startValue: startValue ?? null,
      startUnit: startUnit ?? null,
      targetDate: targetDate ?? null,
      isAchieved: false,
      achievedAt: null,
      notes: notes ?? ''
    };
  }

  /**
   * Reconstruct from database data
   */
  static fromData(data: {
    id: string;
    seasonAreaMetricId: string;
    goalValue: number;
    goalUnit: string;
    canonicalValue: number;
    startValue: number | null;
    startUnit: string | null;
    targetDate: Date | null;
    isAchieved: boolean;
    achievedAt: Date | null;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
  }): MetricGoal {
    const goalUnit = this.parseMetricUnit(data.goalUnit);
    const startUnit = data.startUnit ? this.parseMetricUnit(data.startUnit) : null;

    return new MetricGoal(
      data.id,
      data.seasonAreaMetricId,
      data.goalValue,
      goalUnit,
      data.canonicalValue,
      data.startValue,
      startUnit,
      data.targetDate,
      data.isAchieved,
      data.achievedAt,
      data.notes,
      data.createdAt,
      data.updatedAt
    );
  }

  /**
   * Check if this goal has a baseline/starting value
   */
  hasStartingValue(): boolean {
    return this.startValue !== null && this.startUnit !== null;
  }

  /**
   * Check if this goal has a target deadline
   */
  hasTargetDate(): boolean {
    return this.targetDate !== null;
  }

  /**
   * Check if the target date has passed
   */
  isOverdue(): boolean {
    if (!this.hasTargetDate() || this.isAchieved) {
      return false;
    }

    return this.targetDate! < new Date();
  }

  /**
   * Calculate progress toward goal (requires current value)
   */
  calculateProgress(currentValue: number, currentUnit: MetricUnit, canonicalCurrentValue: number): number {
    if (!this.hasStartingValue()) {
      // Without starting value, can only calculate based on distance to goal
      const remaining = Math.abs(this.canonicalValue - canonicalCurrentValue);
      const total = Math.abs(this.canonicalValue);
      return total > 0 ? Math.max(0, (total - remaining) / total) : 0;
    }

    // With starting value, calculate progress as percentage of journey completed
    const totalDistance = Math.abs(this.canonicalValue - this.startValue!);
    const progressDistance = Math.abs(canonicalCurrentValue - this.startValue!);
    
    if (totalDistance === 0) {
      return this.isAchieved ? 1 : 0;
    }

    return Math.min(1, progressDistance / totalDistance);
  }

  /**
   * Check if a current value achieves this goal
   */
  isAchievedBy(currentCanonicalValue: number): boolean {
    // Determine if goal is increase or decrease based on start value
    if (this.hasStartingValue()) {
      const isIncreaseGoal = this.canonicalValue > this.startValue!;
      return isIncreaseGoal 
        ? currentCanonicalValue >= this.canonicalValue
        : currentCanonicalValue <= this.canonicalValue;
    }

    // Without start value, assume exact match or greater (for most metrics)
    return currentCanonicalValue >= this.canonicalValue;
  }

  /**
   * Mark goal as achieved
   */
  markAsAchieved(): MetricGoal {
    if (this.isAchieved) {
      return this; // Already achieved
    }

    return new MetricGoal(
      this.id,
      this.seasonAreaMetricId,
      this.goalValue,
      this.goalUnit,
      this.canonicalValue,
      this.startValue,
      this.startUnit,
      this.targetDate,
      true,
      new Date(),
      this.notes,
      this.createdAt,
      new Date()
    );
  }

  /**
   * Mark goal as not achieved (reset)
   */
  markAsNotAchieved(): MetricGoal {
    if (!this.isAchieved) {
      return this; // Already not achieved
    }

    return new MetricGoal(
      this.id,
      this.seasonAreaMetricId,
      this.goalValue,
      this.goalUnit,
      this.canonicalValue,
      this.startValue,
      this.startUnit,
      this.targetDate,
      false,
      null,
      this.notes,
      this.createdAt,
      new Date()
    );
  }

  /**
   * Update goal values
   */
  updateGoal(
    goalValue: number,
    goalUnit: MetricUnit,
    canonicalValue: number,
    targetDate?: Date,
    notes?: string
  ): MetricGoal {
    MetricGoal.validateGoalValue(goalValue);
    MetricGoal.validateCanonicalValue(canonicalValue);

    return new MetricGoal(
      this.id,
      this.seasonAreaMetricId,
      goalValue,
      goalUnit,
      canonicalValue,
      this.startValue,
      this.startUnit,
      targetDate ?? this.targetDate,
      this.isAchieved,
      this.achievedAt,
      notes ?? this.notes,
      this.createdAt,
      new Date()
    );
  }

  /**
   * Update starting baseline values
   */
  updateStartingValue(
    startValue: number,
    startUnit: MetricUnit,
    canonicalStartValue: number
  ): MetricGoal {
    MetricGoal.validateStartValue(startValue);

    return new MetricGoal(
      this.id,
      this.seasonAreaMetricId,
      this.goalValue,
      this.goalUnit,
      this.canonicalValue,
      startValue,
      startUnit,
      this.targetDate,
      this.isAchieved,
      this.achievedAt,
      this.notes,
      this.createdAt,
      new Date()
    );
  }

  /**
   * Update notes
   */
  updateNotes(notes: string): MetricGoal {
    return new MetricGoal(
      this.id,
      this.seasonAreaMetricId,
      this.goalValue,
      this.goalUnit,
      this.canonicalValue,
      this.startValue,
      this.startUnit,
      this.targetDate,
      this.isAchieved,
      this.achievedAt,
      notes,
      this.createdAt,
      new Date()
    );
  }

  private validateInvariants(): void {
    MetricGoal.validateSeasonAreaMetricId(this.seasonAreaMetricId);
    MetricGoal.validateGoalValue(this.goalValue);
    MetricGoal.validateCanonicalValue(this.canonicalValue);

    if (this.startValue !== null) {
      MetricGoal.validateStartValue(this.startValue);
    }

    if (this.startValue !== null && this.startUnit === null) {
      throw new Error('Start unit must be provided when start value is specified');
    }

    if (this.startValue === null && this.startUnit !== null) {
      throw new Error('Start value must be provided when start unit is specified');
    }

    if (this.isAchieved && this.achievedAt === null) {
      throw new Error('Achieved date must be set when goal is marked as achieved');
    }

    if (!this.isAchieved && this.achievedAt !== null) {
      throw new Error('Achieved date cannot be set when goal is not achieved');
    }

    if (this.notes.length > 500) {
      throw new Error('Goal notes cannot exceed 500 characters');
    }
  }

  private static validateSeasonAreaMetricId(seasonAreaMetricId: string): void {
    if (!seasonAreaMetricId?.trim()) {
      throw new Error('Season area metric ID cannot be empty');
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(seasonAreaMetricId)) {
      throw new Error('Season area metric ID must be a valid UUID');
    }
  }

  private static validateGoalValue(goalValue: number): void {
    if (!Number.isFinite(goalValue)) {
      throw new Error('Goal value must be a finite number');
    }

    if (goalValue < 0) {
      throw new Error('Goal value cannot be negative');
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

  private static validateStartValue(startValue: number): void {
    if (!Number.isFinite(startValue)) {
      throw new Error('Start value must be a finite number');
    }

    if (startValue < 0) {
      throw new Error('Start value cannot be negative');
    }
  }

  private static parseMetricUnit(value: string): MetricUnit {
    const unit = value as MetricUnit;
    if (!Object.values(MetricUnit).includes(unit)) {
      throw new Error(`Invalid metric unit: ${value}`);
    }
    return unit;
  }
}

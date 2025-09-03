/**
 * View types for season creation and management
 * 
 * These types define the data structures returned by the SeasonCreationService
 * and include related entity data for comprehensive UI support.
 */

import { SeasonStatus } from '../models/season';
import { PillarName } from '../models/pillar';
import { AreaOfFocusType } from '../models/areaOfFocus';
import { MetricType, MetricUnitType, MetricUnit, MetricDataType } from '../models/metric';

// Base view types for individual entities
export interface SeasonView {
  id: string;
  userId: string;
  name: string;
  durationWeeks: number | null;
  status: SeasonStatus;
  startDate: Date | null;
  endDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PillarView {
  id: string;
  name: PillarName;
  displayName: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AreaOfFocusView {
  id: string;
  name: string;
  description: string;
  pillarId: string;
  userId: string | null;
  type: AreaOfFocusType;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MetricView {
  id: string;
  name: string;
  description: string;
  unitType: MetricUnitType;
  defaultUnit: MetricUnit;
  alternativeUnits: MetricUnit[];
  dataType: MetricDataType;
  type: MetricType;
  userId: string | null;
  calculationMethod: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SeasonPillarView {
  id: string;
  seasonId: string;
  pillarId: string;
  theme: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
}

export interface SeasonPillarAreaView {
  id: string;
  seasonPillarId: string;
  areaOfFocusId: string;
  sortOrder: number;
  createdAt: Date;
}

export interface SeasonAreaMetricView {
  id: string;
  seasonPillarAreaId: string;
  metricId: string;
  sortOrder: number;
  createdAt: Date;
}

export interface MetricGoalView {
  id: string;
  seasonAreaMetricId: string;
  goalValue: number;
  goalUnit: MetricUnit;
  canonicalValue: number;
  startValue: number | null;
  startUnit: MetricUnit | null;
  targetDate: Date | null;
  isAchieved: boolean;
  achievedAt: Date | null;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

// Composite view types for complex data structures
export interface SeasonAreaMetricWithGoalView extends SeasonAreaMetricView {
  metric: MetricView;
  goal?: MetricGoalView;
}

export interface SeasonPillarAreaWithMetricsView extends SeasonPillarAreaView {
  areaOfFocus: AreaOfFocusView;
  metrics: SeasonAreaMetricWithGoalView[];
}

export interface SeasonPillarWithAreasView extends SeasonPillarView {
  pillar: PillarView;
  areas: SeasonPillarAreaWithMetricsView[];
}

export interface SeasonCreationView {
  season: SeasonView;
  pillars: SeasonPillarWithAreasView[];
}

// Data types for repository operations (no ID, timestamps)
export interface SeasonData {
  userId: string;
  name: string;
  durationWeeks: number | null;
  status: SeasonStatus;
  startDate: Date | null;
  endDate: Date | null;
}

export interface SeasonPillarData {
  seasonId: string;
  pillarId: string;
  theme: string;
  isActive: boolean;
  sortOrder: number;
}

export interface SeasonPillarAreaData {
  seasonPillarId: string;
  areaOfFocusId: string;
  sortOrder: number;
}

export interface SeasonAreaMetricData {
  seasonPillarAreaId: string;
  metricId: string;
  sortOrder: number;
}

export interface MetricGoalData {
  seasonAreaMetricId: string;
  goalValue: number;
  goalUnit: MetricUnit;
  canonicalValue: number;
  startValue: number | null;
  startUnit: MetricUnit | null;
  targetDate: Date | null;
  isAchieved: boolean;
  achievedAt: Date | null;
  notes: string;
}

// Update types for partial updates
export interface SeasonUpdate {
  name?: string;
  durationWeeks?: number | null;
}

export interface SeasonPillarUpdate {
  theme?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface MetricGoalUpdate {
  goalValue?: number;
  goalUnit?: MetricUnit;
  canonicalValue?: number;
  startValue?: number | null;
  startUnit?: MetricUnit | null;
  targetDate?: Date | null;
  notes?: string;
}

// Input types for service operations
export interface CreateSeasonRequest {
  userId: string;
  name: string;
  durationWeeks?: number;
}

export interface AddPillarToSeasonRequest {
  seasonId: string;
  pillarId: string;
  theme: string;
}

export interface AddAreaToSeasonPillarRequest {
  seasonPillarId: string;
  areaOfFocusId: string;
}

export interface AddMetricToSeasonAreaRequest {
  seasonPillarAreaId: string;
  metricId: string;
  baseline?: {
    value: number;
    unit: MetricUnit;
  };
  target?: {
    value: number;
    unit: MetricUnit;
    targetDate?: Date;
  };
  notes?: string;
}

import { supabase } from '../../utils/supabase';
import { MetricUnit } from '../../domain/models/metric';
import {
  MetricGoalView,
  MetricGoalData,
  MetricGoalUpdate
} from '../../domain/views/seasonViews';

/**
 * Repository interface for metric goal persistence
 */
export interface IMetricGoalRepository {
  /**
   * Create new metric goal
   * @param goalData The goal data to create
   * @returns The generated goal ID
   */
  create(goalData: MetricGoalData): Promise<string>;

  /**
   * Find metric goal by ID
   * @param goalId The goal ID
   * @returns The goal or null if not found
   */
  findById(goalId: string): Promise<MetricGoalView | null>;

  /**
   * Find metric goal by season area metric ID
   * @param seasonAreaMetricId The season area metric ID
   * @returns The goal or null if not found
   */
  findBySeasonAreaMetricId(seasonAreaMetricId: string): Promise<MetricGoalView | null>;

  /**
   * Update existing metric goal
   * @param goalId The goal ID
   * @param updateData The data to update
   * @throws Error if goal not found
   */
  update(goalId: string, updateData: MetricGoalUpdate): Promise<void>;

  /**
   * Delete metric goal
   * @param goalId The goal ID
   * @throws Error if goal not found
   */
  delete(goalId: string): Promise<void>;

  /**
   * Mark goal as achieved
   * @param goalId The goal ID
   * @param achievedAt The achievement date
   */
  markAsAchieved(goalId: string, achievedAt?: Date): Promise<void>;

  /**
   * Mark goal as not achieved
   * @param goalId The goal ID
   */
  markAsNotAchieved(goalId: string): Promise<void>;
}

/**
 * Supabase implementation of metric goal repository
 */
class MetricGoalRepository implements IMetricGoalRepository {
  async create(goalData: MetricGoalData): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('season_metric_goals')
        .insert({
          season_area_metric_id: goalData.seasonAreaMetricId,
          goal_value: goalData.goalValue,
          goal_unit: goalData.goalUnit,
          canonical_value: goalData.canonicalValue,
          start_value: goalData.startValue,
          start_unit: goalData.startUnit,
          target_date: goalData.targetDate,
          is_achieved: goalData.isAchieved,
          achieved_at: goalData.achievedAt,
          notes: goalData.notes,
        })
        .select('id')
        .single();

      if (error) {
        throw new Error(`Error creating metric goal: ${error.message}`);
      }

      return data.id;
    } catch (error) {
      console.error('Error in create:', error);
      throw error;
    }
  }

  async findById(goalId: string): Promise<MetricGoalView | null> {
    try {
      const { data, error } = await supabase
        .from('season_metric_goals')
        .select('*')
        .eq('id', goalId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') { // No rows returned
          return null;
        }
        throw new Error(`Error finding metric goal: ${error.message}`);
      }

      return this.mapToMetricGoalView(data);
    } catch (error) {
      console.error('Error in findById:', error);
      throw error;
    }
  }

  async findBySeasonAreaMetricId(seasonAreaMetricId: string): Promise<MetricGoalView | null> {
    try {
      const { data, error } = await supabase
        .from('season_metric_goals')
        .select('*')
        .eq('season_area_metric_id', seasonAreaMetricId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') { // No rows returned
          return null;
        }
        throw new Error(`Error finding metric goal: ${error.message}`);
      }

      return this.mapToMetricGoalView(data);
    } catch (error) {
      console.error('Error in findBySeasonAreaMetricId:', error);
      throw error;
    }
  }

  async update(goalId: string, updateData: MetricGoalUpdate): Promise<void> {
    try {
      const updateFields: any = {};
      
      if (updateData.goalValue !== undefined) {
        updateFields.goal_value = updateData.goalValue;
      }
      if (updateData.goalUnit !== undefined) {
        updateFields.goal_unit = updateData.goalUnit;
      }
      if (updateData.canonicalValue !== undefined) {
        updateFields.canonical_value = updateData.canonicalValue;
      }
      if (updateData.startValue !== undefined) {
        updateFields.start_value = updateData.startValue;
      }
      if (updateData.startUnit !== undefined) {
        updateFields.start_unit = updateData.startUnit;
      }
      if (updateData.targetDate !== undefined) {
        updateFields.target_date = updateData.targetDate;
      }
      if (updateData.notes !== undefined) {
        updateFields.notes = updateData.notes;
      }

      updateFields.updated_at = new Date().toISOString();

      const { error } = await supabase
        .from('season_metric_goals')
        .update(updateFields)
        .eq('id', goalId);

      if (error) {
        throw new Error(`Error updating metric goal: ${error.message}`);
      }
    } catch (error) {
      console.error('Error in update:', error);
      throw error;
    }
  }

  async delete(goalId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('season_metric_goals')
        .delete()
        .eq('id', goalId);

      if (error) {
        throw new Error(`Error deleting metric goal: ${error.message}`);
      }
    } catch (error) {
      console.error('Error in delete:', error);
      throw error;
    }
  }

  async markAsAchieved(goalId: string, achievedAt?: Date): Promise<void> {
    try {
      const { error } = await supabase
        .from('season_metric_goals')
        .update({
          is_achieved: true,
          achieved_at: (achievedAt || new Date()).toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', goalId);

      if (error) {
        throw new Error(`Error marking goal as achieved: ${error.message}`);
      }
    } catch (error) {
      console.error('Error in markAsAchieved:', error);
      throw error;
    }
  }

  async markAsNotAchieved(goalId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('season_metric_goals')
        .update({
          is_achieved: false,
          achieved_at: null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', goalId);

      if (error) {
        throw new Error(`Error marking goal as not achieved: ${error.message}`);
      }
    } catch (error) {
      console.error('Error in markAsNotAchieved:', error);
      throw error;
    }
  }

  private mapToMetricGoalView(row: any): MetricGoalView {
    return {
      id: row.id,
      seasonAreaMetricId: row.season_area_metric_id,
      goalValue: row.goal_value,
      goalUnit: row.goal_unit as MetricUnit,
      canonicalValue: row.canonical_value,
      startValue: row.start_value,
      startUnit: row.start_unit as MetricUnit | null,
      targetDate: row.target_date ? new Date(row.target_date) : null,
      isAchieved: row.is_achieved,
      achievedAt: row.achieved_at ? new Date(row.achieved_at) : null,
      notes: row.notes,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }
}

// Export singleton instance
export const metricGoalRepository = new MetricGoalRepository();
export { MetricGoalRepository };

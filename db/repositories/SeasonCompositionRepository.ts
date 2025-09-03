import { supabase } from '../../utils/supabase';
import {
  SeasonPillarView,
  SeasonPillarAreaView,
  SeasonAreaMetricView,
  SeasonPillarData,
  SeasonPillarAreaData,
  SeasonAreaMetricData,
  SeasonPillarUpdate
} from '../../domain/views/seasonViews';

/**
 * Repository interface for season composition persistence
 * Manages the relationships between seasons, pillars, areas, and metrics
 */
export interface ISeasonCompositionRepository {
  /**
   * Create season pillar relationship
   * @param data The season pillar data
   * @returns The generated season pillar ID
   */
  createSeasonPillar(data: SeasonPillarData): Promise<string>;

  /**
   * Create season pillar area relationship
   * @param data The season pillar area data
   * @returns The generated season pillar area ID
   */
  createSeasonPillarArea(data: SeasonPillarAreaData): Promise<string>;

  /**
   * Create season area metric relationship
   * @param data The season area metric data
   * @returns The generated season area metric ID
   */
  createSeasonAreaMetric(data: SeasonAreaMetricData): Promise<string>;

  /**
   * Find all season pillars for a season
   * @param seasonId The season ID
   * @returns Array of season pillars
   */
  findSeasonPillarsBySeasonId(seasonId: string): Promise<SeasonPillarView[]>;

  /**
   * Find all areas for a season pillar
   * @param seasonPillarId The season pillar ID
   * @returns Array of season pillar areas
   */
  findSeasonPillarAreasBySeasonPillarId(seasonPillarId: string): Promise<SeasonPillarAreaView[]>;

  /**
   * Find all metrics for a season pillar area
   * @param seasonPillarAreaId The season pillar area ID
   * @returns Array of season area metrics
   */
  findSeasonAreaMetricsBySeasonPillarAreaId(seasonPillarAreaId: string): Promise<SeasonAreaMetricView[]>;

  /**
   * Update season pillar
   * @param seasonPillarId The season pillar ID
   * @param updateData The data to update
   */
  updateSeasonPillar(seasonPillarId: string, updateData: SeasonPillarUpdate): Promise<void>;

  /**
   * Delete season pillar and all dependent entities
   * @param seasonPillarId The season pillar ID
   */
  deleteSeasonPillar(seasonPillarId: string): Promise<void>;

  /**
   * Delete season pillar area and all dependent entities
   * @param seasonPillarAreaId The season pillar area ID
   */
  deleteSeasonPillarArea(seasonPillarAreaId: string): Promise<void>;

  /**
   * Delete season area metric and all dependent entities
   * @param seasonAreaMetricId The season area metric ID
   */
  deleteSeasonAreaMetric(seasonAreaMetricId: string): Promise<void>;
}

/**
 * Supabase implementation of season composition repository
 */
class SeasonCompositionRepository implements ISeasonCompositionRepository {
  async createSeasonPillar(data: SeasonPillarData): Promise<string> {
    try {
      const { data: result, error } = await supabase
        .from('season_pillars')
        .insert({
          season_id: data.seasonId,
          pillar_id: data.pillarId,
          theme: data.theme,
          is_active: data.isActive,
          sort_order: data.sortOrder,
        })
        .select('id')
        .single();

      if (error) {
        throw new Error(`Error creating season pillar: ${error.message}`);
      }

      return result.id;
    } catch (error) {
      console.error('Error in createSeasonPillar:', error);
      throw error;
    }
  }

  async createSeasonPillarArea(data: SeasonPillarAreaData): Promise<string> {
    try {
      const { data: result, error } = await supabase
        .from('season_pillar_areas')
        .insert({
          season_pillar_id: data.seasonPillarId,
          area_of_focus_id: data.areaOfFocusId,
          sort_order: data.sortOrder,
        })
        .select('id')
        .single();

      if (error) {
        throw new Error(`Error creating season pillar area: ${error.message}`);
      }

      return result.id;
    } catch (error) {
      console.error('Error in createSeasonPillarArea:', error);
      throw error;
    }
  }

  async createSeasonAreaMetric(data: SeasonAreaMetricData): Promise<string> {
    try {
      const { data: result, error } = await supabase
        .from('season_area_metrics')
        .insert({
          season_pillar_area_id: data.seasonPillarAreaId,
          metric_id: data.metricId,
          sort_order: data.sortOrder,
        })
        .select('id')
        .single();

      if (error) {
        throw new Error(`Error creating season area metric: ${error.message}`);
      }

      return result.id;
    } catch (error) {
      console.error('Error in createSeasonAreaMetric:', error);
      throw error;
    }
  }

  async findSeasonPillarsBySeasonId(seasonId: string): Promise<SeasonPillarView[]> {
    try {
      const { data, error } = await supabase
        .from('season_pillars')
        .select('*')
        .eq('season_id', seasonId)
        .order('sort_order', { ascending: true });

      if (error) {
        throw new Error(`Error finding season pillars: ${error.message}`);
      }

      return data.map(row => this.mapToSeasonPillarView(row));
    } catch (error) {
      console.error('Error in findSeasonPillarsBySeasonId:', error);
      throw error;
    }
  }

  async findSeasonPillarAreasBySeasonPillarId(seasonPillarId: string): Promise<SeasonPillarAreaView[]> {
    try {
      const { data, error } = await supabase
        .from('season_pillar_areas')
        .select('*')
        .eq('season_pillar_id', seasonPillarId)
        .order('sort_order', { ascending: true });

      if (error) {
        throw new Error(`Error finding season pillar areas: ${error.message}`);
      }

      return data.map(row => this.mapToSeasonPillarAreaView(row));
    } catch (error) {
      console.error('Error in findSeasonPillarAreasBySeasonPillarId:', error);
      throw error;
    }
  }

  async findSeasonAreaMetricsBySeasonPillarAreaId(seasonPillarAreaId: string): Promise<SeasonAreaMetricView[]> {
    try {
      const { data, error } = await supabase
        .from('season_area_metrics')
        .select('*')
        .eq('season_pillar_area_id', seasonPillarAreaId)
        .order('sort_order', { ascending: true });

      if (error) {
        throw new Error(`Error finding season area metrics: ${error.message}`);
      }

      return data.map(row => this.mapToSeasonAreaMetricView(row));
    } catch (error) {
      console.error('Error in findSeasonAreaMetricsBySeasonPillarAreaId:', error);
      throw error;
    }
  }

  async updateSeasonPillar(seasonPillarId: string, updateData: SeasonPillarUpdate): Promise<void> {
    try {
      const updateFields: any = {};
      
      if (updateData.theme !== undefined) {
        updateFields.theme = updateData.theme;
      }
      if (updateData.isActive !== undefined) {
        updateFields.is_active = updateData.isActive;
      }
      if (updateData.sortOrder !== undefined) {
        updateFields.sort_order = updateData.sortOrder;
      }

      const { error } = await supabase
        .from('season_pillars')
        .update(updateFields)
        .eq('id', seasonPillarId);

      if (error) {
        throw new Error(`Error updating season pillar: ${error.message}`);
      }
    } catch (error) {
      console.error('Error in updateSeasonPillar:', error);
      throw error;
    }
  }

  async deleteSeasonPillar(seasonPillarId: string): Promise<void> {
    try {
      // Delete in order: metrics -> areas -> pillar
      // First get all areas for this pillar
      const areas = await this.findSeasonPillarAreasBySeasonPillarId(seasonPillarId);
      
      // Delete all metrics for each area
      for (const area of areas) {
        const metrics = await this.findSeasonAreaMetricsBySeasonPillarAreaId(area.id);
        for (const metric of metrics) {
          await this.deleteSeasonAreaMetric(metric.id);
        }
        await this.deleteSeasonPillarArea(area.id);
      }

      // Finally delete the pillar
      const { error } = await supabase
        .from('season_pillars')
        .delete()
        .eq('id', seasonPillarId);

      if (error) {
        throw new Error(`Error deleting season pillar: ${error.message}`);
      }
    } catch (error) {
      console.error('Error in deleteSeasonPillar:', error);
      throw error;
    }
  }

  async deleteSeasonPillarArea(seasonPillarAreaId: string): Promise<void> {
    try {
      // First delete all metrics for this area
      const metrics = await this.findSeasonAreaMetricsBySeasonPillarAreaId(seasonPillarAreaId);
      for (const metric of metrics) {
        await this.deleteSeasonAreaMetric(metric.id);
      }

      // Then delete the area
      const { error } = await supabase
        .from('season_pillar_areas')
        .delete()
        .eq('id', seasonPillarAreaId);

      if (error) {
        throw new Error(`Error deleting season pillar area: ${error.message}`);
      }
    } catch (error) {
      console.error('Error in deleteSeasonPillarArea:', error);
      throw error;
    }
  }

  async deleteSeasonAreaMetric(seasonAreaMetricId: string): Promise<void> {
    try {
              // First delete any associated metric goals
        const { error: goalError } = await supabase
          .from('season_metric_goals')
        .delete()
        .eq('season_area_metric_id', seasonAreaMetricId);

      if (goalError) {
        throw new Error(`Error deleting metric goals: ${goalError.message}`);
      }

      // Then delete the season area metric
      const { error } = await supabase
        .from('season_area_metrics')
        .delete()
        .eq('id', seasonAreaMetricId);

      if (error) {
        throw new Error(`Error deleting season area metric: ${error.message}`);
      }
    } catch (error) {
      console.error('Error in deleteSeasonAreaMetric:', error);
      throw error;
    }
  }

  private mapToSeasonPillarView(row: any): SeasonPillarView {
    return {
      id: row.id,
      seasonId: row.season_id,
      pillarId: row.pillar_id,
      theme: row.theme,
      isActive: row.is_active,
      sortOrder: row.sort_order,
      createdAt: new Date(row.created_at),
    };
  }

  private mapToSeasonPillarAreaView(row: any): SeasonPillarAreaView {
    return {
      id: row.id,
      seasonPillarId: row.season_pillar_id,
      areaOfFocusId: row.area_of_focus_id,
      sortOrder: row.sort_order,
      createdAt: new Date(row.created_at),
    };
  }

  private mapToSeasonAreaMetricView(row: any): SeasonAreaMetricView {
    return {
      id: row.id,
      seasonPillarAreaId: row.season_pillar_area_id,
      metricId: row.metric_id,
      sortOrder: row.sort_order,
      createdAt: new Date(row.created_at),
    };
  }
}

// Export singleton instance
export const seasonCompositionRepository = new SeasonCompositionRepository();
export { SeasonCompositionRepository };

import { supabase } from '../../utils/supabase';
import { MetricType, MetricUnitType, MetricUnit, MetricDataType } from '../../domain/models/metric';
import { MetricView } from '../../domain/views/seasonViews';

/**
 * Repository interface for metric persistence
 */
export interface IMetricRepository {
  /**
   * Find metric by ID
   * @param metricId The metric ID
   * @returns The metric or null if not found
   */
  findById(metricId: string): Promise<MetricView | null>;

  /**
   * Find metrics accessible to a user (predefined + app-calculated + user-created)
   * @param userId The user ID
   * @param unitType Optional unit type to filter by
   * @returns Array of accessible metrics
   */
  findAccessibleToUser(userId: string, unitType?: MetricUnitType): Promise<MetricView[]>;

  /**
   * Find predefined metrics
   * @param unitType Optional unit type to filter by
   * @returns Array of predefined metrics
   */
  findPredefined(unitType?: MetricUnitType): Promise<MetricView[]>;

  /**
   * Find app-calculated metrics
   * @param unitType Optional unit type to filter by
   * @returns Array of app-calculated metrics
   */
  findAppCalculated(unitType?: MetricUnitType): Promise<MetricView[]>;

  /**
   * Find user-created metrics
   * @param userId The user ID
   * @param unitType Optional unit type to filter by
   * @returns Array of user-created metrics
   */
  findByUser(userId: string, unitType?: MetricUnitType): Promise<MetricView[]>;
}

/**
 * Supabase implementation of metric repository
 */
class MetricRepository implements IMetricRepository {
  async findById(metricId: string): Promise<MetricView | null> {
    try {
      const { data, error } = await supabase
        .from('metrics')
        .select('*')
        .eq('id', metricId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') { // No rows returned
          return null;
        }
        throw new Error(`Error finding metric: ${error.message}`);
      }

      return this.mapToMetricView(data);
    } catch (error) {
      console.error('Error in findById:', error);
      throw error;
    }
  }

  async findAccessibleToUser(userId: string, unitType?: MetricUnitType): Promise<MetricView[]> {
    try {
      let query = supabase
        .from('metrics')
        .select('*')
        .eq('is_active', true);

      // Filter by unit type if specified
      if (unitType) {
        query = query.eq('unit_type', unitType);
      }

      // Get predefined, app-calculated, and user's own metrics
      query = query.or(`metric_type.eq.${MetricType.PREDEFINED},metric_type.eq.${MetricType.APP_CALCULATED},user_id.eq.${userId}`);
      query = query.order('name', { ascending: true });

      const { data, error } = await query;

      if (error) {
        throw new Error(`Error finding accessible metrics: ${error.message}`);
      }

      return data.map(row => this.mapToMetricView(row));
    } catch (error) {
      console.error('Error in findAccessibleToUser:', error);
      throw error;
    }
  }

  async findPredefined(unitType?: MetricUnitType): Promise<MetricView[]> {
    try {
      let query = supabase
        .from('metrics')
        .select('*')
        .eq('metric_type', MetricType.PREDEFINED)
        .eq('is_active', true);

      if (unitType) {
        query = query.eq('unit_type', unitType);
      }

      query = query.order('name', { ascending: true });

      const { data, error } = await query;

      if (error) {
        throw new Error(`Error finding predefined metrics: ${error.message}`);
      }

      return data.map(row => this.mapToMetricView(row));
    } catch (error) {
      console.error('Error in findPredefined:', error);
      throw error;
    }
  }

  async findAppCalculated(unitType?: MetricUnitType): Promise<MetricView[]> {
    try {
      let query = supabase
        .from('metrics')
        .select('*')
        .eq('metric_type', MetricType.APP_CALCULATED)
        .eq('is_active', true);

      if (unitType) {
        query = query.eq('unit_type', unitType);
      }

      query = query.order('name', { ascending: true });

      const { data, error } = await query;

      if (error) {
        throw new Error(`Error finding app-calculated metrics: ${error.message}`);
      }

      return data.map(row => this.mapToMetricView(row));
    } catch (error) {
      console.error('Error in findAppCalculated:', error);
      throw error;
    }
  }

  async findByUser(userId: string, unitType?: MetricUnitType): Promise<MetricView[]> {
    try {
      let query = supabase
        .from('metrics')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true);

      if (unitType) {
        query = query.eq('unit_type', unitType);
      }

      query = query.order('name', { ascending: true });

      const { data, error } = await query;

      if (error) {
        throw new Error(`Error finding user metrics: ${error.message}`);
      }

      return data.map(row => this.mapToMetricView(row));
    } catch (error) {
      console.error('Error in findByUser:', error);
      throw error;
    }
  }

  private mapToMetricView(row: any): MetricView {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      unitType: row.unit_type as MetricUnitType,
      defaultUnit: row.default_unit as MetricUnit,
      alternativeUnits: row.alternative_units as MetricUnit[],
      dataType: row.data_type as MetricDataType,
      type: row.metric_type as MetricType,
      userId: row.user_id,
      calculationMethod: row.calculation_method,
      isActive: row.is_active,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }
}

// Export singleton instance
export const metricRepository = new MetricRepository();
export { MetricRepository };

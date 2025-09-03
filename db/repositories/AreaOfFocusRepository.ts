import { supabase } from '../../utils/supabase';
import { AreaOfFocusType } from '../../domain/models/areaOfFocus';
import { AreaOfFocusView } from '../../domain/views/seasonViews';

/**
 * Repository interface for area of focus persistence
 */
export interface IAreaOfFocusRepository {
  /**
   * Find area of focus by ID
   * @param areaId The area of focus ID
   * @returns The area of focus or null if not found
   */
  findById(areaId: string): Promise<AreaOfFocusView | null>;

  /**
   * Find all areas of focus for a pillar
   * @param pillarId The pillar ID
   * @returns Array of areas of focus for the pillar
   */
  findByPillarId(pillarId: string): Promise<AreaOfFocusView[]>;

  /**
   * Find areas of focus accessible to a user (predefined + user-created)
   * @param userId The user ID
   * @param pillarId Optional pillar ID to filter by
   * @returns Array of accessible areas of focus
   */
  findAccessibleToUser(userId: string, pillarId?: string): Promise<AreaOfFocusView[]>;

  /**
   * Find predefined areas of focus
   * @param pillarId Optional pillar ID to filter by
   * @returns Array of predefined areas of focus
   */
  findPredefined(pillarId?: string): Promise<AreaOfFocusView[]>;

  /**
   * Find user-created areas of focus
   * @param userId The user ID
   * @param pillarId Optional pillar ID to filter by
   * @returns Array of user-created areas of focus
   */
  findByUser(userId: string, pillarId?: string): Promise<AreaOfFocusView[]>;
}

/**
 * Supabase implementation of area of focus repository
 */
class AreaOfFocusRepository implements IAreaOfFocusRepository {
  async findById(areaId: string): Promise<AreaOfFocusView | null> {
    try {
      const { data, error } = await supabase
        .from('areas_of_focus')
        .select('*')
        .eq('id', areaId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') { // No rows returned
          return null;
        }
        throw new Error(`Error finding area of focus: ${error.message}`);
      }

      return this.mapToAreaOfFocusView(data);
    } catch (error) {
      console.error('Error in findById:', error);
      throw error;
    }
  }

  async findByPillarId(pillarId: string): Promise<AreaOfFocusView[]> {
    try {
      const { data, error } = await supabase
        .from('areas_of_focus')
        .select('*')
        .eq('pillar_id', pillarId)
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) {
        throw new Error(`Error finding areas of focus: ${error.message}`);
      }

      return data.map(row => this.mapToAreaOfFocusView(row));
    } catch (error) {
      console.error('Error in findByPillarId:', error);
      throw error;
    }
  }

  async findAccessibleToUser(userId: string, pillarId?: string): Promise<AreaOfFocusView[]> {
    try {
      let query = supabase
        .from('areas_of_focus')
        .select('*')
        .eq('is_active', true);

      // Filter by pillar if specified
      if (pillarId) {
        query = query.eq('pillar_id', pillarId);
      }

      // Get predefined areas and user's own areas
      query = query.or(`is_predefined.eq.true,user_id.eq.${userId}`);
      query = query.order('name', { ascending: true });

      const { data, error } = await query;

      if (error) {
        throw new Error(`Error finding accessible areas of focus: ${error.message}`);
      }

      return data.map(row => this.mapToAreaOfFocusView(row));
    } catch (error) {
      console.error('Error in findAccessibleToUser:', error);
      throw error;
    }
  }

  async findPredefined(pillarId?: string): Promise<AreaOfFocusView[]> {
    try {
      let query = supabase
        .from('areas_of_focus')
        .select('*')
        .eq('is_predefined', true)
        .eq('is_active', true);

      if (pillarId) {
        query = query.eq('pillar_id', pillarId);
      }

      query = query.order('name', { ascending: true });

      const { data, error } = await query;

      if (error) {
        throw new Error(`Error finding predefined areas of focus: ${error.message}`);
      }

      return data.map(row => this.mapToAreaOfFocusView(row));
    } catch (error) {
      console.error('Error in findPredefined:', error);
      throw error;
    }
  }

  async findByUser(userId: string, pillarId?: string): Promise<AreaOfFocusView[]> {
    try {
      let query = supabase
        .from('areas_of_focus')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true);

      if (pillarId) {
        query = query.eq('pillar_id', pillarId);
      }

      query = query.order('name', { ascending: true });

      const { data, error } = await query;

      if (error) {
        throw new Error(`Error finding user areas of focus: ${error.message}`);
      }

      return data.map(row => this.mapToAreaOfFocusView(row));
    } catch (error) {
      console.error('Error in findByUser:', error);
      throw error;
    }
  }

  private mapToAreaOfFocusView(row: any): AreaOfFocusView {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      pillarId: row.pillar_id,
      userId: row.user_id,
      type: row.is_predefined ? AreaOfFocusType.PREDEFINED : AreaOfFocusType.USER_CREATED,
      isActive: row.is_active,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }
}

// Export singleton instance
export const areaOfFocusRepository = new AreaOfFocusRepository();
export { AreaOfFocusRepository };

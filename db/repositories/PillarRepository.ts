import { supabase } from '../../utils/supabase';
import { PillarName } from '../../domain/models/pillar';
import { PillarView } from '../../domain/views/seasonViews';

/**
 * Repository interface for pillar persistence
 * Pillars are system-controlled entities
 */
export interface IPillarRepository {
  /**
   * Find all active pillars
   * @returns Array of all active pillars
   */
  findAll(): Promise<PillarView[]>;

  /**
   * Find pillar by ID
   * @param pillarId The pillar ID
   * @returns The pillar or null if not found
   */
  findById(pillarId: string): Promise<PillarView | null>;

  /**
   * Find pillar by name
   * @param pillarName The pillar name
   * @returns The pillar or null if not found
   */
  findByName(pillarName: PillarName): Promise<PillarView | null>;
}

/**
 * Supabase implementation of pillar repository
 */
class PillarRepository implements IPillarRepository {
  async findAll(): Promise<PillarView[]> {
    try {
      const { data, error } = await supabase
        .from('pillars')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) {
        throw new Error(`Error finding pillars: ${error.message}`);
      }

      return data.map(row => this.mapToPillarView(row));
    } catch (error) {
      console.error('Error in findAll:', error);
      throw error;
    }
  }

  async findById(pillarId: string): Promise<PillarView | null> {
    try {
      const { data, error } = await supabase
        .from('pillars')
        .select('*')
        .eq('id', pillarId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') { // No rows returned
          return null;
        }
        throw new Error(`Error finding pillar: ${error.message}`);
      }

      return this.mapToPillarView(data);
    } catch (error) {
      console.error('Error in findById:', error);
      throw error;
    }
  }

  async findByName(pillarName: PillarName): Promise<PillarView | null> {
    try {
      const { data, error } = await supabase
        .from('pillars')
        .select('*')
        .eq('name', pillarName)
        .single();

      if (error) {
        if (error.code === 'PGRST116') { // No rows returned
          return null;
        }
        throw new Error(`Error finding pillar by name: ${error.message}`);
      }

      return this.mapToPillarView(data);
    } catch (error) {
      console.error('Error in findByName:', error);
      throw error;
    }
  }

  private mapToPillarView(row: any): PillarView {
    return {
      id: row.id,
      name: row.name as PillarName,
      displayName: row.display_name,
      description: row.description,
      sortOrder: row.sort_order,
      isActive: row.is_active,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }
}

// Export singleton instance
export const pillarRepository = new PillarRepository();
export { PillarRepository };

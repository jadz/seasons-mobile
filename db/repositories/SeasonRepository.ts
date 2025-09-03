import { supabase } from '../../utils/supabase';
import { Season, SeasonStatus } from '../../domain/models/season';
import {
  SeasonView,
  SeasonData,
  SeasonUpdate
} from '../../domain/views/seasonViews';

/**
 * Repository interface for season persistence
 */
export interface ISeasonRepository {
  /**
   * Create new season
   * @param seasonData The season data to create
   * @returns The generated season ID
   * @throws Error if validation fails
   */
  create(seasonData: SeasonData): Promise<string>;

  /**
   * Find season by ID
   * @param seasonId The season ID
   * @returns The season or null if not found
   */
  findById(seasonId: string): Promise<SeasonView | null>;

  /**
   * Find all seasons for a user
   * @param userId The user ID
   * @returns Array of seasons for the user
   */
  findByUserId(userId: string): Promise<SeasonView[]>;

  /**
   * Find active season for a user
   * @param userId The user ID
   * @returns The active season or null if none
   */
  findActiveByUserId(userId: string): Promise<SeasonView | null>;

  /**
   * Update existing season
   * @param seasonId The season ID
   * @param updateData The data to update
   * @throws Error if season not found
   */
  update(seasonId: string, updateData: SeasonUpdate): Promise<void>;

  /**
   * Delete season
   * @param seasonId The season ID
   * @throws Error if season not found or has dependencies
   */
  delete(seasonId: string): Promise<void>;
}

/**
 * Supabase implementation of season repository
 */
class SeasonRepository implements ISeasonRepository {
  async create(seasonData: SeasonData): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('seasons')
        .insert({
          user_id: seasonData.userId,
          name: seasonData.name,
          duration_weeks: seasonData.durationWeeks,
          status: seasonData.status,
          start_date: seasonData.startDate,
          end_date: seasonData.endDate,
        })
        .select('id')
        .single();

      if (error) {
        throw new Error(`Error creating season: ${error.message}`);
      }

      return data.id;
    } catch (error) {
      console.error('Error in create:', error);
      throw error;
    }
  }

  async findById(seasonId: string): Promise<SeasonView | null> {
    try {
      const { data, error } = await supabase
        .from('seasons')
        .select('*')
        .eq('id', seasonId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') { // No rows returned
          return null;
        }
        throw new Error(`Error finding season: ${error.message}`);
      }

      return this.mapToSeasonView(data);
    } catch (error) {
      console.error('Error in findById:', error);
      throw error;
    }
  }

  async findByUserId(userId: string): Promise<SeasonView[]> {
    try {
      const { data, error } = await supabase
        .from('seasons')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Error finding seasons: ${error.message}`);
      }

      return data.map(row => this.mapToSeasonView(row));
    } catch (error) {
      console.error('Error in findByUserId:', error);
      throw error;
    }
  }

  async findActiveByUserId(userId: string): Promise<SeasonView | null> {
    try {
      const { data, error } = await supabase
        .from('seasons')
        .select('*')
        .eq('user_id', userId)
        .eq('status', SeasonStatus.ACTIVE)
        .single();

      if (error) {
        if (error.code === 'PGRST116') { // No rows returned
          return null;
        }
        throw new Error(`Error finding active season: ${error.message}`);
      }

      return this.mapToSeasonView(data);
    } catch (error) {
      console.error('Error in findActiveByUserId:', error);
      throw error;
    }
  }

  async update(seasonId: string, updateData: SeasonUpdate): Promise<void> {
    try {
      const updateFields: any = {};
      
      if (updateData.name !== undefined) {
        updateFields.name = updateData.name;
      }
      if (updateData.durationWeeks !== undefined) {
        updateFields.duration_weeks = updateData.durationWeeks;
      }

      updateFields.updated_at = new Date().toISOString();

      const { error } = await supabase
        .from('seasons')
        .update(updateFields)
        .eq('id', seasonId);

      if (error) {
        throw new Error(`Error updating season: ${error.message}`);
      }
    } catch (error) {
      console.error('Error in update:', error);
      throw error;
    }
  }

  async delete(seasonId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('seasons')
        .delete()
        .eq('id', seasonId);

      if (error) {
        throw new Error(`Error deleting season: ${error.message}`);
      }
    } catch (error) {
      console.error('Error in delete:', error);
      throw error;
    }
  }

  private mapToSeasonView(row: any): SeasonView {
    return {
      id: row.id,
      userId: row.user_id,
      name: row.name,
      durationWeeks: row.duration_weeks,
      status: row.status as SeasonStatus,
      startDate: row.start_date ? new Date(row.start_date) : null,
      endDate: row.end_date ? new Date(row.end_date) : null,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }
}

// Export singleton instance
export const seasonRepository = new SeasonRepository();
export { SeasonRepository };

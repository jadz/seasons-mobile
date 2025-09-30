import { supabase } from '../../utils/supabase';
import { UserPreferences } from '../../domain/models/userPreferences';
import {
  UserPreferencesData,
  UserPreferencesUpdate,
  UserPreferencesView
} from '../../domain/views/userPreferencesViews';

/**
 * Repository interface for user preferences persistence
 */
export interface IUserPreferencesRepository {
  /**
   * Create new user preferences
   * @param preferencesData The preferences data to create
   * @returns The generated preferences ID
   * @throws Error if user already has preferences
   */
  create(preferencesData: UserPreferencesData): Promise<string>;

  /**
   * Find user preferences by ID
   * @param preferencesId The preferences ID
   * @returns The preferences or null if not found
   */
  findById(preferencesId: string): Promise<UserPreferencesView | null>;

  /**
   * Find user preferences by user ID
   * @param userId The user ID
   * @returns The preferences or null if not found
   */
  findByUserId(userId: string): Promise<UserPreferencesView | null>;

  /**
   * Update existing user preferences
   * @param preferencesId The preferences ID
   * @param updateData The data to update
   * @throws Error if preferences not found
   */
  update(preferencesId: string, updateData: UserPreferencesUpdate): Promise<void>;

  /**
   * Delete user preferences
   * @param preferencesId The preferences ID
   * @throws Error if preferences not found
   */
  delete(preferencesId: string): Promise<void>;

  /**
   * Create or update user preferences
   * @param userId The user ID
   * @param preferencesData The preferences data
   * @returns The created or updated preferences
   */
  createOrUpdate(userId: string, preferencesData: UserPreferencesData): Promise<UserPreferencesView>;
}

/**
 * Supabase implementation of user preferences repository
 */
class UserPreferencesRepository implements IUserPreferencesRepository {
  async create(preferencesData: UserPreferencesData): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .insert({
          user_id: preferencesData.userId,
          body_weight_unit: preferencesData.bodyWeightUnit,
          strength_training_unit: preferencesData.strengthTrainingUnit,
          body_measurement_unit: preferencesData.bodyMeasurementUnit,
          distance_unit: preferencesData.distanceUnit,
          advanced_logging_enabled: preferencesData.advancedLoggingEnabled,
        })
        .select('id')
        .single();

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          throw new Error('User preferences already exist');
        }
        throw new Error(`Error creating user preferences: ${error.message}`);
      }

      return data.id;
    } catch (error) {
      console.error('Error in create:', error);
      throw error;
    }
  }

  async findById(preferencesId: string): Promise<UserPreferencesView | null> {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('id', preferencesId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // No preferences found
        }
        throw new Error(`Error finding user preferences: ${error.message}`);
      }

      return this.mapToUserPreferencesView(data);
    } catch (error) {
      console.error('Error in findById:', error);
      throw error;
    }
  }

  async findByUserId(userId: string): Promise<UserPreferencesView | null> {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // No preferences found
        }
        throw new Error(`Error finding user preferences: ${error.message}`);
      }

      return this.mapToUserPreferencesView(data);
    } catch (error) {
      console.error('Error in findByUserId:', error);
      throw error;
    }
  }

  async update(preferencesId: string, updateData: UserPreferencesUpdate): Promise<void> {
    try {
      const updateFields: any = {};
      
      if (updateData.bodyWeightUnit !== undefined) {
        updateFields.body_weight_unit = updateData.bodyWeightUnit;
      }
      if (updateData.strengthTrainingUnit !== undefined) {
        updateFields.strength_training_unit = updateData.strengthTrainingUnit;
      }
      if (updateData.bodyMeasurementUnit !== undefined) {
        updateFields.body_measurement_unit = updateData.bodyMeasurementUnit;
      }
      if (updateData.distanceUnit !== undefined) {
        updateFields.distance_unit = updateData.distanceUnit;
      }
      if (updateData.advancedLoggingEnabled !== undefined) {
        updateFields.advanced_logging_enabled = updateData.advancedLoggingEnabled;
      }

      const { data, error } = await supabase
        .from('user_preferences')
        .update(updateFields)
        .eq('id', preferencesId)
        .select();

      if (error) {
        throw new Error(`Error updating user preferences: ${error.message}`);
      }

      // Check if any rows were updated
      if (!data || data.length === 0) {
        throw new Error('User preferences not found');
      }
    } catch (error) {
      console.error('Error in update:', error);
      throw error;
    }
  }

  async delete(preferencesId: string): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .delete()
        .eq('id', preferencesId)
        .select();

      if (error) {
        throw new Error(`Error deleting user preferences: ${error.message}`);
      }

      // Check if any rows were deleted
      if (!data || data.length === 0) {
        throw new Error('User preferences not found');
      }
    } catch (error) {
      console.error('Error in delete:', error);
      throw error;
    }
  }

  async createOrUpdate(userId: string, preferencesData: UserPreferencesData): Promise<UserPreferencesView> {
    try {
      // Use PostgreSQL's UPSERT (INSERT ... ON CONFLICT ... DO UPDATE) for atomic operation
      const { data, error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: preferencesData.userId,
          body_weight_unit: preferencesData.bodyWeightUnit,
          strength_training_unit: preferencesData.strengthTrainingUnit,
          body_measurement_unit: preferencesData.bodyMeasurementUnit,
          distance_unit: preferencesData.distanceUnit,
          advanced_logging_enabled: preferencesData.advancedLoggingEnabled,
        }, {
          onConflict: 'user_id', // Handle conflict on user_id (assuming it's unique)
          ignoreDuplicates: false, // Update on conflict rather than ignore
        })
        .select('*')
        .single();

      if (error) {
        throw new Error(`Error upserting user preferences: ${error.message}`);
      }

      return this.mapToUserPreferencesView(data);
    } catch (error) {
      console.error('Error in createOrUpdate:', error);
      throw error;
    }
  }

  private mapToUserPreferencesView(data: any): UserPreferencesView {
    return {
      id: data.id,
      userId: data.user_id,
      bodyWeightUnit: data.body_weight_unit,
      strengthTrainingUnit: data.strength_training_unit,
      bodyMeasurementUnit: data.body_measurement_unit,
      distanceUnit: data.distance_unit,
      advancedLoggingEnabled: data.advanced_logging_enabled,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }
}

export const userPreferencesRepository = new UserPreferencesRepository();
export { UserPreferencesRepository };

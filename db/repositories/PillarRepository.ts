import { supabase } from '../../utils/supabase';
import { Pillar } from '../../domain/models/pillar';
import { PillarWithAreas } from '../../domain/views/pillarViews';

/**
 * Repository for reading pillar data
 * Pillars are system-controlled and read-only for users
 */
export interface IPillarRepository {
  findAll(): Promise<Pillar[]>;
  findActiveOnly(): Promise<Pillar[]>;
  findById(pillarId: string): Promise<Pillar | null>;
  findWithAreas(pillarId: string): Promise<PillarWithAreas | null>;
}

class PillarRepository implements IPillarRepository {
  async findAll(): Promise<Pillar[]> {
    try {
      const { data, error } = await supabase
        .from('pillars')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) {
        throw new Error(`Error finding all pillars: ${error.message}`);
      }

      return (data || []).map(this.mapToPillar);
    } catch (error) {
      console.error('Error in findAll:', error);
      throw error;
    }
  }

  async findActiveOnly(): Promise<Pillar[]> {
    try {
      const { data, error } = await supabase
        .from('pillars')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) {
        throw new Error(`Error finding active pillars: ${error.message}`);
      }

      return (data || []).map(this.mapToPillar);
    } catch (error) {
      console.error('Error in findActiveOnly:', error);
      throw error;
    }
  }

  async findById(pillarId: string): Promise<Pillar | null> {
    try {
      const { data, error } = await supabase
        .from('pillars')
        .select('*')
        .eq('id', pillarId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // No pillar found
        }
        throw new Error(`Error finding pillar by id: ${error.message}`);
      }

      return this.mapToPillar(data);
    } catch (error) {
      console.error('Error in findById:', error);
      throw error;
    }
  }

  async findWithAreas(pillarId: string): Promise<PillarWithAreas | null> {
    try {
      const { data, error } = await supabase
        .from('pillars')
        .select(`
          *,
          areas_of_focus (
            id,
            name,
            description,
            pillar_id,
            user_id,
            is_predefined,
            is_active,
            created_at,
            updated_at
          )
        `)
        .eq('id', pillarId)
        .eq('areas_of_focus.is_active', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // No pillar found
        }
        throw new Error(`Error finding pillar with areas: ${error.message}`);
      }

      return this.mapToPillarWithAreas(data);
    } catch (error) {
      console.error('Error in findWithAreas:', error);
      throw error;
    }
  }

  private mapToPillar(data: any): Pillar {
    return {
      id: data.id,
      name: data.name,
      displayName: data.display_name,
      description: data.description,
      sortOrder: data.sort_order,
      isActive: data.is_active,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }

  private mapToPillarWithAreas(data: any): PillarWithAreas {
    const pillar = this.mapToPillar(data);
    const areasOfFocus = (data.areas_of_focus || []).map((area: any) => ({
      id: area.id,
      name: area.name,
      description: area.description,
      pillarId: area.pillar_id,
      userId: area.user_id,
      isPredefined: area.is_predefined,
      isActive: area.is_active,
      createdAt: new Date(area.created_at),
      updatedAt: new Date(area.updated_at),
    }));

    return {
      ...pillar,
      areasOfFocus,
    };
  }
}

export const pillarRepository = new PillarRepository();
export { PillarRepository };

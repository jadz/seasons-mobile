import { supabase } from '../../utils/supabase';
import { AreaOfFocus } from '../../domain/models/areaOfFocus';
import { AreaOfFocusWithPillar } from '../../domain/views/areaOfFocusViews';

/**
 * Repository for reading area of focus data
 * Areas of focus are predefined (system-controlled) and read-only for users
 */
export interface IAreaOfFocusRepository {
  findAll(): Promise<AreaOfFocus[]>;
  findById(areaOfFocusId: string): Promise<AreaOfFocus | null>;
  findWithPillar(areaOfFocusId: string): Promise<AreaOfFocusWithPillar | null>;
  findByPillarId(pillarId: string): Promise<AreaOfFocus[]>;
  findPredefinedByPillarId(pillarId: string): Promise<AreaOfFocus[]>;
}

class AreaOfFocusRepository implements IAreaOfFocusRepository {
  async findAll(): Promise<AreaOfFocus[]> {
    try {
      const { data, error } = await supabase
        .from('areas_of_focus')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) {
        throw new Error(`Error finding all areas of focus: ${error.message}`);
      }

      return (data || []).map(this.mapToAreaOfFocus);
    } catch (error) {
      console.error('Error in findAll:', error);
      throw error;
    }
  }

  async findById(areaOfFocusId: string): Promise<AreaOfFocus | null> {
    try {
      const { data, error } = await supabase
        .from('areas_of_focus')
        .select('*')
        .eq('id', areaOfFocusId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // No area of focus found
        }
        throw new Error(`Error finding area of focus by id: ${error.message}`);
      }

      return this.mapToAreaOfFocus(data);
    } catch (error) {
      console.error('Error in findById:', error);
      throw error;
    }
  }

  async findWithPillar(areaOfFocusId: string): Promise<AreaOfFocusWithPillar | null> {
    try {
      const { data, error } = await supabase
        .from('areas_of_focus')
        .select(`
          *,
          pillar:pillars (
            id,
            name,
            display_name,
            description,
            sort_order,
            is_active,
            created_at,
            updated_at
          )
        `)
        .eq('id', areaOfFocusId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // No area of focus found
        }
        throw new Error(`Error finding area of focus with pillar: ${error.message}`);
      }

      return this.mapToAreaOfFocusWithPillar(data);
    } catch (error) {
      console.error('Error in findWithPillar:', error);
      throw error;
    }
  }

  async findByPillarId(pillarId: string): Promise<AreaOfFocus[]> {
    try {
      const { data, error } = await supabase
        .from('areas_of_focus')
        .select('*')
        .eq('pillar_id', pillarId)
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) {
        throw new Error(`Error finding areas of focus by pillar: ${error.message}`);
      }

      return (data || []).map(this.mapToAreaOfFocus);
    } catch (error) {
      console.error('Error in findByPillarId:', error);
      throw error;
    }
  }

  async findPredefinedByPillarId(pillarId: string): Promise<AreaOfFocus[]> {
    try {
      const { data, error } = await supabase
        .from('areas_of_focus')
        .select('*')
        .eq('pillar_id', pillarId)
        .eq('is_predefined', true)
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) {
        throw new Error(`Error finding predefined areas of focus: ${error.message}`);
      }

      return (data || []).map(this.mapToAreaOfFocus);
    } catch (error) {
      console.error('Error in findPredefinedByPillarId:', error);
      throw error;
    }
  }

  private mapToAreaOfFocus(data: any): AreaOfFocus {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      pillarId: data.pillar_id,
      userId: data.user_id,
      isPredefined: data.is_predefined,
      isActive: data.is_active,
      colorHex: data.color_hex || '#FF6B6B',
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }

  private mapToAreaOfFocusWithPillar(data: any): AreaOfFocusWithPillar {
    const areaOfFocus = this.mapToAreaOfFocus(data);
    
    return {
      ...areaOfFocus,
      pillar: {
        id: data.pillar.id,
        name: data.pillar.name,
        displayName: data.pillar.display_name,
        description: data.pillar.description,
        sortOrder: data.pillar.sort_order,
        isActive: data.pillar.is_active,
        createdAt: new Date(data.pillar.created_at),
        updatedAt: new Date(data.pillar.updated_at),
      },
    };
  }
}

export const areaOfFocusRepository = new AreaOfFocusRepository();
export { AreaOfFocusRepository };

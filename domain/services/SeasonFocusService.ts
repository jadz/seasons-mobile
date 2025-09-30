import { IPillarRepository, pillarRepository } from '../../db/repositories/PillarRepository';
import { IAreaOfFocusRepository, areaOfFocusRepository } from '../../db/repositories/AreaOfFocusRepository';
import { Pillar } from '../models/pillar';
import { AreaOfFocus } from '../models/areaOfFocus';
import { PillarWithAreas } from '../views/pillarViews';
import { AreaOfFocusWithPillar } from '../views/areaOfFocusViews';

/**
 * Service for managing season focus selection (pillars and areas of focus)
 * 
 * This service provides business logic for reading pillar and area of focus data
 * that users can select when creating a season. All data is system-controlled
 * and read-only for users.
 */
export class SeasonFocusService {
  constructor(
    private readonly pillarRepository: IPillarRepository,
    private readonly areaOfFocusRepository: IAreaOfFocusRepository
  ) {}

  /**
   * Get all active pillars
   * @returns List of active pillars ordered by sort_order
   */
  async getActivePillars(): Promise<Pillar[]> {
    try {
      return await this.pillarRepository.findActiveOnly();
    } catch (error) {
      console.error('Error getting active pillars:', error);
      throw new Error('Failed to get active pillars');
    }
  }

  /**
   * Get all active pillars with their predefined areas of focus
   * @returns List of pillars with their areas
   */
  async getPillarsWithAreas(): Promise<PillarWithAreas[]> {
    try {
      const pillars = await this.pillarRepository.findActiveOnly();
      
      // Get areas for each pillar
      const pillarsWithAreas = await Promise.all(
        pillars.map(async (pillar) => {
          const areas = await this.areaOfFocusRepository.findPredefinedByPillarId(pillar.id);
          return {
            ...pillar,
            areasOfFocus: areas,
          };
        })
      );

      return pillarsWithAreas;
    } catch (error) {
      console.error('Error getting pillars with areas:', error);
      throw new Error('Failed to get pillars with areas');
    }
  }

  /**
   * Get a specific pillar with its predefined areas of focus
   * @param pillarId The pillar ID
   * @returns Pillar with its areas, or null if not found
   */
  async getPillarWithAreas(pillarId: string): Promise<PillarWithAreas | null> {
    try {
      const pillar = await this.pillarRepository.findById(pillarId);
      
      if (!pillar) {
        return null;
      }

      const areas = await this.areaOfFocusRepository.findPredefinedByPillarId(pillarId);
      
      return {
        ...pillar,
        areasOfFocus: areas,
      };
    } catch (error) {
      console.error('Error getting pillar with areas:', error);
      throw error;
    }
  }

  /**
   * Get predefined areas of focus for a specific pillar
   * @param pillarId The pillar ID
   * @returns List of predefined areas for the pillar
   */
  async getPredefinedAreasForPillar(pillarId: string): Promise<AreaOfFocus[]> {
    try {
      return await this.areaOfFocusRepository.findPredefinedByPillarId(pillarId);
    } catch (error) {
      console.error('Error getting predefined areas for pillar:', error);
      throw new Error('Failed to get predefined areas');
    }
  }

  /**
   * Get an area of focus with its pillar information
   * @param areaOfFocusId The area of focus ID
   * @returns Area of focus with pillar, or null if not found
   */
  async getAreaOfFocusWithPillar(areaOfFocusId: string): Promise<AreaOfFocusWithPillar | null> {
    try {
      return await this.areaOfFocusRepository.findWithPillar(areaOfFocusId);
    } catch (error) {
      console.error('Error getting area of focus with pillar:', error);
      throw error;
    }
  }

  /**
   * Get all active areas of focus across all pillars
   * @returns List of all active areas of focus
   */
  async getAllActiveAreas(): Promise<AreaOfFocus[]> {
    try {
      return await this.areaOfFocusRepository.findAll();
    } catch (error) {
      console.error('Error getting all active areas:', error);
      throw new Error('Failed to get all active areas');
    }
  }
}

// Export singleton instance with default repositories
export const seasonFocusService = new SeasonFocusService(
  pillarRepository,
  areaOfFocusRepository
);

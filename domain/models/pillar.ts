/**
 * Domain model for life pillars
 * 
 * Pillars are system-controlled entities representing the core areas of life:
 * Health & Fitness, Wealth, Family, Head Game, Career
 */

export enum PillarName {
  HEALTH_FITNESS = 'health_fitness',
  WEALTH = 'wealth',
  FAMILY = 'family',
  HEAD_GAME = 'head_game',
  CAREER = 'career'
}

export class Pillar {
  constructor(
    public readonly id: string,
    public readonly name: PillarName,
    public readonly displayName: string,
    public readonly description: string,
    public readonly sortOrder: number,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {
    this.validateInvariants();
  }

  /**
   * Create a new system pillar (used by system initialization)
   */
  static createSystem(
    name: PillarName,
    displayName: string,
    description: string,
    sortOrder: number
  ): {
    name: PillarName;
    displayName: string;
    description: string;
    sortOrder: number;
    isActive: boolean;
  } {
    this.validatePillarName(name);
    this.validateDisplayName(displayName);
    this.validateSortOrder(sortOrder);

    return {
      name,
      displayName,
      description,
      sortOrder,
      isActive: true
    };
  }

  /**
   * Reconstruct from database data
   */
  static fromData(data: {
    id: string;
    name: string;
    displayName: string;
    description: string;
    sortOrder: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): Pillar {
    const pillarName = this.validateAndParsePillarName(data.name);
    
    return new Pillar(
      data.id,
      pillarName,
      data.displayName,
      data.description,
      data.sortOrder,
      data.isActive,
      data.createdAt,
      data.updatedAt
    );
  }

  /**
   * Deactivate this pillar (system operation)
   */
  deactivate(): Pillar {
    return new Pillar(
      this.id,
      this.name,
      this.displayName,
      this.description,
      this.sortOrder,
      false,
      this.createdAt,
      new Date()
    );
  }

  /**
   * Update pillar metadata (system operation)
   */
  updateMetadata(displayName: string, description: string): Pillar {
    Pillar.validateDisplayName(displayName);

    return new Pillar(
      this.id,
      this.name,
      displayName,
      description,
      this.sortOrder,
      this.isActive,
      this.createdAt,
      new Date()
    );
  }

  /**
   * Check if this pillar is one of the core system pillars
   */
  isCoreSystemPillar(): boolean {
    return Object.values(PillarName).includes(this.name);
  }

  private validateInvariants(): void {
    Pillar.validateDisplayName(this.displayName);
    Pillar.validateSortOrder(this.sortOrder);
  }

  private static validatePillarName(name: PillarName): void {
    if (!Object.values(PillarName).includes(name)) {
      throw new Error(`Invalid pillar name: ${name}`);
    }
  }

  private static validateAndParsePillarName(name: string): PillarName {
    const pillarName = name as PillarName;
    if (!Object.values(PillarName).includes(pillarName)) {
      throw new Error(`Invalid pillar name from database: ${name}`);
    }
    return pillarName;
  }

  private static validateDisplayName(displayName: string): void {
    if (!displayName?.trim()) {
      throw new Error('Pillar display name cannot be empty');
    }
    
    if (displayName.length > 50) {
      throw new Error('Pillar display name cannot exceed 50 characters');
    }
  }

  private static validateSortOrder(sortOrder: number): void {
    if (!Number.isInteger(sortOrder) || sortOrder < 0) {
      throw new Error('Sort order must be a non-negative integer');
    }
  }
}

/**
 * Predefined system pillars with their metadata
 */
export const SYSTEM_PILLARS = [
  {
    name: PillarName.HEALTH_FITNESS,
    displayName: 'Health & Fitness',
    description: 'Physical health, fitness, nutrition, and body composition goals',
    sortOrder: 1
  },
  {
    name: PillarName.WEALTH,
    displayName: 'Wealth',
    description: 'Financial goals, income, investments, and financial planning',
    sortOrder: 2
  },
  {
    name: PillarName.FAMILY,
    displayName: 'Family',
    description: 'Relationships, family time, and personal connections',
    sortOrder: 3
  },
  {
    name: PillarName.HEAD_GAME,
    displayName: 'Head Game',
    description: 'Mental health, mindset, learning, and personal development',
    sortOrder: 4
  },
  {
    name: PillarName.CAREER,
    displayName: 'Career',
    description: 'Professional development, work goals, and career advancement',
    sortOrder: 5
  }
] as const;

/**
 * Helper function to create all system pillars
 */
export function createSystemPillars(): Array<{
  name: PillarName;
  displayName: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
}> {
  return SYSTEM_PILLARS.map(pillar => 
    Pillar.createSystem(
      pillar.name,
      pillar.displayName,
      pillar.description,
      pillar.sortOrder
    )
  );
}

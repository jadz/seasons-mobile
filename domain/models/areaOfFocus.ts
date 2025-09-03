/**
 * Domain model for areas of focus within pillars
 * 
 * Areas of focus can be either:
 * - Predefined: System-provided areas that all users can select from
 * - User-created: Private areas created by individual users
 */

export enum AreaOfFocusType {
  PREDEFINED = 'predefined',
  USER_CREATED = 'user_created'
}

export class AreaOfFocus {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly pillarId: string,
    public readonly userId: string | null, // null for predefined, user ID for user-created
    public readonly type: AreaOfFocusType,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {
    this.validateInvariants();
  }

  /**
   * Create a predefined area of focus (system operation)
   */
  static createPredefined(
    name: string,
    description: string,
    pillarId: string
  ): {
    name: string;
    description: string;
    pillarId: string;
    userId: null;
    type: AreaOfFocusType;
    isActive: boolean;
  } {
    this.validateName(name);
    this.validatePillarId(pillarId);

    return {
      name,
      description,
      pillarId,
      userId: null,
      type: AreaOfFocusType.PREDEFINED,
      isActive: true
    };
  }

  /**
   * Create a user-specific area of focus
   */
  static createUserDefined(
    name: string,
    description: string,
    pillarId: string,
    userId: string
  ): {
    name: string;
    description: string;
    pillarId: string;
    userId: string;
    type: AreaOfFocusType;
    isActive: boolean;
  } {
    this.validateName(name);
    this.validatePillarId(pillarId);
    this.validateUserId(userId);

    return {
      name,
      description,
      pillarId,
      userId,
      type: AreaOfFocusType.USER_CREATED,
      isActive: true
    };
  }

  /**
   * Reconstruct from database data
   */
  static fromData(data: {
    id: string;
    name: string;
    description: string;
    pillarId: string;
    userId: string | null;
    isPredefined: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): AreaOfFocus {
    const type = data.isPredefined ? AreaOfFocusType.PREDEFINED : AreaOfFocusType.USER_CREATED;
    
    return new AreaOfFocus(
      data.id,
      data.name,
      data.description,
      data.pillarId,
      data.userId,
      type,
      data.isActive,
      data.createdAt,
      data.updatedAt
    );
  }

  /**
   * Check if this is a predefined area of focus
   */
  isPredefined(): boolean {
    return this.type === AreaOfFocusType.PREDEFINED && this.userId === null;
  }

  /**
   * Check if this is user-created area of focus
   */
  isUserCreated(): boolean {
    return this.type === AreaOfFocusType.USER_CREATED && this.userId !== null;
  }

  /**
   * Check if this area belongs to a specific user (for user-created areas)
   */
  belongsToUser(userId: string): boolean {
    return this.isUserCreated() && this.userId === userId;
  }

  /**
   * Check if this area is accessible to a user (predefined or owned by user)
   */
  isAccessibleToUser(userId: string): boolean {
    return this.isPredefined() || this.belongsToUser(userId);
  }

  /**
   * Update area metadata (only for user-created areas)
   */
  updateMetadata(name: string, description: string, userId: string): AreaOfFocus {
    if (!this.belongsToUser(userId)) {
      throw new Error('Cannot update area of focus: user does not own this area');
    }

    AreaOfFocus.validateName(name);

    return new AreaOfFocus(
      this.id,
      name,
      description,
      this.pillarId,
      this.userId,
      this.type,
      this.isActive,
      this.createdAt,
      new Date()
    );
  }

  /**
   * Deactivate this area of focus
   */
  deactivate(userId?: string): AreaOfFocus {
    // For user-created areas, verify ownership
    if (this.isUserCreated() && userId && !this.belongsToUser(userId)) {
      throw new Error('Cannot deactivate area of focus: user does not own this area');
    }

    return new AreaOfFocus(
      this.id,
      this.name,
      this.description,
      this.pillarId,
      this.userId,
      this.type,
      false,
      this.createdAt,
      new Date()
    );
  }

  /**
   * Reactivate this area of focus
   */
  reactivate(userId?: string): AreaOfFocus {
    // For user-created areas, verify ownership
    if (this.isUserCreated() && userId && !this.belongsToUser(userId)) {
      throw new Error('Cannot reactivate area of focus: user does not own this area');
    }

    return new AreaOfFocus(
      this.id,
      this.name,
      this.description,
      this.pillarId,
      this.userId,
      this.type,
      true,
      this.createdAt,
      new Date()
    );
  }

  private validateInvariants(): void {
    AreaOfFocus.validateName(this.name);
    AreaOfFocus.validatePillarId(this.pillarId);

    // Validate type-specific constraints
    if (this.type === AreaOfFocusType.PREDEFINED && this.userId !== null) {
      throw new Error('Predefined areas of focus cannot have a user ID');
    }

    if (this.type === AreaOfFocusType.USER_CREATED && this.userId === null) {
      throw new Error('User-created areas of focus must have a user ID');
    }

    if (this.userId !== null) {
      AreaOfFocus.validateUserId(this.userId);
    }
  }

  private static validateName(name: string): void {
    if (!name?.trim()) {
      throw new Error('Area of focus name cannot be empty');
    }

    if (name.length > 100) {
      throw new Error('Area of focus name cannot exceed 100 characters');
    }

    // Prevent names that might conflict with system operations
    const reservedNames = ['system', 'admin', 'default'];
    if (reservedNames.includes(name.toLowerCase())) {
      throw new Error(`Area of focus name "${name}" is reserved`);
    }
  }

  private static validatePillarId(pillarId: string): void {
    if (!pillarId?.trim()) {
      throw new Error('Pillar ID cannot be empty');
    }

    // Basic UUID format validation
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(pillarId)) {
      throw new Error('Pillar ID must be a valid UUID');
    }
  }

  private static validateUserId(userId: string): void {
    if (!userId?.trim()) {
      throw new Error('User ID cannot be empty');
    }

    // Basic UUID format validation
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(userId)) {
      throw new Error('User ID must be a valid UUID');
    }
  }
}

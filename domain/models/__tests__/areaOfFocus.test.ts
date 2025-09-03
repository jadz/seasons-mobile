import { AreaOfFocus, AreaOfFocusType } from '../areaOfFocus';

describe('AreaOfFocus Domain Model', () => {
  const mockPillarId = '123e4567-e89b-12d3-a456-426614174000';
  const mockUserId = '987fcdeb-51a2-43d1-b789-123456789abc';

  describe('Constructor and Validation', () => {
    it('should create a valid predefined area of focus instance', () => {
      const areaOfFocus = new AreaOfFocus(
        'test-id',
        'Weight Loss',
        'Focus on reducing body weight',
        mockPillarId,
        null,
        AreaOfFocusType.PREDEFINED,
        true,
        new Date('2024-01-01'),
        new Date('2024-01-01')
      );

      expect(areaOfFocus.id).toBe('test-id');
      expect(areaOfFocus.name).toBe('Weight Loss');
      expect(areaOfFocus.description).toBe('Focus on reducing body weight');
      expect(areaOfFocus.pillarId).toBe(mockPillarId);
      expect(areaOfFocus.userId).toBeNull();
      expect(areaOfFocus.type).toBe(AreaOfFocusType.PREDEFINED);
      expect(areaOfFocus.isActive).toBe(true);
    });

    it('should create a valid user-created area of focus instance', () => {
      const areaOfFocus = new AreaOfFocus(
        'test-id',
        'Custom Goal',
        'My personal fitness goal',
        mockPillarId,
        mockUserId,
        AreaOfFocusType.USER_CREATED,
        true,
        new Date('2024-01-01'),
        new Date('2024-01-01')
      );

      expect(areaOfFocus.userId).toBe(mockUserId);
      expect(areaOfFocus.type).toBe(AreaOfFocusType.USER_CREATED);
    });

    it('should validate name on construction', () => {
      expect(() => {
        new AreaOfFocus(
          'test-id',
          '', // Empty name
          'Description',
          mockPillarId,
          null,
          AreaOfFocusType.PREDEFINED,
          true,
          new Date(),
          new Date()
        );
      }).toThrow('Area of focus name cannot be empty');
    });

    it('should validate pillar ID format on construction', () => {
      expect(() => {
        new AreaOfFocus(
          'test-id',
          'Valid Name',
          'Description',
          'invalid-pillar-id', // Invalid UUID format
          null,
          AreaOfFocusType.PREDEFINED,
          true,
          new Date(),
          new Date()
        );
      }).toThrow('Pillar ID must be a valid UUID');
    });

    it('should validate type-specific constraints for predefined areas', () => {
      expect(() => {
        new AreaOfFocus(
          'test-id',
          'Test Area',
          'Description',
          mockPillarId,
          mockUserId, // Should be null for predefined
          AreaOfFocusType.PREDEFINED,
          true,
          new Date(),
          new Date()
        );
      }).toThrow('Predefined areas of focus cannot have a user ID');
    });

    it('should validate type-specific constraints for user-created areas', () => {
      expect(() => {
        new AreaOfFocus(
          'test-id',
          'Test Area',
          'Description',
          mockPillarId,
          null, // Should have user ID for user-created
          AreaOfFocusType.USER_CREATED,
          true,
          new Date(),
          new Date()
        );
      }).toThrow('User-created areas of focus must have a user ID');
    });

    it('should validate name length', () => {
      const longName = 'a'.repeat(101); // 101 characters
      expect(() => {
        new AreaOfFocus(
          'test-id',
          longName,
          'Description',
          mockPillarId,
          null,
          AreaOfFocusType.PREDEFINED,
          true,
          new Date(),
          new Date()
        );
      }).toThrow('Area of focus name cannot exceed 100 characters');
    });

    it('should validate reserved names', () => {
      expect(() => {
        new AreaOfFocus(
          'test-id',
          'system', // Reserved name
          'Description',
          mockPillarId,
          null,
          AreaOfFocusType.PREDEFINED,
          true,
          new Date(),
          new Date()
        );
      }).toThrow('Area of focus name "system" is reserved');
    });
  });

  describe('Static Factory Methods', () => {
    describe('createPredefined', () => {
      it('should create predefined area of focus data successfully', () => {
        const areaData = AreaOfFocus.createPredefined(
          'Strength Training',
          'Focus on building strength',
          mockPillarId
        );

        expect(areaData.name).toBe('Strength Training');
        expect(areaData.description).toBe('Focus on building strength');
        expect(areaData.pillarId).toBe(mockPillarId);
        expect(areaData.userId).toBeNull();
        expect(areaData.type).toBe(AreaOfFocusType.PREDEFINED);
        expect(areaData.isActive).toBe(true);
      });

      it('should validate name for predefined areas', () => {
        expect(() => {
          AreaOfFocus.createPredefined(
            '', // Empty name
            'Description',
            mockPillarId
          );
        }).toThrow('Area of focus name cannot be empty');
      });

      it('should validate pillar ID for predefined areas', () => {
        expect(() => {
          AreaOfFocus.createPredefined(
            'Valid Name',
            'Description',
            'invalid-id'
          );
        }).toThrow('Pillar ID must be a valid UUID');
      });
    });

    describe('createUserDefined', () => {
      it('should create user-defined area of focus data successfully', () => {
        const areaData = AreaOfFocus.createUserDefined(
          'My Custom Goal',
          'Personal fitness objective',
          mockPillarId,
          mockUserId
        );

        expect(areaData.name).toBe('My Custom Goal');
        expect(areaData.description).toBe('Personal fitness objective');
        expect(areaData.pillarId).toBe(mockPillarId);
        expect(areaData.userId).toBe(mockUserId);
        expect(areaData.type).toBe(AreaOfFocusType.USER_CREATED);
        expect(areaData.isActive).toBe(true);
      });

      it('should validate user ID for user-defined areas', () => {
        expect(() => {
          AreaOfFocus.createUserDefined(
            'Valid Name',
            'Description',
            mockPillarId,
            'invalid-user-id'
          );
        }).toThrow('User ID must be a valid UUID');
      });

      it('should validate name for user-defined areas', () => {
        expect(() => {
          AreaOfFocus.createUserDefined(
            'admin', // Reserved name
            'Description',
            mockPillarId,
            mockUserId
          );
        }).toThrow('Area of focus name "admin" is reserved');
      });
    });

    describe('fromData', () => {
      it('should reconstruct predefined area from database data', () => {
        const dbData = {
          id: 'test-id',
          name: 'Muscle Gain',
          description: 'Focus on building muscle mass',
          pillarId: mockPillarId,
          userId: null,
          isPredefined: true,
          isActive: true,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-02')
        };

        const areaOfFocus = AreaOfFocus.fromData(dbData);

        expect(areaOfFocus.id).toBe('test-id');
        expect(areaOfFocus.name).toBe('Muscle Gain');
        expect(areaOfFocus.type).toBe(AreaOfFocusType.PREDEFINED);
        expect(areaOfFocus.userId).toBeNull();
        expect(areaOfFocus.createdAt).toEqual(dbData.createdAt);
        expect(areaOfFocus.updatedAt).toEqual(dbData.updatedAt);
      });

      it('should reconstruct user-created area from database data', () => {
        const dbData = {
          id: 'test-id',
          name: 'Personal Goal',
          description: 'My custom goal',
          pillarId: mockPillarId,
          userId: mockUserId,
          isPredefined: false,
          isActive: true,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-02')
        };

        const areaOfFocus = AreaOfFocus.fromData(dbData);

        expect(areaOfFocus.type).toBe(AreaOfFocusType.USER_CREATED);
        expect(areaOfFocus.userId).toBe(mockUserId);
      });
    });
  });

  describe('Business Logic Methods', () => {
    let predefinedArea: AreaOfFocus;
    let userCreatedArea: AreaOfFocus;

    beforeEach(() => {
      predefinedArea = new AreaOfFocus(
        'predefined-id',
        'Weight Loss',
        'Predefined weight loss area',
        mockPillarId,
        null,
        AreaOfFocusType.PREDEFINED,
        true,
        new Date('2024-01-01'),
        new Date('2024-01-01')
      );

      userCreatedArea = new AreaOfFocus(
        'user-created-id',
        'Custom Goal',
        'User defined goal',
        mockPillarId,
        mockUserId,
        AreaOfFocusType.USER_CREATED,
        true,
        new Date('2024-01-01'),
        new Date('2024-01-01')
      );
    });

    describe('Type Checking Methods', () => {
      it('should correctly identify predefined areas', () => {
        expect(predefinedArea.isPredefined()).toBe(true);
        expect(predefinedArea.isUserCreated()).toBe(false);
        
        expect(userCreatedArea.isPredefined()).toBe(false);
        expect(userCreatedArea.isUserCreated()).toBe(true);
      });
    });

    describe('Ownership and Access Methods', () => {
      it('should correctly identify area ownership', () => {
        expect(predefinedArea.belongsToUser(mockUserId)).toBe(false);
        expect(userCreatedArea.belongsToUser(mockUserId)).toBe(true);
        expect(userCreatedArea.belongsToUser('different-user-id')).toBe(false);
      });

      it('should correctly determine user access', () => {
        expect(predefinedArea.isAccessibleToUser(mockUserId)).toBe(true); // Predefined accessible to all
        expect(predefinedArea.isAccessibleToUser('any-user-id')).toBe(true);
        
        expect(userCreatedArea.isAccessibleToUser(mockUserId)).toBe(true); // Owner access
        expect(userCreatedArea.isAccessibleToUser('different-user-id')).toBe(false); // Non-owner no access
      });
    });

    describe('updateMetadata', () => {
      it('should update user-created area metadata successfully', () => {
        const updatedArea = userCreatedArea.updateMetadata(
          'Updated Goal',
          'Updated description',
          mockUserId
        );

        expect(updatedArea.name).toBe('Updated Goal');
        expect(updatedArea.description).toBe('Updated description');
        expect(updatedArea.id).toBe(userCreatedArea.id);
        expect(updatedArea.pillarId).toBe(userCreatedArea.pillarId);
        expect(updatedArea.userId).toBe(userCreatedArea.userId);
        expect(updatedArea.type).toBe(userCreatedArea.type);
        expect(updatedArea.createdAt).toBe(userCreatedArea.createdAt);
        expect(updatedArea.updatedAt).not.toBe(userCreatedArea.updatedAt);
      });

      it('should prevent non-owners from updating user-created areas', () => {
        expect(() => {
          userCreatedArea.updateMetadata(
            'Hacked Name',
            'Malicious description',
            'different-user-id'
          );
        }).toThrow('Cannot update area of focus: user does not own this area');
      });

      it('should validate name during update', () => {
        expect(() => {
          userCreatedArea.updateMetadata(
            '', // Empty name
            'Valid description',
            mockUserId
          );
        }).toThrow('Area of focus name cannot be empty');
      });

      it('should return new instance (immutability)', () => {
        const updatedArea = userCreatedArea.updateMetadata(
          'New Name',
          'New Description',
          mockUserId
        );

        expect(updatedArea).not.toBe(userCreatedArea);
        expect(userCreatedArea.name).toBe('Custom Goal'); // Original unchanged
      });
    });

    describe('deactivate', () => {
      it('should deactivate predefined area without user check', () => {
        const deactivatedArea = predefinedArea.deactivate();

        expect(deactivatedArea.isActive).toBe(false);
        expect(deactivatedArea.id).toBe(predefinedArea.id);
        expect(deactivatedArea.name).toBe(predefinedArea.name);
        expect(deactivatedArea.type).toBe(predefinedArea.type);
        expect(deactivatedArea.updatedAt).not.toBe(predefinedArea.updatedAt);
      });

      it('should deactivate user-created area with ownership verification', () => {
        const deactivatedArea = userCreatedArea.deactivate(mockUserId);

        expect(deactivatedArea.isActive).toBe(false);
        expect(deactivatedArea.userId).toBe(mockUserId);
      });

      it('should prevent non-owners from deactivating user-created areas', () => {
        expect(() => {
          userCreatedArea.deactivate('different-user-id');
        }).toThrow('Cannot deactivate area of focus: user does not own this area');
      });

      it('should return new instance (immutability)', () => {
        const deactivatedArea = predefinedArea.deactivate();

        expect(deactivatedArea).not.toBe(predefinedArea);
        expect(predefinedArea.isActive).toBe(true); // Original unchanged
      });
    });

    describe('reactivate', () => {
      let inactiveUserArea: AreaOfFocus;

      beforeEach(() => {
        inactiveUserArea = new AreaOfFocus(
          'inactive-id',
          'Inactive Goal',
          'Currently inactive goal',
          mockPillarId,
          mockUserId,
          AreaOfFocusType.USER_CREATED,
          false, // Inactive
          new Date('2024-01-01'),
          new Date('2024-01-01')
        );
      });

      it('should reactivate area successfully', () => {
        const reactivatedArea = inactiveUserArea.reactivate(mockUserId);

        expect(reactivatedArea.isActive).toBe(true);
        expect(reactivatedArea.id).toBe(inactiveUserArea.id);
        expect(reactivatedArea.name).toBe(inactiveUserArea.name);
        expect(reactivatedArea.updatedAt).not.toBe(inactiveUserArea.updatedAt);
      });

      it('should prevent non-owners from reactivating user-created areas', () => {
        expect(() => {
          inactiveUserArea.reactivate('different-user-id');
        }).toThrow('Cannot reactivate area of focus: user does not own this area');
      });

      it('should return new instance (immutability)', () => {
        const reactivatedArea = inactiveUserArea.reactivate(mockUserId);

        expect(reactivatedArea).not.toBe(inactiveUserArea);
        expect(inactiveUserArea.isActive).toBe(false); // Original unchanged
      });
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle whitespace-only names', () => {
      expect(() => {
        AreaOfFocus.createPredefined(
          '   ', // Whitespace only
          'Description',
          mockPillarId
        );
      }).toThrow('Area of focus name cannot be empty');
    });

    it('should validate all reserved names case-insensitively', () => {
      const reservedNames = ['SYSTEM', 'Admin', 'DEFAULT'];
      
      reservedNames.forEach(name => {
        expect(() => {
          AreaOfFocus.createUserDefined(
            name,
            'Description',
            mockPillarId,
            mockUserId
          );
        }).toThrow(`Area of focus name "${name}" is reserved`);
      });
    });

    it('should handle empty UUID validation', () => {
      expect(() => {
        AreaOfFocus.createPredefined(
          'Valid Name',
          'Description',
          '' // Empty pillar ID
        );
      }).toThrow('Pillar ID cannot be empty');
    });

    it('should preserve all properties during state changes', () => {
      const originalDate = new Date('2024-01-01');
      const area = new AreaOfFocus(
        'test-id',
        'Test Area',
        'Test Description',
        mockPillarId,
        mockUserId,
        AreaOfFocusType.USER_CREATED,
        true,
        originalDate,
        originalDate
      );

      const deactivated = area.deactivate(mockUserId);
      const updated = area.updateMetadata('New Name', 'New Description', mockUserId);

      // Check that unrelated properties are preserved
      expect(deactivated.name).toBe('Test Area');
      expect(deactivated.type).toBe(AreaOfFocusType.USER_CREATED);
      expect(updated.isActive).toBe(true);
      expect(updated.pillarId).toBe(mockPillarId);
    });

    it('should handle boundary name length (exactly 100 characters)', () => {
      const exactlyHundredChars = 'a'.repeat(100);
      
      const areaData = AreaOfFocus.createPredefined(
        exactlyHundredChars,
        'Description',
        mockPillarId
      );

      expect(areaData.name).toBe(exactlyHundredChars);
      expect(areaData.name.length).toBe(100);
    });
  });
});


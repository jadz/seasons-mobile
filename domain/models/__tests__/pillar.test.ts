import { Pillar, PillarName, SYSTEM_PILLARS, createSystemPillars } from '../pillar';

describe('Pillar Domain Model', () => {
  describe('Constructor and Validation', () => {
    it('should create a valid pillar instance', () => {
      const pillar = new Pillar(
        'test-id',
        PillarName.HEALTH_FITNESS,
        'Health & Fitness',
        'Physical health and fitness goals',
        1,
        true,
        new Date('2024-01-01'),
        new Date('2024-01-01')
      );

      expect(pillar.id).toBe('test-id');
      expect(pillar.name).toBe(PillarName.HEALTH_FITNESS);
      expect(pillar.displayName).toBe('Health & Fitness');
      expect(pillar.description).toBe('Physical health and fitness goals');
      expect(pillar.sortOrder).toBe(1);
      expect(pillar.isActive).toBe(true);
    });

    it('should validate display name on construction', () => {
      expect(() => {
        new Pillar(
          'test-id',
          PillarName.HEALTH_FITNESS,
          '', // Empty display name
          'Description',
          1,
          true,
          new Date(),
          new Date()
        );
      }).toThrow('Pillar display name cannot be empty');
    });

    it('should validate sort order on construction', () => {
      expect(() => {
        new Pillar(
          'test-id',
          PillarName.HEALTH_FITNESS,
          'Valid Name',
          'Description',
          -1, // Invalid sort order
          true,
          new Date(),
          new Date()
        );
      }).toThrow('Sort order must be a non-negative integer');
    });

    it('should validate display name length', () => {
      const longName = 'a'.repeat(51); // 51 characters
      expect(() => {
        new Pillar(
          'test-id',
          PillarName.HEALTH_FITNESS,
          longName,
          'Description',
          1,
          true,
          new Date(),
          new Date()
        );
      }).toThrow('Pillar display name cannot exceed 50 characters');
    });
  });

  describe('Static Factory Methods', () => {
    describe('createSystem', () => {
      it('should create system pillar data successfully', () => {
        const pillarData = Pillar.createSystem(
          PillarName.WEALTH,
          'Wealth',
          'Financial goals and planning',
          2
        );

        expect(pillarData.name).toBe(PillarName.WEALTH);
        expect(pillarData.displayName).toBe('Wealth');
        expect(pillarData.description).toBe('Financial goals and planning');
        expect(pillarData.sortOrder).toBe(2);
        expect(pillarData.isActive).toBe(true);
      });

      it('should validate pillar name', () => {
        expect(() => {
          Pillar.createSystem(
            'invalid_name' as PillarName,
            'Invalid',
            'Description',
            1
          );
        }).toThrow('Invalid pillar name: invalid_name');
      });

      it('should validate display name', () => {
        expect(() => {
          Pillar.createSystem(
            PillarName.FAMILY,
            '', // Empty display name
            'Description',
            1
          );
        }).toThrow('Pillar display name cannot be empty');
      });

      it('should validate sort order', () => {
        expect(() => {
          Pillar.createSystem(
            PillarName.FAMILY,
            'Family',
            'Description',
            -1 // Invalid sort order
          );
        }).toThrow('Sort order must be a non-negative integer');
      });
    });

    describe('fromData', () => {
      it('should reconstruct pillar from database data', () => {
        const dbData = {
          id: 'test-id',
          name: 'health_fitness',
          displayName: 'Health & Fitness',
          description: 'Physical health and fitness',
          sortOrder: 1,
          isActive: true,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-02')
        };

        const pillar = Pillar.fromData(dbData);

        expect(pillar.id).toBe('test-id');
        expect(pillar.name).toBe(PillarName.HEALTH_FITNESS);
        expect(pillar.displayName).toBe('Health & Fitness');
        expect(pillar.description).toBe('Physical health and fitness');
        expect(pillar.sortOrder).toBe(1);
        expect(pillar.isActive).toBe(true);
        expect(pillar.createdAt).toEqual(dbData.createdAt);
        expect(pillar.updatedAt).toEqual(dbData.updatedAt);
      });

      it('should throw error for invalid pillar name from database', () => {
        const dbData = {
          id: 'test-id',
          name: 'invalid_pillar_name',
          displayName: 'Invalid',
          description: 'Description',
          sortOrder: 1,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        expect(() => {
          Pillar.fromData(dbData);
        }).toThrow('Invalid pillar name from database: invalid_pillar_name');
      });
    });
  });

  describe('Business Logic Methods', () => {
    let pillar: Pillar;

    beforeEach(() => {
      pillar = new Pillar(
        'test-id',
        PillarName.HEAD_GAME,
        'Head Game',
        'Mental health and mindset',
        4,
        true,
        new Date('2024-01-01'),
        new Date('2024-01-01')
      );
    });

    describe('isCoreSystemPillar', () => {
      it('should return true for core system pillars', () => {
        expect(pillar.isCoreSystemPillar()).toBe(true);
      });

      it('should work for all system pillar names', () => {
        Object.values(PillarName).forEach(pillarName => {
          const testPillar = new Pillar(
            'test-id',
            pillarName,
            'Test Name',
            'Test Description',
            1,
            true,
            new Date(),
            new Date()
          );
          expect(testPillar.isCoreSystemPillar()).toBe(true);
        });
      });
    });

    describe('deactivate', () => {
      it('should deactivate an active pillar', () => {
        expect(pillar.isActive).toBe(true);
        
        const deactivatedPillar = pillar.deactivate();
        
        expect(deactivatedPillar.isActive).toBe(false);
        expect(deactivatedPillar.id).toBe(pillar.id);
        expect(deactivatedPillar.name).toBe(pillar.name);
        expect(deactivatedPillar.displayName).toBe(pillar.displayName);
        expect(deactivatedPillar.createdAt).toBe(pillar.createdAt);
        expect(deactivatedPillar.updatedAt).not.toBe(pillar.updatedAt);
      });

      it('should return new instance (immutability)', () => {
        const deactivatedPillar = pillar.deactivate();
        
        expect(deactivatedPillar).not.toBe(pillar);
        expect(pillar.isActive).toBe(true); // Original unchanged
      });
    });

    describe('updateMetadata', () => {
      it('should update display name and description', () => {
        const updatedPillar = pillar.updateMetadata(
          'Mental Health',
          'Updated description for mental health'
        );

        expect(updatedPillar.displayName).toBe('Mental Health');
        expect(updatedPillar.description).toBe('Updated description for mental health');
        expect(updatedPillar.id).toBe(pillar.id);
        expect(updatedPillar.name).toBe(pillar.name);
        expect(updatedPillar.sortOrder).toBe(pillar.sortOrder);
        expect(updatedPillar.isActive).toBe(pillar.isActive);
        expect(updatedPillar.createdAt).toBe(pillar.createdAt);
        expect(updatedPillar.updatedAt).not.toBe(pillar.updatedAt);
      });

      it('should validate display name during update', () => {
        expect(() => {
          pillar.updateMetadata('', 'Valid description');
        }).toThrow('Pillar display name cannot be empty');
      });

      it('should return new instance (immutability)', () => {
        const updatedPillar = pillar.updateMetadata('New Name', 'New Description');
        
        expect(updatedPillar).not.toBe(pillar);
        expect(pillar.displayName).toBe('Head Game'); // Original unchanged
      });
    });
  });

  describe('System Pillars Constants', () => {
    it('should have all required system pillars', () => {
      expect(SYSTEM_PILLARS).toHaveLength(5);
      
      const pillarNames = SYSTEM_PILLARS.map(p => p.name);
      expect(pillarNames).toContain(PillarName.HEALTH_FITNESS);
      expect(pillarNames).toContain(PillarName.WEALTH);
      expect(pillarNames).toContain(PillarName.FAMILY);
      expect(pillarNames).toContain(PillarName.HEAD_GAME);
      expect(pillarNames).toContain(PillarName.CAREER);
    });

    it('should have correct sort orders', () => {
      const sortOrders = SYSTEM_PILLARS.map(p => p.sortOrder);
      expect(sortOrders).toEqual([1, 2, 3, 4, 5]);
    });

    it('should have meaningful display names and descriptions', () => {
      SYSTEM_PILLARS.forEach(pillar => {
        expect(pillar.displayName).toBeTruthy();
        expect(pillar.displayName.length).toBeGreaterThan(0);
        expect(pillar.description).toBeTruthy();
        expect(pillar.description.length).toBeGreaterThan(0);
      });
    });
  });

  describe('createSystemPillars Helper', () => {
    it('should create all system pillars with correct data', () => {
      const systemPillars = createSystemPillars();
      
      expect(systemPillars).toHaveLength(5);
      
      systemPillars.forEach((pillarData, index) => {
        expect(pillarData.name).toBe(SYSTEM_PILLARS[index].name);
        expect(pillarData.displayName).toBe(SYSTEM_PILLARS[index].displayName);
        expect(pillarData.description).toBe(SYSTEM_PILLARS[index].description);
        expect(pillarData.sortOrder).toBe(SYSTEM_PILLARS[index].sortOrder);
        expect(pillarData.isActive).toBe(true);
      });
    });

    it('should create data in correct sort order', () => {
      const systemPillars = createSystemPillars();
      
      for (let i = 1; i < systemPillars.length; i++) {
        expect(systemPillars[i].sortOrder).toBeGreaterThan(systemPillars[i - 1].sortOrder);
      }
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle float sort order validation', () => {
      expect(() => {
        Pillar.createSystem(
          PillarName.CAREER,
          'Career',
          'Description',
          1.5 // Float should be invalid
        );
      }).toThrow('Sort order must be a non-negative integer');
    });

    it('should handle whitespace-only display names', () => {
      expect(() => {
        Pillar.createSystem(
          PillarName.CAREER,
          '   ', // Whitespace only
          'Description',
          1
        );
      }).toThrow('Pillar display name cannot be empty');
    });

    it('should preserve all properties during state changes', () => {
      const originalDate = new Date('2024-01-01');
      const pillar = new Pillar(
        'test-id',
        PillarName.WEALTH,
        'Wealth',
        'Financial goals',
        2,
        true,
        originalDate,
        originalDate
      );

      const deactivated = pillar.deactivate();
      const updated = pillar.updateMetadata('New Wealth', 'New description');

      // Check that unrelated properties are preserved
      expect(deactivated.name).toBe(PillarName.WEALTH);
      expect(deactivated.sortOrder).toBe(2);
      expect(updated.isActive).toBe(true);
      expect(updated.sortOrder).toBe(2);
    });
  });
});


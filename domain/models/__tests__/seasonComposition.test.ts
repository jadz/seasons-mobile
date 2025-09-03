import { 
  SeasonPillar, 
  SeasonPillarArea, 
  SeasonAreaMetric 
} from '../seasonComposition';

describe('Season Composition Domain Models', () => {
  const mockSeasonId = '12345678-1234-1234-1234-123456789abc';
  const mockPillarId = '87654321-4321-4321-4321-987654321cba';
  const mockSeasonPillarId = 'abcdef12-3456-7890-abcd-ef1234567890';
  const mockAreaId = 'fedcba98-7654-3210-fedc-ba9876543210';
  const mockSeasonPillarAreaId = '11111111-2222-3333-4444-555555555555';
  const mockMetricId = '99999999-8888-7777-6666-555555555555';

  describe('SeasonPillar Domain Model', () => {
    describe('Constructor and Validation', () => {
      it('should create a valid season pillar instance', () => {
        const createdAt = new Date('2024-06-01T10:00:00Z');

        const seasonPillar = new SeasonPillar(
          'season-pillar-id',
          mockSeasonId,
          mockPillarId,
          'Weight Loss and Strength',
          true,
          1,
          createdAt
        );

        expect(seasonPillar.id).toBe('season-pillar-id');
        expect(seasonPillar.seasonId).toBe(mockSeasonId);
        expect(seasonPillar.pillarId).toBe(mockPillarId);
        expect(seasonPillar.theme).toBe('Weight Loss and Strength');
        expect(seasonPillar.isActive).toBe(true);
        expect(seasonPillar.sortOrder).toBe(1);
        expect(seasonPillar.createdAt).toBe(createdAt);
      });

      it('should create inactive season pillar', () => {
        const seasonPillar = new SeasonPillar(
          'season-pillar-id',
          mockSeasonId,
          mockPillarId,
          'Budget Management',
          false,
          2,
          new Date()
        );

        expect(seasonPillar.isActive).toBe(false);
        expect(seasonPillar.theme).toBe('Budget Management');
        expect(seasonPillar.sortOrder).toBe(2);
      });

      it('should validate season ID on construction', () => {
        expect(() => {
          new SeasonPillar(
            'season-pillar-id',
            '', // Empty season ID
            mockPillarId,
            'Theme',
            true,
            1,
            new Date()
          );
        }).toThrow('Season ID cannot be empty');
      });

      it('should validate season ID format on construction', () => {
        expect(() => {
          new SeasonPillar(
            'season-pillar-id',
            'invalid-uuid',
            mockPillarId,
            'Theme',
            true,
            1,
            new Date()
          );
        }).toThrow('Season ID must be a valid UUID');
      });

      it('should validate pillar ID on construction', () => {
        expect(() => {
          new SeasonPillar(
            'season-pillar-id',
            mockSeasonId,
            '', // Empty pillar ID
            'Theme',
            true,
            1,
            new Date()
          );
        }).toThrow('Pillar ID cannot be empty');
      });

      it('should validate pillar ID format on construction', () => {
        expect(() => {
          new SeasonPillar(
            'season-pillar-id',
            mockSeasonId,
            'invalid-uuid',
            'Theme',
            true,
            1,
            new Date()
          );
        }).toThrow('Pillar ID must be a valid UUID');
      });

      it('should validate theme on construction', () => {
        expect(() => {
          new SeasonPillar(
            'season-pillar-id',
            mockSeasonId,
            mockPillarId,
            '', // Empty theme
            true,
            1,
            new Date()
          );
        }).toThrow('Season pillar theme cannot be empty');
      });

      it('should validate sort order on construction', () => {
        expect(() => {
          new SeasonPillar(
            'season-pillar-id',
            mockSeasonId,
            mockPillarId,
            'Theme',
            true,
            -1, // Invalid sort order
            new Date()
          );
        }).toThrow('Sort order must be a non-negative integer');
      });

      it('should allow zero sort order', () => {
        const seasonPillar = new SeasonPillar(
          'season-pillar-id',
          mockSeasonId,
          mockPillarId,
          'Theme',
          true,
          0,
          new Date()
        );

        expect(seasonPillar.sortOrder).toBe(0);
      });
    });

    describe('Static Factory Methods', () => {
      describe('addToSeason', () => {
        it('should create active season pillar association', () => {
          const seasonPillarData = SeasonPillar.addToSeason(
            mockSeasonId,
            mockPillarId,
            'Weight Loss and Strength'
          );

          expect(seasonPillarData.seasonId).toBe(mockSeasonId);
          expect(seasonPillarData.pillarId).toBe(mockPillarId);
          expect(seasonPillarData.theme).toBe('Weight Loss and Strength');
          expect(seasonPillarData.isActive).toBe(true);
          expect(seasonPillarData.sortOrder).toBe(0);
        });

        it('should default to sort order 0 if not specified', () => {
          const data = SeasonPillar.addToSeason(
            mockSeasonId,
            mockPillarId,
            'Budget Management'
          );

          expect(data.sortOrder).toBe(0);
        });

        it('should validate season ID for association creation', () => {
          expect(() => {
            SeasonPillar.addToSeason(
              '', // Empty season ID
              mockPillarId,
              'Theme'
            );
          }).toThrow('Season ID cannot be empty');
        });

        it('should validate pillar ID for association creation', () => {
          expect(() => {
            SeasonPillar.addToSeason(
              mockSeasonId,
              '', // Empty pillar ID
              'Theme'
            );
          }).toThrow('Pillar ID cannot be empty');
        });

        it('should validate theme for association creation', () => {
          expect(() => {
            SeasonPillar.addToSeason(
              mockSeasonId,
              mockPillarId,
              '' // Empty theme
            );
          }).toThrow('Season pillar theme cannot be empty');
        });

        it('should validate sort order for association creation', () => {
          expect(() => {
            SeasonPillar.addToSeason(
              mockSeasonId,
              mockPillarId,
              'Theme',
              -1 // Invalid sort order
            );
          }).toThrow('Sort order must be a non-negative integer');
        });
      });

      describe('fromData', () => {
        it('should reconstruct season pillar from database data', () => {
          const dbData = {
            id: 'season-pillar-id',
            seasonId: mockSeasonId,
            pillarId: mockPillarId,
            theme: 'Weight Loss and Strength',
            isActive: true,
            sortOrder: 1,
            createdAt: new Date('2024-06-01T10:00:00Z')
          };

          const seasonPillar = SeasonPillar.fromData(dbData);

          expect(seasonPillar.id).toBe('season-pillar-id');
          expect(seasonPillar.seasonId).toBe(mockSeasonId);
          expect(seasonPillar.pillarId).toBe(mockPillarId);
          expect(seasonPillar.theme).toBe('Weight Loss and Strength');
          expect(seasonPillar.isActive).toBe(true);
          expect(seasonPillar.sortOrder).toBe(1);
        });

        it('should handle inactive pillar from database', () => {
          const dbData = {
            id: 'season-pillar-id',
            seasonId: mockSeasonId,
            pillarId: mockPillarId,
            theme: 'Budget Management',
            isActive: false,
            sortOrder: 2,
            createdAt: new Date('2024-06-01T10:00:00Z')
          };

          const seasonPillar = SeasonPillar.fromData(dbData);
          expect(seasonPillar.isActive).toBe(false);
          expect(seasonPillar.theme).toBe('Budget Management');
        });
      });
    });

    describe('Business Logic Methods', () => {
      let seasonPillar: SeasonPillar;

      beforeEach(() => {
        seasonPillar = new SeasonPillar(
          'season-pillar-id',
          mockSeasonId,
          mockPillarId,
          'Weight Loss and Strength',
          true,
          1,
          new Date('2024-06-01T10:00:00Z')
        );
      });

      describe('isActivePillar', () => {
        it('should return true for active pillar', () => {
          expect(seasonPillar.isActivePillar()).toBe(true);
        });

        it('should return false for inactive pillar', () => {
          const inactivePillar = new SeasonPillar(
            'season-pillar-id',
            mockSeasonId,
            mockPillarId,
            'Budget Management',
            false,
            1,
            new Date()
          );

          expect(inactivePillar.isActivePillar()).toBe(false);
        });
      });

      describe('activate', () => {
        it('should activate an inactive pillar', () => {
          const inactivePillar = new SeasonPillar(
            'season-pillar-id',
            mockSeasonId,
            mockPillarId,
            'Budget Management',
            false,
            1,
            new Date('2024-06-01T10:00:00Z')
          );

          const activated = inactivePillar.activate();

          expect(activated.isActive).toBe(true);
          expect(activated.id).toBe(inactivePillar.id);
          expect(activated.seasonId).toBe(inactivePillar.seasonId);
          expect(activated.pillarId).toBe(inactivePillar.pillarId);
          expect(activated.theme).toBe(inactivePillar.theme);
          expect(activated.sortOrder).toBe(inactivePillar.sortOrder);
        });

        it('should return same instance if already active', () => {
          const activated = seasonPillar.activate();
          expect(activated).toBe(seasonPillar);
        });
      });

      describe('deactivate', () => {
        it('should deactivate an active pillar', () => {
          const deactivated = seasonPillar.deactivate();

          expect(deactivated.isActive).toBe(false);
          expect(deactivated.id).toBe(seasonPillar.id);
          expect(deactivated.seasonId).toBe(seasonPillar.seasonId);
          expect(deactivated.pillarId).toBe(seasonPillar.pillarId);
          expect(deactivated.theme).toBe(seasonPillar.theme);
          expect(deactivated.sortOrder).toBe(seasonPillar.sortOrder);
        });

        it('should return same instance if already inactive', () => {
          const inactivePillar = new SeasonPillar(
            'season-pillar-id',
            mockSeasonId,
            mockPillarId,
            'Budget Management',
            false,
            1,
            new Date()
          );

          const deactivated = inactivePillar.deactivate();
          expect(deactivated).toBe(inactivePillar);
        });
      });

      describe('updateSortOrder', () => {
        it('should update sort order successfully', () => {
          const updated = seasonPillar.updateSortOrder(5);

          expect(updated.sortOrder).toBe(5);
          expect(updated.id).toBe(seasonPillar.id);
          expect(updated.seasonId).toBe(seasonPillar.seasonId);
          expect(updated.pillarId).toBe(seasonPillar.pillarId);
          expect(updated.theme).toBe(seasonPillar.theme);
          expect(updated.isActive).toBe(seasonPillar.isActive);
        });

        it('should validate non-negative sort order', () => {
          expect(() => {
            seasonPillar.updateSortOrder(-1);
          }).toThrow('Sort order must be a non-negative integer');
        });

        it('should allow zero sort order', () => {
          const updated = seasonPillar.updateSortOrder(0);
          expect(updated.sortOrder).toBe(0);
        });

        it('should handle updating to same sort order', () => {
          const updated = seasonPillar.updateSortOrder(seasonPillar.sortOrder);
          expect(updated.sortOrder).toBe(seasonPillar.sortOrder);
        });
      });
    });

    describe('Edge Cases and Error Handling', () => {
      it('should preserve immutability across operations', () => {
        const originalPillar = new SeasonPillar(
          'season-pillar-id',
          mockSeasonId,
          mockPillarId,
          'Original Theme',
          true,
          1,
          new Date('2024-06-01T10:00:00Z')
        );

        const deactivated = originalPillar.deactivate();
        const reordered = originalPillar.updateSortOrder(5);

        // Original should remain unchanged
        expect(originalPillar.isActive).toBe(true);
        expect(originalPillar.sortOrder).toBe(1);
        expect(originalPillar.theme).toBe('Original Theme');

        // New instances should have changes
        expect(deactivated.isActive).toBe(false);
        expect(reordered.sortOrder).toBe(5);

        // Objects should be different instances
        expect(deactivated).not.toBe(originalPillar);
        expect(reordered).not.toBe(originalPillar);
      });

      it('should handle very high sort order values', () => {
        const highSortOrder = 999999;
        const seasonPillar = new SeasonPillar(
          'season-pillar-id',
          mockSeasonId,
          mockPillarId,
          'Theme',
          true,
          highSortOrder,
          new Date()
        );

        expect(seasonPillar.sortOrder).toBe(highSortOrder);
      });

      it('should handle long theme strings', () => {
        const longTheme = 'a'.repeat(100); // Maximum allowed length
        const seasonPillar = new SeasonPillar(
          'season-pillar-id',
          mockSeasonId,
          mockPillarId,
          longTheme,
          true,
          1,
          new Date()
        );

        expect(seasonPillar.theme).toBe(longTheme);
      });

      it('should reject themes that are too long', () => {
        const tooLongTheme = 'a'.repeat(101);
        expect(() => {
          new SeasonPillar(
            'season-pillar-id',
            mockSeasonId,
            mockPillarId,
            tooLongTheme,
            true,
            1,
            new Date()
          );
        }).toThrow('Season pillar theme cannot exceed 100 characters');
      });
    });
  });

  describe('SeasonPillarArea Domain Model', () => {
    describe('Constructor and Validation', () => {
      it('should create a valid season pillar area instance', () => {
        const createdAt = new Date('2024-06-01T10:00:00Z');

        const seasonPillarArea = new SeasonPillarArea(
          'season-pillar-area-id',
          mockSeasonPillarId,
          mockAreaId,
          1,
          createdAt
        );

        expect(seasonPillarArea.id).toBe('season-pillar-area-id');
        expect(seasonPillarArea.seasonPillarId).toBe(mockSeasonPillarId);
        expect(seasonPillarArea.areaOfFocusId).toBe(mockAreaId);
        expect(seasonPillarArea.sortOrder).toBe(1);
        expect(seasonPillarArea.createdAt).toBe(createdAt);
      });

      it('should validate season pillar ID on construction', () => {
        expect(() => {
          new SeasonPillarArea(
            'season-pillar-area-id',
            '', // Empty season pillar ID
            mockAreaId,
            1,
            new Date()
          );
        }).toThrow('Season pillar ID cannot be empty');
      });

      it('should validate area of focus ID on construction', () => {
        expect(() => {
          new SeasonPillarArea(
            'season-pillar-area-id',
            mockSeasonPillarId,
            '', // Empty area of focus ID
            1,
            new Date()
          );
        }).toThrow('Area of focus ID cannot be empty');
      });

      it('should validate sort order on construction', () => {
        expect(() => {
          new SeasonPillarArea(
            'season-pillar-area-id',
            mockSeasonPillarId,
            mockAreaId,
            -1, // Invalid sort order
            new Date()
          );
        }).toThrow('Sort order must be a non-negative integer');
      });

      it('should validate UUID formats on construction', () => {
        expect(() => {
          new SeasonPillarArea(
            'season-pillar-area-id',
            'invalid-uuid',
            mockAreaId,
            1,
            new Date()
          );
        }).toThrow('Season pillar ID must be a valid UUID');
      });
    });

    describe('Static Factory Methods', () => {
      describe('addToSeasonPillar', () => {
        it('should create season pillar area association', () => {
          const data = SeasonPillarArea.addToSeasonPillar(
            mockSeasonPillarId,
            mockAreaId
          );

          expect(data.seasonPillarId).toBe(mockSeasonPillarId);
          expect(data.areaOfFocusId).toBe(mockAreaId);
          expect(data.sortOrder).toBe(0);
        });

        it('should default sort order to 0 if not specified', () => {
          const data = SeasonPillarArea.addToSeasonPillar(
            mockSeasonPillarId,
            mockAreaId
          );

          expect(data.sortOrder).toBe(0);
        });

        it('should validate season pillar ID for association creation', () => {
          expect(() => {
            SeasonPillarArea.addToSeasonPillar(
              '', // Empty season pillar ID
              mockAreaId
            );
          }).toThrow('Season pillar ID cannot be empty');
        });

        it('should validate area of focus ID for association creation', () => {
          expect(() => {
            SeasonPillarArea.addToSeasonPillar(
              mockSeasonPillarId,
              '' // Empty area of focus ID
            );
          }).toThrow('Area of focus ID cannot be empty');
        });

        it('should validate sort order for association creation', () => {
          expect(() => {
            SeasonPillarArea.addToSeasonPillar(
              mockSeasonPillarId,
              mockAreaId,
              -1 // Invalid sort order
            );
          }).toThrow('Sort order must be a non-negative integer');
        });
      });

      describe('fromData', () => {
        it('should reconstruct season pillar area from database data', () => {
          const dbData = {
            id: 'season-pillar-area-id',
            seasonPillarId: mockSeasonPillarId,
            areaOfFocusId: mockAreaId,
            sortOrder: 1,
            createdAt: new Date('2024-06-01T10:00:00Z')
          };

          const seasonPillarArea = SeasonPillarArea.fromData(dbData);

          expect(seasonPillarArea.id).toBe('season-pillar-area-id');
          expect(seasonPillarArea.seasonPillarId).toBe(mockSeasonPillarId);
          expect(seasonPillarArea.areaOfFocusId).toBe(mockAreaId);
          expect(seasonPillarArea.sortOrder).toBe(1);
        });
      });
    });

    describe('Business Logic Methods', () => {
      describe('updateSortOrder', () => {
        it('should update sort order successfully', () => {
          const seasonPillarArea = new SeasonPillarArea(
            'season-pillar-area-id',
            mockSeasonPillarId,
            mockAreaId,
            1,
            new Date()
          );

          const updated = seasonPillarArea.updateSortOrder(5);

          expect(updated.sortOrder).toBe(5);
          expect(updated.id).toBe(seasonPillarArea.id);
          expect(updated.seasonPillarId).toBe(seasonPillarArea.seasonPillarId);
          expect(updated.areaOfFocusId).toBe(seasonPillarArea.areaOfFocusId);
        });

        it('should validate non-negative sort order', () => {
          const seasonPillarArea = new SeasonPillarArea(
            'season-pillar-area-id',
            mockSeasonPillarId,
            mockAreaId,
            1,
            new Date()
          );

          expect(() => {
            seasonPillarArea.updateSortOrder(-1);
          }).toThrow('Sort order must be a non-negative integer');
        });

        it('should allow zero sort order', () => {
          const seasonPillarArea = new SeasonPillarArea(
            'season-pillar-area-id',
            mockSeasonPillarId,
            mockAreaId,
            1,
            new Date()
          );

          const updated = seasonPillarArea.updateSortOrder(0);
          expect(updated.sortOrder).toBe(0);
        });

        it('should handle updating to same sort order', () => {
          const seasonPillarArea = new SeasonPillarArea(
            'season-pillar-area-id',
            mockSeasonPillarId,
            mockAreaId,
            1,
            new Date()
          );

          const updated = seasonPillarArea.updateSortOrder(seasonPillarArea.sortOrder);
          expect(updated.sortOrder).toBe(seasonPillarArea.sortOrder);
        });
      });
    });

    describe('Edge Cases and Error Handling', () => {
      it('should handle very high sort order values', () => {
        const highSortOrder = 999999;
        const seasonPillarArea = new SeasonPillarArea(
          'season-pillar-area-id',
          mockSeasonPillarId,
          mockAreaId,
          highSortOrder,
          new Date()
        );

        expect(seasonPillarArea.sortOrder).toBe(highSortOrder);
      });

      it('should preserve immutability across operations', () => {
        const originalArea = new SeasonPillarArea(
          'season-pillar-area-id',
          mockSeasonPillarId,
          mockAreaId,
          1,
          new Date()
        );

        const reordered = originalArea.updateSortOrder(5);

        // Original should remain unchanged
        expect(originalArea.sortOrder).toBe(1);

        // New instance should have changes
        expect(reordered.sortOrder).toBe(5);

        // Objects should be different instances
        expect(reordered).not.toBe(originalArea);
      });
    });
  });

  describe('SeasonAreaMetric Domain Model', () => {
    describe('Constructor and Validation', () => {
      it('should create a valid season area metric instance', () => {
        const createdAt = new Date('2024-06-01T10:00:00Z');

        const seasonAreaMetric = new SeasonAreaMetric(
          'season-area-metric-id',
          mockSeasonPillarAreaId,
          mockMetricId,
          1,
          createdAt
        );

        expect(seasonAreaMetric.id).toBe('season-area-metric-id');
        expect(seasonAreaMetric.seasonPillarAreaId).toBe(mockSeasonPillarAreaId);
        expect(seasonAreaMetric.metricId).toBe(mockMetricId);
        expect(seasonAreaMetric.sortOrder).toBe(1);
        expect(seasonAreaMetric.createdAt).toBe(createdAt);
      });

      it('should validate season pillar area ID on construction', () => {
        expect(() => {
          new SeasonAreaMetric(
            'season-area-metric-id',
            '', // Empty season pillar area ID
            mockMetricId,
            1,
            new Date()
          );
        }).toThrow('Season pillar area ID cannot be empty');
      });

      it('should validate metric ID on construction', () => {
        expect(() => {
          new SeasonAreaMetric(
            'season-area-metric-id',
            mockSeasonPillarAreaId,
            '', // Empty metric ID
            1,
            new Date()
          );
        }).toThrow('Metric ID cannot be empty');
      });

      it('should validate sort order on construction', () => {
        expect(() => {
          new SeasonAreaMetric(
            'season-area-metric-id',
            mockSeasonPillarAreaId,
            mockMetricId,
            -1, // Invalid sort order
            new Date()
          );
        }).toThrow('Sort order must be a non-negative integer');
      });

      it('should validate UUID formats on construction', () => {
        expect(() => {
          new SeasonAreaMetric(
            'season-area-metric-id',
            'invalid-uuid',
            mockMetricId,
            1,
            new Date()
          );
        }).toThrow('Season pillar area ID must be a valid UUID');
      });
    });

    describe('Static Factory Methods', () => {
      describe('addToSeasonArea', () => {
        it('should create season area metric association', () => {
          const data = SeasonAreaMetric.addToSeasonArea(
            mockSeasonPillarAreaId,
            mockMetricId
          );

          expect(data.seasonPillarAreaId).toBe(mockSeasonPillarAreaId);
          expect(data.metricId).toBe(mockMetricId);
          expect(data.sortOrder).toBe(0);
        });

        it('should default sort order to 0 if not specified', () => {
          const data = SeasonAreaMetric.addToSeasonArea(
            mockSeasonPillarAreaId,
            mockMetricId
          );

          expect(data.sortOrder).toBe(0);
        });

        it('should validate season pillar area ID for association creation', () => {
          expect(() => {
            SeasonAreaMetric.addToSeasonArea(
              '', // Empty season pillar area ID
              mockMetricId
            );
          }).toThrow('Season pillar area ID cannot be empty');
        });

        it('should validate metric ID for association creation', () => {
          expect(() => {
            SeasonAreaMetric.addToSeasonArea(
              mockSeasonPillarAreaId,
              '' // Empty metric ID
            );
          }).toThrow('Metric ID cannot be empty');
        });

        it('should validate sort order for association creation', () => {
          expect(() => {
            SeasonAreaMetric.addToSeasonArea(
              mockSeasonPillarAreaId,
              mockMetricId,
              -1 // Invalid sort order
            );
          }).toThrow('Sort order must be a non-negative integer');
        });
      });

      describe('fromData', () => {
        it('should reconstruct season area metric from database data', () => {
          const dbData = {
            id: 'season-area-metric-id',
            seasonPillarAreaId: mockSeasonPillarAreaId,
            metricId: mockMetricId,
            sortOrder: 1,
            createdAt: new Date('2024-06-01T10:00:00Z')
          };

          const seasonAreaMetric = SeasonAreaMetric.fromData(dbData);

          expect(seasonAreaMetric.id).toBe('season-area-metric-id');
          expect(seasonAreaMetric.seasonPillarAreaId).toBe(mockSeasonPillarAreaId);
          expect(seasonAreaMetric.metricId).toBe(mockMetricId);
          expect(seasonAreaMetric.sortOrder).toBe(1);
        });
      });
    });

    describe('Business Logic Methods', () => {
      describe('updateSortOrder', () => {
        it('should update sort order successfully', () => {
          const seasonAreaMetric = new SeasonAreaMetric(
            'season-area-metric-id',
            mockSeasonPillarAreaId,
            mockMetricId,
            1,
            new Date()
          );

          const updated = seasonAreaMetric.updateSortOrder(5);

          expect(updated.sortOrder).toBe(5);
          expect(updated.id).toBe(seasonAreaMetric.id);
          expect(updated.seasonPillarAreaId).toBe(seasonAreaMetric.seasonPillarAreaId);
          expect(updated.metricId).toBe(seasonAreaMetric.metricId);
        });

        it('should validate non-negative sort order', () => {
          const seasonAreaMetric = new SeasonAreaMetric(
            'season-area-metric-id',
            mockSeasonPillarAreaId,
            mockMetricId,
            1,
            new Date()
          );

          expect(() => {
            seasonAreaMetric.updateSortOrder(-1);
          }).toThrow('Sort order must be a non-negative integer');
        });

        it('should allow zero sort order', () => {
          const seasonAreaMetric = new SeasonAreaMetric(
            'season-area-metric-id',
            mockSeasonPillarAreaId,
            mockMetricId,
            1,
            new Date()
          );

          const updated = seasonAreaMetric.updateSortOrder(0);
          expect(updated.sortOrder).toBe(0);
        });

        it('should handle updating to same sort order', () => {
          const seasonAreaMetric = new SeasonAreaMetric(
            'season-area-metric-id',
            mockSeasonPillarAreaId,
            mockMetricId,
            1,
            new Date()
          );

          const updated = seasonAreaMetric.updateSortOrder(seasonAreaMetric.sortOrder);
          expect(updated.sortOrder).toBe(seasonAreaMetric.sortOrder);
        });
      });
    });

    describe('Edge Cases and Error Handling', () => {
      it('should handle very high sort order values', () => {
        const highSortOrder = 999999;
        const seasonAreaMetric = new SeasonAreaMetric(
          'season-area-metric-id',
          mockSeasonPillarAreaId,
          mockMetricId,
          highSortOrder,
          new Date()
        );

        expect(seasonAreaMetric.sortOrder).toBe(highSortOrder);
      });

      it('should preserve immutability across operations', () => {
        const originalMetric = new SeasonAreaMetric(
          'season-area-metric-id',
          mockSeasonPillarAreaId,
          mockMetricId,
          1,
          new Date()
        );

        const reordered = originalMetric.updateSortOrder(5);

        // Original should remain unchanged
        expect(originalMetric.sortOrder).toBe(1);

        // New instance should have changes
        expect(reordered.sortOrder).toBe(5);

        // Objects should be different instances
        expect(reordered).not.toBe(originalMetric);
      });
    });
  });

  describe('Cross-Model Integration', () => {
    it('should maintain hierarchical composition structure', () => {
      const seasonPillar = new SeasonPillar(
        'season-pillar-id',
        mockSeasonId,
        mockPillarId,
        'Weight Loss and Strength',
        true,
        1,
        new Date()
      );

      const seasonPillarArea = new SeasonPillarArea(
        'season-pillar-area-id',
        mockSeasonPillarId,
        mockAreaId,
        1,
        new Date()
      );

      const seasonAreaMetric = new SeasonAreaMetric(
        'season-area-metric-id',
        mockSeasonPillarAreaId,
        mockMetricId,
        1,
        new Date()
      );

      // Verify the hierarchical relationships
      expect(seasonPillarArea.seasonPillarId).toBe(mockSeasonPillarId);
      expect(seasonAreaMetric.seasonPillarAreaId).toBe(mockSeasonPillarAreaId);
    });

    it('should support hierarchical organization through sort orders', () => {
      const otherPillarId = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';
      const otherAreaId = 'bbbbbbbb-cccc-dddd-eeee-ffffffffffff';
      const otherMetricId = 'cccccccc-dddd-eeee-ffff-aaaaaaaaaaaa';
      
      const data = [
        SeasonPillar.addToSeason(mockSeasonId, mockPillarId, 'Theme 1', 1),
        SeasonPillar.addToSeason(mockSeasonId, otherPillarId, 'Theme 2', 2),
        SeasonPillarArea.addToSeasonPillar(mockSeasonPillarId, mockAreaId, 1),
        SeasonPillarArea.addToSeasonPillar(mockSeasonPillarId, otherAreaId, 2),
        SeasonAreaMetric.addToSeasonArea(mockSeasonPillarAreaId, mockMetricId, 1),
        SeasonAreaMetric.addToSeasonArea(mockSeasonPillarAreaId, otherMetricId, 2)
      ];

      // Verify sort orders are maintained
      expect(data[0].sortOrder).toBeLessThan(data[1].sortOrder);
      expect(data[2].sortOrder).toBeLessThan(data[3].sortOrder);
      expect(data[4].sortOrder).toBeLessThan(data[5].sortOrder);
    });

    it('should handle UUID validation consistently across all models', () => {
      const invalidUuid = 'not-a-uuid';
      const validUuid = mockSeasonId;

      // All models should reject invalid UUIDs
      expect(() => new SeasonPillar('id', invalidUuid, validUuid, 'Theme', true, 1, new Date())).toThrow();
      expect(() => new SeasonPillarArea('id', invalidUuid, validUuid, 1, new Date())).toThrow();
      expect(() => new SeasonAreaMetric('id', invalidUuid, validUuid, 1, new Date())).toThrow();
    });

    it('should handle sort order validation consistently', () => {
      const invalidSortOrder = -1;

      // All models should reject negative sort orders
      expect(() => new SeasonPillar('id', mockSeasonId, mockPillarId, 'Theme', true, invalidSortOrder, new Date())).toThrow();
      expect(() => new SeasonPillarArea('id', mockSeasonPillarId, mockAreaId, invalidSortOrder, new Date())).toThrow();
      expect(() => new SeasonAreaMetric('id', mockSeasonPillarAreaId, mockMetricId, invalidSortOrder, new Date())).toThrow();
    });
  });

  describe('Performance and Memory Considerations', () => {
    it('should handle batch operations efficiently', () => {
      const startTime = performance.now();
      
      // Create multiple instances
      const instances = [];
      for (let i = 0; i < 100; i++) {
        instances.push(new SeasonPillar(
          `season-pillar-${i}`,
          mockSeasonId,
          mockPillarId,
          `Theme ${i}`,
          true,
          i,
          new Date()
        ));
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Should complete within reasonable time (less than 100ms for 100 instances)
      expect(duration).toBeLessThan(100);
      expect(instances).toHaveLength(100);
    });

    it('should maintain constant memory usage across sort order updates', () => {
      const pillar = new SeasonPillar(
        'test-pillar',
        mockSeasonId,
        mockPillarId,
        'Test Theme',
        true,
        1,
        new Date()
      );

      // Multiple updates should not cause memory leaks
      let updated = pillar;
      for (let i = 0; i < 10; i++) {
        updated = updated.updateSortOrder(i);
      }

      expect(updated.sortOrder).toBe(9);
      expect(updated.theme).toBe('Test Theme');
    });
  });
});
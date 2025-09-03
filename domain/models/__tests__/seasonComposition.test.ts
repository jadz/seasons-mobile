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
          true,
          1,
          createdAt
        );

        expect(seasonPillar.id).toBe('season-pillar-id');
        expect(seasonPillar.seasonId).toBe(mockSeasonId);
        expect(seasonPillar.pillarId).toBe(mockPillarId);
        expect(seasonPillar.isActive).toBe(true);
        expect(seasonPillar.sortOrder).toBe(1);
        expect(seasonPillar.createdAt).toBe(createdAt);
      });

      it('should create inactive season pillar', () => {
        const seasonPillar = new SeasonPillar(
          'season-pillar-id',
          mockSeasonId,
          mockPillarId,
          false,
          2,
          new Date()
        );

        expect(seasonPillar.isActive).toBe(false);
        expect(seasonPillar.sortOrder).toBe(2);
      });

      it('should validate season ID on construction', () => {
        expect(() => {
          new SeasonPillar(
            'season-pillar-id',
            '', // Empty season ID
            mockPillarId,
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
            'invalid-uuid', // Invalid UUID
            mockPillarId,
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
            'invalid-uuid', // Invalid UUID
            true,
            1,
            new Date()
          );
        }).toThrow('Pillar ID must be a valid UUID');
      });

      it('should validate sort order on construction', () => {
        expect(() => {
          new SeasonPillar(
            'season-pillar-id',
            mockSeasonId,
            mockPillarId,
            true,
            -1, // Invalid sort order
            new Date()
          );
        }).toThrow('Sort order must be a non-negative integer');
      });

      it('should allow zero sort order', () => {
        expect(() => {
          new SeasonPillar(
            'season-pillar-id',
            mockSeasonId,
            mockPillarId,
            true,
            0, // Zero is valid
            new Date()
          );
        }).not.toThrow();
      });
    });

    describe('Static Factory Methods', () => {
      describe('addToSeason', () => {
        it('should create active season pillar association', () => {
          const seasonPillarData = SeasonPillar.addToSeason(
            mockSeasonId,
            mockPillarId,
            3
          );

          expect(seasonPillarData.seasonId).toBe(mockSeasonId);
          expect(seasonPillarData.pillarId).toBe(mockPillarId);
          expect(seasonPillarData.isActive).toBe(true);
          expect(seasonPillarData.sortOrder).toBe(3);
        });

        it('should default to sort order 0 if not specified', () => {
          const seasonPillarData = SeasonPillar.addToSeason(
            mockSeasonId,
            mockPillarId
          );

          expect(seasonPillarData.sortOrder).toBe(0);
          expect(seasonPillarData.isActive).toBe(true);
        });

        it('should validate season ID for association creation', () => {
          expect(() => {
            SeasonPillar.addToSeason(
              'invalid-uuid',
              mockPillarId
            );
          }).toThrow('Season ID must be a valid UUID');
        });

        it('should validate pillar ID for association creation', () => {
          expect(() => {
            SeasonPillar.addToSeason(
              mockSeasonId,
              'invalid-uuid'
            );
          }).toThrow('Pillar ID must be a valid UUID');
        });

        it('should validate sort order for association creation', () => {
          expect(() => {
            SeasonPillar.addToSeason(
              mockSeasonId,
              mockPillarId,
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
            isActive: true,
            sortOrder: 2,
            createdAt: new Date('2024-06-01T10:00:00Z')
          };

          const seasonPillar = SeasonPillar.fromData(dbData);

          expect(seasonPillar.id).toBe('season-pillar-id');
          expect(seasonPillar.seasonId).toBe(mockSeasonId);
          expect(seasonPillar.pillarId).toBe(mockPillarId);
          expect(seasonPillar.isActive).toBe(true);
          expect(seasonPillar.sortOrder).toBe(2);
        });

        it('should handle inactive pillar from database', () => {
          const dbData = {
            id: 'season-pillar-id',
            seasonId: mockSeasonId,
            pillarId: mockPillarId,
            isActive: false,
            sortOrder: 0,
            createdAt: new Date()
          };

          const seasonPillar = SeasonPillar.fromData(dbData);

          expect(seasonPillar.isActive).toBe(false);
          expect(seasonPillar.sortOrder).toBe(0);
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
            false,
            1,
            new Date('2024-06-01T10:00:00Z')
          );

          const activatedPillar = inactivePillar.activate();

          expect(activatedPillar.isActive).toBe(true);
          expect(activatedPillar.id).toBe(inactivePillar.id);
          expect(activatedPillar.seasonId).toBe(inactivePillar.seasonId);
          expect(activatedPillar.pillarId).toBe(inactivePillar.pillarId);
          expect(activatedPillar.sortOrder).toBe(inactivePillar.sortOrder);
          expect(activatedPillar.createdAt).toBe(inactivePillar.createdAt);
        });

        it('should return same instance if already active', () => {
          const activatedPillar = seasonPillar.activate();

          expect(activatedPillar).toBe(seasonPillar);
          expect(activatedPillar.isActive).toBe(true);
        });
      });

      describe('deactivate', () => {
        it('should deactivate an active pillar', () => {
          const deactivatedPillar = seasonPillar.deactivate();

          expect(deactivatedPillar.isActive).toBe(false);
          expect(deactivatedPillar.id).toBe(seasonPillar.id);
          expect(deactivatedPillar.seasonId).toBe(seasonPillar.seasonId);
          expect(deactivatedPillar.pillarId).toBe(seasonPillar.pillarId);
          expect(deactivatedPillar.sortOrder).toBe(seasonPillar.sortOrder);
          expect(deactivatedPillar.createdAt).toBe(seasonPillar.createdAt);
        });

        it('should return same instance if already inactive', () => {
          const inactivePillar = seasonPillar.deactivate();
          const deactivatedAgain = inactivePillar.deactivate();

          expect(deactivatedAgain).toBe(inactivePillar);
          expect(deactivatedAgain.isActive).toBe(false);
        });
      });

      describe('updateSortOrder', () => {
        it('should update sort order successfully', () => {
          const updatedPillar = seasonPillar.updateSortOrder(5);

          expect(updatedPillar.sortOrder).toBe(5);
          expect(updatedPillar.id).toBe(seasonPillar.id);
          expect(updatedPillar.seasonId).toBe(seasonPillar.seasonId);
          expect(updatedPillar.pillarId).toBe(seasonPillar.pillarId);
          expect(updatedPillar.isActive).toBe(seasonPillar.isActive);
          expect(updatedPillar.createdAt).toBe(seasonPillar.createdAt);
        });

        it('should validate non-negative sort order', () => {
          expect(() => {
            seasonPillar.updateSortOrder(-1);
          }).toThrow('Sort order must be a non-negative integer');
        });

        it('should allow zero sort order', () => {
          expect(() => {
            seasonPillar.updateSortOrder(0);
          }).not.toThrow();
        });

        it('should handle updating to same sort order', () => {
          const updatedPillar = seasonPillar.updateSortOrder(1);

          expect(updatedPillar.sortOrder).toBe(1);
          expect(updatedPillar.id).toBe(seasonPillar.id);
        });
      });
    });

    describe('Edge Cases and Error Handling', () => {
      it('should preserve immutability across operations', () => {
        const originalPillar = new SeasonPillar(
          'season-pillar-id',
          mockSeasonId,
          mockPillarId,
          true,
          1,
          new Date('2024-06-01T10:00:00Z')
        );

        const deactivatedPillar = originalPillar.deactivate();
        const reactivatedPillar = deactivatedPillar.activate();
        const reorderedPillar = reactivatedPillar.updateSortOrder(3);

        // Original should be unchanged
        expect(originalPillar.isActive).toBe(true);
        expect(originalPillar.sortOrder).toBe(1);

        // Each step should be independent
        expect(deactivatedPillar.isActive).toBe(false);
        expect(reactivatedPillar.isActive).toBe(true);
        expect(reorderedPillar.sortOrder).toBe(3);
      });

      it('should handle very high sort order values', () => {
        const highSortOrder = 999999;
        const data = SeasonPillar.addToSeason(
          mockSeasonId,
          mockPillarId,
          highSortOrder
        );

        expect(data.sortOrder).toBe(highSortOrder);
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
          2,
          createdAt
        );

        expect(seasonPillarArea.id).toBe('season-pillar-area-id');
        expect(seasonPillarArea.seasonPillarId).toBe(mockSeasonPillarId);
        expect(seasonPillarArea.areaOfFocusId).toBe(mockAreaId);
        expect(seasonPillarArea.sortOrder).toBe(2);
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
            '', // Empty area ID
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
        const invalidUuids = ['invalid-uuid', '123', ''];
        
        invalidUuids.forEach(invalidUuid => {
          expect(() => {
            new SeasonPillarArea(
              'season-pillar-area-id',
              invalidUuid,
              mockAreaId,
              1,
              new Date()
            );
          }).toThrow();
        });
      });
    });

    describe('Static Factory Methods', () => {
      describe('addToSeasonPillar', () => {
        it('should create season pillar area association', () => {
          const associationData = SeasonPillarArea.addToSeasonPillar(
            mockSeasonPillarId,
            mockAreaId,
            3
          );

          expect(associationData.seasonPillarId).toBe(mockSeasonPillarId);
          expect(associationData.areaOfFocusId).toBe(mockAreaId);
          expect(associationData.sortOrder).toBe(3);
        });

        it('should default sort order to 0 if not specified', () => {
          const associationData = SeasonPillarArea.addToSeasonPillar(
            mockSeasonPillarId,
            mockAreaId
          );

          expect(associationData.sortOrder).toBe(0);
        });

        it('should validate season pillar ID for association creation', () => {
          expect(() => {
            SeasonPillarArea.addToSeasonPillar(
              'invalid-uuid',
              mockAreaId
            );
          }).toThrow('Season pillar ID must be a valid UUID');
        });

        it('should validate area of focus ID for association creation', () => {
          expect(() => {
            SeasonPillarArea.addToSeasonPillar(
              mockSeasonPillarId,
              'invalid-uuid'
            );
          }).toThrow('Area of focus ID must be a valid UUID');
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
            sortOrder: 2,
            createdAt: new Date('2024-06-01T10:00:00Z')
          };

          const seasonPillarArea = SeasonPillarArea.fromData(dbData);

          expect(seasonPillarArea.id).toBe('season-pillar-area-id');
          expect(seasonPillarArea.seasonPillarId).toBe(mockSeasonPillarId);
          expect(seasonPillarArea.areaOfFocusId).toBe(mockAreaId);
          expect(seasonPillarArea.sortOrder).toBe(2);
        });
      });
    });

    describe('Business Logic Methods', () => {
      let seasonPillarArea: SeasonPillarArea;

      beforeEach(() => {
        seasonPillarArea = new SeasonPillarArea(
          'season-pillar-area-id',
          mockSeasonPillarId,
          mockAreaId,
          3,
          new Date('2024-06-01T10:00:00Z')
        );
      });

      describe('updateSortOrder', () => {
        it('should update sort order successfully', () => {
          const updatedArea = seasonPillarArea.updateSortOrder(7);

          expect(updatedArea.sortOrder).toBe(7);
          expect(updatedArea.id).toBe(seasonPillarArea.id);
          expect(updatedArea.seasonPillarId).toBe(seasonPillarArea.seasonPillarId);
          expect(updatedArea.areaOfFocusId).toBe(seasonPillarArea.areaOfFocusId);
          expect(updatedArea.createdAt).toBe(seasonPillarArea.createdAt);
        });

        it('should validate non-negative sort order', () => {
          expect(() => {
            seasonPillarArea.updateSortOrder(-1);
          }).toThrow('Sort order must be a non-negative integer');
        });

        it('should allow zero sort order', () => {
          expect(() => {
            seasonPillarArea.updateSortOrder(0);
          }).not.toThrow();
        });

        it('should handle updating to same sort order', () => {
          const updatedArea = seasonPillarArea.updateSortOrder(3);

          expect(updatedArea.sortOrder).toBe(3);
          expect(updatedArea.id).toBe(seasonPillarArea.id);
        });
      });
    });

    describe('Edge Cases and Error Handling', () => {
      it('should handle very high sort order values', () => {
        const highSortOrder = 1000000;
        const associationData = SeasonPillarArea.addToSeasonPillar(
          mockSeasonPillarId,
          mockAreaId,
          highSortOrder
        );

        expect(associationData.sortOrder).toBe(highSortOrder);
      });

      it('should preserve immutability across operations', () => {
        const originalArea = new SeasonPillarArea(
          'season-pillar-area-id',
          mockSeasonPillarId,
          mockAreaId,
          3,
          new Date('2024-06-01T10:00:00Z')
        );

        const updatedArea = originalArea.updateSortOrder(5);

        // Original should be unchanged
        expect(originalArea.sortOrder).toBe(3);
        expect(updatedArea.sortOrder).toBe(5);
        expect(updatedArea).not.toBe(originalArea);
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
          4,
          createdAt
        );

        expect(seasonAreaMetric.id).toBe('season-area-metric-id');
        expect(seasonAreaMetric.seasonPillarAreaId).toBe(mockSeasonPillarAreaId);
        expect(seasonAreaMetric.metricId).toBe(mockMetricId);
        expect(seasonAreaMetric.sortOrder).toBe(4);
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
        const invalidUuids = ['invalid-uuid', '123', ''];
        
        invalidUuids.forEach(invalidUuid => {
          expect(() => {
            new SeasonAreaMetric(
              'season-area-metric-id',
              invalidUuid,
              mockMetricId,
              1,
              new Date()
            );
          }).toThrow();
        });
      });
    });

    describe('Static Factory Methods', () => {
      describe('addToSeasonArea', () => {
        it('should create season area metric association', () => {
          const associationData = SeasonAreaMetric.addToSeasonArea(
            mockSeasonPillarAreaId,
            mockMetricId,
            6
          );

          expect(associationData.seasonPillarAreaId).toBe(mockSeasonPillarAreaId);
          expect(associationData.metricId).toBe(mockMetricId);
          expect(associationData.sortOrder).toBe(6);
        });

        it('should default sort order to 0 if not specified', () => {
          const associationData = SeasonAreaMetric.addToSeasonArea(
            mockSeasonPillarAreaId,
            mockMetricId
          );

          expect(associationData.sortOrder).toBe(0);
        });

        it('should validate season pillar area ID for association creation', () => {
          expect(() => {
            SeasonAreaMetric.addToSeasonArea(
              'invalid-uuid',
              mockMetricId
            );
          }).toThrow('Season pillar area ID must be a valid UUID');
        });

        it('should validate metric ID for association creation', () => {
          expect(() => {
            SeasonAreaMetric.addToSeasonArea(
              mockSeasonPillarAreaId,
              'invalid-uuid'
            );
          }).toThrow('Metric ID must be a valid UUID');
        });

        it('should validate sort order for association creation', () => {
          expect(() => {
            SeasonAreaMetric.addToSeasonArea(
              mockSeasonPillarAreaId,
              mockMetricId,
              -2 // Invalid sort order
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
            sortOrder: 6,
            createdAt: new Date('2024-06-01T10:00:00Z')
          };

          const seasonAreaMetric = SeasonAreaMetric.fromData(dbData);

          expect(seasonAreaMetric.id).toBe('season-area-metric-id');
          expect(seasonAreaMetric.seasonPillarAreaId).toBe(mockSeasonPillarAreaId);
          expect(seasonAreaMetric.metricId).toBe(mockMetricId);
          expect(seasonAreaMetric.sortOrder).toBe(6);
        });
      });
    });

    describe('Business Logic Methods', () => {
      let seasonAreaMetric: SeasonAreaMetric;

      beforeEach(() => {
        seasonAreaMetric = new SeasonAreaMetric(
          'season-area-metric-id',
          mockSeasonPillarAreaId,
          mockMetricId,
          2,
          new Date('2024-06-01T10:00:00Z')
        );
      });

      describe('updateSortOrder', () => {
        it('should update sort order successfully', () => {
          const updatedMetric = seasonAreaMetric.updateSortOrder(8);

          expect(updatedMetric.sortOrder).toBe(8);
          expect(updatedMetric.id).toBe(seasonAreaMetric.id);
          expect(updatedMetric.seasonPillarAreaId).toBe(seasonAreaMetric.seasonPillarAreaId);
          expect(updatedMetric.metricId).toBe(seasonAreaMetric.metricId);
          expect(updatedMetric.createdAt).toBe(seasonAreaMetric.createdAt);
        });

        it('should validate non-negative sort order', () => {
          expect(() => {
            seasonAreaMetric.updateSortOrder(-5);
          }).toThrow('Sort order must be a non-negative integer');
        });

        it('should allow zero sort order', () => {
          expect(() => {
            seasonAreaMetric.updateSortOrder(0);
          }).not.toThrow();
        });

        it('should handle updating to same sort order', () => {
          const updatedMetric = seasonAreaMetric.updateSortOrder(2);

          expect(updatedMetric.sortOrder).toBe(2);
          expect(updatedMetric.id).toBe(seasonAreaMetric.id);
        });
      });
    });

    describe('Edge Cases and Error Handling', () => {
      it('should handle very high sort order values', () => {
        const highSortOrder = 1000000;
        const associationData = SeasonAreaMetric.addToSeasonArea(
          mockSeasonPillarAreaId,
          mockMetricId,
          highSortOrder
        );

        expect(associationData.sortOrder).toBe(highSortOrder);
      });

      it('should preserve immutability across operations', () => {
        const originalMetric = new SeasonAreaMetric(
          'season-area-metric-id',
          mockSeasonPillarAreaId,
          mockMetricId,
          2,
          new Date('2024-06-01T10:00:00Z')
        );

        const updatedMetric = originalMetric.updateSortOrder(10);

        // Original should be unchanged
        expect(originalMetric.sortOrder).toBe(2);
        expect(updatedMetric.sortOrder).toBe(10);
        expect(updatedMetric).not.toBe(originalMetric);
      });
    });
  });

  describe('Cross-Model Integration', () => {
    it('should maintain hierarchical composition structure', () => {
      // Create a season pillar
      const seasonPillar = SeasonPillar.addToSeason(
        mockSeasonId,
        mockPillarId,
        1
      );

      // Create a season pillar area that references the season pillar
      const seasonPillarArea = SeasonPillarArea.addToSeasonPillar(
        mockSeasonPillarId,
        mockAreaId,
        1
      );

      // Create a season area metric that references the season pillar area
      const seasonAreaMetric = SeasonAreaMetric.addToSeasonArea(
        mockSeasonPillarAreaId,
        mockMetricId,
        1
      );

      // Verify proper structure (hierarchical composition through foreign key relationships)
      expect(seasonPillar.seasonId).toBe(mockSeasonId);
      expect(seasonPillar.pillarId).toBe(mockPillarId);
      expect(seasonPillarArea.seasonPillarId).toBe(mockSeasonPillarId);
      expect(seasonPillarArea.areaOfFocusId).toBe(mockAreaId);
      expect(seasonAreaMetric.seasonPillarAreaId).toBe(mockSeasonPillarAreaId);
      expect(seasonAreaMetric.metricId).toBe(mockMetricId);
    });

    it('should support hierarchical organization through sort orders', () => {
      // Create multiple season pillars with different sort orders
      const pillar1 = SeasonPillar.addToSeason(
        mockSeasonId,
        '11111111-1111-1111-1111-111111111111',
        1
      );

      const pillar2 = SeasonPillar.addToSeason(
        mockSeasonId,
        '22222222-2222-2222-2222-222222222222',
        2
      );

      // Create multiple areas under a pillar with different sort orders
      const area1 = SeasonPillarArea.addToSeasonPillar(
        mockSeasonPillarId,
        '33333333-3333-3333-3333-333333333333',
        1
      );

      const area2 = SeasonPillarArea.addToSeasonPillar(
        mockSeasonPillarId,
        '44444444-4444-4444-4444-444444444444',
        2
      );

      // Create multiple metrics under an area with different sort orders
      const metric1 = SeasonAreaMetric.addToSeasonArea(
        mockSeasonPillarAreaId,
        '55555555-5555-5555-5555-555555555555',
        1
      );

      const metric2 = SeasonAreaMetric.addToSeasonArea(
        mockSeasonPillarAreaId,
        '66666666-6666-6666-6666-666666666666',
        2
      );

      // Verify ordering
      expect(pillar1.sortOrder).toBeLessThan(pillar2.sortOrder);
      expect(area1.sortOrder).toBeLessThan(area2.sortOrder);
      expect(metric1.sortOrder).toBeLessThan(metric2.sortOrder);
    });

    it('should handle UUID validation consistently across all models', () => {
      const validUuid = '123e4567-e89b-12d3-a456-426614174000';
      const invalidUuid = 'not-a-uuid';

      // All models should accept valid UUIDs
      expect(() => {
        SeasonPillar.addToSeason(validUuid, validUuid);
      }).not.toThrow();

      expect(() => {
        SeasonPillarArea.addToSeasonPillar(validUuid, validUuid);
      }).not.toThrow();

      expect(() => {
        SeasonAreaMetric.addToSeasonArea(validUuid, validUuid);
      }).not.toThrow();

      // All models should reject invalid UUIDs
      expect(() => {
        SeasonPillar.addToSeason(invalidUuid, validUuid);
      }).toThrow();

      expect(() => {
        SeasonPillarArea.addToSeasonPillar(invalidUuid, validUuid);
      }).toThrow();

      expect(() => {
        SeasonAreaMetric.addToSeasonArea(invalidUuid, validUuid);
      }).toThrow();
    });

    it('should handle sort order validation consistently', () => {
      const validSortOrder = 5;
      const invalidSortOrder = -1;

      // All models should accept valid sort orders
      expect(() => {
        SeasonPillar.addToSeason(mockSeasonId, mockPillarId, validSortOrder);
      }).not.toThrow();

      expect(() => {
        SeasonPillarArea.addToSeasonPillar(mockSeasonPillarId, mockAreaId, validSortOrder);
      }).not.toThrow();

      expect(() => {
        SeasonAreaMetric.addToSeasonArea(mockSeasonPillarAreaId, mockMetricId, validSortOrder);
      }).not.toThrow();

      // All models should reject invalid sort orders
      expect(() => {
        SeasonPillar.addToSeason(mockSeasonId, mockPillarId, invalidSortOrder);
      }).toThrow();

      expect(() => {
        SeasonPillarArea.addToSeasonPillar(mockSeasonPillarId, mockAreaId, invalidSortOrder);
      }).toThrow();

      expect(() => {
        SeasonAreaMetric.addToSeasonArea(mockSeasonPillarAreaId, mockMetricId, invalidSortOrder);
      }).toThrow();
    });
  });

  describe('Performance and Memory Considerations', () => {
    it('should handle batch operations efficiently', () => {
      const batchSize = 50;
      const seasonPillars: any[] = [];
      const seasonAreas: any[] = [];
      const seasonMetrics: any[] = [];

      // Create batch of associations
      for (let i = 0; i < batchSize; i++) {
        // Generate proper UUIDs for batch testing
        const pillarId = `${i.toString().padStart(8, '0')}-1111-1111-1111-111111111111`;
        const seasonPillarId = `${i.toString().padStart(8, '0')}-2222-2222-2222-222222222222`;
        const areaId = `${i.toString().padStart(8, '0')}-3333-3333-3333-333333333333`;
        const seasonPillarAreaId = `${i.toString().padStart(8, '0')}-4444-4444-4444-444444444444`;
        const metricId = `${i.toString().padStart(8, '0')}-5555-5555-5555-555555555555`;

        seasonPillars.push(SeasonPillar.addToSeason(
          mockSeasonId,
          pillarId,
          i
        ));

        seasonAreas.push(SeasonPillarArea.addToSeasonPillar(
          seasonPillarId,
          areaId,
          i
        ));

        seasonMetrics.push(SeasonAreaMetric.addToSeasonArea(
          seasonPillarAreaId,
          metricId,
          i
        ));
      }

      expect(seasonPillars).toHaveLength(batchSize);
      expect(seasonAreas).toHaveLength(batchSize);
      expect(seasonMetrics).toHaveLength(batchSize);

      // Verify all have correct properties
      seasonPillars.forEach((pillar, index) => {
        expect(pillar.seasonId).toBe(mockSeasonId);
        expect(pillar.sortOrder).toBe(index);
      });

      seasonAreas.forEach((area, index) => {
        expect(area.sortOrder).toBe(index);
      });

      seasonMetrics.forEach((metric, index) => {
        expect(metric.sortOrder).toBe(index);
      });
    });

    it('should maintain constant memory usage across sort order updates', () => {
      const pillar = new SeasonPillar(
        'test-pillar',
        mockSeasonId,
        mockPillarId,
        true,
        1,
        new Date()
      );

      // Multiple sort order updates should create new instances
      const updated1 = pillar.updateSortOrder(2);
      const updated2 = updated1.updateSortOrder(3);
      const updated3 = updated2.updateSortOrder(4);

      // All instances should be different objects
      expect(pillar).not.toBe(updated1);
      expect(updated1).not.toBe(updated2);
      expect(updated2).not.toBe(updated3);

      // But share the same creation date (reference)
      expect(pillar.createdAt).toBe(updated3.createdAt);
    });
  });
});
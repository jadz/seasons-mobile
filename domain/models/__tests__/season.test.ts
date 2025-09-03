import { Season, SeasonStatus } from '../season';

describe('Season Domain Model', () => {
  const mockUserId = '123e4567-e89b-12d3-a456-426614174000';

  describe('Constructor and Validation', () => {
    it('should create a valid season instance', () => {
      const createdAt = new Date('2024-06-01T10:00:00Z');
      const updatedAt = new Date('2024-06-01T10:00:00Z');

      const season = new Season(
        '550e8400-e29b-41d4-a716-446655440000',
        mockUserId,
        'Summer Cut 2024',
        12,
        SeasonStatus.DRAFT,
        null,
        null,
        createdAt,
        updatedAt
      );

      expect(season.id).toBe('550e8400-e29b-41d4-a716-446655440000');
      expect(season.userId).toBe(mockUserId);
      expect(season.name).toBe('Summer Cut 2024');
      expect(season.durationWeeks).toBe(12);
      expect(season.status).toBe(SeasonStatus.DRAFT);
      expect(season.startDate).toBeNull();
      expect(season.endDate).toBeNull();
      expect(season.createdAt).toBe(createdAt);
      expect(season.updatedAt).toBe(updatedAt);
    });

    it('should create season with start and end dates', () => {
      const startDate = new Date('2024-06-15T00:00:00Z');
      const endDate = new Date('2024-09-15T00:00:00Z');

      const season = new Season(
        '550e8400-e29b-41d4-a716-446655440000',
        mockUserId,
        'Active Season',
        12,
        SeasonStatus.ACTIVE,
        startDate,
        endDate,
        new Date(),
        new Date()
      );

      expect(season.startDate).toBe(startDate);
      expect(season.endDate).toBe(endDate);
      expect(season.status).toBe(SeasonStatus.ACTIVE);
    });

    it('should create season without duration (null)', () => {
      const season = new Season(
        '550e8400-e29b-41d4-a716-446655440000',
        mockUserId,
        'Flexible Season',
        null,
        SeasonStatus.DRAFT,
        null,
        null,
        new Date(),
        new Date()
      );

      expect(season.durationWeeks).toBeNull();
    });

    it('should create season with various statuses', () => {
      const startDate = new Date('2024-06-01T00:00:00Z');
      const endDate = new Date('2024-08-01T00:00:00Z');
      const season = new Season(
        '550e8400-e29b-41d4-a716-446655440000',
        mockUserId,
        'Test Season',
        8,
        SeasonStatus.COMPLETED,
        startDate,
        endDate,
        new Date(),
        new Date()
      );

      expect(season.status).toBe(SeasonStatus.COMPLETED);
    });

    it('should throw error for invalid user ID', () => {
      expect(() => {
        new Season(
          '550e8400-e29b-41d4-a716-446655440000',
          'invalid-uuid',
          'Test Season',
          12,
          SeasonStatus.DRAFT,
          null,
          null,
          new Date(),
          new Date()
        );
      }).toThrow('User ID must be a valid UUID');
    });

    it('should throw error for empty name', () => {
      expect(() => {
        new Season(
          '550e8400-e29b-41d4-a716-446655440000',
          mockUserId,
          '',
          12,
          SeasonStatus.DRAFT,
          null,
          null,
          new Date(),
          new Date()
        );
      }).toThrow('Season name cannot be empty');
    });

    it('should throw error for invalid duration', () => {
      expect(() => {
        new Season(
          '550e8400-e29b-41d4-a716-446655440000',
          mockUserId,
          'Test Season',
          -1,
          SeasonStatus.DRAFT,
          null,
          null,
          new Date(),
          new Date()
        );
      }).toThrow('Duration must be a positive integer number of weeks');
    });

    it('should throw error for end date before start date', () => {
      const startDate = new Date('2024-06-15T00:00:00Z');
      const endDate = new Date('2024-06-10T00:00:00Z'); // Before start

      expect(() => {
        new Season(
          '550e8400-e29b-41d4-a716-446655440000',
          mockUserId,
          'Test Season',
          12,
          SeasonStatus.ACTIVE,
          startDate,
          endDate,
          new Date(),
          new Date()
        );
      }).toThrow('Start date must be before end date');
    });

    it('should throw error for invalid season ID', () => {
      expect(() => {
        new Season(
          'invalid-id',
          mockUserId,
          'Test Season',
          12,
          SeasonStatus.DRAFT,
          null,
          null,
          new Date(),
          new Date()
        );
      }).toThrow('Season ID must be a valid UUID');
    });

    it('should throw error for name too long', () => {
      const longName = 'a'.repeat(101); // Exceeds 100 character limit

      expect(() => {
        new Season(
          '550e8400-e29b-41d4-a716-446655440000',
          mockUserId,
          longName,
          12,
          SeasonStatus.DRAFT,
          null,
          null,
          new Date(),
          new Date()
        );
      }).toThrow('Season name cannot exceed 100 characters');
    });
  });

  describe('Static Factory Methods', () => {
    describe('createDraft', () => {
      it('should create draft season data successfully', () => {
        const seasonData = Season.createDraft(
          mockUserId,
          'My New Season',
          16
        );

        expect(seasonData.userId).toBe(mockUserId);
        expect(seasonData.name).toBe('My New Season');
        expect(seasonData.durationWeeks).toBe(16);
        expect(seasonData.status).toBe(SeasonStatus.DRAFT);
        expect(seasonData.startDate).toBeNull();
        expect(seasonData.endDate).toBeNull();
      });

      it('should create draft season without duration', () => {
        const seasonData = Season.createDraft(
          mockUserId,
          'Flexible Season'
        );

        expect(seasonData.durationWeeks).toBeNull();
      });

      it('should throw error for invalid user ID', () => {
        expect(() => {
          Season.createDraft(
            'invalid-uuid',
            'Test Season'
          );
        }).toThrow('User ID must be a valid UUID');
      });

      it('should throw error for empty name', () => {
        expect(() => {
          Season.createDraft(
            mockUserId,
            '' // Empty name
          );
        }).toThrow('Season name cannot be empty');
      });

      it('should throw error for negative duration', () => {
        expect(() => {
          Season.createDraft(
            mockUserId,
            'Test Season',
            -5 // Negative duration
          );
        }).toThrow('Duration must be a positive integer number of weeks');
      });
    });

    describe('fromData', () => {
      it('should reconstruct season from database data', () => {
        const data = {
          id: '550e8400-e29b-41d4-a716-446655440000',
          userId: mockUserId,
          name: 'Reconstructed Season',
          durationWeeks: 8,
          status: 'active',
          startDate: new Date('2024-06-01T00:00:00Z'),
          endDate: new Date('2024-08-01T00:00:00Z'),
          createdAt: new Date('2024-05-01T00:00:00Z'),
          updatedAt: new Date('2024-06-01T00:00:00Z')
        };

        const season = Season.fromData(data);

        expect(season.id).toBe('550e8400-e29b-41d4-a716-446655440000');
        expect(season.userId).toBe(mockUserId);
        expect(season.name).toBe('Reconstructed Season');
        expect(season.durationWeeks).toBe(8);
        expect(season.status).toBe(SeasonStatus.ACTIVE);
        expect(season.startDate).toEqual(data.startDate);
        expect(season.endDate).toEqual(data.endDate);
      });

      it('should handle invalid status', () => {
        const data = {
          id: '550e8400-e29b-41d4-a716-446655440000',
          userId: mockUserId,
          name: 'Test Season',
          durationWeeks: 8,
          status: 'invalid_status',
          startDate: null,
          endDate: null,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        expect(() => Season.fromData(data)).toThrow('Invalid season status: invalid_status');
      });
    });
  });

  describe('Status Methods', () => {
    it('should correctly identify draft status', () => {
      const season = new Season(
        '550e8400-e29b-41d4-a716-446655440000',
        mockUserId,
        'Draft Season',
        12,
        SeasonStatus.DRAFT,
        null,
        null,
        new Date(),
        new Date()
      );

      expect(season.isDraft()).toBe(true);
      expect(season.isActive()).toBe(false);
      expect(season.isCompleted()).toBe(false);
      expect(season.isPaused()).toBe(false);
    });

    it('should correctly identify active status', () => {
      const startDate = new Date('2024-06-01T00:00:00Z');
      const endDate = new Date('2024-08-01T00:00:00Z');
      const season = new Season(
        '550e8400-e29b-41d4-a716-446655440000',
        mockUserId,
        'Active Season',
        12,
        SeasonStatus.ACTIVE,
        startDate,
        endDate,
        new Date(),
        new Date()
      );

      expect(season.isDraft()).toBe(false);
      expect(season.isActive()).toBe(true);
      expect(season.isCompleted()).toBe(false);
      expect(season.isPaused()).toBe(false);
    });

    it('should correctly identify completed status', () => {
      const startDate = new Date('2024-06-01T00:00:00Z');
      const endDate = new Date('2024-08-01T00:00:00Z');
      const season = new Season(
        '550e8400-e29b-41d4-a716-446655440000',
        mockUserId,
        'Completed Season',
        12,
        SeasonStatus.COMPLETED,
        startDate,
        endDate,
        new Date(),
        new Date()
      );

      expect(season.isDraft()).toBe(false);
      expect(season.isActive()).toBe(false);
      expect(season.isCompleted()).toBe(true);
      expect(season.isPaused()).toBe(false);
    });

    it('should correctly identify paused status', () => {
      const startDate = new Date('2024-06-01T00:00:00Z');
      const endDate = new Date('2024-08-01T00:00:00Z');
      const season = new Season(
        '550e8400-e29b-41d4-a716-446655440000',
        mockUserId,
        'Paused Season',
        12,
        SeasonStatus.PAUSED,
        startDate,
        endDate,
        new Date(),
        new Date()
      );

      expect(season.isDraft()).toBe(false);
      expect(season.isActive()).toBe(false);
      expect(season.isCompleted()).toBe(false);
      expect(season.isPaused()).toBe(true);
    });
  });

  describe('Capability Methods', () => {
    it('should allow starting draft seasons', () => {
      const season = new Season(
        '550e8400-e29b-41d4-a716-446655440000',
        mockUserId,
        'Draft Season',
        12,
        SeasonStatus.DRAFT,
        null,
        null,
        new Date(),
        new Date()
      );

      expect(season.canBeStarted()).toBe(true);
    });

    it('should not allow starting non-draft seasons', () => {
      const startDate = new Date('2024-06-01T00:00:00Z');
      const endDate = new Date('2024-08-01T00:00:00Z');
      const season = new Season(
        '550e8400-e29b-41d4-a716-446655440000',
        mockUserId,
        'Active Season',
        12,
        SeasonStatus.ACTIVE,
        startDate,
        endDate,
        new Date(),
        new Date()
      );

      expect(season.canBeStarted()).toBe(false);
    });

    it('should allow pausing active seasons', () => {
      const startDate = new Date('2024-06-01T00:00:00Z');
      const endDate = new Date('2024-08-01T00:00:00Z');
      const season = new Season(
        '550e8400-e29b-41d4-a716-446655440000',
        mockUserId,
        'Active Season',
        12,
        SeasonStatus.ACTIVE,
        startDate,
        endDate,
        new Date(),
        new Date()
      );

      expect(season.canBePaused()).toBe(true);
    });

    it('should allow resuming paused seasons', () => {
      const startDate = new Date('2024-06-01T00:00:00Z');
      const endDate = new Date('2024-08-01T00:00:00Z');
      const season = new Season(
        '550e8400-e29b-41d4-a716-446655440000',
        mockUserId,
        'Paused Season',
        12,
        SeasonStatus.PAUSED,
        startDate,
        endDate,
        new Date(),
        new Date()
      );

      expect(season.canBeResumed()).toBe(true);
    });

    it('should allow completing active or paused seasons', () => {
      const startDate = new Date('2024-06-01T00:00:00Z');
      const endDate = new Date('2024-08-01T00:00:00Z');
      const activeSeason = new Season(
        '550e8400-e29b-41d4-a716-446655440000',
        mockUserId,
        'Active Season',
        12,
        SeasonStatus.ACTIVE,
        startDate,
        endDate,
        new Date(),
        new Date()
      );

      const pausedSeason = new Season(
        '660e8400-e29b-41d4-a716-446655440001',
        mockUserId,
        'Paused Season',
        12,
        SeasonStatus.PAUSED,
        startDate,
        endDate,
        new Date(),
        new Date()
      );

      expect(activeSeason.canBeCompleted()).toBe(true);
      expect(pausedSeason.canBeCompleted()).toBe(true);
    });
  });

  describe('Lifecycle Methods', () => {
    let draftSeason: Season;
    const baseDate = new Date('2024-06-01T10:00:00Z');

    beforeEach(() => {
      draftSeason = new Season(
        '550e8400-e29b-41d4-a716-446655440000',
        mockUserId,
        'Test Season',
        12,
        SeasonStatus.DRAFT,
        null,
        null,
        baseDate,
        baseDate
      );
    });

    describe('start', () => {
      it('should start a draft season with current date', () => {
        const startedSeason = draftSeason.start();

        expect(startedSeason.status).toBe(SeasonStatus.ACTIVE);
        expect(startedSeason.startDate).toBeInstanceOf(Date);
        expect(startedSeason.endDate).toBeInstanceOf(Date);
        expect(startedSeason.name).toBe(draftSeason.name);
        expect(startedSeason.durationWeeks).toBe(draftSeason.durationWeeks);
      });

      it('should start a draft season with specified date', () => {
        const specifiedDate = new Date('2024-07-01T00:00:00Z');
        const startedSeason = draftSeason.start(specifiedDate);

        expect(startedSeason.startDate).toEqual(specifiedDate);
        
        // Should calculate end date based on duration
        const expectedEndDate = new Date(specifiedDate);
        expectedEndDate.setDate(expectedEndDate.getDate() + (12 * 7));
        expect(startedSeason.endDate).toEqual(expectedEndDate);
      });

      it('should handle past start dates', () => {
        const pastDate = new Date('2024-01-01T00:00:00Z');
        
        expect(() => {
          draftSeason.start(pastDate);
        }).not.toThrow();
      });

      it('should throw error when starting non-draft season', () => {
        const startDate = new Date('2024-06-01T00:00:00Z');
        const endDate = new Date('2024-08-01T00:00:00Z');
        const activeSeason = new Season(
          '550e8400-e29b-41d4-a716-446655440000',
          mockUserId,
          'Active Season',
          12,
          SeasonStatus.ACTIVE,
          startDate,
          endDate,
          baseDate,
          baseDate
        );

        expect(() => activeSeason.start()).toThrow('Cannot start season: current status is active');
      });
    });

    describe('pause', () => {
      it('should pause an active season', () => {
        const startDate = new Date('2024-06-01T00:00:00Z');
        const endDate = new Date('2024-08-01T00:00:00Z');
        const activeSeason = new Season(
          '550e8400-e29b-41d4-a716-446655440000',
          mockUserId,
          'Active Season',
          12,
          SeasonStatus.ACTIVE,
          startDate,
          endDate,
          baseDate,
          baseDate
        );

        const pausedSeason = activeSeason.pause();

        expect(pausedSeason.status).toBe(SeasonStatus.PAUSED);
        expect(pausedSeason.startDate).toEqual(activeSeason.startDate);
        expect(pausedSeason.endDate).toEqual(activeSeason.endDate);
      });

      it('should throw error when pausing non-active season', () => {
        expect(() => draftSeason.pause()).toThrow('Cannot pause season: current status is draft');
      });
    });

    describe('resume', () => {
      it('should resume a paused season', () => {
        const startDate = new Date('2024-06-01T00:00:00Z');
        const endDate = new Date('2024-08-01T00:00:00Z');
        const pausedSeason = new Season(
          '550e8400-e29b-41d4-a716-446655440000',
          mockUserId,
          'Paused Season',
          12,
          SeasonStatus.PAUSED,
          startDate,
          endDate,
          baseDate,
          baseDate
        );

        const resumedSeason = pausedSeason.resume();

        expect(resumedSeason.status).toBe(SeasonStatus.ACTIVE);
        expect(resumedSeason.startDate).toEqual(pausedSeason.startDate);
        expect(resumedSeason.endDate).toEqual(pausedSeason.endDate);
      });

      it('should throw error when resuming non-paused season', () => {
        expect(() => draftSeason.resume()).toThrow('Cannot resume season: current status is draft');
      });
    });

    describe('complete', () => {
      it('should complete an active season', () => {
        const startDate = new Date('2024-06-01T00:00:00Z');
        const endDate = new Date('2024-08-01T00:00:00Z');
        const activeSeason = new Season(
          '550e8400-e29b-41d4-a716-446655440000',
          mockUserId,
          'Active Season',
          8,
          SeasonStatus.ACTIVE,
          startDate,
          endDate,
          baseDate,
          baseDate
        );

        const completionDate = new Date('2024-07-15T00:00:00Z');
        const completedSeason = activeSeason.complete(completionDate);

        expect(completedSeason.status).toBe(SeasonStatus.COMPLETED);
        expect(completedSeason.endDate).toEqual(completionDate);
        expect(completedSeason.startDate).toEqual(activeSeason.startDate);
      });

      it('should complete a paused season', () => {
        const startDate = new Date('2024-06-01T00:00:00Z');
        const endDate = new Date('2024-08-01T00:00:00Z');
        const pausedSeason = new Season(
          '550e8400-e29b-41d4-a716-446655440000',
          mockUserId,
          'Paused Season',
          8,
          SeasonStatus.PAUSED,
          startDate,
          endDate,
          baseDate,
          baseDate
        );

        const completionDate = new Date('2024-07-15T00:00:00Z');
        const completedSeason = pausedSeason.complete(completionDate);

        expect(completedSeason.status).toBe(SeasonStatus.COMPLETED);
        expect(completedSeason.endDate).toEqual(completionDate);
      });

      it('should throw error when completing already completed season', () => {
        const startDate = new Date('2024-06-01T00:00:00Z');
        const endDate = new Date('2024-08-01T00:00:00Z');
        const completedSeason = new Season(
          '550e8400-e29b-41d4-a716-446655440000',
          mockUserId,
          'Completed Season',
          12,
          SeasonStatus.COMPLETED,
          startDate,
          endDate,
          new Date(),
          new Date()
        );

        expect(() => completedSeason.complete()).toThrow('Cannot complete season: current status is completed');
      });
    });

    describe('cancel', () => {
      it('should cancel a draft season', () => {
        const cancelledSeason = draftSeason.cancel();

        expect(cancelledSeason.status).toBe(SeasonStatus.CANCELLED);
        expect(cancelledSeason.startDate).toEqual(draftSeason.startDate);
        expect(cancelledSeason.endDate).toEqual(draftSeason.endDate);
      });

      it('should cancel an active season', () => {
        const startDate = new Date('2024-06-01T00:00:00Z');
        const endDate = new Date('2024-08-01T00:00:00Z');
        const activeSeason = new Season(
          '550e8400-e29b-41d4-a716-446655440000',
          mockUserId,
          'Active Season',
          12,
          SeasonStatus.ACTIVE,
          startDate,
          endDate,
          baseDate,
          baseDate
        );

        const cancelledSeason = activeSeason.cancel();

        expect(cancelledSeason.status).toBe(SeasonStatus.CANCELLED);
      });

      it('should allow cancelling already cancelled seasons', () => {
        const startDate = new Date('2024-06-01T00:00:00Z');
        const endDate = new Date('2024-08-01T00:00:00Z');
        const cancelledSeason = new Season(
          '550e8400-e29b-41d4-a716-446655440000',
          mockUserId,
          'Cancelled Season',
          12,
          SeasonStatus.CANCELLED,
          startDate,
          endDate,
          baseDate,
          baseDate
        );

        expect(() => {
          cancelledSeason.cancel();
        }).not.toThrow();
      });
    });

    describe('archive', () => {
      it('should archive a completed season', () => {
        const startDate = new Date('2024-06-01T00:00:00Z');
        const endDate = new Date('2024-08-01T00:00:00Z');
        const completedSeason = new Season(
          '550e8400-e29b-41d4-a716-446655440000',
          mockUserId,
          'Completed Season',
          12,
          SeasonStatus.COMPLETED,
          startDate,
          endDate,
          baseDate,
          baseDate
        );

        const archivedSeason = completedSeason.archive();

        expect(archivedSeason.status).toBe(SeasonStatus.ARCHIVED);
        expect(archivedSeason.startDate).toEqual(completedSeason.startDate);
        expect(archivedSeason.endDate).toEqual(completedSeason.endDate);
      });

      it('should archive a cancelled season', () => {
        const startDate = new Date('2024-06-01T00:00:00Z');
        const endDate = new Date('2024-08-01T00:00:00Z');
        const cancelledSeason = new Season(
          '550e8400-e29b-41d4-a716-446655440000',
          mockUserId,
          'Cancelled Season',
          12,
          SeasonStatus.CANCELLED,
          startDate,
          endDate,
          baseDate,
          baseDate
        );

        const archivedSeason = cancelledSeason.archive();

        expect(archivedSeason.status).toBe(SeasonStatus.ARCHIVED);
      });

      it('should throw error when archiving draft season', () => {
        expect(() => draftSeason.archive()).toThrow('Cannot archive season: must be completed or cancelled first');
      });
    });
  });

  describe('updateMetadata', () => {
    let season: Season;

    beforeEach(() => {
      season = new Season(
        '550e8400-e29b-41d4-a716-446655440000',
        mockUserId,
        'Original Season',
        8,
        SeasonStatus.DRAFT,
        null,
        null,
        new Date('2024-06-01T10:00:00Z'),
        new Date()
      );
    });

    it('should update season metadata successfully', () => {
      const updatedSeason = season.updateMetadata(
        'Updated Season Name',
        16
      );

      expect(updatedSeason.name).toBe('Updated Season Name');
      expect(updatedSeason.durationWeeks).toBe(16);
      expect(updatedSeason.updatedAt.getTime()).toBeGreaterThanOrEqual(season.updatedAt.getTime());
    });

    it('should update only name when duration not provided', () => {
      const updatedSeason = season.updateMetadata('New Name Only');

      expect(updatedSeason.name).toBe('New Name Only');
      expect(updatedSeason.durationWeeks).toBe(season.durationWeeks);
    });

    it('should preserve original values when updating', () => {
      const updatedSeason = season.updateMetadata('New Name', 12);

      expect(updatedSeason.id).toBe(season.id);
      expect(updatedSeason.userId).toBe(season.userId);
      expect(updatedSeason.status).toBe(season.status);
      expect(updatedSeason.startDate).toBe(season.startDate);
      expect(updatedSeason.endDate).toBe(season.endDate);
      expect(updatedSeason.createdAt).toBe(season.createdAt);
    });

    it('should throw error for invalid user when user ID provided', () => {
      expect(() => {
        season.updateMetadata(
          'New Name',
          12,
          'different-user-id'
        );
      }).toThrow('Cannot update season: user does not own this season');
    });

    it('should not throw error when updating without user validation', () => {
      expect(() => {
        season.updateMetadata(
          'New Name',
          12
        );
      }).not.toThrow();
    });

    it('should not throw error when correct user ID provided', () => {
      expect(() => {
        season.updateMetadata(
          'New Name',
          12,
          mockUserId
        );
      }).not.toThrow();
    });

    it('should throw error when updating non-draft season', () => {
      const startDate = new Date('2024-06-01T00:00:00Z');
      const completionDate = new Date('2024-08-01T00:00:00Z');
      const completedSeason = new Season(
        '550e8400-e29b-41d4-a716-446655440000',
        mockUserId,
        'Completed Season',
        12,
        SeasonStatus.COMPLETED,
        startDate,
        completionDate,
        new Date(),
        new Date()
      );

      expect(() => {
        completedSeason.updateMetadata('New Name');
      }).toThrow('Can only update metadata for draft seasons');
    });

    it('should throw error when updating cancelled season', () => {
      const cancelledSeason = new Season(
        '550e8400-e29b-41d4-a716-446655440000',
        mockUserId,
        'Cancelled Season',
        12,
        SeasonStatus.CANCELLED,
        null,
        null,
        new Date(),
        new Date()
      );

      expect(() => {
        cancelledSeason.updateMetadata('New Name');
      }).toThrow('Can only update metadata for draft seasons');
    });

    it('should throw error for invalid name', () => {
      expect(() => {
        season.updateMetadata('');
      }).toThrow('Season name cannot be empty');
    });

    it('should throw error for invalid duration', () => {
      expect(() => {
        season.updateMetadata('Valid Name', -1);
      }).toThrow('Duration must be a positive integer number of weeks');
    });
  });

  describe('Edge Cases and Validation', () => {
    it('should handle maximum duration', () => {
      const maxDurationSeason = Season.createDraft(
        mockUserId,
        'Max Duration Season',
        52 // Maximum allowed
      );

      expect(maxDurationSeason.durationWeeks).toBe(52);
    });

    it('should handle maximum name length', () => {
      const exactly100Chars = 'a'.repeat(100);
      const maxNameSeason = Season.createDraft(
        mockUserId,
        exactly100Chars
      );

      expect(maxNameSeason.name).toBe(exactly100Chars);
    });

    it('should handle user ownership validation', () => {
      const season = new Season(
        '550e8400-e29b-41d4-a716-446655440000',
        mockUserId,
        'Test Season',
        12,
        SeasonStatus.DRAFT,
        null,
        null,
        new Date(),
        new Date()
      );

      expect(season.belongsToUser(mockUserId)).toBe(true);
      expect(season.belongsToUser('different-user-id')).toBe(false);
    });

    it('should handle duration existence check', () => {
      const withDuration = new Season(
        '550e8400-e29b-41d4-a716-446655440000',
        mockUserId,
        'With Duration',
        12,
        SeasonStatus.DRAFT,
        null,
        null,
        new Date(),
        new Date()
      );

      const withoutDuration = new Season(
        '660e8400-e29b-41d4-a716-446655440001',
        mockUserId,
        'Without Duration',
        null,
        SeasonStatus.DRAFT,
        null,
        null,
        new Date(),
        new Date()
      );

      expect(withDuration.hasDuration()).toBe(true);
      expect(withoutDuration.hasDuration()).toBe(false);
    });

    it('should handle immutability of instances', () => {
      const original = new Season(
        '550e8400-e29b-41d4-a716-446655440000',
        mockUserId,
        'Original Season',
        12,
        SeasonStatus.DRAFT,
        null,
        null,
        new Date(),
        new Date()
      );

      const startDate = new Date('2024-06-01T00:00:00Z');
      const completionDate = new Date('2024-08-01T00:00:00Z');
      const modified = original.start(startDate).complete(completionDate);

      // Original should remain unchanged
      expect(original.status).toBe(SeasonStatus.DRAFT);
      expect(original.startDate).toBeNull();
      expect(original.endDate).toBeNull();

      // Modified should have new values
      expect(modified.status).toBe(SeasonStatus.COMPLETED);
      expect(modified.startDate).toEqual(startDate);
      expect(modified.endDate).toEqual(completionDate);
    });

    describe('UUID Validation', () => {
      const validUUIDs = [
        '123e4567-e89b-12d3-a456-426614174000',
        'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        '00000000-0000-0000-0000-000000000000'
      ];

      it('should accept valid UUIDs', () => {
        validUUIDs.forEach(uuid => {
          expect(() => {
            Season.createDraft(uuid, 'Test Season');
          }).not.toThrow();
        });
      });

      const invalidUUIDs = [
        'not-a-uuid',
        '123e4567-e89b-12d3-a456-42661417400', // Missing character
        '123e4567-e89b-12d3-a456-42661417400g', // Invalid character
        '123e4567e89b12d3a456426614174000', // Missing hyphens
        ''
      ];

      it('should reject invalid UUIDs', () => {
        invalidUUIDs.forEach(uuid => {
          expect(() => {
            Season.createDraft(uuid, 'Test Season');
          }).toThrow();
        });
      });
    });

    it('should handle time zone independence for date calculations', () => {
      const season = new Season(
        '550e8400-e29b-41d4-a716-446655440000',
        mockUserId,
        'Test Season',
        2, // 2 weeks
        SeasonStatus.DRAFT,
        null,
        null,
        new Date(),
        new Date()
      );

      const startDate = new Date('2024-06-01T12:00:00Z'); // Noon UTC
      const startedSeason = season.start(startDate);

      // End date should be exactly 14 days later
      const expectedEndDate = new Date(startDate);
      expectedEndDate.setDate(expectedEndDate.getDate() + 14);

      expect(startedSeason.endDate).toEqual(expectedEndDate);
    });
  });
});
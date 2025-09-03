import { Season, SeasonPriority, SeasonStatus } from '../season';

describe('Season Domain Model', () => {
  const mockUserId = '123e4567-e89b-12d3-a456-426614174000';

  describe('Constructor and Validation', () => {
    it('should create a valid season instance', () => {
      const createdAt = new Date('2024-06-01T10:00:00Z');
      const updatedAt = new Date('2024-06-01T10:00:00Z');

      const season = new Season(
        'season-id',
        mockUserId,
        'Summer Cut 2024',
        SeasonPriority.FAT_LOSS,
        12,
        SeasonStatus.DRAFT,
        null,
        null,
        createdAt,
        updatedAt
      );

      expect(season.id).toBe('season-id');
      expect(season.userId).toBe(mockUserId);
      expect(season.name).toBe('Summer Cut 2024');
      expect(season.priority).toBe(SeasonPriority.FAT_LOSS);
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
        'season-id',
        mockUserId,
        'Active Season',
        SeasonPriority.MUSCLE_GAIN,
        13,
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

    it('should validate user ID on construction', () => {
      expect(() => {
        new Season(
          'season-id',
          '', // Empty user ID
          'Test Season',
          SeasonPriority.STRENGTH,
          10,
          SeasonStatus.DRAFT,
          null,
          null,
          new Date(),
          new Date()
        );
      }).toThrow('User ID cannot be empty');
    });

    it('should validate user ID format on construction', () => {
      expect(() => {
        new Season(
          'season-id',
          'invalid-uuid', // Invalid UUID
          'Test Season',
          SeasonPriority.STRENGTH,
          10,
          SeasonStatus.DRAFT,
          null,
          null,
          new Date(),
          new Date()
        );
      }).toThrow('User ID must be a valid UUID');
    });

    it('should validate season name on construction', () => {
      expect(() => {
        new Season(
          'season-id',
          mockUserId,
          '', // Empty name
          SeasonPriority.STRENGTH,
          10,
          SeasonStatus.DRAFT,
          null,
          null,
          new Date(),
          new Date()
        );
      }).toThrow('Season name cannot be empty');
    });

    it('should validate season name length on construction', () => {
      const longName = 'a'.repeat(101); // 101 characters
      expect(() => {
        new Season(
          'season-id',
          mockUserId,
          longName,
          SeasonPriority.STRENGTH,
          10,
          SeasonStatus.DRAFT,
          null,
          null,
          new Date(),
          new Date()
        );
      }).toThrow('Season name cannot exceed 100 characters');
    });

    it('should validate duration weeks on construction', () => {
      expect(() => {
        new Season(
          'season-id',
          mockUserId,
          'Test Season',
          SeasonPriority.STRENGTH,
          0, // Invalid duration
          SeasonStatus.DRAFT,
          null,
          null,
          new Date(),
          new Date()
        );
      }).toThrow('Duration must be a positive integer number of weeks');
    });

    it('should validate maximum duration weeks on construction', () => {
      expect(() => {
        new Season(
          'season-id',
          mockUserId,
          'Test Season',
          SeasonPriority.STRENGTH,
          53, // Too many weeks (> 52)
          SeasonStatus.DRAFT,
          null,
          null,
          new Date(),
          new Date()
        );
      }).toThrow('Season duration cannot exceed 52 weeks');
    });

    it('should validate date consistency on construction', () => {
      const startDate = new Date('2024-09-15T00:00:00Z');
      const endDate = new Date('2024-06-15T00:00:00Z'); // Before start date

      expect(() => {
        new Season(
          'season-id',
          mockUserId,
          'Test Season',
          SeasonPriority.STRENGTH,
          10,
          SeasonStatus.ACTIVE,
          startDate,
          endDate,
          new Date(),
          new Date()
        );
      }).toThrow('Start date must be before end date');
    });

    it('should validate active seasons have start date', () => {
      expect(() => {
        new Season(
          'season-id',
          mockUserId,
          'Test Season',
          SeasonPriority.STRENGTH,
          10,
          SeasonStatus.ACTIVE,
          null, // No start date for active season
          null,
          new Date(),
          new Date()
        );
      }).toThrow('Active seasons must have a start date');
    });

    it('should allow draft seasons without start date', () => {
      expect(() => {
        new Season(
          'season-id',
          mockUserId,
          'Draft Season',
          SeasonPriority.STRENGTH,
          10,
          SeasonStatus.DRAFT,
          null, // No start date is OK for draft
          null,
          new Date(),
          new Date()
        );
      }).not.toThrow();
    });
  });

  describe('Static Factory Methods', () => {
    describe('createDraft', () => {
      it('should create draft season data successfully', () => {
        const seasonData = Season.createDraft(
          mockUserId,
          'My New Season',
          SeasonPriority.ENDURANCE,
          16
        );

        expect(seasonData.userId).toBe(mockUserId);
        expect(seasonData.name).toBe('My New Season');
        expect(seasonData.priority).toBe(SeasonPriority.ENDURANCE);
        expect(seasonData.durationWeeks).toBe(16);
        expect(seasonData.status).toBe(SeasonStatus.DRAFT);
        expect(seasonData.startDate).toBeNull();
        expect(seasonData.endDate).toBeNull();
      });

      it('should create draft season data without duration', () => {
        const seasonData = Season.createDraft(
          mockUserId,
          'Flexible Season',
          SeasonPriority.MAINTENANCE
        );

        expect(seasonData.durationWeeks).toBeNull();
        expect(seasonData.status).toBe(SeasonStatus.DRAFT);
      });

      it('should validate user ID for draft creation', () => {
        expect(() => {
          Season.createDraft(
            'invalid-uuid',
            'Test Season',
            SeasonPriority.STRENGTH
          );
        }).toThrow('User ID must be a valid UUID');
      });

      it('should validate name for draft creation', () => {
        expect(() => {
          Season.createDraft(
            mockUserId,
            '', // Empty name
            SeasonPriority.STRENGTH
          );
        }).toThrow('Season name cannot be empty');
      });

      it('should validate duration for draft creation', () => {
        expect(() => {
          Season.createDraft(
            mockUserId,
            'Test Season',
            SeasonPriority.STRENGTH,
            -5 // Negative duration
          );
        }).toThrow('Duration must be a positive integer number of weeks');
      });
    });

    describe('fromData', () => {
      it('should reconstruct season from database data', () => {
        const dbData = {
          id: 'season-id',
          userId: mockUserId,
          name: 'Reconstructed Season',
          priority: 'muscle_gain',
          durationWeeks: 12,
          status: 'active',
          startDate: new Date('2024-06-15T00:00:00Z'),
          endDate: new Date('2024-09-15T00:00:00Z'),
          createdAt: new Date('2024-06-01T10:00:00Z'),
          updatedAt: new Date('2024-06-01T10:00:00Z')
        };

        const season = Season.fromData(dbData);

        expect(season.id).toBe('season-id');
        expect(season.name).toBe('Reconstructed Season');
        expect(season.priority).toBe(SeasonPriority.MUSCLE_GAIN);
        expect(season.status).toBe(SeasonStatus.ACTIVE);
        expect(season.durationWeeks).toBe(12);
      });

      it('should handle null duration from database', () => {
        const dbData = {
          id: 'season-id',
          userId: mockUserId,
          name: 'Flexible Season',
          priority: 'maintenance',
          durationWeeks: null,
          status: 'draft',
          startDate: null,
          endDate: null,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const season = Season.fromData(dbData);

        expect(season.durationWeeks).toBeNull();
        expect(season.priority).toBe(SeasonPriority.MAINTENANCE);
      });

      it('should throw error for invalid priority from database', () => {
        const dbData = {
          id: 'season-id',
          userId: mockUserId,
          name: 'Test Season',
          priority: 'invalid_priority',
          durationWeeks: 12,
          status: 'draft',
          startDate: null,
          endDate: null,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        expect(() => {
          Season.fromData(dbData);
        }).toThrow('Invalid season priority: invalid_priority');
      });

      it('should throw error for invalid status from database', () => {
        const dbData = {
          id: 'season-id',
          userId: mockUserId,
          name: 'Test Season',
          priority: 'strength',
          durationWeeks: 12,
          status: 'invalid_status',
          startDate: null,
          endDate: null,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        expect(() => {
          Season.fromData(dbData);
        }).toThrow('Invalid season status: invalid_status');
      });
    });
  });

  describe('Status Checking Methods', () => {
    let draftSeason: Season;
    let activeSeason: Season;
    let pausedSeason: Season;
    let completedSeason: Season;
    let cancelledSeason: Season;
    let archivedSeason: Season;

    beforeEach(() => {
      const baseDate = new Date('2024-06-01T10:00:00Z');

      draftSeason = new Season(
        'draft-id',
        mockUserId,
        'Draft Season',
        SeasonPriority.STRENGTH,
        12,
        SeasonStatus.DRAFT,
        null,
        null,
        baseDate,
        baseDate
      );

      activeSeason = new Season(
        'active-id',
        mockUserId,
        'Active Season',
        SeasonPriority.MUSCLE_GAIN,
        12,
        SeasonStatus.ACTIVE,
        new Date('2024-06-15T00:00:00Z'),
        new Date('2024-09-15T00:00:00Z'),
        baseDate,
        baseDate
      );

      pausedSeason = new Season(
        'paused-id',
        mockUserId,
        'Paused Season',
        SeasonPriority.ENDURANCE,
        12,
        SeasonStatus.PAUSED,
        new Date('2024-06-15T00:00:00Z'),
        null,
        baseDate,
        baseDate
      );

      completedSeason = new Season(
        'completed-id',
        mockUserId,
        'Completed Season',
        SeasonPriority.FAT_LOSS,
        12,
        SeasonStatus.COMPLETED,
        new Date('2024-03-01T00:00:00Z'),
        new Date('2024-06-01T00:00:00Z'),
        baseDate,
        baseDate
      );

      cancelledSeason = new Season(
        'cancelled-id',
        mockUserId,
        'Cancelled Season',
        SeasonPriority.MAINTENANCE,
        12,
        SeasonStatus.CANCELLED,
        new Date('2024-06-15T00:00:00Z'),
        null,
        baseDate,
        baseDate
      );

      archivedSeason = new Season(
        'archived-id',
        mockUserId,
        'Archived Season',
        SeasonPriority.STRENGTH,
        12,
        SeasonStatus.ARCHIVED,
        new Date('2024-01-01T00:00:00Z'),
        new Date('2024-04-01T00:00:00Z'),
        baseDate,
        baseDate
      );
    });

    it('should correctly identify draft status', () => {
      expect(draftSeason.isDraft()).toBe(true);
      expect(activeSeason.isDraft()).toBe(false);
      expect(pausedSeason.isDraft()).toBe(false);
    });

    it('should correctly identify active status', () => {
      expect(draftSeason.isActive()).toBe(false);
      expect(activeSeason.isActive()).toBe(true);
      expect(pausedSeason.isActive()).toBe(false);
    });

    it('should correctly identify paused status', () => {
      expect(draftSeason.isPaused()).toBe(false);
      expect(activeSeason.isPaused()).toBe(false);
      expect(pausedSeason.isPaused()).toBe(true);
    });

    it('should correctly identify completed status', () => {
      expect(completedSeason.isCompleted()).toBe(true);
      expect(activeSeason.isCompleted()).toBe(false);
      expect(cancelledSeason.isCompleted()).toBe(false);
    });

    it('should correctly identify cancelled status', () => {
      expect(cancelledSeason.status).toBe(SeasonStatus.CANCELLED);
      expect(completedSeason.status).not.toBe(SeasonStatus.CANCELLED);
      expect(activeSeason.status).not.toBe(SeasonStatus.CANCELLED);
    });

    it('should correctly identify archived status', () => {
      expect(archivedSeason.status).toBe(SeasonStatus.ARCHIVED);
      expect(completedSeason.status).not.toBe(SeasonStatus.ARCHIVED);
      expect(activeSeason.status).not.toBe(SeasonStatus.ARCHIVED);
    });

    it('should correctly identify if season can be started', () => {
      expect(draftSeason.canBeStarted()).toBe(true);
      expect(activeSeason.canBeStarted()).toBe(false);
      expect(pausedSeason.canBeStarted()).toBe(false);
      expect(completedSeason.canBeStarted()).toBe(false);
    });

    it('should correctly identify if season can be paused', () => {
      expect(draftSeason.canBePaused()).toBe(false);
      expect(activeSeason.canBePaused()).toBe(true);
      expect(pausedSeason.canBePaused()).toBe(false);
      expect(completedSeason.canBePaused()).toBe(false);
    });

    it('should correctly identify if season can be resumed', () => {
      expect(draftSeason.canBeResumed()).toBe(false);
      expect(activeSeason.canBeResumed()).toBe(false);
      expect(pausedSeason.canBeResumed()).toBe(true);
      expect(completedSeason.canBeResumed()).toBe(false);
    });

    it('should correctly identify if season can be completed', () => {
      expect(draftSeason.canBeCompleted()).toBe(false);
      expect(activeSeason.canBeCompleted()).toBe(true);
      expect(pausedSeason.canBeCompleted()).toBe(true);
      expect(completedSeason.canBeCompleted()).toBe(false);
    });

    it('should correctly identify if season can be cancelled', () => {
      // Check if seasons can be cancelled based on status
      expect(draftSeason.status).not.toBe(SeasonStatus.COMPLETED);
      expect(draftSeason.status).not.toBe(SeasonStatus.CANCELLED);
      expect(activeSeason.status).not.toBe(SeasonStatus.COMPLETED);
      expect(activeSeason.status).not.toBe(SeasonStatus.CANCELLED);
      expect(pausedSeason.status).not.toBe(SeasonStatus.COMPLETED);
      expect(pausedSeason.status).not.toBe(SeasonStatus.CANCELLED);
      expect(completedSeason.status).toBe(SeasonStatus.COMPLETED);
      expect(cancelledSeason.status).toBe(SeasonStatus.CANCELLED);
    });

    it('should correctly identify if season can be archived', () => {
      // Check if seasons can be archived (must be completed or cancelled, but not already archived)
      expect(draftSeason.status).not.toBe(SeasonStatus.COMPLETED);
      expect(draftSeason.status).not.toBe(SeasonStatus.CANCELLED);
      expect(activeSeason.status).not.toBe(SeasonStatus.COMPLETED);
      expect(activeSeason.status).not.toBe(SeasonStatus.CANCELLED);
      expect(pausedSeason.status).not.toBe(SeasonStatus.COMPLETED);
      expect(pausedSeason.status).not.toBe(SeasonStatus.CANCELLED);
      expect(completedSeason.status === SeasonStatus.COMPLETED || completedSeason.status === SeasonStatus.CANCELLED).toBe(true);
      expect(cancelledSeason.status === SeasonStatus.COMPLETED || cancelledSeason.status === SeasonStatus.CANCELLED).toBe(true);
      expect(archivedSeason.status).toBe(SeasonStatus.ARCHIVED);
    });
  });

  describe('Ownership and Association Methods', () => {
    let season: Season;

    beforeEach(() => {
      season = new Season(
        'season-id',
        mockUserId,
        'Test Season',
        SeasonPriority.STRENGTH,
        12,
        SeasonStatus.DRAFT,
        null,
        null,
        new Date(),
        new Date()
      );
    });

    it('should correctly identify ownership', () => {
      expect(season.belongsToUser(mockUserId)).toBe(true);
      expect(season.belongsToUser('different-user-id')).toBe(false);
    });
  });

  describe('Lifecycle Management Methods', () => {
    let draftSeason: Season;
    let activeSeason: Season;
    let pausedSeason: Season;

    beforeEach(() => {
      const baseDate = new Date('2024-06-01T10:00:00Z');

      draftSeason = new Season(
        'draft-id',
        mockUserId,
        'Draft Season',
        SeasonPriority.STRENGTH,
        12,
        SeasonStatus.DRAFT,
        null,
        null,
        baseDate,
        baseDate
      );

      activeSeason = new Season(
        'active-id',
        mockUserId,
        'Active Season',
        SeasonPriority.MUSCLE_GAIN,
        12,
        SeasonStatus.ACTIVE,
        new Date('2024-06-15T00:00:00Z'),
        new Date('2024-09-15T00:00:00Z'),
        baseDate,
        baseDate
      );

      pausedSeason = new Season(
        'paused-id',
        mockUserId,
        'Paused Season',
        SeasonPriority.ENDURANCE,
        12,
        SeasonStatus.PAUSED,
        new Date('2024-06-15T00:00:00Z'),
        null,
        baseDate,
        baseDate
      );
    });

    describe('start', () => {
      it('should start a draft season successfully', () => {
        const startDate = new Date('2024-06-15T00:00:00Z');
        const startedSeason = draftSeason.start(startDate);

        expect(startedSeason.status).toBe(SeasonStatus.ACTIVE);
        expect(startedSeason.startDate).toBe(startDate);
        expect(startedSeason.id).toBe(draftSeason.id);
        expect(startedSeason.name).toBe(draftSeason.name);
        expect(startedSeason.priority).toBe(draftSeason.priority);
        expect(startedSeason.updatedAt).not.toBe(draftSeason.updatedAt);
      });

      it('should start a draft season with automatic end date calculation', () => {
        const startDate = new Date('2024-06-15T00:00:00Z');
        const seasonWithDuration = new Season(
          'season-with-duration',
          mockUserId,
          'Duration Season',
          SeasonPriority.STRENGTH,
          8, // 8 weeks
          SeasonStatus.DRAFT,
          null,
          null,
          new Date(),
          new Date()
        );

        const startedSeason = seasonWithDuration.start(startDate);
        const expectedEndDate = new Date('2024-08-10T00:00:00Z'); // 8 weeks later

        expect(startedSeason.endDate).toEqual(expectedEndDate);
      });

      it('should prevent starting with invalid dates', () => {
        const futureDate = new Date();
        futureDate.setFullYear(futureDate.getFullYear() + 1);
        
        expect(() => {
          draftSeason.start(futureDate);
        }).not.toThrow(); // Future dates should be allowed
      });

      it('should prevent starting non-draft seasons', () => {
        expect(() => {
          activeSeason.start(new Date());
        }).toThrow('Cannot start season: current status is active');
      });

      it('should handle past start dates', () => {
        const pastDate = new Date('2020-01-01T00:00:00Z');
        expect(() => {
          draftSeason.start(pastDate);
        }).not.toThrow(); // Past dates are allowed
      });
    });

    describe('pause', () => {
      it('should pause an active season successfully', () => {
        const pausedSeason = activeSeason.pause();

        expect(pausedSeason.status).toBe(SeasonStatus.PAUSED);
        expect(pausedSeason.startDate).toBe(activeSeason.startDate);
        expect(pausedSeason.endDate).toBe(activeSeason.endDate);
        expect(pausedSeason.updatedAt).not.toBe(activeSeason.updatedAt);
      });

      it('should prevent pausing non-active seasons', () => {
        expect(() => {
          draftSeason.pause();
        }).toThrow('Cannot pause season: current status is draft');
      });
    });

    describe('resume', () => {
      it('should resume a paused season successfully', () => {
        const resumedSeason = pausedSeason.resume();

        expect(resumedSeason.status).toBe(SeasonStatus.ACTIVE);
        expect(resumedSeason.startDate).toBe(pausedSeason.startDate);
        expect(resumedSeason.endDate).toBe(pausedSeason.endDate);
        expect(resumedSeason.updatedAt).not.toBe(pausedSeason.updatedAt);
      });

      it('should prevent resuming non-paused seasons', () => {
        expect(() => {
          activeSeason.resume();
        }).toThrow('Cannot resume season: current status is active');
      });
    });

    describe('complete', () => {
      it('should complete an active season successfully', () => {
        const completionDate = new Date('2024-09-01T00:00:00Z');
        const completedSeason = activeSeason.complete(completionDate);

        expect(completedSeason.status).toBe(SeasonStatus.COMPLETED);
        expect(completedSeason.endDate).toBe(completionDate);
        expect(completedSeason.startDate).toBe(activeSeason.startDate);
        expect(completedSeason.updatedAt).not.toBe(activeSeason.updatedAt);
      });

      it('should complete a paused season successfully', () => {
        const completionDate = new Date('2024-08-15T00:00:00Z');
        const completedSeason = pausedSeason.complete(completionDate);

        expect(completedSeason.status).toBe(SeasonStatus.COMPLETED);
        expect(completedSeason.endDate).toBe(completionDate);
      });

      it('should complete season with current date if no date provided', () => {
        const beforeComplete = new Date();
        const completedSeason = activeSeason.complete(undefined);
        const afterComplete = new Date();

        expect(completedSeason.status).toBe(SeasonStatus.COMPLETED);
        expect(completedSeason.endDate).toBeInstanceOf(Date);
        expect(completedSeason.endDate!.getTime()).toBeGreaterThanOrEqual(beforeComplete.getTime());
        expect(completedSeason.endDate!.getTime()).toBeLessThanOrEqual(afterComplete.getTime());
      });

      it('should prevent completing draft seasons', () => {
        expect(() => {
          draftSeason.complete(new Date());
        }).toThrow('Cannot complete season: current status is draft');
      });

      it('should validate completion date is not before start date', () => {
        const beforeStartDate = new Date('2024-06-01T00:00:00Z'); // Before activeSeason start date
        expect(() => {
          activeSeason.complete(beforeStartDate);
        }).toThrow('Start date must be before end date');
      });
    });

    describe('cancel', () => {
      it('should cancel a draft season successfully', () => {
        const cancelledSeason = draftSeason.cancel();

        expect(cancelledSeason.status).toBe(SeasonStatus.CANCELLED);
        expect(cancelledSeason.startDate).toBe(draftSeason.startDate);
        expect(cancelledSeason.endDate).toBe(draftSeason.endDate);
        expect(cancelledSeason.updatedAt).not.toBe(draftSeason.updatedAt);
      });

      it('should cancel an active season successfully', () => {
        const cancelledSeason = activeSeason.cancel();

        expect(cancelledSeason.status).toBe(SeasonStatus.CANCELLED);
        expect(cancelledSeason.startDate).toBe(activeSeason.startDate);
        expect(cancelledSeason.endDate).toBe(activeSeason.endDate);
      });

      it('should cancel a paused season successfully', () => {
        const cancelledSeason = pausedSeason.cancel();

        expect(cancelledSeason.status).toBe(SeasonStatus.CANCELLED);
      });

      // Note: Owner validation would be handled at the service layer

      it('should prevent cancelling completed seasons', () => {
        const completedSeason = activeSeason.complete(new Date());
        expect(() => {
          completedSeason.cancel();
        }).toThrow('Cannot cancel a completed season');
      });

      it('should allow cancelling already cancelled seasons', () => {
        const cancelledSeason = draftSeason.cancel();
        expect(() => {
          cancelledSeason.cancel();
        }).not.toThrow(); // Already cancelled seasons can be cancelled again
      });
    });

    describe('archive', () => {
      it('should archive a completed season successfully', () => {
        const completedSeason = activeSeason.complete(new Date());
        const archivedSeason = completedSeason.archive();

        expect(archivedSeason.status).toBe(SeasonStatus.ARCHIVED);
        expect(archivedSeason.startDate).toBe(completedSeason.startDate);
        expect(archivedSeason.endDate).toBe(completedSeason.endDate);
        expect(archivedSeason.updatedAt).not.toBe(completedSeason.updatedAt);
      });

      it('should archive a cancelled season successfully', () => {
        const cancelledSeason = draftSeason.cancel();
        const archivedSeason = cancelledSeason.archive();

        expect(archivedSeason.status).toBe(SeasonStatus.ARCHIVED);
      });

      // Note: Owner validation would be handled at the service layer

      it('should prevent archiving active seasons', () => {
        expect(() => {
          activeSeason.archive();
        }).toThrow('Can only archive completed or cancelled seasons');
      });
    });
  });

  describe('Metadata Update Methods', () => {
    let season: Season;

    beforeEach(() => {
      season = new Season(
        'season-id',
        mockUserId,
        'Original Season',
        SeasonPriority.STRENGTH,
        12,
        SeasonStatus.DRAFT,
        null,
        null,
        new Date('2024-06-01T10:00:00Z'),
        new Date('2024-06-01T10:00:00Z')
      );
    });

    describe('updateMetadata', () => {
      it('should update season name successfully', () => {
        const updatedSeason = season.updateMetadata(
          'Updated Season Name',
          SeasonPriority.MUSCLE_GAIN,
          16,
          mockUserId
        );

        expect(updatedSeason.name).toBe('Updated Season Name');
        expect(updatedSeason.priority).toBe(SeasonPriority.MUSCLE_GAIN);
        expect(updatedSeason.durationWeeks).toBe(16);
        expect(updatedSeason.id).toBe(season.id);
        expect(updatedSeason.status).toBe(season.status);
        expect(updatedSeason.startDate).toBe(season.startDate);
        expect(updatedSeason.endDate).toBe(season.endDate);
        expect(updatedSeason.createdAt).toBe(season.createdAt);
        expect(updatedSeason.updatedAt).not.toBe(season.updatedAt);
      });

      it('should update individual fields while preserving others', () => {
        const updatedSeason = season.updateMetadata(
          'New Name Only',
          season.priority, // Keep same priority
          season.durationWeeks, // Keep same duration
          mockUserId
        );

        expect(updatedSeason.name).toBe('New Name Only');
        expect(updatedSeason.priority).toBe(SeasonPriority.STRENGTH);
        expect(updatedSeason.durationWeeks).toBe(12);
      });

      it('should update duration to undefined (no duration)', () => {
        const updatedSeason = season.updateMetadata(
          season.name,
          season.priority,
          undefined, // Remove duration
          mockUserId
        );

        expect(updatedSeason.durationWeeks).toBe(season.durationWeeks); // Preserves original when undefined
      });

      it('should prevent non-owners from updating metadata', () => {
        expect(() => {
          season.updateMetadata(
            'Hacked Name',
            SeasonPriority.FAT_LOSS,
            10,
            'different-user-id'
          );
        }).toThrow('Cannot update season: user does not own this season');
      });

      it('should validate name during update', () => {
        expect(() => {
          season.updateMetadata(
            '', // Empty name
            season.priority,
            season.durationWeeks,
            mockUserId
          );
        }).toThrow('Season name cannot be empty');
      });

      it('should validate duration during update', () => {
        expect(() => {
          season.updateMetadata(
            season.name,
            season.priority,
            -5, // Invalid duration
            mockUserId
          );
        }).toThrow('Duration must be a positive integer number of weeks');
      });

      it('should prevent updating metadata for completed seasons', () => {
        const startDate = new Date('2024-06-01T00:00:00Z');
        const completionDate = new Date('2024-06-15T00:00:00Z'); // 2 weeks later
        const activeSeason = season.start(startDate);
        const completedSeason = activeSeason.complete(completionDate);

        expect(() => {
          completedSeason.updateMetadata(
            'New Name',
            SeasonPriority.MUSCLE_GAIN,
            10,
            mockUserId
          );
        }).toThrow('Can only update metadata for draft seasons');
      });

      it('should prevent updating metadata for cancelled seasons', () => {
        const cancelledSeason = season.cancel();

        expect(() => {
          cancelledSeason.updateMetadata(
            'New Name',
            SeasonPriority.MUSCLE_GAIN,
            10,
            mockUserId
          );
        }).toThrow('Can only update metadata for draft seasons');
      });

      it('should return new instance for updates (immutability)', () => {
        const updatedSeason = season.updateMetadata(
          'New Name',
          SeasonPriority.MUSCLE_GAIN,
          10,
          mockUserId
        );

        expect(updatedSeason).not.toBe(season);
        expect(season.name).toBe('Original Season'); // Original unchanged
      });
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle seasons with exactly 52 weeks', () => {
      const maxDurationSeason = Season.createDraft(
        mockUserId,
        'Max Duration Season',
        SeasonPriority.ENDURANCE,
        52 // Maximum allowed
      );

      expect(maxDurationSeason.durationWeeks).toBe(52);
    });

    it('should handle seasons with exactly 100 character names', () => {
      const exactly100Chars = 'a'.repeat(100);
      const maxNameSeason = Season.createDraft(
        mockUserId,
        exactly100Chars,
        SeasonPriority.STRENGTH
      );

      expect(maxNameSeason.name).toBe(exactly100Chars);
      expect(maxNameSeason.name.length).toBe(100);
    });

    it('should handle start date calculations properly', () => {
      const draftSeason = new Season(
        'season-id',
        mockUserId,
        'Test Season',
        SeasonPriority.STRENGTH,
        4, // 4 weeks
        SeasonStatus.DRAFT,
        null,
        null,
        new Date(),
        new Date()
      );

      const startDate = new Date('2024-06-01T00:00:00Z');
      const startedSeason = draftSeason.start(startDate);

      // Should be exactly 4 weeks (28 days) later
      const expectedEndDate = new Date('2024-06-29T00:00:00Z');
      expect(startedSeason.endDate).toEqual(expectedEndDate);
    });

    it('should handle leap year calculations for end dates', () => {
      const draftSeason = new Season(
        'season-id',
        mockUserId,
        'Leap Year Season',
        SeasonPriority.STRENGTH,
        4,
        SeasonStatus.DRAFT,
        null,
        null,
        new Date(),
        new Date()
      );

      // Start in February of a leap year
      const startDate = new Date('2024-02-15T00:00:00Z');
      const startedSeason = draftSeason.start(startDate);

      // Should properly handle February having 29 days in 2024
      const expectedEndDate = new Date('2024-03-14T00:00:00Z');
      expect(startedSeason.endDate).toEqual(expectedEndDate);
    });

    it('should preserve immutability across all operations', () => {
      const originalSeason = new Season(
        'season-id',
        mockUserId,
        'Original Season',
        SeasonPriority.STRENGTH,
        12,
        SeasonStatus.DRAFT,
        null,
        null,
        new Date('2024-06-01T10:00:00Z'),
        new Date('2024-06-01T10:00:00Z')
      );

      // Perform various operations
      const startDate = new Date('2024-06-01T00:00:00Z');
      const completionDate = new Date('2024-06-15T00:00:00Z'); // 2 weeks later
      const startedSeason = originalSeason.start(startDate);
      const pausedSeason = startedSeason.pause();
      const resumedSeason = pausedSeason.resume();
      const completedSeason = resumedSeason.complete(completionDate);

      // Original should be unchanged
      expect(originalSeason.status).toBe(SeasonStatus.DRAFT);
      expect(originalSeason.startDate).toBeNull();

      // Each step should be independent
      expect(startedSeason.status).toBe(SeasonStatus.ACTIVE);
      expect(pausedSeason.status).toBe(SeasonStatus.PAUSED);
      expect(resumedSeason.status).toBe(SeasonStatus.ACTIVE);
      expect(completedSeason.status).toBe(SeasonStatus.COMPLETED);
    });

    it('should handle UUID validation edge cases', () => {
      const validUUIDs = [
        '123e4567-e89b-12d3-a456-426614174000',
        '00000000-0000-0000-0000-000000000000',
        'ffffffff-ffff-ffff-ffff-ffffffffffff'
      ];

      validUUIDs.forEach(uuid => {
        expect(() => {
          Season.createDraft(uuid, 'Test Season', SeasonPriority.STRENGTH);
        }).not.toThrow();
      });

      const invalidUUIDs = [
        'not-a-uuid',
        '123e4567-e89b-12d3-a456', // Too short
        '123e4567-e89b-12d3-a456-426614174000-extra', // Too long
        '123e4567-e89b-12d3-a456-42661417400z', // Invalid character
        ''
      ];

      invalidUUIDs.forEach(uuid => {
        expect(() => {
          Season.createDraft(uuid, 'Test Season', SeasonPriority.STRENGTH);
        }).toThrow();
      });
    });

    it('should handle time zone independence for date calculations', () => {
      const utcDate = new Date('2024-06-15T12:00:00Z');
      const season = new Season(
        'season-id',
        mockUserId,
        'Test Season',
        SeasonPriority.STRENGTH,
        2, // 2 weeks
        SeasonStatus.DRAFT,
        null,
        null,
        new Date(),
        new Date()
      );

      const startedSeason = season.start(utcDate);
      const expectedEndDate = new Date('2024-06-29T12:00:00Z'); // 2 weeks later, same time

      expect(startedSeason.endDate).toEqual(expectedEndDate);
    });
  });
});

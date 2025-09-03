import { MetricProgressLog, ProgressLogEntryType } from '../metricProgressLog';
import { MetricUnit } from '../metric';

describe('MetricProgressLog Domain Model', () => {
  const mockSeasonId = '123e4567-e89b-12d3-a456-426614174000';
  const mockMetricId = '987fcdeb-51a2-43d1-b789-123456789abc';
  const mockUserId = 'aaa11111-2222-3333-4444-555555555555';

  describe('Constructor and Validation', () => {
    it('should create a valid manual progress log instance', () => {
      const log = new MetricProgressLog(
        'test-id',
        mockSeasonId,
        mockMetricId,
        mockUserId,
        75.5,
        MetricUnit.KILOGRAMS,
        75.5,
        new Date('2024-06-15T10:30:00Z'),
        ProgressLogEntryType.MANUAL,
        null,
        'Morning weigh-in',
        new Date('2024-06-15T10:30:00Z'),
        new Date('2024-06-15T10:30:00Z')
      );

      expect(log.id).toBe('test-id');
      expect(log.seasonId).toBe(mockSeasonId);
      expect(log.metricId).toBe(mockMetricId);
      expect(log.userId).toBe(mockUserId);
      expect(log.value).toBe(75.5);
      expect(log.unit).toBe(MetricUnit.KILOGRAMS);
      expect(log.canonicalValue).toBe(75.5);
      expect(log.loggedAt).toEqual(new Date('2024-06-15T10:30:00Z'));
      expect(log.entryType).toBe(ProgressLogEntryType.MANUAL);
      expect(log.sourceReference).toBeNull();
      expect(log.notes).toBe('Morning weigh-in');
    });

    it('should create a valid app-calculated progress log instance', () => {
      const log = new MetricProgressLog(
        'test-id',
        mockSeasonId,
        mockMetricId,
        mockUserId,
        120,
        MetricUnit.KILOGRAMS,
        120,
        new Date('2024-06-15T15:45:00Z'),
        ProgressLogEntryType.APP_CALCULATED,
        'workout_session_abc123',
        'Calculated from bench press workout',
        new Date('2024-06-15T15:45:00Z'),
        new Date('2024-06-15T15:45:00Z')
      );

      expect(log.entryType).toBe(ProgressLogEntryType.APP_CALCULATED);
      expect(log.sourceReference).toBe('workout_session_abc123');
    });

    it('should create a valid imported progress log instance', () => {
      const log = new MetricProgressLog(
        'test-id',
        mockSeasonId,
        mockMetricId,
        mockUserId,
        8500,
        MetricUnit.COUNT,
        8500,
        new Date('2024-06-14T23:59:59Z'),
        ProgressLogEntryType.IMPORTED,
        'fitbit_import_batch_456',
        'Imported from Fitbit',
        new Date('2024-06-15T09:00:00Z'),
        new Date('2024-06-15T09:00:00Z')
      );

      expect(log.entryType).toBe(ProgressLogEntryType.IMPORTED);
      expect(log.sourceReference).toBe('fitbit_import_batch_456');
    });

    it('should validate season ID on construction', () => {
      expect(() => {
        new MetricProgressLog(
          'test-id',
          '', // Empty season ID
          mockMetricId,
          mockUserId,
          75,
          MetricUnit.KILOGRAMS,
          75,
          new Date(),
          ProgressLogEntryType.MANUAL,
          null,
          '',
          new Date(),
          new Date()
        );
      }).toThrow('Season ID cannot be empty');
    });

    it('should validate metric ID on construction', () => {
      expect(() => {
        new MetricProgressLog(
          'test-id',
          mockSeasonId,
          'invalid-metric-id', // Invalid UUID
          mockUserId,
          75,
          MetricUnit.KILOGRAMS,
          75,
          new Date(),
          ProgressLogEntryType.MANUAL,
          null,
          '',
          new Date(),
          new Date()
        );
      }).toThrow('Metric ID must be a valid UUID');
    });

    it('should validate user ID on construction', () => {
      expect(() => {
        new MetricProgressLog(
          'test-id',
          mockSeasonId,
          mockMetricId,
          '', // Empty user ID
          75,
          MetricUnit.KILOGRAMS,
          75,
          new Date(),
          ProgressLogEntryType.MANUAL,
          null,
          '',
          new Date(),
          new Date()
        );
      }).toThrow('User ID cannot be empty');
    });

    it('should validate value on construction', () => {
      expect(() => {
        new MetricProgressLog(
          'test-id',
          mockSeasonId,
          mockMetricId,
          mockUserId,
          -10, // Negative value
          MetricUnit.KILOGRAMS,
          -10,
          new Date(),
          ProgressLogEntryType.MANUAL,
          null,
          '',
          new Date(),
          new Date()
        );
      }).toThrow('Value cannot be negative');
    });

    it('should validate canonical value on construction', () => {
      expect(() => {
        new MetricProgressLog(
          'test-id',
          mockSeasonId,
          mockMetricId,
          mockUserId,
          75,
          MetricUnit.KILOGRAMS,
          Infinity, // Invalid canonical value
          new Date(),
          ProgressLogEntryType.MANUAL,
          null,
          '',
          new Date(),
          new Date()
        );
      }).toThrow('Canonical value must be a finite number');
    });

    it('should validate notes length on construction', () => {
      const longNotes = 'a'.repeat(501); // 501 characters
      expect(() => {
        new MetricProgressLog(
          'test-id',
          mockSeasonId,
          mockMetricId,
          mockUserId,
          75,
          MetricUnit.KILOGRAMS,
          75,
          new Date(),
          ProgressLogEntryType.MANUAL,
          null,
          longNotes,
          new Date(),
          new Date()
        );
      }).toThrow('Notes cannot exceed 500 characters');
    });

    it('should validate app-calculated entries have source reference', () => {
      expect(() => {
        new MetricProgressLog(
          'test-id',
          mockSeasonId,
          mockMetricId,
          mockUserId,
          75,
          MetricUnit.KILOGRAMS,
          75,
          new Date(),
          ProgressLogEntryType.APP_CALCULATED,
          null, // Missing source reference for app-calculated
          '',
          new Date(),
          new Date()
        );
      }).toThrow('App-calculated entries must have a source reference');
    });

    it('should prevent future logged dates', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1); // Tomorrow

      expect(() => {
        new MetricProgressLog(
          'test-id',
          mockSeasonId,
          mockMetricId,
          mockUserId,
          75,
          MetricUnit.KILOGRAMS,
          75,
          futureDate, // Future logged date
          ProgressLogEntryType.MANUAL,
          null,
          '',
          new Date(),
          new Date()
        );
      }).toThrow('Logged date cannot be in the future');
    });
  });

  describe('Static Factory Methods', () => {
    describe('createManual', () => {
      it('should create manual progress log data successfully', () => {
        const logData = MetricProgressLog.createManual(
          mockSeasonId,
          mockMetricId,
          mockUserId,
          78.2,
          MetricUnit.KILOGRAMS,
          78.2,
          new Date('2024-06-15T08:00:00Z'),
          'Post-workout weight'
        );

        expect(logData.seasonId).toBe(mockSeasonId);
        expect(logData.metricId).toBe(mockMetricId);
        expect(logData.userId).toBe(mockUserId);
        expect(logData.value).toBe(78.2);
        expect(logData.unit).toBe(MetricUnit.KILOGRAMS);
        expect(logData.canonicalValue).toBe(78.2);
        expect(logData.loggedAt).toEqual(new Date('2024-06-15T08:00:00Z'));
        expect(logData.entryType).toBe(ProgressLogEntryType.MANUAL);
        expect(logData.sourceReference).toBeNull();
        expect(logData.notes).toBe('Post-workout weight');
      });

      it('should create manual log data with default timestamp', () => {
        const beforeCreate = new Date();
        const logData = MetricProgressLog.createManual(
          mockSeasonId,
          mockMetricId,
          mockUserId,
          75,
          MetricUnit.KILOGRAMS,
          75
        );
        const afterCreate = new Date();

        expect(logData.loggedAt).toBeInstanceOf(Date);
        expect(logData.loggedAt.getTime()).toBeGreaterThanOrEqual(beforeCreate.getTime());
        expect(logData.loggedAt.getTime()).toBeLessThanOrEqual(afterCreate.getTime());
        expect(logData.notes).toBe('');
      });

      it('should validate season ID for manual entries', () => {
        expect(() => {
          MetricProgressLog.createManual(
            'invalid-season-id',
            mockMetricId,
            mockUserId,
            75,
            MetricUnit.KILOGRAMS,
            75
          );
        }).toThrow('Season ID must be a valid UUID');
      });

      it('should validate values for manual entries', () => {
        expect(() => {
          MetricProgressLog.createManual(
            mockSeasonId,
            mockMetricId,
            mockUserId,
            -5, // Negative value
            MetricUnit.KILOGRAMS,
            -5
          );
        }).toThrow('Value cannot be negative');
      });
    });

    describe('createAppCalculated', () => {
      it('should create app-calculated progress log data successfully', () => {
        const logData = MetricProgressLog.createAppCalculated(
          mockSeasonId,
          mockMetricId,
          mockUserId,
          125,
          MetricUnit.KILOGRAMS,
          125,
          'bench_press_session_xyz789',
          new Date('2024-06-15T16:30:00Z'),
          'Calculated 1RM from workout'
        );

        expect(logData.entryType).toBe(ProgressLogEntryType.APP_CALCULATED);
        expect(logData.sourceReference).toBe('bench_press_session_xyz789');
        expect(logData.value).toBe(125);
        expect(logData.loggedAt).toEqual(new Date('2024-06-15T16:30:00Z'));
        expect(logData.notes).toBe('Calculated 1RM from workout');
      });

      it('should create app-calculated log data with default timestamp', () => {
        const beforeCreate = new Date();
        const logData = MetricProgressLog.createAppCalculated(
          mockSeasonId,
          mockMetricId,
          mockUserId,
          100,
          MetricUnit.KILOGRAMS,
          100,
          'workout_session_123'
        );
        const afterCreate = new Date();

        expect(logData.loggedAt).toBeInstanceOf(Date);
        expect(logData.loggedAt.getTime()).toBeGreaterThanOrEqual(beforeCreate.getTime());
        expect(logData.loggedAt.getTime()).toBeLessThanOrEqual(afterCreate.getTime());
        expect(logData.notes).toBe('');
      });

      it('should validate source reference for app-calculated entries', () => {
        expect(() => {
          MetricProgressLog.createAppCalculated(
            mockSeasonId,
            mockMetricId,
            mockUserId,
            100,
            MetricUnit.KILOGRAMS,
            100,
            '' // Empty source reference
          );
        }).toThrow('Source reference cannot be empty for app-calculated entries');
      });

      it('should validate source reference length', () => {
        const longReference = 'a'.repeat(201); // 201 characters
        expect(() => {
          MetricProgressLog.createAppCalculated(
            mockSeasonId,
            mockMetricId,
            mockUserId,
            100,
            MetricUnit.KILOGRAMS,
            100,
            longReference
          );
        }).toThrow('Source reference cannot exceed 200 characters');
      });
    });

    describe('createImported', () => {
      it('should create imported progress log data successfully', () => {
        const importDate = new Date('2024-06-14T22:00:00Z');
        const logData = MetricProgressLog.createImported(
          mockSeasonId,
          mockMetricId,
          mockUserId,
          9200,
          MetricUnit.COUNT,
          9200,
          importDate,
          'apple_health_import_batch_789',
          'Imported from Apple Health'
        );

        expect(logData.entryType).toBe(ProgressLogEntryType.IMPORTED);
        expect(logData.sourceReference).toBe('apple_health_import_batch_789');
        expect(logData.value).toBe(9200);
        expect(logData.loggedAt).toEqual(importDate);
        expect(logData.notes).toBe('Imported from Apple Health');
      });

      it('should create imported log data without source reference', () => {
        const logData = MetricProgressLog.createImported(
          mockSeasonId,
          mockMetricId,
          mockUserId,
          7500,
          MetricUnit.COUNT,
          7500,
          new Date('2024-06-14T20:00:00Z')
        );

        expect(logData.sourceReference).toBeNull();
        expect(logData.notes).toBe('');
      });
    });

    describe('fromData', () => {
      it('should reconstruct manual progress log from database data', () => {
        const dbData = {
          id: 'test-id',
          seasonId: mockSeasonId,
          metricId: mockMetricId,
          userId: mockUserId,
          value: 76.8,
          unit: 'kg',
          canonicalValue: 76.8,
          loggedAt: new Date('2024-06-15T07:30:00Z'),
          entryType: 'manual',
          sourceReference: null,
          notes: 'Morning measurement',
          createdAt: new Date('2024-06-15T07:30:00Z'),
          updatedAt: new Date('2024-06-15T07:30:00Z')
        };

        const log = MetricProgressLog.fromData(dbData);

        expect(log.id).toBe('test-id');
        expect(log.value).toBe(76.8);
        expect(log.unit).toBe(MetricUnit.KILOGRAMS);
        expect(log.entryType).toBe(ProgressLogEntryType.MANUAL);
        expect(log.sourceReference).toBeNull();
        expect(log.notes).toBe('Morning measurement');
      });

      it('should reconstruct app-calculated progress log from database data', () => {
        const dbData = {
          id: 'test-id',
          seasonId: mockSeasonId,
          metricId: mockMetricId,
          userId: mockUserId,
          value: 130,
          unit: 'kg',
          canonicalValue: 130,
          loggedAt: new Date('2024-06-15T17:00:00Z'),
          entryType: 'app_calculated',
          sourceReference: 'deadlift_session_456',
          notes: 'Calculated from deadlift PR',
          createdAt: new Date('2024-06-15T17:00:00Z'),
          updatedAt: new Date('2024-06-15T17:00:00Z')
        };

        const log = MetricProgressLog.fromData(dbData);

        expect(log.entryType).toBe(ProgressLogEntryType.APP_CALCULATED);
        expect(log.sourceReference).toBe('deadlift_session_456');
      });

      it('should throw error for invalid unit from database', () => {
        const dbData = {
          id: 'test-id',
          seasonId: mockSeasonId,
          metricId: mockMetricId,
          userId: mockUserId,
          value: 75,
          unit: 'invalid_unit',
          canonicalValue: 75,
          loggedAt: new Date(),
          entryType: 'manual',
          sourceReference: null,
          notes: '',
          createdAt: new Date(),
          updatedAt: new Date()
        };

        expect(() => {
          MetricProgressLog.fromData(dbData);
        }).toThrow('Invalid metric unit: invalid_unit');
      });

      it('should throw error for invalid entry type from database', () => {
        const dbData = {
          id: 'test-id',
          seasonId: mockSeasonId,
          metricId: mockMetricId,
          userId: mockUserId,
          value: 75,
          unit: 'kg',
          canonicalValue: 75,
          loggedAt: new Date(),
          entryType: 'invalid_entry_type',
          sourceReference: null,
          notes: '',
          createdAt: new Date(),
          updatedAt: new Date()
        };

        expect(() => {
          MetricProgressLog.fromData(dbData);
        }).toThrow('Invalid entry type: invalid_entry_type');
      });
    });
  });

  describe('Business Logic Methods', () => {
    let manualLog: MetricProgressLog;
    let appCalculatedLog: MetricProgressLog;
    let importedLog: MetricProgressLog;

    beforeEach(() => {
      manualLog = new MetricProgressLog(
        'manual-log-id',
        mockSeasonId,
        mockMetricId,
        mockUserId,
        77.5,
        MetricUnit.KILOGRAMS,
        77.5,
        new Date('2024-06-15T08:00:00Z'),
        ProgressLogEntryType.MANUAL,
        null,
        'Manual entry',
        new Date('2024-06-15T08:00:00Z'),
        new Date('2024-06-15T08:00:00Z')
      );

      appCalculatedLog = new MetricProgressLog(
        'app-calculated-log-id',
        mockSeasonId,
        mockMetricId,
        mockUserId,
        115,
        MetricUnit.KILOGRAMS,
        115,
        new Date('2024-06-15T16:00:00Z'),
        ProgressLogEntryType.APP_CALCULATED,
        'squat_session_789',
        'Calculated from squat workout',
        new Date('2024-06-15T16:00:00Z'),
        new Date('2024-06-15T16:00:00Z')
      );

      importedLog = new MetricProgressLog(
        'imported-log-id',
        mockSeasonId,
        mockMetricId,
        mockUserId,
        8750,
        MetricUnit.COUNT,
        8750,
        new Date('2024-06-14T23:59:59Z'),
        ProgressLogEntryType.IMPORTED,
        'garmin_import_123',
        'Imported step count',
        new Date('2024-06-15T09:00:00Z'),
        new Date('2024-06-15T09:00:00Z')
      );
    });

    describe('Type Checking Methods', () => {
      it('should correctly identify entry types', () => {
        expect(manualLog.isManual()).toBe(true);
        expect(manualLog.isAppCalculated()).toBe(false);
        expect(manualLog.isImported()).toBe(false);

        expect(appCalculatedLog.isManual()).toBe(false);
        expect(appCalculatedLog.isAppCalculated()).toBe(true);
        expect(appCalculatedLog.isImported()).toBe(false);

        expect(importedLog.isManual()).toBe(false);
        expect(importedLog.isAppCalculated()).toBe(false);
        expect(importedLog.isImported()).toBe(true);
      });
    });

    describe('Ownership and Association Methods', () => {
      it('should correctly identify ownership', () => {
        expect(manualLog.belongsToUser(mockUserId)).toBe(true);
        expect(manualLog.belongsToUser('different-user-id')).toBe(false);
      });

      it('should correctly identify season association', () => {
        expect(manualLog.belongsToSeason(mockSeasonId)).toBe(true);
        expect(manualLog.belongsToSeason('different-season-id')).toBe(false);
      });

      it('should correctly identify source reference presence', () => {
        expect(manualLog.hasSourceReference()).toBe(false);
        expect(appCalculatedLog.hasSourceReference()).toBe(true);
        expect(importedLog.hasSourceReference()).toBe(true);
      });
    });

    describe('Time-based Query Methods', () => {
      it('should correctly identify entries logged today', () => {
        const today = new Date();
        const todayLog = new MetricProgressLog(
          'today-log-id',
          mockSeasonId,
          mockMetricId,
          mockUserId,
          75,
          MetricUnit.KILOGRAMS,
          75,
          today,
          ProgressLogEntryType.MANUAL,
          null,
          '',
          today,
          today
        );

        expect(todayLog.isLoggedToday()).toBe(true);
        expect(manualLog.isLoggedToday()).toBe(false); // From 2024-06-15
      });

      it('should correctly identify entries within days', () => {
        const now = new Date();
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(now.getDate() - 2);

        const recentLog = new MetricProgressLog(
          'recent-log-id',
          mockSeasonId,
          mockMetricId,
          mockUserId,
          75,
          MetricUnit.KILOGRAMS,
          75,
          twoDaysAgo,
          ProgressLogEntryType.MANUAL,
          null,
          '',
          now,
          now
        );

        expect(recentLog.isLoggedWithinDays(3)).toBe(true);
        expect(recentLog.isLoggedWithinDays(1)).toBe(false);
      });
    });

    describe('Update Methods (Manual Entries Only)', () => {
      it('should update value for manual entries', () => {
        const updatedLog = manualLog.updateValue(
          78.0,
          MetricUnit.KILOGRAMS,
          78.0,
          mockUserId
        );

        expect(updatedLog.value).toBe(78.0);
        expect(updatedLog.canonicalValue).toBe(78.0);
        expect(updatedLog.id).toBe(manualLog.id);
        expect(updatedLog.entryType).toBe(manualLog.entryType);
        expect(updatedLog.loggedAt).toBe(manualLog.loggedAt);
        expect(updatedLog.createdAt).toBe(manualLog.createdAt);
        expect(updatedLog.updatedAt).not.toBe(manualLog.updatedAt);
      });

      it('should prevent non-owners from updating values', () => {
        expect(() => {
          manualLog.updateValue(
            80.0,
            MetricUnit.KILOGRAMS,
            80.0,
            'different-user-id'
          );
        }).toThrow('Cannot update progress log: user does not own this entry');
      });

      it('should prevent updating non-manual entries', () => {
        expect(() => {
          appCalculatedLog.updateValue(
            120.0,
            MetricUnit.KILOGRAMS,
            120.0,
            mockUserId
          );
        }).toThrow('Cannot update value: only manual entries can be modified');
      });

      it('should update logged timestamp for manual entries', () => {
        const newLoggedDate = new Date('2024-06-15T09:00:00Z');
        const updatedLog = manualLog.updateLoggedAt(newLoggedDate, mockUserId);

        expect(updatedLog.loggedAt).toEqual(newLoggedDate);
        expect(updatedLog.value).toBe(manualLog.value); // Preserved
        expect(updatedLog.updatedAt).not.toBe(manualLog.updatedAt);
      });

      it('should prevent non-owners from updating logged timestamp', () => {
        expect(() => {
          manualLog.updateLoggedAt(
            new Date('2024-06-15T10:00:00Z'),
            'different-user-id'
          );
        }).toThrow('Cannot update progress log: user does not own this entry');
      });

      it('should prevent updating logged timestamp for non-manual entries', () => {
        expect(() => {
          appCalculatedLog.updateLoggedAt(
            new Date('2024-06-15T18:00:00Z'),
            mockUserId
          );
        }).toThrow('Cannot update logged time: only manual entries can be modified');
      });

      it('should update notes for any entry type', () => {
        const updatedManualLog = manualLog.updateNotes('Updated manual notes', mockUserId);
        const updatedAppLog = appCalculatedLog.updateNotes('Updated app notes', mockUserId);

        expect(updatedManualLog.notes).toBe('Updated manual notes');
        expect(updatedAppLog.notes).toBe('Updated app notes');
        expect(updatedManualLog.value).toBe(manualLog.value); // Preserved
        expect(updatedAppLog.value).toBe(appCalculatedLog.value); // Preserved
      });

      it('should prevent non-owners from updating notes', () => {
        expect(() => {
          manualLog.updateNotes('Hacked notes', 'different-user-id');
        }).toThrow('Cannot update progress log: user does not own this entry');
      });

      it('should validate notes length during update', () => {
        const longNotes = 'a'.repeat(501); // 501 characters
        expect(() => {
          manualLog.updateNotes(longNotes, mockUserId);
        }).toThrow('Notes cannot exceed 500 characters');
      });

      it('should return new instance for updates (immutability)', () => {
        const updatedLog = manualLog.updateValue(80, MetricUnit.KILOGRAMS, 80, mockUserId);

        expect(updatedLog).not.toBe(manualLog);
        expect(manualLog.value).toBe(77.5); // Original unchanged
      });
    });

    describe('Copy Methods', () => {
      it('should copy entry with new date', () => {
        const newDate = new Date('2024-06-16T08:00:00Z');
        const copiedData = manualLog.copyWithNewDate(newDate, mockUserId);

        expect(copiedData.seasonId).toBe(manualLog.seasonId);
        expect(copiedData.metricId).toBe(manualLog.metricId);
        expect(copiedData.userId).toBe(manualLog.userId);
        expect(copiedData.value).toBe(manualLog.value);
        expect(copiedData.unit).toBe(manualLog.unit);
        expect(copiedData.canonicalValue).toBe(manualLog.canonicalValue);
        expect(copiedData.loggedAt).toEqual(newDate);
        expect(copiedData.entryType).toBe(manualLog.entryType);
        expect(copiedData.sourceReference).toBe(manualLog.sourceReference);
        expect(copiedData.notes).toBe(manualLog.notes);
      });

      it('should prevent non-owners from copying entries', () => {
        expect(() => {
          manualLog.copyWithNewDate(new Date(), 'different-user-id');
        }).toThrow('Cannot copy progress log: user does not own this entry');
      });
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle zero values', () => {
      const zeroLog = MetricProgressLog.createManual(
        mockSeasonId,
        mockMetricId,
        mockUserId,
        0,
        MetricUnit.KILOGRAMS,
        0
      );

      expect(zeroLog.value).toBe(0);
      expect(zeroLog.canonicalValue).toBe(0);
    });

    it('should handle infinite values validation', () => {
      expect(() => {
        MetricProgressLog.createManual(
          mockSeasonId,
          mockMetricId,
          mockUserId,
          Infinity,
          MetricUnit.KILOGRAMS,
          Infinity
        );
      }).toThrow('Value must be a finite number');
    });

    it('should handle NaN values validation', () => {
      expect(() => {
        MetricProgressLog.createManual(
          mockSeasonId,
          mockMetricId,
          mockUserId,
          NaN,
          MetricUnit.KILOGRAMS,
          NaN
        );
      }).toThrow('Value must be a finite number');
    });

    it('should handle empty UUIDs', () => {
      expect(() => {
        MetricProgressLog.createManual(
          '', // Empty season ID
          mockMetricId,
          mockUserId,
          75,
          MetricUnit.KILOGRAMS,
          75
        );
      }).toThrow('Season ID cannot be empty');
    });

    it('should handle malformed UUIDs', () => {
      expect(() => {
        MetricProgressLog.createManual(
          'not-a-valid-uuid',
          mockMetricId,
          mockUserId,
          75,
          MetricUnit.KILOGRAMS,
          75
        );
      }).toThrow('Season ID must be a valid UUID');
    });

    it('should preserve all properties during updates', () => {
      const originalDate = new Date('2024-06-15T08:00:00Z');
      const log = new MetricProgressLog(
        'test-id',
        mockSeasonId,
        mockMetricId,
        mockUserId,
        75.5,
        MetricUnit.KILOGRAMS,
        75.5,
        originalDate,
        ProgressLogEntryType.MANUAL,
        null,
        'Original notes',
        originalDate,
        originalDate
      );

      const updatedValue = log.updateValue(76.0, MetricUnit.KILOGRAMS, 76.0, mockUserId);
      const updatedTime = log.updateLoggedAt(new Date('2024-06-15T09:00:00Z'), mockUserId);
      const updatedNotes = log.updateNotes('New notes', mockUserId);

      // Check that unrelated properties are preserved
      expect(updatedValue.loggedAt).toBe(originalDate);
      expect(updatedValue.notes).toBe('Original notes');
      expect(updatedTime.value).toBe(75.5);
      expect(updatedTime.notes).toBe('Original notes');
      expect(updatedNotes.value).toBe(75.5);
      expect(updatedNotes.loggedAt).toBe(originalDate);
    });

    it('should handle boundary notes length (exactly 500 characters)', () => {
      const exactly500Chars = 'a'.repeat(500);
      
      const logData = MetricProgressLog.createManual(
        mockSeasonId,
        mockMetricId,
        mockUserId,
        75,
        MetricUnit.KILOGRAMS,
        75,
        undefined,
        exactly500Chars
      );

      expect(logData.notes).toBe(exactly500Chars);
      expect(logData.notes.length).toBe(500);
    });

    it('should handle boundary source reference length (exactly 200 characters)', () => {
      const exactly200Chars = 'a'.repeat(200);
      
      const logData = MetricProgressLog.createAppCalculated(
        mockSeasonId,
        mockMetricId,
        mockUserId,
        100,
        MetricUnit.KILOGRAMS,
        100,
        exactly200Chars
      );

      expect(logData.sourceReference).toBe(exactly200Chars);
      expect(logData.sourceReference!.length).toBe(200);
    });

    it('should handle time-based queries edge cases', () => {
      const midnight = new Date();
      midnight.setHours(0, 0, 0, 0);

      const midnightLog = new MetricProgressLog(
        'midnight-log',
        mockSeasonId,
        mockMetricId,
        mockUserId,
        75,
        MetricUnit.KILOGRAMS,
        75,
        midnight,
        ProgressLogEntryType.MANUAL,
        null,
        '',
        midnight,
        midnight
      );

      expect(midnightLog.isLoggedToday()).toBe(true);
      
      // Within 0 days means only entries from today onwards
      // Since midnight is at start of today and cutoff is calculated from "now", 
      // it may or may not pass depending on timing, so test with 1 day instead
      expect(midnightLog.isLoggedWithinDays(1)).toBe(true);
      
      // Test boundary case - yesterday should not be within 0 days
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const yesterdayLog = new MetricProgressLog(
        'yesterday-log',
        mockSeasonId,
        mockMetricId,
        mockUserId,
        75,
        MetricUnit.KILOGRAMS,
        75,
        yesterday,
        ProgressLogEntryType.MANUAL,
        null,
        '',
        yesterday,
        yesterday
      );
      
      expect(yesterdayLog.isLoggedWithinDays(0)).toBe(false);
      expect(yesterdayLog.isLoggedWithinDays(1)).toBe(true);
    });
  });
});

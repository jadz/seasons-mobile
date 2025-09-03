import { MetricGoal } from '../metricGoal';
import { MetricUnit } from '../metric';

describe('MetricGoal Domain Model', () => {
  const mockSeasonAreaMetricId = '123e4567-e89b-12d3-a456-426614174000';

  describe('Constructor and Validation', () => {
    it('should create a valid metric goal instance', () => {
      const goal = new MetricGoal(
        'test-id',
        mockSeasonAreaMetricId,
        80,
        MetricUnit.KILOGRAMS,
        80,
        75,
        MetricUnit.KILOGRAMS,
        new Date('2024-12-31'),
        false,
        null,
        'Lose 5kg this season',
        new Date('2024-01-01'),
        new Date('2024-01-01')
      );

      expect(goal.id).toBe('test-id');
      expect(goal.seasonAreaMetricId).toBe(mockSeasonAreaMetricId);
      expect(goal.goalValue).toBe(80);
      expect(goal.goalUnit).toBe(MetricUnit.KILOGRAMS);
      expect(goal.canonicalValue).toBe(80);
      expect(goal.startValue).toBe(75);
      expect(goal.startUnit).toBe(MetricUnit.KILOGRAMS);
      expect(goal.targetDate).toEqual(new Date('2024-12-31'));
      expect(goal.isAchieved).toBe(false);
      expect(goal.achievedAt).toBeNull();
      expect(goal.notes).toBe('Lose 5kg this season');
    });

    it('should create goal without start value', () => {
      const goal = new MetricGoal(
        'test-id',
        mockSeasonAreaMetricId,
        100,
        MetricUnit.KILOGRAMS,
        100,
        null,
        null,
        null,
        false,
        null,
        '',
        new Date('2024-01-01'),
        new Date('2024-01-01')
      );

      expect(goal.startValue).toBeNull();
      expect(goal.startUnit).toBeNull();
      expect(goal.targetDate).toBeNull();
    });

    it('should validate season area metric ID on construction', () => {
      expect(() => {
        new MetricGoal(
          'test-id',
          '', // Empty season area metric ID
          80,
          MetricUnit.KILOGRAMS,
          80,
          null,
          null,
          null,
          false,
          null,
          '',
          new Date(),
          new Date()
        );
      }).toThrow('Season area metric ID cannot be empty');
    });

    it('should validate goal value on construction', () => {
      expect(() => {
        new MetricGoal(
          'test-id',
          mockSeasonAreaMetricId,
          -10, // Negative goal value
          MetricUnit.KILOGRAMS,
          -10,
          null,
          null,
          null,
          false,
          null,
          '',
          new Date(),
          new Date()
        );
      }).toThrow('Goal value cannot be negative');
    });

    it('should validate canonical value on construction', () => {
      expect(() => {
        new MetricGoal(
          'test-id',
          mockSeasonAreaMetricId,
          80,
          MetricUnit.KILOGRAMS,
          NaN, // Invalid canonical value
          null,
          null,
          null,
          false,
          null,
          '',
          new Date(),
          new Date()
        );
      }).toThrow('Canonical value must be a finite number');
    });

    it('should validate start value constraints', () => {
      expect(() => {
        new MetricGoal(
          'test-id',
          mockSeasonAreaMetricId,
          80,
          MetricUnit.KILOGRAMS,
          80,
          75, // Start value provided
          null, // But start unit missing
          null,
          false,
          null,
          '',
          new Date(),
          new Date()
        );
      }).toThrow('Start unit must be provided when start value is specified');
    });

    it('should validate start unit constraints', () => {
      expect(() => {
        new MetricGoal(
          'test-id',
          mockSeasonAreaMetricId,
          80,
          MetricUnit.KILOGRAMS,
          80,
          null, // Start value missing
          MetricUnit.KILOGRAMS, // But start unit provided
          null,
          false,
          null,
          '',
          new Date(),
          new Date()
        );
      }).toThrow('Start value must be provided when start unit is specified');
    });

    it('should validate achievement consistency', () => {
      expect(() => {
        new MetricGoal(
          'test-id',
          mockSeasonAreaMetricId,
          80,
          MetricUnit.KILOGRAMS,
          80,
          null,
          null,
          null,
          true, // Marked as achieved
          null, // But no achieved date
          '',
          new Date(),
          new Date()
        );
      }).toThrow('Achieved date must be set when goal is marked as achieved');
    });

    it('should validate notes length', () => {
      const longNotes = 'a'.repeat(501); // 501 characters
      expect(() => {
        new MetricGoal(
          'test-id',
          mockSeasonAreaMetricId,
          80,
          MetricUnit.KILOGRAMS,
          80,
          null,
          null,
          null,
          false,
          null,
          longNotes,
          new Date(),
          new Date()
        );
      }).toThrow('Goal notes cannot exceed 500 characters');
    });
  });

  describe('Static Factory Methods', () => {
    describe('create', () => {
      it('should create metric goal data successfully', () => {
        const goalData = MetricGoal.create(
          mockSeasonAreaMetricId,
          85,
          MetricUnit.KILOGRAMS,
          85,
          90,
          MetricUnit.KILOGRAMS,
          new Date('2024-12-31'),
          'Target weight for summer'
        );

        expect(goalData.seasonAreaMetricId).toBe(mockSeasonAreaMetricId);
        expect(goalData.goalValue).toBe(85);
        expect(goalData.goalUnit).toBe(MetricUnit.KILOGRAMS);
        expect(goalData.canonicalValue).toBe(85);
        expect(goalData.startValue).toBe(90);
        expect(goalData.startUnit).toBe(MetricUnit.KILOGRAMS);
        expect(goalData.targetDate).toEqual(new Date('2024-12-31'));
        expect(goalData.isAchieved).toBe(false);
        expect(goalData.achievedAt).toBeNull();
        expect(goalData.notes).toBe('Target weight for summer');
      });

      it('should create goal data without optional parameters', () => {
        const goalData = MetricGoal.create(
          mockSeasonAreaMetricId,
          100,
          MetricUnit.KILOGRAMS,
          100
        );

        expect(goalData.startValue).toBeNull();
        expect(goalData.startUnit).toBeNull();
        expect(goalData.targetDate).toBeNull();
        expect(goalData.notes).toBe('');
      });

      it('should validate season area metric ID', () => {
        expect(() => {
          MetricGoal.create(
            'invalid-id', // Invalid UUID
            80,
            MetricUnit.KILOGRAMS,
            80
          );
        }).toThrow('Season area metric ID must be a valid UUID');
      });

      it('should validate goal value', () => {
        expect(() => {
          MetricGoal.create(
            mockSeasonAreaMetricId,
            -5, // Negative value
            MetricUnit.KILOGRAMS,
            -5
          );
        }).toThrow('Goal value cannot be negative');
      });

      it('should validate start value constraints when provided', () => {
        expect(() => {
          MetricGoal.create(
            mockSeasonAreaMetricId,
            80,
            MetricUnit.KILOGRAMS,
            80,
            75 // Start value without unit
          );
        }).toThrow('Start unit must be provided when start value is specified');
      });
    });

    describe('fromData', () => {
      it('should reconstruct metric goal from database data', () => {
        const dbData = {
          id: 'test-id',
          seasonAreaMetricId: mockSeasonAreaMetricId,
          goalValue: 80,
          goalUnit: 'kg',
          canonicalValue: 80,
          startValue: 85,
          startUnit: 'kg',
          targetDate: new Date('2024-12-31'),
          isAchieved: false,
          achievedAt: null,
          notes: 'Lose weight this season',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-02')
        };

        const goal = MetricGoal.fromData(dbData);

        expect(goal.id).toBe('test-id');
        expect(goal.seasonAreaMetricId).toBe(mockSeasonAreaMetricId);
        expect(goal.goalValue).toBe(80);
        expect(goal.goalUnit).toBe(MetricUnit.KILOGRAMS);
        expect(goal.startValue).toBe(85);
        expect(goal.startUnit).toBe(MetricUnit.KILOGRAMS);
        expect(goal.targetDate).toEqual(dbData.targetDate);
        expect(goal.createdAt).toEqual(dbData.createdAt);
        expect(goal.updatedAt).toEqual(dbData.updatedAt);
      });

      it('should handle null start values from database', () => {
        const dbData = {
          id: 'test-id',
          seasonAreaMetricId: mockSeasonAreaMetricId,
          goalValue: 80,
          goalUnit: 'kg',
          canonicalValue: 80,
          startValue: null,
          startUnit: null,
          targetDate: null,
          isAchieved: false,
          achievedAt: null,
          notes: '',
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const goal = MetricGoal.fromData(dbData);

        expect(goal.startValue).toBeNull();
        expect(goal.startUnit).toBeNull();
        expect(goal.targetDate).toBeNull();
      });

      it('should handle achieved goals from database', () => {
        const achievedDate = new Date('2024-06-15');
        const dbData = {
          id: 'test-id',
          seasonAreaMetricId: mockSeasonAreaMetricId,
          goalValue: 80,
          goalUnit: 'kg',
          canonicalValue: 80,
          startValue: null,
          startUnit: null,
          targetDate: null,
          isAchieved: true,
          achievedAt: achievedDate,
          notes: 'Goal achieved!',
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const goal = MetricGoal.fromData(dbData);

        expect(goal.isAchieved).toBe(true);
        expect(goal.achievedAt).toEqual(achievedDate);
      });

      it('should throw error for invalid goal unit from database', () => {
        const dbData = {
          id: 'test-id',
          seasonAreaMetricId: mockSeasonAreaMetricId,
          goalValue: 80,
          goalUnit: 'invalid_unit',
          canonicalValue: 80,
          startValue: null,
          startUnit: null,
          targetDate: null,
          isAchieved: false,
          achievedAt: null,
          notes: '',
          createdAt: new Date(),
          updatedAt: new Date()
        };

        expect(() => {
          MetricGoal.fromData(dbData);
        }).toThrow('Invalid metric unit: invalid_unit');
      });
    });
  });

  describe('Business Logic Methods', () => {
    let goalWithStartValue: MetricGoal;
    let goalWithoutStartValue: MetricGoal;
    let achievedGoal: MetricGoal;

    beforeEach(() => {
      goalWithStartValue = new MetricGoal(
        'goal-with-start',
        mockSeasonAreaMetricId,
        80,
        MetricUnit.KILOGRAMS,
        80,
        90,
        MetricUnit.KILOGRAMS,
        new Date('2024-12-31'),
        false,
        null,
        'Weight loss goal',
        new Date('2024-01-01'),
        new Date('2024-01-01')
      );

      goalWithoutStartValue = new MetricGoal(
        'goal-without-start',
        mockSeasonAreaMetricId,
        100,
        MetricUnit.KILOGRAMS,
        100,
        null,
        null,
        null,
        false,
        null,
        'Target weight',
        new Date('2024-01-01'),
        new Date('2024-01-01')
      );

      achievedGoal = new MetricGoal(
        'achieved-goal',
        mockSeasonAreaMetricId,
        75,
        MetricUnit.KILOGRAMS,
        75,
        80,
        MetricUnit.KILOGRAMS,
        null,
        true,
        new Date('2024-06-15'),
        'Successfully achieved!',
        new Date('2024-01-01'),
        new Date('2024-06-15')
      );
    });

    describe('Query Methods', () => {
      it('should correctly identify goals with starting values', () => {
        expect(goalWithStartValue.hasStartingValue()).toBe(true);
        expect(goalWithoutStartValue.hasStartingValue()).toBe(false);
      });

      it('should correctly identify goals with target dates', () => {
        expect(goalWithStartValue.hasTargetDate()).toBe(true);
        expect(goalWithoutStartValue.hasTargetDate()).toBe(false);
      });

      it('should correctly identify overdue goals', () => {
        // Create a goal with past target date
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - 10); // 10 days ago

        const overdueGoal = new MetricGoal(
          'overdue-goal',
          mockSeasonAreaMetricId,
          80,
          MetricUnit.KILOGRAMS,
          80,
          null,
          null,
          pastDate,
          false,
          null,
          '',
          new Date(),
          new Date()
        );

        expect(overdueGoal.isOverdue()).toBe(true);
        expect(goalWithoutStartValue.isOverdue()).toBe(false); // No target date
        expect(achievedGoal.isOverdue()).toBe(false); // Already achieved
      });
    });

    describe('Progress Calculation', () => {
      it('should calculate progress with starting value correctly', () => {
        // Goal: 90kg → 80kg (decrease by 10kg)
        // Current: 85kg (halfway there)
        const progress = goalWithStartValue.calculateProgress(85, MetricUnit.KILOGRAMS, 85);
        expect(progress).toBe(0.5); // 50% progress
      });

      it('should calculate progress for completed goal with starting value', () => {
        // Goal: 90kg → 80kg, Current: 80kg (goal achieved)
        const progress = goalWithStartValue.calculateProgress(80, MetricUnit.KILOGRAMS, 80);
        expect(progress).toBe(1.0); // 100% progress
      });

      it('should calculate progress without starting value', () => {
        // Goal: 100kg, Current: 95kg
        // Without start value, calculates based on distance to goal
        const progress = goalWithoutStartValue.calculateProgress(95, MetricUnit.KILOGRAMS, 95);
        expect(progress).toBeGreaterThan(0);
        expect(progress).toBeLessThanOrEqual(1);
      });

      it('should handle zero distance progress calculation', () => {
        // Goal: 100kg, Current: 100kg (at goal)
        const progress = goalWithoutStartValue.calculateProgress(100, MetricUnit.KILOGRAMS, 100);
        expect(progress).toBe(1); // At goal = 100% progress
        
        // Test with current value away from goal
        const partialProgress = goalWithoutStartValue.calculateProgress(95, MetricUnit.KILOGRAMS, 95);
        expect(partialProgress).toBe(0.95); // 95% of the way to 100kg goal
      });

      it('should cap progress at 100%', () => {
        // Goal: 90kg → 80kg, Current: 75kg (exceeded goal)
        const progress = goalWithStartValue.calculateProgress(75, MetricUnit.KILOGRAMS, 75);
        expect(progress).toBe(1.0); // Capped at 100%
      });
    });

    describe('Achievement Detection', () => {
      it('should detect achievement for decrease goals with starting value', () => {
        // Goal: 90kg → 80kg (decrease)
        expect(goalWithStartValue.isAchievedBy(80)).toBe(true); // At goal
        expect(goalWithStartValue.isAchievedBy(75)).toBe(true); // Below goal (even better)
        expect(goalWithStartValue.isAchievedBy(85)).toBe(false); // Above goal
      });

      it('should detect achievement for increase goals with starting value', () => {
        // Create an increase goal: 70kg → 80kg
        const increaseGoal = new MetricGoal(
          'increase-goal',
          mockSeasonAreaMetricId,
          80,
          MetricUnit.KILOGRAMS,
          80,
          70,
          MetricUnit.KILOGRAMS,
          null,
          false,
          null,
          '',
          new Date(),
          new Date()
        );

        expect(increaseGoal.isAchievedBy(80)).toBe(true); // At goal
        expect(increaseGoal.isAchievedBy(85)).toBe(true); // Above goal (even better)
        expect(increaseGoal.isAchievedBy(75)).toBe(false); // Below goal
      });

      it('should detect achievement without starting value', () => {
        // Without start value, assumes exact match or greater
        expect(goalWithoutStartValue.isAchievedBy(100)).toBe(true); // At goal
        expect(goalWithoutStartValue.isAchievedBy(105)).toBe(true); // Above goal
        expect(goalWithoutStartValue.isAchievedBy(95)).toBe(false); // Below goal
      });
    });

    describe('State Management', () => {
      it('should mark goal as achieved', () => {
        const achievedGoal = goalWithStartValue.markAsAchieved();

        expect(achievedGoal.isAchieved).toBe(true);
        expect(achievedGoal.achievedAt).toBeInstanceOf(Date);
        expect(achievedGoal.id).toBe(goalWithStartValue.id);
        expect(achievedGoal.goalValue).toBe(goalWithStartValue.goalValue);
        expect(achievedGoal.updatedAt).not.toBe(goalWithStartValue.updatedAt);
      });

      it('should handle marking already achieved goal', () => {
        const stillAchieved = achievedGoal.markAsAchieved();

        expect(stillAchieved).toBe(achievedGoal); // Returns same instance
      });

      it('should mark goal as not achieved (reset)', () => {
        const resetGoal = achievedGoal.markAsNotAchieved();

        expect(resetGoal.isAchieved).toBe(false);
        expect(resetGoal.achievedAt).toBeNull();
        expect(resetGoal.id).toBe(achievedGoal.id);
        expect(resetGoal.goalValue).toBe(achievedGoal.goalValue);
        expect(resetGoal.updatedAt).not.toBe(achievedGoal.updatedAt);
      });

      it('should handle resetting non-achieved goal', () => {
        const stillNotAchieved = goalWithStartValue.markAsNotAchieved();

        expect(stillNotAchieved).toBe(goalWithStartValue); // Returns same instance
      });

      it('should return new instance for state changes (immutability)', () => {
        const achievedGoal = goalWithStartValue.markAsAchieved();

        expect(achievedGoal).not.toBe(goalWithStartValue);
        expect(goalWithStartValue.isAchieved).toBe(false); // Original unchanged
      });
    });

    describe('Goal Updates', () => {
      it('should update goal values', () => {
        const updatedGoal = goalWithStartValue.updateGoal(
          75,
          MetricUnit.KILOGRAMS,
          75,
          new Date('2024-11-30'),
          'Updated target'
        );

        expect(updatedGoal.goalValue).toBe(75);
        expect(updatedGoal.goalUnit).toBe(MetricUnit.KILOGRAMS);
        expect(updatedGoal.canonicalValue).toBe(75);
        expect(updatedGoal.targetDate).toEqual(new Date('2024-11-30'));
        expect(updatedGoal.notes).toBe('Updated target');
        expect(updatedGoal.id).toBe(goalWithStartValue.id);
        expect(updatedGoal.startValue).toBe(goalWithStartValue.startValue); // Preserved
        expect(updatedGoal.updatedAt).not.toBe(goalWithStartValue.updatedAt);
      });

      it('should validate goal values during update', () => {
        expect(() => {
          goalWithStartValue.updateGoal(
            -10, // Invalid negative value
            MetricUnit.KILOGRAMS,
            -10
          );
        }).toThrow('Goal value cannot be negative');
      });

      it('should update starting values', () => {
        const updatedGoal = goalWithStartValue.updateStartingValue(
          95,
          MetricUnit.KILOGRAMS,
          95
        );

        expect(updatedGoal.startValue).toBe(95);
        expect(updatedGoal.startUnit).toBe(MetricUnit.KILOGRAMS);
        expect(updatedGoal.goalValue).toBe(goalWithStartValue.goalValue); // Preserved
        expect(updatedGoal.updatedAt).not.toBe(goalWithStartValue.updatedAt);
      });

      it('should update notes', () => {
        const updatedGoal = goalWithStartValue.updateNotes('New motivation text');

        expect(updatedGoal.notes).toBe('New motivation text');
        expect(updatedGoal.goalValue).toBe(goalWithStartValue.goalValue); // Preserved
        expect(updatedGoal.updatedAt).not.toBe(goalWithStartValue.updatedAt);
      });

      it('should return new instance for updates (immutability)', () => {
        const updatedGoal = goalWithStartValue.updateGoal(75, MetricUnit.KILOGRAMS, 75);

        expect(updatedGoal).not.toBe(goalWithStartValue);
        expect(goalWithStartValue.goalValue).toBe(80); // Original unchanged
      });
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle infinite goal values', () => {
      expect(() => {
        MetricGoal.create(
          mockSeasonAreaMetricId,
          Infinity,
          MetricUnit.KILOGRAMS,
          Infinity
        );
      }).toThrow('Goal value must be a finite number');
    });

    it('should handle NaN canonical values', () => {
      expect(() => {
        MetricGoal.create(
          mockSeasonAreaMetricId,
          80,
          MetricUnit.KILOGRAMS,
          NaN
        );
      }).toThrow('Canonical value must be a finite number');
    });

    it('should handle negative start values', () => {
      expect(() => {
        MetricGoal.create(
          mockSeasonAreaMetricId,
          80,
          MetricUnit.KILOGRAMS,
          80,
          -5, // Negative start value
          MetricUnit.KILOGRAMS
        );
      }).toThrow('Start value cannot be negative');
    });

    it('should handle empty season area metric ID', () => {
      expect(() => {
        MetricGoal.create(
          '', // Empty ID
          80,
          MetricUnit.KILOGRAMS,
          80
        );
      }).toThrow('Season area metric ID cannot be empty');
    });

    it('should handle malformed UUID', () => {
      expect(() => {
        MetricGoal.create(
          'not-a-uuid',
          80,
          MetricUnit.KILOGRAMS,
          80
        );
      }).toThrow('Season area metric ID must be a valid UUID');
    });

    it('should preserve all properties during updates', () => {
      const originalDate = new Date('2024-01-01');
      const goal = new MetricGoal(
        'test-id',
        mockSeasonAreaMetricId,
        80,
        MetricUnit.KILOGRAMS,
        80,
        85,
        MetricUnit.KILOGRAMS,
        new Date('2024-12-31'),
        false,
        null,
        'Original notes',
        originalDate,
        originalDate
      );

      const updated = goal.updateGoal(75, MetricUnit.KILOGRAMS, 75);
      const achieved = goal.markAsAchieved();

      // Check that unrelated properties are preserved
      expect(updated.startValue).toBe(85);
      expect(updated.targetDate).toEqual(new Date('2024-12-31'));
      expect(achieved.goalValue).toBe(80);
      expect(achieved.startValue).toBe(85);
    });

    it('should handle boundary notes length (exactly 500 characters)', () => {
      const exactly500Chars = 'a'.repeat(500);

      const goalData = MetricGoal.create(
        mockSeasonAreaMetricId,
        80,
        MetricUnit.KILOGRAMS,
        80,
        undefined,
        undefined,
        undefined,
        exactly500Chars
      );

      expect(goalData.notes).toBe(exactly500Chars);
      expect(goalData.notes.length).toBe(500);
    });

    it('should handle progress calculation edge cases', () => {
      // Zero total distance (start and goal are same)
      const sameValueGoal = new MetricGoal(
        'same-value-goal',
        mockSeasonAreaMetricId,
        80,
        MetricUnit.KILOGRAMS,
        80,
        80, // Same as goal
        MetricUnit.KILOGRAMS,
        null,
        false,
        null,
        '',
        new Date(),
        new Date()
      );

      // When start and goal are same, should return 1 if achieved, 0 if not
      const progressAtGoal = sameValueGoal.calculateProgress(80, MetricUnit.KILOGRAMS, 80);
      expect(progressAtGoal).toBe(0); // No progress possible when start equals goal

      // Test with achieved goal having same start/goal values
      const achievedSameValueGoal = sameValueGoal.markAsAchieved();
      const achievedProgress = achievedSameValueGoal.calculateProgress(80, MetricUnit.KILOGRAMS, 80);
      expect(achievedProgress).toBe(1); // Achieved goals return 1
    });
  });
});

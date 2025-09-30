-- ================================================================================================
-- Refactor Seasons Data Model
-- This migration drops the old, complex seasons relationship tables and replaces them with
-- two new, purpose-built tables for tracking objectives: `exercise_outcomes` and `metric_objectives`.
-- ================================================================================================


-- ================================================================================================
-- Step 2: Create new dictionary tables
-- ================================================================================================

-- Create the exercises table to store a library of exercises.
CREATE TABLE exercises (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

COMMENT ON TABLE exercises IS 'A library of exercises that users can perform and track, e.g., Bench Press, Squat, 5k Run.';


-- ================================================================================================
-- Step 3: Create new objective tables
-- ================================================================================================

-- Create table for objectives tied to a specific exercise.
CREATE TABLE exercise_outcomes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  season_id uuid REFERENCES seasons(id) ON DELETE CASCADE NOT NULL,
  exercise_id uuid REFERENCES exercises(id) ON DELETE CASCADE NOT NULL,
  initial_value jsonb NOT NULL,
  target_value jsonb, -- Can be null for certain monitor strategies
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

COMMENT ON TABLE exercise_outcomes IS 'Tracks objectives (outcomes or monitors) related to a specific exercise for a season.';
COMMENT ON COLUMN exercise_outcomes.initial_value IS 'The starting value for the objective, e.g., {"reps": 5, "weight": 100, "unit": "kg"}.';
COMMENT ON COLUMN exercise_outcomes.target_value IS 'For OUTCOMES, the goal value. For MONITORS, the strategy, e.g., {"strategy": "MAINTAIN"}.';

-- Create table for metrics to monitor.
CREATE TABLE metrics_to_monitor (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  season_id uuid REFERENCES seasons(id) ON DELETE CASCADE NOT NULL,
  metric_id uuid REFERENCES metrics(id) ON DELETE CASCADE NOT NULL,
  initial_value jsonb NOT NULL,
  monitor_context jsonb, -- Can be null for certain monitor strategies
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

COMMENT ON TABLE metrics_to_monitor IS 'Tracks metrics to be monitored during a season, e.g., Body Fat % or Body Weight.';
COMMENT ON COLUMN metrics_to_monitor.initial_value IS 'The starting value for the metric, e.g., {"value": 25, "unit": "%"}.';
COMMENT ON COLUMN metrics_to_monitor.monitor_context IS 'Contains the monitoring strategy, e.g., {"strategy": "LOSE"}.';


-- ================================================================================================
-- Step 4: Add Indexes for Performance
-- ================================================================================================

-- Indexes for exercises
CREATE INDEX idx_exercises_name ON exercises(name);

-- Indexes for exercise_outcomes
CREATE INDEX idx_exercise_outcomes_season_id ON exercise_outcomes(season_id);
CREATE INDEX idx_exercise_outcomes_exercise_id ON exercise_outcomes(exercise_id);
CREATE INDEX idx_exercise_outcomes_season_exercise ON exercise_outcomes(season_id, exercise_id);

-- Indexes for metrics_to_monitor
CREATE INDEX idx_metrics_to_monitor_season_id ON metrics_to_monitor(season_id);
CREATE INDEX idx_metrics_to_monitor_metric_id ON metrics_to_monitor(metric_id);
CREATE INDEX idx_metrics_to_monitor_season_metric ON metrics_to_monitor(season_id, metric_id);


-- ================================================================================================
-- Step 5: ROW LEVEL SECURITY (RLS)
-- ================================================================================================

-- Enable RLS on all new tables
ALTER TABLE exercises ENABLE row level security;
ALTER TABLE exercise_outcomes ENABLE row level security;
ALTER TABLE metrics_to_monitor ENABLE row level security;

-- Policies for exercises (assuming they are public but only admins can create/edit)
CREATE POLICY "Users can view all exercises" ON exercises FOR
    SELECT USING (true);

-- Policies for exercise_outcomes (access through season ownership)
CREATE POLICY "Users can access objectives for their own seasons" ON exercise_outcomes FOR ALL
  USING ((SELECT auth.uid()) = (SELECT user_id FROM seasons WHERE seasons.id = exercise_outcomes.season_id))
  WITH CHECK ((SELECT auth.uid()) = (SELECT user_id FROM seasons WHERE seasons.id = exercise_outcomes.season_id));

-- Policies for metrics_to_monitor (access through season ownership)
CREATE POLICY "Users can access metrics for their own seasons" ON metrics_to_monitor FOR ALL
  USING ((SELECT auth.uid()) = (SELECT user_id FROM seasons WHERE seasons.id = metrics_to_monitor.season_id))
  WITH CHECK ((SELECT auth.uid()) = (SELECT user_id FROM seasons WHERE seasons.id = metrics_to_monitor.season_id));


-- ================================================================================================
-- Step 6: TIMESTAMP TRIGGERS
-- ================================================================================================

-- Add timestamp triggers for all new tables with updated_at columns
CREATE TRIGGER handle_times_exercises
    BEFORE INSERT OR UPDATE ON exercises
    FOR EACH ROW
EXECUTE PROCEDURE handle_times();

CREATE TRIGGER handle_times_exercise_outcomes
    BEFORE INSERT OR UPDATE ON exercise_outcomes
    FOR EACH ROW
EXECUTE PROCEDURE handle_times();

CREATE TRIGGER handle_times_metrics_to_monitor
    BEFORE INSERT OR UPDATE ON metrics_to_monitor
    FOR EACH ROW
EXECUTE PROCEDURE handle_times();

-- ================================================================================================
-- Step 7: REALTIME SUBSCRIPTIONS
-- ================================================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE exercise_outcomes;
ALTER PUBLICATION supabase_realtime ADD TABLE metrics_to_monitor;

-- Create seasons domain schema
-- This migration creates the complete seasons domain including pillars, areas of focus, metrics, and progress tracking

-- ================================================================================================
-- CORE DOMAIN TABLES
-- ================================================================================================

-- Table: pillars (system-controlled)
CREATE TABLE pillars (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  display_name text NOT NULL,
  description text,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table: areas_of_focus (predefined library + user-created)
CREATE TABLE areas_of_focus (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  pillar_id uuid REFERENCES pillars(id) NOT NULL,
  user_id uuid REFERENCES auth.users(id), -- NULL for predefined, user_id for user-created
  is_predefined boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Ensure unique names within scope (predefined vs user-specific)
  UNIQUE(name, pillar_id, user_id)
);

-- Table: metrics (predefined + user-created + app-calculated)
CREATE TABLE metrics (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  unit_type text NOT NULL CHECK (unit_type IN ('weight', 'distance', 'time', 'reps', 'percentage', 'other')),
  default_unit text NOT NULL CHECK (default_unit IN ('kg', 'lbs', 'cm', 'inches', 'meters', 'km', 'miles', 'seconds', 'minutes', 'hours', 'count', 'percent_value', 'custom_unit')),
  alternative_units jsonb NOT NULL DEFAULT '[]'::jsonb,
  data_type text NOT NULL CHECK (data_type IN ('decimal', 'integer')) DEFAULT 'decimal',
  metric_type text NOT NULL CHECK (metric_type IN ('predefined', 'user_created', 'app_calculated')) DEFAULT 'predefined',
  user_id uuid REFERENCES auth.users(id), -- NULL for predefined/app-calculated, user_id for user-created
  calculation_method text, -- For app-calculated metrics (e.g., 'bench_press_1rm')
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Ensure unique names within scope
  UNIQUE(name, user_id)
);

-- Table: seasons (user-owned)
CREATE TABLE seasons (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  name text NOT NULL,
  duration_weeks integer,
  status text NOT NULL CHECK (status IN ('draft', 'active', 'completed', 'archived', 'paused', 'cancelled')) DEFAULT 'draft',
  start_date timestamptz,
  end_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Ensure unique season names per user
  UNIQUE(user_id, name)
);

-- ================================================================================================
-- RELATIONSHIP TABLES
-- ================================================================================================

-- Table: season_pillars (which pillars are active in each season with specific themes)
CREATE TABLE season_pillars (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  season_id uuid REFERENCES seasons(id) ON DELETE CASCADE NOT NULL,
  pillar_id uuid REFERENCES pillars(id) ON DELETE CASCADE NOT NULL,
  theme text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  
  UNIQUE(season_id, pillar_id)
);

-- Table: season_pillar_areas (which areas of focus are active for each pillar in a season)
CREATE TABLE season_pillar_areas (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  season_pillar_id uuid REFERENCES season_pillars(id) ON DELETE CASCADE NOT NULL,
  area_of_focus_id uuid REFERENCES areas_of_focus(id) ON DELETE CASCADE NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  
  UNIQUE(season_pillar_id, area_of_focus_id)
);

-- Table: season_area_metrics (which metrics track each area of focus)
CREATE TABLE season_area_metrics (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  season_pillar_area_id uuid REFERENCES season_pillar_areas(id) ON DELETE CASCADE NOT NULL,
  metric_id uuid REFERENCES metrics(id) ON DELETE CASCADE NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  
  UNIQUE(season_pillar_area_id, metric_id)
);

-- ================================================================================================
-- INDEXES FOR PERFORMANCE
-- ================================================================================================

-- Areas of focus indexes
CREATE INDEX idx_areas_of_focus_pillar_id ON areas_of_focus(pillar_id);
CREATE INDEX idx_areas_of_focus_user_id ON areas_of_focus(user_id);
CREATE INDEX idx_areas_of_focus_predefined ON areas_of_focus(is_predefined, pillar_id) WHERE is_predefined = true;

-- Metrics indexes
CREATE INDEX idx_metrics_user_id ON metrics(user_id);
CREATE INDEX idx_metrics_type ON metrics(metric_type);
CREATE INDEX idx_metrics_predefined ON metrics(metric_type) WHERE metric_type = 'predefined';

-- Seasons indexes
CREATE INDEX idx_seasons_user_id ON seasons(user_id);
CREATE INDEX idx_seasons_status ON seasons(status);
CREATE INDEX idx_seasons_user_status ON seasons(user_id, status);

-- Relationship indexes
CREATE INDEX idx_season_pillars_season_id ON season_pillars(season_id);
CREATE INDEX idx_season_pillar_areas_season_pillar_id ON season_pillar_areas(season_pillar_id);

-- ================================================================================================
-- ROW LEVEL SECURITY (RLS)
-- ================================================================================================

-- Enable RLS on all user-data tables
ALTER TABLE areas_of_focus ENABLE row level security;
ALTER TABLE metrics ENABLE row level security;
ALTER TABLE seasons ENABLE row level security;
ALTER TABLE season_pillars ENABLE row level security;
ALTER TABLE season_pillar_areas ENABLE row level security;
ALTER TABLE season_area_metrics ENABLE row level security;

-- Pillars table is system-controlled, no RLS needed (read-only for users)

-- RLS Policies for areas_of_focus
CREATE POLICY "Users can view predefined and their own areas of focus" ON areas_of_focus FOR
    SELECT USING (is_predefined = true OR (SELECT auth.uid()) = user_id);

CREATE POLICY "Users can create their own areas of focus" ON areas_of_focus FOR
    INSERT WITH CHECK ((SELECT auth.uid()) = user_id AND is_predefined = false);

CREATE POLICY "Users can update their own areas of focus" ON areas_of_focus FOR
    UPDATE USING ((SELECT auth.uid()) = user_id AND is_predefined = false);

CREATE POLICY "Users can delete their own areas of focus" ON areas_of_focus FOR
    DELETE USING ((SELECT auth.uid()) = user_id AND is_predefined = false);

-- RLS Policies for metrics
CREATE POLICY "Users can view predefined, app-calculated and their own metrics" ON metrics FOR
    SELECT USING (metric_type IN ('predefined', 'app_calculated') OR (SELECT auth.uid()) = user_id);

CREATE POLICY "Users can create their own metrics" ON metrics FOR
    INSERT WITH CHECK ((SELECT auth.uid()) = user_id AND metric_type = 'user_created');

CREATE POLICY "Users can update their own metrics" ON metrics FOR
    UPDATE USING ((SELECT auth.uid()) = user_id AND metric_type = 'user_created');

CREATE POLICY "Users can delete their own metrics" ON metrics FOR
    DELETE USING ((SELECT auth.uid()) = user_id AND metric_type = 'user_created');

-- RLS Policies for seasons
CREATE POLICY "Users can view their own seasons" ON seasons FOR
    SELECT USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can create their own seasons" ON seasons FOR
    INSERT WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update their own seasons" ON seasons FOR
    UPDATE USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can delete their own seasons" ON seasons FOR
    DELETE USING ((SELECT auth.uid()) = user_id);

-- RLS Policies for season_pillars (access through season ownership)
CREATE POLICY "Users can access pillars for their own seasons" ON season_pillars FOR
    SELECT USING ((SELECT auth.uid()) = (SELECT user_id FROM seasons WHERE seasons.id = season_pillars.season_id));

CREATE POLICY "Users can create pillars for their own seasons" ON season_pillars FOR
    INSERT WITH CHECK ((SELECT auth.uid()) = (SELECT user_id FROM seasons WHERE seasons.id = season_pillars.season_id));

CREATE POLICY "Users can update pillars for their own seasons" ON season_pillars FOR
    UPDATE USING ((SELECT auth.uid()) = (SELECT user_id FROM seasons WHERE seasons.id = season_pillars.season_id));

CREATE POLICY "Users can delete pillars for their own seasons" ON season_pillars FOR
    DELETE USING ((SELECT auth.uid()) = (SELECT user_id FROM seasons WHERE seasons.id = season_pillars.season_id));

-- RLS Policies for season_pillar_areas (access through season ownership via season_pillars)
CREATE POLICY "Users can access areas for their own seasons" ON season_pillar_areas FOR
    SELECT USING ((SELECT auth.uid()) = (
        SELECT s.user_id FROM seasons s 
        JOIN season_pillars sp ON s.id = sp.season_id 
        WHERE sp.id = season_pillar_areas.season_pillar_id
    ));

CREATE POLICY "Users can create areas for their own seasons" ON season_pillar_areas FOR
    INSERT WITH CHECK ((SELECT auth.uid()) = (
        SELECT s.user_id FROM seasons s 
        JOIN season_pillars sp ON s.id = sp.season_id 
        WHERE sp.id = season_pillar_areas.season_pillar_id
    ));

CREATE POLICY "Users can update areas for their own seasons" ON season_pillar_areas FOR
    UPDATE USING ((SELECT auth.uid()) = (
        SELECT s.user_id FROM seasons s 
        JOIN season_pillars sp ON s.id = sp.season_id 
        WHERE sp.id = season_pillar_areas.season_pillar_id
    ));

CREATE POLICY "Users can delete areas for their own seasons" ON season_pillar_areas FOR
    DELETE USING ((SELECT auth.uid()) = (
        SELECT s.user_id FROM seasons s 
        JOIN season_pillars sp ON s.id = sp.season_id 
        WHERE sp.id = season_pillar_areas.season_pillar_id
    ));

-- ================================================================================================
-- TIMESTAMP TRIGGERS
-- ================================================================================================

-- Add timestamp triggers for all tables with updated_at columns
CREATE TRIGGER handle_times_pillars
    BEFORE INSERT OR UPDATE ON pillars
    FOR EACH ROW
EXECUTE PROCEDURE handle_times();

CREATE TRIGGER handle_times_areas_of_focus
    BEFORE INSERT OR UPDATE ON areas_of_focus
    FOR EACH ROW
EXECUTE PROCEDURE handle_times();

CREATE TRIGGER handle_times_metrics
    BEFORE INSERT OR UPDATE ON metrics
    FOR EACH ROW
EXECUTE PROCEDURE handle_times();

CREATE TRIGGER handle_times_seasons
    BEFORE INSERT OR UPDATE ON seasons
    FOR EACH ROW
EXECUTE PROCEDURE handle_times();

-- ================================================================================================
-- TABLE COMMENTS
-- ================================================================================================

COMMENT ON TABLE pillars IS 'System-controlled life pillars (Health & Fitness, Wealth, Family, Head Game, Career)';
COMMENT ON TABLE areas_of_focus IS 'Predefined library and user-created areas of focus within pillars';
COMMENT ON TABLE metrics IS 'Predefined, user-created, and app-calculated metrics for tracking progress';
COMMENT ON TABLE seasons IS 'User-owned seasons with basic metadata and status tracking';
COMMENT ON TABLE season_pillars IS 'Which pillars are active in each season';
COMMENT ON TABLE season_pillar_areas IS 'Which areas of focus are active for each pillar in a season';

-- Column comments for key fields
COMMENT ON COLUMN areas_of_focus.user_id IS 'NULL for predefined areas, user_id for user-created areas';
COMMENT ON COLUMN areas_of_focus.is_predefined IS 'True for system-provided areas, false for user-created';
COMMENT ON COLUMN metrics.metric_type IS 'Type of metric: predefined (system), user_created, or app_calculated';
COMMENT ON COLUMN metrics.calculation_method IS 'For app-calculated metrics, describes how value is computed';

-- ================================================================================================
-- REALTIME SUBSCRIPTIONS
-- ================================================================================================

-- Enable realtime for user-facing tables
ALTER PUBLICATION supabase_realtime ADD TABLE seasons;
ALTER PUBLICATION supabase_realtime ADD TABLE season_pillars;
ALTER PUBLICATION supabase_realtime ADD TABLE season_pillar_areas;
ALTER PUBLICATION supabase_realtime ADD TABLE areas_of_focus;
ALTER PUBLICATION supabase_realtime ADD TABLE metrics;

-- Note: pillars table is system-controlled and rarely changes, so no realtime needed
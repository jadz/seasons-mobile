-- Create user_preferences table to store user measurement and training preferences
CREATE TABLE user_preferences (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) NOT NULL UNIQUE,
  
  -- Unit preferences for measurements and training
  body_weight_unit text NOT NULL DEFAULT 'kg' CHECK (body_weight_unit IN ('kg', 'lbs')),
  strength_training_unit text NOT NULL DEFAULT 'kg' CHECK (strength_training_unit IN ('kg', 'lbs')),
  body_measurement_unit text NOT NULL DEFAULT 'cm' CHECK (body_measurement_unit IN ('cm', 'in')),
  distance_unit text NOT NULL DEFAULT 'km' CHECK (distance_unit IN ('km', 'mi')),
  
  -- Feature preferences
  advanced_logging_enabled boolean NOT NULL DEFAULT false,
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS (Row Level Security)
ALTER TABLE user_preferences ENABLE row level security;

-- Create policies for user_preferences
CREATE POLICY "Users can view their own preferences" ON user_preferences FOR
    SELECT USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can insert their own preferences" ON user_preferences FOR
    INSERT WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update their own preferences" ON user_preferences FOR
    UPDATE USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can delete their own preferences" ON user_preferences FOR
    DELETE USING ((SELECT auth.uid()) = user_id);

-- Add trigger for automatic timestamp management using existing handle_times function
CREATE TRIGGER handle_times
    BEFORE INSERT OR UPDATE ON user_preferences
    FOR EACH ROW
EXECUTE PROCEDURE handle_times();

-- Create indexes for performance
CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);

-- Add comments for documentation
COMMENT ON TABLE user_preferences IS 'User preferences for measurement units and training features';
COMMENT ON COLUMN user_preferences.body_weight_unit IS 'Unit for displaying body weight (kg or lbs)';
COMMENT ON COLUMN user_preferences.strength_training_unit IS 'Unit for displaying strength training weights (kg or lbs)';
COMMENT ON COLUMN user_preferences.body_measurement_unit IS 'Unit for displaying body measurements like height (cm or in)';
COMMENT ON COLUMN user_preferences.distance_unit IS 'Unit for displaying distances (km or mi)';
COMMENT ON COLUMN user_preferences.advanced_logging_enabled IS 'Whether advanced workout logging features are enabled';

-- Enable realtime subscriptions for user preferences
ALTER PUBLICATION supabase_realtime ADD TABLE user_preferences;

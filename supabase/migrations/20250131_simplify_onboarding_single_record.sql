-- Migration to simplify onboarding to ONE record per user
-- This replaces the multi-record approach with a single updatable record

-- Drop the old table
DROP TABLE IF EXISTS user_onboarding_progress CASCADE;

-- Create new simplified table with ONE record per user
CREATE TABLE user_onboarding_progress (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) NOT NULL UNIQUE,
  
  -- Current step information (gets updated as user progresses)
  current_step_name text NOT NULL,
  current_step_number integer NOT NULL,
  completed_at timestamptz NOT NULL DEFAULT now(),
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS (Row Level Security)
ALTER TABLE user_onboarding_progress ENABLE row level security;

-- Create policies for user_onboarding_progress
CREATE POLICY "Users can view their own onboarding progress" ON user_onboarding_progress FOR
    SELECT USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can insert their own onboarding progress" ON user_onboarding_progress FOR
    INSERT WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update their own onboarding progress" ON user_onboarding_progress FOR
    UPDATE USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can delete their own onboarding progress" ON user_onboarding_progress FOR
    DELETE USING ((SELECT auth.uid()) = user_id);

-- Add trigger for automatic timestamp management
CREATE TRIGGER handle_times_user_onboarding_progress
    BEFORE INSERT OR UPDATE ON user_onboarding_progress
    FOR EACH ROW
EXECUTE PROCEDURE handle_times();

-- Create index for performance
CREATE INDEX idx_user_onboarding_progress_user_id ON user_onboarding_progress(user_id);
CREATE INDEX idx_user_onboarding_progress_step_number ON user_onboarding_progress(current_step_number);

-- Add comments for documentation
COMMENT ON TABLE user_onboarding_progress IS 'Tracks current onboarding step for each user - ONE record per user';
COMMENT ON COLUMN user_onboarding_progress.current_step_name IS 'Name of current/latest step (e.g., "username", "personal_info")';
COMMENT ON COLUMN user_onboarding_progress.current_step_number IS 'Sequential number of current step';
COMMENT ON COLUMN user_onboarding_progress.completed_at IS 'Timestamp when the current step was completed';

-- Enable realtime subscriptions
ALTER PUBLICATION supabase_realtime ADD TABLE user_onboarding_progress;

-- Helper function to check if user has completed onboarding (reached final step)
CREATE OR REPLACE FUNCTION user_has_completed_onboarding(target_user_id uuid)
RETURNS boolean AS $$
DECLARE
  final_step_number integer := 3; -- Total number of steps
  user_step_number integer;
BEGIN
  SELECT current_step_number 
  INTO user_step_number
  FROM user_onboarding_progress 
  WHERE user_id = target_user_id;
  
  RETURN user_step_number >= final_step_number;
EXCEPTION
  WHEN NO_DATA_FOUND THEN
    RETURN false;
END;
$$ language plpgsql security definer;

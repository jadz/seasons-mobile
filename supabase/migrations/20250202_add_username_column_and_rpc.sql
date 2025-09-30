-- Add username column and RPC function for username availability checking
-- This migration addresses RLS issues with username checking

-- Add username column to user_profiles if it doesn't exist
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS username text UNIQUE;

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON user_profiles(username);

-- Add comment
COMMENT ON COLUMN user_profiles.username IS 'Unique username for the user (set during onboarding)';

-- Create RPC function to check username availability (bypasses RLS)
CREATE OR REPLACE FUNCTION check_username_availability(target_username text)
RETURNS boolean AS $$
DECLARE
  username_count integer;
BEGIN
  -- Count how many profiles have this username
  SELECT COUNT(*)
  INTO username_count
  FROM user_profiles
  WHERE username = target_username;
  
  -- Username is available if count is 0
  RETURN username_count = 0;
END;
$$ language plpgsql security definer;

-- Add comment for the function
COMMENT ON FUNCTION check_username_availability(text) IS 'Checks if a username is available by bypassing RLS policies. Returns true if available, false if taken.';

-- Add personal information fields to user_profiles table
-- This migration adds sex and birth_year fields for better personalization

-- Add new columns to user_profiles
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS sex text CHECK (sex IN ('male', 'female', 'other')),
ADD COLUMN IF NOT EXISTS birth_year integer CHECK (birth_year >= 1900 AND birth_year <= EXTRACT(YEAR FROM CURRENT_DATE));

-- Add comments for documentation
COMMENT ON COLUMN user_profiles.sex IS 'User biological sex for personalized recommendations (male, female, other)';
COMMENT ON COLUMN user_profiles.birth_year IS 'User birth year for age-appropriate content and analytics';

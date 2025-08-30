-- Create user_profiles table to store additional user data
create table user_profiles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null unique,
  first_name text,
  has_completed_onboarding boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table user_profiles enable row level security;

-- Create policies for user_profiles
create policy "Users can view their own profile" on user_profiles for
    select using ((select auth.uid()) = user_id);

create policy "Users can insert their own profile" on user_profiles for
    insert with check ((select auth.uid()) = user_id);

create policy "Users can update their own profile" on user_profiles for
    update using ((select auth.uid()) = user_id);

-- Add trigger for timestamps
CREATE TRIGGER handle_times_user_profiles
    BEFORE INSERT OR UPDATE ON user_profiles
    FOR EACH ROW
EXECUTE PROCEDURE handle_times();

-- Function to automatically create user profile on auth user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO user_profiles (user_id, first_name, has_completed_onboarding)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    false
  );
  RETURN NEW;
END;
$$ language plpgsql security definer;

-- Trigger to create profile for new users
-- CREATE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW EXECUTE PROCEDURE handle_new_user();

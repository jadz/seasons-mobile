// import { faker } from '@faker-js/faker'; // Temporarily disabled due to Jest ES module issues
import { supabase } from '../supabase';
import { 
  BodyWeightUnit, 
  StrengthTrainingUnit, 
  BodyMeasurementUnit, 
  DistanceUnit 
} from '../../domain/models/userPreferences';
import { UserPreferencesData } from '../../domain/views/userPreferencesViews';

/**
 * Test utilities for setting up integration tests with proper authentication
 */

export interface TestUser {
  id: string;
  email: string;
  password: string;
}

/**
 * Create a test user in Supabase auth and return their credentials
 * This creates a real user that can be authenticated for integration tests
 */
export async function createTestUser(): Promise<TestUser> {
  const email = `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}@example.com`;
  const password = 'TestPassword123!';

  // Create user through Supabase auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: 'Test User',
      }
    }
  });

  if (error) {
    throw new Error(`Failed to create test user: ${error.message}`);
  }

  if (!data.user) {
    throw new Error('User creation returned no user data');
  }

  return {
    id: data.user.id,
    email,
    password,
  };
}

/**
 * Sign in a test user and set up authenticated context
 */
export async function signInTestUser(email: string, password: string): Promise<void> {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(`Failed to sign in test user: ${error.message}`);
  }
}

/**
 * Sign out the current test user
 */
export async function signOutTestUser(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(`Failed to sign out test user: ${error.message}`);
  }
}

/**
 * Clean up a test user (sign out and delete from auth)
 */
export async function cleanupTestUser(userId: string): Promise<void> {
  try {
    // Sign out first
    await signOutTestUser();
    
    // Delete user from auth (this requires admin privileges in real scenarios)
    // For integration tests, we might need to use a service role
    // For now, just sign out - the test database can be reset between test runs
  } catch (error) {
    console.warn('Error cleaning up test user:', error);
  }
}

/**
 * Generate test user preferences data
 */
/* Temporarily disabled due to faker ES module issues
export function createFakeUserPreferencesData(userId: string): UserPreferencesData {
  const bodyWeightUnit = faker.helpers.arrayElement([BodyWeightUnit.KILOGRAMS, BodyWeightUnit.POUNDS]);
  const strengthTrainingUnit = faker.helpers.arrayElement([StrengthTrainingUnit.KILOGRAMS, StrengthTrainingUnit.POUNDS]);
  const bodyMeasurementUnit = faker.helpers.arrayElement([BodyMeasurementUnit.CENTIMETERS, BodyMeasurementUnit.INCHES]);
  const distanceUnit = faker.helpers.arrayElement([DistanceUnit.KILOMETERS, DistanceUnit.MILES]);

  return {
    userId,
    bodyWeightUnit,
    strengthTrainingUnit,
    bodyMeasurementUnit,
    distanceUnit,
    advancedLoggingEnabled: faker.datatype.boolean(),
  };
}
*/

/**
 * Create a complete test setup with authenticated user
 * Returns user info and cleans up automatically after test
 */
export async function setupAuthenticatedTestUser(): Promise<{
  user: TestUser;
  cleanup: () => Promise<void>;
}> {
  const user = await createTestUser();
  await signInTestUser(user.email, user.password);

  const cleanup = async () => {
    await cleanupTestUser(user.id);
  };

  return { user, cleanup };
}

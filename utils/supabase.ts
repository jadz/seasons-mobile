import { createClient, SupabaseClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Environment detection
const isTestEnvironment = () => {
  console.log(process.env.NODE_ENV)
  return process.env.NODE_ENV === 'test' || process.env.JEST_WORKER_ID !== undefined;
};

const isLocalDevelopment = () => {
  console.log(process.env.NODE_ENV)
  return process.env.NODE_ENV === 'development' || process.env.EXPO_PUBLIC_ENV === 'local';
};

// Environment-specific configuration
const getEnvironmentConfig = () => {
  if (isTestEnvironment()) {
    // Test environment - use .env.test variables
    return {
      url: process.env.EXPO_PUBLIC_SUPABASE_URL,
      anonKey: process.env.EXPO_PUBLIC_SUPABASE_KEY,
      // For tests, we might want to disable auth features or use in-memory storage
      authOptions: {
        storage: undefined, // Don't persist sessions in tests
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      }
    };
  } else if (isLocalDevelopment()) {
    // Local development - use .env.local variables
    return {
      url: process.env.EXPO_PUBLIC_SUPABASE_URL,
      anonKey: process.env.EXPO_PUBLIC_SUPABASE_KEY,
      authOptions: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      }
    };
  } else {
    // Production or default - use standard env variables
    return {
      url: process.env.EXPO_PUBLIC_SUPABASE_URL,
      anonKey: process.env.EXPO_PUBLIC_SUPABASE_KEY,
      authOptions: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      }
    };
  }
};

// Create the appropriate client based on environment
const createSupabaseClient = (): SupabaseClient => {
  const config = getEnvironmentConfig();
  
  if (!config.url || !config.anonKey) {
    const envType = isTestEnvironment() ? 'test' : isLocalDevelopment() ? 'local' : 'production';
    throw new Error(`Supabase configuration missing for ${envType} environment. Please check your environment variables.`);
  }

  return createClient(config.url, config.anonKey, {
    auth: config.authOptions,
  });
};

export const supabase = createSupabaseClient();

// Export utility functions for testing
export { isTestEnvironment, isLocalDevelopment, getEnvironmentConfig };
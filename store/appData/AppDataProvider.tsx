import React, { useEffect, useState } from 'react';
import { seasonFocusStore } from '../seasonFocus/seasonFocusStore';
import { exerciseStore } from '../exercise/exerciseStore';

/**
 * AppDataProvider - Orchestrates prefetching of reference/system data
 * 
 * This provider is responsible for loading all reference data that needs to be
 * available throughout the app (areas of focus, exercises, etc.). It loads data
 * once at app startup and caches it in domain-specific stores.
 * 
 * Benefits:
 * - Single point of coordination for all prefetch operations
 * - Prevents duplicate fetches across components
 * - Easy to extend with new reference data (exercises, training templates, etc.)
 * - Can optionally add AsyncStorage caching layer for offline support
 * 
 * Usage:
 * Wrap your app after AuthProvider:
 * <AuthProvider>
 *   <AppDataProvider>
 *     <YourApp />
 *   </AppDataProvider>
 * </AuthProvider>
 */

interface AppDataProviderProps {
  children: React.ReactNode;
}

export const AppDataProvider: React.FC<AppDataProviderProps> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeAppData = async () => {
      try {
        console.log('[AppDataProvider] Starting reference data prefetch...');
        
        // Prefetch all reference data in parallel
        await Promise.all([
          seasonFocusStore.loadPillarsWithAreas(),
          exerciseStore.loadExercises(),
          // Add more reference data here as needed:
          // trainingTemplateStore.loadTemplates(),
        ]);
        
        console.log('[AppDataProvider] Reference data prefetch complete');
        setIsInitialized(true);
      } catch (error) {
        console.error('[AppDataProvider] Error prefetching reference data:', error);
        // Still set initialized to true to prevent blocking the app
        // Individual stores will have their own error states
        setIsInitialized(true);
      }
    };

    initializeAppData();
  }, []);

  // Optional: Show loading screen while reference data loads
  // For now, we allow the app to render immediately and show loading states
  // in individual components if needed
  
  return <>{children}</>;
};


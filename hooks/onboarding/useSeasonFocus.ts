import { useState, useEffect } from 'react';
import { seasonFocusService } from '../../domain/services/SeasonFocusService';
import { PillarWithAreas } from '../../domain/views/pillarViews';

/**
 * Custom hook for fetching season focus options (pillars and areas)
 * Used during season creation onboarding
 */
export const useSeasonFocus = () => {
  const [pillars, setPillars] = useState<PillarWithAreas[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchPillarsWithAreas = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const data = await seasonFocusService.getPillarsWithAreas();
        
        if (isMounted) {
          setPillars(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load focus options');
          console.error('Error loading pillars with areas:', err);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchPillarsWithAreas();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, []);

  return {
    pillars,
    isLoading,
    error,
  };
};

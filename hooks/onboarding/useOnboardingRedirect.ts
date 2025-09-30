import { useState, useEffect } from 'react';
import { onboardingService } from '../../domain/services/onboarding/OnboardingService';

/**
 * Ordered list of onboarding steps
 * The order here defines the onboarding flow
 */
const ONBOARDING_STEPS_ORDER = [
  // User onboarding steps (1-3)
  { stepName: 'user-step-1-username', route: '/onboarding/user-step-1-username' },
  { stepName: 'personal_info', route: '/onboarding/user-step-2-personal-info' },
  { stepName: 'unit_preferences', route: '/onboarding/user-step-3-unit-preferences' },
  
  // Season onboarding steps (4+)
  { stepName: 'season-step-1-outcomes', route: '/onboarding/season-step-1-outcomes' },
  { stepName: 'season-step-2-strength', route: '/onboarding/season-step-2-strength' },
  { stepName: 'season-step-3-strength-numbers', route: '/onboarding/season-step-3-strength-numbers' },
  { stepName: 'season-step-4-body-metrics', route: '/onboarding/season-step-4-body-metrics' },
  { stepName: 'season-step-5-set-other-metrics', route: '/onboarding/season-step-5-set-other-metrics' },
  { stepName: 'season-step-6-training-phases', route: '/onboarding/season-step-6-training-phases' },
  { stepName: 'season-step-7-season-summary', route: '/onboarding/season-step-7-season-summary' },
];

/**
 * Default route if no progress is found - start of user onboarding
 */
const DEFAULT_ONBOARDING_ROUTE = ONBOARDING_STEPS_ORDER[0].route;

/**
 * Get the next step route based on current completed step
 */
const getNextStepRoute = (currentStepName: string): string => {
  const currentIndex = ONBOARDING_STEPS_ORDER.findIndex(
    step => step.stepName === currentStepName
  );
  
  console.log('[getNextStepRoute] Finding next step:', {
    currentStepName,
    currentIndex,
    totalSteps: ONBOARDING_STEPS_ORDER.length,
  });

  // If step not found or is the last step, return default
  if (currentIndex === -1 || currentIndex >= ONBOARDING_STEPS_ORDER.length - 1) {
    console.log('[getNextStepRoute] Step not found or is last step, returning default');
    return DEFAULT_ONBOARDING_ROUTE;
  }

  // Return the next step in the sequence
  const nextStep = ONBOARDING_STEPS_ORDER[currentIndex + 1];
  console.log('[getNextStepRoute] Next step found:', {
    nextStepName: nextStep.stepName,
    nextRoute: nextStep.route,
  });
  
  return nextStep.route;
};

/**
 * Hook to determine the appropriate onboarding redirect based on user's progress
 */
export const useOnboardingRedirect = (userId: string | undefined) => {
  const [redirectTo, setRedirectTo] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [hasCompleted, setHasCompleted] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const checkOnboardingProgress = async () => {
      console.debug('[useOnboardingRedirect] Starting onboarding check', { userId });

      if (!userId) {
        console.debug('[useOnboardingRedirect] No userId provided, skipping check');
        setIsChecking(false);
        return;
      }

      try {
        setIsChecking(true);

        // Check if onboarding is complete
        console.debug('[useOnboardingRedirect] Checking if onboarding is complete for user:', userId);
        const isComplete = await onboardingService.hasCompletedOnboarding(userId);
        console.debug('[useOnboardingRedirect] Onboarding complete status:', isComplete);
        
        if (isMounted) {
          setHasCompleted(isComplete);

          if (!isComplete) {
            // Get current progress to find where to redirect
            console.debug('[useOnboardingRedirect] Onboarding incomplete, fetching current progress...');
            const progress = await onboardingService.getCurrentProgress(userId);
            console.debug('[useOnboardingRedirect] Current progress:', {
              currentStepName: progress?.currentStepName,
              currentStepNumber: progress?.currentStepNumber,
              completedAt: progress?.completedAt,
            });
            
            if (progress && progress.currentStepName) {
              // Get the NEXT step route (not the current one)
              const nextRoute = getNextStepRoute(progress.currentStepName);
              console.log('[useOnboardingRedirect] Redirecting to NEXT step:', {
                currentStepName: progress.currentStepName,
                nextRoute,
              });
              
              setRedirectTo(nextRoute);
            } else {
              // No progress found, start from beginning
              console.log('[useOnboardingRedirect] No progress found, redirecting to default:', DEFAULT_ONBOARDING_ROUTE);
              setRedirectTo(DEFAULT_ONBOARDING_ROUTE);
            }
          } else {
            console.log('[useOnboardingRedirect] Onboarding complete, no redirect needed');
            setRedirectTo(null); // Onboarding complete, no redirect needed
          }
        }
      } catch (error) {
        console.error('[useOnboardingRedirect] Error checking onboarding progress:', error);
        if (isMounted) {
          // On error, start from beginning to be safe
          console.log('[useOnboardingRedirect] Error occurred, redirecting to default:', DEFAULT_ONBOARDING_ROUTE);
          setRedirectTo(DEFAULT_ONBOARDING_ROUTE);
        }
      } finally {
        if (isMounted) {
          console.log('[useOnboardingRedirect] Check complete, isChecking -> false');
          setIsChecking(false);
        }
      }
    };

    checkOnboardingProgress();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  console.log('[useOnboardingRedirect] Returning state:', {
    redirectTo,
    isChecking,
    hasCompleted,
  });

  return {
    redirectTo,
    isChecking,
    hasCompleted,
  };
};

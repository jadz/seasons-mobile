import { supabase } from '../../../utils/supabase';
import { userRepository } from '../../../db/repositories/UserRepository';
import { User } from '../../models/user';
import { SignInRequest, VerifyOtpRequest, OnboardingData } from '../../models/auth';

export class AuthService {
  /**
   * Send magic link to user's email for authentication
   */
  static async signInWithMagicLink(request: SignInRequest): Promise<void> {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: request.email,
        options: {
          shouldCreateUser: true,
          data: {
            first_name: '', // Will be filled during onboarding
          },
        },
      });

      if (error) {
        throw new Error(`Authentication failed: ${error.message}`);
      }
    } catch (error) {
      console.error('Error in signInWithMagicLink:', error);
      throw error;
    }
  }

  /**
   * Verify OTP code for email authentication
   */
  static async verifyOtp(request: VerifyOtpRequest): Promise<void> {
    try {
      const { error } = await supabase.auth.verifyOtp({
        email: request.email,
        token: request.otp,
        type: 'email',
      });

      if (error) {
        throw new Error(`OTP verification failed: ${error.message}`);
      }
    } catch (error) {
      console.error('Error in verifyOtp:', error);
      throw error;
    }
  }

  /**
   * Get current authenticated user with profile data
   */
  static async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user: authUser }, error } = await supabase.auth.getUser();

      if (error) {
        // Auth session missing is expected when not logged in
        if (error.message.includes('Auth session missing')) {
          return null;
        }
        console.error('Error getting current user:', error);
        return null;
      }

      if (!authUser) {
        return null;
      }

      return await userRepository.findUserWithProfile(authUser.id);
    } catch (error) {
      console.error('Error in getCurrentUser:', error);
      return null;
    }
  }

  /**
   * Sign out current user
   */
  static async signOut(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw new Error(`Sign out failed: ${error.message}`);
      }
    } catch (error) {
      console.error('Error in signOut:', error);
      throw error;
    }
  }

  /**
   * Complete user onboarding with profile data
   */
  static async completeOnboarding(onboardingData: OnboardingData): Promise<User> {
    try {
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

      if (authError || !authUser) {
        throw new Error('User not authenticated');
      }

      // Check if profile exists
      const existingProfile = await userRepository.findProfileByUserId(authUser.id);

      if (existingProfile) {
        // Update existing profile
        await userRepository.updateProfile(authUser.id, {
          firstName: onboardingData.firstName,
          hasCompletedOnboarding: true,
        });
      } else {
        // Create new profile
        await userRepository.createProfile(authUser.id, {
          firstName: onboardingData.firstName,
          hasCompletedOnboarding: true,
        });
      }

      // Return updated user
      const updatedUser = await userRepository.findUserWithProfile(authUser.id);
      if (!updatedUser) {
        throw new Error('Failed to retrieve updated user profile');
      }

      return updatedUser;
    } catch (error) {
      console.error('Error in completeOnboarding:', error);
      throw error;
    }
  }

  /**
   * Mark onboarding as complete for current user
   */
  static async markOnboardingComplete(): Promise<void> {
    try {
      const { data: { user: authUser }, error } = await supabase.auth.getUser();

      if (error || !authUser) {
        throw new Error('User not authenticated');
      }

      await userRepository.updateProfile(authUser.id, {
        hasCompletedOnboarding: true,
      });
    } catch (error) {
      console.error('Error in markOnboardingComplete:', error);
      throw error;
    }
  }

  /**
   * Listen to authentication state changes
   */
  static onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const user = await userRepository.findUserWithProfile(session.user.id);
        callback(user);
      } else {
        callback(null);
      }
    });
  }
}

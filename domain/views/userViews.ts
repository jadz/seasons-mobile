import { User, UserProfile } from '../models/user';

export type UserWithProfile = User & {
  profile?: UserProfile;
};

export interface UserProfileData {
  firstName: string;
  hasCompletedOnboarding?: boolean;
}

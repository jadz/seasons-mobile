export interface User {
  id: string;
  email: string;
  firstName?: string;
  isNewUser: boolean;
  hasCompletedOnboarding: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: string;
  userId: string;
  firstName: string;
  hasCompletedOnboarding: boolean;
  createdAt: Date;
  updatedAt: Date;
}

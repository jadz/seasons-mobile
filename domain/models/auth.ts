export interface AuthSession {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface SignInRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface OnboardingData {
  firstName: string;
}

import { User } from './user';

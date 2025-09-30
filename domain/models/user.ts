export interface User {
  id: string;
  email: string;
  firstName?: string;
  username?: string;
  sex?: 'male' | 'female' | 'other';
  birthYear?: number;
  isNewUser: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: string;
  userId: string;
  firstName: string;
  username: string;
  sex?: 'male' | 'female' | 'other';
  birthYear?: number;
  createdAt: Date;
  updatedAt: Date;
}

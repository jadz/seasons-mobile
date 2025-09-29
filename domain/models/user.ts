export interface User {
  id: string;
  email: string;
  firstName?: string;
  username?: string;
  isNewUser: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: string;
  userId: string;
  firstName: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
}

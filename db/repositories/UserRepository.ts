import { supabase } from '../../utils/supabase';
import { UserProfile } from '../../domain/models/user';
import { UserWithProfile, UserProfileData } from '../../domain/views/userViews';

export interface IUserRepository {
  findProfileByUserId(userId: string): Promise<UserProfile | null>;
  createProfile(userId: string, profileData: UserProfileData): Promise<string>;
  updateProfile(userId: string, updateData: Partial<UserProfileData>): Promise<void>;
  findUserWithProfile(userId: string): Promise<UserWithProfile | null>;
  isUsernameAvailable(username: string): Promise<boolean>;
}

class UserRepository implements IUserRepository {
  async findProfileByUserId(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // No profile found
        }
        throw new Error(`Error finding user profile: ${error.message}`);
      }

      return this.mapToUserProfile(data);
    } catch (error) {
      console.error('Error in findProfileByUserId:', error);
      throw error;
    }
  }

  async createProfile(userId: string, profileData: UserProfileData): Promise<string> {
    try {
      const insertData: any = {
        user_id: userId,
      };

      if (profileData.firstName) insertData.first_name = profileData.firstName;
      if (profileData.username) insertData.username = profileData.username;
      if (profileData.sex) insertData.sex = profileData.sex;
      if (profileData.birthYear) insertData.birth_year = profileData.birthYear;

      const { data, error } = await supabase
        .from('user_profiles')
        .insert(insertData)
        .select('id')
        .single();

      if (error) {
        throw new Error(`Error creating user profile: ${error.message}`);
      }

      return data.id;
    } catch (error) {
      console.error('Error in createProfile:', error);
      throw error;
    }
  }

  async updateProfile(userId: string, updateData: Partial<UserProfileData>): Promise<void> {
    try {
      const updateFields: any = {};
      
      if (updateData.firstName) updateFields.first_name = updateData.firstName;
      if (updateData.username) updateFields.username = updateData.username;
      if (updateData.sex) updateFields.sex = updateData.sex;
      if (updateData.birthYear) updateFields.birth_year = updateData.birthYear;

      const { error } = await supabase
        .from('user_profiles')
        .update(updateFields)
        .eq('user_id', userId);

      if (error) {
        throw new Error(`Error updating user profile: ${error.message}`);
      }
    } catch (error) {
      console.error('Error in updateProfile:', error);
      throw error;
    }
  }

  async findUserWithProfile(userId: string): Promise<UserWithProfile | null> {
    try {
      // Get auth user
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !authUser || authUser.id !== userId) {
        return null;
      }

      // Get profile
      const profile = await this.findProfileByUserId(userId);

      return {
        id: authUser.id,
        email: authUser.email!,
        firstName: profile?.firstName,
        username: profile?.username,
        sex: profile?.sex,
        birthYear: profile?.birthYear,
        isNewUser: !profile,
        createdAt: new Date(authUser.created_at),
        updatedAt: new Date(authUser.updated_at || authUser.created_at),
        profile,
      };
    } catch (error) {
      console.error('Error in findUserWithProfile:', error);
      throw error;
    }
  }

  async isUsernameAvailable(username: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('username', username)
        .maybeSingle();

      if (error) {
        throw new Error(`Error checking username availability: ${error.message}`);
      }

      // If data is null, username is available
      return data === null;
    } catch (error) {
      console.error('Error in isUsernameAvailable:', error);
      throw error;
    }
  }

  private mapToUserProfile(data: any): UserProfile {
    return {
      id: data.id,
      userId: data.user_id,
      firstName: data.first_name || '',
      username: data.username || '',
      sex: data.sex,
      birthYear: data.birth_year,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }
}

export const userRepository = new UserRepository();
export { UserRepository };

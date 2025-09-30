import { UserRepository, IUserRepository } from '../UserRepository';
import { UserProfile } from '../../../domain/models/user';
import { UserProfileData } from '../../../domain/views/userViews';
import {
  setupAuthenticatedTestUser,
  signOutTestUser,
  TestUser
} from '../../../utils/__tests__/testUtils';

describe('UserRepository Integration Tests', () => {
  let repository: IUserRepository;
  let testUser: TestUser;
  let cleanup: () => Promise<void>;

  beforeEach(async () => {
    repository = new UserRepository();
    // Set up authenticated test user for each test
    const setup = await setupAuthenticatedTestUser();
    testUser = setup.user;
    cleanup = setup.cleanup;
  });

  afterEach(async () => {
    // Clean up test user profile if it exists
    try {
      const profile = await repository.findProfileByUserId(testUser.id);
      if (profile) {
        // Delete profile through direct database call since we don't have a delete method
        const { supabase } = require('../../../utils/supabase');
        await supabase
          .from('user_profiles')
          .delete()
          .eq('user_id', testUser.id);
      }
    } catch (error) {
      console.warn(`Could not delete profile for ${testUser.id}:`, error);
    }
    
    // Clean up test user and sign out
    await cleanup();
  });

  describe('isUsernameAvailable', () => {
    it('should return true when username is available', async () => {
      // Arrange
      const uniqueUsername = `testuser_${Date.now()}_${Math.random().toString(36).substring(7)}`;

      // Act
      const isAvailable = await repository.isUsernameAvailable(uniqueUsername);

      // Assert
      expect(isAvailable).toBe(true);
    });

    it('should return false when username is already taken', async () => {
      // Arrange - create a profile with a username
      const takenUsername = `taken_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      const profileData: UserProfileData = {
        firstName: 'Test',
        username: takenUsername,
      };
      await repository.createProfile(testUser.id, profileData);

      // Act
      const isAvailable = await repository.isUsernameAvailable(takenUsername);

      // Assert
      expect(isAvailable).toBe(false);
    });

    it('should be case-sensitive when checking username availability', async () => {
      // Arrange - create a profile with lowercase username
      const lowercaseUsername = `lowercase_${Date.now()}`;
      const profileData: UserProfileData = {
        firstName: 'Test',
        username: lowercaseUsername,
      };
      await repository.createProfile(testUser.id, profileData);

      // Act - check uppercase version
      const uppercaseUsername = lowercaseUsername.toUpperCase();
      const isAvailable = await repository.isUsernameAvailable(uppercaseUsername);

      // Assert - uppercase version should be available (case-sensitive)
      expect(isAvailable).toBe(true);
    });

    it('should handle special characters in username check', async () => {
      // Arrange
      const specialUsername = `user_${Date.now()}_special-chars.test`;
      const profileData: UserProfileData = {
        firstName: 'Test',
        username: specialUsername,
      };
      await repository.createProfile(testUser.id, profileData);

      // Act
      const isAvailable = await repository.isUsernameAvailable(specialUsername);

      // Assert
      expect(isAvailable).toBe(false);
    });

    it('should handle empty string username check', async () => {
      // Act
      const isAvailable = await repository.isUsernameAvailable('');

      // Assert - empty string should be available (no user should have empty username)
      expect(isAvailable).toBe(true);
    });

    it('should handle whitespace in username check', async () => {
      // Arrange
      const whitespaceUsername = `user with spaces ${Date.now()}`;
      const profileData: UserProfileData = {
        firstName: 'Test',
        username: whitespaceUsername,
      };
      await repository.createProfile(testUser.id, profileData);

      // Act
      const isAvailable = await repository.isUsernameAvailable(whitespaceUsername);

      // Assert
      expect(isAvailable).toBe(false);
    });

    it('should return true for very long usernames that do not exist', async () => {
      // Arrange
      const longUsername = `verylongusername_${Date.now()}_${'a'.repeat(100)}`;

      // Act
      const isAvailable = await repository.isUsernameAvailable(longUsername);

      // Assert
      expect(isAvailable).toBe(true);
    });

    it('should handle concurrent username availability checks correctly', async () => {
      // Arrange
      const username1 = `concurrent1_${Date.now()}`;
      const username2 = `concurrent2_${Date.now()}`;
      const username3 = `concurrent3_${Date.now()}`;

      // Act - check multiple usernames in parallel
      const [isAvailable1, isAvailable2, isAvailable3] = await Promise.all([
        repository.isUsernameAvailable(username1),
        repository.isUsernameAvailable(username2),
        repository.isUsernameAvailable(username3),
      ]);

      // Assert - all should be available
      expect(isAvailable1).toBe(true);
      expect(isAvailable2).toBe(true);
      expect(isAvailable3).toBe(true);
    });
  });

  describe('createProfile', () => {
    it('should create a new user profile', async () => {
      // Arrange
      const profileData: UserProfileData = {
        firstName: 'John',
        username: `john_${Date.now()}`,
      };

      // Act
      const profileId = await repository.createProfile(testUser.id, profileData);

      // Assert
      expect(profileId).toBeDefined();
      expect(typeof profileId).toBe('string');

      // Verify it was created
      const created = await repository.findProfileByUserId(testUser.id);
      expect(created).toBeDefined();
      expect(created?.firstName).toBe('John');
      expect(created?.username).toBe(profileData.username);
    });

    it('should create profile with personal info fields (sex and birthYear)', async () => {
      // Arrange
      const profileData: UserProfileData = {
        firstName: 'Jane',
        username: `jane_${Date.now()}`,
        sex: 'female' as const,
        birthYear: 1990,
      };

      // Act
      const profileId = await repository.createProfile(testUser.id, profileData);

      // Assert
      expect(profileId).toBeDefined();

      // Verify it was created with all fields
      const created = await repository.findProfileByUserId(testUser.id);
      expect(created).toBeDefined();
      expect(created?.firstName).toBe('Jane');
      expect(created?.username).toBe(profileData.username);
      expect(created?.sex).toBe('female');
      expect(created?.birthYear).toBe(1990);
    });

    it('should throw error when creating duplicate profile for same user', async () => {
      // Arrange
      const profileData: UserProfileData = {
        firstName: 'John',
        username: `john_${Date.now()}`,
      };
      await repository.createProfile(testUser.id, profileData);

      // Act & Assert
      await expect(repository.createProfile(testUser.id, profileData)).rejects.toThrow();
    });
  });

  describe('findProfileByUserId', () => {
    it('should return user profile by user ID', async () => {
      // Arrange
      const profileData: UserProfileData = {
        firstName: 'Jane',
        username: `jane_${Date.now()}`,
      };
      await repository.createProfile(testUser.id, profileData);

      // Act
      const found = await repository.findProfileByUserId(testUser.id);

      // Assert
      expect(found).toBeDefined();
      expect(found?.userId).toBe(testUser.id);
      expect(found?.firstName).toBe('Jane');
      expect(found?.username).toBe(profileData.username);
      expect(found?.id).toBeDefined();
      expect(found?.createdAt).toBeDefined();
      expect(found?.updatedAt).toBeDefined();
    });

    it('should return null for user with no profile', async () => {
      // Act - query for user with no profile
      const found = await repository.findProfileByUserId(testUser.id);

      // Assert
      expect(found).toBeNull();
    });

    it('should return null for non-existent user', async () => {
      // Act
      const found = await repository.findProfileByUserId('11111111-1111-1111-1111-111111111111');

      // Assert
      expect(found).toBeNull();
    });
  });

  describe('updateProfile', () => {
    it('should update user profile firstName', async () => {
      // Arrange - create initial profile
      const initialData: UserProfileData = {
        firstName: 'John',
        username: `john_${Date.now()}`,
      };
      await repository.createProfile(testUser.id, initialData);

      // Act
      await repository.updateProfile(testUser.id, { firstName: 'Jonathan' });

      // Assert
      const updated = await repository.findProfileByUserId(testUser.id);
      expect(updated?.firstName).toBe('Jonathan');
      expect(updated?.username).toBe(initialData.username); // username unchanged
    });

    it('should update user profile username', async () => {
      // Arrange - create initial profile
      const initialUsername = `john_${Date.now()}`;
      const initialData: UserProfileData = {
        firstName: 'John',
        username: initialUsername,
      };
      await repository.createProfile(testUser.id, initialData);

      // Act
      const newUsername = `john_updated_${Date.now()}`;
      await repository.updateProfile(testUser.id, { username: newUsername });

      // Assert
      const updated = await repository.findProfileByUserId(testUser.id);
      expect(updated?.username).toBe(newUsername);
      expect(updated?.firstName).toBe('John'); // firstName unchanged

      // Verify old username is now available
      const isOldAvailable = await repository.isUsernameAvailable(initialUsername);
      expect(isOldAvailable).toBe(true);

      // Verify new username is taken
      const isNewAvailable = await repository.isUsernameAvailable(newUsername);
      expect(isNewAvailable).toBe(false);
    });

    it('should update both firstName and username', async () => {
      // Arrange - create initial profile
      const initialData: UserProfileData = {
        firstName: 'John',
        username: `john_${Date.now()}`,
      };
      await repository.createProfile(testUser.id, initialData);

      // Act
      const newUsername = `jonathan_${Date.now()}`;
      await repository.updateProfile(testUser.id, { 
        firstName: 'Jonathan',
        username: newUsername,
      });

      // Assert
      const updated = await repository.findProfileByUserId(testUser.id);
      expect(updated?.firstName).toBe('Jonathan');
      expect(updated?.username).toBe(newUsername);
    });

    it('should update personal info fields (sex and birthYear)', async () => {
      // Arrange - create profile first
      await repository.createProfile(testUser.id, {
        firstName: 'Test',
        username: `test_${Date.now()}`,
      });

      // Act
      await repository.updateProfile(testUser.id, {
        sex: 'male' as const,
        birthYear: 1985,
      });

      // Assert
      const updated = await repository.findProfileByUserId(testUser.id);
      expect(updated?.sex).toBe('male');
      expect(updated?.birthYear).toBe(1985);
    });
  });

  describe('findUserWithProfile', () => {
    it('should return user with profile when profile exists', async () => {
      // Arrange
      const profileData: UserProfileData = {
        firstName: 'John',
        username: `john_${Date.now()}`,
      };
      await repository.createProfile(testUser.id, profileData);

      // Act
      const userWithProfile = await repository.findUserWithProfile(testUser.id);

      // Assert
      expect(userWithProfile).toBeDefined();
      expect(userWithProfile?.id).toBe(testUser.id);
      expect(userWithProfile?.email).toBe(testUser.email);
      expect(userWithProfile?.firstName).toBe('John');
      expect(userWithProfile?.username).toBe(profileData.username);
      expect(userWithProfile?.isNewUser).toBe(false);
      expect(userWithProfile?.profile).toBeDefined();
    });

    it('should return user with isNewUser=true when profile does not exist', async () => {
      // Act
      const userWithProfile = await repository.findUserWithProfile(testUser.id);

      // Assert
      expect(userWithProfile).toBeDefined();
      expect(userWithProfile?.id).toBe(testUser.id);
      expect(userWithProfile?.email).toBe(testUser.email);
      expect(userWithProfile?.firstName).toBeUndefined();
      expect(userWithProfile?.username).toBeUndefined();
      expect(userWithProfile?.isNewUser).toBe(true);
      expect(userWithProfile?.profile).toBeNull();
    });
  });

  describe('integration scenarios', () => {
    it('should handle username lifecycle: check availability -> create -> verify taken -> update -> verify old available', async () => {
      // Step 1: Check availability
      const username1 = `lifecycle_${Date.now()}`;
      const isAvailable1 = await repository.isUsernameAvailable(username1);
      expect(isAvailable1).toBe(true);

      // Step 2: Create profile with username
      await repository.createProfile(testUser.id, {
        firstName: 'Test',
        username: username1,
      });

      // Step 3: Verify username is now taken
      const isAvailable2 = await repository.isUsernameAvailable(username1);
      expect(isAvailable2).toBe(false);

      // Step 4: Update to new username
      const username2 = `lifecycle_updated_${Date.now()}`;
      await repository.updateProfile(testUser.id, { username: username2 });

      // Step 5: Verify old username is available again
      const isAvailable3 = await repository.isUsernameAvailable(username1);
      expect(isAvailable3).toBe(true);

      // Step 6: Verify new username is taken
      const isAvailable4 = await repository.isUsernameAvailable(username2);
      expect(isAvailable4).toBe(false);
    });
  });
});

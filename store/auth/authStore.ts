import { observable } from '@legendapp/state';
import { User } from '../../domain/models/user';
import { AuthSession } from '../../domain/models/auth';

interface AuthState extends AuthSession {
  // Actions
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

const createInitialState = (): AuthSession => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,
});

export const authStore = observable<AuthState>({
  ...createInitialState(),

  // Actions
  setUser: (user: User | null) => {
    authStore.user.set(user);
    authStore.isAuthenticated.set(!!user);
    authStore.isLoading.set(false);
  },

  setLoading: (loading: boolean) => {
    authStore.isLoading.set(loading);
  },

  reset: () => {
    const initialState = createInitialState();
    authStore.user.set(initialState.user);
    authStore.isLoading.set(initialState.isLoading);
    authStore.isAuthenticated.set(initialState.isAuthenticated);
  },
});

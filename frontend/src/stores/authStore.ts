import { create } from 'zustand';
import { api } from '@/lib/api';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  checkAuth: () => Promise<void>;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // Start loading to check auth on mount
  error: null,

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  checkAuth: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get<User>('/auth/me');
      set({ user: response.data, isAuthenticated: true, isLoading: false });
    } catch (error) {
      // 401 means not authenticated, which is normal on first load if no cookie
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
      // Clear user state and clear local storage if any
      set({ user: null, isAuthenticated: false });
      window.location.href = '/login'; // Force redirect to clear state
    } catch (error) {
      console.error('Logout failed', error);
      // Still log them out locally
      set({ user: null, isAuthenticated: false });
    }
  },
}));

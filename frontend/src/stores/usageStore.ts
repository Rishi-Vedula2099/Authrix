import { create } from 'zustand';
import { api } from '@/lib/api';
import { UsageResponse } from '@/types';

interface UsageState {
  usage: UsageResponse | null;
  isLoading: boolean;
  error: string | null;
  fetchUsage: () => Promise<void>;
}

export const useUsageStore = create<UsageState>((set) => ({
  usage: null,
  isLoading: false,
  error: null,
  fetchUsage: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get<UsageResponse>('/usage');
      set({ usage: response.data, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.detail || 'Failed to fetch usage',
        isLoading: false 
      });
    }
  },
}));

import { create } from 'zustand';
import { api } from '@/lib/api';
import { AnalyzeResponse, HumanizeResponse } from '@/types';

interface ResultState {
  // Analysis State
  isAnalyzing: boolean;
  analyzeResult: AnalyzeResponse | null;
  analyzeError: string | null;

  // Humanize State
  isHumanizing: boolean;
  humanizeResult: HumanizeResponse | null;
  humanizeError: string | null;

  // Actions
  analyzeText: (text: string) => Promise<boolean>;
  humanizeText: (text: string, tone: string) => Promise<boolean>;
  clearResults: () => void;
}

export const useResultStore = create<ResultState>((set) => ({
  isAnalyzing: false,
  analyzeResult: null,
  analyzeError: null,

  isHumanizing: false,
  humanizeResult: null,
  humanizeError: null,

  analyzeText: async (text: string) => {
    set({ isAnalyzing: true, analyzeError: null, analyzeResult: null });
    try {
      const response = await api.post<AnalyzeResponse>('/analyze', { text });
      set({ analyzeResult: response.data, isAnalyzing: false });
      return true;
    } catch (error: any) {
      set({ 
        analyzeError: error.response?.data?.detail || 'Failed to analyze text',
        isAnalyzing: false 
      });
      return false;
    }
  },

  humanizeText: async (text: string, tone: string) => {
    set({ isHumanizing: true, humanizeError: null, humanizeResult: null });
    try {
      const response = await api.post<HumanizeResponse>('/humanize', { text, tone });
      set({ humanizeResult: response.data, isHumanizing: false });
      return true;
    } catch (error: any) {
      set({ 
        humanizeError: error.response?.data?.detail || 'Failed to humanize text',
        isHumanizing: false 
      });
      return false;
    }
  },

  clearResults: () => set({
    analyzeResult: null,
    analyzeError: null,
    humanizeResult: null,
    humanizeError: null
  }),
}));

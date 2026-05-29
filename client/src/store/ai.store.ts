import { create } from 'zustand';
import type { AIPrediction, WinProbability } from '../types/ai.types';
import { aiApi } from '../api/ai.api';

interface AIState {
  predictions: AIPrediction | null;
  winProbabilities: WinProbability[];
  isLoading: boolean;
  error: string | null;

  fetchPredictions: (raceId: string) => Promise<void>;
  fetchWinProbabilities: (raceId: string) => Promise<void>;
  clearError: () => void;
}

export const useAIStore = create<AIState>((set) => ({
  predictions: null,
  winProbabilities: [],
  isLoading: false,
  error: null,

  fetchPredictions: async (raceId) => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await aiApi.getPredictions(raceId);
      set({ predictions: data, isLoading: false });
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to load AI predictions';
      set({ error: message, isLoading: false });
    }
  },

  fetchWinProbabilities: async (raceId) => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await aiApi.getWinProbabilities(raceId);
      set({ winProbabilities: data, isLoading: false });
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to load win probabilities';
      set({ error: message, isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));

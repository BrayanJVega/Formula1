import { create } from 'zustand';
import type { GamificationProfile, Achievement } from '../types/gamification.types';
import { gamificationApi } from '../api/gamification.api';

interface GamificationState {
  profile: GamificationProfile | null;
  achievements: Achievement[];
  isLoading: boolean;
  error: string | null;

  fetchProfile: () => Promise<void>;
  fetchAchievements: () => Promise<void>;
  clearError: () => void;
}

export const useGamificationStore = create<GamificationState>((set) => ({
  profile: null,
  achievements: [],
  isLoading: false,
  error: null,

  fetchProfile: async () => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await gamificationApi.getProfile();
      set({ profile: data, isLoading: false });
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to load gamification profile';
      set({ error: message, isLoading: false });
    }
  },

  fetchAchievements: async () => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await gamificationApi.getAchievements();
      set({ achievements: data, isLoading: false });
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to load achievements';
      set({ error: message, isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));

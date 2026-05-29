import { create } from 'zustand';
import type { RankingEntry } from '../types/ranking.types';
import { rankingsApi } from '../api/rankings.api';

interface RankingState {
  globalRankings: RankingEntry[];
  weeklyRankings: RankingEntry[];
  countryRankings: RankingEntry[];
  myPosition: RankingEntry | null;
  pagination: { total: number; page: number; limit: number };
  isLoading: boolean;
  error: string | null;

  fetchGlobalRankings: (seasonId?: string, page?: number, limit?: number) => Promise<void>;
  fetchWeeklyRankings: (page?: number, limit?: number) => Promise<void>;
  fetchCountryRankings: (countryCode: string, seasonId?: string) => Promise<void>;
  fetchMyPosition: (seasonId?: string) => Promise<void>;
  clearError: () => void;
}

export const useRankingStore = create<RankingState>((set) => ({
  globalRankings: [],
  weeklyRankings: [],
  countryRankings: [],
  myPosition: null,
  pagination: { total: 0, page: 1, limit: 50 },
  isLoading: false,
  error: null,

  fetchGlobalRankings: async (seasonId, page, limit) => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await rankingsApi.getGlobal(seasonId, page, limit);
      set({
        globalRankings: data.rankings,
        pagination: { total: data.total, page: data.page, limit: data.limit },
        isLoading: false,
      });
    } catch (err: any) {
      set({ error: err.response?.data?.error || 'Failed to load global rankings', isLoading: false });
    }
  },

  fetchWeeklyRankings: async (page, limit) => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await rankingsApi.getWeekly(page, limit);
      set({
        weeklyRankings: data.rankings,
        pagination: { total: data.total, page: data.page, limit: data.limit },
        isLoading: false,
      });
    } catch (err: any) {
      set({ error: err.response?.data?.error || 'Failed to load weekly rankings', isLoading: false });
    }
  },

  fetchCountryRankings: async (countryCode, seasonId) => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await rankingsApi.getCountry(countryCode, seasonId);
      set({ countryRankings: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.error || 'Failed to load country rankings', isLoading: false });
    }
  },

  fetchMyPosition: async (seasonId) => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await rankingsApi.getMyPosition(seasonId);
      set({ myPosition: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.error || 'Failed to load your position', isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));

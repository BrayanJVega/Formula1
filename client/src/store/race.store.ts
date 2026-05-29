import { create } from 'zustand';
import type { Race } from '../types/race.types';
import { racesApi } from '../api/races.api';

interface RaceState {
  races: Race[];
  nextRace: Race | null;
  selectedRace: Race | null;
  isLoading: boolean;
  error: string | null;

  fetchRaces: (seasonId: string, status?: string) => Promise<void>;
  fetchRaceById: (id: string) => Promise<void>;
  fetchNextRace: () => Promise<void>;
  clearError: () => void;
}

export const useRaceStore = create<RaceState>((set) => ({
  races: [],
  nextRace: null,
  selectedRace: null,
  isLoading: false,
  error: null,

  fetchRaces: async (seasonId, status) => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await racesApi.getRaces(seasonId, status);
      set({ races: data, isLoading: false });
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to load races';
      set({ error: message, isLoading: false });
    }
  },

  fetchRaceById: async (id) => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await racesApi.getRaceById(id);
      set({ selectedRace: data, isLoading: false });
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to load race';
      set({ error: message, isLoading: false });
    }
  },

  fetchNextRace: async () => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await racesApi.getNextRace();
      set({ nextRace: data, isLoading: false });
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to load next race';
      set({ error: message, isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));

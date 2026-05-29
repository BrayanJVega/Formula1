import { create } from 'zustand';
import { simulationApi, type RunRacePayload, type RunSeasonPayload, type RunWhatIfPayload } from '../api/simulation.api';
import type { RaceSimulationResult, SeasonSimulationResult } from '../types/simulation.types';

interface SimulationState {
  raceResult: RaceSimulationResult | null;
  seasonResult: SeasonSimulationResult | null;
  whatIfResult: { base: RaceSimulationResult; modified: RaceSimulationResult } | null;
  history: unknown[];
  isLoading: boolean;
  error: string | null;

  runRace: (payload: RunRacePayload) => Promise<void>;
  runSeason: (payload: RunSeasonPayload) => Promise<void>;
  runWhatIf: (payload: RunWhatIfPayload) => Promise<void>;
  fetchHistory: (type?: string) => Promise<void>;
  clearResults: () => void;
  clearError: () => void;
}

export const useSimulationStore = create<SimulationState>((set) => ({
  raceResult: null,
  seasonResult: null,
  whatIfResult: null,
  history: [],
  isLoading: false,
  error: null,

  runRace: async (payload) => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await simulationApi.runRace(payload);
      set({ raceResult: data.result, isLoading: false });
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to run simulation';
      set({ error: message, isLoading: false });
    }
  },

  runSeason: async (payload) => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await simulationApi.runSeason(payload);
      set({ seasonResult: data.result, isLoading: false });
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to run season simulation';
      set({ error: message, isLoading: false });
    }
  },

  runWhatIf: async (payload) => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await simulationApi.runWhatIf(payload);
      set({ whatIfResult: data.result, isLoading: false });
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to run what-if simulation';
      set({ error: message, isLoading: false });
    }
  },

  fetchHistory: async (type) => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await simulationApi.getHistory(type);
      set({ history: data, isLoading: false });
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to load history';
      set({ error: message, isLoading: false });
    }
  },

  clearResults: () => set({ raceResult: null, seasonResult: null, whatIfResult: null }),
  clearError: () => set({ error: null }),
}));

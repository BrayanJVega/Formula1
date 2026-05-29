import { create } from 'zustand';
import { simulationApi } from '../api/simulation.api';
export const useSimulationStore = create((set) => ({
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
        }
        catch (err) {
            const message = err.response?.data?.error || 'Failed to run simulation';
            set({ error: message, isLoading: false });
        }
    },
    runSeason: async (payload) => {
        try {
            set({ isLoading: true, error: null });
            const { data } = await simulationApi.runSeason(payload);
            set({ seasonResult: data.result, isLoading: false });
        }
        catch (err) {
            const message = err.response?.data?.error || 'Failed to run season simulation';
            set({ error: message, isLoading: false });
        }
    },
    runWhatIf: async (payload) => {
        try {
            set({ isLoading: true, error: null });
            const { data } = await simulationApi.runWhatIf(payload);
            set({ whatIfResult: data.result, isLoading: false });
        }
        catch (err) {
            const message = err.response?.data?.error || 'Failed to run what-if simulation';
            set({ error: message, isLoading: false });
        }
    },
    fetchHistory: async (type) => {
        try {
            set({ isLoading: true, error: null });
            const { data } = await simulationApi.getHistory(type);
            set({ history: data, isLoading: false });
        }
        catch (err) {
            const message = err.response?.data?.error || 'Failed to load history';
            set({ error: message, isLoading: false });
        }
    },
    clearResults: () => set({ raceResult: null, seasonResult: null, whatIfResult: null }),
    clearError: () => set({ error: null }),
}));
//# sourceMappingURL=simulation.store.js.map
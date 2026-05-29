import { create } from 'zustand';
import { racesApi } from '../api/races.api';
export const useRaceStore = create((set) => ({
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
        }
        catch (err) {
            const message = err.response?.data?.error || 'Failed to load races';
            set({ error: message, isLoading: false });
        }
    },
    fetchRaceById: async (id) => {
        try {
            set({ isLoading: true, error: null });
            const { data } = await racesApi.getRaceById(id);
            set({ selectedRace: data, isLoading: false });
        }
        catch (err) {
            const message = err.response?.data?.error || 'Failed to load race';
            set({ error: message, isLoading: false });
        }
    },
    fetchNextRace: async () => {
        try {
            set({ isLoading: true, error: null });
            const { data } = await racesApi.getNextRace();
            set({ nextRace: data, isLoading: false });
        }
        catch (err) {
            const message = err.response?.data?.error || 'Failed to load next race';
            set({ error: message, isLoading: false });
        }
    },
    clearError: () => set({ error: null }),
}));
//# sourceMappingURL=race.store.js.map
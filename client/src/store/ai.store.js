import { create } from 'zustand';
import { aiApi } from '../api/ai.api';
export const useAIStore = create((set) => ({
    predictions: null,
    winProbabilities: [],
    isLoading: false,
    error: null,
    fetchPredictions: async (raceId) => {
        try {
            set({ isLoading: true, error: null });
            const { data } = await aiApi.getPredictions(raceId);
            set({ predictions: data, isLoading: false });
        }
        catch (err) {
            const message = err.response?.data?.error || 'Failed to load AI predictions';
            set({ error: message, isLoading: false });
        }
    },
    fetchWinProbabilities: async (raceId) => {
        try {
            set({ isLoading: true, error: null });
            const { data } = await aiApi.getWinProbabilities(raceId);
            set({ winProbabilities: data, isLoading: false });
        }
        catch (err) {
            const message = err.response?.data?.error || 'Failed to load win probabilities';
            set({ error: message, isLoading: false });
        }
    },
    clearError: () => set({ error: null }),
}));
//# sourceMappingURL=ai.store.js.map
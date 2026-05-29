import { create } from 'zustand';
import { predictionsApi } from '../api/predictions.api';
export const usePredictionStore = create((set) => ({
    predictions: [],
    currentPrediction: null,
    racePrediction: null,
    pagination: { total: 0, page: 1, limit: 20 },
    isLoading: false,
    error: null,
    createPrediction: async (data) => {
        try {
            set({ isLoading: true, error: null });
            const { data: prediction } = await predictionsApi.create(data);
            set((state) => ({
                predictions: [prediction, ...state.predictions],
                isLoading: false,
                racePrediction: prediction,
            }));
            return prediction;
        }
        catch (err) {
            const message = err.response?.data?.error || 'Failed to create prediction';
            set({ error: message, isLoading: false });
            throw new Error(message);
        }
    },
    fetchMyPredictions: async (page, limit) => {
        try {
            set({ isLoading: true, error: null });
            const { data } = await predictionsApi.getMyPredictions(page, limit);
            set({
                predictions: data.predictions,
                pagination: { total: data.total, page: data.page, limit: data.limit },
                isLoading: false,
            });
        }
        catch (err) {
            const message = err.response?.data?.error || 'Failed to load predictions';
            set({ error: message, isLoading: false });
        }
    },
    fetchRacePrediction: async (raceId) => {
        try {
            set({ isLoading: true, error: null });
            const { data } = await predictionsApi.getByRace(raceId);
            set({ racePrediction: data, isLoading: false });
        }
        catch (err) {
            const message = err.response?.data?.error || 'Failed to load prediction';
            set({ error: message, isLoading: false });
        }
    },
    fetchPredictionById: async (id) => {
        try {
            set({ isLoading: true, error: null });
            const result = await predictionsApi.getById(id);
            set({ currentPrediction: result.data, isLoading: false });
        }
        catch (err) {
            const message = err.response?.data?.error || 'Failed to load prediction';
            set({ error: message, isLoading: false });
        }
    },
    updatePrediction: async (id, data) => {
        try {
            set({ isLoading: true, error: null });
            const { data: prediction } = await predictionsApi.update(id, data);
            set((state) => ({
                predictions: state.predictions.map((p) => (p.id === id ? prediction : p)),
                racePrediction: state.racePrediction?.id === id ? prediction : state.racePrediction,
                currentPrediction: state.currentPrediction?.id === id ? { ...state.currentPrediction, ...prediction } : state.currentPrediction,
                isLoading: false,
            }));
            return prediction;
        }
        catch (err) {
            const message = err.response?.data?.error || 'Failed to update prediction';
            set({ error: message, isLoading: false });
            throw new Error(message);
        }
    },
    submitPrediction: async (id, actualResults) => {
        try {
            set({ isLoading: true, error: null });
            await predictionsApi.submit(id, actualResults);
            const { data: prediction } = await predictionsApi.getById(id);
            set((state) => ({
                currentPrediction: prediction,
                predictions: state.predictions.map((p) => (p.id === id ? { ...p, isLocked: true, totalScore: prediction.totalScore } : p)),
                isLoading: false,
            }));
        }
        catch (err) {
            const message = err.response?.data?.error || 'Failed to submit prediction';
            set({ error: message, isLoading: false });
            throw new Error(message);
        }
    },
    clearError: () => set({ error: null }),
}));
//# sourceMappingURL=prediction.store.js.map
import { create } from 'zustand';
import { rankingsApi } from '../api/rankings.api';
export const useRankingStore = create((set) => ({
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
        }
        catch (err) {
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
        }
        catch (err) {
            set({ error: err.response?.data?.error || 'Failed to load weekly rankings', isLoading: false });
        }
    },
    fetchCountryRankings: async (countryCode, seasonId) => {
        try {
            set({ isLoading: true, error: null });
            const { data } = await rankingsApi.getCountry(countryCode, seasonId);
            set({ countryRankings: data, isLoading: false });
        }
        catch (err) {
            set({ error: err.response?.data?.error || 'Failed to load country rankings', isLoading: false });
        }
    },
    fetchMyPosition: async (seasonId) => {
        try {
            set({ isLoading: true, error: null });
            const { data } = await rankingsApi.getMyPosition(seasonId);
            set({ myPosition: data, isLoading: false });
        }
        catch (err) {
            set({ error: err.response?.data?.error || 'Failed to load your position', isLoading: false });
        }
    },
    clearError: () => set({ error: null }),
}));
//# sourceMappingURL=ranking.store.js.map
import { create } from 'zustand';
import { gamificationApi } from '../api/gamification.api';
export const useGamificationStore = create((set) => ({
    profile: null,
    achievements: [],
    isLoading: false,
    error: null,
    fetchProfile: async () => {
        try {
            set({ isLoading: true, error: null });
            const { data } = await gamificationApi.getProfile();
            set({ profile: data, isLoading: false });
        }
        catch (err) {
            const message = err.response?.data?.error || 'Failed to load gamification profile';
            set({ error: message, isLoading: false });
        }
    },
    fetchAchievements: async () => {
        try {
            set({ isLoading: true, error: null });
            const { data } = await gamificationApi.getAchievements();
            set({ achievements: data, isLoading: false });
        }
        catch (err) {
            const message = err.response?.data?.error || 'Failed to load achievements';
            set({ error: message, isLoading: false });
        }
    },
    clearError: () => set({ error: null }),
}));
//# sourceMappingURL=gamification.store.js.map
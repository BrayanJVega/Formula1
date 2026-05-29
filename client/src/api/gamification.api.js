import { apiClient } from './client';
export const gamificationApi = {
    async getProfile() {
        const { data } = await apiClient.get('/gamification/profile');
        return data;
    },
    async getAchievements() {
        const { data } = await apiClient.get('/gamification/achievements');
        return data;
    },
    async getLevels() {
        const { data } = await apiClient.get('/gamification/levels');
        return data;
    },
    async getStreaks() {
        const { data } = await apiClient.get('/gamification/streaks');
        return data;
    },
};
//# sourceMappingURL=gamification.api.js.map
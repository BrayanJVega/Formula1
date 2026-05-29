import { apiClient } from './client';
export const rankingsApi = {
    async getGlobal(seasonId, page = 1, limit = 50) {
        const response = await apiClient.get('/rankings/global', {
            params: { seasonId, page, limit },
        });
        return response.data;
    },
    async getWeekly(page = 1, limit = 50) {
        const response = await apiClient.get('/rankings/weekly', {
            params: { page, limit },
        });
        return response.data;
    },
    async getCountry(countryCode, seasonId) {
        const response = await apiClient.get(`/rankings/country/${countryCode}`, {
            params: { seasonId },
        });
        return response.data;
    },
    async getMyPosition(seasonId) {
        const response = await apiClient.get('/rankings/me', {
            params: { seasonId },
        });
        return response.data;
    },
};
//# sourceMappingURL=rankings.api.js.map
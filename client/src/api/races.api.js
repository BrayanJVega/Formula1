import { apiClient } from './client';
export const racesApi = {
    async getRaces(seasonId, status) {
        const params = { seasonId };
        if (status)
            params.status = status;
        const { data } = await apiClient.get('/races', { params });
        return data;
    },
    async getRaceById(id) {
        const { data } = await apiClient.get(`/races/${id}`);
        return data;
    },
    async getNextRace() {
        const { data } = await apiClient.get('/races/next');
        return data;
    },
};
//# sourceMappingURL=races.api.js.map
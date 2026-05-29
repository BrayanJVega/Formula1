import { apiClient } from './client';
export const predictionsApi = {
    async create(data) {
        const response = await apiClient.post('/predictions', data);
        return response.data;
    },
    async getMyPredictions(page = 1, limit = 20) {
        const response = await apiClient.get('/predictions/my', {
            params: { page, limit },
        });
        return response.data;
    },
    async getByRace(raceId) {
        const response = await apiClient.get(`/predictions/race/${raceId}`);
        return response.data;
    },
    async getById(id) {
        const response = await apiClient.get(`/predictions/${id}`);
        return response.data;
    },
    async getScore(id) {
        const response = await apiClient.get(`/predictions/${id}/score`);
        return response.data;
    },
    async update(id, data) {
        const response = await apiClient.put(`/predictions/${id}`, data);
        return response.data;
    },
    async submit(id, actualResults) {
        const response = await apiClient.post(`/predictions/${id}/submit`, { actualResults });
        return response.data;
    },
};
//# sourceMappingURL=predictions.api.js.map
import { apiClient } from './client';
export const simulationApi = {
    async runRace(payload) {
        const { data } = await apiClient.post('/simulation/race', payload);
        return data;
    },
    async runSeason(payload) {
        const { data } = await apiClient.post('/simulation/season', payload);
        return data;
    },
    async runWhatIf(payload) {
        const { data } = await apiClient.post('/simulation/what-if', payload);
        return data;
    },
    async getHistory(type) {
        const params = type ? { type } : {};
        const { data } = await apiClient.get('/simulation/history', { params });
        return data;
    },
    async getById(id) {
        const { data } = await apiClient.get(`/simulation/${id}`);
        return data;
    },
};
//# sourceMappingURL=simulation.api.js.map
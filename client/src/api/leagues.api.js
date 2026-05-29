import { apiClient } from './client';
export const leaguesApi = {
    async create(data) {
        const response = await apiClient.post('/leagues', data);
        return response.data;
    },
    async getMyLeagues() {
        const response = await apiClient.get('/leagues/my');
        return response.data;
    },
    async getById(id) {
        const response = await apiClient.get(`/leagues/${id}`);
        return response.data;
    },
    async join(code) {
        const response = await apiClient.post(`/leagues/${code}/join`, { code });
        return response.data;
    },
    async leave(id) {
        await apiClient.post(`/leagues/${id}/leave`);
    },
    async getMembers(id) {
        const response = await apiClient.get(`/leagues/${id}/members`);
        return response.data;
    },
    async getLeagueRanking(id) {
        const response = await apiClient.get(`/leagues/${id}/ranking`);
        return response.data;
    },
};
//# sourceMappingURL=leagues.api.js.map
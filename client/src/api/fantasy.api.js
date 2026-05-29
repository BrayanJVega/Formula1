import { apiClient } from './client';
export const fantasyApi = {
    async createTeam(payload) {
        const { data } = await apiClient.post('/fantasy/team', payload);
        return data;
    },
    async getMyTeam(seasonId) {
        const { data } = await apiClient.get(`/fantasy/team/my?seasonId=${seasonId}`);
        return data;
    },
    async getTeamById(id) {
        const { data } = await apiClient.get(`/fantasy/team/${id}`);
        return data;
    },
    async updateTeam(id, name) {
        const { data } = await apiClient.put(`/fantasy/team/${id}`, { name });
        return data;
    },
    async addPick(teamId, payload) {
        const { data } = await apiClient.post(`/fantasy/team/${teamId}/picks`, payload);
        return data;
    },
    async removePick(pickId) {
        const { data } = await apiClient.delete(`/fantasy/picks/${pickId}`);
        return data;
    },
    async transferDriver(teamId, payload) {
        const { data } = await apiClient.post(`/fantasy/team/${teamId}/transfer`, payload);
        return data;
    },
    async getMarketValues(seasonId) {
        const { data } = await apiClient.get(`/fantasy/market-values?seasonId=${seasonId}`);
        return data;
    },
    async getStandings(seasonId) {
        const { data } = await apiClient.get(`/fantasy/standings?seasonId=${seasonId}`);
        return data;
    },
};
//# sourceMappingURL=fantasy.api.js.map
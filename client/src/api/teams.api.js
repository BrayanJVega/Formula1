import { apiClient } from './client';
export const teamsApi = {
    async getAll(isActive) {
        const params = isActive !== undefined ? { isActive: String(isActive) } : undefined;
        const { data } = await apiClient.get('/teams', { params });
        return data.data;
    },
    async getById(id) {
        const { data } = await apiClient.get(`/teams/${id}`);
        return data.data;
    },
    async create(payload) {
        const { data } = await apiClient.post('/teams', payload);
        return data.data;
    },
    async update(id, payload) {
        const { data } = await apiClient.put(`/teams/${id}`, payload);
        return data.data;
    },
    async delete(id) {
        await apiClient.delete(`/teams/${id}`);
    },
};
//# sourceMappingURL=teams.api.js.map
import { apiClient } from './client';
export const circuitsApi = {
    async getAll() {
        const { data } = await apiClient.get('/circuits');
        return data;
    },
    async getById(id) {
        const { data } = await apiClient.get(`/circuits/${id}`);
        return data;
    },
    async create(payload) {
        const { data } = await apiClient.post('/circuits', payload);
        return data;
    },
    async update(id, payload) {
        const { data } = await apiClient.put(`/circuits/${id}`, payload);
        return data;
    },
    async delete(id) {
        await apiClient.delete(`/circuits/${id}`);
    },
};
//# sourceMappingURL=circuits.api.js.map
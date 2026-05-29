import { apiClient } from './client';
export const driversApi = {
    async getDrivers(filters) {
        const params = new URLSearchParams();
        if (filters?.teamId)
            params.set('teamId', filters.teamId);
        if (filters?.nationality)
            params.set('nationality', filters.nationality);
        if (filters?.isActive !== undefined)
            params.set('isActive', String(filters.isActive));
        if (filters?.page)
            params.set('page', String(filters.page));
        if (filters?.limit)
            params.set('limit', String(filters.limit));
        const query = params.toString();
        const { data } = await apiClient.get(`/drivers${query ? `?${query}` : ''}`);
        return data;
    },
    async getDriverById(id) {
        const { data } = await apiClient.get(`/drivers/${id}`);
        return data;
    },
    async createDriver(payload) {
        const { data } = await apiClient.post('/drivers', payload);
        return data;
    },
    async updateDriver(id, payload) {
        const { data } = await apiClient.put(`/drivers/${id}`, payload);
        return data;
    },
    async deleteDriver(id) {
        await apiClient.delete(`/drivers/${id}`);
    },
};
//# sourceMappingURL=drivers.api.js.map
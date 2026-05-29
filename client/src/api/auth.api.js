import { apiClient } from './client';
export const authApi = {
    async register(payload) {
        const { data } = await apiClient.post('/auth/register', payload);
        return data;
    },
    async login(payload) {
        const { data } = await apiClient.post('/auth/login', payload);
        return data;
    },
    async logout() {
        await apiClient.post('/auth/logout');
    },
    async refresh(refreshToken) {
        const { data } = await apiClient.post('/auth/refresh', { refreshToken });
        return data;
    },
    async getMe() {
        const { data } = await apiClient.get('/auth/me');
        return data;
    },
    async forgotPassword(email) {
        await apiClient.post('/auth/forgot-password', { email });
    },
};
//# sourceMappingURL=auth.api.js.map
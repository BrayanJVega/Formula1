import { create } from 'zustand';
import { authApi } from '../api/auth.api';
export const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
    login: async (email, password) => {
        try {
            set({ isLoading: true, error: null });
            const response = await authApi.login({ email, password });
            localStorage.setItem('accessToken', response.accessToken);
            localStorage.setItem('refreshToken', response.refreshToken);
            set({ user: response.user, isAuthenticated: true, isLoading: false });
        }
        catch (err) {
            const message = err.response?.data?.error || 'Login failed';
            set({ error: message, isLoading: false });
            throw new Error(message);
        }
    },
    register: async (email, username, password) => {
        try {
            set({ isLoading: true, error: null });
            const response = await authApi.register({ email, username, password });
            localStorage.setItem('accessToken', response.accessToken);
            localStorage.setItem('refreshToken', response.refreshToken);
            set({ user: response.user, isAuthenticated: true, isLoading: false });
        }
        catch (err) {
            const message = err.response?.data?.error || 'Registration failed';
            set({ error: message, isLoading: false });
            throw new Error(message);
        }
    },
    logout: async () => {
        try {
            await authApi.logout();
        }
        finally {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            set({ user: null, isAuthenticated: false, isLoading: false });
        }
    },
    checkAuth: async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            set({ isLoading: false });
            return;
        }
        try {
            const { user } = await authApi.getMe();
            set({ user, isAuthenticated: true, isLoading: false });
        }
        catch {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            set({ isLoading: false });
        }
    },
    clearError: () => set({ error: null }),
}));
//# sourceMappingURL=auth.store.js.map
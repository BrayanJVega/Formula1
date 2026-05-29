import { create } from 'zustand';
import type { User } from '../types';
import { authApi } from '../api/auth.api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
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
    } catch (err: any) {
      let message = err.response?.data?.error || 'Error al iniciar sesión';
      if (err.response?.data?.details) {
        const details = err.response.data.details;
        const detailMessages = Object.entries(details)
          .map(([field, msgs]: any) => {
            const fieldName = field === 'email' ? 'Email' : field === 'username' ? 'Usuario' : field === 'password' ? 'Contraseña' : field;
            return `${fieldName}: ${msgs.join(', ')}`;
          })
          .join(' | ');
        message = `${message} (${detailMessages})`;
      }
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
    } catch (err: any) {
      let message = err.response?.data?.error || 'Error al registrarse';
      if (err.response?.data?.details) {
        const details = err.response.data.details;
        const detailMessages = Object.entries(details)
          .map(([field, msgs]: any) => {
            const fieldName = field === 'email' ? 'Email' : field === 'username' ? 'Usuario' : field === 'password' ? 'Contraseña' : field;
            return `${fieldName}: ${msgs.join(', ')}`;
          })
          .join(' | ');
        message = `${message} (${detailMessages})`;
      }
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
    } finally {
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
    } catch {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      set({ isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));

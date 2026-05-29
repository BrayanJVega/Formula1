import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useUIStore } from '../../client/src/store/ui.store';

vi.mock('../../client/src/api/auth.api', () => ({
  authApi: {
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn().mockResolvedValue(undefined),
    getMe: vi.fn(),
    refresh: vi.fn(),
    forgotPassword: vi.fn(),
  },
}));

vi.mock('../../client/src/api/drivers.api', () => ({
  driversApi: {
    getDrivers: vi.fn(),
    getDriverById: vi.fn(),
    createDriver: vi.fn(),
    updateDriver: vi.fn(),
    deleteDriver: vi.fn(),
  },
}));

vi.mock('../../client/src/api/client', () => ({
  apiClient: {
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  },
}));

import { useAuthStore } from '../../client/src/store/auth.store';
import { useDriverStore } from '../../client/src/store/driver.store';
import { authApi } from '../../client/src/api/auth.api';
import { driversApi } from '../../client/src/api/drivers.api';

describe('Auth Store', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
    localStorage.clear();
  });

  describe('login flow', () => {
    it('should update state on successful login', async () => {
      const mockResponse = {
        user: { id: '1', email: 'test@test.com', username: 'test', role: 'user' as const },
        accessToken: 'token123',
        refreshToken: 'refresh123',
      };
      vi.mocked(authApi.login).mockResolvedValue(mockResponse);

      await useAuthStore.getState().login('test@test.com', 'password');

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(mockResponse.user);
      expect(state.error).toBeNull();
      expect(localStorage.getItem('accessToken')).toBe('token123');
    });

    it('should set error on failed login', async () => {
      vi.mocked(authApi.login).mockRejectedValue({
        response: { data: { error: 'Invalid credentials' } },
      });

      await expect(
        useAuthStore.getState().login('test@test.com', 'wrong')
      ).rejects.toThrow('Invalid credentials');

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
    });
  });

  describe('logout', () => {
    it('should clear state on logout', async () => {
      useAuthStore.setState({
        user: { id: '1', email: 'test@test.com', username: 'test', role: 'user' },
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      localStorage.setItem('accessToken', 'token123');

      await useAuthStore.getState().logout();

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(localStorage.getItem('accessToken')).toBeNull();
    });
  });
});

describe('Driver Store', () => {
  beforeEach(() => {
    useDriverStore.setState({
      drivers: [],
      selectedDriver: null,
      filters: {},
      pagination: { total: 0, page: 1, limit: 20 },
      loading: false,
      error: null,
    });
  });

  describe('fetchDrivers', () => {
    it('should populate drivers on fetch', async () => {
      const mockDrivers = {
        drivers: [
          { id: '1', name: 'Verstappen', teamId: 't1', nationality: 'Dutch' },
          { id: '2', name: 'Hamilton', teamId: 't2', nationality: 'British' },
        ],
        total: 2,
        page: 1,
        limit: 20,
      };
      vi.mocked(driversApi.getDrivers).mockResolvedValue(mockDrivers as any);

      await useDriverStore.getState().fetchDrivers();

      const state = useDriverStore.getState();
      expect(state.drivers.length).toBe(2);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should handle fetch errors gracefully', async () => {
      vi.mocked(driversApi.getDrivers).mockRejectedValue({
        response: { data: { error: 'Failed to load' } },
      });

      await useDriverStore.getState().fetchDrivers();

      const state = useDriverStore.getState();
      expect(state.error).toBe('Failed to load');
      expect(state.loading).toBe(false);
    });
  });
});

describe('UI Store', () => {
  beforeEach(() => {
    useUIStore.setState({ sidebarOpen: false });
  });

  describe('sidebar toggle', () => {
    it('should start closed', () => {
      expect(useUIStore.getState().sidebarOpen).toBe(false);
    });

    it('should toggle sidebar open', () => {
      useUIStore.getState().toggleSidebar();
      expect(useUIStore.getState().sidebarOpen).toBe(true);
    });

    it('should toggle sidebar closed', () => {
      useUIStore.setState({ sidebarOpen: true });
      useUIStore.getState().toggleSidebar();
      expect(useUIStore.getState().sidebarOpen).toBe(false);
    });

    it('should set sidebar state directly', () => {
      useUIStore.getState().setSidebarOpen(true);
      expect(useUIStore.getState().sidebarOpen).toBe(true);
    });
  });
});

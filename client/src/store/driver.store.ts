import { create } from 'zustand';
import type { Driver, DriverDetail, DriverFilters, PaginatedDrivers } from '../types';
import { driversApi } from '../api/drivers.api';

interface DriverState {
  drivers: Driver[];
  selectedDriver: DriverDetail | null;
  filters: DriverFilters;
  pagination: { total: number; page: number; limit: number };
  loading: boolean;
  error: string | null;

  fetchDrivers: (filters?: DriverFilters) => Promise<void>;
  fetchDriverById: (id: string) => Promise<void>;
  createDriver: (data: import('../types').CreateDriverPayload) => Promise<Driver>;
  updateDriver: (id: string, data: import('../types').UpdateDriverPayload) => Promise<Driver>;
  deleteDriver: (id: string) => Promise<void>;
  setFilters: (filters: DriverFilters) => void;
  clearError: () => void;
}

export const useDriverStore = create<DriverState>((set, get) => ({
  drivers: [],
  selectedDriver: null,
  filters: {},
  pagination: { total: 0, page: 1, limit: 20 },
  loading: false,
  error: null,

  fetchDrivers: async (filters) => {
    try {
      set({ loading: true, error: null });
      const mergedFilters = { ...get().filters, ...filters };
      const result: PaginatedDrivers = await driversApi.getDrivers(mergedFilters);
      set({
        drivers: result.drivers,
        pagination: { total: result.total, page: result.page, limit: result.limit },
        filters: mergedFilters,
        loading: false,
      });
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to fetch drivers';
      set({ error: message, loading: false });
    }
  },

  fetchDriverById: async (id) => {
    try {
      set({ loading: true, error: null });
      const driver = await driversApi.getDriverById(id);
      set({ selectedDriver: driver, loading: false });
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to fetch driver';
      set({ error: message, loading: false });
    }
  },

  createDriver: async (data) => {
    try {
      set({ loading: true, error: null });
      const driver = await driversApi.createDriver(data);
      set((state) => ({ drivers: [...state.drivers, driver], loading: false }));
      return driver;
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to create driver';
      set({ error: message, loading: false });
      throw new Error(message);
    }
  },

  updateDriver: async (id, data) => {
    try {
      set({ loading: true, error: null });
      const driver = await driversApi.updateDriver(id, data);
      set((state) => ({
        drivers: state.drivers.map((d) => (d.id === id ? { ...d, ...driver } : d)),
        selectedDriver: state.selectedDriver?.id === id ? (driver as DriverDetail) : state.selectedDriver,
        loading: false,
      }));
      return driver;
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to update driver';
      set({ error: message, loading: false });
      throw new Error(message);
    }
  },

  deleteDriver: async (id) => {
    try {
      set({ loading: true, error: null });
      await driversApi.deleteDriver(id);
      set((state) => ({
        drivers: state.drivers.filter((d) => d.id !== id),
        selectedDriver: state.selectedDriver?.id === id ? null : state.selectedDriver,
        loading: false,
      }));
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to delete driver';
      set({ error: message, loading: false });
      throw new Error(message);
    }
  },

  setFilters: (filters) => set({ filters }),

  clearError: () => set({ error: null }),
}));

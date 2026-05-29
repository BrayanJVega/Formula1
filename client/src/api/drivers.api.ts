import { apiClient } from './client';
import type { Driver, DriverDetail, CreateDriverPayload, UpdateDriverPayload, DriverFilters, PaginatedDrivers } from '../types';

export const driversApi = {
  async getDrivers(filters?: DriverFilters): Promise<PaginatedDrivers> {
    const params = new URLSearchParams();
    if (filters?.teamId) params.set('teamId', filters.teamId);
    if (filters?.nationality) params.set('nationality', filters.nationality);
    if (filters?.isActive !== undefined) params.set('isActive', String(filters.isActive));
    if (filters?.page) params.set('page', String(filters.page));
    if (filters?.limit) params.set('limit', String(filters.limit));
    const query = params.toString();
    const { data } = await apiClient.get<PaginatedDrivers>(`/drivers${query ? `?${query}` : ''}`);
    return data;
  },

  async getDriverById(id: string): Promise<DriverDetail> {
    const { data } = await apiClient.get<DriverDetail>(`/drivers/${id}`);
    return data;
  },

  async createDriver(payload: CreateDriverPayload): Promise<Driver> {
    const { data } = await apiClient.post<Driver>('/drivers', payload);
    return data;
  },

  async updateDriver(id: string, payload: UpdateDriverPayload): Promise<Driver> {
    const { data } = await apiClient.put<Driver>(`/drivers/${id}`, payload);
    return data;
  },

  async deleteDriver(id: string): Promise<void> {
    await apiClient.delete(`/drivers/${id}`);
  },
};

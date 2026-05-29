import { apiClient } from './client';
import type { Race } from '../types/race.types';

export const racesApi = {
  async getRaces(seasonId: string, status?: string): Promise<{ data: Race[] }> {
    const params: Record<string, string> = { seasonId };
    if (status) params.status = status;
    const { data } = await apiClient.get<{ data: Race[] }>('/races', { params });
    return data;
  },

  async getRaceById(id: string): Promise<{ data: Race }> {
    const { data } = await apiClient.get<{ data: Race }>(`/races/${id}`);
    return data;
  },

  async getNextRace(): Promise<{ data: Race | null }> {
    const { data } = await apiClient.get<{ data: Race | null }>('/races/next');
    return data;
  },
};

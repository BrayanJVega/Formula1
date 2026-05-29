import { apiClient } from './client';
import type { Team, TeamDetail, CreateTeamPayload, UpdateTeamPayload } from '../types/team.types';

export const teamsApi = {
  async getAll(isActive?: boolean): Promise<Team[]> {
    const params = isActive !== undefined ? { isActive: String(isActive) } : undefined;
    const { data } = await apiClient.get<{ data: Team[] }>('/teams', { params });
    return data.data;
  },

  async getById(id: string): Promise<TeamDetail> {
    const { data } = await apiClient.get<{ data: TeamDetail }>(`/teams/${id}`);
    return data.data;
  },

  async create(payload: CreateTeamPayload): Promise<Team> {
    const { data } = await apiClient.post<{ data: Team }>('/teams', payload);
    return data.data;
  },

  async update(id: string, payload: UpdateTeamPayload): Promise<Team> {
    const { data } = await apiClient.put<{ data: Team }>(`/teams/${id}`, payload);
    return data.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/teams/${id}`);
  },
};

import { apiClient } from './client';
import type { League, LeagueMember, LeagueWithMembers, MyLeague, CreateLeaguePayload, RankingEntry } from '../types';

export const leaguesApi = {
  async create(data: CreateLeaguePayload): Promise<{ data: League }> {
    const response = await apiClient.post<{ data: League }>('/leagues', data);
    return response.data;
  },

  async getMyLeagues(): Promise<{ data: MyLeague[] }> {
    const response = await apiClient.get<{ data: MyLeague[] }>('/leagues/my');
    return response.data;
  },

  async getById(id: string): Promise<{ data: LeagueWithMembers }> {
    const response = await apiClient.get<{ data: LeagueWithMembers }>(`/leagues/${id}`);
    return response.data;
  },

  async join(code: string): Promise<{ data: League }> {
    const response = await apiClient.post<{ data: League }>(`/leagues/${code}/join`, { code });
    return response.data;
  },

  async leave(id: string): Promise<void> {
    await apiClient.post(`/leagues/${id}/leave`);
  },

  async getMembers(id: string): Promise<{ data: LeagueMember[] }> {
    const response = await apiClient.get<{ data: LeagueMember[] }>(`/leagues/${id}/members`);
    return response.data;
  },

  async getLeagueRanking(id: string): Promise<{ data: RankingEntry[] }> {
    const response = await apiClient.get<{ data: RankingEntry[] }>(`/leagues/${id}/ranking`);
    return response.data;
  },
};

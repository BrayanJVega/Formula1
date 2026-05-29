import { apiClient } from './client';
import type {
  FantasyTeam,
  FantasyTeamDetail,
  FantasyPick,
  FantasyTransfer,
  DriverMarketValue,
  StandingsEntry,
  CreateFantasyTeamPayload,
  AddPickPayload,
  TransferDriverPayload,
} from '../types/fantasy.types';

export const fantasyApi = {
  async createTeam(payload: CreateFantasyTeamPayload): Promise<FantasyTeam> {
    const { data } = await apiClient.post<FantasyTeam>('/fantasy/team', payload);
    return data;
  },

  async getMyTeam(seasonId: string): Promise<FantasyTeamDetail> {
    const { data } = await apiClient.get<FantasyTeamDetail>(`/fantasy/team/my?seasonId=${seasonId}`);
    return data;
  },

  async getTeamById(id: string): Promise<FantasyTeamDetail> {
    const { data } = await apiClient.get<FantasyTeamDetail>(`/fantasy/team/${id}`);
    return data;
  },

  async updateTeam(id: string, name: string): Promise<FantasyTeam> {
    const { data } = await apiClient.put<FantasyTeam>(`/fantasy/team/${id}`, { name });
    return data;
  },

  async addPick(teamId: string, payload: AddPickPayload): Promise<FantasyPick> {
    const { data } = await apiClient.post<FantasyPick>(`/fantasy/team/${teamId}/picks`, payload);
    return data;
  },

  async removePick(pickId: string): Promise<FantasyTeam> {
    const { data } = await apiClient.delete<FantasyTeam>(`/fantasy/picks/${pickId}`);
    return data;
  },

  async transferDriver(teamId: string, payload: TransferDriverPayload): Promise<{ team: FantasyTeam; transfer: FantasyTransfer }> {
    const { data } = await apiClient.post<{ team: FantasyTeam; transfer: FantasyTransfer }>(
      `/fantasy/team/${teamId}/transfer`,
      payload,
    );
    return data;
  },

  async getMarketValues(seasonId: string): Promise<DriverMarketValue[]> {
    const { data } = await apiClient.get<DriverMarketValue[]>(`/fantasy/market-values?seasonId=${seasonId}`);
    return data;
  },

  async getStandings(seasonId: string): Promise<StandingsEntry[]> {
    const { data } = await apiClient.get<StandingsEntry[]>(`/fantasy/standings?seasonId=${seasonId}`);
    return data;
  },
};

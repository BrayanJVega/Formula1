import { apiClient } from './client';
import type { RankingEntry, PaginatedRankings } from '../types/ranking.types';

export const rankingsApi = {
  async getGlobal(seasonId?: string, page = 1, limit = 50): Promise<{ data: PaginatedRankings }> {
    const response = await apiClient.get<{ data: PaginatedRankings }>('/rankings/global', {
      params: { seasonId, page, limit },
    });
    return response.data;
  },

  async getWeekly(page = 1, limit = 50): Promise<{ data: PaginatedRankings }> {
    const response = await apiClient.get<{ data: PaginatedRankings }>('/rankings/weekly', {
      params: { page, limit },
    });
    return response.data;
  },

  async getCountry(countryCode: string, seasonId?: string): Promise<{ data: RankingEntry[] }> {
    const response = await apiClient.get<{ data: RankingEntry[] }>(`/rankings/country/${countryCode}`, {
      params: { seasonId },
    });
    return response.data;
  },

  async getMyPosition(seasonId?: string): Promise<{ data: RankingEntry | null }> {
    const response = await apiClient.get<{ data: RankingEntry | null }>('/rankings/me', {
      params: { seasonId },
    });
    return response.data;
  },
};

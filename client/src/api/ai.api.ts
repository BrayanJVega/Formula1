import { apiClient } from './client';
import type { AIPrediction, WinProbability } from '../types/ai.types';

export const aiApi = {
  async getPredictions(raceId: string): Promise<{ data: AIPrediction }> {
    const { data } = await apiClient.get<{ data: AIPrediction }>(`/ai/predictions/${raceId}`);
    return data;
  },

  async getWinProbabilities(raceId: string): Promise<{ data: WinProbability[] }> {
    const { data } = await apiClient.get<{ data: WinProbability[] }>(`/ai/win-probabilities/${raceId}`);
    return data;
  },
};

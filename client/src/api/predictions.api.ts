import { apiClient } from './client';
import type { Prediction, PredictionFormData, PredictionScore, PredictionWithScore, PaginatedPredictions } from '../types/prediction.types';

export const predictionsApi = {
  async create(data: PredictionFormData): Promise<{ data: Prediction }> {
    const response = await apiClient.post<{ data: Prediction }>('/predictions', data);
    return response.data;
  },

  async getMyPredictions(page = 1, limit = 20): Promise<{ data: PaginatedPredictions }> {
    const response = await apiClient.get<{ data: PaginatedPredictions }>('/predictions/my', {
      params: { page, limit },
    });
    return response.data;
  },

  async getByRace(raceId: string): Promise<{ data: Prediction | null }> {
    const response = await apiClient.get<{ data: Prediction | null }>(`/predictions/race/${raceId}`);
    return response.data;
  },

  async getById(id: string): Promise<{ data: PredictionWithScore; scores: PredictionScore | null }> {
    const response = await apiClient.get<{ data: PredictionWithScore; scores: PredictionScore | null }>(`/predictions/${id}`);
    return response.data;
  },

  async getScore(id: string): Promise<{ data: PredictionScore }> {
    const response = await apiClient.get<{ data: PredictionScore }>(`/predictions/${id}/score`);
    return response.data;
  },

  async update(id: string, data: Partial<PredictionFormData>): Promise<{ data: Prediction }> {
    const response = await apiClient.put<{ data: Prediction }>(`/predictions/${id}`, data);
    return response.data;
  },

  async submit(id: string, actualResults: Record<string, unknown>): Promise<{ data: { prediction: Prediction; scores: PredictionScore } }> {
    const response = await apiClient.post<{ data: { prediction: Prediction; scores: PredictionScore } }>(
      `/predictions/${id}/submit`,
      { actualResults },
    );
    return response.data;
  },
};

import { apiClient } from './client';
import type { Circuit, CreateCircuitPayload, UpdateCircuitPayload } from '../types/circuit.types';

export const circuitsApi = {
  async getAll(): Promise<Circuit[]> {
    const { data } = await apiClient.get<Circuit[]>('/circuits');
    return data;
  },

  async getById(id: string): Promise<Circuit> {
    const { data } = await apiClient.get<Circuit>(`/circuits/${id}`);
    return data;
  },

  async create(payload: CreateCircuitPayload): Promise<Circuit> {
    const { data } = await apiClient.post<Circuit>('/circuits', payload);
    return data;
  },

  async update(id: string, payload: UpdateCircuitPayload): Promise<Circuit> {
    const { data } = await apiClient.put<Circuit>(`/circuits/${id}`, payload);
    return data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/circuits/${id}`);
  },
};

import { apiClient } from './client';
import type { GamificationProfile, Achievement, Level, Streak } from '../types/gamification.types';

export const gamificationApi = {
  async getProfile(): Promise<{ data: GamificationProfile }> {
    const { data } = await apiClient.get<{ data: GamificationProfile }>('/gamification/profile');
    return data;
  },

  async getAchievements(): Promise<{ data: Achievement[] }> {
    const { data } = await apiClient.get<{ data: Achievement[] }>('/gamification/achievements');
    return data;
  },

  async getLevels(): Promise<{ data: Level[] }> {
    const { data } = await apiClient.get<{ data: Level[] }>('/gamification/levels');
    return data;
  },

  async getStreaks(): Promise<{ data: Streak }> {
    const { data } = await apiClient.get<{ data: Streak }>('/gamification/streaks');
    return data;
  },
};

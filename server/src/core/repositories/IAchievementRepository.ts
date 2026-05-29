import { Achievement } from '../entities/Achievement.js';

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  unlockedAt: Date;
  isDisplayed: boolean;
  achievement?: Achievement;
}

export interface IAchievementRepository {
  findAll(): Promise<Achievement[]>;
  findById(id: string): Promise<Achievement | null>;
  findByKey(key: string): Promise<Achievement | null>;
  findByUser(userId: string): Promise<UserAchievement[]>;
  unlock(userId: string, achievementId: string): Promise<UserAchievement>;
  save(achievement: Achievement): Promise<Achievement>;
}

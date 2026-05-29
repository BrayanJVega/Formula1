import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { GetGamificationProfileUseCase } from '../../core/useCases/gamification/GetGamificationProfileUseCase.js';
import { AchievementRepository } from '../../infrastructure/persistence/repositories/AchievementRepository.js';
import { query } from '../../config/database.js';

export class GamificationController {
  constructor(
    private readonly getGamificationProfileUseCase: GetGamificationProfileUseCase,
    private readonly achievementRepository: AchievementRepository,
  ) {}

  async getProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const profile = await this.getGamificationProfileUseCase.execute(req.user!.userId);
      res.json({ data: profile });
    } catch (error) {
      next(error);
    }
  }

  async getAchievements(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const [allAchievements, userAchievements] = await Promise.all([
        this.achievementRepository.findAll(),
        this.achievementRepository.findByUser(req.user!.userId),
      ]);

      const unlockedIds = new Set(userAchievements.map((ua) => ua.achievementId));

      const achievementsWithStatus = allAchievements.map((achievement) => ({
        ...achievement,
        isUnlocked: unlockedIds.has(achievement.id),
        unlockedAt: userAchievements.find((ua) => ua.achievementId === achievement.id)?.unlockedAt ?? null,
      }));

      res.json({ data: achievementsWithStatus });
    } catch (error) {
      next(error);
    }
  }

  async getLevels(_req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const rows = await query<Record<string, unknown>>(
        'SELECT * FROM levels ORDER BY level_number ASC',
      );
      const levels = rows.map((row) => ({
        id: row.id,
        name: row.name,
        levelNumber: row.level_number,
        minPoints: parseFloat(row.min_points as string),
        badgeUrl: row.badge_url,
        rewards: row.rewards ? (typeof row.rewards === 'string' ? JSON.parse(row.rewards as string) : row.rewards) : null,
      }));
      res.json({ data: levels });
    } catch (error) {
      next(error);
    }
  }

  async getStreaks(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const streaks = await this.getGamificationProfileUseCase.execute(req.user!.userId);
      res.json({ data: streaks.streaks });
    } catch (error) {
      next(error);
    }
  }
}

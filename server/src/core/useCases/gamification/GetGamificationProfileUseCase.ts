import { Achievement, AchievementCategory } from '../../entities/Achievement.js';
import { UserAchievement } from '../../repositories/IAchievementRepository.js';
import { query, queryOne } from '../../../config/database.js';
import { LevelService, UserLevelInfo } from '../../services/LevelService.js';

export interface StreakInfo {
  currentStreak: number;
  bestStreak: number;
  lastPredictionDate: Date | null;
}

export interface GamificationProfile {
  level: UserLevelInfo;
  achievements: UserAchievement[];
  streaks: StreakInfo;
  totalAchievements: number;
  unlockedAchievements: number;
  recentActivity: GamificationActivity[];
}

export interface GamificationActivity {
  type: 'achievement' | 'level_up' | 'streak' | 'xp';
  description: string;
  points?: number;
  createdAt: Date;
}

export class GetGamificationProfileUseCase {
  constructor(
    private readonly levelService: LevelService,
  ) {}

  async execute(userId: string): Promise<GamificationProfile> {
    const [level, userAchievements, streaks] = await Promise.all([
      this.levelService.getCurrentLevel(userId),
      this.getUserAchievements(userId),
      this.getStreaks(userId),
    ]);

    const totalAchievements = await this.getTotalAchievementsCount();

    const recentActivity = await this.getRecentActivity(userId);

    return {
      level,
      achievements: userAchievements,
      streaks,
      totalAchievements,
      unlockedAchievements: userAchievements.length,
      recentActivity,
    };
  }

  private async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    const rows = await query<Record<string, unknown>>(
      `SELECT ua.id, ua.user_id, ua.achievement_id, ua.unlocked_at, ua.is_displayed,
              a.id AS a_id, a.key AS a_key, a.name AS a_name, a.description AS a_description,
              a.icon_url AS a_icon_url, a.category AS a_category, a.points_reward AS a_points_reward,
              a.criteria AS a_criteria, a.created_at AS a_created_at
       FROM user_achievements ua
       JOIN achievements a ON a.id = ua.achievement_id
       WHERE ua.user_id = $1
       ORDER BY ua.unlocked_at DESC`,
      [userId],
    );

    return rows.map((row) => ({
      id: row.id as string,
      userId: row.user_id as string,
      achievementId: row.achievement_id as string,
      unlockedAt: new Date(row.unlocked_at as string),
      isDisplayed: row.is_displayed as boolean,
      achievement: {
        id: row.a_id as string,
        key: row.a_key as string,
        name: row.a_name as string,
        description: row.a_description as string,
        iconUrl: row.a_icon_url as string | undefined,
        category: row.a_category as AchievementCategory,
        pointsReward: parseInt(row.a_points_reward as string, 10) || 0,
        criteria: typeof row.a_criteria === 'string' ? JSON.parse(row.a_criteria as string) : (row.a_criteria as Record<string, unknown>),
        createdAt: new Date(row.a_created_at as string),
      } as Achievement,
    }));
  }

  private async getStreaks(userId: string): Promise<StreakInfo> {
    const row = await queryOne<Record<string, unknown>>(
      'SELECT * FROM user_streaks WHERE user_id = $1',
      [userId],
    );

    if (!row) {
      return { currentStreak: 0, bestStreak: 0, lastPredictionDate: null };
    }

    return {
      currentStreak: row.current_streak as number,
      bestStreak: row.best_streak as number,
      lastPredictionDate: row.last_prediction_date ? new Date(row.last_prediction_date as string) : null,
    };
  }

  private async getTotalAchievementsCount(): Promise<number> {
    const row = await queryOne<{ count: string }>(
      'SELECT COUNT(*) as count FROM achievements',
    );
    return row ? parseInt(row.count, 10) : 0;
  }

  private async getRecentActivity(userId: string): Promise<GamificationActivity[]> {
    const rows = await query<Record<string, unknown>>(
      `(SELECT 'achievement' as type, a.name as description, a.points_reward::text as points, ua.unlocked_at as created_at
        FROM user_achievements ua JOIN achievements a ON a.id = ua.achievement_id
        WHERE ua.user_id = $1)
       UNION ALL
       (SELECT 'xp' as type, xt.reason as description, xt.amount::text as points, xt.created_at
        FROM xp_transactions xt
        WHERE xt.user_id = $1)
       ORDER BY created_at DESC
       LIMIT 20`,
      [userId],
    );

    return rows.map((r) => ({
      type: r.type as GamificationActivity['type'],
      description: r.description as string,
      points: r.points ? parseFloat(r.points as string) : undefined,
      createdAt: new Date(r.created_at as string),
    }));
  }
}

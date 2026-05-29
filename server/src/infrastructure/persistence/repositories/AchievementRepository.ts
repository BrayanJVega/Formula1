import { Achievement } from '../../../core/entities/Achievement.js';
import { IAchievementRepository, UserAchievement } from '../../../core/repositories/IAchievementRepository.js';
import { query, queryOne } from '../../../config/database.js';

export class AchievementRepository implements IAchievementRepository {
  async findAll(): Promise<Achievement[]> {
    const rows = await query<Record<string, unknown>>(
      'SELECT * FROM achievements ORDER BY category, points_reward ASC',
    );
    return rows.map((row) => this.mapToAchievement(row));
  }

  async findById(id: string): Promise<Achievement | null> {
    const row = await queryOne<Record<string, unknown>>(
      'SELECT * FROM achievements WHERE id = $1',
      [id],
    );
    return row ? this.mapToAchievement(row) : null;
  }

  async findByKey(key: string): Promise<Achievement | null> {
    const row = await queryOne<Record<string, unknown>>(
      'SELECT * FROM achievements WHERE key = $1',
      [key],
    );
    return row ? this.mapToAchievement(row) : null;
  }

  async findByUser(userId: string): Promise<UserAchievement[]> {
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
    return rows.map((row) => this.mapToUserAchievement(row));
  }

  async unlock(userId: string, achievementId: string): Promise<UserAchievement> {
    const row = await queryOne<Record<string, unknown>>(
      `INSERT INTO user_achievements (user_id, achievement_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, achievement_id) DO NOTHING
       RETURNING *`,
      [userId, achievementId],
    );
    if (!row) {
      const existing = await queryOne<Record<string, unknown>>(
        'SELECT * FROM user_achievements WHERE user_id = $1 AND achievement_id = $2',
        [userId, achievementId],
      );
      return this.mapToUserAchievement({ ...existing, achievement: null });
    }
    return this.mapToUserAchievement({ ...row, achievement: null });
  }

  async save(achievement: Achievement): Promise<Achievement> {
    const row = await queryOne<Record<string, unknown>>(
      `INSERT INTO achievements (id, key, name, description, icon_url, category, points_reward, criteria, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (key) DO UPDATE SET
         name = EXCLUDED.name,
         description = EXCLUDED.description,
         icon_url = EXCLUDED.icon_url,
         category = EXCLUDED.category,
         points_reward = EXCLUDED.points_reward,
         criteria = EXCLUDED.criteria
       RETURNING *`,
      [
        achievement.id,
        achievement.key,
        achievement.name,
        achievement.description,
        achievement.iconUrl ?? null,
        achievement.category,
        achievement.pointsReward,
        JSON.stringify(achievement.criteria),
        achievement.createdAt,
      ],
    );
    return row ? this.mapToAchievement(row) : achievement;
  }

  private mapToAchievement(row: Record<string, unknown>): Achievement {
    return new Achievement({
      id: row.id as string,
      key: row.key as string,
      name: row.name as string,
      description: row.description as string,
      iconUrl: row.icon_url as string | undefined,
      category: row.category as Achievement['category'],
      pointsReward: parseInt(row.points_reward as string, 10) || 0,
      criteria: typeof row.criteria === 'string' ? JSON.parse(row.criteria as string) : (row.criteria as Record<string, unknown>),
      createdAt: new Date(row.created_at as string),
    });
  }

  private mapToUserAchievement(row: Record<string, unknown>): UserAchievement {
    const ua: UserAchievement = {
      id: row.id as string,
      userId: row.user_id as string,
      achievementId: row.achievement_id as string,
      unlockedAt: new Date(row.unlocked_at as string),
      isDisplayed: row.is_displayed as boolean,
    };
    if (row.a_id) {
      ua.achievement = new Achievement({
        id: row.a_id as string,
        key: row.a_key as string,
        name: row.a_name as string,
        description: row.a_description as string,
        iconUrl: row.a_icon_url as string | undefined,
        category: row.a_category as Achievement['category'],
        pointsReward: parseInt(row.a_points_reward as string, 10) || 0,
        criteria: typeof row.a_criteria === 'string' ? JSON.parse(row.a_criteria as string) : (row.a_criteria as Record<string, unknown>),
        createdAt: new Date(row.a_created_at as string),
      });
    }
    return ua;
  }
}

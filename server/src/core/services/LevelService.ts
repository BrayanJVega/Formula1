import { query, queryOne } from '../../config/database.js';

export interface LevelInfo {
  id: string;
  name: string;
  levelNumber: number;
  minPoints: number;
  badgeUrl?: string;
  rewards?: Record<string, unknown>;
}

export interface UserLevelInfo {
  level: LevelInfo;
  currentXp: number;
  progress: number;
  xpToNextLevel: number;
  xpForCurrentLevel: number;
}

export interface LevelUpInfo {
  leveledUp: boolean;
  previousLevel: LevelInfo | null;
  currentLevel: LevelInfo;
  xpAwarded: number;
  reason: string;
}

export class LevelService {
  async getCurrentLevel(userId: string): Promise<UserLevelInfo> {
    const levels = await this.getAllLevels();
    const userXp = await this.getUserXp(userId);

    let currentLevel = levels[0];
    for (let i = levels.length - 1; i >= 0; i--) {
      if (userXp >= levels[i].minPoints) {
        currentLevel = levels[i];
        break;
      }
    }

    const progress = this.getLevelProgress(userXp, currentLevel.levelNumber);
    const nextLevel = levels.find((l) => l.levelNumber === currentLevel.levelNumber + 1);

    const xpForCurrentLevel = currentLevel.minPoints;

    return {
      level: currentLevel,
      currentXp: userXp,
      progress: progress,
      xpToNextLevel: nextLevel ? nextLevel.minPoints - userXp : 0,
      xpForCurrentLevel,
    };
  }

  calculateLevel(xp: number): { levelNumber: number; name: string } {
    const levelMap: { min: number; number: number; name: string }[] = [
      { min: 0, number: 1, name: 'Rookie' },
      { min: 50, number: 2, name: 'Rookie II' },
      { min: 100, number: 3, name: 'Rookie III' },
      { min: 200, number: 4, name: 'Amateur' },
      { min: 350, number: 5, name: 'Amateur II' },
      { min: 500, number: 6, name: 'Amateur III' },
      { min: 750, number: 7, name: 'Professional' },
      { min: 1000, number: 8, name: 'Professional II' },
      { min: 1500, number: 9, name: 'Professional III' },
      { min: 2000, number: 10, name: 'Elite' },
      { min: 3000, number: 11, name: 'Elite II' },
      { min: 4500, number: 12, name: 'Elite III' },
      { min: 6000, number: 13, name: 'Legend' },
    ];

    for (let i = levelMap.length - 1; i >= 0; i--) {
      if (xp >= levelMap[i].min) {
        return { levelNumber: levelMap[i].number, name: levelMap[i].name };
      }
    }
    return { levelNumber: 1, name: 'Rookie' };
  }

  async addXp(userId: string, amount: number, reason: string): Promise<LevelUpInfo> {
    const levels = await this.getAllLevels();
    const currentXp = await this.getUserXp(userId);
    const currentLevel = this.getLevelFromXp(currentXp, levels);
    const newXp = currentXp + amount;
    const newLevel = this.getLevelFromXp(newXp, levels);

    await query(
      `INSERT INTO user_levels (user_id, level_id, current_xp)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, level_id)
       DO UPDATE SET current_xp = $3`,
      [userId, newLevel.id, newXp],
    );

    const leveledUp = newLevel.levelNumber > currentLevel.levelNumber;

    return {
      leveledUp,
      previousLevel: leveledUp ? currentLevel : null,
      currentLevel: newLevel,
      xpAwarded: amount,
      reason,
    };
  }

  getLevelProgress(currentXp: number, currentLevelNumber: number): number {
    const levelMap: { number: number; min: number; max: number }[] = [
      { number: 1, min: 0, max: 50 },
      { number: 2, min: 50, max: 100 },
      { number: 3, min: 100, max: 200 },
      { number: 4, min: 200, max: 350 },
      { number: 5, min: 350, max: 500 },
      { number: 6, min: 500, max: 750 },
      { number: 7, min: 750, max: 1000 },
      { number: 8, min: 1000, max: 1500 },
      { number: 9, min: 1500, max: 2000 },
      { number: 10, min: 2000, max: 3000 },
      { number: 11, min: 3000, max: 4500 },
      { number: 12, min: 4500, max: 6000 },
      { number: 13, min: 6000, max: Infinity },
    ];

    const level = levelMap.find((l) => l.number === currentLevelNumber);
    if (!level || level.max === Infinity) return 100;

    const range = level.max - level.min;
    if (range <= 0) return 100;
    const progress = ((currentXp - level.min) / range) * 100;
    return Math.min(Math.round(progress), 100);
  }

  async getRecentXpTransactions(userId: string, limit = 10): Promise<{ amount: number; reason: string; createdAt: Date }[]> {
    const rows = await query<Record<string, unknown>>(
      `SELECT amount, reason, created_at FROM xp_transactions
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT $2`,
      [userId, limit],
    );
    return rows.map((r) => ({
      amount: parseFloat(r.amount as string),
      reason: r.reason as string,
      createdAt: new Date(r.created_at as string),
    }));
  }

  private async getAllLevels(): Promise<LevelInfo[]> {
    const rows = await query<Record<string, unknown>>(
      'SELECT * FROM levels ORDER BY level_number ASC',
    );
    return rows.map((row) => ({
      id: row.id as string,
      name: row.name as string,
      levelNumber: row.level_number as number,
      minPoints: parseFloat(row.min_points as string),
      badgeUrl: row.badge_url as string | undefined,
      rewards: row.rewards ? (typeof row.rewards === 'string' ? JSON.parse(row.rewards as string) : row.rewards as Record<string, unknown>) : undefined,
    }));
  }

  private async getUserXp(userId: string): Promise<number> {
    const row = await queryOne<{ total_xp: string }>(
      `SELECT COALESCE(SUM(current_xp), 0) as total_xp FROM user_levels WHERE user_id = $1`,
      [userId],
    );
    if (row) return parseFloat(row.total_xp);
    return 0;
  }

  private getLevelFromXp(xp: number, levels: LevelInfo[]): LevelInfo {
    for (let i = levels.length - 1; i >= 0; i--) {
      if (xp >= levels[i].minPoints) {
        return levels[i];
      }
    }
    return levels[0];
  }
}

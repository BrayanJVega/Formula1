import { query, queryOne } from '../../../config/database.js';

export interface UpdateStreakInput {
  userId: string;
  isCorrect: boolean;
}

export interface StreakResult {
  currentStreak: number;
  bestStreak: number;
  updated: boolean;
}

export class UpdateStreakUseCase {
  async execute(input: UpdateStreakInput): Promise<StreakResult> {
    const existing = await queryOne<Record<string, unknown>>(
      'SELECT * FROM user_streaks WHERE user_id = $1',
      [input.userId],
    );

    let currentStreak: number;
    let bestStreak: number;

    if (input.isCorrect) {
      currentStreak = existing ? (existing.current_streak as number) + 1 : 1;
      bestStreak = existing
        ? Math.max(existing.best_streak as number, currentStreak)
        : currentStreak;
    } else {
      currentStreak = 0;
      bestStreak = existing ? (existing.best_streak as number) : 0;
    }

    await query(
      `INSERT INTO user_streaks (user_id, current_streak, best_streak, last_prediction_date, updated_at)
       VALUES ($1, $2, $3, NOW(), NOW())
       ON CONFLICT (user_id)
       DO UPDATE SET
         current_streak = EXCLUDED.current_streak,
         best_streak = EXCLUDED.best_streak,
         last_prediction_date = NOW(),
         updated_at = NOW()`,
      [input.userId, currentStreak, bestStreak],
    );

    return {
      currentStreak,
      bestStreak,
      updated: true,
    };
  }
}

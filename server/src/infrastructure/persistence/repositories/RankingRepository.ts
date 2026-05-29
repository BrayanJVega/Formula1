import { IRankingRepository, RankingEntry } from '../../../core/repositories/IRankingRepository.js';
import { query, queryOne } from '../../../config/database.js';

export class RankingRepository implements IRankingRepository {
  async getGlobalRanking(
    seasonId: string,
    options?: { page?: number; limit?: number },
  ): Promise<{ rankings: RankingEntry[]; total: number }> {
    const page = options?.page ?? 1;
    const limit = options?.limit ?? 50;
    const offset = (page - 1) * limit;

    const countResult = await queryOne<{ count: string }>(
      'SELECT COUNT(*) as count FROM rankings WHERE season_id = $1 AND global_position IS NOT NULL',
      [seasonId],
    );
    const total = countResult ? parseInt(countResult.count, 10) : 0;

    const rows = await query<Record<string, unknown>>(
      `SELECT r.global_position, r.global_score, r.country_code,
              u.id as user_id, u.username, u.country
       FROM rankings r
       JOIN users u ON u.id = r.user_id
       WHERE r.season_id = $1 AND r.global_position IS NOT NULL
       ORDER BY r.global_position ASC
       LIMIT $2 OFFSET $3`,
      [seasonId, limit, offset],
    );

    const rankings: RankingEntry[] = rows.map((row) => ({
      userId: row.user_id as string,
      username: row.username as string,
      score: parseFloat(row.global_score as string) || 0,
      position: (row.global_position as number) ?? 0,
      country: (row.country as string) || undefined,
      change: row.change ? (row.change as number) : undefined,
    }));

    return { rankings, total };
  }

  async getWeeklyRanking(options?: { page?: number; limit?: number }): Promise<{ rankings: RankingEntry[]; total: number }> {
    const page = options?.page ?? 1;
    const limit = options?.limit ?? 50;
    const offset = (page - 1) * limit;

    const countResult = await queryOne<{ count: string }>(
      'SELECT COUNT(*) as count FROM rankings WHERE weekly_position IS NOT NULL',
    );
    const total = countResult ? parseInt(countResult.count, 10) : 0;

    const rows = await query<Record<string, unknown>>(
      `SELECT r.weekly_position, r.weekly_score, r.country_code,
              u.id as user_id, u.username, u.country
       FROM rankings r
       JOIN users u ON u.id = r.user_id
       WHERE r.weekly_position IS NOT NULL
       ORDER BY r.weekly_score DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset],
    );

    const rankings: RankingEntry[] = rows.map((row) => ({
      userId: row.user_id as string,
      username: row.username as string,
      score: parseFloat(row.weekly_score as string) || 0,
      position: (row.weekly_position as number) ?? 0,
      country: (row.country as string) || undefined,
      change: row.change ? (row.change as number) : undefined,
    }));

    return { rankings, total };
  }

  async getCountryRanking(countryCode: string, seasonId: string): Promise<RankingEntry[]> {
    const rows = await query<Record<string, unknown>>(
      `SELECT r.country_position, r.global_score, r.country_code,
              u.id as user_id, u.username, u.country
       FROM rankings r
       JOIN users u ON u.id = r.user_id
       WHERE r.country_code = $1 AND r.season_id = $2
       ORDER BY r.country_position ASC`,
      [countryCode, seasonId],
    );

    return rows.map((row) => ({
      userId: row.user_id as string,
      username: row.username as string,
      score: parseFloat(row.global_score as string) || 0,
      position: (row.country_position as number) ?? 0,
      country: (row.country as string) || undefined,
    }));
  }

  async getLeagueRanking(leagueId: string): Promise<RankingEntry[]> {
    const rows = await query<Record<string, unknown>>(
      `SELECT lm.total_score, u.id as user_id, u.username, u.country,
              ROW_NUMBER() OVER (ORDER BY lm.total_score DESC) as position
       FROM league_members lm
       JOIN users u ON u.id = lm.user_id
       WHERE lm.league_id = $1
       ORDER BY lm.total_score DESC`,
      [leagueId],
    );

    return rows.map((row) => ({
      userId: row.user_id as string,
      username: row.username as string,
      score: parseFloat(row.total_score as string) || 0,
      position: (row.position as number) ?? 0,
      country: (row.country as string) || undefined,
    }));
  }

  async getUserPosition(userId: string, seasonId: string): Promise<RankingEntry | null> {
    const row = await queryOne<Record<string, unknown>>(
      `SELECT r.global_position, r.global_score, r.country_code, r.country_position,
              u.id as user_id, u.username, u.country
       FROM rankings r
       JOIN users u ON u.id = r.user_id
       WHERE r.user_id = $1 AND r.season_id = $2`,
      [userId, seasonId],
    );

    if (!row) return null;

    return {
      userId: row.user_id as string,
      username: row.username as string,
      score: parseFloat(row.global_score as string) || 0,
      position: (row.global_position as number) ?? 0,
      country: (row.country as string) || undefined,
      change: row.country_position ? (row.country_position as number) : undefined,
    };
  }
}

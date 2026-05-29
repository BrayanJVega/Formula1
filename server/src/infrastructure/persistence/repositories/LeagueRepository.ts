import { ILeagueRepository, LeagueMember } from '../../../core/repositories/ILeagueRepository.js';
import { League } from '../../../core/entities/League.js';
import { query, queryOne } from '../../../config/database.js';

interface MemberRow {
  id: string;
  league_id: string;
  user_id: string;
  role: string;
  joined_at: string;
  total_score: string;
  username: string;
  email: string;
  country?: string;
  avatar_url?: string;
}

export class LeagueRepository implements ILeagueRepository {
  async findById(id: string): Promise<League | null> {
    const row = await queryOne<Record<string, unknown>>(
      'SELECT * FROM leagues WHERE id = $1',
      [id],
    );
    return row ? this.mapToLeague(row) : null;
  }

  async findByCode(code: string): Promise<League | null> {
    const row = await queryOne<Record<string, unknown>>(
      'SELECT * FROM leagues WHERE code = $1',
      [code],
    );
    return row ? this.mapToLeague(row) : null;
  }

  async findByOwner(ownerId: string): Promise<League[]> {
    const rows = await query<Record<string, unknown>>(
      'SELECT * FROM leagues WHERE owner_id = $1 ORDER BY created_at DESC',
      [ownerId],
    );
    return rows.map((row) => this.mapToLeague(row));
  }

  async findByMember(userId: string): Promise<League[]> {
    const rows = await query<Record<string, unknown>>(
      `SELECT l.* FROM leagues l
       JOIN league_members lm ON lm.league_id = l.id
       WHERE lm.user_id = $1
       ORDER BY l.created_at DESC`,
      [userId],
    );
    return rows.map((row) => this.mapToLeague(row));
  }

  async save(league: League): Promise<League> {
    const row = await queryOne<Record<string, unknown>>(
      `INSERT INTO leagues (id, name, description, code, owner_id, max_members, is_private, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        league.id,
        league.name,
        league.description ?? null,
        league.code,
        league.ownerId,
        league.maxMembers,
        league.isPrivate,
        league.createdAt,
        league.updatedAt,
      ],
    );
    return row ? this.mapToLeague(row) : league;
  }

  async update(league: League): Promise<League> {
    const row = await queryOne<Record<string, unknown>>(
      `UPDATE leagues SET
        name = $1, description = $2, code = $3, max_members = $4,
        is_private = $5, updated_at = NOW()
       WHERE id = $6
       RETURNING *`,
      [
        league.name,
        league.description ?? null,
        league.code,
        league.maxMembers,
        league.isPrivate,
        league.id,
      ],
    );
    return row ? this.mapToLeague(row) : league;
  }

  async delete(id: string): Promise<void> {
    await query('DELETE FROM leagues WHERE id = $1', [id]);
  }

  async addMember(leagueId: string, userId: string, role: string = 'member'): Promise<void> {
    await query(
      `INSERT INTO league_members (league_id, user_id, role)
       VALUES ($1, $2, $3)
       ON CONFLICT (league_id, user_id) DO NOTHING`,
      [leagueId, userId, role],
    );
  }

  async removeMember(leagueId: string, userId: string): Promise<void> {
    await query(
      'DELETE FROM league_members WHERE league_id = $1 AND user_id = $2',
      [leagueId, userId],
    );
  }

  async getMembers(leagueId: string): Promise<LeagueMember[]> {
    const rows = await query<MemberRow>(
      `SELECT lm.*, u.username, u.email, u.country, u.avatar_url
       FROM league_members lm
       JOIN users u ON u.id = lm.user_id
       WHERE lm.league_id = $1
       ORDER BY lm.total_score DESC`,
      [leagueId],
    );
    return rows.map((row) => this.mapToLeagueMember(row));
  }

  async getMemberCount(leagueId: string): Promise<number> {
    const result = await queryOne<{ count: string }>(
      'SELECT COUNT(*) as count FROM league_members WHERE league_id = $1',
      [leagueId],
    );
    return result ? parseInt(result.count, 10) : 0;
  }

  async findMember(leagueId: string, userId: string): Promise<LeagueMember | null> {
    const row = await queryOne<MemberRow>(
      `SELECT lm.*, u.username, u.email, u.country, u.avatar_url
       FROM league_members lm
       JOIN users u ON u.id = lm.user_id
       WHERE lm.league_id = $1 AND lm.user_id = $2`,
      [leagueId, userId],
    );
    return row ? this.mapToLeagueMember(row) : null;
  }

  async updateMemberScore(leagueId: string, userId: string, totalScore: number): Promise<void> {
    await query(
      'UPDATE league_members SET total_score = $1 WHERE league_id = $2 AND user_id = $3',
      [totalScore, leagueId, userId],
    );
  }

  async generateCode(): Promise<string> {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  private mapToLeague(row: Record<string, unknown>): League {
    return new League({
      id: row.id as string,
      name: row.name as string,
      description: row.description as string | undefined,
      code: row.code as string,
      ownerId: row.owner_id as string,
      maxMembers: row.max_members as number | undefined,
      isPrivate: row.is_private as boolean | undefined,
      createdAt: new Date(row.created_at as string),
      updatedAt: new Date(row.updated_at as string),
    });
  }

  private mapToLeagueMember(row: MemberRow): LeagueMember {
    return {
      id: row.id,
      userId: row.user_id,
      leagueId: row.league_id,
      role: row.role as 'owner' | 'admin' | 'member',
      joinedAt: new Date(row.joined_at),
      totalScore: parseFloat(row.total_score) || 0,
      username: row.username,
      email: row.email,
      country: row.country,
      avatarUrl: row.avatar_url,
    };
  }
}

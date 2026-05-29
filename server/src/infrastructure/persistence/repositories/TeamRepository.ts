import { ITeamRepository } from '../../../core/repositories/ITeamRepository.js';
import { Team } from '../../../core/entities/Team.js';
import { query, queryOne } from '../../../config/database.js';

export class TeamRepository implements ITeamRepository {
  async findById(id: string): Promise<Team | null> {
    const row = await queryOne<Record<string, unknown>>(
      'SELECT * FROM teams WHERE id = $1',
      [id],
    );
    return row ? this.mapToTeam(row) : null;
  }

  async findAll(options?: { isActive?: boolean }): Promise<Team[]> {
    if (options?.isActive !== undefined) {
      const rows = await query<Record<string, unknown>>(
        'SELECT * FROM teams WHERE is_active = $1 ORDER BY name ASC',
        [options.isActive],
      );
      return rows.map(this.mapToTeam);
    }
    const rows = await query<Record<string, unknown>>(
      'SELECT * FROM teams ORDER BY name ASC',
    );
    return rows.map(this.mapToTeam);
  }

  async save(team: Team): Promise<Team> {
    await query(
      `INSERT INTO teams (id, name, full_name, nationality, base, team_principal, chassis, power_unit, logo_url, photo_url, biography, is_active, founded_year, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
      [
        team.id, team.name, team.fullName, team.nationality, team.base,
        team.teamPrincipal, team.chassis, team.powerUnit, team.logoUrl,
        team.photoUrl, team.biography, team.isActive, team.foundedYear,
        team.createdAt, team.updatedAt,
      ],
    );
    return team;
  }

  async update(team: Team): Promise<Team> {
    await query(
      `UPDATE teams SET name = $1, full_name = $2, nationality = $3, base = $4,
        team_principal = $5, chassis = $6, power_unit = $7, logo_url = $8,
        photo_url = $9, biography = $10, is_active = $11, founded_year = $12,
        updated_at = $13
       WHERE id = $14`,
      [
        team.name, team.fullName, team.nationality, team.base,
        team.teamPrincipal, team.chassis, team.powerUnit, team.logoUrl,
        team.photoUrl, team.biography, team.isActive, team.foundedYear,
        team.updatedAt, team.id,
      ],
    );
    return team;
  }

  async delete(id: string): Promise<void> {
    await query('DELETE FROM teams WHERE id = $1', [id]);
  }

  private mapToTeam(row: Record<string, unknown>): Team {
    return new Team({
      id: row.id as string,
      name: row.name as string,
      fullName: row.full_name as string,
      nationality: row.nationality as string,
      base: row.base as string,
      teamPrincipal: row.team_principal as string,
      chassis: row.chassis as string,
      powerUnit: row.power_unit as string,
      logoUrl: row.logo_url as string | undefined,
      photoUrl: row.photo_url as string | undefined,
      biography: row.biography as string | undefined,
      isActive: row.is_active as boolean,
      foundedYear: row.founded_year as number,
      createdAt: new Date(row.created_at as string),
      updatedAt: new Date(row.updated_at as string),
    });
  }
}

import { IFantasyRepository } from '../../../core/repositories/IFantasyRepository.js';
import { FantasyTeam } from '../../../core/entities/FantasyTeam.js';
import { query, queryOne } from '../../../config/database.js';

export interface FantasyPick {
  id: string;
  fantasyTeamId: string;
  driverId: string | null;
  teamId: string | null;
  type: 'driver' | 'constructor';
  cost: number;
  isActive: boolean;
  pickedAt: Date;
  transferredAt: Date | null;
}

export interface FantasyTransfer {
  id: string;
  fantasyTeamId: string;
  driverOutId: string | null;
  driverInId: string | null;
  cost: number;
  transferAt: Date;
  raceId: string | null;
}

export interface DriverMarketValue {
  id: string;
  driverId: string;
  seasonId: string;
  currentValue: number;
  priceChange: number;
  lastUpdated: Date;
}

export class FantasyRepository implements IFantasyRepository {
  async findById(id: string): Promise<FantasyTeam | null> {
    const row = await queryOne<Record<string, unknown>>(
      'SELECT * FROM fantasy_teams WHERE id = $1',
      [id],
    );
    return row ? this.mapToFantasyTeam(row) : null;
  }

  async findByUserAndSeason(userId: string, seasonId: string): Promise<FantasyTeam | null> {
    const row = await queryOne<Record<string, unknown>>(
      'SELECT * FROM fantasy_teams WHERE user_id = $1 AND season_id = $2',
      [userId, seasonId],
    );
    return row ? this.mapToFantasyTeam(row) : null;
  }

  async save(team: FantasyTeam): Promise<FantasyTeam> {
    const row = await queryOne<Record<string, unknown>>(
      `INSERT INTO fantasy_teams (id, user_id, season_id, name, budget, total_score, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [team.id, team.userId, team.seasonId, team.name, team.budget, team.totalScore, team.createdAt, team.updatedAt],
    );
    return this.mapToFantasyTeam(row!);
  }

  async update(team: FantasyTeam): Promise<FantasyTeam> {
    const row = await queryOne<Record<string, unknown>>(
      `UPDATE fantasy_teams SET name = $1, budget = $2, total_score = $3, updated_at = $4
       WHERE id = $5
       RETURNING *`,
      [team.name, team.budget, team.totalScore, new Date(), team.id],
    );
    return this.mapToFantasyTeam(row!);
  }

  async delete(id: string): Promise<void> {
    await query('DELETE FROM fantasy_teams WHERE id = $1', [id]);
  }

  async getPicks(fantasyTeamId: string): Promise<FantasyPick[]> {
    const rows = await query<Record<string, unknown>>(
      'SELECT * FROM fantasy_picks WHERE fantasy_team_id = $1 ORDER BY picked_at ASC',
      [fantasyTeamId],
    );
    return rows.map(this.mapToFantasyPick);
  }

  async addPick(fantasyTeamId: string, pick: Omit<FantasyPick, 'id' | 'pickedAt' | 'transferredAt' | 'isActive'>): Promise<FantasyPick> {
    const row = await queryOne<Record<string, unknown>>(
      `INSERT INTO fantasy_picks (fantasy_team_id, driver_id, team_id, type, cost)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [fantasyTeamId, pick.driverId, pick.teamId, pick.type, pick.cost],
    );
    return this.mapToFantasyPick(row!);
  }

  async removePick(pickId: string): Promise<void> {
    await query('DELETE FROM fantasy_picks WHERE id = $1', [pickId]);
  }

  async getActivePicks(fantasyTeamId: string): Promise<FantasyPick[]> {
    const rows = await query<Record<string, unknown>>(
      'SELECT * FROM fantasy_picks WHERE fantasy_team_id = $1 AND is_active = true ORDER BY picked_at ASC',
      [fantasyTeamId],
    );
    return rows.map(this.mapToFantasyPick);
  }

  async deactivatePick(pickId: string): Promise<void> {
    await query(
      'UPDATE fantasy_picks SET is_active = false, transferred_at = NOW() WHERE id = $1',
      [pickId],
    );
  }

  async getTransfers(fantasyTeamId: string): Promise<FantasyTransfer[]> {
    const rows = await query<Record<string, unknown>>(
      'SELECT * FROM fantasy_transfers WHERE fantasy_team_id = $1 ORDER BY transfer_at DESC',
      [fantasyTeamId],
    );
    return rows.map(this.mapToFantasyTransfer);
  }

  async createTransfer(transfer: Omit<FantasyTransfer, 'id' | 'transferAt'>): Promise<FantasyTransfer> {
    const row = await queryOne<Record<string, unknown>>(
      `INSERT INTO fantasy_transfers (fantasy_team_id, driver_out_id, driver_in_id, cost, race_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [transfer.fantasyTeamId, transfer.driverOutId, transfer.driverInId, transfer.cost, transfer.raceId],
    );
    return this.mapToFantasyTransfer(row!);
  }

  async getAllTeamsBySeason(seasonId: string): Promise<FantasyTeam[]> {
    const rows = await query<Record<string, unknown>>(
      'SELECT * FROM fantasy_teams WHERE season_id = $1 ORDER BY total_score DESC',
      [seasonId],
    );
    return rows.map(this.mapToFantasyTeam);
  }

  async getDriverMarketValue(driverId: string, seasonId: string): Promise<DriverMarketValue | null> {
    const row = await queryOne<Record<string, unknown>>(
      'SELECT * FROM driver_market_values WHERE driver_id = $1 AND season_id = $2',
      [driverId, seasonId],
    );
    return row ? this.mapToDriverMarketValue(row) : null;
  }

  async getAllDriverMarketValues(seasonId: string): Promise<DriverMarketValue[]> {
    const rows = await query<Record<string, unknown>>(
      `SELECT dmv.*, d.name as driver_name, d.number as driver_number, t.name as team_name
       FROM driver_market_values dmv
       JOIN drivers d ON d.id = dmv.driver_id
       JOIN teams t ON t.id = d.team_id
       WHERE dmv.season_id = $1
       ORDER BY dmv.current_value DESC`,
      [seasonId],
    );
    return rows.map((r) => ({
      ...this.mapToDriverMarketValue(r),
      driverName: r.driver_name as string,
      driverNumber: r.driver_number as number,
      teamName: r.team_name as string,
    }));
  }

  async upsertDriverMarketValue(driverId: string, seasonId: string, currentValue: number, priceChange: number): Promise<DriverMarketValue> {
    const row = await queryOne<Record<string, unknown>>(
      `INSERT INTO driver_market_values (driver_id, season_id, current_value, price_change)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (driver_id, season_id)
       DO UPDATE SET current_value = $3, price_change = $4, last_updated = NOW()
       RETURNING *`,
      [driverId, seasonId, currentValue, priceChange],
    );
    return this.mapToDriverMarketValue(row!);
  }

  async getPickById(pickId: string): Promise<FantasyPick | null> {
    const row = await queryOne<Record<string, unknown>>(
      'SELECT * FROM fantasy_picks WHERE id = $1',
      [pickId],
    );
    return row ? this.mapToFantasyPick(row) : null;
  }

  async getDriverTotalScore(driverId: string, seasonId: string): Promise<number> {
    const row = await queryOne<{ total: string }>(
      `SELECT COALESCE(SUM(rr.points), 0) as total
       FROM race_results rr
       JOIN races r ON r.id = rr.race_id
       WHERE rr.driver_id = $1 AND r.season_id = $2`,
      [driverId, seasonId],
    );
    return parseFloat(row?.total ?? '0');
  }

  async updateTeamScore(teamId: string): Promise<void> {
    await query(
      `UPDATE fantasy_teams ft
       SET total_score = (
         SELECT COALESCE(SUM(
           CASE
             WHEN fp.type = 'driver' THEN COALESCE((SELECT SUM(rr.points) FROM race_results rr JOIN races r ON r.id = rr.race_id WHERE rr.driver_id = fp.driver_id AND r.season_id = ft.season_id), 0)
             ELSE 0
           END
         ), 0)
         FROM fantasy_picks fp
         WHERE fp.fantasy_team_id = ft.id AND fp.is_active = true
       )
       WHERE ft.id = $1`,
      [teamId],
    );
  }

  private mapToFantasyTeam(row: Record<string, unknown>): FantasyTeam {
    return new FantasyTeam({
      id: row.id as string,
      userId: row.user_id as string,
      seasonId: row.season_id as string,
      name: row.name as string,
      budget: parseFloat(row.budget as string),
      totalScore: parseFloat(row.total_score as string),
      createdAt: new Date(row.created_at as string),
      updatedAt: new Date(row.updated_at as string),
    });
  }

  private mapToFantasyPick(row: Record<string, unknown>): FantasyPick {
    return {
      id: row.id as string,
      fantasyTeamId: row.fantasy_team_id as string,
      driverId: row.driver_id as string | null,
      teamId: row.team_id as string | null,
      type: row.type as 'driver' | 'constructor',
      cost: parseFloat(row.cost as string),
      isActive: row.is_active as boolean,
      pickedAt: new Date(row.picked_at as string),
      transferredAt: row.transferred_at ? new Date(row.transferred_at as string) : null,
    };
  }

  private mapToFantasyTransfer(row: Record<string, unknown>): FantasyTransfer {
    return {
      id: row.id as string,
      fantasyTeamId: row.fantasy_team_id as string,
      driverOutId: row.driver_out_id as string | null,
      driverInId: row.driver_in_id as string | null,
      cost: parseFloat(row.cost as string),
      transferAt: new Date(row.transfer_at as string),
      raceId: row.race_id as string | null,
    };
  }

  private mapToDriverMarketValue(row: Record<string, unknown>): DriverMarketValue {
    return {
      id: row.id as string,
      driverId: row.driver_id as string,
      seasonId: row.season_id as string,
      currentValue: parseFloat(row.current_value as string),
      priceChange: parseFloat(row.price_change as string),
      lastUpdated: new Date(row.last_updated as string),
    };
  }
}

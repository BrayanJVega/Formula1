import { IRaceRepository } from '../../../core/repositories/IRaceRepository.js';
import { Race, RaceStatus } from '../../../core/entities/Race.js';
import { RaceWithCircuit } from '../../../core/useCases/race/RaceWithCircuit.js';
import { query, queryOne } from '../../../config/database.js';

export class RaceRepository implements IRaceRepository {
  async findById(id: string): Promise<Race | null> {
    const row = await queryOne<Record<string, unknown>>(
      'SELECT * FROM races WHERE id = $1',
      [id],
    );
    return row ? this.mapToRace(row) : null;
  }

  async findByIdWithCircuit(id: string): Promise<RaceWithCircuit | null> {
    const row = await queryOne<Record<string, unknown>>(
      `SELECT r.*, c.id AS c_id, c.name AS c_name, c.country AS c_country,
        c.city AS c_city, c.length_km AS c_length_km, c.turns AS c_turns,
        c.drs_zones AS c_drs_zones
       FROM races r
       JOIN circuits c ON r.circuit_id = c.id
       WHERE r.id = $1`,
      [id],
    );
    return row ? this.mapToRaceWithCircuit(row) : null;
  }

  async findNext(): Promise<Race | null> {
    const row = await queryOne<Record<string, unknown>>(
      `SELECT r.*, c.id AS c_id, c.name AS c_name, c.country AS c_country,
        c.city AS c_city, c.length_km AS c_length_km, c.turns AS c_turns,
        c.drs_zones AS c_drs_zones
       FROM races r
       JOIN circuits c ON r.circuit_id = c.id
       WHERE r.race_date >= NOW()
       ORDER BY r.race_date ASC
       LIMIT 1`,
      [],
    );
    return row ? this.mapToRaceWithCircuit(row) : null;
  }

  async findAllBySeason(seasonId: string): Promise<Race[]> {
    const rows = await query<Record<string, unknown>>(
      `SELECT r.*, c.id AS c_id, c.name AS c_name, c.country AS c_country,
        c.city AS c_city, c.length_km AS c_length_km, c.turns AS c_turns,
        c.drs_zones AS c_drs_zones
       FROM races r
       JOIN circuits c ON r.circuit_id = c.id
       WHERE r.season_id = $1
       ORDER BY r.round ASC`,
      [seasonId],
    );
    return rows.map(this.mapToRaceWithCircuit);
  }

  async save(race: Race): Promise<Race> {
    await query(
      `INSERT INTO races (id, season_id, circuit_id, name, round, status, date,
        qualifying_date, race_date, local_timezone, weather_forecast, laps,
        created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
      [
        race.id, race.seasonId, race.circuitId, race.name, race.round,
        race.status, race.date, race.qualifyingDate, race.raceDate,
        race.localTimezone,
        race.weatherForecast ? JSON.stringify(race.weatherForecast) : null,
        race.laps, race.createdAt, race.updatedAt,
      ],
    );
    return race;
  }

  async update(race: Race): Promise<Race> {
    await query(
      `UPDATE races SET season_id = $1, circuit_id = $2, name = $3, round = $4,
        status = $5, date = $6, qualifying_date = $7, race_date = $8,
        local_timezone = $9, weather_forecast = $10, laps = $11, updated_at = $12
       WHERE id = $13`,
      [
        race.seasonId, race.circuitId, race.name, race.round, race.status,
        race.date, race.qualifyingDate, race.raceDate, race.localTimezone,
        race.weatherForecast ? JSON.stringify(race.weatherForecast) : null,
        race.laps, race.updatedAt, race.id,
      ],
    );
    return race;
  }

  async delete(id: string): Promise<void> {
    await query('DELETE FROM races WHERE id = $1', [id]);
  }

  private mapToRace(row: Record<string, unknown>): Race {
    return new Race({
      id: row.id as string,
      seasonId: row.season_id as string,
      circuitId: row.circuit_id as string,
      name: row.name as string,
      round: row.round as number,
      status: row.status as RaceStatus,
      date: new Date(row.date as string),
      qualifyingDate: new Date(row.qualifying_date as string),
      raceDate: new Date(row.race_date as string),
      localTimezone: row.local_timezone as string,
      weatherForecast: row.weather_forecast
        ? JSON.parse(row.weather_forecast as string) as Record<string, unknown>
        : undefined,
      laps: row.laps as number,
      createdAt: new Date(row.created_at as string),
      updatedAt: new Date(row.updated_at as string),
    });
  }

  private mapToRaceWithCircuit(row: Record<string, unknown>): RaceWithCircuit {
    const base = this.mapToRace(row);
    return {
      ...base,
      circuit: {
        id: row.c_id as string,
        name: row.c_name as string,
        country: row.c_country as string,
        city: row.c_city as string,
        lengthKm: row.c_length_km as number,
        turns: row.c_turns as number,
        drsZones: row.c_drs_zones as number,
      },
    };
  }
}

import { ISimulationRepository } from '../../../core/repositories/ISimulationRepository.js';
import { SimulationResult, type SimulationType } from '../../../core/entities/Simulation.js';
import { query, queryOne } from '../../../config/database.js';

export class SimulationRepository implements ISimulationRepository {
  async save(simulation: SimulationResult): Promise<SimulationResult> {
    await query(
      `INSERT INTO simulation_history (id, user_id, race_id, type, parameters, result, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        simulation.id,
        simulation.userId ?? null,
        simulation.raceId ?? null,
        simulation.type,
        JSON.stringify(simulation.parameters),
        JSON.stringify(simulation.result),
        simulation.createdAt,
      ],
    );
    return simulation;
  }

  async findById(id: string): Promise<SimulationResult | null> {
    const row = await queryOne<Record<string, unknown>>(
      'SELECT * FROM simulation_history WHERE id = $1',
      [id],
    );
    return row ? this.mapToSimulation(row) : null;
  }

  async findByUserId(userId: string, type?: string): Promise<SimulationResult[]> {
    let sql = 'SELECT * FROM simulation_history WHERE user_id = $1';
    const params: unknown[] = [userId];

    if (type) {
      sql += ' AND type = $2';
      params.push(type);
    }

    sql += ' ORDER BY created_at DESC';

    const rows = await query<Record<string, unknown>>(sql, params);
    return rows.map(this.mapToSimulation);
  }

  private mapToSimulation(row: Record<string, unknown>): SimulationResult {
    return new SimulationResult({
      id: row.id as string,
      userId: row.user_id as string | undefined,
      raceId: row.race_id as string | undefined,
      type: row.type as SimulationType,
      parameters: JSON.parse(row.parameters as string) as Record<string, unknown>,
      result: JSON.parse(row.result as string) as Record<string, unknown>,
      createdAt: new Date(row.created_at as string),
    });
  }
}

import { ICircuitRepository } from '../../../core/repositories/ICircuitRepository.js';
import { Circuit } from '../../../core/entities/Circuit.js';
import { query, queryOne } from '../../../config/database.js';

export class CircuitRepository implements ICircuitRepository {
  async findById(id: string): Promise<Circuit | null> {
    const row = await queryOne<Record<string, unknown>>(
      'SELECT * FROM circuits WHERE id = $1',
      [id],
    );
    return row ? this.mapToCircuit(row) : null;
  }

  async findAll(): Promise<Circuit[]> {
    const rows = await query<Record<string, unknown>>(
      'SELECT * FROM circuits ORDER BY name ASC',
    );
    return rows.map(this.mapToCircuit);
  }

  async save(circuit: Circuit): Promise<Circuit> {
    await query(
      `INSERT INTO circuits (
        id, name, country, city, length_km, turns, drs_zones,
        lap_record, lap_record_time, lap_record_driver_id, lap_record_year,
        capacity, first_gp_year, circuit_map_url, image_url, description,
        altitude, is_street_circuit, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)`,
      [
        circuit.id, circuit.name, circuit.country, circuit.city,
        circuit.lengthKm, circuit.turns, circuit.drsZones,
        circuit.lapRecord ?? null, circuit.lapRecordTime ?? null,
        circuit.lapRecordDriverId ?? null, circuit.lapRecordYear ?? null,
        circuit.capacity ?? null, circuit.firstGpYear,
        circuit.circuitMapUrl ?? null, circuit.imageUrl ?? null,
        circuit.description ?? null, circuit.altitude ?? null,
        circuit.isStreetCircuit, circuit.createdAt, circuit.updatedAt,
      ],
    );
    return circuit;
  }

  async update(circuit: Circuit): Promise<Circuit> {
    await query(
      `UPDATE circuits SET
        name = $1, country = $2, city = $3, length_km = $4, turns = $5,
        drs_zones = $6, lap_record = $7, lap_record_time = $8,
        lap_record_driver_id = $9, lap_record_year = $10, capacity = $11,
        first_gp_year = $12, circuit_map_url = $13, image_url = $14,
        description = $15, altitude = $16, is_street_circuit = $17,
        updated_at = $18
      WHERE id = $19`,
      [
        circuit.name, circuit.country, circuit.city,
        circuit.lengthKm, circuit.turns, circuit.drsZones,
        circuit.lapRecord ?? null, circuit.lapRecordTime ?? null,
        circuit.lapRecordDriverId ?? null, circuit.lapRecordYear ?? null,
        circuit.capacity ?? null, circuit.firstGpYear,
        circuit.circuitMapUrl ?? null, circuit.imageUrl ?? null,
        circuit.description ?? null, circuit.altitude ?? null,
        circuit.isStreetCircuit, circuit.updatedAt, circuit.id,
      ],
    );
    return circuit;
  }

  async delete(id: string): Promise<void> {
    await query('DELETE FROM circuits WHERE id = $1', [id]);
  }

  private mapToCircuit(row: Record<string, unknown>): Circuit {
    return new Circuit({
      id: row.id as string,
      name: row.name as string,
      country: row.country as string,
      city: row.city as string,
      lengthKm: row.length_km as number,
      turns: row.turns as number,
      drsZones: row.drs_zones as number,
      lapRecord: row.lap_record as string | undefined,
      lapRecordTime: row.lap_record_time as number | undefined,
      lapRecordDriverId: row.lap_record_driver_id as string | undefined,
      lapRecordYear: row.lap_record_year as number | undefined,
      capacity: row.capacity as number | undefined,
      firstGpYear: row.first_gp_year as number,
      circuitMapUrl: row.circuit_map_url as string | undefined,
      imageUrl: row.image_url as string | undefined,
      description: row.description as string | undefined,
      altitude: row.altitude as number | undefined,
      isStreetCircuit: row.is_street_circuit as boolean,
      createdAt: new Date(row.created_at as string),
      updatedAt: new Date(row.updated_at as string),
    });
  }
}

import { IDriverRepository } from '../../../core/repositories/IDriverRepository.js';
import { Driver } from '../../../core/entities/Driver.js';
import { query, queryOne } from '../../../config/database.js';

interface FindAllOptions {
  teamId?: string;
  nationality?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

interface PaginatedResult {
  drivers: Driver[];
  total: number;
}

export class DriverRepository implements IDriverRepository {
  async findById(id: string): Promise<Driver | null> {
    const row = await queryOne<Record<string, unknown>>(
      'SELECT * FROM drivers WHERE id = $1',
      [id],
    );
    return row ? this.mapToDriver(row) : null;
  }

  async findAll(options?: { teamId?: string; nationality?: string; isActive?: boolean }): Promise<Driver[]> {
    const conditions: string[] = [];
    const params: unknown[] = [];
    let paramIndex = 1;

    if (options?.teamId) {
      conditions.push(`team_id = $${paramIndex++}`);
      params.push(options.teamId);
    }
    if (options?.nationality) {
      conditions.push(`nationality = $${paramIndex++}`);
      params.push(options.nationality);
    }
    if (options?.isActive !== undefined) {
      conditions.push(`is_active = $${paramIndex++}`);
      params.push(options.isActive);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const rows = await query<Record<string, unknown>>(
      `SELECT * FROM drivers ${whereClause} ORDER BY number ASC`,
      params,
    );
    return rows.map(this.mapToDriver);
  }

  async findAllPaginated(options?: FindAllOptions): Promise<PaginatedResult> {
    const conditions: string[] = [];
    const params: unknown[] = [];
    let paramIndex = 1;

    if (options?.teamId) {
      conditions.push(`team_id = $${paramIndex++}`);
      params.push(options.teamId);
    }
    if (options?.nationality) {
      conditions.push(`nationality = $${paramIndex++}`);
      params.push(options.nationality);
    }
    if (options?.isActive !== undefined) {
      conditions.push(`is_active = $${paramIndex++}`);
      params.push(options.isActive);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const totalResult = await queryOne<{ count: string }>(
      `SELECT COUNT(*) as count FROM drivers ${whereClause}`,
      params,
    );
    const total = parseInt(totalResult?.count ?? '0', 10);

    const page = options?.page ?? 1;
    const limit = options?.limit ?? 20;
    const offset = (page - 1) * limit;

    const allParams = [...params, limit, offset];
    const rows = await query<Record<string, unknown>>(
      `SELECT * FROM drivers ${whereClause} ORDER BY number ASC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`,
      allParams,
    );

    return { drivers: rows.map(this.mapToDriver), total };
  }

  async save(driver: Driver): Promise<Driver> {
    const row = await queryOne<Record<string, unknown>>(
      `INSERT INTO drivers (id, name, number, nationality, date_of_birth, team_id, photo_url, biography, is_active, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [
        driver.id, driver.name, driver.number, driver.nationality, driver.dateOfBirth,
        driver.teamId, driver.photoUrl ?? null, driver.biography ?? null,
        driver.isActive, driver.createdAt, driver.updatedAt,
      ],
    );
    return this.mapToDriver(row!);
  }

  async update(driver: Driver): Promise<Driver> {
    const row = await queryOne<Record<string, unknown>>(
      `UPDATE drivers SET name = $1, number = $2, nationality = $3, date_of_birth = $4,
        team_id = $5, photo_url = $6, biography = $7, is_active = $8, updated_at = $9
       WHERE id = $10
       RETURNING *`,
      [
        driver.name, driver.number, driver.nationality, driver.dateOfBirth,
        driver.teamId, driver.photoUrl ?? null, driver.biography ?? null,
        driver.isActive, driver.updatedAt, driver.id,
      ],
    );
    return this.mapToDriver(row!);
  }

  async delete(id: string): Promise<void> {
    await query('DELETE FROM drivers WHERE id = $1', [id]);
  }

  private mapToDriver(row: Record<string, unknown>): Driver {
    return new Driver({
      id: row.id as string,
      name: row.name as string,
      number: row.number as number,
      nationality: row.nationality as string,
      dateOfBirth: new Date(row.date_of_birth as string),
      teamId: row.team_id as string,
      photoUrl: row.photo_url as string | undefined,
      biography: row.biography as string | undefined,
      isActive: row.is_active as boolean,
      createdAt: new Date(row.created_at as string),
      updatedAt: new Date(row.updated_at as string),
    });
  }
}

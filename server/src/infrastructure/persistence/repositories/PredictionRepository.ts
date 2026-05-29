import { IPredictionRepository } from '../../../core/repositories/IPredictionRepository.js';
import { Prediction, PredictionType } from '../../../core/entities/Prediction.js';
import { query, queryOne } from '../../../config/database.js';

export class PredictionRepository implements IPredictionRepository {
  async findById(id: string): Promise<Prediction | null> {
    const row = await queryOne<Record<string, unknown>>(
      'SELECT * FROM predictions WHERE id = $1',
      [id],
    );
    return row ? this.mapToPrediction(row) : null;
  }

  async findByUserAndRace(userId: string, raceId: string): Promise<Prediction | null> {
    const row = await queryOne<Record<string, unknown>>(
      'SELECT * FROM predictions WHERE user_id = $1 AND race_id = $2',
      [userId, raceId],
    );
    return row ? this.mapToPrediction(row) : null;
  }

  async findByRace(raceId: string): Promise<Prediction[]> {
    const rows = await query<Record<string, unknown>>(
      'SELECT * FROM predictions WHERE race_id = $1 ORDER BY created_at DESC',
      [raceId],
    );
    return rows.map((row) => this.mapToPrediction(row));
  }

  async findByUser(
    userId: string,
    options?: { page?: number; limit?: number },
  ): Promise<{ predictions: Prediction[]; total: number }> {
    const page = options?.page ?? 1;
    const limit = options?.limit ?? 20;
    const offset = (page - 1) * limit;

    const countResult = await queryOne<{ count: string }>(
      'SELECT COUNT(*) as count FROM predictions WHERE user_id = $1',
      [userId],
    );
    const total = countResult ? parseInt(countResult.count, 10) : 0;

    const rows = await query<Record<string, unknown>>(
      'SELECT * FROM predictions WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
      [userId, limit, offset],
    );

    return {
      predictions: rows.map((row) => this.mapToPrediction(row)),
      total,
    };
  }

  async save(prediction: Prediction): Promise<Prediction> {
    const row = await queryOne<Record<string, unknown>>(
      `INSERT INTO predictions (
        id, user_id, race_id, type,
        pole_prediction, top3_prediction, top10_prediction,
        winner_prediction, podium_prediction, fastest_lap_prediction,
        safety_car_prediction, red_flag_prediction, dnfs_prediction,
        submitted_at, is_locked, total_score, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
      ON CONFLICT (user_id, race_id, type) DO UPDATE SET
        pole_prediction = EXCLUDED.pole_prediction,
        top3_prediction = EXCLUDED.top3_prediction,
        top10_prediction = EXCLUDED.top10_prediction,
        winner_prediction = EXCLUDED.winner_prediction,
        podium_prediction = EXCLUDED.podium_prediction,
        fastest_lap_prediction = EXCLUDED.fastest_lap_prediction,
        safety_car_prediction = EXCLUDED.safety_car_prediction,
        red_flag_prediction = EXCLUDED.red_flag_prediction,
        dnfs_prediction = EXCLUDED.dnfs_prediction,
        submitted_at = EXCLUDED.submitted_at,
        is_locked = EXCLUDED.is_locked,
        total_score = EXCLUDED.total_score,
        updated_at = NOW()
      RETURNING *`,
      [
        prediction.id,
        prediction.userId,
        prediction.raceId,
        prediction.type,
        prediction.polePrediction ?? null,
        prediction.top3Prediction ?? null,
        prediction.top10Prediction ?? null,
        prediction.winnerPrediction ?? null,
        prediction.podiumPrediction ?? null,
        prediction.fastestLapPrediction ?? null,
        prediction.safetyCarPrediction ?? null,
        prediction.redFlagPrediction ?? null,
        prediction.dnfsPrediction ?? null,
        prediction.submittedAt,
        prediction.isLocked,
        prediction.totalScore,
        prediction.createdAt,
        prediction.updatedAt,
      ],
    );
    return row ? this.mapToPrediction(row) : prediction;
  }

  async update(prediction: Prediction): Promise<Prediction> {
    const row = await queryOne<Record<string, unknown>>(
      `UPDATE predictions SET
        pole_prediction = $1,
        top3_prediction = $2,
        top10_prediction = $3,
        winner_prediction = $4,
        podium_prediction = $5,
        fastest_lap_prediction = $6,
        safety_car_prediction = $7,
        red_flag_prediction = $8,
        dnfs_prediction = $9,
        is_locked = $10,
        total_score = $11,
        updated_at = NOW()
      WHERE id = $12
      RETURNING *`,
      [
        prediction.polePrediction ?? null,
        prediction.top3Prediction ?? null,
        prediction.top10Prediction ?? null,
        prediction.winnerPrediction ?? null,
        prediction.podiumPrediction ?? null,
        prediction.fastestLapPrediction ?? null,
        prediction.safetyCarPrediction ?? null,
        prediction.redFlagPrediction ?? null,
        prediction.dnfsPrediction ?? null,
        prediction.isLocked,
        prediction.totalScore,
        prediction.id,
      ],
    );
    return row ? this.mapToPrediction(row) : prediction;
  }

  async delete(id: string): Promise<void> {
    await query('DELETE FROM predictions WHERE id = $1', [id]);
  }

  private mapToPrediction(row: Record<string, unknown>): Prediction {
    return new Prediction({
      id: row.id as string,
      userId: row.user_id as string,
      raceId: row.race_id as string,
      type: row.type as PredictionType,
      polePrediction: row.pole_prediction as string | undefined,
      top3Prediction: row.top3_prediction ? this.mapArrayField(row.top3_prediction) : undefined,
      top10Prediction: row.top10_prediction ? this.mapArrayField(row.top10_prediction) : undefined,
      winnerPrediction: row.winner_prediction as string | undefined,
      podiumPrediction: row.podium_prediction ? this.mapArrayField(row.podium_prediction) : undefined,
      fastestLapPrediction: row.fastest_lap_prediction as string | undefined,
      safetyCarPrediction: row.safety_car_prediction as boolean | undefined,
      redFlagPrediction: row.red_flag_prediction as boolean | undefined,
      dnfsPrediction: row.dnfs_prediction as number | undefined,
      submittedAt: new Date(row.submitted_at as string),
      isLocked: row.is_locked as boolean,
      totalScore: parseFloat(row.total_score as string) || 0,
      createdAt: new Date(row.created_at as string),
      updatedAt: new Date(row.updated_at as string),
    });
  }

  private mapArrayField(value: unknown): string[] {
    if (Array.isArray(value)) {
      return value.map((v) => String(v));
    }
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed.map(String) : [];
      } catch {
        return value.replace(/[{}"]/g, '').split(',').filter(Boolean);
      }
    }
    return [];
  }
}

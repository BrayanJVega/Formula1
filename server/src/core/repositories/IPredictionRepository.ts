import { Prediction } from '../entities/Prediction.js';

export interface IPredictionRepository {
  findById(id: string): Promise<Prediction | null>;
  findByUserAndRace(userId: string, raceId: string): Promise<Prediction | null>;
  findByRace(raceId: string): Promise<Prediction[]>;
  findByUser(userId: string, options?: { page?: number; limit?: number }): Promise<{ predictions: Prediction[]; total: number }>;
  save(prediction: Prediction): Promise<Prediction>;
  update(prediction: Prediction): Promise<Prediction>;
  delete(id: string): Promise<void>;
}

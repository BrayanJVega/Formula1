import { IPredictionRepository } from '../../repositories/IPredictionRepository.js';
import { Prediction } from '../../entities/Prediction.js';
import { NotFoundError } from '../../../shared/errors/NotFoundError.js';

export class GetPredictionUseCase {
  constructor(
    private readonly predictionRepository: IPredictionRepository,
  ) {}

  async executeById(id: string): Promise<Prediction> {
    const prediction = await this.predictionRepository.findById(id);
    if (!prediction) {
      throw new NotFoundError(`Prediction with id ${id} not found`);
    }
    return prediction;
  }

  async executeByUserAndRace(userId: string, raceId: string): Promise<Prediction | null> {
    return this.predictionRepository.findByUserAndRace(userId, raceId);
  }
}
